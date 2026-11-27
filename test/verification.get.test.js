const {
    test,
    suite,
    assert,
    getRequest,
    postRequest,
    createCookieJar,
    before,
    after,
    deleteRequest
} = require("./main.test");


suite("GET api verification", () => {
    let cookieJar;

    before(async () => {
        cookieJar = createCookieJar();

        const response = await postRequest("/api/test/signin", {
            body: { accountId: 8 },
            cookieJar
        });

        console.log("Signin", response.status);
        console.log("Set-Cookie", response.headers.getSetCookie());

        assert.equal(response.status, 200);
        console.log("Cookie to send:", cookieJar.getHeader());

        const who = await getRequest("/api/test/whoami", { cookieJar });
        assert.equal(who.status, 200, "Session not recognized");

        console.log(await who.json());
    })

    suite("Should be accepted", () => {
        test("list all verification that verifed by this verifier", async() => {
            const response = await getRequest("/api/verification", { cookieJar });
            assert.equal(response.status, 200);
        })
        
        test("list all verification filtered by status verified", async() => {
            const response = await getRequest("/api/verification?status=verified", { cookieJar });
            assert.equal(response.status, 200);
        })

        test("list all verification filtered by status rejected", async() => {
            const response = await getRequest("/api/verification?status=rejected", { cookieJar });
            assert.equal(response.status, 200);
        })
        
        test("list all verification by submission id", async() => {
            const response = await getRequest("/api/verification/submission/9", { cookieJar });
            assert.equal(response.status, 200);
        })
        
        test("find verification by verification id", async() => {
            const response = await getRequest("/api/verification/9", { cookieJar });
            assert.equal(response.status, 200);
        })
    })

    suite("Should be rejected", () => {
        test("reject filter status that is not compatible", async() => {
            const response = await getRequest("/api/verification?status=asdfasdfasdf", { cookieJar });
            console.log(await response.json());
            assert.ok([400, 401, 402, 403, 404].includes(response.status));
        })
        
        test("reject verification by submission id that is not compatible", async() => {
            const response = await getRequest("/api/verification/submission/123123123123", { cookieJar });
            const body = await response.json();

            console.log(body);

            assert.equal(response.status, 404);
            assert.equal(body.message, "Couldnt load the data");
        })
        
        test("reject verification by verification id that is not present in db", async() => {
            const response = await getRequest("/api/verification/999999999999", { cookieJar });
            const body = await response.json();

            console.log(body);

            assert.equal(response.status, 404);
            assert.equal(body.message, "Couldnt load the data");
        })
    })
})