export const TELEGRAM_INIT_DATA_HEADER = "x-telegram-init-data";

export function readTelegramInitData(request: Request, body: Record<string, unknown>) {
  if (typeof body.initData === "string") {
    return body.initData;
  }

  if (process.env.NODE_ENV === "development") {
    const headerInitData = request.headers.get(TELEGRAM_INIT_DATA_HEADER);

    if (headerInitData) {
      return headerInitData;
    }
  }

  return "";
}
