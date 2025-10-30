import {
	CandidateStatus,
	InteractionSource,
	InteractionType,
	JobStatus,
	MeetingStatus,
	PrismaClient,
	Sources,
	TaskAction,
	TaskStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.info("Seeding development data...");

	const alice = await prisma.user.upsert({
		where: { email: "alice.recruiter@example.com" },
		update: {},
		create: {
			first_name: "Alice",
			last_name: "Recruiter",
			email: "alice.recruiter@example.com",
			emailVerified: true,
			emailVerifiedAt: new Date("2024-01-08T10:15:00Z"),
			role: "recruiter",
		},
	});

	const bernard = await prisma.user.upsert({
		where: { email: "bernard.hiring@example.com" },
		update: {},
		create: {
			first_name: "Bernard",
			last_name: "Hiring",
			email: "bernard.hiring@example.com",
			emailVerified: true,
			emailVerifiedAt: new Date("2024-03-12T14:30:00Z"),
			role: "hiring_manager",
		},
	});

	const acme = await prisma.client.upsert({
		where: { slug: "acme-industries" },
		update: {},
		create: {
			slug: "acme-industries",
			name: "ACME Industries",
		},
	});

	const nebula = await prisma.client.upsert({
		where: { slug: "nebula-labs" },
		update: {},
		create: {
			slug: "nebula-labs",
			name: "Nebula Labs",
		},
	});

	const productDesigner = await prisma.job.upsert({
		where: { slug: "senior-product-designer" },
		update: {},
		create: {
			slug: "senior-product-designer",
			title: "Senior Product Designer",
			description:
				"Lead the redesign of our analytics dashboard and collaborate with research to validate concepts.",
			status: JobStatus.active,
			recruiter_id: alice.id,
			client_id: acme.id,
		},
	});

	const marketingDirector = await prisma.job.upsert({
		where: { slug: "director-of-marketing" },
		update: {},
		create: {
			slug: "director-of-marketing",
			title: "Director of Marketing",
			description:
				"Own multichannel demand generation, partner marketing, and manage a distributed team of six.",
			status: JobStatus.paused,
			recruiter_id: alice.id,
			client_id: nebula.id,
		},
	});

	const customerSuccess = await prisma.job.upsert({
		where: { slug: "customer-success-manager" },
		update: {},
		create: {
			slug: "customer-success-manager",
			title: "Customer Success Manager",
			description:
				"Grow enterprise relationships, uncover expansion opportunities, and reduce churn for key accounts.",
			status: JobStatus.active,
			recruiter_id: bernard.id,
			client_id: nebula.id,
		},
	});

	const sam = await prisma.candidate.upsert({
		where: { slug: "sam-rogers" },
		update: {},
		create: {
			slug: "sam-rogers",
			job_id: productDesigner.id,
			name: "Sam Rogers",
			email: "sam.rogers@example.com",
			source: Sources.linkedIn,
			status: CandidateStatus.awaiting_reply,
			last_contact_at: new Date("2024-11-02T09:40:00Z"),
			ai_summary:
				"UX lead with a track record of shipping accessible interfaces and mentoring designers.",
			ai_strengths:
				"Design systems, stakeholder facilitation, qualitative research synthesis.",
			ai_weaknesses: "Limited motion design experience.",
			ai_tags: ["ux", "design-systems", "accessibility"],
			ai_confidence: 0.82,
		},
	});

	const maria = await prisma.candidate.upsert({
		where: { slug: "maria-chen" },
		update: {},
		create: {
			slug: "maria-chen",
			job_id: marketingDirector.id,
			name: "Maria Chen",
			email: "maria.chen@example.com",
			source: Sources.email,
			status: CandidateStatus.advanced,
			last_contact_at: new Date("2024-10-15T16:15:00Z"),
			ai_summary:
				"Growth marketer who scaled ARR from Series B to pre-IPO across two SaaS companies.",
			ai_strengths:
				"Demand generation, performance marketing, empathetic team leadership.",
			ai_weaknesses: "Less exposure to enterprise enablement.",
			ai_tags: ["growth", "leadership", "b2b-saas"],
			ai_confidence: 0.9,
		},
	});

	const diego = await prisma.candidate.upsert({
		where: { slug: "diego-suarez" },
		update: {},
		create: {
			slug: "diego-suarez",
			job_id: customerSuccess.id,
			name: "Diego Suarez",
			email: "diego.suarez@example.com",
			source: Sources.linkedIn,
			status: CandidateStatus.new_contact,
			ai_summary:
				"Customer-first operator who specializes in rescuing and growing at-risk enterprise accounts.",
			ai_tags: ["enterprise", "voice-of-customer"],
			ai_confidence: 0.74,
		},
	});

	await prisma.interaction.deleteMany({
		where: {
			candidate_id: sam.id,
			occurredAt: new Date("2024-11-02T09:45:00Z"),
		},
	});
	await prisma.interaction.create({
		data: {
			candidate_id: sam.id,
			user_id: alice.id,
			source: InteractionSource.manual,
			type: InteractionType.email,
			occurredAt: new Date("2024-11-02T09:45:00Z"),
			payload: {
				subject: "Product Designer role follow-up",
				bodyPreview:
					"Hi Sam, thanks again for sharing the portfolio. Do you have time this week to review the design exercise?",
			},
		},
	});

	await prisma.note.deleteMany({
		where: {
			candidate_id: maria.id,
			author_id: alice.id,
			content:
				"Great storyteller with an eye for analytics. Coordinate with CS lead before final panel.",
		},
	});
	await prisma.note.create({
		data: {
			candidate_id: maria.id,
			author_id: alice.id,
			content:
				"Great storyteller with an eye for analytics. Coordinate with CS lead before final panel.",
		},
	});

	await prisma.meeting.deleteMany({
		where: {
			recruiter_id: alice.id,
			job_id: productDesigner.id,
			candidate_id: sam.id,
			scheduled_time: new Date("2024-11-04T15:00:00Z"),
		},
	});
	await prisma.meeting.create({
		data: {
			recruiter_id: alice.id,
			job_id: productDesigner.id,
			candidate_id: sam.id,
			scheduled_time: new Date("2024-11-04T15:00:00Z"),
			status: MeetingStatus.scheduled,
			calendar_event_ref: "cal_evt_123456",
		},
	});

	await prisma.assistantTask.deleteMany({
		where: {
			recruiter_id: alice.id,
			candidate_id: sam.id,
			job_id: productDesigner.id,
			action: TaskAction.send_followup,
		},
	});
	await prisma.assistantTask.create({
		data: {
			recruiter_id: alice.id,
			candidate_id: sam.id,
			job_id: productDesigner.id,
			action: TaskAction.send_followup,
			status: TaskStatus.pending,
			needs_approval: false,
			proposed_time: new Date("2024-11-05T17:00:00Z"),
		},
	});

	console.info("Seed complete.");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (err) => {
		console.error("Seeding failed:", err);
		await prisma.$disconnect();
		process.exit(1);
	});
