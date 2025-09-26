import Accordion from "@/components/Accordion";
import Customers from "@/components/Customers";
import Download from "@/components/Download";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Section from "@/components/Section";

import Banner from "@/components/Banner";

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center ">
			<Hero />
			<Download src="/images/business.avif"/>
			<Features />
			<Banner src="/images/banner.avif"/>
			<Accordion />
			
			<Customers />
			<p id="join">Customers</p>
			<Section leftHalf={<p>Lorem Ipsum</p>} rightHalf={<p>Lorem Ipsum</p>} />
		</main>
	);
}
