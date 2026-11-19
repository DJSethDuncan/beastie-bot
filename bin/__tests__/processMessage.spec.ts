import { processMessage } from "../processMessage";
import { text } from "../openai";
import { config } from "../config";

jest.mock("../openai", () => ({ text: jest.fn() }));
jest.mock("../messageLogger", () => ({ logMessage: jest.fn() }));

const mockText = text as jest.MockedFunction<typeof text>;

const payload = (content: string, id = "123") => ({
  channel: { type: "text" },
  author: { id, username: "mike-d", avatarURL: "" },
  content,
});

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  mockText.mockReset();
});
afterEach(() => jest.restoreAllMocks());

describe("processMessage", () => {
  it("ignores users on the ignore list", async () => {
    expect(await processMessage(payload("bot hi", config.ignoreUsers[0]))).toBeUndefined();
    expect(mockText).not.toHaveBeenCalled();
  });

  it("returns help text for `bot help`", async () => {
    expect(await processMessage(payload("bot help"))).toBe(config.helpText);
  });

  it("sends the rest of a `bot` message to OpenAI", async () => {
    mockText.mockResolvedValue("hey");
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + 60_000);
    expect(await processMessage(payload("Bot, how are you"))).toBe("hey");
    expect(mockText).toHaveBeenCalledWith({
      query: "how are you",
      author: expect.objectContaining({ id: "123" }),
    });
  });

  it("rate-limits a second `bot` message within 10 seconds", async () => {
    mockText.mockResolvedValue("hey");
    const start = Date.now() + 120_000;
    const now = jest.spyOn(Date, "now").mockReturnValue(start);
    expect(await processMessage(payload("bot first"))).toBe("hey");
    now.mockReturnValue(start + 5_000);
    const reply = await processMessage(payload("bot second"));
    expect(config.replyCollections.rateLimit).toContain(reply);
    expect(mockText).toHaveBeenCalledTimes(1);
  });

  it("beastie-boysifies messages with a trigger word", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    expect(await processMessage(payload("we gotta fight"))).toBe("fight");
  });

  it("returns an empty string for ordinary chat", async () => {
    expect(await processMessage(payload("what's for lunch"))).toBe("");
  });
});
