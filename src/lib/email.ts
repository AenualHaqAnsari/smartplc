import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

type OrderEmailItem = {
  productName: string;
  quantity: number;
  totalPrice: number | string;
};

type OrderConfirmationEmailData = {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: OrderEmailItem[];
  total: number | string;
};

export async function sendOrderConfirmationEmail({
  customerName,
  customerEmail,
  orderNumber,
  items,
  total,
}: OrderConfirmationEmailData) {
  const from =
    process.env.ORDER_EMAIL_FROM;

  if (
    !process.env.RESEND_API_KEY ||
    !from
  ) {
    throw new Error(
      "Email configuration is incomplete."
    );
  }

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #332d24;">
            ${item.productName}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #332d24;text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #332d24;text-align:right;">
            $${Number(item.totalPrice).toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  const { error } = await resend.emails.send({
    from,
    to: [customerEmail],
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="margin:0;padding:40px 20px;background:#0c0b09;color:#f1f5f9;font-family:Arial,sans-serif;">
        <div style="max-width:650px;margin:0 auto;background:#12100d;border:1px solid #3a342a;padding:35px;">
          
          <div style="text-align:center;border-bottom:1px solid #332d24;padding-bottom:25px;">
            <div style="font-size:24px;font-weight:bold;letter-spacing:4px;color:#d6b875;">
              INDUSTRIAL AUTOMATION
            </div>
          </div>

          <div style="padding:30px 0;">
            <div style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#b49458;">
              Order Confirmed
            </div>

            <h1 style="font-family:Georgia,serif;font-size:36px;margin:10px 0;color:#f1f5f9;">
              Thank You, ${customerName}
            </h1>

            <p style="color:#999184;line-height:1.7;">
              Your payment has been successfully received and your order has been confirmed.
            </p>

            <p style="color:#0284c7;font-weight:bold;">
              Order ${orderNumber}
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;color:#f1f5f9;">
            <thead>
              <tr>
                <th style="padding:12px 0;text-align:left;color:#8f877b;font-size:12px;">
                  PRODUCT
                </th>
                <th style="padding:12px 0;text-align:center;color:#8f877b;font-size:12px;">
                  QTY
                </th>
                <th style="padding:12px 0;text-align:right;color:#8f877b;font-size:12px;">
                  TOTAL
                </th>
              </tr>
            </thead>

            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div style="margin-top:25px;padding-top:20px;border-top:1px solid #332d24;text-align:right;">
            <span style="color:#999184;">Total Paid</span>
            <strong style="display:block;margin-top:6px;font-size:28px;color:#0284c7;">
              $${Number(total).toFixed(2)}
            </strong>
          </div>

          <div style="margin-top:35px;padding-top:25px;border-top:1px solid #332d24;text-align:center;color:#777064;font-size:12px;line-height:1.7;">
            Thank you for choosing Industrial Automation.
            <br />
            Your order is now being prepared.
          </div>

        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(
      error.message ||
        "Unable to send order confirmation email."
    );
  }
}export type QuoteRequestEmailData = {
  name: string; company: string; email: string; phone: string;
  productService: string; requirement: string; quantity?: number; message: string;
};

export async function sendQuoteRequestEmail(data: QuoteRequestEmailData) {
  const from = process.env.ORDER_EMAIL_FROM;
  const to = process.env.QUOTE_EMAIL_TO;
  if (!process.env.RESEND_API_KEY || !from || !to) {
    throw new Error("Quote email configuration is incomplete.");
  }
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  })[char] ?? char);
  const rows = [
    ["Name", data.name], ["Company", data.company], ["Email", data.email],
    ["Phone", data.phone], ["Product or service", data.productService],
    ["Requirement", data.requirement], ["Quantity", data.quantity ? String(data.quantity) : "Not specified"],
    ["Message", data.message],
  ].map(([label, value]) => `<tr><th align="left" style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(label)}</th><td style="padding:10px;border-bottom:1px solid #e2e8f0">${escapeHtml(value)}</td></tr>`).join("");
  const { error } = await resend.emails.send({
    from, to: [to], replyTo: data.email,
    subject: `Quote enquiry: ${data.productService || data.requirement}`,
    html: `<div style="font-family:Arial,sans-serif;color:#17212b"><h1>Industrial Automation Quote Enquiry</h1><table style="border-collapse:collapse;width:100%">${rows}</table></div>`,
  });
  if (error) throw new Error(error.message || "Unable to send quote enquiry.");
}
