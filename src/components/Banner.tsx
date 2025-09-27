import Image from "next/image";
interface BannerProps {
	heading: React.ReactNode;
	src: string;
}
export default function Banner({ heading, src }: BannerProps) {
	return (
		<div className="relative w-full overflow-hidden">
			<div className="relative w-[100vw] h-[400px] sm:h-[600px] mx-auto">
				<Image
					src={src}
					alt="Silhouette of professionals in a blue background"
					fill
					className="object-cover object-left sm:object-bottom"
					sizes="100vw"
					priority
				/>
				<div className="absolute inset-0 bg-black opacity-45" />
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
					<h2 className="font-sans text-3xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary dark:text-white mb-6">
						{heading}
					</h2>
				</div>
			</div>
		</div>
	);
}
