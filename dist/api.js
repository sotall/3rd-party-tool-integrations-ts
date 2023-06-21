"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetProcess = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class TargetProcess {
    constructor(accessToken = '', subdomain = constants_1.Subdomain.NWEA) {
        this._subdomain = subdomain;
        this._accessToken = 'access_token=' + accessToken;
        this._headers = {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
        };
    }
    set accessToken(value) {
        this._accessToken = value;
    }
    set subdomain(value) {
        this._subdomain = value;
    }
    /**
     * upload TestPlan to TP
     *
     * @param testPlan - takes an array of ITestPlan objects
     * @returns void
     */
    uploadTestPlans(testPlans) {
        testPlans.forEach((testPlan) => {
            this.addOrUpdateTestPlan(testPlan).then((testPlan) => {
                (0, utils_1.logStuff)('INFO', `testplan ID: ${testPlan.Id} updated`);
            }).catch((err) => {
                (0, utils_1.logStuff)('ERROR', '', err);
            });
        });
    }
    /**
     * download TestPlan from TP
     *
     * @param testPlanId[] - array of the TestPlanID's you'd like to download
     * @returns ITestPlan[]
     */
    downloadTestPlans(testPlanIds) {
        // make new promise
        const testPlanPromise = testPlanIds.reduce((previousValue, currentValue) => {
            return this.getTestCasesForTestPlanId(currentValue)
                .then((testPlan) => testPlan)
                .catch(() => {
                return this.getTestCasesForUserStoryId(currentValue)
                    .then((testPlan) => testPlan.LinkedTestPlan)
                    .catch(() => { return {}; });
            });
        }, {});
        // return array of testplans
        return Promise.all([testPlanPromise]).then((testPlans) => {
            // filter out undefined values
            return testPlans.filter((testPlan) => {
                return testPlan != null;
            });
        });
    }
    /**
     * Add new or Update existing TestCase by matching name
     *
     * @param testPlanId - ID of the TestPlan you'd like to search
     * @param newTestCase - Add/Update TestCase from this object
     * @param newTestCase.Id - (Optional) Omitting ID will create a new TestCase.
     * @returns ITestCase
     */
    addOrUpdateTestCaseForTestPlan(testPlanId, newTestCase) {
        return this.getTestPlanIncludeTestCases(testPlanId).then((respTestPlan) => __awaiter(this, void 0, void 0, function* () {
            // save our existing testcases
            const existingTestCases = respTestPlan.TestCases.Items;
            // update existing testcase
            const updateTestCase = (index, existingTc, newTc) => __awaiter(this, void 0, void 0, function* () {
                // return boolean for matching testcase ID or NAME, match = true, no match = false
                const isTestCaseMatch = (oldTc, newTc) => {
                    return !!((oldTc.Id && oldTc.Id === newTc.Id) || (oldTc.Name && oldTc.Name === newTc.Name));
                };
                if (existingTc.length - 1 < index) {
                    (0, utils_1.logStuff)('INFO', 'creating new testcase', newTestCase);
                    return yield this.addOrUpdateTestCase(newTestCase);
                }
                else if (isTestCaseMatch(existingTc[index], newTc)) {
                    // use existingTestCases ID to update testcase
                    newTc.Id = existingTc[index].Id;
                    // update testcase with new object excluding teststeps, prevents teststeps
                    // from appending to testcase over and over!
                    const newTestCase = {};
                    newTestCase.Id = newTc.Id;
                    newTestCase.Name = newTc.Name;
                    newTestCase.Description = newTc.Description;
                    newTestCase.Tags = newTc.Tags;
                    newTestCase.Project = newTc.Project;
                    newTestCase.TestSteps = { Items: [] };
                    newTestCase.CustomFields = newTc.CustomFields;
                    newTestCase.TestPlans = newTc.TestPlans;
                    (0, utils_1.logStuff)('INFO', 'update existing testcase', newTestCase);
                    return yield this.addOrUpdateTestCase(newTestCase).then((testCase) => __awaiter(this, void 0, void 0, function* () {
                        // assign teststeps to testcase
                        yield this.addOrUpdateOrDeleteTestSteps(testCase.Id, newTc.TestSteps.Items);
                        return testCase;
                    }));
                }
                else {
                    // loop
                    return yield updateTestCase(++index, existingTc, newTc);
                }
            });
            // check for project ID.
            // required when creating a new testplan
            if (!newTestCase.Id && (respTestPlan.Project && respTestPlan.Project.Id)) {
                newTestCase.Project = respTestPlan.Project;
            }
            else {
                return yield new Promise(() => {
                    (0, utils_1.logStuff)('ERROR', 'project ID required when creating a new testcase', newTestCase.Project.Id);
                    return {};
                });
            }
            // add testplan ID to list. a testcase can be linked to multiple testplans???
            newTestCase.TestPlans = !newTestCase.TestPlans ? [] : newTestCase.TestPlans;
            newTestCase.TestPlans.push({ Id: testPlanId });
            return yield updateTestCase(0, existingTestCases, newTestCase);
        }));
    }
    /**
     * Add new or Update existing TestSteps, Delete extra TestSteps
     *
     * @param testCaseId - ID of the TestCase you'd like to search
     * @param newTestSteps - The array of teststeps to add OR update
     * @returns - ITestStep[]
     */
    addOrUpdateOrDeleteTestSteps(testCaseId, newTestSteps) {
        return this.getTestCaseIncludeTestSteps(testCaseId).then((resp) => __awaiter(this, void 0, void 0, function* () {
            // loop over new teststeps
            for (let i = 0; i < newTestSteps.length; i++) {
                // link teststep to a testcase
                newTestSteps[i].TestCase = { Id: testCaseId };
                // set an empty string when null/undefined
                newTestSteps[i].Description = !newTestSteps[i].Description ? '' : newTestSteps[i].Description;
                newTestSteps[i].Result = !newTestSteps[i].Result ? '' : newTestSteps[i].Result;
                // check for an update or add teststep
                if (resp.TestSteps.Items[i]) {
                    // reuse teststep.id
                    newTestSteps[i].Id = resp.TestSteps.Items[i].Id;
                    // update non-matching teststeps
                    if (resp.TestSteps.Items[i].Description !== newTestSteps[i].Description || resp.TestSteps.Items[i].Result !== newTestSteps[i].Result) {
                        (0, utils_1.logStuff)('INFO', 'update teststep', newTestSteps[i]);
                        yield this.addOrUpdateTestStep(newTestSteps[i]);
                    }
                    else {
                        (0, utils_1.logStuff)('INFO', 'no change, skip updating teststep', newTestSteps[i]);
                    }
                }
                else {
                    (0, utils_1.logStuff)('INFO', 'add teststep', newTestSteps[i]);
                    yield this.addOrUpdateTestStep(newTestSteps[i]);
                }
            }
            // loop over any remaining teststeps
            if (resp.TestSteps.Items.length > newTestSteps.length) {
                for (let x = newTestSteps.length; x < resp.TestSteps.Items.length; x++) {
                    (0, utils_1.logStuff)('INFO', 'delete extra teststep', resp.TestSteps.Items[x]);
                    yield this.deleteTestStep(resp.TestSteps.Items[x].Id);
                }
            }
            return newTestSteps;
        }));
    }
    /**
     * Return all TestStep data for a specific UserStory
     * @param userStoryId - ID of the UserStory you'd like to search
     * @returns IUserStory
     */
    getTestCasesForUserStoryId(userStoryId) {
        return this.getUserStoryIncludeTestCases(userStoryId).then((userStory) => __awaiter(this, void 0, void 0, function* () {
            // function to get teststeps for each testcase
            const getTestSteps = (testCase) => __awaiter(this, void 0, void 0, function* () {
                return yield this.getTestCaseIncludeTestSteps(testCase.Id);
            });
            // merge testcase descriptions and teststeps
            for (let i = 0; i < userStory.LinkedTestPlan.TestCases.Items.length; i++) {
                const testSteps = yield getTestSteps(userStory.LinkedTestPlan.TestCases.Items[i]);
                userStory.LinkedTestPlan.TestCases.Items[i].Description = testSteps.Description;
                userStory.LinkedTestPlan.TestCases.Items[i].Tags = testSteps.Tags;
                userStory.LinkedTestPlan.TestCases.Items[i].TestSteps = testSteps.TestSteps;
            }
            return userStory;
        }));
    }
    /**
     * Return all TestStep data for a specific TestPlan
     * @param testPlanId - ID of the TestPlan you'd like to search
     * @returns ITestPlan
     */
    getTestCasesForTestPlanId(testPlanId) {
        return this.getTestPlanIncludeTestCases(testPlanId).then((testPlan) => __awaiter(this, void 0, void 0, function* () {
            // function to get teststeps for each testcase
            const getTestSteps = (testCase) => __awaiter(this, void 0, void 0, function* () {
                return yield this.getTestCaseIncludeTestSteps(testCase.Id);
            });
            // merge testcase descriptions and teststeps
            for (let i = 0; i < testPlan.TestCases.Items.length; i++) {
                const testSteps = yield getTestSteps(testPlan.TestCases.Items[i]);
                testPlan.TestCases.Items[i].Description = testSteps.Description;
                testPlan.TestCases.Items[i].Tags = testSteps.Tags;
                testPlan.TestCases.Items[i].TestSteps = testSteps.TestSteps;
            }
            return testPlan;
        }));
    }
    /*********************************
     * TestPlanRun
     *********************************/
    /**
     * Get a TestPlanRun by ID
     *
     * @param id - ID of the TestPlanRun you'd like to search
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlanRun
     */
    getTestPlanRun(id, filter = '') {
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTPLANRUNS + `/${id}`, filter);
    }
    /**
     * Get a TestPlanRun by ID, includes attached TestCaseRun's
     *
     * @param id - ID of the TestPlanRun you'd like to search
     * @returns ITestPlanRun
     */
    getTestPlanRunIncludeTestCaseRuns(id) {
        return this.getTestPlanRun(id, '?include=[Id,TestCaseRuns[Id,TestCase]]');
    }
    /**
     * Add new or Update existing TestPlanRun
     *
     * @param testPlanRun - Add/Update TestPlanRun from this object
     * @param testPlanRun.Id - (Optional) Omitting ID will create a new testPlanRun.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlanRun
     */
    addOrUpdateTestPlanRun(testPlanRun, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTPLANRUNS, filter, testPlanRun);
    }
    /**
     * Add new or Update existing TestPlanRun, include attached TestCaseRun's
     *
     * @param testPlanRun - Add/Update TestPlanRun from this object
     * @param testPlanRun.Id - (Optional) Omitting ID will create a new testPlanRun.
     * @returns ITestPlanRun
     */
    addOrUpdateTestPlanRunIncludeTestCaseRun(testPlanRun) {
        return this.addOrUpdateTestPlanRun(testPlanRun, '?include=[Id,TestCaseRuns[Id,TestCase]]');
    }
    /**
     * Update existing TestPlanRun by id
     *
     * @param id - ID of the TestPlanRun you'd like to search
     * @param testPlanRun - Update TestPlanRun from this object
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlanRun
     */
    updateTestPlanRun(id, testPlanRun, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTPLANRUNS + `/${id}`, filter, testPlanRun);
    }
    /*********************************
     * TestCaseRun
     *********************************/
    /**
     * Get a TestCaseRun by id
     *
     * @param id - ID of the TestCaseRun you'd like to search
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCaseRun
     */
    getTestCaseRun(id, filter = '') {
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTCASERUNS + `/${id}`, filter);
    }
    getTestCaseRunIncludeTestStepRuns(id) {
        return this.getTestCaseRun(id, '?include=[TestStepRuns[Passed,Runned,RunOrder,TestCaseRun[TestPlanRun],TestStep]]');
    }
    // TODO - confirm creating new TestCaseRun in individual call works (failed to make this work on first try).
    //  currently TestCaseRun's are created when making a new TestPlanRun.
    /**
     * Update existing or add a new TestCaseRun
     *
     * @param testCaseRun - Add/Update TestCaseRun from this object
     * @param testCaseRun.Id - (Optional) Omitting ID will create a new testCaseRun.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCaseRun
     */
    addOrUpdateTestCaseRun(testCaseRun, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTCASERUNS, filter, testCaseRun);
    }
    /**
     * Update existing TestCaseRun by id
     *
     * @param id - ID of the TestCaseRun you'd like to search
     * @param testCaseRun - Update TestCaseRun from this object
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCaseRun
     */
    updateTestCaseRun(id, testCaseRun, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTCASERUNS + `/${id}`, filter, testCaseRun);
    }
    /*********************************
     * TestStepRun
     *********************************/
    /**
     * Get a TestStepRun by id
     *
     * @param id - ID of the TestStepRun you'd like to search
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCaseRun
     */
    getTestStepRun(id, filter = '') {
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTSTEPRUNS + `/${id}`, filter);
    }
    /**
     * Update existing TestStepRun by ID
     *
     * @param id - ID of the TestStepRun you'd like to search
     * @param testStepRun - Update TestStepRun from this object
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestStepRun
     */
    updateTestStepRun(id, testStepRun, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTSTEPRUNS + `/${id}`, filter, testStepRun);
    }
    /*********************************
     * TestPlan
     *********************************/
    /**
     * Get a TestPlan by ID
     *
     * @param id - ID of the TestPlan you'd like to search
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlan
     */
    getTestPlan(id, filter = '') {
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTPLANS + `/${id}`, filter);
    }
    /**
     * Get a TestPlan from a linked UserStory
     *
     * @param id - ID of the UserStory you'd like to search
     * @returns ITestPlan
     */
    getTestPlanFromUserStory(id) {
        return this.getUserStory(id, '?include=[LinkedTestPlan]').then((resp) => {
            return this.getTestPlan(resp.LinkedTestPlan.Id);
        });
    }
    /**
     * Get a TestPlan by ID, includes attached TestCases
     *
     * @param id - ID of the TestPlan you'd like to search
     * @returns ITestPlan
     */
    getTestPlanIncludeTestCases(id) {
        return this.getTestPlan(id, '?include=[Name,Description,Tags,Project,TestCases,ParentTestPlans,ChildTestPlans]');
    }
    /**
     * Update existing or add a new Testplan
     *
     * @param testPlan - Add/Update TestPlan from this object
     * @param testPlan.Id - (Optional) Omitting ID will create a new TestPlan.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlan
     */
    addOrUpdateTestPlan(testPlan, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTPLANS, filter, testPlan);
    }
    /**
     * Add new or Update existing TestPlan, include linked UserStory.
     *
     * @param id - ID of the UserStory you'd like to search
     * @param testPlan - Add/Update TestPlan from this object.
     * @param testPlan.Id - (Optional) Omitting ID will create a new TestPlan.
     * @returns ITestPlan
     */
    addOrUpdateTestPlanIncludeLinkedUserStory(id, testPlan) {
        return this.getUserStory(id).then((userStory) => {
            // when passing an Existing testplan ID ignore other values
            if (!testPlan.Id) {
                // project ID is required when creating a NEW testplan
                if (userStory.Project && userStory.Project.Id) {
                    testPlan.Project = userStory.Project;
                }
                else {
                    throw {
                        message: `missing project id: ${testPlan.Project.Id}`
                    };
                }
                // link to the user story when creating NEW testplan
                if (!testPlan.LinkedGeneral) {
                    testPlan.LinkedGeneral = { Id: id };
                }
                // use existing testplan ID if found
                if (userStory.LinkedTestPlan && userStory.LinkedTestPlan.Id) {
                    testPlan.Id = userStory.LinkedTestPlan.Id;
                }
            }
            if (testPlan.Id) {
                (0, utils_1.logStuff)('INFO', 'update existing linked testplan', testPlan);
            }
            else {
                (0, utils_1.logStuff)('INFO', 'new testplan will be created', testPlan);
            }
            return this.addOrUpdateTestPlan(testPlan);
        });
    }
    /**
     * Delete a TestPlan by ID
     *
     * @param id - ID of the TestPlan you'd like to delete
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlan
     */
    deleteTestPlan(id, filter = '') {
        return this.request('DELETE', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTPLANS + `/${id}`, filter);
    }
    /*********************************
     * TestCase
     *********************************/
    /**
     * Returns a TestCase by ID
     *
     * @param id - ID of the TestCase you'd like to search
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCase
     */
    getTestCase(id, filter = '') {
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTCASE + `/${id}`, filter);
    }
    /**
     * Get a TestCase by ID, includes TestSteps
     *
     * @param id - ID of the TestCase you'd like to search
     * @returns ITestCase
     */
    getTestCaseIncludeTestSteps(id) {
        return this.getTestCase(id, '?include=[Description,Tags,TestSteps[Description,Result,RunOrder]]');
    }
    /**
     * Add new or Update existing TestCase
     *
     * @param testCase - Add/Update TestCase from this object
     * @param testCase.Id - (Optional) Omitting ID will create a new TestCase.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCase
     */
    addOrUpdateTestCase(testCase, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTCASE, filter, testCase);
    }
    /**
     * Delete a testcase by ID
     *
     * @param id - ID of the TestCase you'd like to delete
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCase
     */
    deleteTestCase(id, filter = '') {
        return this.request('DELETE', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTCASE + `/${id}`, filter);
    }
    /*********************************
     * TestSteps
     *********************************/
    /**
     * Get a TestStep by id
     *
     * @param id - ID of the TestStep you'd like to search
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestStep
     */
    getTestStep(id, filter = '') {
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTSTEP + `/${id}`, filter);
    }
    /**
     * Add new or Update existing TestStep
     *
     * @param testStep - Add/Update TestStep from this object
     * @param testStep.Id - (Optional) Omitting ID will create a new TestStep.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestStep
     */
    addOrUpdateTestStep(testStep, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTSTEP, filter, testStep);
    }
    /**
     * Delete a teststep by id
     *
     * @param id - ID of the TestStep you'd like to delete
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestStep
     */
    deleteTestStep(id, filter = '') {
        return this.request('DELETE', constants_1.ApiVersion.V1, constants_1.Endpoint.TESTSTEP + `/${id}`, filter);
    }
    /*********************************
     * UserStory
     *********************************/
    /**
     * Get a UserStory by ID
     *
     * @param id - ID of the UserStory you'd like to search.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IUserStory
     */
    getUserStory(id, filter = '') {
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.USERSTORY + `/${id}`, filter);
    }
    /**
     * Get a UserStory by ID, includes attached TestCases.
     *
     * @param id - ID of the UserStory you'd like to search.
     * @returns IUserStory
     */
    getUserStoryIncludeTestCases(id) {
        return this.getUserStory(id, '?include=[Name,Description,Tags,Project,LinkedTestPlan[Name,Description,Tags,Project,TestCases,ParentTestPlans,ChildTestPlans]]');
    }
    /*********************************
     * User
     *********************************/
    /**
     * Get a User by ID, if none provided logged-in is used.
     *
     * @param id - (Optional) ID of the User you'd like to search. Omitting defaults to /loggeduser
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IUser
     */
    getUser(id, filter = '') {
        const path = id ? `/${id}` : '/loggeduser';
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.USERS + path, filter);
    }
    /*********************************
     * Comment
     *********************************/
    /**
     * Get a Comment by ID
     *
     * @param id - ID of the Comment you'd like to search
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IComment
     */
    getComment(id, filter = '') {
        return this.request('GET', constants_1.ApiVersion.V1, constants_1.Endpoint.COMMENTS + `/${id}`, filter);
    }
    /**
     * Add new or Update existing Comment for a Story/Task/Bug/TestPlan/TestCase
     *
     * @param comment - Add/Update Comment from this object
     * @param comment.Id - (Optional) Omitting ID will create a new Comment.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IComment
     */
    addOrUpdateComment(comment, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.COMMENTS, filter, comment);
    }
    /**
     * Update existing Comment by ID
     *
     * @param id - ID of the Comment you'd like to search
     * @param comment - Update Comment from this object
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IComment
     */
    updateComment(id, comment, filter = '') {
        return this.request('POST', constants_1.ApiVersion.V1, constants_1.Endpoint.COMMENTS + `/${id}`, filter, comment);
    }
    /**
     * Delete a Comment by ID
     *
     * @param id - ID of the Comment you'd like to delete
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IComment
     */
    deleteComment(id, filter = '') {
        return this.request('DELETE', constants_1.ApiVersion.V1, constants_1.Endpoint.COMMENTS + `/${id}`, filter);
    }
    request(method, version, endpoint, filter, body) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = (filter ? `${filter}&` : '?') + this._accessToken;
            const url = `https://${this._subdomain}.tpondemand.com/${version}/${endpoint}${filter}`;
            const data = {
                method: method,
                headers: this._headers,
                body: body ? JSON.stringify(body) : undefined
            };
            const res = yield (0, node_fetch_1.default)(url, data);
            // throw error when response fails
            if (!res.ok) {
                throw {
                    method: method,
                    url: res.url,
                    statusCode: res.status,
                    message: res.statusText
                };
            }
            else {
                return res.json();
            }
        });
    }
}
exports.TargetProcess = TargetProcess;
