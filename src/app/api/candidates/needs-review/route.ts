import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { db } from "@/server/db";

// Surfaces candidates whose AI outputs require human attention.
export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const params = {
		recruiterId: url.searchParams.get("recruiterId"),
		minConfidence: url.searchParams.get("minConfidence") ?? undefined,
		limit: url.searchParams.get("limit") ?? undefined,
	};

	const schema = z.object({
		recruiterId: z.string().min(1, "recruiterId is required"),
		minConfidence: z.coerce.number().min(0).max(1).optional(),
		limit: z.coerce.number().int().min(1).max(200).optional(),
	});

	const parsed = schema.safeParse(params);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid filters", details: parsed.error.format() },
			{ status: 400 },
		);
	}

	const { recruiterId, minConfidence, limit } = parsed.data;
	const settings = await db.settings.findUnique({
		where: { recruiter_id: recruiterId },
		select: { ai_confidence_threshold: true },
	});

	const threshold =
		minConfidence ?? settings?.ai_confidence_threshold ?? 0.7;

	const candidates = await db.candidate.findMany({
		where: {
			job: { recruiter_id: recruiterId },
			OR: [
				{ ai_needs_review: true },
				{ ai_confidence: { lt: threshold } },
			],
		},
		include: {
			job: { select: { id: true, title: true } },
		},
		orderBy: { updated_at: "desc" },
		take: limit ?? 25,
	});

	return NextResponse.json({ threshold, candidates });
}

