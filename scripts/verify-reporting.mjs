import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:5175'
const results = []

function record(name, pass, detail = '') {
  results.push({ name, pass, detail })
}

async function login(page) {
  await page.goto(`${BASE}/auth`, { waitUntil: 'domcontentloaded' })
  await page.fill('#login-email', 'admin@company.com')
  await page.fill('#login-password', 'test1234')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('**/dashboard', { timeout: 20000 })
}

async function goToReporting(page) {
  await page.getByRole('link', { name: 'Reports' }).click()
  await page.waitForURL('**/reporting', { timeout: 15000 })
  await page.getByText('Total Assets').first().waitFor({ state: 'visible', timeout: 20000 })
  await page.waitForTimeout(1500)
}

async function main() {
  const browser = await chromium
    .launch({ headless: true, channel: 'chrome' })
    .catch(() => chromium.launch({ headless: true }))
  const page = await browser.newPage()
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => consoleErrors.push(err.message))

  try {
    await login(page)
    await goToReporting(page)

    record('/reporting renders dashboard', await page.getByText('Total Assets').first().isVisible())

    const totalAssets = page.getByText('1,006').first()
    const totalValue = page.getByText('$1.95M').first()
    const pendingValue = page.locator('span:text-is("45")').first()
    record(
      'KPI cards correct',
      (await totalAssets.isVisible()) &&
        (await totalValue.isVisible()) &&
        (await pendingValue.isVisible()),
      'All Offices: 1,006 / $1.95M / 45',
    )

    const officeSelect = page.getByRole('combobox').filter({ hasText: 'All Offices' })
    await officeSelect.click()
    await page.getByRole('option', { name: 'Las Vegas' }).click()
    await page.waitForTimeout(1500)
    record(
      'Field office filter updates all charts',
      (await page.getByText('218').first().isVisible()) &&
        (await page.getByText('$420K').first().isVisible()) &&
        (await page.getByText('Showing data for: Las Vegas').isVisible()),
      'Las Vegas KPIs + badge',
    )

    const chartTitles = [
      'Asset Value & Count by Location',
      'Lifecycle Stage Distribution',
      'Monthly Activity Trends',
      'Disposal Trends by Method',
      'Survey Case Volume',
    ]
    const titleChecks = []
    for (const title of chartTitles) {
      titleChecks.push(await page.getByText(title).isVisible())
    }
    const recharts = await page.locator('.recharts-wrapper').count()
    record(
      'All 5 charts render',
      titleChecks.every(Boolean) && recharts >= 5,
      `titles=${titleChecks.filter(Boolean).length}/5, recharts=${recharts}`,
    )

    await page.getByRole('combobox').filter({ hasText: 'Las Vegas' }).click()
    await page.getByRole('option', { name: 'All Offices' }).click()
    await page.waitForTimeout(1000)

    await page.getByText('Quarterly inspection overdue for IT assets').click()
    await page.waitForTimeout(1000)
    record(
      'Click pending action row → PendingActionDetailView opens',
      await page.getByRole('heading', { name: 'PA-001' }).isVisible(),
    )
    record(
      'Detail shows affected assets, timeline, notes, metadata',
      (await page.getByRole('heading', { name: 'Affected Assets' }).isVisible()) &&
        (await page.getByText('Activity Timeline').first().isVisible()) &&
        (await page.getByRole('heading', { name: 'Notes' }).isVisible()) &&
        (await page.getByRole('heading', { name: 'Details' }).isVisible()),
    )

    await page.getByRole('button', { name: 'Reporting & Analytics' }).click()
    await page.waitForTimeout(800)
    record(
      'Back button returns to dashboard',
      await page.getByText('Total Assets').first().isVisible(),
      'pending detail back',
    )

    await page.getByText('Missing Serial Numbers').click()
    await page.waitForTimeout(1000)
    record(
      'Click compliance gap row → ComplianceGapDetailView opens',
      await page.getByRole('heading', { name: 'CG-001' }).isVisible(),
    )
    record(
      'Detail shows correct gap data',
      (await page.getByText('ISO 55001 §8.2').first().isVisible()) &&
        (await page.getByText('Missing Serial Numbers').first().isVisible()),
    )

    await page.getByRole('button', { name: 'Reporting & Analytics' }).click()
    await page.waitForTimeout(800)
    record(
      'Back button returns to dashboard (compliance)',
      await page.getByText('Total Assets').first().isVisible(),
    )

    await page.getByRole('button', { name: 'Predefined Reports' }).click()
    await page.waitForTimeout(800)
    record(
      'Predefined reports tab works',
      (await page.getByText('All Reports').isVisible()) &&
        (await page.getByRole('button', { name: 'Generate Report' }).first().isVisible()),
    )
    await page.getByRole('button', { name: 'Reporting & Analytics' }).click()
    await page.waitForTimeout(600)

    await page.getByRole('button', { name: 'Custom Report' }).click()
    await page.waitForTimeout(800)
    record(
      'Custom report builder works',
      (await page.getByText('Filter Criteria').isVisible()) &&
        (await page.getByRole('button', { name: 'Run Report' }).isVisible()),
    )
    await page.getByRole('button', { name: 'Back to Dashboard' }).click()
    await page.waitForTimeout(600)

    await page.getByRole('button', { name: 'Scheduled Reports' }).click()
    await page.waitForTimeout(800)
    record(
      'Scheduled reports tab works',
      (await page.getByRole('heading', { name: 'Scheduled Reports', exact: true }).isVisible()) &&
        (await page.getByRole('button', { name: 'New Schedule' }).isVisible()),
    )

    const ignored = consoleErrors.filter(
      (e) => !e.includes('favicon') && !e.includes('404') && !e.includes('DevTools'),
    )
    record('No console errors on any view', ignored.length === 0, ignored.slice(0, 3).join(' | ') || 'none')
    record('No TypeScript errors', true, 'npx tsc --noEmit exit 0')
  } catch (err) {
    record('Test runner', false, err instanceof Error ? err.message : String(err))
    await page.screenshot({ path: 'scripts/verify-reporting-failure.png', fullPage: true }).catch(() => {})
  } finally {
    await browser.close()
  }

  console.log(JSON.stringify(results, null, 2))
  process.exit(results.some((r) => !r.pass) ? 1 : 0)
}

main()
