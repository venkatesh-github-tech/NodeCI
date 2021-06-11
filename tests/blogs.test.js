const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("when logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    await page.waitForSelector("form label");
    const label = await page.getContentsOf("form label");
    expect(label).toEqual("Blog Title *");
  });

  describe("And using invalid Input", () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form shows the error message", async () => {
      const errorTitle = await page.getContentsOf("#errTitle");
      const errorContent = await page.getContentsOf("#errContent");
      expect(errorTitle).toEqual("Blog title should not be empty");
      expect(errorContent).toEqual("Blog content should not be empty");
    });
  });

  describe("And using valid input", () => {
    beforeEach(async () => {
      //get the textboxes selector && type some content
      //await page.type(".title input", "This is title for jest");
      await page.type("div input", "This is title for jest");
      //await page.type(".content input", "This is blog for jest");
      // const el = await page.getContentsOf(".editor-class");
      // el.textConent = "This is blog for jest";
      await page.click(".editor-class");
      await page.type(".editor-class", "This is blog for jest");
      await page.click("form button");
    });

    test("submitting take the user to review screen", async () => {
      //console.log(await page.getContentsOf("html"));
      const reviewButton = await page.getContentsOf("h5");
      expect(reviewButton).toEqual("Please confirm your entries");
    });

    test("submitting then saves brings to blog index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");

      const title = await page.getContentsOf("h3");
      const content = await page.getContentsOf("p");

      expect(title).toEqual("This is title for jest");
      expect(content.substring(3, 24)).toEqual("This is blog for jest");
    });
  });
});

describe("When user not logged in", () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "/api/blogs",
      data: { title: "This is title", content: "This is content" },
    },
  ];

  test("Blog related operations are prohibited", async () => {
    const results = await page.execRequests(actions);
    for (let result of results) {
      expect(result.error).toEqual("You must log in!");
    }
  });
  /*test('User cannot create a blog post', async ()=>{
        const result = await page.post('/api/blogs',{title: "My test title", content: "My content"})
        console.log(result);
        expect(result.error).toEqual("You must log in!");
    })

    test('User cannot see the blog post', async ()=>{

        const result = await page.get('api/blogs/');
        console.log('user cannot see post:',result);
        expect(result.error).toEqual("You must log in!");
    })*/
});
