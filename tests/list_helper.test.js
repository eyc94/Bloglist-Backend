const listHelper = require("../utils/list_helper");

test("dummy function returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
});
