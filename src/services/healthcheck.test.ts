import { describe, expect, test, mock } from "bun:test";
import {
  pingHealthcheckStart,
  pingHealthcheckSuccess,
  pingHealthcheckFail,
} from "./healthcheck";

describe("healthcheck service", () => {
  test("does nothing when HEALTHCHECK_URL is not set", async () => {
    let called = false;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(async () => {
      called = true;
      return new Response("OK");
    }) as any;

    try {
      const emptyEnv = {
        ETHEREUM_RPC_URL: "http://localhost",
        TELEGRAM_BOT_TOKEN: "token",
        TELEGRAM_CHAT_ID: "chat",
      };

      await pingHealthcheckStart(emptyEnv);
      await pingHealthcheckSuccess(emptyEnv);
      await pingHealthcheckFail(emptyEnv, new Error("test"));

      expect(called).toBe(false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("sends /start signal to healthchecks.io", async () => {
    const urls: string[] = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(async (url: string | URL | Request) => {
      urls.push(String(url));
      return new Response("OK");
    }) as any;

    try {
      const env = {
        ETHEREUM_RPC_URL: "http://localhost",
        TELEGRAM_BOT_TOKEN: "token",
        TELEGRAM_CHAT_ID: "chat",
        HEALTHCHECK_URL: "https://hc-ping.com/12345678-1234-1234-1234-123456789abc/",
      };

      await pingHealthcheckStart(env);

      expect(urls).toEqual([
        "https://hc-ping.com/12345678-1234-1234-1234-123456789abc/start",
      ]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("sends success signal with body to healthchecks.io", async () => {
    const requests: { url: string; body?: string }[] = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(async (url: string | URL | Request, init?: RequestInit) => {
      requests.push({ url: String(url), body: init?.body as string });
      return new Response("OK");
    }) as any;

    try {
      const env = {
        ETHEREUM_RPC_URL: "http://localhost",
        TELEGRAM_BOT_TOKEN: "token",
        TELEGRAM_CHAT_ID: "chat",
        HEALTHCHECK_URL: "https://hc-ping.com/12345678-1234-1234-1234-123456789abc",
      };

      await pingHealthcheckSuccess(env, "Gas: 0.40 Gwei | BTC: $84,000");

      expect(requests).toHaveLength(1);
      expect(requests[0]?.url).toBe(
        "https://hc-ping.com/12345678-1234-1234-1234-123456789abc"
      );
      expect(requests[0]?.body).toBe("Gas: 0.40 Gwei | BTC: $84,000");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("sends /fail signal with error details to healthchecks.io", async () => {
    const requests: { url: string; body?: string }[] = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(async (url: string | URL | Request, init?: RequestInit) => {
      requests.push({ url: String(url), body: init?.body as string });
      return new Response("OK");
    }) as any;

    try {
      const env = {
        ETHEREUM_RPC_URL: "http://localhost",
        TELEGRAM_BOT_TOKEN: "token",
        TELEGRAM_CHAT_ID: "chat",
        HEALTHCHECK_URL: "https://hc-ping.com/12345678-1234-1234-1234-123456789abc/",
      };

      await pingHealthcheckFail(env, new Error("Something broke"));

      expect(requests).toHaveLength(1);
      expect(requests[0]?.url).toBe(
        "https://hc-ping.com/12345678-1234-1234-1234-123456789abc/fail"
      );
      expect(requests[0]?.body).toContain("Error: Something broke");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("gracefully catches fetch errors without throwing", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mock(async () => {
      throw new Error("Network connection dropped");
    }) as any;

    try {
      const env = {
        ETHEREUM_RPC_URL: "http://localhost",
        TELEGRAM_BOT_TOKEN: "token",
        TELEGRAM_CHAT_ID: "chat",
        HEALTHCHECK_URL: "https://hc-ping.com/12345678-1234-1234-1234-123456789abc",
      };

      expect(async () => {
        await pingHealthcheckStart(env);
        await pingHealthcheckSuccess(env);
        await pingHealthcheckFail(env, new Error("fail"));
      }).not.toThrow();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
