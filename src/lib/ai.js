const MODEL = "gemini-2.5-flash"

const PROMPT =
  "Act as a medical assistant. Explain this medical report in simple, easy-to-understand " +
  "language for a patient. Avoid complex terminology and summarize key findings, possible " +
  "concerns, and general meaning."

// Time limit for the Gemini request. Without this the fetch could hang forever,
// leaving the report stuck in "processing" and the UI never showing an error.
const AI_TIMEOUT_MS = 60000

// Sends a document (PDF bytes) to Gemini for a patient-friendly summary.
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
        signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      }
    )
  } catch (err) {
    if (err?.name === "TimeoutError") {
      return { ok: false, error: "AI request timed out. Please retry." }
    }
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
