const { test, assert, getRequest } = require("./main.test");

test("homepage is served over HTTP", async function() {
    const response = await getRequest("/");
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") || "", /text\/html/);
    assert.match(await response.text(), /Sipelan/i);
});

test("unknown page returns the not-found page", async function() {
    const response = await getRequest("/blackbox-test-page-that-does-not-exist");
    assert.equal(response.status, 404);
    assert.match(response.headers.get("content-type") || "", /text\/html/);
});

test("unknown non-image asset returns 404", async function() {
    const response = await getRequest("/blackbox-test-missing.js");
    assert.equal(response.status, 404);
});
