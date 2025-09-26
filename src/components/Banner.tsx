import Image from "next/image";
interface BannerProps {
  src: string
}
export default function Banner({src}: BannerProps) {
  return (
  <div className="relative w-[100vw] sm:w-[60vw] h-[400px] sm:h-[600px] mx-8">
    <Image 
        src={src}
        alt="Silhouette of professionals in a blue background"
        fill
        className="object-cover object-left sm:object-bottom"
        sizes="100vw"
        priority
        />
  </div>)
}
