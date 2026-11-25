
const {
    test,
    assert,
    getRequest,
    postRequest,
    createCookieJar
} = require("./main.test");

/**
 * Assert that response has an expected HTTP status.
 * @param { Response } response
 * @param { number[] } expectedStatuses
 */
function assertStatus(response, expectedStatuses) {
    assert.ok(
        expectedStatuses.includes(response.status),
        `Expected status ${expectedStatuses.join(" or ")}, received ${response.status}`
    );
}

test("sign-in page creates a reusable session cookie", async function() {
    const cookieJar = createCookieJar();

    const response = await getRequest("/signin", {
        cookieJar
    });

    assert.equal(response.status, 200);
    assert.notEqual(cookieJar.getHeader(), "");
});

test("session cookie can be reused across multiple requests", async function() {
    const cookieJar = createCookieJar();

    const signInResponse = await getRequest("/signin", {
        cookieJar
    });

    assert.equal(signInResponse.status, 200);

    const firstResponse = await getRequest("/signin", {
        cookieJar
    });

    const secondResponse = await getRequest("/signin", {
        cookieJar
    });

    assert.equal(firstResponse.status, 200);
    assert.equal(secondResponse.status, 200);
});

test("different cookie jars maintain separate sessions", async function() {
    const firstCookieJar = createCookieJar();
    const secondCookieJar = createCookieJar();

    const firstResponse = await getRequest("/signin", {
        cookieJar: firstCookieJar
    });

    const secondResponse = await getRequest("/signin", {
        cookieJar: secondCookieJar
    });

    assert.equal(firstResponse.status, 200);
    assert.equal(secondResponse.status, 200);

    assert.notEqual(firstCookieJar.getHeader(), "");
    assert.notEqual(secondCookieJar.getHeader(), "");
    assert.notEqual(
        firstCookieJar.getHeader(),
        secondCookieJar.getHeader()
    );
});

test("invalid session cookie cannot create an authenticated session", async function() {
    const response = await postRequest("/api/log", {
        headers: {
            cookie: "connect.sid=invalid-session-cookie"
        },
        body: {
            reportId: 1,
            logCategoryId: 1,
            value: "10",
            time: Date.now()
        }
    });

    assertStatus(response, [401, 403]);
});

test("unauthenticated users cannot create logs", async function() {
    const response = await postRequest("/api/log", {
        body: {
            reportId: 1,
            logCategoryId: 1,
            value: "10",
            time: Date.now()
        }
    });

    assertStatus(response, [401, 403]);
});

test("sign-out uses the existing session cookie", async function() {
    const cookieJar = createCookieJar();

    const signInResponse = await getRequest("/signin", {
        cookieJar
    });

    assert.equal(signInResponse.status, 200);

    const signOutResponse = await getRequest("/signout", {
        cookieJar,
        redirect: "manual"
    });

    assert.equal(signOutResponse.status, 302);
    assert.equal(
        signOutResponse.headers.get("location"),
        "/signin"
    );
});

test("session cannot access protected API after sign-out", async function() {
    const cookieJar = createCookieJar();

    const signInResponse = await getRequest("/signin", {
        cookieJar
    });

    assert.equal(signInResponse.status, 200);

    const signOutResponse = await getRequest("/signout", {
        cookieJar,
        redirect: "manual"
    });

    assert.equal(signOutResponse.status, 302);

    const response = await postRequest("/api/log", {
        cookieJar,
        body: {
            reportId: 1,
            logCategoryId: 1,
            value: "10",
            time: Date.now()
        }
    });

    assertStatus(response, [401, 403]);
});
