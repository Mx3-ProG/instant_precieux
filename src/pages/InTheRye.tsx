import { useState, useMemo } from "react";
import LeftNav from "@/components/LeftNav";
import HorizontalGallery from "@/components/HorizontalGallery";
import SEO from "@/components/SEO";
import { Portfolio } from "@/lib/data";
import { useI18n } from "@/i18n";

const InTheRye = () => {
  const profile = Portfolio.profile();
  const { t } = useI18n();
  const [shouldAnimate] = useState(() => {
    const hasPlayed = sessionStorage.getItem('homepage-animated');
    if (!hasPlayed) {
      sessionStorage.setItem('homepage-animated', 'true');
      return true;
    }
    return false;
  });

  const galleryImages = useMemo(() => {
    // Get the 6 featured Pexels projects
    const featuredProjects = [
      "behind-the-lens-photos",
      "in-the-rye-photos",
      "behind-the-lens-videos",
      "in-the-rye-videos",
      "same-as-you-photos",
      "same-as-you-videos"
    ];

    const projects = featuredProjects
      .map(slug => Portfolio.getProjectBySlug(slug))
      .filter(Boolean);

    return projects.map((project) => {
      const isVideoProject = project!.videos && project!.videos.length > 0;

      if (isVideoProject) {
        // Use the first video from the videos array
        const firstVideo = project!.videos![0];
        return {
          src: firstVideo.videoUrl,
          alt: project!.coverImage.alt,
          slug: project!.slug,
          isVideo: true,
          posterSrc: firstVideo.posterUrl,
        };
      }

      return {
        src: project!.coverImage.src,
        alt: project!.coverImage.alt,
        slug: project!.slug,
      };
    });
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${profile.name} - ${t("home.portfolioTitle")}`,
    description: profile.bio,
    creator: {
      "@type": "Person",
      name: profile.name,
      url: profile.siteUrl,
    },
  };

  return (
    <>
      <SEO
        title={`${profile.name} - ${t("home.photographer")}`}
        description={profile.bio}
        canonicalUrl="/"
        jsonLd={jsonLd}
      />

      <LeftNav />

      <main className="relative z-0">
        <HorizontalGallery
          images={galleryImages}
          clickable={true}
          enableAnimation={shouldAnimate}
        />
      </main>
    </>
  );
};

export default InTheRye;
