/**
 * VLM check for the sharp-rendered OG test image — is the Arabic shaped
 * correctly (connected letters, RTL order) and is the layout intact?
 */
import ZAI from "z-ai-web-dev-sdk";
import { readFileSync, writeFileSync } from "node:fs";

async function main() {
  const zai = await ZAI.create();
  const b64 = readFileSync("scripts/og-sharp-test.png").toString("base64");

  const res = await zai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `This is a social-share (Open Graph) image. Answer strictly:
1) Transcribe the large Arabic name exactly. Are the Arabic letters connected/shaped correctly (real Arabic, not isolated/garbled letters)? 
2) Is the text right-to-left ordered properly?
3) List any visual glitches (tofu boxes, wrong direction, overlaps).
Be concise.`,
          },
          { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
        ],
      },
    ],
  });

  const content = res.choices[0]?.message?.content ?? "";
  console.log(content);
  writeFileSync(
    "scripts/vlm/og-sharp-test.json",
    JSON.stringify({ ...res, choices: [{ message: { content } }] }, null, 2),
  );
}

main().catch((e) => {
  console.error("VLM check failed:", e?.message ?? e);
  process.exit(1);
});
