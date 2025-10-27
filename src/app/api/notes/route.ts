import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { db } from "@/server/db";

// Validation for note creation to keep consistent formatting for AI vs human authored notes.
const noteCreateSchema = z.object({
	candidateId: z.string().min(1),
	authorId: z.string().min(1),
	content: z.string().min(1),
	isPrivate: z.boolean().optional(),
	aiGenerated: z.boolean().optional(),
	aiConfidence: z.number().min(0).max(1).optional(),
	needsReview: z.boolean().optional(),
});

// Lists notes for a candidate so UI can render conversation context.
export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const candidateId = url.searchParams.get("candidateId");

	if (!candidateId) {
		return NextResponse.json(
			{ error: "candidateId query param is required" },
			{ status: 400 },
		);
	}

	const notes = await db.note.findMany({
		where: { candidate_id: candidateId },
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json(notes);
}

// Writes a note associated with a candidate for auditing and AI feedback loops.
export async function POST(req: NextRequest) {
	try {
		const json = await req.json();
		const parsed = noteCreateSchema.safeParse(json);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid body", details: parsed.error.format() },
				{ status: 400 },
			);
		}

		const note = await db.note.create({
			data: {
				candidate_id: parsed.data.candidateId,
				author_id: parsed.data.authorId,
				content: parsed.data.content,
				is_private: parsed.data.isPrivate ?? false,
				ai_generated: parsed.data.aiGenerated ?? false,
				ai_confidence: parsed.data.aiConfidence,
				needs_review: parsed.data.needsReview ?? false,
			},
		});

		return NextResponse.json(note, { status: 201 });
	} catch (error) {
		console.error("Create note failed", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

