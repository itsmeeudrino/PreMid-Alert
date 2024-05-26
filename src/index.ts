function toast(service: string) {
  let div = `
  <div style="z-index:999999;position:absolute;bottom:12px;right:12px;padding-block:24px;padding-inline:24px;background:#36393e;border-radius:8px;color:white;font-size:18px;">
    <span>There's a PreMiD presence for this website!</span>
    <div style="display:flex;gap:4px;padding-block:12px;">
      <button id="ALERT_add-presence" style="border:none;background:#6bcf40;padding-block:8px;padding-inline:12px;color:black;border-radius:4px;">
        Add
      </button>
      <button id="ALERT_ignore-presence" style="border:none;background:#f74b4b;padding-block:8px;padding-inline:12px;color:black;border-radius:4px;">
        Ignore
      </button>
    </div>
  </div>
  `;
  let el = document.createElement("div");

  el.innerHTML = div;

  el
    .querySelector("#ALERT_add-presence")
    ?.addEventListener("click", async () => {
      await chrome.storage.sync.set({ [`blocklist_${service}`]: "yes" });
      el.remove();
      open(`https://premid.app/store/presences/${service}`, "_blank");
    });

  el.querySelector("#ALERT_ignore-presence")?.addEventListener("click", () => {
    el.remove();
    chrome.storage.sync.set({ [`blocklist_${service}`]: "yes" });
  });

  return el;
}

chrome.storage.local.get(location.hostname).then(async (presence) => {
  let value = presence as Record<string, string>;

  const service = value[location.hostname];

  if (!service) return;

  const isBlocklisted = await chrome.storage.sync.get(`blocklist_${service}`);

  if (isBlocklisted[`blocklist_${service}`]) return;

  document.body.append(toast(service));
});
