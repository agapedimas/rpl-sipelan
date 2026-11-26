

// suite("Test POST API reports", async(t) => {
//     let cookieJar;

//     // before all, aku butuh loginnnnnnnn
//     before(async() => {
//         cookieJar = createCookieJar()
//     })

//     after(async() => {
//         // delete record and setting the auto increment prev state(optional)
//     })

//     test("save new report into db", async() => {
//         const response = await postRequest("/api/reports", 
//             {   
//                 cookieJar,
//                 body: {
//                     isArchived: 0,
//                     status: "handlingRequired",
//                     description: "Terjadi gembap bumi 5 SR di garut",
//                     time: 1805118000,
//                     disasterTypeId: 6
//                 }
//             }
//         );

//         const body = await response.json();

//         assert.equal(response.status, 200);
//         assert.ok(body.data.reportId);
//     })
// });

// suite("Test PUT API reports", async() => {
//     const reportId = 6;
//     let cookieJar;
//     let originalReport;

//     before(async () => {
//         cookieJar = createCookieJar();

//         // simpan state databse sebelum di update
//         const response = await getRequest(`/api/reports/${reportId}`, {
//             cookieJar
//         });

//         assert.equal(response.status, 200);

//         const result = await response.json();
//         originalReport = result.data;
//     });

//     afterEach(async () => {
//         if (!originalReport) return;

//         const response = await getRequest(`/api/reports/${reportId}`, {
//             cookieJar
//         });

//         assert.equal(response.status, 200);

//         const result = await response.json();
//         const currentReport = result.data;

//         // Restore archive status
//         if (currentReport.isArchived !== originalReport.isArchived) {
//             const restoreResponse = await putRequest(`/api/reports/${reportId}/archive`,
//                 {
//                     cookieJar,
//                     body: {
//                         isArchived: originalReport.isArchived
//                     }
//                 }
//             );

//             assert.equal(restoreResponse.status, 200);
//         }

//         // Restore report status
//         if (currentReport.status !== originalReport.status) {
//             const restoreResponse = await putRequest(`/api/reports/${reportId}/status`,
//                 {
//                     cookieJar,
//                     body: {
//                         status: originalReport.status
//                     }
//                 }
//             );

//             assert.equal(restoreResponse.status, 200);
//         }

//         // Restore description
//         if (currentReport.description !== originalReport.description) {
//             const restoreResponse = await putRequest(`/api/reports/${reportId}/description`,
//                 {
//                     cookieJar,
//                     body: {
//                         description: originalReport.description
//                     }
//                 }
//             );

//             assert.equal(restoreResponse.status, 200);
//         }
//     });

//     suite("Should be accepted", () => {
//         test("update report archived status", async () => {
//             const response = await putRequest(`/api/reports/${reportId}/archive`,
//                 {
//                     cookieJar,
//                     body: {
//                         isArchived: 1
//                     }
//                 }
//             );

//             assert.equal(response.status, 200);
//         });

//         test("update report status", async () => {
//             const response = await putRequest(`/api/reports/${reportId}/status`,
//                 {
//                     cookieJar,
//                     body: {
//                         status: "closed"
//                     }
//                 }
//             );

//             assert.equal(response.status, 200);
//         });

//         test("update report description", async () => {
//             const response = await putRequest(`/api/reports/${reportId}/description`,
//                 {
//                     cookieJar,
//                     body: {
//                         description: "Updated report description"
//                     }
//                 }
//             );

//             assert.equal(response.status, 200);
//         });
//     });

//     suite("Should be rejected", () => {
//         test("reject invalid archive status", async () => {
//             const response = await putRequest("/api/reports/6/archive",
//                 {
//                     cookieJar,
//                     body: {
//                         isArchived: 5
//                     }
//                 }
//             );

//             assert.equal(response.status, 400);
//         });

//         test("reject missing archive status", async () => {
//             const response = await putRequest("/api/reports/6/archive",
//                 {
//                     cookieJar,
//                     body: {}
//                 }
//             );

//             assert.equal(response.status, 400);
//         });

//         test("reject archive update if report does not exist", async () => {
//             const response = await putRequest("/api/reports/1000000000/archive",
//                 {
//                     cookieJar,
//                     body: {
//                         isArchived: 1
//                     }
//                 }
//             );

//             assert.equal(response.status, 404);
//         });

//         test("reject empty description", async () => {
//             const response = await putRequest("/api/reports/6/description",
//                 {
//                     cookieJar,
//                     body: {
//                         description: "   "
//                     }
//                 }
//             );

//             assert.equal(response.status, 400);
//         });

//         test("reject non-string description", async () => {
//             const response = await putRequest("/api/reports/6/description",
//                 {
//                     cookieJar,
//                     body: {
//                         description: 123
//                     }
//                 }
//             );

//             assert.equal(response.status, 400);
//         });

//         test("reject update if report does not exist", async () => {
//             const response = await putRequest("/api/reports/1000000000/status",
//                 {
//                     cookieJar,
//                     body: {
//                         status: "closed"
//                     }
//                 }
//             );

//             assert.equal(response.status, 404);
//         });
//     });
// });

// // TODO: This is still deleting persistent records
// suite("Test DELETE API reports", async() => {
//     let cookieJar;

//     before(async () => {

//         assert.equal(loginRes.status, 200);
//     });

//     test("delete report from database", async () => {
//         const reportId = 7;

//         const response = await deleteRequest(`/api/reports/${reportId}`, { cookieJar });

//         assert.equal(response.status, 200);
//     });

//     test("reject deletion if report does not exist", async () => {
//         const reportId = 1000000000;

//         const response = await deleteRequest(`/api/reports/${reportId}`, { cookieJar });

//         assert.equal(response.status, 404);
//     });
// });