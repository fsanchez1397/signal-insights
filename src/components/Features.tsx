import React from "react";
import FeatureCard from "./FeatureCard";
import { FaReact, FaDatabase, FaShieldAlt } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiStripe } from "react-icons/si";

const Features = () => {
  const features = [
    {
      src:  "/images/vid-1.avif",
      title: "AI-LESS.",
      description: "App dir, Routing, Layouts, components, and more.",
    },
    {
      src:  "/images/vid-2.avif",
      title: "WORKFLOW.",
      description: "Server and Client Components. using hooks and context.",
    },
    {
      src: "/images/vid-3.avif",
      title: "Database.",
      description: "Postgres basic database and other cool features to come.",
    }
    
  
  ];

  return (
    <section className="container mx-auto px-4 py-12 transition-colors duration-200 rounded-lg">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({src, title, description}, index) => (
              <FeatureCard key={index} src={src} title={title} description={description}/>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Features;