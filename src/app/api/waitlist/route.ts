import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { roles } from "@/types/global";
const RoleEnum = z.enum(roles);

const baseWaitlistSchema = z.object({
	// Universal fields (Required by z.string().email(), etc.)
	email: z.email("Invalid email address."),
	linkedin: z
		.url("Invalid URL.")
		.startsWith(
			"https://www.linkedin.com/",
			"LinkedIn URL must start with https://www.linkedin.com/",
		),
	role: RoleEnum,
	// Recruiter Fields (Initially Optional)
	recruiter_roles_per_month: z.string().optional(),
	recruiter_top_roles: z.union([z.array(z.string()), z.string()]).optional(),
	recruiter_pain_points: z.union([z.array(z.string()), z.string()]).optional(),
	recruiter_workflow_challenge: z.string().optional(),

	// Candidate Fields (Initially Optional)
	candidate_status: z.string().optional(),
	candidate_interviews: z.string().optional(),
	candidate_challenges: z.union([z.array(z.string()), z.string()]).optional(),
	candidate_public_profile: z.boolean().optional(),

	// Other Optional Fields
	founder_chat: z.boolean().optional(),
	consent_updates: z.boolean(), // Still required, as it has no .optional()
});
// Build a schema that enforces different required fields depending on role.
// We start with the common/base schema then `superRefine` to add role-specific checks.
const waitlistSchema = baseWaitlistSchema.superRefine((data, ctx) => {
	// Helper to check "string or array" fields for presence/non-empty
	const hasStringOrArray = (v: unknown) => {
		if (typeof v === "string") return v.trim().length > 0;
		if (Array.isArray(v)) return v.length > 0;
		return false;
	};

	if (data.role === "Recruiter") {
		if (
			!data.recruiter_roles_per_month ||
			String(data.recruiter_roles_per_month).trim() === ""
		) {
			ctx.issues.push({
				code: "custom",
				path: ["recruiter_roles_per_month"],
				message: "This field is required for recruiters.",
				input: ctx.value,
			});
		}

		if (!hasStringOrArray(data.recruiter_top_roles)) {
			ctx.issues.push({
				code: "custom",
				path: ["recruiter_top_roles"],
				message:
					"Please provide at least one top role (string or array) for recruiters.",
				input: ctx.value,
			});
		}

		if (!hasStringOrArray(data.recruiter_pain_points)) {
			ctx.issues.push({
				code: "custom",
				path: ["recruiter_pain_points"],
				message: "Please provide at least one pain point for recruiters.",
				input: ctx.value,
			});
		}

		if (
			!data.recruiter_workflow_challenge ||
			String(data.recruiter_workflow_challenge).trim() === ""
		) {
			ctx.issues.push({
				code: "custom",
				path: ["recruiter_workflow_challenge"],
				message: `This field is required for recruiters. ${ctx.value}`,
				input: ctx.value,
			});
		}
	} else if (data.role === "Candidate") {
		if (!data.candidate_status || String(data.candidate_status).trim() === "") {
			ctx.issues.push({
				code: "custom",
				path: ["candidate_status"],
				message: "This field is required for candidates.",
				input: ctx.value,
			});
		}

		if (
			!data.candidate_interviews ||
			String(data.candidate_interviews).trim() === ""
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["candidate_interviews"],
				message: "This field is required for candidates.",
			});
		}

		if (!hasStringOrArray(data.candidate_challenges)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["candidate_challenges"],
				message:
					"Please provide at least one challenge (string or array) for candidates.",
			});
		}
	}
});
// const waitlistSchema = z.object({
// 	email: z.string().email(),
// 	linkedin: z.string().url().startsWith("https://www.linkedin.com/"),

// 	role: RoleEnum,

// 	recruiter_roles_per_month: z.string(),
// 	recruiter_top_roles: z.union([z.array(z.string()), z.string()]),
// 	recruiter_pain_points: z.union([z.array(z.string()), z.string()]),
// 	recruiter_workflow_challenge: z.string(),

// 	candidate_status: z.string(),
// 	candidate_interviews: z.string(),
// 	candidate_challenges: z.union([z.array(z.string()), z.string()]),
// 	candidate_public_profile: z.boolean().optional(),

// 	founder_chat: z.boolean().optional(),

// 	consent_updates: z.boolean(),
// });

export async function GET(request: NextRequest) {}
export async function POST(req: NextRequest) {
	try {
		const raw = await req.json();
		const normalized = {
			...raw,
			candidate_public_profile: raw.candidate_public_profile === "on",
			founder_chat: raw.founder_chat === "on",
			consent_updates: raw.consent_updates === "on",
		};

		const parsed = waitlistSchema.safeParse(normalized);
		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Invalid input",
					details: parsed.error.format(),
				},
				{ status: 400 },
			);
		}
		const res = await fetch(
			`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ fields: parsed.data }),
			},
		);
		const data = await res.json();
		return NextResponse.json({ success: true, airtableId: data.id });
	} catch (e) {
		console.error("Server error:", e);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
