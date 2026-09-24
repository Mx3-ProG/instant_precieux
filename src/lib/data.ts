import portfolioData from "./portfolio.json";
import { getCurrentLanguage } from "@/i18n";
import type { LanguageCode } from "@/i18n/translations";

type LocalizedText = Record<LanguageCode, string>;

function localize(value: LocalizedText | string): string {
  if (typeof value === "string") return value;
  const lang = getCurrentLanguage();
  return value[lang] ?? value.en;
}

// Import all images
import headshot1 from "@/assets/headshots/headshot-1.webp";
import headshot2 from "@/assets/headshots/headshot-2.webp";
import headshot3 from "@/assets/headshots/headshot-3.webp";
import brand1 from "@/assets/service-brand/brand-1.webp";
import brand2 from "@/assets/service-brand/brand-2.webp";
import brand3 from "@/assets/service-brand/brand-3.webp";
import testimonial1 from "@/assets/testimonial/testimonial-1.webp";
import testimonial2 from "@/assets/testimonial/testimonial-2.webp";
import testimonial3 from "@/assets/testimonial/testimonial-3.webp";
import process1 from "@/assets/process/process-1.webp";
import process2 from "@/assets/process/process-2.webp";
import process3 from "@/assets/process/process-3.webp";

// Import all portfolio images
import img_10071542 from "@/assets/portfolio-images/10071542.webp";
import img_10071546 from "@/assets/portfolio-images/10071546.webp";
import img_10071548 from "@/assets/portfolio-images/10071548.webp";
import img_10071549 from "@/assets/portfolio-images/10071549.webp";
import img_10071553 from "@/assets/portfolio-images/10071553.webp";
import img_10071555 from "@/assets/portfolio-images/10071555.webp";
import img_10212047 from "@/assets/portfolio-images/10212047.webp";
import img_10212048 from "@/assets/portfolio-images/10212048.webp";
import img_10212049 from "@/assets/portfolio-images/10212049.webp";
import img_10212050 from "@/assets/portfolio-images/10212050.webp";
import img_10212052 from "@/assets/portfolio-images/10212052.webp";
import img_10496652 from "@/assets/portfolio-images/10496652.webp";
import img_10496653 from "@/assets/portfolio-images/10496653.webp";
import img_10496654 from "@/assets/portfolio-images/10496654.webp";
import img_10496656 from "@/assets/portfolio-images/10496656.webp";
import img_10496658 from "@/assets/portfolio-images/10496658.webp";
import img_10570877 from "@/assets/portfolio-images/10570877.webp";
import img_10570878 from "@/assets/portfolio-images/10570878.webp";
import img_10570879 from "@/assets/portfolio-images/10570879.webp";
import img_10570883 from "@/assets/portfolio-images/10570883.webp";
import img_10570884 from "@/assets/portfolio-images/10570884.webp";
import img_10610407 from "@/assets/portfolio-images/10610407.webp";
import img_10610413 from "@/assets/portfolio-images/10610413.webp";
import img_10610414 from "@/assets/portfolio-images/10610414.webp";
import img_10610415 from "@/assets/portfolio-images/10610415.webp";
import img_10610417 from "@/assets/portfolio-images/10610417.webp";
import img_10622512 from "@/assets/portfolio-images/10622512.webp";
import img_10622514 from "@/assets/portfolio-images/10622514.webp";
import img_10622515 from "@/assets/portfolio-images/10622515.webp";
import img_10622516 from "@/assets/portfolio-images/10622516.webp";
import img_10622517 from "@/assets/portfolio-images/10622517.webp";
import img_10622518 from "@/assets/portfolio-images/10622518.webp";
import img_10622532 from "@/assets/portfolio-images/10622532.webp";
import img_10622533 from "@/assets/portfolio-images/10622533.webp";
import img_10622537 from "@/assets/portfolio-images/10622537.webp";
import img_10622538 from "@/assets/portfolio-images/10622538.webp";
import img_10622540 from "@/assets/portfolio-images/10622540.webp";
import img_10622542 from "@/assets/portfolio-images/10622542.webp";
import img_10622543 from "@/assets/portfolio-images/10622543.webp";
import img_10622550 from "@/assets/portfolio-images/10622550.webp";
import img_10640582 from "@/assets/portfolio-images/10640582.webp";
import img_10640584 from "@/assets/portfolio-images/10640584.webp";
import img_10640586 from "@/assets/portfolio-images/10640586.webp";
import img_10640594 from "@/assets/portfolio-images/10640594.webp";
import img_10640597 from "@/assets/portfolio-images/10640597.webp";
import img_10667857 from "@/assets/portfolio-images/10667857.webp";
import img_10667863 from "@/assets/portfolio-images/10667863.webp";
import img_10667869 from "@/assets/portfolio-images/10667869.webp";
import img_10667870 from "@/assets/portfolio-images/10667870.webp";
import img_10669638 from "@/assets/portfolio-images/10669638.webp";
import img_10669643 from "@/assets/portfolio-images/10669643.webp";
import img_10669645 from "@/assets/portfolio-images/10669645.webp";
import img_10669646 from "@/assets/portfolio-images/10669646.webp";
import img_10669676 from "@/assets/portfolio-images/10669676.webp";
import img_10675993 from "@/assets/portfolio-images/10675993.webp";
import img_10675995 from "@/assets/portfolio-images/10675995.webp";
import img_10676001 from "@/assets/portfolio-images/10676001.webp";
import img_10676010 from "@/assets/portfolio-images/10676010.webp";
import img_10676043 from "@/assets/portfolio-images/10676043.webp";
import img_10679087 from "@/assets/portfolio-images/10679087.webp";
import img_10679093 from "@/assets/portfolio-images/10679093.webp";
import img_10679097 from "@/assets/portfolio-images/10679097.webp";
import img_10679100 from "@/assets/portfolio-images/10679100.webp";
import img_10679112 from "@/assets/portfolio-images/10679112.webp";
import img_10679115 from "@/assets/portfolio-images/10679115.webp";
import img_10679143 from "@/assets/portfolio-images/10679143.webp";
import img_10679160 from "@/assets/portfolio-images/10679160.webp";
import img_10679165 from "@/assets/portfolio-images/10679165.webp";
import img_10679180 from "@/assets/portfolio-images/10679180.webp";
import img_10679195 from "@/assets/portfolio-images/10679195.webp";
import img_10679201 from "@/assets/portfolio-images/10679201.webp";
import img_10679202 from "@/assets/portfolio-images/10679202.webp";
import img_10679203 from "@/assets/portfolio-images/10679203.webp";
import img_10679206 from "@/assets/portfolio-images/10679206.webp";
import img_10679207 from "@/assets/portfolio-images/10679207.webp";
import img_10679208 from "@/assets/portfolio-images/10679208.webp";
import img_10679209 from "@/assets/portfolio-images/10679209.webp";
import img_10679210 from "@/assets/portfolio-images/10679210.webp";
import img_10679211 from "@/assets/portfolio-images/10679211.webp";
import img_10679212 from "@/assets/portfolio-images/10679212.webp";
import img_10679232 from "@/assets/portfolio-images/10679232.webp";
import img_9834546 from "@/assets/portfolio-images/9834546.webp";
import img_9834550 from "@/assets/portfolio-images/9834550.webp";
import img_9834554 from "@/assets/portfolio-images/9834554.webp";
import img_9834873 from "@/assets/portfolio-images/9834873.webp";
import img_9834877 from "@/assets/portfolio-images/9834877.webp";
import img_9834883 from "@/assets/portfolio-images/9834883.webp";
import img_9834924 from "@/assets/portfolio-images/9834924.webp";
import img_9834928 from "@/assets/portfolio-images/9834928.webp";
import img_9836453 from "@/assets/portfolio-images/9836453.webp";
import img_9836457 from "@/assets/portfolio-images/9836457.webp";
import img_9836517 from "@/assets/portfolio-images/9836517.webp";
import img_9836580 from "@/assets/portfolio-images/9836580.webp";
import img_9836608 from "@/assets/portfolio-images/9836608.webp";
import img_9836613 from "@/assets/portfolio-images/9836613.webp";
import img_9836616 from "@/assets/portfolio-images/9836616.webp";
import img_9836617 from "@/assets/portfolio-images/9836617.webp";
import img_9836619 from "@/assets/portfolio-images/9836619.webp";
import img_9836621 from "@/assets/portfolio-images/9836621.webp";
import img_9836623 from "@/assets/portfolio-images/9836623.webp";
import img_9836627 from "@/assets/portfolio-images/9836627.webp";

// Video imports

// Video poster imports

// Image mapping - converts JSON paths to actual imported images
const imageMap: Record<string, string> = {
  "/src/assets/headshots/headshot-1.webp": headshot1,
  "/src/assets/headshots/headshot-2.webp": headshot2,
  "/src/assets/headshots/headshot-3.webp": headshot3,
  "/src/assets/service-brand/brand-1.webp": brand1,
  "/src/assets/service-brand/brand-2.webp": brand2,
  "/src/assets/service-brand/brand-3.webp": brand3,
  "/src/assets/testimonial/testimonial-1.webp": testimonial1,
  "/src/assets/testimonial/testimonial-2.webp": testimonial2,
  "/src/assets/testimonial/testimonial-3.webp": testimonial3,
  "/src/assets/process/process-1.webp": process1,
  "/src/assets/process/process-2.webp": process2,
  "/src/assets/process/process-3.webp": process3,
  // Portfolio images
  "/src/assets/portfolio-images/10071542.webp": img_10071542,
  "/src/assets/portfolio-images/10071546.webp": img_10071546,
  "/src/assets/portfolio-images/10071548.webp": img_10071548,
  "/src/assets/portfolio-images/10071549.webp": img_10071549,
  "/src/assets/portfolio-images/10071553.webp": img_10071553,
  "/src/assets/portfolio-images/10071555.webp": img_10071555,
  "/src/assets/portfolio-images/10212047.webp": img_10212047,
  "/src/assets/portfolio-images/10212048.webp": img_10212048,
  "/src/assets/portfolio-images/10212049.webp": img_10212049,
  "/src/assets/portfolio-images/10212050.webp": img_10212050,
  "/src/assets/portfolio-images/10212052.webp": img_10212052,
  "/src/assets/portfolio-images/10496652.webp": img_10496652,
  "/src/assets/portfolio-images/10496653.webp": img_10496653,
  "/src/assets/portfolio-images/10496654.webp": img_10496654,
  "/src/assets/portfolio-images/10496656.webp": img_10496656,
  "/src/assets/portfolio-images/10496658.webp": img_10496658,
  "/src/assets/portfolio-images/10570877.webp": img_10570877,
  "/src/assets/portfolio-images/10570878.webp": img_10570878,
  "/src/assets/portfolio-images/10570879.webp": img_10570879,
  "/src/assets/portfolio-images/10570883.webp": img_10570883,
  "/src/assets/portfolio-images/10570884.webp": img_10570884,
  "/src/assets/portfolio-images/10610407.webp": img_10610407,
  "/src/assets/portfolio-images/10610413.webp": img_10610413,
  "/src/assets/portfolio-images/10610414.webp": img_10610414,
  "/src/assets/portfolio-images/10610415.webp": img_10610415,
  "/src/assets/portfolio-images/10610417.webp": img_10610417,
  "/src/assets/portfolio-images/10622512.webp": img_10622512,
  "/src/assets/portfolio-images/10622514.webp": img_10622514,
  "/src/assets/portfolio-images/10622515.webp": img_10622515,
  "/src/assets/portfolio-images/10622516.webp": img_10622516,
  "/src/assets/portfolio-images/10622517.webp": img_10622517,
  "/src/assets/portfolio-images/10622518.webp": img_10622518,
  "/src/assets/portfolio-images/10622532.webp": img_10622532,
  "/src/assets/portfolio-images/10622533.webp": img_10622533,
  "/src/assets/portfolio-images/10622537.webp": img_10622537,
  "/src/assets/portfolio-images/10622538.webp": img_10622538,
  "/src/assets/portfolio-images/10622540.webp": img_10622540,
  "/src/assets/portfolio-images/10622542.webp": img_10622542,
  "/src/assets/portfolio-images/10622543.webp": img_10622543,
  "/src/assets/portfolio-images/10622550.webp": img_10622550,
  "/src/assets/portfolio-images/10640582.webp": img_10640582,
  "/src/assets/portfolio-images/10640584.webp": img_10640584,
  "/src/assets/portfolio-images/10640586.webp": img_10640586,
  "/src/assets/portfolio-images/10640594.webp": img_10640594,
  "/src/assets/portfolio-images/10640597.webp": img_10640597,
  "/src/assets/portfolio-images/10667857.webp": img_10667857,
  "/src/assets/portfolio-images/10667863.webp": img_10667863,
  "/src/assets/portfolio-images/10667869.webp": img_10667869,
  "/src/assets/portfolio-images/10667870.webp": img_10667870,
  "/src/assets/portfolio-images/10669638.webp": img_10669638,
  "/src/assets/portfolio-images/10669643.webp": img_10669643,
  "/src/assets/portfolio-images/10669645.webp": img_10669645,
  "/src/assets/portfolio-images/10669646.webp": img_10669646,
  "/src/assets/portfolio-images/10669676.webp": img_10669676,
  "/src/assets/portfolio-images/10675993.webp": img_10675993,
  "/src/assets/portfolio-images/10675995.webp": img_10675995,
  "/src/assets/portfolio-images/10676001.webp": img_10676001,
  "/src/assets/portfolio-images/10676010.webp": img_10676010,
  "/src/assets/portfolio-images/10676043.webp": img_10676043,
  "/src/assets/portfolio-images/10679087.webp": img_10679087,
  "/src/assets/portfolio-images/10679093.webp": img_10679093,
  "/src/assets/portfolio-images/10679097.webp": img_10679097,
  "/src/assets/portfolio-images/10679100.webp": img_10679100,
  "/src/assets/portfolio-images/10679112.webp": img_10679112,
  "/src/assets/portfolio-images/10679115.webp": img_10679115,
  "/src/assets/portfolio-images/10679143.webp": img_10679143,
  "/src/assets/portfolio-images/10679160.webp": img_10679160,
  "/src/assets/portfolio-images/10679165.webp": img_10679165,
  "/src/assets/portfolio-images/10679180.webp": img_10679180,
  "/src/assets/portfolio-images/10679195.webp": img_10679195,
  "/src/assets/portfolio-images/10679201.webp": img_10679201,
  "/src/assets/portfolio-images/10679202.webp": img_10679202,
  "/src/assets/portfolio-images/10679203.webp": img_10679203,
  "/src/assets/portfolio-images/10679206.webp": img_10679206,
  "/src/assets/portfolio-images/10679207.webp": img_10679207,
  "/src/assets/portfolio-images/10679208.webp": img_10679208,
  "/src/assets/portfolio-images/10679209.webp": img_10679209,
  "/src/assets/portfolio-images/10679210.webp": img_10679210,
  "/src/assets/portfolio-images/10679211.webp": img_10679211,
  "/src/assets/portfolio-images/10679212.webp": img_10679212,
  "/src/assets/portfolio-images/10679232.webp": img_10679232,
  "/src/assets/portfolio-images/9834546.webp": img_9834546,
  "/src/assets/portfolio-images/9834550.webp": img_9834550,
  "/src/assets/portfolio-images/9834554.webp": img_9834554,
  "/src/assets/portfolio-images/9834873.webp": img_9834873,
  "/src/assets/portfolio-images/9834877.webp": img_9834877,
  "/src/assets/portfolio-images/9834883.webp": img_9834883,
  "/src/assets/portfolio-images/9834924.webp": img_9834924,
  "/src/assets/portfolio-images/9834928.webp": img_9834928,
  "/src/assets/portfolio-images/9836453.webp": img_9836453,
  "/src/assets/portfolio-images/9836457.webp": img_9836457,
  "/src/assets/portfolio-images/9836517.webp": img_9836517,
  "/src/assets/portfolio-images/9836580.webp": img_9836580,
  "/src/assets/portfolio-images/9836608.webp": img_9836608,
  "/src/assets/portfolio-images/9836613.webp": img_9836613,
  "/src/assets/portfolio-images/9836616.webp": img_9836616,
  "/src/assets/portfolio-images/9836617.webp": img_9836617,
  "/src/assets/portfolio-images/9836619.webp": img_9836619,
  "/src/assets/portfolio-images/9836621.webp": img_9836621,
  "/src/assets/portfolio-images/9836623.webp": img_9836623,
  "/src/assets/portfolio-images/9836627.webp": img_9836627,
  // Videos
  // Video posters
};

// Helper function to resolve image paths
function resolveImage(path: string): string {
  return imageMap[path] || path;
}

// TypeScript interfaces
export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectVideo {
  videoUrl: string;
  posterUrl: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  category: "conscious-fashion" | "environmental-portraiture" | "feminine-narrative";
  description?: string;
  client: string;
  year: string;
  role: string;
  coverImage: ProjectImage;
  images: ProjectImage[];
  videos?: ProjectVideo[]; // Optional: Direct video URLs
  pexelsPhotoIds?: number[]; // Optional: If set, fetch photos from Pexels API
}

export interface CVItem {
  year?: string;
  content: string;
}

export interface CVSection {
  title: string;
  items: CVItem[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  social: {
    instagram: string;
    handle: string;
  };
  siteUrl: string;
  siteName: string;
  copyright: string;
  about: {
    intro: string;
    paragraphs: string[];
    locationDetails: string;
    workingDetails: string;
  };
  cv: {
    sections: CVSection[];
  };
}

// Portfolio API
const data = portfolioData;

// Get profile/site configuration
export function getProfile(): Profile {
  const profile = data.profile;
  return {
    ...profile,
    title: localize(profile.title),
    tagline: localize(profile.tagline),
    bio: localize(profile.bio),
    about: {
      ...profile.about,
      intro: localize(profile.about.intro),
      paragraphs: profile.about.paragraphs.map(localize),
      locationDetails: localize(profile.about.locationDetails),
      workingDetails: localize(profile.about.workingDetails),
    },
    cv: {
      sections: profile.cv.sections.map((section) => ({
        ...section,
        title: localize(section.title),
        items: section.items.map((item) => ({
          ...item,
          content: localize(item.content),
        })),
      })),
    },
  } as Profile;
}

// Get all projects
export function getProjects(): Project[] {
  return data.projects.map((project) => ({
    ...project,
    title: localize(project.title),
    description: project.description ? localize(project.description) : undefined,
    coverImage: {
      ...project.coverImage,
      src: resolveImage(project.coverImage.src),
    },
    images: project.images.map((image) => ({
      ...image,
      src: resolveImage(image.src),
    })),
  })) as Project[];
}

// Get projects by category
export function getProjectsByCategory(
  category: Project["category"]
): Project[] {
  return getProjects().filter((project) => project.category === category);
}

// Get single project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

// Export as Portfolio object for backward compatibility
export const Portfolio = {
  profile: getProfile,
  projects: getProjects,
  getProjectsByCategory,
  getProjectBySlug,
};
