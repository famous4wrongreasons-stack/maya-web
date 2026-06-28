/** @type {import('next').NextConfig} */
// BUILD_EXPORT=1 → статический экспорт в out/ (для Beget под malesthetic.pro),
// отдельный distDir, чтобы не задевать .next работающего dev-сервера.
const isExport = process.env.BUILD_EXPORT === "1";
const basePath = process.env.BASE_PATH || ""; // напр. "/new" для подпути malesthetic.pro/new/

const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  images: { unoptimized: true },
  // Пробрасываем basePath в клиент, чтобы хелпер asset() префиксил медиа из public/.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isExport && {
    output: "export",
    distDir: ".next-export",
    trailingSlash: true,
    ...(basePath && { basePath, assetPrefix: basePath }),
  }),
};

export default nextConfig;
