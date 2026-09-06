import Link from "next/link";

export const PERSONAL_DATA_POLICY_PATH = "/personal-data-policy";
export const PERSONAL_DATA_CONSENT_PATH = "/personal-data-consent";

export const CONSENT_ERROR =
  "Чтобы продолжить, подтвердите согласие на обработку персональных данных.";

export default function ConsentCheckbox({
  checked,
  onChange,
  error,
  id = "personal-data-consent",
  className = "",
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[12px] font-light leading-relaxed text-ink/55">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-gold"
        />
        <span>
          Я соглашаюсь на обработку персональных данных и принимаю{" "}
          <Link
            href={PERSONAL_DATA_POLICY_PATH}
            target="_blank"
            className="text-ink/80 underline underline-offset-2 transition hover:text-ink"
          >
            Политику обработки персональных данных
          </Link>
        </span>
      </label>
      {error && (
        <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-[12px] font-light leading-relaxed text-red-300/90">
          {error}
        </p>
      )}
    </div>
  );
}
