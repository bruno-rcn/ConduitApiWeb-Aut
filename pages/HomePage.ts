import { Locator, Page, test, expect } from '@playwright/test';
import { HelperBase } from './utils/HelperBase';

export class HomePage extends HelperBase {

    // Logo Home
    readonly textFromLogo: Locator = this.page.locator('.navbar-brand')
    readonly home: Locator = this.page.getByText('Home')
    // Global Feed - Articles
    readonly globalFeedTitle: Locator = this.page.getByText('Global Feed')
    readonly titleArticle: Locator = this.page.locator('app-article-list h1').first()
    readonly descriptionArticle: Locator = this.page.locator('app-article-list p').first()
    // Links and Buttons
    readonly newArticle: Locator = this.page.getByText('New Article')

    constructor(page: Page) { super(page) }

    async confirmLogoHome() {
        await expect(this.textFromLogo).toHaveText('conduit');
    }

    async confirmArticle(title: string, description: string) {
        await expect(this.titleArticle).toContainText(title);
        await expect(this.descriptionArticle).toContainText(description);
    }

    async confirmArticleDeleted(title: string) {
        await expect(this.page.locator('app-article-list h1').first()).not.toContainText(title);
    }

    async selectArticleByText(article: string) {
        await this.globalFeedTitle.click()
        await this.page.getByText(article).click()
    }
}