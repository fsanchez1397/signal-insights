
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { TaskStatus, Prisma } from "@prisma/client";

import { db } from "@/server/db";

const listSchema = z.object({
	recruiterId: z.string().min(1, "recruiterId is required"),
	status: z.nativeEnum(TaskStatus).optional(),
	jobId: z.string().optional(),
	candidateId: z.string().optional(),
	needsApproval: z.enum(["true", "false"]).optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
});

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const params = {
		recruiterId: url.searchParams.get("recruiterId") ?? undefined,
		status: url.searchParams.get("status") ?? undefined,
		jobId: url.searchParams.get("jobId") ?? undefined,
		candidateId: url.searchParams.get("candidateId") ?? undefined,
		needsApproval: url.searchParams.get("needsApproval") ?? undefined,
		limit: url.searchParams.get("limit") ?? undefined,
	};

	const parsed = listSchema.safeParse(params);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid filters", details: parsed.error.format() },
			{ status: 400 },
		);
	}

	const { recruiterId, status, jobId, candidateId, needsApproval, limit } =
		parsed.data;

	const where: Prisma.AssistantTaskWhereInput = {
		recruiter_id: recruiterId,
	};

	if (status) where.status = status;
	if (jobId) where.job_id = jobId;
	if (candidateId) where.candidate_id = candidateId;
	if (needsApproval)
		where.needs_approval = needsApproval === "true" ? true : false;

	const tasks = await db.assistantTask.findMany({
		where,
		orderBy: { createdAt: "desc" },
		take: limit ?? 50,
		include: {
			candidate: { select: { id: true, name: true, email: true } },
			job: { select: { id: true, title: true } },
			recruiter: {
				select: { id: true, first_name: true, last_name: true, email: true },
			},
		},
	});

	return NextResponse.json(tasks);
}
