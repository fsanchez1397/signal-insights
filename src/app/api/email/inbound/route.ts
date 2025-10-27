import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
	CandidateStatus,
	InteractionSource,
	InteractionType,
	Sources,
	TaskAction,
	TaskStatus,
} from "@prisma/client";

import { db } from "@/server/db";

// Simple matcher that respects exact emails and domain wildcards ("@company.com").
const senderAllowed = (sender: string, allowed: string[]) => {
	if (allowed.length === 0) return true;
	const normalized = sender.toLowerCase();
	return allowed.some((entry) => {
		const match = entry.toLowerCase();
		return (
			normalized === match ||
			(match.startsWith("@") && normalized.endsWith(match))
		);
	});
};

// Describes the payload we expect from the email ingestion webhook or polling job.
const inboundSchema = z.object({
	recruiterId: z.string().min(1),
	jobId: z.string().optional(),
	messageId: z.string().min(1),
	sender: z.string().email(),
	subject: z.string().optional(),
	body: z.string().min(1),
	candidateEmail: z.string().email().optional(),
	candidateName: z.string().optional(),
	source: z.nativeEnum(InteractionSource).default(InteractionSource.gmail),
	confidenceScore: z.number().min(0).max(1).optional(),
	autoReachOutAllowed: z.boolean().optional(),
});

// Entry point for inbound mail events sent by the email connector.
export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const parsed = inboundSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const payload = parsed.data;
		const settings = await db.settings.findUnique({
			where: { recruiter_id: payload.recruiterId },
		});

		if (settings && !senderAllowed(payload.sender, settings.allowed_senders)) {
			// Ignore the message but return 202 so the email provider stops retrying.
			return NextResponse.json({ ignored: true }, { status: 202 });
		}

		const autoThreshold = settings?.ai_confidence_threshold ?? 0.7;
		const autoSendEnabled =
			payload.autoReachOutAllowed ?? settings?.auto_send_followups ?? false;
		const confidence = payload.confidenceScore ?? 0.5;
		const needsReview = confidence < autoThreshold;

		let candidate = await db.candidate.findFirst({
			where: {
				email: payload.candidateEmail,
				job: { recruiter_id: payload.recruiterId },
				...(payload.jobId ? { job_id: payload.jobId } : {}),
			},
		});

		if (!candidate && payload.jobId && payload.candidateEmail) {
			// Auto-create a candidate when the recruiter enabled auto reach outs.
			candidate = await db.candidate.create({
				data: {
					job_id: payload.jobId,
					name: payload.candidateName ?? payload.candidateEmail,
					email: payload.candidateEmail,
					source: Sources.email,
					status: CandidateStatus.awaiting_reply,
				},
			});
		}

		if (!candidate) {
			return NextResponse.json(
				{ error: "Candidate not found" },
				{ status: 404 },
			);
		}

		// Record the raw email as an interaction for auditing and analytics.
		await db.interaction.create({
			data: {
				candidate_id: candidate.id,
				user_id: payload.recruiterId,
				source: payload.source,
				type: InteractionType.email,
				payload: {
					messageId: payload.messageId,
					sender: payload.sender,
					subject: payload.subject,
					body: payload.body,
				},
			},
		});

		// Update the candidate's AI insight metadata based on this message.
		await db.candidate.update({
			where: { id: candidate.id },
			data: {
				ai_confidence: confidence,
				ai_needs_review: needsReview,
				last_ai_updated_at: new Date(),
			},
		});

		// Persist a note the assistant can expand upon in the UI.
		await db.note.create({
			data: {
				candidate_id: candidate.id,
				author_id: payload.recruiterId,
				content: payload.body,
				is_private: true,
				ai_generated: true,
				ai_confidence: confidence,
				needs_review: needsReview,
			},
		});

		// Queue an assistant task so automated outreach or approvals remain tracked.
		await db.assistantTask.create({
			data: {
				recruiter_id: payload.recruiterId,
				job_id: candidate.job_id,
				candidate_id: candidate.id,
				action: TaskAction.send_followup,
				status: autoSendEnabled && !needsReview
					? TaskStatus.approved
					: TaskStatus.pending,
				needs_approval: !(autoSendEnabled && !needsReview),
			},
		});

		return NextResponse.json({
			candidateId: candidate.id,
			confidence,
			needsReview,
			autoSendEnabled: autoSendEnabled && !needsReview,
		});
	} catch (error) {
		console.error("Inbound email handling failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

