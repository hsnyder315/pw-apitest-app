import { test as setup, expect } from '@playwright/test';

setup('Create new article', async({request}) => {
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"Likes test article","description":"Please delete","body":"Delete me","tagList":[]}
    }
  })
  expect(articleResponse.status()).toEqual(201)
  const response = await articleResponse.json()
  const slugID = response.article.slug
  process.env['SLUGID'] = slugID
})