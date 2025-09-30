import Accordion from "@/components/Accordion";
import Download from "@/components/Download";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { siteConfig } from "@/constants";
import Banner from "@/components/Banner";
import WaitlistForm from "@/components/forms/WaitlistForm";

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center ">
			<Hero />
			<Download
				heading="Stop Searching. Start Hiring."
				text="Consolidate and Conquer Your Hiring Stack. Signal Insights cuts through the chaos. Stop bouncing between email, LinkedIn, and your ATS just to schedule a call. Manage, vet, and collaborate on your entire candidate pipeline—all from one centralized, intelligent platform."
				cta={siteConfig.siteWide.cta.text}
				src="/images/business-si.avif"
			/>
			<Features />
			<Banner
				heading={
					<>
						Join <span className="font-bold text-blue-400">recruiters</span>,
						<span className="font-bold text-green-400"> clients</span>, and
						<span className="font-bold text-yellow-300"> candidates</span>{" "}
						already signing up to shape the future of hiring.
					</>
				}
				src="/images/banner.avif"
			/>
			<Accordion />

			<WaitlistForm />
		</main>
	);
}
