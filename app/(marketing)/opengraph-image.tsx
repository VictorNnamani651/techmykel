import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social-share (Open Graph) image for the landing page — what shows when the
// link is pasted into WhatsApp / Facebook. Built from the Techmykel logo mark.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Techmykel — Refer friends, get paid";

export default async function OpengraphImage() {
  const markData = await readFile(
    join(process.cwd(), "public", "techmykel-mark.png"),
  );
  const markSrc = `data:image/png;base64,${markData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0052d6 0%, #004ac6 45%, #00214f 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo lockup */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={104} height={104} alt="" />
          <span
            style={{
              marginLeft: "20px",
              fontSize: "56px",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            Techmykel
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "56px" }}>
          <span style={{ fontSize: "92px", fontWeight: 700, lineHeight: 1.05 }}>
            Refer friends.
          </span>
          <span
            style={{
              fontSize: "92px",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#f5b301",
            }}
          >
            Get paid.
          </span>
        </div>

        {/* Subline */}
        <span
          style={{
            marginTop: "36px",
            fontSize: "34px",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Earn cash, airtime or data for every phone you send to Techmykel.
        </span>
        <span
          style={{
            marginTop: "16px",
            fontSize: "24px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Phone repairs & referral rewards · Abakaliki
        </span>
      </div>
    ),
    size,
  );
}
