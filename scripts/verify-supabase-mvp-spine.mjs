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

  try {
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
      error: "",
    };
  } catch (error) {
    return {
      table,
      ok: false,
      status: "network_error",
      error: error instanceof Error ? error.message : "Unknown network error",
    };
  }
}

async function probeSupabaseReachability({ baseUrl, serviceRoleKey }) {
  const url = new URL("/auth/v1/settings", baseUrl);

  try {
    const response = await fetch(url, {
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    return {
      ok: response.ok,
      status: response.status,
      error: "",
    };
  } catch (error) {
    return {
      ok: false,
      status: "network_error",
      error: error instanceof Error ? error.message : "Unknown network error",
    };
  }
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
  console.log("Checking Supabase project reachability...");

  const reachability = await probeSupabaseReachability({
    baseUrl: supabaseUrl,
    serviceRoleKey,
  });
  const reachabilityDetail = reachability.error ? ` (${reachability.error})` : "";

  console.log(`Supabase reachability: ${reachability.status}${reachabilityDetail}`);

  if (!reachability.ok && reachability.status === "network_error") {
    console.error(
      "Supabase network check failed. Restore connectivity and rerun before interpreting table state.",
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
      const detail = result.error ? ` (${result.error})` : "";
      console.log(`${result.table}: ${result.status}${detail}`);
    }

    const missingTables = results.filter((result) => !result.ok);

    if (missingTables.length > 0) {
      const allMissing = missingTables.length === requiredTables.length;
      const allNotFound = missingTables.every((result) => result.status === 404);

      console.error(
        `MVP spine verification failed. Unavailable tables: ${missingTables
          .map((result) => `${result.table}(${result.status})`)
          .join(", ")}`,
      );

      if (allMissing && allNotFound) {
        console.error(
          "All required tables returned 404. Apply supabase/migrations/0001_mvp_spine.sql to the target project, then rerun this verifier.",
        );
      }

      process.exitCode = 1;
    } else {
      console.log("MVP spine verification passed.");
    }
  }
}
