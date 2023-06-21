import { CommentId, Subdomain, TestCaseId, TestCaseRunId, TestPlanId, TestPlanRunId, TestStepId, TestStepRunId, UserId, UserStoryId } from "./constants";
import { IComment, ITestCase, ITestCaseRun, ITestPlan, ITestPlanRun, ITestStep, ITestStepRun, IUser, IUserStory } from "./interface";
export declare class TargetProcess {
    private _subdomain;
    private _accessToken;
    private readonly _headers;
    constructor(accessToken?: string, subdomain?: Subdomain);
    set accessToken(value: string);
    set subdomain(value: string);
    /**
     * upload TestPlan to TP
     *
     * @param testPlan - takes an array of ITestPlan objects
     * @returns void
     */
    uploadTestPlans(testPlans: ITestPlan[]): void;
    /**
     * download TestPlan from TP
     *
     * @param testPlanId[] - array of the TestPlanID's you'd like to download
     * @returns ITestPlan[]
     */
    downloadTestPlans(testPlanIds: TestPlanId[]): Promise<ITestPlan[]>;
    /**
     * Add new or Update existing TestCase by matching name
     *
     * @param testPlanId - ID of the TestPlan you'd like to search
     * @param newTestCase - Add/Update TestCase from this object
     * @param newTestCase.Id - (Optional) Omitting ID will create a new TestCase.
     * @returns ITestCase
     */
    addOrUpdateTestCaseForTestPlan(testPlanId: TestPlanId, newTestCase: ITestCase): Promise<ITestCase>;
    /**
     * Add new or Update existing TestSteps, Delete extra TestSteps
     *
     * @param testCaseId - ID of the TestCase you'd like to search
     * @param newTestSteps - The array of teststeps to add OR update
     * @returns - ITestStep[]
     */
    addOrUpdateOrDeleteTestSteps(testCaseId: TestCaseId, newTestSteps: Array<ITestStep>): Promise<Array<ITestStep>>;
    /**
     * Return all TestStep data for a specific UserStory
     * @param userStoryId - ID of the UserStory you'd like to search
     * @returns IUserStory
     */
    getTestCasesForUserStoryId(userStoryId: UserStoryId): Promise<IUserStory>;
    /**
     * Return all TestStep data for a specific TestPlan
     * @param testPlanId - ID of the TestPlan you'd like to search
     * @returns ITestPlan
     */
    getTestCasesForTestPlanId(testPlanId: TestPlanId): Promise<ITestPlan>;
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
    getTestPlanRun(id: TestPlanRunId, filter?: string): Promise<ITestPlanRun>;
    /**
     * Get a TestPlanRun by ID, includes attached TestCaseRun's
     *
     * @param id - ID of the TestPlanRun you'd like to search
     * @returns ITestPlanRun
     */
    getTestPlanRunIncludeTestCaseRuns(id: TestPlanRunId): Promise<ITestPlanRun>;
    /**
     * Add new or Update existing TestPlanRun
     *
     * @param testPlanRun - Add/Update TestPlanRun from this object
     * @param testPlanRun.Id - (Optional) Omitting ID will create a new testPlanRun.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlanRun
     */
    addOrUpdateTestPlanRun(testPlanRun: ITestPlanRun, filter?: string): Promise<ITestPlanRun>;
    /**
     * Add new or Update existing TestPlanRun, include attached TestCaseRun's
     *
     * @param testPlanRun - Add/Update TestPlanRun from this object
     * @param testPlanRun.Id - (Optional) Omitting ID will create a new testPlanRun.
     * @returns ITestPlanRun
     */
    addOrUpdateTestPlanRunIncludeTestCaseRun(testPlanRun: ITestPlanRun): Promise<ITestPlanRun>;
    /**
     * Update existing TestPlanRun by id
     *
     * @param id - ID of the TestPlanRun you'd like to search
     * @param testPlanRun - Update TestPlanRun from this object
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlanRun
     */
    updateTestPlanRun(id: TestPlanId, testPlanRun: ITestPlanRun, filter?: string): Promise<ITestPlanRun>;
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
    getTestCaseRun(id: TestCaseRunId, filter?: string): Promise<ITestCaseRun>;
    getTestCaseRunIncludeTestStepRuns(id: TestCaseId): Promise<ITestCaseRun>;
    /**
     * Update existing or add a new TestCaseRun
     *
     * @param testCaseRun - Add/Update TestCaseRun from this object
     * @param testCaseRun.Id - (Optional) Omitting ID will create a new testCaseRun.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCaseRun
     */
    addOrUpdateTestCaseRun(testCaseRun: ITestCaseRun, filter?: string): Promise<ITestCaseRun>;
    /**
     * Update existing TestCaseRun by id
     *
     * @param id - ID of the TestCaseRun you'd like to search
     * @param testCaseRun - Update TestCaseRun from this object
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCaseRun
     */
    updateTestCaseRun(id: TestCaseRunId, testCaseRun: ITestCaseRun, filter?: string): Promise<ITestCaseRun>;
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
    getTestStepRun(id: TestStepRunId, filter?: string): Promise<ITestStepRun>;
    /**
     * Update existing TestStepRun by ID
     *
     * @param id - ID of the TestStepRun you'd like to search
     * @param testStepRun - Update TestStepRun from this object
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestStepRun
     */
    updateTestStepRun(id: CommentId, testStepRun: ITestStepRun, filter?: string): Promise<ITestStepRun>;
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
    getTestPlan(id: TestPlanId, filter?: string): Promise<ITestPlan>;
    /**
     * Get a TestPlan from a linked UserStory
     *
     * @param id - ID of the UserStory you'd like to search
     * @returns ITestPlan
     */
    getTestPlanFromUserStory(id: UserStoryId): Promise<ITestPlan>;
    /**
     * Get a TestPlan by ID, includes attached TestCases
     *
     * @param id - ID of the TestPlan you'd like to search
     * @returns ITestPlan
     */
    getTestPlanIncludeTestCases(id: TestPlanId): Promise<ITestPlan>;
    /**
     * Update existing or add a new Testplan
     *
     * @param testPlan - Add/Update TestPlan from this object
     * @param testPlan.Id - (Optional) Omitting ID will create a new TestPlan.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlan
     */
    addOrUpdateTestPlan(testPlan: ITestPlan, filter?: string): Promise<ITestPlan>;
    /**
     * Add new or Update existing TestPlan, include linked UserStory.
     *
     * @param id - ID of the UserStory you'd like to search
     * @param testPlan - Add/Update TestPlan from this object.
     * @param testPlan.Id - (Optional) Omitting ID will create a new TestPlan.
     * @returns ITestPlan
     */
    addOrUpdateTestPlanIncludeLinkedUserStory(id: UserStoryId, testPlan: ITestPlan): Promise<ITestPlan>;
    /**
     * Delete a TestPlan by ID
     *
     * @param id - ID of the TestPlan you'd like to delete
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestPlan
     */
    deleteTestPlan(id: TestPlanId, filter?: string): Promise<ITestPlan>;
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
    getTestCase(id: TestCaseId, filter?: string): Promise<ITestCase>;
    /**
     * Get a TestCase by ID, includes TestSteps
     *
     * @param id - ID of the TestCase you'd like to search
     * @returns ITestCase
     */
    getTestCaseIncludeTestSteps(id: TestCaseId): Promise<ITestCase>;
    /**
     * Add new or Update existing TestCase
     *
     * @param testCase - Add/Update TestCase from this object
     * @param testCase.Id - (Optional) Omitting ID will create a new TestCase.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCase
     */
    addOrUpdateTestCase(testCase: ITestCase, filter?: string): Promise<ITestCase>;
    /**
     * Delete a testcase by ID
     *
     * @param id - ID of the TestCase you'd like to delete
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestCase
     */
    deleteTestCase(id: TestCaseId, filter?: string): Promise<ITestCase>;
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
    getTestStep(id: TestStepId, filter?: string): Promise<ITestStep>;
    /**
     * Add new or Update existing TestStep
     *
     * @param testStep - Add/Update TestStep from this object
     * @param testStep.Id - (Optional) Omitting ID will create a new TestStep.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestStep
     */
    addOrUpdateTestStep(testStep: ITestStep, filter?: string): Promise<ITestStep>;
    /**
     * Delete a teststep by id
     *
     * @param id - ID of the TestStep you'd like to delete
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns ITestStep
     */
    deleteTestStep(id: TestStepId, filter?: string): Promise<ITestStep>;
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
    getUserStory(id: UserStoryId, filter?: string): Promise<IUserStory>;
    /**
     * Get a UserStory by ID, includes attached TestCases.
     *
     * @param id - ID of the UserStory you'd like to search.
     * @returns IUserStory
     */
    getUserStoryIncludeTestCases(id: UserStoryId): Promise<IUserStory>;
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
    getUser(id?: UserId, filter?: string): Promise<IUser>;
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
    getComment(id: CommentId, filter?: string): Promise<IComment>;
    /**
     * Add new or Update existing Comment for a Story/Task/Bug/TestPlan/TestCase
     *
     * @param comment - Add/Update Comment from this object
     * @param comment.Id - (Optional) Omitting ID will create a new Comment.
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IComment
     */
    addOrUpdateComment(comment: IComment, filter?: string): Promise<IComment>;
    /**
     * Update existing Comment by ID
     *
     * @param id - ID of the Comment you'd like to search
     * @param comment - Update Comment from this object
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IComment
     */
    updateComment(id: CommentId, comment: IComment, filter?: string): Promise<IComment>;
    /**
     * Delete a Comment by ID
     *
     * @param id - ID of the Comment you'd like to delete
     * @param filter - (Optional) Sorting and Filters, Used to return modified results.
     * @returns IComment
     */
    deleteComment(id: CommentId, filter?: string): Promise<IComment>;
    private request;
}
