
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { JobStatus, Prisma } from "@prisma/client";

import { db } from "@/server/db";

const listJobsSchema = z.object({
	recruiterId: z.string().optional(),
	status: z.nativeEnum(JobStatus).optional(),
	clientId: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(200).optional(),
});

const createJobSchema = z.object({
	recruiterId: z.string().min(1, "recruiterId is required"),
	slug: z
		.string()
		.min(1, "slug is required")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"slug must be lowercase letters, numbers, and hyphens",
		),
	title: z.string().min(1, "title is required"),
	description: z.string().min(1, "description is required"),
	status: z.nativeEnum(JobStatus).optional(),
	clientId: z.string().optional(),
});

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const params = {
		recruiterId: url.searchParams.get("recruiterId") ?? undefined,
		status: url.searchParams.get("status") ?? undefined,
		clientId: url.searchParams.get("clientId") ?? undefined,
		limit: url.searchParams.get("limit") ?? undefined,
	};

	const parsed = listJobsSchema.safeParse(params);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid filters", details: parsed.error.format() },
			{ status: 400 },
		);
	}

	const { recruiterId, status, clientId, limit } = parsed.data;

	const where: Prisma.JobWhereInput = {};
	if (recruiterId) where.recruiter_id = recruiterId;
	if (status) where.status = status;
	if (clientId) where.client_id = clientId;

	const jobs = await db.job.findMany({
		where,
		orderBy: { createdAt: "desc" },
		take: limit ?? 50,
		include: {
			user: {
				select: { id: true, first_name: true, last_name: true, email: true },
			},
			client: { select: { id: true, name: true } },
			_count: { select: { candidates: true } },
		},
	});

	const hydrated = jobs.map(({ user, ...rest }) => ({
		...rest,
		recruiter: user,
	}));

	return NextResponse.json(hydrated);
}

export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const parsed = createJobSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const { recruiterId, slug, title, description, status, clientId } =
			parsed.data;

		const recruiter = await db.user.findUnique({ where: { id: recruiterId } });
		if (!recruiter) {
			return NextResponse.json(
				{ error: "Recruiter not found" },
				{ status: 404 },
			);
		}

		const existingSlug = await db.job.findUnique({ where: { slug } });
		if (existingSlug) {
			return NextResponse.json(
				{ error: "Job slug already exists" },
				{ status: 409 },
			);
		}

		if (clientId) {
			const client = await db.client.findUnique({ where: { id: clientId } });
			if (!client) {
				return NextResponse.json(
					{ error: "Client not found" },
					{ status: 404 },
				);
			}
		}

		const job = await db.job.create({
			data: {
				slug,
				title,
				description,
				status: status ?? undefined,
				user: { connect: { id: recruiterId } },
				...(clientId ? { client: { connect: { id: clientId } } } : {}),
			},
			include: {
				user: {
					select: {
						id: true,
						first_name: true,
						last_name: true,
						email: true,
					},
				},
				client: { select: { id: true, name: true } },
			},
		});

		const { user, ...rest } = job;
		return NextResponse.json({ ...rest, recruiter: user }, { status: 201 });
	} catch (error) {
		console.error("Create job failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
