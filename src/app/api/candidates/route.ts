import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { CandidateStatus, Sources, Prisma } from "@prisma/client";

import { db } from "@/server/db";

// Schema that validates creation payloads while keeping snake_case concerns internal.
const candidateCreateSchema = z.object({
	id: z.string().min(1, "ID is required"),
	name: z.string().min(1, "name is required"),
	email: z.email().optional(),
	source: z.enum(Sources).default(Sources.email),
	status: z.enum(CandidateStatus).optional(),
	aiSummary: z.string().optional(),
	aiStrengths: z.string().optional(),
	aiWeaknesses: z.string().optional(),
	aiTags: z.array(z.string()).optional(),
	aiConfidence: z.number().min(0).max(1).optional(),
	aiNeedsReview: z.boolean().optional(),
	lastAiUpdatedAt: z.iso.datetime().optional(),
	jobId: z.string().min(1, "jobId is required"),
});

// Helper to convert camelCase payload keys into the Prisma schema field names.
const mapCreatePayload = (input: z.infer<typeof candidateCreateSchema>) => {
	return {
		id: input.id,
		name: input.name,
		email: input.email,
		source: input.source,
		status: input.status,
		ai_summary: input.aiSummary,
		ai_strengths: input.aiStrengths,
		ai_weaknesses: input.aiWeaknesses,
		ai_tags: input.aiTags,
		ai_confidence: input.aiConfidence,
		ai_needs_review: input.aiNeedsReview,
		last_ai_updated_at: input.lastAiUpdatedAt
			? new Date(input.lastAiUpdatedAt)
			: undefined,
		job: {
			connect: {
				id: input.jobId,
			},
		},
	} satisfies Prisma.CandidateCreateInput;
};

// Handles listing candidates with optional search filters.
export async function GET(req: NextRequest) {
	console.log(req.url)
	const url = new URL(req.url);
	const filters = {
		q: url.searchParams.get("q") ?? undefined,
		jobId: url.searchParams.get("jobId") ?? undefined,
		status: url.searchParams.get("status") ?? undefined,
		needsReview: url.searchParams.get("needsReview") ?? undefined,
		limit: url.searchParams.get("limit") ?? undefined,
	};

	const filterSchema = z.object({
		q: z.string().optional(),
		jobId: z.string().optional(),
		status: z.enum(CandidateStatus).optional(),
		needsReview: z.enum(["true", "false"]).optional(),
		limit: z.coerce.number().int().min(1).max(200).optional(),
	});

	const parsedFilters = filterSchema.safeParse(filters);
	if (!parsedFilters.success) {
		return NextResponse.json(
			{ error: "Invalid filters", details: parsedFilters.error.format() },
			{ status: 400 },
		);
	}

	const where: Prisma.CandidateWhereInput = {};
	const { q, jobId, status, needsReview, limit } = parsedFilters.data;

	if (q) {
		where.OR = [
			{ name: { contains: q, mode: "insensitive" } },
			{ email: { contains: q, mode: "insensitive" } },
		];
	}

	if (jobId) {
		where.job_id = jobId;
	}

	if (status) {
		where.status = status;
	}

	if (needsReview === "true") {
		where.ai_needs_review = true;
	}

	const candidates = await db.candidate.findMany({
		where,
		orderBy: { updated_at: "desc" },
		take: limit ?? 50,
	});

	return NextResponse.json(candidates);
}

// Persists a new candidate record for the recruiter workflow.
export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const parsed = candidateCreateSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const created = await db.candidate.create({
			data: mapCreatePayload(parsed.data),
		});

		return NextResponse.json(created, { status: 201 });
	} catch (error) {
		console.error("Create candidate failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

