import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

test.describe('Using Mock', () => {

  test.beforeEach(async ({ page }) => {

    await page.route('*/**/api/tags', async route => {
      await route.fulfill({
        body: JSON.stringify(tags)
      })
    })

    await page.waitForTimeout(150)

    await page.route('*/**/api/articles*', async route => {
      const response = await route.fetch()
      const responseBody = await response.json()

      responseBody.articles[0].title = "Test playwright - test QA"
      responseBody.articles[0].description = "Description about an article - test QA"

      await route.fulfill({
        body: JSON.stringify(responseBody)
      })
    })

    await page.waitForTimeout(350)

    await page.goto('https://conduit.bondaracademy.com/')

  })

  test('Working with APIs with mock', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');

    await expect(page.locator('app-article-list h1').first()).toContainText('Test playwright - test QA');
    await expect(page.locator('app-article-list p').first()).toContainText('Description about an article - test QA');
  });

})

test.describe('Without mock', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/')
  })

  test('Working with APIs without mock', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  });
  
})

