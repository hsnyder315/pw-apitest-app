import { test, expect, request } from '@playwright/test';
import tags from '../test-data/test.json'

// Section 7 Lesson 54: Project Setup
// test.beforeEach(async ({page}) => {
//   // Section 7 Lesson 55: Mocking APIs
//   // Filter network tab in DOM to show only Fetch/XHR types, this will make finding APIs easier.
//   // In the context of conduit, we need to mock the Popular Tags API endpoints so we don't have to provide a list of them.
//   // To get the correct API info, goto open DOM -> Network tab -> tags -> Response tab
//   // We will then use this info to create our own object to be displayed.
//   // To create an API mock, you MUST start with configuring it inside of the playwright framework(so in this case, in this file) otherwise PW won't know which API should be intercepted.
//   // We need to create a root command:
//   await page.route('*/**/api/tags', async route => {
//     // Inside of the new route, we need to create a new function
//     // Tags object moved to test.json
//     // After the tags are setup, we need to fullfill the object (tags) as a desired response
//       await route.fulfill({
//         // We want to replace a body, and we need to call the object (tags) as the desired response
//         // However, we cannot simply call the object (tags) itself, it needs to be stringified
//         body: JSON.stringify(tags) // tags here is being called from test.json
//       })
//   })
// 
//   await page.goto('https://conduit.bondaracademy.com/')
// }) - Commented out as part of Lesson 57

// Section 7 Lesson 55 continued:
// The earlier setup is sometimes not recommended as it is an object (tags) inside of the code. We can instead remove the object (tags) from this code and create a new page object file to call for further objects to be defined outside of the code.

test('has title', async ({ page }) => {
  // Section 7 Lesson 56: Modify API Response
  // Last lesson we created a mock API object to call and verify, this lesson we'll update the first article with our own title and description on the conduit page.
  // To start, create a new route using the first article URL from the network tab, and use */**/ for most of the URL as well as a /* after articles
  // This method tells Playwright to 
  await page.route('*/**/api/articles?limit=10&offset=0', async route => {
    // Now that we've intercepted the URL, we need to continue the API call and get the response:
    const response = await route.fetch()
    // Next, get the JSON body from this request
    // In this request, we take a JSON property instead of body as body will return a string so it's easier to work with as a JSON object
    const responseBody = await response.json()
    // Using Postman, you can make a GET call for the article API URL and find the first object in the articles array
    // We will use this object to change the title and description
    responseBody.articles[0].title = "This is a mock test title"
    responseBody.articles[0].description = "This is a mock test description"
    // Now we fulfill the modified response as a desired response to the app
    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  // Section 7 Lesson 57: Perform API Request
  // To start we want to navigate to the Global Feed
  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a mock test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a mock test description')
});

// Section 7 Lesson 57 Cont.
// Now that we have PW navigating to the Global Feed and changing the first article and tags with mocks, we can create a new test to delete a test article
test('Delete Article', async({ page, request }) => {
  // This test will involve signing in, creating, then deleting an article
  // It will have to use real APIs instead of mocks to work
  // To make an API call in playwright, we use <await request> and request will need to be imported from PW and we'll need to add the request fixture to the test options
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    // Next we add an object to get a username and password to submit to the login, calling it data
    data: {
      // We need to get the entire Request Payload from the DOM
      user: {email: "test+hunter002@test.com", password: "P@sswrd2@"}
    }
  })
  
  // After the request is performed, we need the result and to process the response body
  const responseBody = await response.json()
  const accessToken = responseBody.user.token
  // console.log(responseBody.user.token) - commented out as we no longer need it when we add the token to the above const
  // Now that we have our user object, we need to get the user object and read the token value
  // We add on to the log call to do this. After we run this setup, we can add a new variable with this token value after the first const

  // After we create our new accessToken call with the token value we recovered, we can perform a second API call to actually create the article
  
})