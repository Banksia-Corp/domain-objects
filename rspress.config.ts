import path from "node:path";
import { defineConfig } from "@rspress/core";
import { pluginTypeDoc } from "@rspress/plugin-typedoc";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "@banksia/domain-objects",
  description:
    "Enterprise-grade Domain-Driven Design (DDD) primitives and building blocks for TypeScript",
  base: process.env.BASE_PATH || "/",
  plugins: [
    pluginTypeDoc({
      entryPoints: [path.join(__dirname, "src", "index.ts")],
      outDir: "api",
    }),
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/Banksia-Corp/domain-objects",
      },
    ],
    footer: {
      message: "Released under the MIT License. Copyright © 2025 Banksia Corp.",
    },
    editLink: {
      docRepoBaseUrl:
        "https://github.com/Banksia-Corp/domain-objects/tree/main/docs",
      text: "Edit this page on GitHub",
    },
  },
});
