import { Page, Locator } from '@playwright/test';

export class HelperBase{

    readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async visitPage(){
        await this.page.goto('/');
    }
}