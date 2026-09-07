import {
  mediaSchema,
  questionSchema,
  signupSchema,
  usernameSchema,
} from "./validation";

describe("public input validation", () => {
  it("rejects reserved and malformed usernames", () => {
    expect(usernameSchema.safeParse("admin").success).toBe(false);
    expect(usernameSchema.safeParse("a space").success).toBe(false);
    expect(usernameSchema.safeParse("daniel_koo").success).toBe(true);
  });

  it("requires a strong signup password", () => {
    expect(
      signupSchema.safeParse({
        name: "Daniel Koo",
        email: "daniel@example.com",
        countryCode: "US",
        username: "daniel_koo",
        password: "weak",
      }).success,
    ).toBe(false);
  });

  it("rejects honeypot submissions", () => {
    expect(
      questionSchema.safeParse({
        name: "A Reader",
        email: "reader@example.com",
        question: "This is a meaningful question about Korea.",
        website: "spam.example",
      }).success,
    ).toBe(false);
  });

  it("requires a publication date for published media", () => {
    const media = {
      kind: "dispatch",
      slug: "a-new-dispatch",
      title: "A New Dispatch",
      excerpt: "A considered field note from South Korea.",
      description:
        "A complete description that gives readers meaningful context before watching.",
    };

    expect(
      mediaSchema.safeParse({ ...media, status: "published" }).success,
    ).toBe(false);
    expect(mediaSchema.safeParse({ ...media, status: "draft" }).success).toBe(
      true,
    );
  });
});
