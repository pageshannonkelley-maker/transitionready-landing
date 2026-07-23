export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { name, email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const response = await fetch(process.env.GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await response.json();
    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, error: data.error || "Unknown error" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
