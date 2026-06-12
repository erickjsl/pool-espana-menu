import { expect, test } from '@playwright/test'

test.describe('mobile category navigation', () => {
  test('returns to Bebidas when scrolling back to the top', async ({ page }) => {
    await page.goto('/')

    const bebidasLink = page.getByRole('link', { name: 'Bebidas' })
    const tragosLink = page.getByRole('link', { name: 'Tragos' })

    await expect(bebidasLink).toHaveAttribute('aria-current', 'true')

    await tragosLink.click()
    await expect(page.locator('#tragos h2')).toBeInViewport()
    await expect(tragosLink).toHaveAttribute('aria-current', 'true')

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))

    await expect(page.locator('#menu h2')).toBeInViewport()
    await expect(bebidasLink).toHaveAttribute('aria-current', 'true')
  })
})
