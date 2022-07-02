const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
});

test("Notes are returned as JSON", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
}, 100000);

test("Checks to see that the correct amount of notes are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("Verify that the unique id proeprty is named 'id'", async () => {
    const allBlogs = await helper.blogsInDb();
    const firstBlog = allBlogs[0];

    expect(firstBlog.id).toBeDefined();
});

test("A valid blog can be added", async () => {
    const newBlog = {
        title: "Sample Blog 3",
        author: "ABC",
        url: "https://www.youtube.com",
        likes: 332
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).toContain("Sample Blog 3");
});

test("A blog with no likes is given 0 likes", async () => {
    const newBlogWithNoLikes = {
        title: "Sample Blog 3",
        author: "ABC",
        url: "https://www.youtube.com"
    };

    const response = await api
        .post("/api/blogs")
        .send(newBlogWithNoLikes)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
});

test("A blog with no title or url is a 400 bad request", async () => {
    const blogWithNoTitleAndUrl = {
        author: "ABC",
        likes: 332
    };

    await api
        .post("/api/blogs")
        .send(blogWithNoTitleAndUrl)
        .expect(400);

    const response = await helper.blogsInDb();
    expect(response).toHaveLength(helper.initialBlogs.length);
});

test("Deleting a blog is successful", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).not.toContain(blogToDelete.title);
})

afterAll(() => {
    mongoose.connection.close();
});
