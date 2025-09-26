import Image from "next/image";
interface FeatureCardProps {
  src: string;
  title: string;
  description: string;
};
const FeatureCard = ({ src, title, description }: FeatureCardProps) => {
  return (
    <div className="transition-colors duration-200">
          <Image 
              src={src}
              alt="Silhouette of professionals in a blue background"
              width={250}
              height={250}
              className="object-cover -translate-[20%]"
              sizes="100vw"
              priority
              />
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 font-light">{description}</p>
    </div>
  );
};

export default FeatureCard;