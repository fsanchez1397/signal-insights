
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { JobStatus, Prisma } from "@prisma/client";

import { db } from "@/server/db";

const updateJobSchema = z
	.object({
		title: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
		status: z.nativeEnum(JobStatus).optional(),
		clientId: z.string().nullable().optional(),
	})
	.strict();

export async function GET(
	request: NextRequest,
	{ params }: { params: { jobId: string } },
) {
	const job = await db.job.findUnique({
		where: { id: params.jobId },
		include: {
			user: {
				select: { id: true, first_name: true, last_name: true, email: true },
			},
			client: { select: { id: true, name: true } },
			_count: { select: { candidates: true } },
		},
	});

	if (!job) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const { user, ...rest } = job;
	return NextResponse.json({ ...rest, recruiter: user });
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { jobId: string } },
) {
	try {
		const json = await request.json();
		const parsed = updateJobSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const job = await db.job.findUnique({ where: { id: params.jobId } });
		if (!job) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const data: Prisma.JobUpdateInput = {};
		const { title, description, status, clientId } = parsed.data;
		if (title !== undefined) data.title = title;
		if (description !== undefined) data.description = description;
		if (status !== undefined) data.status = status;

		if (clientId !== undefined) {
			if (clientId === null) {
				data.client = { disconnect: true };
			} else {
				const client = await db.client.findUnique({ where: { id: clientId } });
				if (!client) {
					return NextResponse.json(
						{ error: "Client not found" },
						{ status: 404 },
					);
				}
				data.client = { connect: { id: clientId } };
			}
		}

		const updated = await db.job.update({
			where: { id: params.jobId },
			data,
			include: {
				user: {
					select: { id: true, first_name: true, last_name: true, email: true },
				},
				client: { select: { id: true, name: true } },
				_count: { select: { candidates: true } },
			},
		});

		const { user, ...rest } = updated;
		return NextResponse.json({ ...rest, recruiter: user });
	} catch (error) {
		console.error("Update job failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
