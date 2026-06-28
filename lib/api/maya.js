// Слой чата Maya: идёт в бот через прямой вызов api-proxy.php (нужен Telegram-вход).
// Бэкенд отвечает целиком; для эффекта «печатает» отдаём ответ по словам.
// Нет/отклонён вход → ошибка с code="auth_required", чат показывает кнопку входа.
import { chatSend } from "@/lib/api/proxy";

export async function* streamMaya(prompt, { signal, auth } = {}) {
  if (!auth) {
    const e = new Error("auth_required");
    e.code = "auth_required";
    throw e;
  }

  let status, data;
  try {
    ({ status, data } = await chatSend(prompt, auth));
  } catch (e) {
    if (signal?.aborted) return;
    throw e;
  }

  if (status === 401 || data?.error === "unauthorized") {
    const e = new Error("auth_required");
    e.code = "auth_required";
    throw e;
  }

  const text = data?.message || data?.reply || data?.answer || data?.text ||
    "Извините, не получилось ответить. Попробуйте ещё раз.";

  const tokens = text.match(/\S+\s*/g) || [text];
  for (const tk of tokens) {
    if (signal?.aborted) return;
    await wait(16, signal);
    yield tk;
  }
}

function wait(ms, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve();
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(t); resolve(); }, { once: true });
  });
}
