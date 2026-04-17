import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const REQUEST_TIMEOUT_MS = 15000;
const TELEGRAM_INIT_DATA_HEADER = "x-telegram-init-data";

function readLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  let raw;

  try {
    raw = readFileSync(envPath, "utf8");
  } catch {
    return {};
  }

  return raw.split(/\r?\n/).reduce((env, line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return env;
    }

    const index = trimmed.indexOf("=");

    if (index === -1) {
      return env;
    }

    const key = trimmed.slice(0, index).trim();
    const value = stripQuotes(trimmed.slice(index + 1).trim());

    if (key) {
      env[key] = value;
    }

    return env;
  }, {});
}

function stripQuotes(value) {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function getEnvValue(name, localEnv) {
  return process.env[name] || localEnv[name] || "";
}

function requireEnv(name, localEnv, message) {
  const value = getEnvValue(name, localEnv).trim();

  if (!value) {
    throw new Error(message);
  }

  return value;
}

async function postJson(baseUrl, path, body, initData) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "true",
      [TELEGRAM_INIT_DATA_HEADER]: initData
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  });
  const text = await response.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return {
    ok: response.ok,
    statusCode: response.status,
    json,
    text
  };
}

function reportEndpoint(label, result, expectedStatuses) {
  const routeStatus = typeof result.json?.status === "string" ? result.json.status : "none";
  const passed = result.ok && expectedStatuses.includes(routeStatus);
  const summary = summarizeResponse(result);

  console.log(
    `${passed ? "PASS" : "FAIL"} ${label}: http=${result.statusCode} status=${routeStatus} summary=${summary}`
  );

  if (!passed) {
    throw new Error(`${label} expected ${expectedStatuses.join("/")} but got http=${result.statusCode} status=${routeStatus}`);
  }
}

function summarizeResponse(result) {
  if (result.json && typeof result.json === "object") {
    const summary = {
      ok: Boolean(result.json.ok),
      status: result.json.status ?? null,
      profileId: result.json.profileId ?? result.json.profile?.id ?? null
    };

    return JSON.stringify(summary);
  }

  if (!result.text) {
    return "empty";
  }

  return result.text.replace(/\s+/g, " ").slice(0, 160);
}

async function run() {
  const localEnv = readLocalEnv();
  const initData = requireEnv(
    "TELEGRAM_TEST_INIT_DATA",
    localEnv,
    "Missing TELEGRAM_TEST_INIT_DATA. Open the Mini App inside Telegram, press Copy initData, and paste it into ignored .env.local."
  );
  const baseUrl = requireEnv(
    "NEXT_PUBLIC_APP_URL",
    localEnv,
    "Missing NEXT_PUBLIC_APP_URL. Set it to the public dev URL, for example https://flashing-hazelnut-scored.ngrok-free.dev."
  ).replace(/\/+$/, "");

  console.log("Telegram quick-log smoke starting.");
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Init data present: yes (${initData.length} chars)`);
  console.log("Note: this creates real development log rows for the validated Telegram profile.");

  const smokeCases = [
    {
      label: "/api/home",
      path: "/api/home",
      body: {},
      expectedStatuses: ["ready"]
    },
    {
      label: "/api/water-logs",
      path: "/api/water-logs",
      body: {
        amountMl: 250,
        clientEventId: randomUUID()
      },
      expectedStatuses: ["ready", "already_logged"]
    },
    {
      label: "/api/workout-logs",
      path: "/api/workout-logs",
      body: {
        workoutType: "strength",
        clientEventId: randomUUID()
      },
      expectedStatuses: ["ready", "already_logged"]
    },
    {
      label: "/api/sleep-logs",
      path: "/api/sleep-logs",
      body: {
        sleepDurationMin: 420,
        clientEventId: randomUUID()
      },
      expectedStatuses: ["ready", "already_logged"]
    },
    {
      label: "/api/meal-logs",
      path: "/api/meal-logs",
      body: {
        mealType: "snack",
        clientEventId: randomUUID()
      },
      expectedStatuses: ["ready", "already_logged"]
    }
  ];

  for (const smokeCase of smokeCases) {
    const result = await postJson(baseUrl, smokeCase.path, smokeCase.body, initData);
    reportEndpoint(smokeCase.label, result, smokeCase.expectedStatuses);
  }

  console.log("Telegram quick-log smoke passed.");
}

try {
  await run();
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown smoke failure";
  console.error(`Telegram quick-log smoke failed: ${message}`);
  process.exitCode = 1;
}
