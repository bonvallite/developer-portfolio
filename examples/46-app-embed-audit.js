// Read-only audit of theme app embeds in config/settings_data.json.
// App embeds appear as blocks whose type is
// "shopify://apps/<app>/blocks/<embed>/<id>". Uninstalling an app can leave
// its embed entry behind, so compare against the apps actually installed.
export function auditAppEmbeds(settingsData, installedApps = []) {
  const current = settingsData?.current;
  const blocks = current && typeof current === "object" ? current.blocks ?? {} : {};
  const installed = new Set(installedApps);
  return Object.entries(blocks).flatMap(([id, block]) => {
    const match = /^shopify:\/\/apps\/([^/]+)\/blocks\/([^/]+)\//.exec(block?.type ?? "");
    if (!match) return [];
    const [, app, embed] = match;
    return [{ id, app, embed, enabled: block.disabled !== true, orphaned: !installed.has(app) }];
  });
}
