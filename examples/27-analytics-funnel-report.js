// Compute event-to-event progression from aggregate synthetic counts.
export function funnelReport(steps) {
  return steps.map((step, index) => ({
    name: step.name,
    count: step.count,
    stepRate: index === 0 ? null : (steps[index - 1].count ? step.count / steps[index - 1].count : null),
    startingRate: steps[0].count ? step.count / steps[0].count : null
  }));
}
