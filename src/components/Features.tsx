import React from "react";
import FeatureCard from "./FeatureCard";
import { FaReact, FaDatabase, FaShieldAlt } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiStripe } from "react-icons/si";

const Features = () => {
	const features = [
		{
			src: "/images/vid-1.avif",
			title: "AI-LESS.",
			description:
				"Cut through the noise of AI-generated profiles and unreliable candidates. We put human vetting and genuine client feedback at the center of every hire. Your focus returns to trust, not fraud.",
		},
		{
			src: "/images/vid-2.avif",
			title: "WORKFLOW.",
			description:
				"End the endless email chain. Our platform is the unified space where clients quickly interview, leave notes, and provide definitive Approved/Declined status on every candidate.",
		},
		{
			src: "/images/vid-3.avif",
			title: "DATABASE.",
			description:
				"Organize more than just resumes. Use custom tags like 'Expert,' 'Good Communicator,' or 'Ghosted' to instantly track history and quality, turning your database into an intelligent resource.",
		},
	];

	return (
		<section className="container mx-auto px-4 py-12 transition-colors duration-200 rounded-lg">
			<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{features.map(({ src, title, description }, index) => (
						<FeatureCard
							key={index}
							src={src}
							title={title}
							description={description}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
