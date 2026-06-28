// Префикс basePath для статичных медиа из public/ (видео, фото, постеры).
// Next.js basePath НЕ префиксит сырые <video>/<img src> — только next/link и next/image,
// поэтому на подпути /new/ абсолютные пути /media/... 404-ят. Этот хелпер добавляет
// префикс. На корневом домене/в dev NEXT_PUBLIC_BASE_PATH='' → пути не меняются.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const asset = (p) => (typeof p === "string" && p.startsWith("/") ? BASE + p : p);
