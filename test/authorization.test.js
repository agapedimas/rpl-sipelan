const {
    test,
    assert,
    getRequest,
    postRequest,
    createCookieJar
} = require("./main.test");

const protectedRequestBody = {
    reportId: 1,
    logCategoryId: 1,
    value: "10",
    time: Date.now()
};

test("unauthenticated users cannot create logs", async function() {
    const response = await postRequest("/api/log", {
        body: protectedRequestBody
    });

    assert.ok([401, 403].includes(response.status));
});

test("invalid session cannot create logs", async function() {
    const response = await postRequest("/api/log", {
        headers: {
            cookie: "connect.sid=invalid-session"
        },
        body: protectedRequestBody
    });

    assert.ok([401, 403].includes(response.status));
});

test("anonymous session cannot create logs", async function() {
    const cookieJar = createCookieJar();

    const signInResponse = await getRequest("/signin", {
        cookieJar
    });

    assert.equal(signInResponse.status, 200);

    const response = await postRequest("/api/log", {
        cookieJar,
        body: protectedRequestBody
    });

    assert.ok([401, 403].includes(response.status));
});
