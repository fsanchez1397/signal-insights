import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { CandidateStatus, Prisma, Sources } from "@prisma/client";

import { db } from "@/server/db";

// Shared schema for updating a candidate; all fields optional to support PATCH semantics.
const candidateUpdateSchema = z
	.object({
		name: z.string().min(1).optional(),
		email: z.string().email().optional(),
		source: z.nativeEnum(Sources).optional(),
		status: z.nativeEnum(CandidateStatus).optional(),
		aiSummary: z.string().optional(),
		aiStrengths: z.string().optional(),
		aiWeaknesses: z.string().optional(),
		aiTags: z.array(z.string()).optional(),
		aiConfidence: z.number().min(0).max(1).optional(),
		aiNeedsReview: z.boolean().optional(),
		lastAiUpdatedAt: z.string().datetime().optional(),
	})
	.strict();

// Converts an update payload into Prisma's expected field names.
const mapUpdatePayload = (
	input: z.infer<typeof candidateUpdateSchema>,
) => {
	const data: Prisma.CandidateUpdateInput = {};
	if (input.name !== undefined) data.name = input.name;
	if (input.email !== undefined) data.email = input.email;
	if (input.source !== undefined) data.source = input.source;
	if (input.status !== undefined) data.status = input.status;
	if (input.aiSummary !== undefined) data.ai_summary = input.aiSummary;
	if (input.aiStrengths !== undefined) data.ai_strengths = input.aiStrengths;
	if (input.aiWeaknesses !== undefined) data.ai_weaknesses = input.aiWeaknesses;
	if (input.aiTags !== undefined) data.ai_tags = input.aiTags;
	if (input.aiConfidence !== undefined)
		data.ai_confidence = input.aiConfidence;
	if (input.aiNeedsReview !== undefined)
		data.ai_needs_review = input.aiNeedsReview;
	if (input.lastAiUpdatedAt !== undefined)
		data.last_ai_updated_at = new Date(input.lastAiUpdatedAt);
	return data;
};

// Fetches a single candidate by ID, returning 404 when missing.
export async function GET(
	request: NextRequest,
	{ params }: { params: { candidateId: string } },
) {
	const candidate = await db.candidate.findUnique({
		where: { id: params.candidateId },
	});

	if (!candidate) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json(candidate);
}

// Applies partial updates to a candidate record.
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { candidateId: string } },
) {
	try {
		const json = await request.json();
		const parsed = candidateUpdateSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const updated = await db.candidate.update({
			where: { id: params.candidateId },
			data: mapUpdatePayload(parsed.data),
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Update candidate failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

// Deletes a candidate (useful for cleaning test data in early MVP).
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { candidateId: string } },
) {
	try {
		await db.candidate.delete({ where: { id: params.candidateId } });
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Delete candidate failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

