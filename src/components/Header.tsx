"use client";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { siteConfig } from "@/constants";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useEffect } from "react";

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		if (typeof document === "undefined") return;
		const prev = document.body.style.overflow;
		if (isOpen) document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [isOpen]);

	return (
		<header className="fixed z-50 w-full max-w-full bg-white shadow-sm dark:border-gray-800 dark:border-b-0 dark:bg-black">
			<div className="container relative mx-auto flex items-center justify-between px-4 py-4">
				<div className="flex items-center">
					<span className="text-xl dark:text-gray-100">
						{siteConfig.siteWide.siteTitle}
					</span>
				</div>
				<button
					onClick={() => setIsOpen((s) => !s)}
					className="sm:hidden"
					type="button"
					aria-label="Toggle menu"
				>
					<RxHamburgerMenu />
				</button>

				<nav
					className={`
						${
							isOpen ? "block" : "hidden"
						} absolute inset-0 top-[59px] h-screen items-center bg-black sm:static sm:block sm:h-auto sm:bg-transparent`}
				>
					<ul className="mr-2 flex flex-col space-y-2 px-4 pt-6 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 sm:p-0">
						{siteConfig.mainNav.map((link) => (
							<li key={link.title}>
								<Link
									href={link.href}
									className="rounded-md px-4 py-2 text-gray-800 text-sm transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
								>
									{link.title}
								</Link>
							</li>
						))}
					</ul>
					{/* <div className="hidden sm:block">
						<ThemeSwitch />
					</div> */}
				</nav>
			</div>
		</header>
	);
}
