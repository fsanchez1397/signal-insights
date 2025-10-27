import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { db } from "@/server/db";

// Fetches the recruiter-specific email automation configuration.
export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const recruiterId = url.searchParams.get("recruiterId");

	if (!recruiterId) {
		return NextResponse.json(
			{ error: "recruiterId query param is required" },
			{ status: 400 },
		);
	}

	const settings = await db.settings.findUnique({
		where: { recruiter_id: recruiterId },
	});

	return NextResponse.json(
		settings ?? {
			recruiter_id: recruiterId,
			auto_send_followups: false,
			allowed_labels: null,
			allowed_senders: [],
			ai_confidence_threshold: null,
		},
	);
}

// Updates the email automation preferences, upserting settings on first call.
export async function POST(req: NextRequest) {
	const schema = z.object({
		recruiterId: z.string().min(1),
		allowedSenders: z.array(z.string()).optional(),
		autoSendFollowups: z.boolean().optional(),
		aiConfidenceThreshold: z.number().min(0).max(1).optional(),
	});

	try {
		const json = await req.json();
		const parsed = schema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const updateData: Record<string, unknown> = {};
		if (parsed.data.allowedSenders !== undefined) {
			updateData.allowed_senders = parsed.data.allowedSenders;
		}
		if (parsed.data.autoSendFollowups !== undefined) {
			updateData.auto_send_followups = parsed.data.autoSendFollowups;
		}
		if (parsed.data.aiConfidenceThreshold !== undefined) {
			updateData.ai_confidence_threshold = parsed.data.aiConfidenceThreshold;
		}

		const settings = await db.settings.upsert({
			where: { recruiter_id: parsed.data.recruiterId },
			update: updateData,
			create: {
				recruiter_id: parsed.data.recruiterId,
				allowed_senders: parsed.data.allowedSenders ?? [],
				auto_send_followups: parsed.data.autoSendFollowups ?? false,
				ai_confidence_threshold: parsed.data.aiConfidenceThreshold,
			},
		});

		return NextResponse.json(settings);
	} catch (error) {
		console.error("Update email settings failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
