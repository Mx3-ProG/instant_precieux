type AppointmentDefaults = {
  appointment_at?: string | null;
  preferred_date?: string | null;
};

const pad = (value: number) => String(value).padStart(2, "0");

function asLocalDateTime(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

/**
 * Préremplit un futur créneau. Un ancien rendez-vous ne doit jamais être
 * reproposé implicitement : l'API le refuserait comme date passée.
 */
export function defaultAppointmentSlot(quote: AppointmentDefaults, now = new Date()) {
  const candidates = [
    quote.appointment_at ? new Date(quote.appointment_at) : null,
    quote.preferred_date ? new Date(`${quote.preferred_date}T10:00`) : null,
  ];
  const future = candidates.find((candidate) => candidate && !Number.isNaN(candidate.getTime()) && candidate.getTime() > now.getTime());
  const slot = future ? new Date(future) : new Date(now);
  if (!future) {
    slot.setDate(slot.getDate() + 7);
    slot.setHours(10, 0, 0, 0);
  }
  return asLocalDateTime(slot);
}

export function minimumAppointmentSlot(now = new Date()) {
  const minimum = new Date(now);
  minimum.setMinutes(minimum.getMinutes() + 1, 0, 0);
  return asLocalDateTime(minimum);
}
