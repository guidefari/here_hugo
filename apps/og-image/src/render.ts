import jetBrainsMonoBold from "@expo-google-fonts/jetbrains-mono/700Bold/JetBrainsMono_700Bold.ttf?arraybuffer";
import { ImageResponse } from "@cf-wasm/og/workerd";
import { createElement } from "react";
import type { ReactNode } from "react";

const WIDTH = 1012;
const HEIGHT = 506;
const IMAGE_HEADERS = {
  "Cache-Control": "public, max-age=31536000, immutable",
  "Content-Disposition": 'inline; filename="og-image.png"',
  "Content-Type": "image/png",
  "X-Content-Type-Options": "nosniff",
} as const;

function titleSize(title: string): number {
  const length = Array.from(title).length;
  if (length <= 34) return 55;
  if (length <= 64) return 46;
  if (length <= 104) return 38;
  return 31;
}

function card(title: string): ReactNode {
  return createElement(
    "div",
    {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#161817",
        color: "#e9eb9e",
        fontFamily: "JetBrains Mono",
        position: "relative",
        overflow: "hidden",
      },
    },
    createElement("div", {
      style: {
        display: "flex",
        position: "absolute",
        inset: 18,
        border: "1px solid #313a37",
      },
    }),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          width: 328,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        },
      },
      createElement(
        "div",
        {
          style: {
            display: "flex",
            width: 232,
            height: 232,
            borderRadius: 116,
            background: "linear-gradient(145deg, #b8c999 0%, #7da9b9 52%, #245f67 100%)",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 14px #1d211f, 0 0 0 15px #536660",
          },
        },
        createElement(
          "div",
          {
            style: {
              display: "flex",
              width: 160,
              height: 160,
              borderRadius: 80,
              background: "#161817",
              color: "#e9eb9e",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
              letterSpacing: -8,
              paddingRight: 8,
            },
          },
          "GF",
        ),
      ),
      createElement("div", {
        style: {
          display: "flex",
          position: "absolute",
          left: 42,
          bottom: 56,
          width: 84,
          height: 4,
          background: "#e9eb9e",
        },
      }),
      createElement("div", {
        style: {
          display: "flex",
          position: "absolute",
          left: 42,
          bottom: 42,
          width: 48,
          height: 4,
          background: "#7da9b9",
        },
      }),
    ),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          flex: 1,
          minWidth: 0,
          height: "100%",
          padding: "108px 54px 48px 38px",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      },
      createElement(
        "div",
        {
          style: {
            display: "flex",
            color: "#e9eb9e",
            fontSize: titleSize(title),
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: -2,
            wordBreak: "break-word",
          },
        },
        title,
      ),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
        },
        createElement(
          "div",
          {
            style: {
              display: "flex",
              color: "#7da9b9",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1,
            },
          },
          "guidefari.com",
        ),
        createElement("div", {
          style: {
            display: "flex",
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#e9eb9e",
          },
        }),
      ),
    ),
  );
}

/** Renders the deterministic social card returned by the Worker. */
export async function renderOgImage(title: string): Promise<Response> {
  return ImageResponse.async(card(title), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: "JetBrains Mono",
        data: jetBrainsMonoBold,
        weight: 700,
        style: "normal",
      },
    ],
    headers: IMAGE_HEADERS,
  });
}
