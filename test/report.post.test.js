const {
    suite,
    test,
    before,
    after,
    assert,
    getRequest,
    postRequest,
    deleteRequest,
    createCookieJar
} = require("./main.test");

suite("Test POST API reports", () => {
    let newReportId;
    let cookieJar;

    // before all, aku butuh loginnnnnnnn
    before(async () => {
        cookieJar = createCookieJar();

        const response = await postRequest("/api/test/signin", {
            body: { accountId: 8 }, // gunakan user dengan role yang punya otoritas ini
            cookieJar
        });
        assert.equal(response.status, 200, "Signin failed");

        const who = await getRequest("/api/test/whoami", { cookieJar });
        assert.equal(who.status, 200, "Session not recognized");

        console.log(JSON.stringify(who.body.data));
    });

    // teardown
    after(async () => {
        if (!newReportId) return;

        // const response = await deleteRequest(`/api/reports/${newReportId}`, { cookieJar });
        // assert.equal(response.status, 200, "Cleanup failed");
        const url = `/api/reports/${newReportId}`;
        const response = await deleteRequest(url, { cookieJar });
        const text = await response.text();

        console.log("DELETE", url, response.status, text);
        assert.equal(response.status, 200, `Cleanup failed: ${text}`);
    });

    // BISA DIPASTIKAN INI BERJALAN NORMAL
    test("save new report into db", async () => {
        const response = await postRequest("/api/reports", {
            cookieJar,
            body: {
                status: "handlingRequired",
                description: "Terjadi gempa bumi 5 SR di Garut",
                disasterTypeId: 4,
                submissionArray: [9, 10]
            }
        });

        const body = await response.json();
        console.log(body);
        newReportId = body.data?.reportId; // simpan dulu supaya bisa di-cleanup

        assert.equal(response.status, 200, JSON.stringify(body));
        assert.ok(newReportId, "reportId missing from response");
    });
});