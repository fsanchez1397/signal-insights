import Image from "next/image";
import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";
interface DownloadProps {
	src: string;
	heading: string;
	text: string;
	cta: string;
}
const Download = ({ heading, text, cta, src }: DownloadProps) => (
	<section className="container mx-auto py-12 md:px-6">
		<div className="flex flex-col md:flex-row items-center gap-8">
			<div className="w-full md:w-1/2 order-1 pl-4 py-0 pr-0 flex justify-center md:justify-start items-center">
				<Image
					src={src}
					alt="Financial app interface"
					width={500}
					height={500}
					className="w-full h-auto mx-auto md:mx-0"
				/>
			</div>
			<div className="w-full px-4 md:w-1/2 order-2 flex justify-center md:justify-end">
				<div className="flex flex-col justify-center">
					<h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-4">
						{heading}
					</h2>
					<p className="text-xl text-gray-800 dark:text-gray-300 mb-6 font-light">
						{text}{" "}
					</p>{" "}
					<div className="flex space-x-4">
						<Link
							href="#info"
							className="download-button bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-md text-base flex items-center space-x-2 transition-colors duration-200"
						>
							<span>{cta}</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	</section>
);

export default Download;
