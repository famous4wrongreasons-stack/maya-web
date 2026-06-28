import Link from "next/link";
import Logo from "@/components/Logo";
import { BRAND } from "@/data/brand";

export const metadata = {
  title: "Политика конфиденциальности — Мужская Эстетика",
  robots: { index: false, follow: true },
};

const Section = ({ n, title, children }) => (
  <section className="mt-9">
    <h2 className="text-lg font-light text-ink">
      <span className="mr-2 text-gold/70">{n}.</span>{title}
    </h2>
    <div className="mt-3 space-y-2 text-[14px] font-light leading-relaxed text-ink/65">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <main className="min-h-[100svh] bg-base">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="text-ink/90 transition hover:text-ink"><Logo className="h-6 w-6 md:h-7 md:w-7" /></Link>
        <Link href="/" className="text-[11px] uppercase tracking-wide2 text-ink/50 transition hover:text-ink">На главную ✕</Link>
      </header>

      <article className="mx-auto max-w-2xl px-6 pb-24 pt-6 md:pt-12">
        <p className="mb-4 text-[11px] uppercase tracking-brand text-gold/80">Правовая информация</p>
        <h1 className="text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-4xl">
          Политика обработки персональных данных
        </h1>
        <p className="mt-4 text-[13px] font-light text-ink/45">Обновлено 21.06.2026</p>

        <Section n="1" title="Общие положения">
          <p>
            Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей
            сайта «{BRAND.name}» (далее — Оператор) и составлена в соответствии с Федеральным законом
            от 27.07.2006 № 152-ФЗ «О персональных данных». Используя сайт и отправляя свои данные через
            формы записи или оформления заказа, пользователь подтверждает согласие с условиями Политики.
          </p>
        </Section>

        <Section n="2" title="Какие данные мы обрабатываем">
          <p>Оператор обрабатывает данные, которые пользователь предоставляет добровольно:</p>
          <ul className="ml-4 list-disc space-y-1 marker:text-gold/50">
            <li>имя;</li>
            <li>номер телефона;</li>
            <li>выбранные услуга, мастер, дата и время визита;</li>
            <li>состав заказа (сертификаты, абонементы) при покупке;</li>
            <li>технические данные: cookie, IP-адрес, сведения о браузере и устройстве.</li>
          </ul>
        </Section>

        <Section n="3" title="Цели обработки">
          <ul className="ml-4 list-disc space-y-1 marker:text-gold/50">
            <li>оформление и подтверждение онлайн-записи;</li>
            <li>обработка покупки сертификатов и абонементов;</li>
            <li>связь с клиентом по поводу визита или заказа;</li>
            <li>улучшение качества сервиса и работы сайта.</li>
          </ul>
        </Section>

        <Section n="4" title="Правовые основания">
          <p>
            Обработка осуществляется на основании согласия субъекта персональных данных, а также для
            исполнения договора оказания услуг, стороной которого является пользователь.
          </p>
        </Section>

        <Section n="5" title="Передача третьим лицам">
          <p>
            Оператор не продаёт и не передаёт персональные данные третьим лицам, за исключением случаев,
            необходимых для оказания услуги:
          </p>
          <ul className="ml-4 list-disc space-y-1 marker:text-gold/50">
            <li>система онлайн-записи <span className="text-ink/80">YClients</span> — для создания записи в расписании;</li>
            <li>платёжный сервис <span className="text-ink/80">ЮKassa</span> — для проведения оплаты;</li>
            <li>иные случаи, прямо предусмотренные законодательством РФ.</li>
          </ul>
        </Section>

        <Section n="6" title="Сроки хранения и защита">
          <p>
            Данные хранятся не дольше, чем этого требуют цели обработки или законодательство РФ. Оператор
            принимает необходимые организационные и технические меры для защиты данных от неправомерного
            доступа, изменения, раскрытия или уничтожения.
          </p>
        </Section>

        <Section n="7" title="Права пользователя">
          <p>
            Пользователь вправе запросить сведения об обработке своих данных, потребовать их уточнения,
            блокирования или удаления, а также отозвать согласие на обработку, направив обращение по
            контактам Оператора.
          </p>
        </Section>

        <Section n="8" title="Cookie">
          <p>
            Сайт использует файлы cookie для корректной работы интерфейса и анализа посещаемости. Пользователь
            может отключить cookie в настройках браузера; при этом часть функций сайта может работать некорректно.
          </p>
        </Section>

        <Section n="9" title="Контакты оператора">
          <p>
            По вопросам обработки персональных данных: <a href={`tel:${BRAND.phoneRaw}`} className="text-ink/80 underline underline-offset-2 transition hover:text-ink">{BRAND.phone}</a>,{" "}
            <a href={BRAND.telegram} target="_blank" rel="noreferrer" className="text-ink/80 underline underline-offset-2 transition hover:text-ink">Telegram {BRAND.telegramHandle}</a>.
            Адрес: {BRAND.city}, {BRAND.address}.
          </p>
        </Section>

        <p className="mt-12 text-[12px] font-light leading-relaxed text-ink/35">
          Документ носит информационный характер. Точные реквизиты оператора (наименование ИП/организации, ИНН)
          указываются при заключении договора оказания услуг.
        </p>
      </article>
    </main>
  );
}
