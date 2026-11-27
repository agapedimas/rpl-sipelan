const {
    test,
    suite,
    before,
    after,
    assert,
    getRequest,
    postRequest,
    deleteRequest,
    createCookieJar
} = require("./main.test");

suite("Test DELETE API reports", () => {
    let cookieJar;
    let newReportId;
    let isDeleted = false;

    before(async () => {
        cookieJar = createCookieJar();

        const response = await postRequest("/api/test/signin", {
            body: { accountId: 8 }, // gunakan user dengan role yang punya otoritas ini
            cookieJar
        });
        assert.equal(response.status, 200, "Signin failed");

        // create a record that wants to be deleted
        const res = await postRequest("/api/reports", {
            cookieJar,
            body: {
                isArchived: 0,
                status: "handlingRequired",
                description: "Temporary report for DELETE test",
                disasterTypeId: 4,
                submissionArray: [11, 12]
            }
        });
        const body = await res.json();
        console.log("body: "+ JSON.stringify(body.data));
        
        newReportId = body.data?.reportId;

        assert.equal(res.status, 200, JSON.stringify(body));
        assert.ok(newReportId, "reportId missing from response");
    });

    after(async () => {
        if (!newReportId || isDeleted) return;

        const response = await deleteRequest(`/api/reports/${newReportId}`, { cookieJar });
        assert.equal(response.status, 200, `Cleanup failed for report ${newReportId}`);
    });

    test("delete report from database", async () => {
        const response = await deleteRequest(`/api/reports/${newReportId}`, { cookieJar });
        const body = await response.json();
        console.log(body);
        assert.equal(response.status, 200);
        isDeleted = true;

        const check = await getRequest(`/api/reports/${newReportId}`, { cookieJar });
        assert.equal(check.status, 404);
    });

    test("reject deletion if report does not exist", async () => {
        const response = await deleteRequest("/api/reports/1000000000", { cookieJar });
        assert.equal(response.status, 404);
    });
});