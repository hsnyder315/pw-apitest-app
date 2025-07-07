import { test as setup } from '@playwright/test';
import user from '../.auth/user.json';
import fs from 'fs';

const authFile = '.auth/user.json'

setup('authentication', async ({request}) => {
//    await page.goto('https://conduit.bondaracademy.com/')
//    await page.getByText('Sign In').click()
//    await page.getByRole('textbox', {name: "Email"}).fill('test+hunter002@test.com')
//    await page.getByRole('textbox', {name: "Password"}).fill('P@sswrd2@')
//    await page.getByRole('button').click()
//    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
//
//    await page.context().storageState({path: authFile}) // commented out for Section 7 Lesson 60: API Authentication

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            user: {email: "test+hunter002@test.com", password: "P@sswrd2@"}
        }
    })
    const responseBody = await response.json()
    const accessToken = responseBody.user.token
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))

    process.env['ACCESS_TOKEN'] = accessToken

})