import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { InteractionSource, InteractionType, Prisma } from "@prisma/client";

import { db } from "@/server/db";

// Payload contract for recording a new interaction.
const interactionSchema = z.object({
	candidateId: z.string().min(1),
	userId: z.string().optional(),
	source: z.nativeEnum(InteractionSource).default(InteractionSource.manual),
	type: z.nativeEnum(InteractionType).default(InteractionType.other),
	occurredAt: z.string().datetime().optional(),
	payload: z.record(z.string(), z.any()).optional(),
});

// Returns the most recent interactions filtered by candidate or user.
export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const params = {
		candidateId: url.searchParams.get("candidateId") ?? undefined,
		userId: url.searchParams.get("userId") ?? undefined,
		limit: url.searchParams.get("limit") ?? undefined,
	};

	const filterSchema = z.object({
		candidateId: z.string().optional(),
		userId: z.string().optional(),
		limit: z.coerce.number().int().min(1).max(200).optional(),
	});

	const parsed = filterSchema.safeParse(params);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid filters", details: parsed.error.format() },
			{ status: 400 },
		);
	}

	const where: Prisma.InteractionWhereInput = {};
	const { candidateId, userId, limit } = parsed.data;

	if (candidateId) where.candidate_id = candidateId;
	if (userId) where.user_id = userId;

	const interactions = await db.interaction.findMany({
		where,
		orderBy: { occurredAt: "desc" },
		take: limit ?? 50,
	});

	return NextResponse.json(interactions);
}

// Stores a new interaction so downstream AI can reason over recruiter activity.
export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const parsed = interactionSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const interaction = await db.interaction.create({
			data: {
				candidate_id: parsed.data.candidateId,
				user_id: parsed.data.userId,
				source: parsed.data.source,
				type: parsed.data.type,
				occurredAt: parsed.data.occurredAt
					? new Date(parsed.data.occurredAt)
					: undefined,
				payload: parsed.data.payload as Prisma.InputJsonValue | undefined,
			},
		});

		return NextResponse.json(interaction, { status: 201 });
	} catch (error) {
		console.error("Create interaction failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
