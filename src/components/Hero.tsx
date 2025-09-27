import Link from "next/link";
import { siteConfig } from "@/constants";
export default function Hero() {
	return (
		<section className="py-12 mx-4 sm:mx-8 md:mx-16 lg:mx-24">
			<p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-light">
				{siteConfig.siteWide.mainEyebrow}
			</p>
			<h1 className="font-sans text-3xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary dark:text-white mb-6">
				{siteConfig.siteWide.mainHeader}
			</h1>
			<p className="text-xl text-gray-600 dark:text-gray-300 mb-12 font-light">
				{siteConfig.siteWide.mainSubHeader}
			</p>

			<div className="flex space-x-6">
				<Link
					href={siteConfig.siteWide.cta.href}
					className="bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-md text-base font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300"
				>
					{siteConfig.siteWide.cta.text}
				</Link>
			</div>
		</section>
	);
}
