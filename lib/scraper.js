import puppeteer from "puppeteer";

export async function scrapeDoneDeal(query) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    const url = `https://www.donedeal.ie/cars-for-sale?search=${encodeURIComponent(query)}`;

    await page.goto(url, { waitUntil: "networkidle2" });

    const listings = await page.evaluate(() => {
      const items = document.querySelectorAll("[data-listing-id]");
      return Array.from(items).map((item) => ({
        id: item.getAttribute("data-listing-id"),
        title: item.querySelector("h2")?.textContent || "",
        price: item.querySelector(".price")?.textContent || "",
        description: item.querySelector(".description")?.textContent || "",
      }));
    });

    return { listings, count: listings.length };
  } catch (error) {
    throw new Error(`Scraper error: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
}
