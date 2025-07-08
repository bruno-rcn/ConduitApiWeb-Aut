import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.describe('Using Mock', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('*/**/api/tags', async route => {
      await route.fulfill({
        body: JSON.stringify(tags)
      })
    })

    await page.waitForTimeout(350)

    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: 'Email'}).fill('brunor@teste.com')
    await page.getByRole('textbox', {name: 'Password'}).fill('12345678')
    await page.getByRole('button').click()
  })

  test('Working with APIs with mock', async ({ page }) => {

    await page.waitForTimeout(150)

    await page.route('*/**/api/articles*', async route => {
      const response = await route.fetch()
      const responseBody = await response.json()
      responseBody.articles[0].title = "MOCK DATA - Test playwright - test QA"
      responseBody.articles[0].description = "MOCK DATA - Description about an article - test QA"

      await route.fulfill({
        body: JSON.stringify(responseBody)
      })
    })

    await expect(page.locator('.navbar-brand')).toHaveText('conduit');

    await expect(page.locator('app-article-list h1').first()).toContainText('MOCK DATA - Test playwright - test QA');
    await expect(page.locator('app-article-list p').first()).toContainText('MOCK DATA - Description about an article - test QA');
  });

  test('Create an articlbe by API and delete from front end', async ({ page, request }) => {
    // Para fazer esse teste foi necessario fazer o login no beafore each, depois fazer o login via API para obter o token de acesso para apos isso utilizar o metodo post para criar o artigo e assim deletar via front

    // 1 - Sign in to take the token
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: { email: "brunor@teste.com", password: "12345678" }
      }
    })
    expect(response.status()).toEqual(200)
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    // 2 - Post to create
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
      data: {
        article: { title: "Teste delete article", description: "Teste vscode br", body: "abcdefg", tagList: [] }
      },
      headers: {
        Authorization: `Token ${accessToken}`
      }
    })
    expect(articleResponse.status()).toEqual(201)

    // 3 - Delete by front
    await page.waitForTimeout(150)

    await page.getByText('Global Feed').click()
    await page.getByText('Teste delete article').click()
    await page.getByRole('button', { name: 'Delete Article' }).first().click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).not.toContainText('Teste delete article');

  })

})

test.describe('Without mock', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/')
  })

  test('Working with APIs without mock', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  });

})

