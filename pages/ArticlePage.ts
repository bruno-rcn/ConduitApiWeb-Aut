import { Locator, Page, expect } from '@playwright/test';
import { HelperBase } from './utils/HelperBase';

export class ArticlePage extends HelperBase {

    constructor(page: Page) { super(page) }

    // button
    readonly btnDelete: Locator = this.page.getByRole('button', { name: 'Delete Article' }).first()
    readonly btnPublishArticle: Locator = this.page.getByRole('button', {name: ' Publish Article '})
    // Input text
    readonly inputArticleTitle: Locator = this.page.getByRole('textbox', {name: 'Article Title'})
    readonly inputArticleAbout: Locator = this.page.getByRole('textbox', {name: "What's this article about?"})
    readonly inputArticleDescription: Locator = this.page.getByRole('textbox', {name: 'Write your article (in markdown)'})

    async createNewArticle(title: string,about: string, description: string){
        await this.inputArticleTitle.fill(title)
        await this.inputArticleAbout.fill(about)
        await this.inputArticleDescription.fill(description)
    }

    async confirmNewArticle(title: string){
        await expect(this.page.locator('.article-page h1')).toContainText(title);
    }

}