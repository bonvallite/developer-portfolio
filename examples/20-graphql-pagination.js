// Platform-agnostic cursor pagination using an injected authorised query function.
export async function collectPages(fetchPage, { maxPages = 20 } = {}) {
  let cursor = null;
  const results = [];
  for (let page = 0; page < maxPages; page++) {
    const response = await fetchPage(cursor);
    if (!Array.isArray(response?.nodes)) throw Error("Invalid response nodes");
    results.push(...response.nodes);
    if (!response.pageInfo?.hasNextPage) return results;
    if (!response.pageInfo.endCursor || response.pageInfo.endCursor === cursor) {
      throw Error("Invalid pagination cursor");
    }
    cursor = response.pageInfo.endCursor;
  }
  throw Error("Maximum pages exceeded");
}
