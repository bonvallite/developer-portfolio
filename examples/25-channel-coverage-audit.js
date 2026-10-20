// Report missing mock sales channels, without making store changes.
export function channelCoverage(products, requiredChannels) {
  return products.map(product => ({
    productId: product.id,
    missingChannels: requiredChannels.filter(channel => !(product.channels ?? []).includes(channel))
  })).filter(record => record.missingChannels.length > 0);
}
