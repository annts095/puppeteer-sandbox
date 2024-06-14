import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { writeFileSync } from "fs";
import { URL } from "url";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--remote-debugging-port=9222"],
  });

  const srcPage = process.env.SRC_PAGE;
  const targetPath = process.env.TARGET_PATH;
  const targetDomain = process.env.TARGET_DOMAIN;
  const outputFileType = process.env.OUTPUT_FILE_TYPE || "html";

  if (srcPage === undefined) {
    console.error("SRC_PAGE is not set.");
    process.exit(1);
  }

  if (targetPath === undefined) {
    console.error("TARGET_PATH is not set.");
    process.exit(1);
  }

  if (targetDomain === undefined) {
    console.error("TARGET_DOMAIN is not set.");
    process.exit(1);
  }

  const page = await browser.newPage();
  await page.goto(srcPage);

  // SPAの特定のページにナビゲート
  await page.click(`a[href="${targetPath}"]`);
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // Lighthouseを実行
  const csrResult = await lighthouse(page.url(), {
    port: new URL(browser.wsEndpoint()).port,
    output: outputFileType,
  });

  // レポートをファイルに保存
  writeFileSync(`./report/csr.${outputFileType}`, csrResult.report);

  // キャッシュを削除
  const ssrPage = await browser.newPage();
  await ssrPage.setCacheEnabled(false);

  // 対象ページをサーバーサイドで描画したときのレポートを作成
  const ssrResult = await lighthouse(`${targetDomain}${targetPath}`, {
    port: new URL(browser.wsEndpoint()).port,
    output: outputFileType,
  });

  // レポートをファイルに保存
  writeFileSync(`./report/ssr.${outputFileType}`, ssrResult.report);

  await browser.close();
  console.log("Lighthouse report is done.");
})();
