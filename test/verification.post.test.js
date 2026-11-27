const {
    test,
    suite,
    assert,
    getRequest,
    postRequest,
    createCookieJar,
    before,
    after
} = require("./main.test");

suite("POST api verification", () => {
    let cookieJar;
    let newVerificationId;

    before(async() => {
        cookieJar = createCookieJar();

        const response = await postRequest("/api/test/signin", {
            body: { accountId: 8 },
            cookieJar
        });

        console.log("Signin", response.status);
        console.log("Set-Cookie", response.headers.getSetCookie());

        assert.equal(response.status, 200);
        console.log("Cookie to send", cookieJar.getHeader());

        const who = await getRequest("/api/test/whoami", { cookieJar });
        assert.equal(who.status, 200, "Session not recognized");

        console.log(await who.json());
    });

    test("save new verification", async () => {
        const response = await postRequest("/api/verification", {
            cookieJar,
            body: { status: "verified", reason: "TESTING AJAAA", submissionId: 11 }
        });

        const body = await response.json();
        console.log("save status", response.status, body);

        assert.ok([200, 201].includes(response.status), JSON.stringify(body));
        newVerificationId = body.data?.verificationId;
        assert.ok(newVerificationId, "verificationId tidak ada di response");
    });

    test("reject verification because empty body or incomplete body", async () => {
        const response = await postRequest("/api/verification", { cookieJar, body: {} });
        assert.ok([400, 401, 402, 403, 404].includes(response.status));
    });

    test("reject verification because the submission verification status had the same value", async() => {
        const response = await postRequest("/api/verification", {
            cookieJar,
            body: {
                status: "verified",
                reason: "TEST REJECT",
                submissionId: 9
            }
        });

        assert.ok([400, 401, 402, 403, 404].includes(response.status));
    })
});