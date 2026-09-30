const twilio = require('twilio');

let _client = null;

function getClient() {
  if (_client) return _client;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) return null;

  _client = twilio(accountSid, authToken);
  return _client;
}

/**
 * Send a WhatsApp message via Twilio.
 * The phone number must be in E.164 format: +233XXXXXXXXX
 *
 * @param {string} to      - Customer phone in E.164
 * @param {string} message - Plain text message body
 */
async function sendWhatsApp(to, message) {
  const client = getClient();

  if (!client) {
    console.warn('[WhatsApp] Twilio not configured — skipping WhatsApp to', to);
    return;
  }

  const from = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;

  // Normalise phone to E.164 (strip spaces, ensure leading +)
  const normalised = to.replace(/\s+/g, '').replace(/^00/, '+');

  try {
    const msg = await client.messages.create({
      from,
      to: `whatsapp:${normalised}`,
      body: message,
    });
    console.log(`[WhatsApp] Sent to ${normalised}: ${msg.sid}`);
    return msg;
  } catch (err) {
    // Non-fatal — log and continue
    console.error('[WhatsApp] Failed to send:', err.message);
  }
}

module.exports = { sendWhatsApp };
