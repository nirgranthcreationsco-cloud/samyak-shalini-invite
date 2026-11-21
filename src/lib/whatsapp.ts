import type { InviteConfig } from "@/types/invite";

export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function buildWhatsAppUrl(number: string, text: string): string {
  const n = normalizeWhatsAppNumber(number);
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function blessingMessage(
  config: InviteConfig,
  fromName: string,
  message: string
): string {
  return [
    `Blessings for ${config.groom.name} & ${config.bride.name}`,
    "",
    `From: ${fromName}`,
    "",
    message,
  ].join("\n");
}

export function rsvpMessage(
  config: InviteConfig,
  fromName: string,
  attending: boolean,
  guestCount: number
): string {
  const status = attending ? "Attending" : "Unable to attend";
  const guests = attending ? `\nGuests: ${guestCount}` : "";
  return [
    `RSVP for ${config.groom.name} & ${config.bride.name}`,
    "",
    `From: ${fromName}`,
    `Status: ${status}${guests}`,
  ].join("\n");
}

export function shareInviteMessage(
  config: InviteConfig,
  guestName: string,
  url: string
): string {
  return [
    `Dear ${guestName},`,
    "",
    `You are warmly invited to celebrate the wedding of ${config.groom.name} & ${config.bride.name}.`,
    "",
    `Please open your personal invitation:`,
    url,
    "",
    `With love,`,
    `${config.groom.name} & ${config.bride.name}`,
  ].join("\n");
}
