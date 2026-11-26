const {
    test,
    suite,
    before,
    assert,
    getRequest,
    postRequest,
    createCookieJar
} = require("./main.test");

suite("Test GET API reports", async(t) => {
    let cookieJar;
    before(async() => {
        cookieJar = createCookieJar();

        const response = await postRequest("/api/test/signin", {
            body: { accountId: 8 },
            cookieJar
        });

        console.log("Signin:", response.status);
        console.log("Set-Cookie:", response.headers.getSetCookie());

        assert.equal(response.status, 200);
        console.log("Cookie to send:", cookieJar.getHeader());

        const who = await getRequest("/api/test/whoami", { cookieJar });
        console.log("Who am I:", await who.text());
    })

    suite("should be accepted", () => {
        test("list report", async() => {
            const response = await getRequest("/api/reports", { cookieJar });
            assert.equal(response.status, 200);
        })

        test("list reports with status closed", async() => {
            const response = await getRequest("/api/reports?status=closed", { cookieJar });
            assert.equal(response.status, 200);
        })

        test("list reports with status handlingRequired", async() => {
            const response = await getRequest("/api/reports?status=handlingRequired", { cookieJar });
            assert.equal(response.status, 200);
        })
    
        test("list report by disaster type id", async() => {
            const disasterTypeId = 5;
            const response = await getRequest(`/api/reports/disaster/${disasterTypeId}`, { cookieJar });
            assert.equal(response.status, 200);
        })
    
        test("list report by isArchived status false", async() => {
            const response = await getRequest("/api/reports/archive?status=false", { cookieJar });
            assert.equal(response.status, 200);
        })
    
        test("list report by archived status true", async() => {
            const response = await getRequest("/api/reports/archive?status=true", { cookieJar });
            assert.equal(response.status, 200);
        })
    
        test("list report by time in milis", async() => {
            const ms = 1795100000;
            const response = await getRequest(`/api/reports/time?milis=${ms}`, { cookieJar });
            assert.equal(response.status, 200);
        })
    
        test("get report by report id", async() => {
            const reportId = 3;
            const response = await getRequest(`/api/reports/${reportId}`, { cookieJar });
            assert.equal(response.status, 200);
        })
    })

    suite("should be OK, but display nothing on the screen", async() => {
        test("list reports by time in milis should be ok, if the data is not in the db", async () => {
            const ms = 1123;

            const response = await getRequest(`/api/reports/time?milis=${ms}`,{ cookieJar });
            const body = await response.json();

            console.log("Status:", response.status);
            console.log("Location:", response.headers.get("location"));
            console.log("Body:", body);

            assert.equal(body.status, 200);
            assert.equal(body.message, "Report not found");
        });
        

        test("get report by report id, but the id is not in the database or id mismatch", async() => {
            const reportId = 1000000000;
            const response = await getRequest(`/api/reports/${reportId}`, { cookieJar });
            
            const body = await response.json();
            
            assert.equal(response.status, 404);
            assert.equal(body.message, "Report not found");
        })
    })

    suite("should be rejected", async() => {
        test("list reports should be rejected if archive status is blank", async () => {
            const response = await getRequest("/api/reports/archive", { cookieJar });

            console.log("Status:", response.status);
            console.log("Location:", response.headers.get("location"));
            console.log("URL:", response.url);
            console.log("Content-Type:", response.headers.get("content-type"));
            console.log("Body:", await response.text());

            assert.equal(response.status, 400);
        });
    
        test("list reports should be rejecet if the isArhchive status is not compatible", async() => {
            const response = await getRequest("/api/reports/archive?status=12341243234asdfasdf", { cookieJar });

            console.log("Status:", response.status);
            console.log("Location:", response.headers.get("location"));
            console.log("URL:", response.url);
            console.log("Content-Type:", response.headers.get("content-type"));
            console.log("Body:", await response.text());

            assert.equal(response.status, 400);
        })
    })
});