const {
    test,
    suite,
    before,
    afterEach,
    assert,
    getRequest,
    postRequest,
    putRequest,
    createCookieJar
} = require("./main.test");

suite("Test PUT API reports", () => {
    const reportId = 1;
    let cookieJar;
    let originalReport;

    before(async () => {
        cookieJar = createCookieJar();

        const response = await postRequest("/api/test/signin", {
            body: { accountId: 8 }, // gunakan user dengan role yang punya otoritas ini
            cookieJar
        });

        console.log("Signin:", response.status);
        console.log("Set-Cookie:", response.headers.getSetCookie());

        assert.equal(response.status, 200);
        console.log("Cookie to send:", cookieJar.getHeader());

        const who = await getRequest("/api/test/whoami", { cookieJar });
        console.log("Who am I:", await who.text());

        // simpan state databse sebelum di update
        const res = await getRequest(`/api/reports/${reportId}`, {
            cookieJar
        });

        const result = await res.json();
        console.log("before ", result);

        assert.equal(res.status, 200);

        originalReport = result.data;
    });

    afterEach(async () => {
        if (!originalReport) return;

        const response = await getRequest(`/api/reports/${reportId}`, {
            cookieJar
        });

        assert.equal(response.status, 200);

        const result = await response.json();
        console.log("after ", result);
        
        const currentReport = result.data;

        // Restore archive status
        if (currentReport.isArchived !== originalReport.isArchived) {
            const restoreResponse = await putRequest(`/api/reports/${reportId}/archive`,
                {
                    cookieJar,
                    body: {
                        isArchived: originalReport.isArchived
                    }
                }
            );

            assert.equal(restoreResponse.status, 200);
        }

        // Restore report status
        if (currentReport.status !== originalReport.status) {
            const restoreResponse = await putRequest(`/api/reports/${reportId}/status`,
                {
                    cookieJar,
                    body: {
                        status: originalReport.status
                    }
                }
            );

            assert.equal(restoreResponse.status, 200);
        }

        // Restore description
        if (currentReport.description !== originalReport.description) {
            const restoreResponse = await putRequest(`/api/reports/${reportId}/description`,
                {
                    cookieJar,
                    body: {
                        description: originalReport.description
                    }
                }
            );

            assert.equal(restoreResponse.status, 200);
        }
    });

    suite("Should be accepted", () => {
        test("update report archived status", async () => {
            const response = await putRequest(`/api/reports/${reportId}/archive`,
                {
                    cookieJar,
                    body: {
                        isArchived: 1
                    }
                }
            );
            console.log(JSON.stringify(response.body));
            assert.equal(response.status, 200);
        });

        test("update report status", async () => {
            const response = await putRequest(`/api/reports/${reportId}/status`,
                {
                    cookieJar,
                    body: {
                        status: "closed"
                    }
                }
            );

            assert.equal(response.status, 200);
        });

        test("update report description", async () => {
            const response = await putRequest(`/api/reports/${reportId}/description`,
                {
                    cookieJar,
                    body: {
                        description: "Updated report description"
                    }
                }
            );

            assert.equal(response.status, 200);
        });
    });

    suite("Should be rejected", () => {
        test("reject invalid archive status", async () => {
            const response = await putRequest(`/api/reports/${reportId}/archive`,
                {
                    cookieJar,
                    body: {
                        isArchived: 5
                    }
                }
            );

            assert.equal(response.status, 400);
        });

        test("reject missing archive status", async () => {
            const response = await putRequest(`/api/reports/${reportId}/archive`,
                {
                    cookieJar,
                    body: {}
                }
            );

            assert.equal(response.status, 400);
        });

        test("reject archive update if report does not exist", async () => {
            const response = await putRequest("/api/reports/1000000000/archive",
                {
                    cookieJar,
                    body: {
                        isArchived: 1
                    }
                }
            );

            assert.equal(response.status, 404);
        });

        test("reject empty description", async () => {
            const response = await putRequest(`/api/reports/${reportId}/description`,
                {
                    cookieJar,
                    body: {
                        description: "   "
                    }
                }
            );

            assert.equal(response.status, 400);
        });

        test("reject non-string description", async () => {
            const response = await putRequest(`/api/reports/${reportId}/description`,
                {
                    cookieJar,
                    body: {
                        description: 123
                    }
                }
            );

            assert.equal(response.status, 400);
        });

        test("reject update if report does not exist", async () => {
            const response = await putRequest("/api/reports/1000000000/status",
                {
                    cookieJar,
                    body: {
                        status: "closed"
                    }
                }
            );

            assert.equal(response.status, 404);
        });
    });
});