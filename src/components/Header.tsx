import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { siteConfig } from "@/constants";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Header() {
	return (
		<header className="bg-white shadow-sm dark:border-gray-800 dark:border-b-0 dark:bg-black">
			<div className="container mx-auto flex items-center justify-between px-4 py-4">
				<div className="flex items-center">
					<span className="text-xl dark:text-gray-100">
						{siteConfig.siteWide.siteTitle}
					</span>
				</div>
				<nav className="flex items-center">
					<ul className="mr-2 flex space-x-2">
						{siteConfig.mainNav.map((link) => {
							return (
								<li key={link.title}>
									<Link
										href={link.href}
										className="rounded-md px-4 py-2 text-gray-800 text-sm transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
									>
										{link.title}
									</Link>
								</li>
							);
						})}
					</ul>
					{/* <ThemeSwitch /> */}
				</nav>
			</div>
		</header>
	);
}
