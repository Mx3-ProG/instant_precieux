import { useRef, useEffect, memo, useState } from "react";
import { Link } from "react-router-dom";

interface GalleryImage {
  src: string;
  alt: string;
  slug?: string; // For category pages - click navigates to project
  isVideo?: boolean; // If true, src is a video URL
  posterSrc?: string; // Poster image for video (optional)
}

interface HorizontalGalleryProps {
  images: GalleryImage[];
  clickable?: boolean; // If true, images are clickable and navigate to project pages
  enableAnimation?: boolean; // If true, enables slide-in animation on mount
  metadata?: {
    client: string;
    year: string;
    role: string;
  };
}

const HorizontalGallery = ({
  images,
  clickable = false,
  enableAnimation = false,
  metadata,
}: HorizontalGalleryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (!enableAnimation) {
      return;
    }

    // Preload all images
    const imagePromises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.src;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setImagesLoaded(true);
        setTimeout(() => {
          setMounted(true);
        }, 250);
      })
      .catch(() => {
        // If images fail to load, still show them
        setImagesLoaded(true);
        setTimeout(() => {
          setMounted(true);
        }, 250);
      });
  }, [enableAnimation, images]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current && Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const ImageContent = ({
    image,
    index,
  }: {
    image: GalleryImage;
    index: number;
  }) => {
    if (image.isVideo) {
      return (
        <video
          src={image.src}
          poster={image.posterSrc}
          className="h-full w-auto object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      );
    }

    return (
      <img
        src={image.src}
        alt={image.alt}
        className="h-full w-auto object-cover"
        loading={index === 0 ? "eager" : "lazy"}
      />
    );
  };

  const getImageClassName = (index: number) => {
    const baseClasses = "flex-shrink-0 h-[calc(100vh-100px)] relative overflow-hidden";

    if (!enableAnimation) return baseClasses;

    return `${baseClasses} transform-gpu transition-all duration-700 ease-out ${
      mounted ? 'translate-x-0 opacity-100' : 'translate-x-[200px] opacity-0'
    }`;
  };

  const getImageStyle = (index: number) => {
    if (!enableAnimation) return undefined;

    return {
      transitionDelay: `${index * 100}ms`,
    };
  };

  return (
    <>
      {/* Desktop: Horizontal Scroll */}
      <div
        ref={scrollContainerRef}
        className="hidden md:flex overflow-visible h-screen items-center gap-[25px] px-[40px] py-[50px]"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={getImageClassName(index)}
            style={getImageStyle(index)}
          >
            {clickable && image.slug ? (
              <Link
                to={`/project/${image.slug}`}
                className="block h-full hover:opacity-90 transition-opacity duration-300"
              >
                <ImageContent image={image} index={index} />
              </Link>
            ) : (
              <>
                <ImageContent image={image} index={index} />
                {metadata && (
                  <div className="absolute top-[20px] left-[20px]">
                    <div className="inline-block bg-black/30 backdrop-blur-sm px-3 py-2">
                      <p className="text-sm text-white">
                        For {metadata.client}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Vertical Scroll */}
      <div className="md:hidden flex flex-col items-center gap-[75px] px-[40px] py-[50px] pt-[80px]">
        {images.map((image, index) => (
          <div key={index} className="w-full relative overflow-hidden">
            {clickable && image.slug ? (
              <Link
                to={`/project/${image.slug}`}
                className="block hover:opacity-90 transition-opacity duration-300"
              >
                <ImageContent image={image} index={index} />
              </Link>
            ) : (
              <>
                <ImageContent image={image} index={index} />
                {metadata && (
                  <div className="absolute top-[20px] left-[20px]">
                    <div className="inline-block bg-black/30 backdrop-blur-sm px-3 py-2">
                      <p className="text-sm text-white">
                        For {metadata.client}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default memo(HorizontalGallery);
