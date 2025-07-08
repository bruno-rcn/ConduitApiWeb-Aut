import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'
import { PageManager } from '../pages/utils/PageManager';

test.describe('Using Mock', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('*/**/api/tags', async route => {
      await route.fulfill({
        body: JSON.stringify(tags)
      })
    })

    await page.waitForTimeout(350)

    const pm = new PageManager(page)
    await pm.onLoginPage().visitPage()
    await pm.onLoginPage().formLogin()
  })

  test('Working with APIs with mock', async ({ page }) => {
    const pm = new PageManager(page)

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

    await pm.onHomePage().confirmLogoHome()
    await pm.onHomePage().confirmArticle('MOCK DATA - Test playwright - test QA', 'MOCK DATA - Description about an article - test QA')
  });

  test('Create an articlbe by API and delete from front end', async ({ page, request }) => {
    const pm = new PageManager(page)

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
    await pm.onHomePage().selectArticleByText('Teste delete article')
    await pm.onArticlePage().btnDelete.click()
    await pm.onHomePage().globalFeedTitle.click()
    await pm.onHomePage().confirmArticleDeleted('Teste delete article')
  })

  test('Create by front end and deleted by API', async ({ page, request }) => {
    const pm = new PageManager(page)

    // 1 - create by front
    await pm.onHomePage().newArticle.click()
    await pm.onArticlePage().createNewArticle('Teste to delete', 'delete by API', 'Article created by front end and deleted by API')
    await pm.onArticlePage().btnPublishArticle.click()

    // Intercept the endpoint to take the id from the article
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug

    // Validation on Article Page
    await pm.onArticlePage().confirmNewArticle('Teste to delete')
    
    // Confirm that the article it is showing at the home
    await pm.onHomePage().home.click()
    await pm.onHomePage().globalFeedTitle.click()
    await pm.onHomePage().confirmArticle('Teste to delete', 'delete by API')


    // Sign in to take the token
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: {
        user: { email: "brunor@teste.com", password: "12345678" }
      }
    })
    expect(response.status()).toEqual(200)
    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    // then delete by api
    const responseDeleteRequestArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
      headers: {
        Authorization: `Token ${accessToken}`
      }
    })
    expect(responseDeleteRequestArticle.status()).toEqual(204)

    // Confirm that was deleted
    await pm.onHomePage().globalFeedTitle.click()
    await pm.onHomePage().confirmArticleDeleted('Teste to delete')
  })

})

test.describe('Without mock', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', { name: 'Email' }).fill('brunor@teste.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678')
    await page.getByRole('button').click()
  })

  test('Working with APIs without mock', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  });

})

