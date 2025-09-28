import { AiOutlineX, AiOutlineLinkedin } from "react-icons/ai";
import { siteConfig } from "@/constants";
const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-gray-100 border-t bg-white py-6 text-gray-400 shadow-sm dark:border-gray-800 dark:border-t-0 dark:bg-black">
			<div className="container mx-auto flex flex-wrap items-center justify-center px-4 text-sm sm:justify-between">
				<p className="ml-4">
					&copy; {currentYear} {siteConfig.siteWide.siteTitle}. All rights
					reserved.
				</p>
				<div className="mt-2 mr-4 flex space-x-4 sm:mt-0">
					<a
						href={siteConfig.socials.linkedIn}
						aria-label="LinkedIn"
						className="hover:text-gray-300"
					>
						<AiOutlineLinkedin className="h-5 w-5" />
					</a>

					<a
						href={siteConfig.socials.x}
						aria-label="X (formerly Twitter)"
						className="hover:text-gray-300"
					>
						<AiOutlineX className="h-5 w-5" />
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
