"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

enum UserRole {
	RECRUITER = "recruiter",
	CLIENT = "client",
	CANDIDATE = "candidate",
}
const ROLE_COLOR_MAP: Record<UserRole, string> = {
	[UserRole.RECRUITER]: "text-blue-400",
	[UserRole.CLIENT]: "text-green-400",
	[UserRole.CANDIDATE]: "text-yellow-300",
};
interface AccordionItemProps {
	role?: UserRole;
	eyebrow: string;
	title: string;
	content: string;
	isOpen: boolean;
	toggleOpen: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
	role,
	eyebrow,
	title,
	content,
	isOpen,
	toggleOpen,
}) => {
	return (
		<div className="mb-4">
			<div
				className={`p-4 w-full rounded-lg overflow-hidden ${
					isOpen ? "bg-black dark:bg-gray-900" : "bg-black dark:bg-gray-900"
				}`}
			>
				<p className={`${role ? ROLE_COLOR_MAP[role] : ""}`}>{eyebrow}</p>
				<button
					className="w-full text-left flex justify-between items-center"
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
		role: UserRole.RECRUITER,
		eyebrow: "For Recruiters",
		title: "End the Noise, Find the Signal.",
		content:
			"Tired of sifting through thousands of irrelevant resumes? Signal Insights delivers a pre-vetted, high-quality talent pool exclusively focused on U.S. tech talent. We remove the noise, the inactive candidates, the content creators, and the global clutter so you can spend less time searching and more time connecting with your next superstar hire.",
	},
	{
		role: UserRole.CANDIDATE,
		eyebrow: "For Candidates",
		title: "Get Seen by the Right People.",
		content:
			"Stop endlessly applying into a black hole. With Signal Insights, your profile is more than just a resume; it's a high-signal beacon. Our platform ensures you're discoverable to recruiters who are actively seeking your specific skills, all while respecting your privacy. Get discovered faster and land your dream role without the cold-applying grind.",
	},
	{
		role: UserRole.CLIENT,
		eyebrow: "For Clients",
		title: "Eliminate Uncertainty, Gain Clarity.",
		content:
			"Stop relying on fragmented feedback. Clients get a dedicated, easy-to-use workspace to interview, review recruiter notes, and leave definitive Approved, Declined, or Pending status updates. Foster alignment with your recruiting partners and ensure every decision is documented and clear, minimizing hiring mistakes.",
	},
];

interface AccordionProps {
	items?: { role: UserRole; eyebrow: string; title: string; content: string }[];
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
				How It Helps You
			</h2>
			{items.map((item, index) => (
				<AccordionItem
					key={index}
					role={item.role}
					eyebrow={item.eyebrow}
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
