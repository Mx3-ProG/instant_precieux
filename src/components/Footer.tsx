import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { Portfolio } from "@/lib/data";
import { getFooterNav } from "@/lib/navigation";
import { useI18n } from "@/i18n";

const Footer = () => {
  const profile = Portfolio.profile();
  const footerLinks = getFooterNav();
  const { t } = useI18n();

  return (
    <footer className="pt-16 pb-8 px-[15px] md:px-[30px]">
      <h2 className="text-7xl md:text-9xl font-light tracking-tight text-center mb-12">
        {profile.siteName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 max-w-7xl mx-auto">
        <nav className="flex flex-col gap-y-3">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm uppercase tracking-widest underline hover:no-underline transition-all duration-300"
            >
              {link.labelKey ? t(link.labelKey) : link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-col gap-y-3 md:items-end">
          <a
            href={profile.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity duration-300 flex items-center gap-x-2 py-2"
            aria-label={t("nav.instagram")}
          >
            <Instagram className="w-5 h-5" />
            Instagram
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-sm uppercase tracking-widest hover:opacity-60 transition-opacity duration-300 flex items-center gap-x-2 py-2"
            aria-label={t("footer.emailAria")}
          >
            <Mail className="w-5 h-5" />
            Email
          </a>

          <p className="text-xs text-muted-foreground mt-8">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
