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

afterAll(() => {
    mongoose.connection.close();
});
