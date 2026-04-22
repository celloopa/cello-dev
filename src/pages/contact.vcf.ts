import type { APIRoute } from "astro";
import cv from "@cv";

const escapeVCardValue = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return value;
};

export const GET: APIRoute = () => {
  const { basics } = cv;
  const linkedIn = basics.profiles.find(
    ({ network }) => network === "LinkedIn",
  )?.url;
  const phone = normalizePhone(basics.phone);
  const location = [basics.location.city, basics.location.region]
    .filter(Boolean)
    .join(", ");

  const vCardLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(basics.name)}`,
    "N:Rondon;Marcelo;;;",
    `TITLE:${escapeVCardValue(basics.label)}`,
    `EMAIL;TYPE=INTERNET:${escapeVCardValue(basics.email)}`,
    `TEL;TYPE=CELL:${escapeVCardValue(phone)}`,
    `URL:${escapeVCardValue(basics.url)}`,
    linkedIn ? `URL:${escapeVCardValue(linkedIn)}` : "",
    location ? `ADR;TYPE=WORK:;;;;${escapeVCardValue(location)};;;` : "",
    `NOTE:${escapeVCardValue(basics.summary)}`,
    `REV:${new Date().toISOString()}`,
    "END:VCARD",
  ].filter(Boolean);

  return new Response(vCardLines.join("\r\n"), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="marcelo-rondon.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
};
