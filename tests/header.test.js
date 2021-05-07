const Page = require("./helpers/page");
let page;
beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});
// test('Add 2 numbers',() =>{
//     const sum = 2+3;
//     expect(sum).toEqual(5);
// })

test("Assert the header text", async () => {
  //const text = await page.$eval('a.brand-logo',el => el.innerHTML);
  const text = await page.getContentsOf("a.brand-logo");
  expect(text).toEqual("Blogster");
});

test("Login with google auth", async () => {
  await page.click(".right a");

  const url = await page.url();
  //console.log(url);

  expect(url).toMatch("/accounts.google.com/");
});

test("google login oauth- validate logout button ", async () => {
  //const id = '605a2d58f286bc27f06ac844';
  await page.login();
  //const text = await page.$eval('a[href="/auth/logout"]',el => el.innerHTML);
  const text = await page.getContentsOf('a[href="/auth/logout"]');
  //console.log(text)
  expect(text).toEqual("Logout");
  //expect(keygrip.verify('session='+sessionString,sig)).toBeTruthy();

  //expect(session).toEqual('eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjA1YTJkNThmMjg2YmMyN2YwNmFjODQ0In19');
});
