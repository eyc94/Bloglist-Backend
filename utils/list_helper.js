const mostLikes = (blogs) => {
    let authors = blogs.map(blog => blog.author);
    authors = [...new Set(authors)];

    let likes = new Array(authors.length).fill(0);
    blogs.map(blog => {
        likes[authors.indexOf(blog.author)] += blog.likes;
    });

    let index = likes.indexOf(Math.max(...likes));

    return {
        author: authors[index],
        likes: likes[index]
    };
};

const mostBlogs = (blogs) => {
    let authors = blogs.map(blog => blog.author);
    authors = [...new Set(authors)];

    let published = new Array(authors.length).fill(0);
    blogs.map(blog => {
        published[authors.indexOf(blog.author)]++;
    });

    let index = published.indexOf(Math.max(...published));

    return {
        author: authors[index],
        blogs: published[index]
    };
};

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null;
    }

    let favoriteBlogIndex = 0;
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > blogs[favoriteBlogIndex].likes) {
            favoriteBlogIndex = i;
        }
    }

    const favoriteBlogObject = {
        title: blogs[favoriteBlogIndex].title,
        author: blogs[favoriteBlogIndex].author,
        likes: blogs[favoriteBlogIndex].likes
    };

    return favoriteBlogObject;
};

const totalLikes = (blogs) => {
    const sum = blogs.reduce((accumulator, value) => {
        return accumulator + value.likes;
    }, 0);
    return sum;
};

const dummy = (blogs) => {
    return 1;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};
