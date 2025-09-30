import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { roles } from "@/types/global";
const RoleEnum = z.enum(roles);

const waitlistSchema = z.object({
	email: z.string().email(),
	linkedin: z.string().url().startsWith("https://www.linkedin.com/"),

	role: RoleEnum,

	recruiter_roles_per_month: z.string(),
	recruiter_top_roles: z.union([z.array(z.string()), z.string()]),
	recruiter_pain_points: z.union([z.array(z.string()), z.string()]),
	recruiter_workflow_challenge: z.string(),

	candidate_status: z.string(),
	candidate_interviews: z.string(),
	candidate_challenges: z.union([z.array(z.string()), z.string()]),
	candidate_public_profile: z.boolean().optional(),

	founder_chat: z.boolean().optional(),

	consent_updates: z.boolean(),
});

export async function GET(request: NextRequest) {}
export async function Post(req: NextRequest) {
	try {
		const body = await req.json();
		console.log(body);
		const parsed = waitlistSchema.safeParse(body);
		if (!parsed) {
			return NextResponse.json(
				{
					error: "Invalid input",
					// details: parsed.error.format(),
				},
				{ status: 400 },
			);
		}
		const fields = parsed.data;
		/**
         const airtableRes = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Waitlist`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!airtableRes.ok) {
      const err = await airtableRes.text();
      return NextResponse.json({ error: err }, { status: 400 });
    }

    return NextResponse.json({ success: true });
         */
	} catch (e) {
		/**
         console.error("Server error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
         */
	}
}
