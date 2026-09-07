import { assertSameOrigin, isLikelyBot } from "./security";

describe("request security", () => {
  it("accepts same-origin mutations", async () => {
    const request = new Request("https://k-versation.example/api/questions", {
      headers: { origin: "https://k-versation.example" },
    });

    await expect(assertSameOrigin(request)).resolves.toBeUndefined();
  });

  it("rejects missing and cross-origin mutation headers", async () => {
    await expect(
      assertSameOrigin(
        new Request("https://k-versation.example/api/questions"),
      ),
    ).rejects.toThrow("Invalid request origin");
    await expect(
      assertSameOrigin(
        new Request("https://k-versation.example/api/questions", {
          headers: { origin: "https://attacker.example" },
        }),
      ),
    ).rejects.toThrow("Invalid request origin");
  });

  it("identifies automated preview and crawler traffic", () => {
    expect(isLikelyBot("Slackbot-LinkExpanding 1.0")).toBe(true);
    expect(isLikelyBot("Mozilla/5.0 Chrome/140.0 Safari/537.36")).toBe(false);
  });
});
