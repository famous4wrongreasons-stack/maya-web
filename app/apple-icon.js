import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const LOGO = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='265 265 504 504'><g fill='#F4F0EB'><rect x='313' y='346' width='24' height='342'/><rect x='697' y='346' width='24' height='342'/><path d='M398 388 L421 388 L517 555 L613 388 L636 388 L636 615 L612 615 L612 429 L529 576 L505 576 L422 429 L422 615 L398 615 Z'/></g></svg>`;

export default function AppleIcon() {
  const logoData = `data:image/svg+xml;base64,${btoa(LOGO)}`;
  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#07070A" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoData} width={132} height={132} alt="" />
      </div>
    ),
    { ...size }
  );
}
