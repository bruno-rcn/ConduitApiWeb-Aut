import { Page } from '@playwright/test';
import { LoginPage } from '../LoginPage'
import { HomePage } from '../HomePage'
import { ArticlePage } from '../ArticlePage'

export class PageManager {

    private readonly page: Page
    private readonly loginPage: LoginPage
    private readonly homePage: HomePage
    private readonly articlePage: ArticlePage

    constructor(page: Page) {
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.homePage = new HomePage(this.page)
        this.articlePage = new ArticlePage(this.page)
    }

    onLoginPage() {
        return this.loginPage
    }

    onHomePage() {
        return this.homePage
    }

    onArticlePage() {
        return this.articlePage
    }
}