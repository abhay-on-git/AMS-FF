import { chromium } from 'playwright'

const BASE = 'http://localhost:5175'

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' })
  const page = await browser.newPage()
  page.on('console', (m) => console.log('CONSOLE', m.type(), m.text()))
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message))

  await page.goto(`${BASE}/auth`)
  await page.fill('#login-email', 'admin@company.com')
  await page.fill('#login-password', 'test1234')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/dashboard', { timeout: 20000 })
  console.log('URL after login:', page.url())

  await page.goto(`${BASE}/reporting`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(5000)
  console.log('URL on reporting:', page.url())
  console.log('Title:', await page.title())
  const text = await page.locator('body').innerText()
  console.log('Body snippet:', text.slice(0, 1500))
  await page.screenshot({ path: 'scripts/debug-reporting.png', fullPage: true })
  await browser.close()
}

main()
