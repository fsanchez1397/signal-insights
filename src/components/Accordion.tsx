"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface AccordionItemProps {
	title: string;
	content: string;
	isOpen: boolean;
	toggleOpen: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
	title,
	content,
	isOpen,
	toggleOpen,
}) => {
	return (
		<div className="mb-4">
			<div
				className={`w-full rounded-lg overflow-hidden ${
					isOpen ? "bg-black dark:bg-gray-900" : "bg-black dark:bg-gray-900"
				}`}
			>
				
				<button
					className="w-full text-left p-4 flex justify-between items-center"
					onClick={toggleOpen}
					type="button"
				>
					<span className="text-xl font-semibold text-white dark:text-white">
						{title}
					</span>
					<span
						className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
					>
						<FaChevronDown className="text-2xl text-white" />
					</span>
				</button>
				<div
					className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
						isOpen ? "max-h-[1000px]" : "max-h-0"
					}`}
				>
					<div className="p-4">
						<p className="text-white font-light">{content}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const defaultAccordionItems = [
	{
		title: "For Recruiters: End the Noise, Find the Signal.",
		content:
			"Tired of sifting through thousands of irrelevant resumes? Signal Insights delivers a pre-vetted, high-quality talent pool exclusively focused on U.S. tech talent. We remove the noise, the inactive candidates, the content creators, and the global clutter so you can spend less time searching and more time connecting with your next superstar hire.",
	},
	{
		title: "For Candidates: Get Seen by the Right People.",
		content:
			"Stop endlessly applying into a black hole. With Signal Insights, your profile is more than just a resume; it's a high-signal beacon. Our platform ensures you're discoverable to recruiters who are actively seeking your specific skills, all while respecting your privacy. Get discovered faster and land your dream role without the cold-applying grind.",
	},
	{
		title: "Easy to use",
		content:
			"Our platform is designed to be user-friendly and easy to use. We want to provide a seamless workflow experience so that you can focus on what matters.",
	},
	{
		title: "Focus on what matters",
		content:
			"The hiring process is full of unnecessary steps. We're here to remove the clutter and build a platform based on trust. Whether you're a recruiter seeking top-tier talent or a candidate looking for your next big opportunity, Signal Insights helps you bypass the noise and focus on what's most important: making meaningful connections that lead to great hires and rewarding careers.",
	},
];

interface AccordionProps {
	items?: { title: string; content: string }[];
}

const Accordion: React.FC<AccordionProps> = ({
	items = defaultAccordionItems,
}) => {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const toggleItem = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<div className="w-[90%] py-12 mx-4 sm:mx-8 md:mx-16 lg:mx-24">
			<h2 className="font-sans text-3xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary dark:text-white mb-6">
								What to know
							</h2>
			{items.map((item, index) => (
				<AccordionItem
					key={index}
					title={item.title}
					content={item.content}
					isOpen={openIndex === index}
					toggleOpen={() => toggleItem(index)}
				/>
			))}
		</div>
	);
};

export default Accordion;
