import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_PATH = "supabase/migrations/0005_meal_logging.sql";

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

function assertMigrationContract() {
  let sql;

  try {
    sql = readFileSync(resolve(process.cwd(), MIGRATION_PATH), "utf8");
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown file error";
    console.error(`Cannot read ${MIGRATION_PATH}: ${detail}`);
    return false;
  }

  const requiredSnippets = [
    "create table public.meal_logs",
    "profile_id uuid not null references public.profiles(id) on delete cascade",
    "client_event_id uuid not null",
    "meal_type text not null check",
    "meal_type in ('breakfast', 'lunch', 'dinner', 'snack', 'other')",
    "calories integer check (calories between 0 and 10000)",
    "protein_g integer check (protein_g between 0 and 500)",
    "logged_date date not null default ((now() at time zone 'utc')::date)",
    "create unique index meal_logs_profile_client_event_idx",
    "on public.meal_logs(profile_id, client_event_id)",
    "create index meal_logs_profile_date_idx",
    "create index meal_logs_profile_logged_at_idx",
    "alter table public.meal_logs enable row level security"
  ];

  const missing = requiredSnippets.filter((snippet) => !sql.includes(snippet));

  if (missing.length > 0) {
    console.error("Meal logging migration contract check failed.");
    for (const snippet of missing) {
      console.error(`Missing: ${snippet}`);
    }
    return false;
  }

  console.log("Meal logging migration contract check passed.");
  return true;
}

async function probeEndpoint({ baseUrl, key, path, method = "GET", body }) {
  const url = new URL(path, baseUrl);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: method === "POST" ? "return=minimal" : "count=exact"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    return {
      ok: response.ok,
      status: response.status,
      text: await response.text(),
      error: ""
    };
  } catch (error) {
    return {
      ok: false,
      status: "network_error",
      text: "",
      error: error instanceof Error ? error.message : "Unknown network error"
    };
  }
}

const localEnv = readLocalEnv();
const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL", localEnv);
const anonKey = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", localEnv);
const serviceRoleKey = getEnvValue("SUPABASE_SERVICE_ROLE_KEY", localEnv);

if (!assertMigrationContract()) {
  process.exitCode = 1;
} else if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local or the process environment."
  );
  process.exitCode = 1;
} else {
  console.log("Checking Supabase project reachability...");

  const reachability = await probeEndpoint({
    baseUrl: supabaseUrl,
    key: serviceRoleKey,
    path: "/auth/v1/settings"
  });
  const reachabilityDetail = reachability.error ? ` (${reachability.error})` : "";

  console.log(`Supabase reachability: ${reachability.status}${reachabilityDetail}`);

  if (!reachability.ok) {
    if (reachability.status === "network_error") {
      console.error(
        "Supabase network check failed. Restore connectivity and rerun before interpreting table state."
      );
    } else {
      console.error(
        "Supabase reachability check failed. Confirm the project URL and service role key, then rerun this verifier."
      );
    }
    process.exitCode = 1;
  } else {
    console.log("Checking Supabase meal logging table and required columns...");

    const mealLogs = await probeEndpoint({
      baseUrl: supabaseUrl,
      key: serviceRoleKey,
      path:
        "/rest/v1/meal_logs?select=id,profile_id,client_event_id,meal_type,meal_name,calories,protein_g,logged_at,logged_date,note,created_at&limit=1"
    });
    const mealDetail = mealLogs.error ? ` (${mealLogs.error})` : "";

    console.log(`meal_logs column probe: ${mealLogs.status}${mealDetail}`);

    if (!mealLogs.ok) {
      console.error(
        "Meal logging verification failed. Apply supabase/migrations/0005_meal_logging.sql to the target project, then rerun this verifier."
      );
      process.exitCode = 1;
    } else {
      console.log("Checking that anon meal inserts are blocked by the trust boundary...");

      const anonInsert = await probeEndpoint({
        baseUrl: supabaseUrl,
        key: anonKey,
        method: "POST",
        path: "/rest/v1/meal_logs",
        body: {
          profile_id: randomUUID(),
          client_event_id: randomUUID(),
          meal_type: "snack"
        }
      });
      const anonDetail = anonInsert.error ? ` (${anonInsert.error})` : "";

      console.log(`anon insert probe: ${anonInsert.status}${anonDetail}`);

      if (anonInsert.status === 401 || anonInsert.status === 403) {
        console.log("Meal logging verification passed.");
      } else {
        console.error(
          "Meal logging RLS probe failed. Anon insert was not blocked before reaching table constraints."
        );
        process.exitCode = 1;
      }
    }
  }
}
