export function displayedCount(verified: number, adjustment: number) {
  return Math.max(0, verified + adjustment);
}

export function aggregateDisplayedCounts(
  items: Array<{ verified: number; adjustment: number }>,
) {
  return items.reduce(
    (total, item) => total + displayedCount(item.verified, item.adjustment),
    0,
  );
}

export function progressMilestone(progress: number) {
  if (progress >= 0.98) return 100;
  if (progress >= 0.75) return 75;
  if (progress >= 0.5) return 50;
  if (progress >= 0.25) return 25;
  return null;
}
