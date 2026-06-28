import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
export const alt = "Мужская Эстетика — Парикмахерская, Ставрополь";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='265 265 504 504'><g fill='#C9A86A'><rect x='313' y='346' width='24' height='342'/><rect x='697' y='346' width='24' height='342'/><path d='M398 388 L421 388 L517 555 L613 388 L636 388 L636 615 L612 615 L612 429 L529 576 L505 576 L422 429 L422 615 L398 615 Z'/></g></svg>`;

export default async function OpengraphImage() {
  const [semibold, light] = await Promise.all([
    readFile(join(process.cwd(), "fonts/Montserrat-SemiBold.otf")),
    readFile(join(process.cwd(), "fonts/Montserrat-Light.otf")),
  ]);

  const logoData = `data:image/svg+xml;base64,${btoa(LOGO)}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#07070A",
          color: "#F4F0EB",
          fontFamily: "Montserrat",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, transparent, #C9A86A, transparent)" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoData} width={118} height={118} alt="" />
        <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: 10, marginTop: 34 }}>МУЖСКАЯ ЭСТЕТИКА</div>
        <div style={{ fontSize: 30, fontWeight: 300, letterSpacing: 6, color: "#9A968E", marginTop: 20 }}>ПАРИКМАХЕРСКАЯ · СТАВРОПОЛЬ</div>
        <div style={{ fontSize: 27, fontWeight: 300, color: "#C9A86A", marginTop: 30 }}>Maya — цифровой администратор</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Montserrat", data: semibold, weight: 600, style: "normal" },
        { name: "Montserrat", data: light, weight: 300, style: "normal" },
      ],
    }
  );
}
