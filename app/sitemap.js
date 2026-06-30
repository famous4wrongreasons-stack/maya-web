const SITE_URL = "https://malesthetic.pro";

export const dynamic = "force-static";

const routes = [
  { path: "/", priority: 1 },
  { path: "/booking/", priority: 0.9 },
  { path: "/shop/", priority: 0.7 },
  { path: "/privacy/", priority: 0.3 },
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}
