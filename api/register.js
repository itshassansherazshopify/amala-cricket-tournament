const requiredFields = [
  "teamName",
  "captainName",
  "mobileNumber",
  "whatsappNumber",
  "emailAddress",
  "numberOfPlayers",
  "playingXi"
];

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function lineBreaks(value = "") {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function buildEmailHtml(data) {
  return `
    <h2>AMAALA Tape Ball Cricket Tournament 2026 - New Team Registration</h2>
    <h3>Team Information</h3>
    <p><strong>Team Name:</strong> ${escapeHtml(data.teamName)}</p>
    <p><strong>Captain Name:</strong> ${escapeHtml(data.captainName)}</p>
    <p><strong>Mobile Number:</strong> ${escapeHtml(data.mobileNumber)}</p>
    <p><strong>WhatsApp Number:</strong> ${escapeHtml(data.whatsappNumber)}</p>
    <p><strong>Email Address:</strong> ${escapeHtml(data.emailAddress)}</p>
    <p><strong>Company/Organization:</strong> ${escapeHtml(data.organization || "Not provided")}</p>
    <p><strong>City:</strong> ${escapeHtml(data.city || "Not provided")}</p>

    <h3>Squad Details</h3>
    <p><strong>Number of Players:</strong> ${escapeHtml(data.numberOfPlayers)}</p>
    <p><strong>Playing XI:</strong><br>${lineBreaks(data.playingXi)}</p>
    <p><strong>Substitute Players:</strong><br>${lineBreaks(data.substitutePlayers || "Not provided")}</p>
    <p><strong>Team Jersey Colour:</strong> ${escapeHtml(data.jerseyColour || "Not provided")}</p>
    <p><strong>Team Logo File Name:</strong> ${escapeHtml(data.teamLogoName || "Not uploaded")}</p>

    <h3>Declaration</h3>
    <p>${data.declaration ? "Confirmed" : "Not confirmed"}</p>
  `;
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Only POST requests are allowed." });
  }

  const data = request.body || {};
  const missingField = requiredFields.find((field) => !data[field]);

  if (missingField || !data.declaration) {
    return response.status(400).json({ message: "Please complete all required fields and accept the declaration." });
  }

  if (!process.env.RESEND_API_KEY || !process.env.REGISTRATION_TO_EMAIL || !process.env.REGISTRATION_FROM_EMAIL) {
    return response.status(500).json({
      message: "Email is not configured yet. Add RESEND_API_KEY, REGISTRATION_TO_EMAIL, and REGISTRATION_FROM_EMAIL in Vercel."
    });
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.REGISTRATION_FROM_EMAIL,
      to: process.env.REGISTRATION_TO_EMAIL,
      reply_to: data.emailAddress,
      subject: `New Registration: ${data.teamName}`,
      html: buildEmailHtml(data)
    })
  });

  if (!emailResponse.ok) {
    let resendError = "Please check email settings.";

    try {
      const errorData = await emailResponse.json();
      resendError = errorData.message || errorData.error || resendError;
      console.error("Resend email delivery failed:", errorData);
    } catch (error) {
      const errorText = await emailResponse.text();
      resendError = errorText || resendError;
      console.error("Resend email delivery failed:", errorText);
    }

    return response.status(502).json({ message: `Registration received, but email delivery failed. ${resendError}` });
  }

  return response.status(200).json({ message: "Registration submitted successfully." });
};
