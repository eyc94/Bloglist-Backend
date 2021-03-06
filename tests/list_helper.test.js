const listHelper = require("../utils/list_helper");

const listWithNoBlog = [];

const listWithOneBlog = [
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
];

const listWithManyBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
];

describe("Most likes", () => {
    test("of an empty blog is an empty list", () => {
        const result = listHelper.mostLikes(listWithNoBlog);
        expect(result).toEqual({});
    });

    test("of a list with one blog is the blog itself", () => {
        const result = listHelper.mostLikes(listWithOneBlog);
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 5
        });
    });

    test("of a list with many blogs is is Edsger with 17 likes", () => {
        const result = listHelper.mostLikes(listWithManyBlogs);
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        });
    });
});

describe("Most blogs", () => {
    test("of an empty list is an empty list", () => {
        const result = listHelper.mostBlogs(listWithNoBlog);
        expect(result).toEqual({});
    });

    test("of a list with one blog is the list itself with 1 blog", () => {
        const result = listHelper.mostBlogs(listWithOneBlog);
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            blogs: 1
        });
    });

    test("of a list with many blogs is Robert C. Martin's 3 blogs", () => {
        const result = listHelper.mostBlogs(listWithManyBlogs);
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3
        });
    })
});

describe("Favorite blog", () => {
    test("of an empty list is null", () => {
        const result = listHelper.favoriteBlog(listWithNoBlog);
        expect(result).toBe(null);
    });

    test("of a list with one blog is the list itself", () => {
        const result = listHelper.favoriteBlog(listWithOneBlog);
        expect(result).toEqual({
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            likes: 5
        })
    });

    test("of a list with many blogs is 'Canonical string reduction'", () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs);
        expect(result).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
        });
    });
});

describe("Total likes", () => {
    test("of empty list is 0", () => {
        const result = listHelper.totalLikes(listWithNoBlog);
        expect(result).toBe(0);
    });

    test("of list with one blog equals the likes of that blog", () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        expect(result).toBe(5);
    });

    test("of list with many blogs equals to the sum of all likes", () => {
        const result = listHelper.totalLikes(listWithManyBlogs);
        expect(result).toBe(36);
    });
});

test("dummy function returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
});
