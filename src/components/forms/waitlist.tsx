"use client";

import { useState } from "react";
import { Role } from "@/types/global";
import type { FormStatus } from "@/types/global";
export default function WaitlistForm() {
	const [role, setRole] = useState<Role | "">("");
	const [status, setStatus] = useState<FormStatus>("idle");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("loading");

		const formData = new FormData(e.currentTarget); //compare this approach to useActionState
		const body = Object.fromEntries(formData.entries());

		try {
			const res = await fetch("/api/waitlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!res.ok) throw new Error("Submission failed");

			setStatus("success");
		} catch (err) {
			console.error(err);
			setStatus("error");
		}

		status === "success" && (
			<div className="mx-auto max-w-lg rounded-xl bg-green-50 p-6 text-center">
				<h2 className="font-semibold text-xl">🎉 Thanks for joining!</h2>
				<p>You’ll hear from us soon with early access updates.</p>
			</div>
		);

		return (
			<form
				onSubmit={handleSubmit}
				className="mx-auto max-w-lg space-y-4 rounded-xl bg-white p-6 shadow"
			>
				<h2 className="font-bold text-2xl">Join the Waitlist</h2>

				{status === "error" && (
					<div className="rounded border border-red-400 bg-red-100 p-3 text-red-700 text-sm">
						Submission failed. Please check your network and try again.
					</div>
				)}
				{/* Universal fields */}
				<div>
					<label htmlFor="email" className="mb-1 block font-medium">
						Email *
					</label>
					<input
						type="email"
						name="email"
						required
						className="w-full rounded border p-2"
					/>
				</div>

				<div>
					<label htmlFor="linkedin" className="mb-1 block font-medium">
						LinkedIn URL (optional)
					</label>
					<input
						type="url"
						name="linkedin"
						placeholder="https://linkedin.com/in/username"
						className="w-full rounded border p-2"
					/>
				</div>

				<div>
					<label htmlFor="role" className="mb-1 block font-medium">
						Role *
					</label>
					<select
						id="role"
						name="role"
						required
						className="w-full rounded border p-2"
						value={role}
						onChange={(e) => setRole(e.target.value as Role)}
					>
						<option value="">Select your role</option>
						{Object.values(Role).map((r) => {
							return (
								<option key={r} value={r}>
									{r}
								</option>
							);
						})}
					</select>
				</div>

				{role === "Recruiter" && (
					<>
						<div>
							<label
								htmlFor="recruiter_roles_per_month"
								className="mb-1 block font-medium"
							>
								How many roles do you hire per month?
							</label>
							<select
								id="recruiter_roles_per_month"
								name="recruiter_roles_per_month"
								className="w-full rounded border p-2"
							>
								<option>1–5</option>
								<option>6–15</option>
								<option>16+</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="recruiter_top_roles"
								className="mb-1 block font-medium"
							>
								What 2 roles are you hiring for the most?
							</label>
							<select
								id="recruiter_top_roles"
								name="recruiter_top_roles"
								multiple
								className="w-full rounded border p-2"
							>
								<option>Data Analyst</option>
								<option>ML Engineer</option>
								<option>Software Developer</option>
								<option>Product Manager</option>
								<option>Other</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="recruiter_pain_points"
								className="mb-1 block font-medium"
							>
								Biggest hiring pain point
							</label>
							<select
								id="recruiter_pain_points"
								name="recruiter_pain_points"
								multiple
								className="w-full rounded border p-2"
							>
								<option>Too many unqualified resumes</option>
								<option>Candidate ghosting</option>
								<option>Lack of client feedback</option>
								<option>Organizing pipelines</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="recruiter_workflow_challenge"
								className="mb-1 block font-medium"
							>
								Biggest challenge in your workflow
							</label>
							<input
								id="recruiter_workflow_challenge"
								name="recruiter_workflow_challenge"
								type="text"
								className="w-full rounded border p-2"
							/>
						</div>
					</>
				)}

				{role === "Candidate" && (
					<>
						<div>
							<label
								htmlFor="candidate_status"
								className="mb-1 block font-medium"
							>
								Are you actively looking or open to opportunities?
							</label>
							<select
								id="candidate_status"
								name="candidate_status"
								className="w-full rounded border p-2"
							>
								<option>Actively looking</option>
								<option>Open to opportunities</option>
								<option>Not currently looking</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="candidate_interviews"
								className="block mb-1 font-medium"
							>
								How many interviews have you had in the past 3 months?
							</label>
							<select
								id="candidate_interviews"
								name="candidate_interviews"
								className="w-full rounded border p-2"
							>
								<option>0</option>
								<option>1–3</option>
								<option>4–6</option>
								<option>7+</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="candidate_challenges"
								className="mb-1 block font-medium"
							>
								Biggest challenge in your job search
							</label>
							<select
								id="candidate_challenges"
								name="candidate_challenges"
								multiple
								className="w-full rounded border p-2"
							>
								<option>Not getting interviews</option>
								<option>Lack of recruiter responses</option>
								<option>Long hiring processes</option>
								<option>Unclear feedback</option>
								<option>Other</option>
							</select>
						</div>

						<div className="flex items-center gap-2">
							<input
								id="candidate_public_profile"
								name="candidate_public_profile"
								type="checkbox"
							/>
							<label htmlFor="candidate_public_profile">
								Make my profile viewable to recruiters
							</label>
						</div>
					</>
				)}

				{/* Founder outreach */}
				<div className="flex items-center gap-2">
					<input id="founder_chat" type="checkbox" name="founder_chat" />
					<label htmlFor="founder_chat">
						I’d be open to a 15-minute chat with the Founder to share feedback
					</label>
				</div>

				{/* Consent */}
				<div className="flex items-center gap-2">
					<input
						id="consent_updates"
						type="checkbox"
						name="consent_updates"
						required
					/>
					<label htmlFor="consent_updates">
						I consent to receive early access updates and launch announcements.
					</label>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					{loading ? "Submitting..." : "Join the Waitlist"}
				</button>
			</form>
		);
	}
}
