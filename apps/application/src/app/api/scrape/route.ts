import type { NextRequest } from "next/server";
import type { Browser } from "puppeteer-core";
import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import TurndownService from "turndown";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    // Check if URL is provided
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    console.log(url, "url from puppet");

    // Launch Puppeteer with safe type usage
    const browser: Browser = await puppeteer.launch({
      args: [...chromium.args],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`,
      ),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Navigate to the provided URL and wait for content to load
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract the content of the webpage
    const htmlContent: string = await page.content();

    console.log(htmlContent, "htmlContent");

    // Close the browser
    await browser.close();

    // Initialize Turndown service to convert HTML to Markdown
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(htmlContent);
    console.log(markdown, "markdown");

    // Return the generated markdown
    return NextResponse.json({ markdown });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
