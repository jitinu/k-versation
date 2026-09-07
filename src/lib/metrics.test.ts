import {
  aggregateDisplayedCounts,
  displayedCount,
  progressMilestone,
} from "./metrics";

describe("metric calculations", () => {
  it("uses verified plus manual adjustment without going negative", () => {
    expect(displayedCount(100, 50)).toBe(150);
    expect(displayedCount(20, -50)).toBe(0);
  });

  it("keeps aggregate totals consistent with item totals", () => {
    expect(
      aggregateDisplayedCounts([
        { verified: 100, adjustment: 50 },
        { verified: 25, adjustment: -5 },
      ]),
    ).toBe(170);
  });

  it("emits only meaningful playback milestones", () => {
    expect(progressMilestone(0.24)).toBeNull();
    expect(progressMilestone(0.5)).toBe(50);
    expect(progressMilestone(0.99)).toBe(100);
  });
});
