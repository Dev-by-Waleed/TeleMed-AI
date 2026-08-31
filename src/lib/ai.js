const MODEL = "gemini-1.5-flash"

const PROMPT =
  "Act as a medical assistant. Explain this medical report in simple, easy-to-understand " +
  "language for a patient. Avoid complex terminology and summarize key findings, possible " +
  "concerns, and general meaning."

// Sends a document (PDF bytes) to Gemini 1.5 Flash for a patient-friendly summary.
// Returns { ok: true, summary } or { ok: false, error }.
export async function summarizeDocument(fileBase64) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { ok: false, error: "GEMINI_API_KEY is not configured." }
  }

  let res
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: PROMPT },
                {
                  inline_data: {
                    mime_type: "application/pdf",
                    data: fileBase64,
                  },
                },
              ],
            },
          ],
        }),
      }
    )
  } catch (err) {
    return { ok: false, error: "AI request failed: " + err.message }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    return { ok: false, error: `AI request failed (${res.status}): ${text}` }
  }

  const json = await res.json()
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    return { ok: false, error: "AI returned no summary." }
  }
  return { ok: true, summary: text.trim() }
}
