import Image from "next/image";
export default function Banner() {
  return (
  <div className="relative w-full h-[400px] sm:h-[600px]">
    <Image 
        src={"/images/professional-connections.avif"}
        alt="Silhouette of professionals in a blue background"
        fill
        className="object-cover object-top"
        sizes="100vw"
        priority
        />
  </div>)
}
