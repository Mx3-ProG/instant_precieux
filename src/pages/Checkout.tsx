import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LeftNav from "@/components/LeftNav";
import SEO from "@/components/SEO";
import HorizontalPage, { Panel } from "@/components/HorizontalPage";
import { useToast } from "@/hooks/use-toast";
import { getOfferById, serviceOffers } from "@/lib/services";
import { useI18n } from "@/i18n";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t, tList, formatPrice } = useI18n();

  const offer = getOfferById(searchParams.get("offer")) ?? serviceOffers[0];
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const isValid =
    customer.name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim());

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);

    // PLACEHOLDER — tunnel de paiement Stripe
    // Étape suivante : appeler une fonction backend `create-checkout`
    // qui crée une session Stripe Checkout puis rediriger vers session.url.
    //
    // const { data } = await supabase.functions.invoke("create-checkout", {
    //   body: { priceId: offer.stripePriceId, date, time, customer },
    // });
    // window.location.href = data.url;

    await new Promise((resolve) => setTimeout(resolve, 800));

    toast({
      title: t("checkout.toastTitle"),
      description: t("checkout.toastDescription"),
    });
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full px-4 py-3 border border-input bg-background focus:border-foreground focus:outline-none transition-colors disabled:opacity-50 text-sm";

  return (
    <>
      <SEO
        title={t("checkout.seoTitle")}
        description={t("checkout.seoDescription")}
        canonicalUrl="/checkout"
      />

      <LeftNav />

      <main className="relative z-0">
        <HorizontalPage>
          <Panel width="md:w-[380px]">
            <h1 className="text-lg uppercase mb-8">{t("checkout.title")}</h1>
            <div className="border border-input p-[24px]">
              <h2 className="text-sm uppercase mb-2">{t(`offer.${offer.id}.name`)}</h2>
              <p className="text-xs opacity-60 mb-6">{t(`offer.${offer.id}.duration`)}</p>
              <ul className="space-y-2 mb-6">
                {tList(`offer.${offer.id}.deliverables`).map((item) => (
                  <li key={item} className="text-sm opacity-70">
                    — {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-input pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-60">{t("booking.date")}</span>
                  <span>{date ?? t("checkout.tbd")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">{t("booking.time")}</span>
                  <span>{time ?? t("checkout.tbd")}</span>
                </div>
                <div className="flex justify-between text-base pt-2">
                  <span>{t("booking.total")}</span>
                  <span>{formatPrice(offer.price, offer.currency)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/reservation"
              className="inline-block text-xs uppercase tracking-widest mt-6 opacity-60 hover:opacity-100 transition-opacity"
            >
              {t("checkout.changeDate")}
            </Link>
          </Panel>

          <Panel width="md:w-[440px]">
            <h2 className="text-lg uppercase mb-8">{t("checkout.yourDetails")}</h2>
            <form onSubmit={handlePay} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs opacity-60 mb-2">
                  {t("checkout.fullName")}
                </label>
                <input
                  id="name"
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  maxLength={100}
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs opacity-60 mb-2">
                  {t("checkout.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={handleChange}
                  maxLength={255}
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs opacity-60 mb-2">
                  {t("checkout.phone")}
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  maxLength={30}
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-xs opacity-60 mb-2">
                  {t("checkout.notes")}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={customer.notes}
                  onChange={handleChange}
                  maxLength={1000}
                  disabled={isSubmitting}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full text-xs uppercase tracking-widest bg-foreground text-background px-5 py-3 hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t("checkout.redirecting")
                  : t("checkout.pay", {
                      price: formatPrice(offer.price, offer.currency),
                    })}
              </button>
            </form>
          </Panel>

          <Panel width="md:w-[340px]">
            <h2 className="text-lg uppercase mb-8">{t("checkout.payment")}</h2>
            <p className="text-sm leading-relaxed opacity-70 mb-6">
              {t("checkout.paymentText")}
            </p>
            <div className="border border-dashed border-input p-6 mb-6">
              <p className="text-xs uppercase tracking-widest opacity-50 mb-3">
                {t("checkout.stripeSlot")}
              </p>
              <p className="text-xs leading-relaxed opacity-60">
                {t("checkout.stripeSlotText")}
              </p>
            </div>
            <ul className="space-y-2 text-xs opacity-60">
              <li>— {t("checkout.perk1")}</li>
              <li>— {t("checkout.perk2")}</li>
              <li>— {t("checkout.perk3")}</li>
            </ul>
          </Panel>
        </HorizontalPage>
      </main>
    </>
  );
};

export default Checkout;
