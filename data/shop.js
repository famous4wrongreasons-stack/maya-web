// Магазин: сертификаты (реальные карты из приложения) + абонементы.
export const CERTIFICATES = [
  { amount: 2000, front: "/media/cert-2000.jpg", back: "/media/cert-2000-back.jpg", note: "Стрижка или оформление бороды" },
  { amount: 3000, front: "/media/cert-3000.jpg", back: "/media/cert-3000-back.jpg", note: "Комплекс: стрижка + борода" },
  { amount: 5000, front: "/media/cert-5000.jpg", back: "/media/cert-5000-back.jpg", note: "Полный образ или подарок «всё включено»" },
];

// prices: senior — старший мастер, top — топ-мастер
export const SUBSCRIPTIONS = [
  { title: "Стрижка", visits: 2, desc: "2 мужские стрижки в месяц. Для тех, кто стрижётся регулярно.", prices: { senior: 3300, top: 3700 } },
  { title: "Комплекс", visits: 2, desc: "2 раза в месяц: стрижка + моделирование бороды.", prices: { senior: 5200, top: 6000 } },
  { title: "Борода", visits: 2, desc: "2 раза в месяц — моделирование бороды и уход.", prices: { senior: 1700, top: 2100 } },
];
