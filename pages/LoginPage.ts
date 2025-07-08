import { Locator, Page, test } from '@playwright/test';
import { HelperBase } from './utils/HelperBase';

export class LoginPage extends HelperBase {

    constructor(page: Page) { super(page) }

    // input text
    readonly inputEmail: Locator = this.page.getByRole('textbox', { name: 'Email' })
    readonly inputPassword: Locator = this.page.getByRole('textbox', { name: 'Password' })
    readonly linkByTextSignin: Locator = this.page.getByText('Sign in')
    // button
    readonly btnSignin: Locator = this.page.getByRole('button', {name: ' Sign in '})


    async formLogin() {
        await this.linkByTextSignin.click()
        await this.inputEmail.fill('brunor@teste.com')
        await this.inputPassword.fill('12345678')
        await this.btnSignin.click()
    }
}
