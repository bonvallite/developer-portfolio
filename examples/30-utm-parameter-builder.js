// Example marketing tracking URL builder with placeholder host.
export function buildCampaignUrl(baseUrl, campaign) {
  const url = new URL(baseUrl);
  for (const [name, value] of Object.entries(campaign)) {
    if (!["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].includes(name)) continue;
    if (value != null && value !== "") url.searchParams.set(name, String(value));
  }
  return url.toString();
}
