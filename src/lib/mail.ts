import "server-only";
import nodemailer from "nodemailer";

/**
 * Teklif talebi bildirimi: Google Workspace SMTP (smtp.gmail.com) üzerinden gönderilir.
 * Ortam değişkenleri:
 *   SMTP_USER        gönderen hesap (ör. info@aranmetal.com)
 *   SMTP_PASS        o hesabın uygulama şifresi (boşluksuz)
 *   QUOTE_NOTIFY_TO  alıcı(lar), virgülle ayrılabilir; boşsa SMTP_USER
 * Değişkenler yoksa sessizce atlanır; talep yine veritabanına kaydedilir.
 */

export type QuoteMail = {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  message: string;
  locale: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function sendQuoteNotification(q: QuoteMail) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  if (!user || !pass) return { sent: false as const, reason: "not-configured" };

  const to = process.env.QUOTE_NOTIFY_TO || user;
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const rows: [string, string][] = [
    ["Ad Soyad", q.name],
    ["Firma", q.company],
    ["E-posta", q.email],
    ["Telefon", q.phone],
    ["Malzeme", q.product],
    ["Miktar", q.quantity],
    ["Dil", q.locale.toUpperCase()],
  ];

  const text = [
    "Web sitesinden yeni teklif talebi",
    "",
    ...rows.map(([k, v]) => `${k}: ${v || "-"}`),
    "",
    "Not / Spesifikasyon:",
    q.message || "-",
    "",
    "Talep admin panelinde de kayıtlıdır: /admin/quotes",
  ].join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1d1612">
  <h2 style="font-size:18px;margin:0 0 12px">Yeni teklif talebi</h2>
  <table cellpadding="6" style="border-collapse:collapse">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="color:#6b5f56;border-bottom:1px solid #e4dacb;white-space:nowrap">${esc(k)}</td><td style="border-bottom:1px solid #e4dacb">${esc(v || "-")}</td></tr>`,
      )
      .join("")}
  </table>
  <p style="margin:16px 0 4px;color:#6b5f56">Not / Spesifikasyon</p>
  <p style="margin:0;white-space:pre-wrap">${esc(q.message || "-")}</p>
  <p style="margin:20px 0 0;color:#6b5f56;font-size:12px">Talep admin panelinde de kayıtlıdır (Teklif Talepleri). Bu e-postayı yanıtlarsanız doğrudan müşteriye gider.</p>
</div>`;

  await transport.sendMail({
    from: { name: "Aran Metal Web Sitesi", address: user },
    to,
    replyTo: { name: q.name, address: q.email },
    subject: `Teklif talebi: ${q.company}${q.product ? ` · ${q.product}` : ""}`,
    text,
    html,
  });
  return { sent: true as const };
}
