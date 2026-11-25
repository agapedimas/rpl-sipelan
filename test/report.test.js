const {
    test,
    suite,
    before,
    after,
    afterEach,
    assert,
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    createCookieJar
} = require("./main.test");

// TODO: BUAT MOCK LOGIN ANJAYYYY

suite("Test GET API reports", async(t) => {
    let cookieJar;

    // before all, aku butuh loginnnnnnnn
    before(async() => {
        cookieJar = createCookieJar()

        const loginRes = await postRequest("/signin",{
            cookieJar, 
            body: {
                accountId: 1,
                OtpId: 0,
                phone: "081234567807"
            }
        });

        console.log("Status:", loginRes.status);
        console.log("URL:", loginRes.url);
        console.log("Body:", await loginRes.text());

        assert.equal(loginRes.status, 200);
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

suite("Test POST API reports", async(t) => {
    let cookieJar;

    // before all, aku butuh loginnnnnnnn
    before(async() => {
        cookieJar = createCookieJar()

        const loginRes = await postRequest("/signin",{
            cookieJar, 
            body: {
                accountId: 1,
                OtpId: 0,
                phone: "081234567807"
            }
        });

        assert.equal(loginRes.status, 200);
    })

    after(async() => {
        // delete record and setting the auto increment prev state(optional)
    })

    test("save new report into db", async() => {
        const response = await postRequest("/api/reports", 
            {   
                cookieJar,
                body: {
                    isArchived: 0,
                    status: "handlingRequired",
                    description: "Terjadi gembap bumi 5 SR di garut",
                    time: 1805118000,
                    disasterTypeId: 6
                }
            }
        );

        const body = await response.json();

        assert.equal(response.status, 200);
        assert.ok(body.data.reportId);
    })
});

suite("Test PUT API reports", async() => {
    const reportId = 6;
    let cookieJar;
    let originalReport;

    before(async () => {
        // login boss
        cookieJar = createCookieJar();

        const loginRes = await postRequest("/signin", {
            cookieJar,
            body: {
                accountId: 1,
                OtpId: 1,
                phone: "081234567807"
            }
        });

        assert.equal(loginRes.status, 200);

        // simpan state databse sebelum di update
        const response = await getRequest(`/api/reports/${reportId}`, {
            cookieJar
        });

        assert.equal(response.status, 200);

        const result = await response.json();
        originalReport = result.data;
    });

    afterEach(async () => {
        if (!originalReport) return;

        const response = await getRequest(`/api/reports/${reportId}`, {
            cookieJar
        });

        assert.equal(response.status, 200);

        const result = await response.json();
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
            const response = await putRequest("/api/reports/6/archive",
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
            const response = await putRequest("/api/reports/6/archive",
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
            const response = await putRequest("/api/reports/6/description",
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
            const response = await putRequest("/api/reports/6/description",
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

// TODO: This is still deleting persistent records
suite("Test DELETE API reports", async() => {
    let cookieJar;

    before(async () => {
        cookieJar = createCookieJar();

        const loginRes = await postRequest("/signin", {
            cookieJar,
            body: {
                accountId: 1,
                OtpId: 1,
                phone: "081234567807"
            }
        });

        assert.equal(loginRes.status, 200);
    });

    test("delete report from database", async () => {
        const reportId = 7;

        const response = await deleteRequest(`/api/reports/${reportId}`, { cookieJar });

        assert.equal(response.status, 200);
    });

    test("reject deletion if report does not exist", async () => {
        const reportId = 1000000000;

        const response = await deleteRequest(`/api/reports/${reportId}`, { cookieJar });

        assert.equal(response.status, 404);
    });
});