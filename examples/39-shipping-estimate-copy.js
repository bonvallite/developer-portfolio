// Display estimates conservatively; never imply a guaranteed courier commitment.
export function estimateLabel(date, tentative = true) {
  return date ? (tentative ? "Estimated delivery: " : "Scheduled delivery: ") + date :
    "Delivery estimate available at checkout";
}
