const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
    {
        title: "Sample Blog 1",
        author: "EC",
        url: "https://www.google.com",
        likes: 53
    },
    {
        title: "Sample Blog 2",
        author: "AK",
        url: "https://www.facebook.com",
        like: 77
    }
];

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
    const users = await User.find({});
    return users.map(user => user.toJSON());
};

module.exports = {
    initialBlogs, blogsInDb, usersInDb
};
