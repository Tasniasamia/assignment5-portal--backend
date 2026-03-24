import puppeteer from "puppeteer";

export const generatePaymentConfirmationImage = async (data: {
  authorName: string;
  authorEmail: string;
  ideaTitle: string;
  amount: number;
  ideaId: string;
  paymentId: string;
  date: string;
}): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: #f0f4f8; padding: 30px; }
          .card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; text-align: center; padding: 32px 20px 24px; }
          .header h1 { font-size: 26px; letter-spacing: 1px; }
          .badge { display: inline-block; background: #4caf50; color: white; padding: 6px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-top: 12px; }
          .body { padding: 28px 32px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #16a34a; background: #f0fdf4; border-left: 4px solid #16a34a; padding: 8px 14px; border-radius: 4px; margin-bottom: 14px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .label { font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 2px; }
          .value { font-size: 14px; color: #222; font-weight: 500; }
          .payment-box { background: #fffbf0; border: 1px solid #ffe082; border-radius: 10px; padding: 18px 20px; }
          .total-row { display: flex; justify-content: space-between; border-top: 1px dashed #ffe082; margin-top: 14px; padding-top: 14px; }
          .total-amount { font-size: 22px; font-weight: bold; color: #16a34a; }
          .footer { text-align: center; background: #f9f9f9; border-top: 1px solid #eee; padding: 16px; font-size: 12px; color: #aaa; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>🌱 EcoSpark Hub</h1>
            <p>Official Payment Receipt</p>
            <div class="badge">✅ Payment Successful</div>
            <p style="font-size:12px;opacity:.75;margin-top:8px">📅 ${data.date}</p>
          </div>
          <div class="body">
            <div class="section">
              <div class="section-title">👤 Buyer Information</div>
              <div class="info-grid">
                <div><div class="label">Full Name</div><div class="value">${data.authorName}</div></div>
                <div><div class="label">Email</div><div class="value">${data.authorEmail}</div></div>
              </div>
            </div>
            <div class="section">
              <div class="section-title">💡 Idea Information</div>
              <div class="info-grid">
                <div><div class="label">Idea Title</div><div class="value">${data.ideaTitle}</div></div>
                <div><div class="label">Idea ID</div><div class="value" style="font-size:11px">${data.ideaId}</div></div>
              </div>
            </div>
            <div class="section">
              <div class="section-title">💳 Payment Information</div>
              <div class="payment-box">
                <div class="info-grid">
                  <div><div class="label">Payment ID</div><div class="value" style="font-size:11px">${data.paymentId}</div></div>
                  <div><div class="label">Payment Method</div><div class="value">Card (Stripe)</div></div>
                  <div><div class="label">Status</div><div class="value" style="color:#2e7d32;font-weight:bold">PAID ✅</div></div>
                </div>
                <div class="total-row">
                  <span style="font-size:15px;font-weight:bold;color:#555">Total Amount Paid</span>
                  <span class="total-amount">৳ ${data.amount}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>This is a computer-generated payment receipt. Please keep this for your records.</p>
          </div>
        </div>
      </body>
    </html>
  `);

  const buffer = await page.screenshot({ type: "png", fullPage: true });
  await browser.close();
  return buffer as Buffer;
};