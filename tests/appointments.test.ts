import assert from "node:assert/strict";
import test from "node:test";
import {
  adminAppointmentConfirmed,
  adminNewRequest,
  adminRescheduleRequested,
  appointmentIcs,
  clientAppointmentConfirmed,
  clientAppointmentProposal,
  clientAppointmentReminder,
  clientRequestDeclined,
  clientRequestReceived,
  clientRescheduleReceived,
  type AppointmentInfo,
  type QuoteInfo,
} from "../api/_lib/emails.ts";
import { sendEmails } from "../api/_lib/server.ts";
import { defaultAppointmentSlot, minimumAppointmentSlot } from "../src/lib/appointments.ts";

const quote: QuoteInfo = {
  id: "8f469efb-dbc1-42aa-89c7-50ebf60a6677",
  name: "Camille Moreau",
  email: "camille@example.com",
  phone: "0612345678",
  city: "Lyon",
  category: "Famille",
  category_label: "Famille",
  service_id: "souvenir",
  service_name: "Souvenir",
  service_price: 100,
  preferred_date: "2026-10-08",
  people_count: 4,
  message: "Nous aimerions une séance en famille.",
  lang: "fr",
  created_at: "2026-09-24T10:00:00.000Z",
};
const appointment: AppointmentInfo = { at: "2026-10-08T08:00:00.000Z", duration: 90, location: "Lyon", note: "Tenue claire conseillée." };
const siteUrl = "https://linstantprecieux.fr";

test("une reproposition ignore l'ancien rendez-vous passé", () => {
  const now = new Date(2026, 8, 24, 12, 0, 0);
  const slot = defaultAppointmentSlot({ appointment_at: "2026-09-20T08:00:00.000Z" }, now);
  assert.equal(slot, "2026-10-01T10:00");
  assert.ok(new Date(slot).getTime() > now.getTime());
});

test("une date souhaitée future reste prioritaire sur le créneau de secours", () => {
  const now = new Date(2026, 8, 24, 12, 0, 0);
  assert.equal(defaultAppointmentSlot({ preferred_date: "2026-09-30" }, now), "2026-09-30T10:00");
  assert.equal(minimumAppointmentSlot(now), "2026-09-24T12:01");
});

test("un lot d'emails échoue dès que Resend refuse un envoi", async () => {
  const sent = await sendEmails([
    async () => ({ error: null }),
    async () => ({ error: { message: "domain not verified" } }),
  ]);
  assert.equal(sent, false);
});

test("un lot d'emails réussit uniquement quand tous les envois réussissent", async () => {
  const sent = await sendEmails([
    async () => ({ error: null }),
    async () => ({}),
  ]);
  assert.equal(sent, true);
});

test("tous les emails transactionnels ont un sujet, une version HTML et une version texte", () => {
  const links = { confirm: `${siteUrl}/rendez-vous/token?action=confirmer`, reschedule: `${siteUrl}/rendez-vous/token?action=autre-date` };
  const emails = [
    clientRequestReceived(quote, siteUrl),
    clientAppointmentProposal(quote, appointment, links, siteUrl),
    clientAppointmentConfirmed(quote, appointment, siteUrl),
    clientAppointmentReminder(quote, appointment, siteUrl),
    clientRescheduleReceived(quote, "Le samedi matin.", siteUrl),
    clientRequestDeclined(quote, "Agenda complet.", siteUrl),
    adminNewRequest(quote, siteUrl),
    adminAppointmentConfirmed(quote, appointment, siteUrl),
    adminRescheduleRequested(quote, appointment, "Le samedi matin.", siteUrl),
  ];
  assert.equal(emails.length, 9);
  for (const email of emails) {
    assert.ok(email.subject.length > 5);
    assert.match(email.html, /<html/i);
    assert.ok(email.text.length > 20);
    assert.doesNotMatch(`${email.subject}${email.html}${email.text}`, /\{(?:name|date|time)\}/);
  }
  assert.match(emails[1].html, /action=confirmer/);
  assert.match(emails[1].html, /action=autre-date/);
});

test("l'invitation calendrier contient le bon créneau et le bon lieu", () => {
  const ics = appointmentIcs(quote, appointment, "bonjour@linstantprecieux.fr");
  assert.match(ics, /DTSTART:20261008T080000Z/);
  assert.match(ics, /DTEND:20261008T093000Z/);
  assert.match(ics, /LOCATION:Lyon/);
  assert.match(ics, /ORGANIZER;CN=L'instant précieux:mailto:bonjour@linstantprecieux.fr/);
});
