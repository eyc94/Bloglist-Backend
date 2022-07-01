const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("Notes are returned as JSON", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
}, 100000);

test("There is no note", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(0);
});

afterAll(() => {
    mongoose.connection.close();
});
