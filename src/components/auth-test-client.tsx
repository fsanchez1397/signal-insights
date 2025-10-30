"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

type ProviderId = "google" | "linkedin" | "apple";

const providers: Array<{ id: ProviderId; label: string }> = [
	{ id: "google", label: "Google" },
	{ id: "linkedin", label: "LinkedIn" },
	{ id: "apple", label: "Apple" },
];

export function AuthTestClient({ isAuthenticated }: { isAuthenticated: boolean }) {
	const [pending, setPending] = useState<ProviderId | "signout" | null>(null);

	const handleSignIn = async (provider: ProviderId) => {
		setPending(provider);
		try {
			await signIn(provider, { callbackUrl: "/auth-test" });
		} finally {
			setPending(null);
		}
	};

	const handleSignOut = async () => {
		setPending("signout");
		try {
			await signOut({ callbackUrl: "/auth-test" });
		} finally {
			setPending(null);
		}
	};

	return (
		<section className="rounded-md border bg-card p-4 shadow-sm">
			<h2 className="text-lg font-medium">Actions</h2>
			<div className="mt-3 flex flex-wrap gap-3">
				{providers.map(({ id, label }) => (
					<button
						key={id}
						type="button"
						onClick={() => handleSignIn(id)}
						disabled={pending !== null}
						className="rounded border border-input bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{pending === id ? `Opening ${label}…` : `Sign in with ${label}`}
					</button>
				))}
			</div>

			<div className="mt-4">
				<button
					type="button"
					onClick={handleSignOut}
					disabled={!isAuthenticated || pending !== null}
					className="rounded border border-input px-4 py-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
				>
					{pending === "signout" ? "Signing out…" : "Sign out"}
				</button>
			</div>
		</section>
	);
}
