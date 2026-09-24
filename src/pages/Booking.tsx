import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LeftNav from "@/components/LeftNav";
import SEO from "@/components/SEO";
import HorizontalPage, { Panel } from "@/components/HorizontalPage";
import { serviceOffers, getOfferById } from "@/lib/services";
import { useI18n } from "@/i18n";

const TIME_SLOTS = ["09:00", "11:00", "14:00", "16:00", "18:00"];

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, tList, formatPrice, locale } = useI18n();
  const WEEKDAYS = tList("booking.weekdays");

  const [offerId, setOfferId] = useState<string>(
    searchParams.get("offer") ?? serviceOffers[0].id
  );
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const offer = getOfferById(offerId) ?? serviceOffers[0];

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // lundi = 0
    const total = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [cursor]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthLabel = cursor.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const canContinue = Boolean(selectedDate && selectedSlot);

  const goToCheckout = () => {
    if (!canContinue) return;
    navigate(
      `/checkout?offer=${offer.id}&date=${selectedDate}&time=${selectedSlot}`
    );
  };

  return (
    <>
      <SEO
        title={t("booking.seoTitle")}
        description={t("booking.seoDescription")}
        canonicalUrl="/reservation"
      />

      <LeftNav />

      <main className="relative z-0">
        <HorizontalPage>
          <Panel width="md:w-[360px]">
            <h1 className="text-lg uppercase mb-8">{t("booking.title")}</h1>
            <p className="text-sm leading-relaxed opacity-70 mb-8">
              {t("booking.intro")}
            </p>
            <div className="space-y-3">
              {serviceOffers.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setOfferId(item.id)}
                  className={`w-full text-left border p-4 transition-opacity ${
                    item.id === offer.id
                      ? "border-foreground"
                      : "border-input opacity-60 hover:opacity-100"
                  }`}
                >
                  <span className="block text-sm">{t(`offer.${item.id}.name`)}</span>
                  <span className="block text-xs opacity-60 mt-1">
                    {t(`offer.${item.id}.duration`)} · {formatPrice(item.price, item.currency)}
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel width="md:w-[420px]">
            <h2 className="text-lg uppercase mb-8">{t("booking.calendar")}</h2>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  setCursor(
                    new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
                  )
                }
                className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                aria-label={t("booking.prevMonth")}
              >
                ←
              </button>
              <span className="text-sm capitalize">{monthLabel}</span>
              <button
                onClick={() =>
                  setCursor(
                    new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
                  )
                }
                className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                aria-label={t("booking.nextMonth")}
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((day, i) => (
                <span
                  key={i}
                  className="text-[10px] text-center opacity-40 uppercase"
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) return <span key={`empty-${index}`} />;
                const iso = toISO(day);
                const isPast = day < today;
                const isWeekendClosed = day.getDay() === 0;
                const disabled = isPast || isWeekendClosed;
                const isSelected = selectedDate === iso;
                return (
                  <button
                    key={iso}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(iso);
                      setSelectedSlot(null);
                    }}
                    className={`aspect-square text-xs border transition-colors ${
                      isSelected
                        ? "bg-foreground text-background border-foreground"
                        : "border-input hover:border-foreground"
                    } ${disabled ? "opacity-25 cursor-not-allowed hover:border-input" : ""}`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] opacity-40 mt-4">
              {t("booking.closedNote")}
            </p>
          </Panel>

          <Panel width="md:w-[360px]">
            <h2 className="text-lg uppercase mb-8">{t("booking.slots")}</h2>
            {!selectedDate ? (
              <p className="text-sm opacity-60">
                {t("booking.pickDateFirst")}
              </p>
            ) : (
              <div className="space-y-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full text-left border px-4 py-3 text-sm transition-colors ${
                      selectedSlot === slot
                        ? "bg-foreground text-background border-foreground"
                        : "border-input hover:border-foreground"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </Panel>

          <Panel width="md:w-[360px]">
            <h2 className="text-lg uppercase mb-8">{t("booking.summary")}</h2>
            <dl className="space-y-4 text-sm mb-10">
              <div>
                <dt className="opacity-50 text-xs uppercase tracking-widest mb-1">
                  {t("booking.package")}
                </dt>
                <dd>{t(`offer.${offer.id}.name`)}</dd>
              </div>
              <div>
                <dt className="opacity-50 text-xs uppercase tracking-widest mb-1">
                  {t("booking.date")}
                </dt>
                <dd>{selectedDate ?? "—"}</dd>
              </div>
              <div>
                <dt className="opacity-50 text-xs uppercase tracking-widest mb-1">
                  {t("booking.time")}
                </dt>
                <dd>{selectedSlot ?? "—"}</dd>
              </div>
              <div>
                <dt className="opacity-50 text-xs uppercase tracking-widest mb-1">
                  {t("booking.total")}
                </dt>
                <dd>{formatPrice(offer.price, offer.currency)}</dd>
              </div>
            </dl>

            <button
              onClick={goToCheckout}
              disabled={!canContinue}
              className="w-full text-xs uppercase tracking-widest bg-foreground text-background px-5 py-3 hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t("booking.continue")}
            </button>
            <Link
              to="/services"
              className="block text-center text-xs uppercase tracking-widest mt-3 opacity-60 hover:opacity-100 transition-opacity"
            >
              {t("booking.backToOffers")}
            </Link>
          </Panel>
        </HorizontalPage>
      </main>
    </>
  );
};

export default Booking;
