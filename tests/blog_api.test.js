const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog));
    const promiseArray = blogObjects.map(blog => blog.save());
    await Promise.all(promiseArray);
});

test("Blogs are returned as JSON", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
}, 100000);

test("Checks to see that the correct amount of blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("Verify that the unique id proeprty is named 'id'", async () => {
    const allBlogs = await helper.blogsInDb();
    const firstBlog = allBlogs[0];

    expect(firstBlog.id).toBeDefined();
});

describe("Testing the creation of blogs with user tokens", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("supersecret", 10);
        const user = new User({ username: "superuser", passwordHash });

        await user.save();
    });

    test("A valid blog can be added", async () => {
        const targetUser = {
            username: "superuser",
            password: "supersecret"
        };

        const userResult = await api
            .post("/api/login")
            .send(targetUser)
            .expect(200);

        const { token } = userResult.body;

        const newBlog = {
            title: "Sample Blog 3",
            author: "ABC",
            url: "https://www.youtube.com",
            likes: 332
        };

        await api
            .post("/api/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

        const titles = blogsAtEnd.map(b => b.title);
        expect(titles).toContain("Sample Blog 3");
    });

    test("A blog with no likes is given 0 likes", async () => {
        const targetUser = {
            username: "superuser",
            password: "supersecret"
        };

        const userResult = await api
            .post("/api/login")
            .send(targetUser)
            .expect(200);

        const { token } = userResult.body;

        const newBlogWithNoLikes = {
            title: "Sample Blog 3",
            author: "ABC",
            url: "https://www.youtube.com"
        };

        const response = await api
            .post("/api/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlogWithNoLikes)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body.likes).toBe(0);
    });

    test("A blog with no title or url is a 400 bad request", async () => {
        const targetUser = {
            username: "superuser",
            password: "supersecret"
        };

        const userResult = await api
            .post("/api/login")
            .send(targetUser)
            .expect(200);

        const { token } = userResult.body;

        const blogWithNoTitleAndUrl = {
            author: "ABC",
            likes: 332
        };

        await api
            .post("/api/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .send(blogWithNoTitleAndUrl)
            .expect(400);

        const response = await helper.blogsInDb();
        expect(response).toHaveLength(helper.initialBlogs.length);
    });
});


describe("Testing the deletion of blogs with user tokens", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("supersecret", 10);
        const user = new User({ username: "superuser", passwordHash });

        await user.save();
    });

    test("Deleting a blog is successful on blogs created by specific user", async () => {
        const targetUser = {
            username: "superuser",
            password: "supersecret"
        };

        const userResult = await api
            .post("/api/login")
            .send(targetUser)
            .expect(200);

        const { token } = userResult.body;

        const newBlog = {
            title: "Dogs are better than cats!",
            author: "Mr. Dog",
            url: "https://www.dogs.com",
            likes: 33235345234
        };

        await api
            .post("/api/blogs")
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[2];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

        const titles = blogsAtEnd.map(b => b.title);
        expect(titles).not.toContain(blogToDelete.title);
    });
});

test("Updating a blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 999 })
        .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    const updatedBlog = blogsAtEnd[0];
    expect(updatedBlog.likes).toBe(999);
});

describe("Testing the creation of a user with one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("sekret", 10);
        const user = new User({ username: "root", passwordHash });

        await user.save();
    });

    test("Creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "sampleusername",
            name: "EC",
            password: "password"
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test("Creation fails with proper statuscode and message if username already exists", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "password"
        };

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        expect(result.body.error).toContain("username must be unique");

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
