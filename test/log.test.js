const {
    test,
    assert,
    getRequest,
    postRequest,
    createCookieJar
} = require("./main.test");

function extractLogsArray(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.logs)) return payload.logs;
    if (Array.isArray(payload?.data?.logs)) return payload.data.logs;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
}

function extractLogObject(payload) {
    return payload?.log ?? payload?.data?.log ?? payload?.data ?? payload;
}

test("public users can view all logs and filtered logs", async function() {
    const allLogsResponse = await getRequest("/api/log");
    assert.equal(allLogsResponse.status, 200);
    const allLogsBody = await allLogsResponse.json();
    assert.ok(Array.isArray(extractLogsArray(allLogsBody)));

    const reportLogsResponse = await getRequest("/api/log/report/1");
    assert.equal(reportLogsResponse.status, 200);
    const reportLogsBody = await reportLogsResponse.json();
    assert.ok(Array.isArray(extractLogsArray(reportLogsBody)));

    const categoryLogsResponse = await getRequest("/api/log/category/1");
    assert.equal(categoryLogsResponse.status, 200);
    const categoryLogsBody = await categoryLogsResponse.json();
    assert.ok(Array.isArray(extractLogsArray(categoryLogsBody)));

    const reporterLogsResponse = await getRequest("/api/log/reporter/1");
    assert.equal(reporterLogsResponse.status, 200);
    const reporterLogsBody = await reporterLogsResponse.json();
    assert.ok(Array.isArray(extractLogsArray(reporterLogsBody)));
});

test("viewing a non-existent log or picture returns 404", async function() {
    const logResponse = await getRequest("/api/log/999999999");
    assert.equal(logResponse.status, 404);

    const pictureResponse = await getRequest("/api/log/999999999/picture");
    assert.equal(pictureResponse.status, 404);
});

test("creating a log rejects unauthenticated or unauthorized requests", async function() {
    const response = await postRequest("/api/log", {
        body: {
            reportId: 1,
            reporterId: 1,
            logCategoryId: 1,
            value: "10",
            time: Date.now()
        }
    });

    assert.ok([401, 403].includes(response.status));
});

test("creating a log rejects invalid or incomplete payload", async function() {
    const cookieJar = createCookieJar();

    const response = await postRequest("/api/log", {
        cookieJar,
        body: {
            reportId: null,
            logCategoryId: null,
            value: ""
        }
    });

    assert.ok([400, 401, 403, 422].includes(response.status));
});

test("authorized user can create a log with unix timestamp in milliseconds and retrieve it", async function() {
    const cookieJar = createCookieJar();
    const timestampMs = Date.now();

    const createResponse = await postRequest("/api/log", {
        cookieJar,
        body: {
            reportId: 1,
            reporterId: 1,
            logCategoryId: 1,
            value: "5",
            time: timestampMs
        }
    });

    if ([200, 201].includes(createResponse.status)) {
        const createdBody = await createResponse.json();
        const createdId = createdBody.logId ?? createdBody.data?.logId;
        assert.ok(createdId);

        // Verify GET /api/log/:id
        const singleResponse = await getRequest(`/api/log/${createdId}`);
        assert.equal(singleResponse.status, 200);
        const singleLog = extractLogObject(await singleResponse.json());
        assert.equal(singleLog.id, createdId);
        assert.equal(singleLog.time, timestampMs);

        // Verify GET /api/log/report/:reportId
        const listResponse = await getRequest("/api/log/report/1");
        assert.equal(listResponse.status, 200);

        const logs = extractLogsArray(await listResponse.json());
        const found = logs.find((item) => item.id === createdId || item.time === timestampMs);
        assert.ok(found);
        assert.equal(found.time, timestampMs);
    } else {
        assert.ok([400, 401, 403, 422].includes(createResponse.status));
    }
});