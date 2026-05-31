import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:5175'

const navChecks = [
  { link: 'Dashboard', url: '/dashboard', must: ['Total Assets'] },
  { link: 'Asset Management', url: '/assets', must: ['Register', 'Track and manage'] },
  { link: 'User Management', url: '/users', must: ['User Management'] },
  { link: 'Locations', url: '/locations', must: ['Locations'] },
  { link: 'Reports', url: '/reporting', must: ['Total Assets', 'Predefined Reports'] },
  { link: 'Action Log', url: '/audit', must: ['Action Log'] },
]

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' }).catch(() => chromium.launch({ headless: true }))
  const page = await browser.newPage()
  const consoleErrors = []
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', (e) => consoleErrors.push(e.message))

  const results = []

  try {
    await page.goto(`${BASE}/auth`, { waitUntil: 'domcontentloaded' })
    const authOk = await page.getByRole('button', { name: 'Sign In' }).isVisible()
    results.push({ check: '/auth — login page', pass: authOk })

    await page.fill('#login-email', 'admin@company.com')
    await page.fill('#login-password', 'test1234')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL('**/dashboard', { timeout: 20000 })
    results.push({ check: '/auth — login flow', pass: true, detail: 'redirected to /dashboard' })

    for (const { link, url, must } of navChecks) {
      await page.getByRole('link', { name: link }).click()
      await page.waitForURL(`**${url}`, { timeout: 15000 })
      await page.waitForTimeout(url === '/assets' ? 2500 : 1000)
      const text = await page.locator('body').innerText()
      const pass = must.every((m) => text.includes(m))
      results.push({ check: `${url}`, pass, detail: pass ? must.join(', ') : `missing one of: ${must.join(', ')}` })
    }

    await page.getByRole('link', { name: 'Reports' }).click()
    await page.waitForTimeout(800)
    await page.getByText('Quarterly inspection overdue for IT assets').click()
    await page.waitForTimeout(800)
    results.push({ check: '/reporting drill-down', pass: await page.getByRole('heading', { name: 'PA-001' }).isVisible() })

    await page.getByRole('button', { name: 'Reporting & Analytics' }).click()
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Predefined Reports' }).click()
    await page.waitForTimeout(600)
    results.push({ check: '/reporting predefined view', pass: await page.getByRole('button', { name: 'Generate Report' }).first().isVisible() })

    await page.getByRole('button', { name: 'Reporting & Analytics' }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: 'Custom Report' }).click()
    await page.waitForTimeout(600)
    results.push({ check: '/reporting custom view', pass: await page.getByText('Filter Criteria').isVisible() })

    await page.getByRole('button', { name: 'Back to Dashboard' }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: 'Scheduled Reports' }).click()
    await page.waitForTimeout(600)
    results.push({ check: '/reporting scheduled view', pass: await page.getByRole('button', { name: 'New Schedule' }).isVisible() })

    const ignored = consoleErrors.filter((e) => !e.includes('favicon') && !e.includes('404'))
    results.push({ check: 'No console errors', pass: ignored.length === 0, detail: ignored.slice(0, 3).join(' | ') || 'none' })
  } catch (err) {
    results.push({ check: 'runner', pass: false, detail: err instanceof Error ? err.message : String(err) })
  } finally {
    await browser.close()
  }

  console.log(JSON.stringify(results, null, 2))
  process.exit(results.some((r) => !r.pass) ? 1 : 0)
}

main()
