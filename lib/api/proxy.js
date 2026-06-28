// Единый клиентский слой к боевому прокси api-proxy.php.
// Сайт хостится на malesthetic.pro → браузер в том же origin, CORS не мешает.
// Ключи (PARTNER_TOKEN, ЮKassa, Telegram) остаются на стороне php/бота.
export const PROXY = process.env.NEXT_PUBLIC_PROXY_URL || "https://malesthetic.pro/app/api-proxy.php";
const COMPANY = process.env.NEXT_PUBLIC_COMPANY_ID || "503759";

// Коды планов абонементов — как в боевом приложении
const PLAN_CODE = { "Стрижка": "haircut", "Комплекс": "complex", "Борода": "beard" };

const jget = (url, opts) => fetch(url, { headers: { Accept: "application/json" }, ...opts }).then((r) => r.json().catch(() => ({})));
const jpost = (action, body) =>
  fetch(`${PROXY}?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

// ——— YClients запись ———
export async function ycServices(staffId) {
  const d = await jget(`${PROXY}?action=get_services&company_id=${COMPANY}&staff_id=${staffId}`);
  return d?.data?.services || [];
}
export async function ycDates(staffId, serviceId) {
  const d = await jget(`${PROXY}?action=get_dates&company_id=${COMPANY}&staff_id=${staffId}&service_id=${serviceId}`);
  return Array.isArray(d?.data) ? d.data : [];
}
export async function ycTimes(staffId, serviceId, date) {
  const d = await jget(`${PROXY}?action=get_times&company_id=${COMPANY}&staff_id=${staffId}&service_id=${serviceId}&date=${date}`);
  return Array.isArray(d?.data) ? d.data : [];
}
export async function ycBook({ staffId, serviceId, date, time, name, phone }) {
  const res = await jpost("create_record", {
    company_id: Number(COMPANY),
    staff_id: Number(staffId),
    service_id: String(serviceId),
    date, time, phone, fullname: name,
  });
  return res.json().catch(() => ({ success: false }));
}

// ——— Telegram-вход ———
export async function tgVerify(authData) {
  const res = await jpost("tg_login_verify", { auth_data: authData });
  return res.json().catch(() => ({ success: false }));
}

// ——— Магазин (ЮKassa) ———
export async function shopCreate(item) {
  const action = item.kind === "sub" ? "sub_create" : "cert_create";
  const body =
    item.kind === "sub"
      ? { plan: PLAN_CODE[item.plan] || item.plan, tier: item.tier || "senior", auth_data: item.auth_data }
      : { amount: Number(item.amount) || 0, recipient_name: item.recipient_name || "", recipient_phone: item.recipient_phone || "", auth_data: item.auth_data };
  const res = await jpost(action, body);
  return res.json().catch(() => ({ success: false }));
}

// ——— Чат Maya ———
export async function chatSend(message, authData) {
  const res = await jpost("chat", { message, auth_data: authData });
  const d = await res.json().catch(() => ({}));
  return { status: res.status, data: d };
}
