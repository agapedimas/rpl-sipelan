const {
    test,
    assert,
    getRequest,
    postRequest,
    createCookieJar
} = require("./main.test");

test("sign-in page can be requested and its session cookie reused for sign-out", async function() {
    const cookieJar = createCookieJar();

    const signInResponse = await getRequest("/signin", { cookieJar });
    assert.equal(signInResponse.status, 200);

    const signOutResponse = await getRequest("/signout", {
        cookieJar,
        redirect: "manual"
    });

    assert.equal(signOutResponse.status, 302);
    assert.equal(signOutResponse.headers.get("location"), "/signin");
});

test("verification rejects an invalid OTP", async function() {
    const response = await postRequest("/api/verifyOtp", {
        body: {
            accountId: 0,
            otpCode: 0
        }
    });

    assert.equal(response.status, 401);
    assert.match(await response.text(), /Invalid OTP code/i);
});
