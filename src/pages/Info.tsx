import { useState } from "react";
import LeftNav from "@/components/LeftNav";
import HorizontalPage, { Panel } from "@/components/HorizontalPage";

import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { Portfolio } from "@/lib/data";
import { useI18n } from "@/i18n";

const Info = () => {
  const profile = Portfolio.profile();
  const { toast } = useToast();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cvData = profile.cv;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("info.errFirstName");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("info.errLastName");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("info.errEmail");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("info.errEmailInvalid");
    }
    if (!formData.message.trim()) {
      newErrors.message = t("info.errMessage");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // TODO: Replace with actual API call when backend is ready
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
          title: t("info.sentTitle"),
          description: t("info.sentDescription"),
        });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
        setErrors({});
      } catch (error) {
        toast({
          title: t("info.errorTitle"),
          description: t("info.errorDescription"),
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.title,
      description: profile.bio,
      email: profile.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.location.split(", ")[0],
        addressRegion: profile.location.split(", ")[1],
        addressCountry: "US",
      },
    },
  };

  return (
    <>
      <SEO
        title={`Info - ${profile.name}`}
        description={profile.bio}
        canonicalUrl="/info"
        ogType="profile"
        jsonLd={jsonLd}
      />

      <LeftNav />

      <main className="relative z-0">
        <HorizontalPage>

          {/* About Section */}
          <Panel>

            <h1 className="text-lg uppercase mb-8">{t("info.about")}</h1>
            {profile.about.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm leading-relaxed opacity-80 mb-6"
              >
                {paragraph}
              </p>
            ))}
          </Panel>


          {/* CV Section */}
          <Panel>
            <h2 className="text-lg uppercase mb-4">{profile.name}</h2>
            <p className="text-sm font-normal mb-16 opacity-60">
              {profile.title}
            </p>

            <p className="text-sm font-normal mb-16 leading-relaxed opacity-80">
              {profile.about.intro}
            </p>

            <div className="space-y-16">
              {cvData.sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg uppercase mb-8 pb-2">
                    {section.title}
                  </h3>
                  <div className="space-y-6">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="grid grid-cols-[120px_1fr] gap-4"
                      >
                        {item.year && (
                          <div className="text-sm font-normal opacity-60">
                            {item.year}
                          </div>
                        )}
                        <div className={!item.year ? "col-span-2" : ""}>
                          <p className="text-sm font-normal">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8">
              <p className="text-sm font-normal opacity-60">
                {profile.about.locationDetails}
                <br />
                {profile.about.workingDetails}
              </p>
            </div>
          </Panel>


          {/* Contact Section */}
          <Panel>
            <h2 className="text-lg uppercase mb-12">{t("info.contact")}</h2>

            <div className="space-y-8 mb-12">
              <div>
                <p className="text-sm font-normal opacity-60 mb-2">{t("info.email")}</p>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm font-normal hover:opacity-60 transition-opacity"
                >
                  {profile.email}
                </a>
              </div>
              <div>
                <p className="text-sm font-normal opacity-60 mb-2">{t("info.social")}</p>
                <a
                  href={profile.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-normal hover:opacity-60 transition-opacity"
                >
                  {profile.social.handle}
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-normal opacity-60 mb-2"
                  >
                    {t("info.firstName")}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-border bg-background focus:border-foreground focus:outline-none transition-colors disabled:opacity-50"
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-normal opacity-60 mb-2"
                  >
                    {t("info.lastName")}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-border bg-background focus:border-foreground focus:outline-none transition-colors disabled:opacity-50"
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-normal opacity-60 mb-2"
                >
                  {t("info.emailField")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-border bg-background focus:border-foreground focus:outline-none transition-colors disabled:opacity-50"
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-normal opacity-60 mb-2"
                >
                  {t("info.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-border bg-background focus:border-foreground focus:outline-none transition-colors min-h-[200px] resize-none disabled:opacity-50"
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-foreground text-background text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("info.sending") : t("info.send")}
              </button>
            </form>
          </Panel>
        </HorizontalPage>
      </main>

    </>
  );
};

export default Info;
