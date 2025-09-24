import Accordion from "@/components/Accordion";
import Customers from "@/components/Customers";
import Download from "@/components/Download";
import FeatureCard from "@/components/FeatureCard";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Review from "@/components/Review";
import { Reviews } from "@/components/Reviews";
import Section from "@/components/Section";
import { FcDecision } from "react-icons/fc";
import { defaultReviews } from "@/components/Reviews";
import Banner from "@/components/Banner";

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center ">
			<Hero />
			<Banner/>
			<p>Your Time, Well Spent</p>
			<Accordion />
			<p id="join">Customers</p>
			<Customers />
			<p>Download</p>
			<Download />
			<p>FeatureCard</p>
			<FeatureCard
				icon={FcDecision}
				title="AI-Powered Sourcing"
				description="Find the perfect candidate using an AI-driven search that goes beyond simple keywords."
			/>
			<p>Features</p>
			<Features />

			<p>Review</p>
			<Review
				rating={5}
				title={"Default Title"}
				content={"Default content for the review."}
				author="John Doe"
				designation={"Customer"}
			/>
			<p>Reviews</p>
			<Reviews reviews={defaultReviews} />
			<p>Section</p>
			<Section leftHalf={<p>Lorem Ipsum</p>} rightHalf={<p>Lorem Ipsum</p>} />
		</main>
	);
}
