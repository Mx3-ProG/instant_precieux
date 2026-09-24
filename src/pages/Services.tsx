import { Link } from "react-router-dom";
import LeftNav from "@/components/LeftNav";
import SEO from "@/components/SEO";
import HorizontalPage, { Panel } from "@/components/HorizontalPage";
import { serviceOffers } from "@/lib/services";
import { useI18n } from "@/i18n";

const Services = () => {
  const { t, tList, formatPrice } = useI18n();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("services.listName"),
    itemListElement: serviceOffers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: t(`offer.${offer.id}.name`),
        description: t(`offer.${offer.id}.description`),
        offers: {
          "@type": "Offer",
          price: offer.price,
          priceCurrency: offer.currency,
        },
      },
    })),
  };

  return (
    <>
      <SEO
        title={t("services.seoTitle")}
        description={t("services.seoDescription")}
        canonicalUrl="/services"
        jsonLd={jsonLd}
      />

      <LeftNav />

      <main className="relative z-0">
        <HorizontalPage>
          <Panel width="md:w-[420px]">
            <h1 className="text-lg uppercase mb-8">{t("services.title")}</h1>
            <p className="text-sm leading-relaxed opacity-80 mb-6">
              {t("services.intro")}
            </p>
            <p className="text-sm leading-relaxed opacity-60 mb-10">
              {t("services.intro2")}
            </p>
            <Link
              to="/reservation"
              className="inline-block text-xs uppercase tracking-widest border border-input px-5 py-3 hover:opacity-60 transition-opacity"
            >
              {t("services.cta")}
            </Link>
          </Panel>

          {serviceOffers.map((offer) => (
            <Panel key={offer.id} width="md:w-[420px]">
              <article className="border border-input p-[28px] md:min-h-[420px] flex flex-col">
                {offer.featured && (
                  <span className="text-[10px] uppercase tracking-widest opacity-60 mb-4">
                    {t("services.mostChosen")}
                  </span>
                )}
                <h2 className="text-lg uppercase mb-2">{t(`offer.${offer.id}.name`)}</h2>
                <p className="text-sm opacity-60 mb-6">{t(`offer.${offer.id}.tagline`)}</p>
                <p className="text-2xl font-light mb-1">
                  {formatPrice(offer.price, offer.currency)}
                </p>
                <p className="text-xs opacity-60 mb-6">{t(`offer.${offer.id}.duration`)}</p>
                <p className="text-sm leading-relaxed opacity-80 mb-6">
                  {t(`offer.${offer.id}.description`)}
                </p>
                <ul className="space-y-2 mb-8">
                  {tList(`offer.${offer.id}.deliverables`).map((item) => (
                    <li key={item} className="text-sm opacity-70">
                      — {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-col gap-3">
                  <Link
                    to={`/reservation?offer=${offer.id}`}
                    className="text-center text-xs uppercase tracking-widest bg-foreground text-background px-5 py-3 hover:opacity-80 transition-opacity"
                  >
                    {t("services.book")}
                  </Link>
                  <Link
                    to={`/checkout?offer=${offer.id}`}
                    className="text-center text-xs uppercase tracking-widest border border-input px-5 py-3 hover:opacity-60 transition-opacity"
                  >
                    {t("services.buyNow")}
                  </Link>
                </div>
              </article>
            </Panel>
          ))}
        </HorizontalPage>
      </main>
    </>
  );
};

export default Services;
