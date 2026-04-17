import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

async function probeEndpoint({ baseUrl, serviceRoleKey, path }) {
  const url = new URL(path, baseUrl);

  try {
    const response = await fetch(url, {
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        prefer: "count=exact"
      }
    });

    return {
      ok: response.ok,
      status: response.status,
      error: ""
    };
  } catch (error) {
    return {
      ok: false,
      status: "network_error",
      error: error instanceof Error ? error.message : "Unknown network error"
    };
  }
}

const localEnv = readLocalEnv();
const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL", localEnv);
const serviceRoleKey = getEnvValue("SUPABASE_SERVICE_ROLE_KEY", localEnv);

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local or the process environment."
  );
  process.exitCode = 1;
} else {
  console.log("Checking Supabase project reachability...");

  const reachability = await probeEndpoint({
    baseUrl: supabaseUrl,
    serviceRoleKey,
    path: "/auth/v1/settings"
  });
  const reachabilityDetail = reachability.error ? ` (${reachability.error})` : "";

  console.log(`Supabase reachability: ${reachability.status}${reachabilityDetail}`);

  if (!reachability.ok && reachability.status === "network_error") {
    console.error(
      "Supabase network check failed. Restore connectivity and rerun before interpreting table state."
    );
    process.exitCode = 1;
  } else {
    console.log("Checking Supabase water logging table...");

    const waterLogs = await probeEndpoint({
      baseUrl: supabaseUrl,
      serviceRoleKey,
      path: "/rest/v1/water_logs?select=*&limit=1"
    });
    const waterDetail = waterLogs.error ? ` (${waterLogs.error})` : "";

    console.log(`water_logs: ${waterLogs.status}${waterDetail}`);

    if (!waterLogs.ok) {
      console.error(
        "Water logging verification failed. Apply supabase/migrations/0002_water_logging.sql to the target project, then rerun this verifier."
      );
      process.exitCode = 1;
    } else {
      console.log("Water logging verification passed.");
    }
  }
}
