import Image from "next/image";
interface FeatureCardProps {
	src: string;
	title: string;
	description: string;
}
const FeatureCard = ({ src, title, description }: FeatureCardProps) => {
	return (
		<div className="transition-colors duration-200">
			<Image
				src={src}
				alt="Silhouette of professionals in a blue background"
				width={250}
				height={250}
				className="-translate-x-[20%] object-cover"
				sizes="100vw"
				priority
			/>
			<h3 className="mb-2 font-semibold text-gray-800 text-xl dark:text-white">
				{title}
			</h3>
			<p className="font-light text-gray-600 dark:text-gray-300">
				{description}
			</p>
		</div>
	);
};

export default FeatureCard;
