import { useState } from "react";

interface PexelsImageProps {
  src: string;
  alt: string;
  photographer: string;
  photographer_url: string;
  pexels_url: string;
  className?: string;
  loading?: "eager" | "lazy";
}

/**
 * Image component with Pexels photographer attribution
 * Shows photographer credit on hover
 */
const PexelsImageWithAttribution = ({
  src,
  alt,
  photographer,
  photographer_url,
  pexels_url,
  className = "",
  loading = "lazy",
}: PexelsImageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className={`transition-transform duration-300 ${
          isHovered ? "scale-105" : "scale-100"
        } ${className}`}
        loading={loading}
      />

      {/* Attribution overlay - shows on hover */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-xs text-white">
          Photo by{" "}
          <a
            href={photographer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            {photographer}
          </a>{" "}
          on{" "}
          <a
            href={pexels_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            Pexels
          </a>
        </p>
      </div>
    </div>
  );
};

export default PexelsImageWithAttribution;
