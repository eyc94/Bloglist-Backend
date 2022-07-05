const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog
        .find({}).populate("user", { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
    const body = request.body;
    const user = request.user;

    if (body.title === undefined && body.url === undefined) {
        return response.status(400).end();
    }

    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    });

    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    const user = request.user;

    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndRemove(request.params.id);
        user.blogs.filter(b => b.toString() !== blog._id.toString());
        await user.save();
        return response.status(204).end();
    } else {
        return response.status(401).json({ error: "unauthorized deletion attempt" });
    }
});

blogsRouter.put("/:id", async (request, response) => {
    const body = request.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        { new: true, runValidators: true, context: "query" }
    );
    response.json(updatedBlog);
})

module.exports = blogsRouter;
