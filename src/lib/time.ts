const IST_OFFSET_MINUTES = 330;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

function formatWithOffset(date: Date, offsetMinutes: number): string {
  const shifted = new Date(date.getTime() + offsetMinutes * 60 * 1000);

  const y = shifted.getUTCFullYear();
  const m = pad2(shifted.getUTCMonth() + 1);
  const d = pad2(shifted.getUTCDate());
  const hh = pad2(shifted.getUTCHours());
  const mm = pad2(shifted.getUTCMinutes());
  const ss = pad2(shifted.getUTCSeconds());
  const ms = pad3(shifted.getUTCMilliseconds());

  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const offH = pad2(Math.floor(abs / 60));
  const offM = pad2(abs % 60);

  return `${y}-${m}-${d}T${hh}:${mm}:${ss}.${ms}${sign}${offH}:${offM}`;
}

export function nowIstIso(): string {
  return formatWithOffset(new Date(), IST_OFFSET_MINUTES);
}

export function expiresInMinutesIstIso(minutes: number): string {
  return formatWithOffset(new Date(Date.now() + minutes * 60 * 1000), IST_OFFSET_MINUTES);
}

export function expiresInHoursIstIso(hours: number): string {
  return formatWithOffset(new Date(Date.now() + hours * 60 * 60 * 1000), IST_OFFSET_MINUTES);
}

export function isExpired(value: Date | string | null | undefined): boolean {
  if (!value) return false;
  const ms = new Date(value).getTime();
  if (Number.isNaN(ms)) return false;
  return ms < Date.now();
}
