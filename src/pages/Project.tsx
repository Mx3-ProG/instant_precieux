import { useParams, Navigate } from "react-router-dom";
import LeftNav from "@/components/LeftNav";
import HorizontalGallery from "@/components/HorizontalGallery";
import SEO from "@/components/SEO";
import { Portfolio } from "@/lib/data";
import { usePexelsPhotosByIds } from "@/hooks/usePexelsPhotosByIds";
import { pexelsService } from "@/services/pexels";
import { useI18n } from "@/i18n";

const Project = () => {
  const profile = Portfolio.profile();
  const { slug } = useParams();
  const { t } = useI18n();
  const project = slug ? Portfolio.getProjectBySlug(slug) : null;

  // Fetch Pexels photos if project has pexelsPhotoIds
  const { photos, loading: photosLoading, error: photosError } = usePexelsPhotosByIds(
    project?.pexelsPhotoIds || []
  );

  if (!project) {
    return <Navigate to="/" replace />;
  }

  // Determine if this is a Pexels-based project
  const isPexelsPhotoProject = project.pexelsPhotoIds && project.pexelsPhotoIds.length > 0;
  const isVideoProject = project.videos && project.videos.length > 0;

  // Prepare gallery images based on project type
  let galleryImages = project.images.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));

  // Override with Pexels photos if available (show as soon as loaded)
  if (isPexelsPhotoProject && photos) {
    galleryImages = pexelsService.convertPhotosToProjectImages(photos);
  }

  // Override with videos if available
  if (isVideoProject) {
    galleryImages = project.videos!.map((video) => ({
      src: video.videoUrl,
      alt: video.alt,
      isVideo: true,
      posterSrc: video.posterUrl,
    }));
  }

  // Show error if fetch failed
  const hasError = isPexelsPhotoProject && photosError;

  if (hasError && galleryImages.length === 0) {
    return (
      <>
        <LeftNav />
        <main className="md:ml-48 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-red-600">{t("project.error")}</p>
            <p className="text-sm mt-2">{photosError?.message}</p>
          </div>
        </main>
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": project.title,
    "description": project.description || `${project.title} by ${profile.name}`,
    "creator": {
      "@type": "Person",
      "name": profile.name,
      "url": profile.siteUrl
    },
    "image": project.images.map((img) => ({
      "@type": "ImageObject",
      "contentUrl": `${profile.siteUrl}${img.src}`,
      "caption": img.alt,
      "creator": {
        "@type": "Person",
        "name": profile.name
      }
    })),
    "inLanguage": "en-US"
  };

  return (
    <>
      <SEO
        title={`${project.title} - ${profile.name}`}
        description={project.description || `${project.title} by ${profile.name}`}
        canonicalUrl={`/project/${slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />

      <LeftNav />

      <main className="relative z-0">
        <HorizontalGallery
          images={galleryImages}
          clickable={false}
          enableAnimation={false}
          metadata={{
            client: project.client,
            year: project.year,
            role: project.role,
          }}
        />
      </main>
    </>
  );
};

export default Project;
