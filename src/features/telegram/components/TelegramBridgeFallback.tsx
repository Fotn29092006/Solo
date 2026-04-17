const isDevelopment = process.env.NODE_ENV === "development";

export function TelegramBridgeFallback() {
  if (!isDevelopment) {
    return null;
  }

  return (
    <section
      id="telegram-bridge-fallback"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        color: "var(--foreground)",
        margin: "20px auto",
        maxWidth: 520,
        padding: 16,
        width: "100%"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Telegram bridge fallback</p>
        <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
          Development-only capture path that does not depend on React hydration. Raw initData is copied only to clipboard.
        </p>
      </div>

      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr", marginTop: 12 }}>
        <button data-telegram-bridge-copy="initData" style={buttonStyle()} type="button">
          Copy bridge initData
        </button>
        <button data-telegram-bridge-copy="unsafe" style={buttonStyle()} type="button">
          Copy bridge initDataUnsafe
        </button>
      </div>

      <dl style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", margin: "12px 0 0" }}>
        <BridgeSignal label="Bridge JS" value="server" />
        <BridgeSignal label="SDK script" value="server" />
        <BridgeSignal label="SDK" value="server" />
        <BridgeSignal label="WebApp" value="server" />
        <BridgeSignal label="initData" value="server" />
        <BridgeSignal label="tgWebAppData" value="server" />
        <BridgeSignal label="platform" value="server" />
        <BridgeSignal label="unsafe user" value="server" />
        <BridgeSignal label="checks" value="0" />
        <BridgeSignal label="document" value="server" />
      </dl>

      <p data-telegram-bridge-status="" style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.5, margin: "12px 0 0" }}>
        Waiting for bridge script.
      </p>

      <script dangerouslySetInnerHTML={{ __html: bridgeScript }} />
    </section>
  );
}

function BridgeSignal({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "8px 10px" }}>
      <dt style={{ color: "var(--muted)", fontSize: 12 }}>{label}</dt>
      <dd data-telegram-bridge-signal={label} style={{ fontSize: 12, fontWeight: 700, margin: "4px 0 0" }}>
        {value}
      </dd>
    </div>
  );
}

function buttonStyle() {
  return {
    background: "var(--surface-strong)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    color: "var(--foreground)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    minHeight: 44,
    padding: "10px 12px"
  };
}

const bridgeScript = String.raw`
(function () {
  var root = document.getElementById("telegram-bridge-fallback");
  if (!root) return;

  var checks = 0;
  var maxChecks = 40;
  var statusNode = root.querySelector("[data-telegram-bridge-status]");
  var copyInitDataButton = root.querySelector('[data-telegram-bridge-copy="initData"]');
  var copyUnsafeButton = root.querySelector('[data-telegram-bridge-copy="unsafe"]');

  function signal(label, value) {
    var node = root.querySelector('[data-telegram-bridge-signal="' + label + '"]');
    if (node) node.textContent = value;
  }

  function status(value) {
    if (statusNode) statusNode.textContent = value;
  }

  function paramsFrom(source) {
    var raw = source === "hash" ? window.location.hash.replace(/^#/, "") : window.location.search.replace(/^\?/, "");
    try {
      return new URLSearchParams(raw);
    } catch (_error) {
      return new URLSearchParams();
    }
  }

  function launchInitData() {
    var hashParams = paramsFrom("hash");
    var searchParams = paramsFrom("search");
    var value = hashParams.get("tgWebAppData") || searchParams.get("tgWebAppData") || "";
    return value;
  }

  function launchSource() {
    if (paramsFrom("hash").has("tgWebAppData")) return "hash";
    if (paramsFrom("search").has("tgWebAppData")) return "search";
    return "missing";
  }

  function webApp() {
    return window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  }

  function initDataValue() {
    var app = webApp();
    return app && app.initData ? app.initData : launchInitData();
  }

  function unsafeValue() {
    var app = webApp();
    return app && app.initDataUnsafe ? app.initDataUnsafe : null;
  }

  function hasUnsafeUser() {
    var unsafe = unsafeValue();
    if (unsafe && unsafe.user) return true;

    var launchData = launchInitData();
    if (!launchData) return false;

    try {
      return new URLSearchParams(launchData).has("user");
    } catch (_error) {
      return false;
    }
  }

  function update() {
    checks += 1;

    var app = webApp();
    var launchData = launchInitData();
    var initData = initDataValue();
    var scriptTag = document.querySelector('script[src*="telegram-web-app.js"]');

    signal("Bridge JS", "active");
    signal("SDK script", scriptTag ? "yes" : "no");
    signal("SDK", window.Telegram ? "loaded" : "missing");
    signal("WebApp", app ? "available" : "missing");
    signal("initData", initData ? "present" : "missing");
    signal("tgWebAppData", launchData ? launchSource() : "missing");
    signal("platform", app && app.platform ? app.platform : paramsFrom("hash").get("tgWebAppPlatform") || paramsFrom("search").get("tgWebAppPlatform") || "missing");
    signal("unsafe user", hasUnsafeUser() ? "yes" : "no");
    signal("checks", String(checks));
    signal("document", document.readyState || "unknown");

    if (app) {
      try {
        app.ready && app.ready();
        app.expand && app.expand();
      } catch (_error) {}
    }

    if (initData) {
      status("Bridge initData is available. Use Copy bridge initData for TELEGRAM_TEST_INIT_DATA.");
      return true;
    }

    status(launchData ? "Launch data exists, but initData is not exposed by SDK yet." : "No Telegram launch data detected in this page.");
    return false;
  }

  function copyText(value, successMessage, missingMessage) {
    if (!value) {
      status(missingMessage);
      return;
    }

    var onSuccess = function () {
      status(successMessage);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(onSuccess).catch(function () {
        fallbackCopy(value, onSuccess);
      });
      return;
    }

    fallbackCopy(value, onSuccess);
  }

  function fallbackCopy(value, onSuccess) {
    var textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      onSuccess();
    } finally {
      document.body.removeChild(textarea);
    }
  }

  if (copyInitDataButton) {
    copyInitDataButton.addEventListener("click", function () {
      copyText(
        initDataValue(),
        "Bridge initData copied. Paste it into local TELEGRAM_TEST_INIT_DATA.",
        "No bridge initData: open through the Telegram Mini App button."
      );
    });
  }

  if (copyUnsafeButton) {
    copyUnsafeButton.addEventListener("click", function () {
      var unsafe = unsafeValue();
      copyText(
        unsafe ? JSON.stringify(unsafe) : "",
        "Bridge initDataUnsafe copied for development debugging only. Do not use it for auth.",
        "No bridge initDataUnsafe: open through the Telegram Mini App button."
      );
    });
  }

  update();

  var timer = window.setInterval(function () {
    var done = update();
    if (done || checks >= maxChecks) {
      window.clearInterval(timer);
    }
  }, 250);
})();
`;
