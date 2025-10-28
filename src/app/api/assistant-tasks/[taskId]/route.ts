
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { TaskStatus, Prisma } from "@prisma/client";

import { db } from "@/server/db";

const updateSchema = z
	.object({
		status: z.nativeEnum(TaskStatus).optional(),
		needsApproval: z.boolean().optional(),
		proposedTime: z.string().datetime().nullable().optional(),
	})
	.strict();

export async function GET(
	request: NextRequest,
	{ params }: { params: { taskId: string } },
) {
	const task = await db.assistantTask.findUnique({
		where: { id: params.taskId },
		include: {
			candidate: { select: { id: true, name: true, email: true } },
			job: { select: { id: true, title: true } },
			recruiter: {
				select: { id: true, first_name: true, last_name: true, email: true },
			},
		},
	});

	if (!task) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json(task);
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { taskId: string } },
) {
	try {
		const json = await request.json();
		const parsed = updateSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const existing = await db.assistantTask.findUnique({
			where: { id: params.taskId },
		});
		if (!existing) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const data: Prisma.AssistantTaskUpdateInput = {};
		const { status, needsApproval, proposedTime } = parsed.data;
		if (status !== undefined) data.status = status;
		if (needsApproval !== undefined) data.needs_approval = needsApproval;
		if (proposedTime !== undefined) {
			data.proposed_time = proposedTime ? new Date(proposedTime) : null;
		}

		const updated = await db.assistantTask.update({
			where: { id: params.taskId },
			data,
		});

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Update assistant task failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
