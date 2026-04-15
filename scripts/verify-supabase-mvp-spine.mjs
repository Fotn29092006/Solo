import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const requiredTables = [
  "profiles",
  "goals",
  "user_paths",
  "daily_quests",
  "quest_completions",
  "weekly_checkins",
  "xp_events",
  "streaks",
];

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
    const value = trimmed.slice(index + 1).trim();

    if (key) {
      env[key] = value;
    }

    return env;
  }, {});
}

function getEnvValue(name, localEnv) {
  return process.env[name] || localEnv[name] || "";
}

async function probeTable({ baseUrl, serviceRoleKey, table }) {
  const url = new URL(`/rest/v1/${table}`, baseUrl);
  url.searchParams.set("select", "*");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      prefer: "count=exact",
    },
  });

  return {
    table,
    ok: response.ok,
    status: response.status,
  };
}

const localEnv = readLocalEnv();
const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL", localEnv);
const serviceRoleKey = getEnvValue("SUPABASE_SERVICE_ROLE_KEY", localEnv);

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local or the process environment.",
  );
  process.exitCode = 1;
} else {
  console.log("Checking Supabase MVP spine tables...");

  const results = await Promise.all(
    requiredTables.map((table) =>
      probeTable({
        baseUrl: supabaseUrl,
        serviceRoleKey,
        table,
      }),
    ),
  );

  for (const result of results) {
    console.log(`${result.table}: ${result.status}`);
  }

  const missingTables = results.filter((result) => !result.ok);

  if (missingTables.length > 0) {
    console.error(
      `MVP spine verification failed. Unavailable tables: ${missingTables
        .map((result) => `${result.table}(${result.status})`)
        .join(", ")}`,
    );
    process.exitCode = 1;
  } else {
    console.log("MVP spine verification passed.");
  }
}
