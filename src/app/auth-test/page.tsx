"use server";

import Link from "next/link";

import { auth } from "@/server/auth";
import { AuthTestClient } from "@/components/auth-test-client";

export default async function AuthTestPage() {
	const session = await auth();

	return (
		<main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-12">
			<header className="space-y-2">
				<h1 className="text-3xl font-semibold">Auth Test Harness</h1>
				<p className="text-sm text-muted-foreground">
					Use this helper page to exercise Google, LinkedIn, and Apple sign-in
					flows configured in NextAuth.
				</p>
			</header>

			<section className="rounded-md border bg-card p-4 shadow-sm">
				<h2 className="text-lg font-medium">Current Session</h2>
				{session ? (
					<pre className="mt-3 overflow-x-auto rounded bg-muted p-3 text-sm">
						{JSON.stringify(
							{
								user: session.user,
								expires: session.expires,
							},
							null,
							2,
						)}
					</pre>
				) : (
					<p className="mt-3 text-sm text-muted-foreground">
						No active session detected.
					</p>
				)}
			</section>

			<AuthTestClient isAuthenticated={Boolean(session)} />

			<footer className="text-xs text-muted-foreground">
				Need redirect URLs? Add{" "}
				<code className="rounded bg-muted px-1 py-0.5">
					http://localhost:3000/api/auth/callback/&lt;provider&gt;
				</code>{" "}
				to each provider console. Return to{" "}
				<Link href="/" className="underline">
					home
				</Link>
				.
			</footer>
		</main>
	);
}
