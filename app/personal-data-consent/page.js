import Link from "next/link";
import Logo from "@/components/Logo";
import { BRAND } from "@/data/brand";
import { PERSONAL_DATA_POLICY_PATH } from "@/components/ConsentCheckbox";

export const metadata = {
  title: "Согласие на обработку персональных данных — Мужская Эстетика",
  description: "Текст согласия пользователя на обработку персональных данных на сайте malesthetic.pro.",
};

const UPDATED_AT = "01.07.2026";
const SITE_URL = "https://malesthetic.pro";

const Section = ({ n, title, children }) => (
  <section className="mt-10">
    <h2 className="text-lg font-light text-ink">
      <span className="mr-2 text-gold/70">{n}.</span>
      {title}
    </h2>
    <div className="mt-3 space-y-3 text-[14px] font-light leading-relaxed text-ink/65">{children}</div>
  </section>
);

const List = ({ children }) => (
  <ul className="ml-4 list-disc space-y-1 marker:text-gold/55">{children}</ul>
);

export default function PersonalDataConsentPage() {
  return (
    <main className="min-h-[100svh] bg-base">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="text-ink/90 transition hover:text-ink">
          <Logo className="h-6 w-6 md:h-7 md:w-7" />
        </Link>
        <Link href="/" className="text-[11px] uppercase tracking-wide2 text-ink/50 transition hover:text-ink">
          На главную ✕
        </Link>
      </header>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-6 md:pt-12">
        <p className="mb-4 text-[11px] uppercase tracking-brand text-gold/80">Правовая информация</p>
        <h1 className="text-balance text-3xl font-extralight leading-[1.12] tracking-tight md:text-5xl">
          Согласие на обработку персональных данных
        </h1>
        <p className="mt-4 text-[13px] font-light text-ink/45">Редакция от {UPDATED_AT}</p>

        <Section n="1" title="Кому дается согласие">
          <p>
            Пользователь сайта {SITE_URL} дает согласие владельцу сайта {SITE_URL} и барбершопа
            «{BRAND.name}», расположенному по адресу: {BRAND.city}, {BRAND.address}, на обработку
            персональных данных в порядке, указанном в настоящем документе и{" "}
            <Link href={PERSONAL_DATA_POLICY_PATH} className="text-ink/80 underline underline-offset-2 transition hover:text-ink">
              Политике обработки персональных данных
            </Link>
            .
          </p>
        </Section>

        <Section n="2" title="Какие данные пользователь разрешает обрабатывать">
          <List>
            <li>имя, фамилия или отображаемое имя;</li>
            <li>номер телефона;</li>
            <li>Telegram ID, username и данные авторизации Telegram Login Widget;</li>
            <li>выбранные услуги, мастер, дата, время записи и статус записи;</li>
            <li>сведения о заказах, сертификатах, абонементах, оплатах и получателях;</li>
            <li>сообщения в онлайн-чате MAYA;</li>
            <li>cookie, IP-адрес, данные браузера, устройства, источника перехода и поведения на сайте.</li>
          </List>
        </Section>

        <Section n="3" title="Цели обработки">
          <List>
            <li>оформление онлайн-записи и управление визитом;</li>
            <li>обработка покупки сертификата или абонемента;</li>
            <li>авторизация пользователя и работа личного кабинета;</li>
            <li>ответы в онлайн-чате MAYA и сервисная поддержка;</li>
            <li>сервисные уведомления, напоминания и связь по записи или заказу;</li>
            <li>аналитика сайта, улучшение интерфейса, безопасности и качества услуг;</li>
            <li>исполнение требований законодательства РФ.</li>
          </List>
        </Section>

        <Section n="4" title="Разрешенные действия">
          <p>
            Пользователь разрешает Оператору выполнять с персональными данными следующие действия:
            сбор, запись, систематизацию, накопление, хранение, уточнение, обновление, изменение,
            извлечение, использование, передачу по поручению, обезличивание, блокирование, удаление
            и уничтожение. Обработка может быть автоматизированной и неавтоматизированной.
          </p>
        </Section>

        <Section n="5" title="Передача и сервисы">
          <p>
            Для достижения целей обработки данные могут передаваться или обрабатываться с использованием
            YClients, ЮKassa, Telegram, Яндекс.Метрики, хостинга сайта, backend-сервиса MAYA и иных
            технических подрядчиков, указанных в Политике обработки персональных данных.
          </p>
        </Section>

        <Section n="6" title="Срок действия согласия">
          <p>
            Согласие действует с момента установки чекбокса под формой или продолжения использования сайта
            после cookie-уведомления и до достижения целей обработки, истечения предусмотренных законом
            сроков хранения либо до отзыва согласия пользователем.
          </p>
        </Section>

        <Section n="7" title="Отзыв согласия">
          <p>
            Пользователь может отозвать согласие, направив обращение Оператору по телефону{" "}
            <a href={`tel:${BRAND.phoneRaw}`} className="text-ink/80 underline underline-offset-2 transition hover:text-ink">
              {BRAND.phone}
            </a>
            , в Telegram{" "}
            <a href={BRAND.telegram} target="_blank" rel="noreferrer" className="text-ink/80 underline underline-offset-2 transition hover:text-ink">
              {BRAND.telegramHandle}
            </a>{" "}
            или по адресу: {BRAND.city}, {BRAND.address}. После получения отзыва Оператор прекращает обработку,
            если отсутствуют иные законные основания для ее продолжения.
          </p>
        </Section>
      </article>
    </main>
  );
}
