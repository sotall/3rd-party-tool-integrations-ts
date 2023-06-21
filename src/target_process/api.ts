import fetch, { BodyInit, RequestInit } from 'node-fetch';
import {
  ApiVersion,
  CommentId,
  Endpoint,
  Method,
  Subdomain,
  TestCaseId,
  TestCaseRunId,
  TestPlanId,
  TestPlanRunId,
  TestStepId,
  TestStepRunId,
  UserId,
  UserStoryId
} from "./constants";
import {
  IComment,
  IGeneral,
  ITestCase,
  ITestCaseRun,
  ITestPlan,
  ITestPlanRun,
  ITestStep,
  ITestStepRun,
  IUser,
  IUserStory
} from "./interface";
import {
  logStuff
} from "./utils";

export class TargetProcess {
  private _subdomain: string;
  private _accessToken: string;
  private readonly _headers: {
    [index: string]: string;
  };

  constructor (accessToken = '', subdomain = Subdomain.NWEA) {
    this._subdomain   = subdomain;
    this._accessToken = 'access_token=' + accessToken;
    this._headers     = {
      'Accept'       : 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type' : 'application/json'
    };
  }

  set accessToken (value: string) {
    this._accessToken = value;
  }

  set subdomain (value: string) {
    this._subdomain = value;
  }

  /**
   * upload TestPlan to TP
   *
   * @param testPlan - takes an array of ITestPlan objects
   * @returns void
   */
  public uploadTestPlans (testPlans: ITestPlan[]): void {
    testPlans.forEach((testPlan) => {
      this.addOrUpdateTestPlan(testPlan).then((testPlan): void => {
        logStuff('INFO', `testplan ID: ${testPlan.Id} updated`);
      }).catch((err) => {
        logStuff('ERROR', '', err);
      });
    });
  }

  /**
   * download TestPlan from TP
   *
   * @param testPlanId[] - array of the TestPlanID's you'd like to download
   * @returns ITestPlan[]
   */
  public downloadTestPlans (testPlanIds: TestPlanId[]): Promise<ITestPlan[]> {
    // make new promise
    const testPlanPromise = testPlanIds.reduce<Promise<ITestPlan>>((previousValue: Promise<ITestPlan>, currentValue: TestPlanId) => {
      return this.getTestCasesForTestPlanId(currentValue)
        .then((testPlan) => testPlan)
        .catch(() => {
          return this.getTestCasesForUserStoryId(currentValue)
            .then((testPlan: IUserStory) => testPlan.LinkedTestPlan)
            .catch(() => {return {} as ITestPlan;});
        });

    }, {} as Promise<ITestPlan>);

    // return array of testplans
    return Promise.all([testPlanPromise]).then((testPlans: (Awaited<ITestPlan>)[]) => {
      // filter out undefined values
      return testPlans.filter((testPlan: ITestPlan) => {
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
  public addOrUpdateTestCaseForTestPlan (testPlanId: TestPlanId, newTestCase: ITestCase): Promise<ITestCase> {
    return this.getTestPlanIncludeTestCases(testPlanId).then(async (respTestPlan) => {

      // save our existing testcases
      const existingTestCases = respTestPlan.TestCases.Items;

      // update existing testcase
      const updateTestCase = async (index: number, existingTc: Array<ITestCase>, newTc: ITestCase): Promise<ITestCase> => {

        // return boolean for matching testcase ID or NAME, match = true, no match = false
        const isTestCaseMatch = (oldTc: ITestCase, newTc: ITestCase): boolean => {
          return !!((oldTc.Id && oldTc.Id === newTc.Id) || (oldTc.Name && oldTc.Name === newTc.Name));
        };

        if (existingTc.length - 1 < index) {
          logStuff('INFO', 'creating new testcase', newTestCase);
          return await this.addOrUpdateTestCase(newTestCase);

        } else if (isTestCaseMatch(existingTc[index], newTc)) {

          // use existingTestCases ID to update testcase
          newTc.Id = existingTc[index].Id;

          // update testcase with new object excluding teststeps, prevents teststeps
          // from appending to testcase over and over!
          const newTestCase        = {} as ITestCase;
          newTestCase.Id           = newTc.Id;
          newTestCase.Name         = newTc.Name;
          newTestCase.Description  = newTc.Description;
          newTestCase.Tags         = newTc.Tags;
          newTestCase.Project      = newTc.Project;
          newTestCase.TestSteps    = { Items: [] };
          newTestCase.CustomFields = newTc.CustomFields;
          newTestCase.TestPlans    = newTc.TestPlans;

          logStuff('INFO', 'update existing testcase', newTestCase);
          return await this.addOrUpdateTestCase(newTestCase).then(async (testCase) => {
            // assign teststeps to testcase
            await this.addOrUpdateOrDeleteTestSteps(testCase.Id, newTc.TestSteps.Items);
            return testCase;
          });

        } else {
          // loop
          return await updateTestCase(++index, existingTc, newTc);
        }
      };

      // check for project ID.
      // required when creating a new testplan
      if (!newTestCase.Id && (respTestPlan.Project && respTestPlan.Project.Id)) {
        newTestCase.Project = respTestPlan.Project;
      } else {
        return await new Promise((): ITestCase => {
          logStuff('ERROR', 'project ID required when creating a new testcase', newTestCase.Project.Id);
          return {} as ITestCase;
        });
      }

      // add testplan ID to list. a testcase can be linked to multiple testplans???
      newTestCase.TestPlans = !newTestCase.TestPlans ? [] : newTestCase.TestPlans;
      newTestCase.TestPlans.push({ Id: testPlanId } as ITestPlan);

      return await updateTestCase(0, existingTestCases, newTestCase);
    });
  }

  /**
   * Add new or Update existing TestSteps, Delete extra TestSteps
   *
   * @param testCaseId - ID of the TestCase you'd like to search
   * @param newTestSteps - The array of teststeps to add OR update
   * @returns - ITestStep[]
   */
  public addOrUpdateOrDeleteTestSteps (testCaseId: TestCaseId, newTestSteps: Array<ITestStep>): Promise<Array<ITestStep>> {
    return this.getTestCaseIncludeTestSteps(testCaseId).then(async (resp) => {

      // loop over new teststeps
      for (let i = 0; i < newTestSteps.length; i++) {

        // link teststep to a testcase
        newTestSteps[i].TestCase = { Id: testCaseId } as ITestCase;

        // set an empty string when null/undefined
        newTestSteps[i].Description = !newTestSteps[i].Description ? '' : newTestSteps[i].Description;
        newTestSteps[i].Result      = !newTestSteps[i].Result ? '' : newTestSteps[i].Result;

        // check for an update or add teststep
        if (resp.TestSteps.Items[i]) {

          // reuse teststep.id
          newTestSteps[i].Id = resp.TestSteps.Items[i].Id;

          // update non-matching teststeps
          if (resp.TestSteps.Items[i].Description !== newTestSteps[i].Description || resp.TestSteps.Items[i].Result !== newTestSteps[i].Result) {
            logStuff('INFO', 'update teststep', newTestSteps[i]);
            await this.addOrUpdateTestStep(newTestSteps[i]);
          } else {
            logStuff('INFO', 'no change, skip updating teststep', newTestSteps[i]);
          }

        } else {
          logStuff('INFO', 'add teststep', newTestSteps[i]);
          await this.addOrUpdateTestStep(newTestSteps[i]);
        }
      }

      // loop over any remaining teststeps
      if (resp.TestSteps.Items.length > newTestSteps.length) {
        for (let x = newTestSteps.length; x < resp.TestSteps.Items.length; x++) {
          logStuff('INFO', 'delete extra teststep', resp.TestSteps.Items[x]);
          await this.deleteTestStep(resp.TestSteps.Items[x].Id);
        }
      }
      return newTestSteps;
    });
  }

  /**
   * Return all TestStep data for a specific UserStory
   * @param userStoryId - ID of the UserStory you'd like to search
   * @returns IUserStory
   */
  public getTestCasesForUserStoryId (userStoryId: UserStoryId): Promise<IUserStory> {
    return this.getUserStoryIncludeTestCases(userStoryId).then(async (userStory) => {

      // function to get teststeps for each testcase
      const getTestSteps = async (testCase: ITestCase): Promise<ITestCase> => {
        return await this.getTestCaseIncludeTestSteps(testCase.Id);
      };

      // merge testcase descriptions and teststeps
      for (let i = 0; i < userStory.LinkedTestPlan.TestCases.Items.length; i++) {
        const testSteps                                         = await getTestSteps(userStory.LinkedTestPlan.TestCases.Items[i]);
        userStory.LinkedTestPlan.TestCases.Items[i].Description = testSteps.Description;
        userStory.LinkedTestPlan.TestCases.Items[i].Tags        = testSteps.Tags;
        userStory.LinkedTestPlan.TestCases.Items[i].TestSteps   = testSteps.TestSteps;
      }

      return userStory;
    });
  }

  /**
   * Return all TestStep data for a specific TestPlan
   * @param testPlanId - ID of the TestPlan you'd like to search
   * @returns ITestPlan
   */
  public getTestCasesForTestPlanId (testPlanId: TestPlanId): Promise<ITestPlan> {
    return this.getTestPlanIncludeTestCases(testPlanId).then(async (testPlan) => {

      // function to get teststeps for each testcase
      const getTestSteps = async (testCase: ITestCase): Promise<ITestCase> => {
        return await this.getTestCaseIncludeTestSteps(testCase.Id);
      };

      // merge testcase descriptions and teststeps
      for (let i = 0; i < testPlan.TestCases.Items.length; i++) {
        const testSteps                         = await getTestSteps(testPlan.TestCases.Items[i]);
        testPlan.TestCases.Items[i].Description = testSteps.Description;
        testPlan.TestCases.Items[i].Tags        = testSteps.Tags;
        testPlan.TestCases.Items[i].TestSteps   = testSteps.TestSteps;
      }

      return testPlan;
    });
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
  public getTestPlanRun (id: TestPlanRunId, filter = ''): Promise<ITestPlanRun> {
    return this.request('GET', ApiVersion.V1, Endpoint.TESTPLANRUNS + `/${id}`, filter);
  }

  /**
   * Get a TestPlanRun by ID, includes attached TestCaseRun's
   *
   * @param id - ID of the TestPlanRun you'd like to search
   * @returns ITestPlanRun
   */
  public getTestPlanRunIncludeTestCaseRuns (id: TestPlanRunId): Promise<ITestPlanRun> {
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
  public addOrUpdateTestPlanRun (testPlanRun: ITestPlanRun, filter = ''): Promise<ITestPlanRun> {
    return this.request('POST', ApiVersion.V1, Endpoint.TESTPLANRUNS, filter, testPlanRun);
  }

  /**
   * Add new or Update existing TestPlanRun, include attached TestCaseRun's
   *
   * @param testPlanRun - Add/Update TestPlanRun from this object
   * @param testPlanRun.Id - (Optional) Omitting ID will create a new testPlanRun.
   * @returns ITestPlanRun
   */
  public addOrUpdateTestPlanRunIncludeTestCaseRun (testPlanRun: ITestPlanRun): Promise<ITestPlanRun> {
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
  public updateTestPlanRun (id: TestPlanId, testPlanRun: ITestPlanRun, filter = ''): Promise<ITestPlanRun> {
    return this.request('POST', ApiVersion.V1, Endpoint.TESTPLANRUNS + `/${id}`, filter, testPlanRun);
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
  public getTestCaseRun (id: TestCaseRunId, filter = ''): Promise<ITestCaseRun> {
    return this.request('GET', ApiVersion.V1, Endpoint.TESTCASERUNS + `/${id}`, filter);
  }

  public getTestCaseRunIncludeTestStepRuns (id: TestCaseId): Promise<ITestCaseRun> {
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
  public addOrUpdateTestCaseRun (testCaseRun: ITestCaseRun, filter = ''): Promise<ITestCaseRun> {
    return this.request('POST', ApiVersion.V1, Endpoint.TESTCASERUNS, filter, testCaseRun);
  }

  /**
   * Update existing TestCaseRun by id
   *
   * @param id - ID of the TestCaseRun you'd like to search
   * @param testCaseRun - Update TestCaseRun from this object
   * @param filter - (Optional) Sorting and Filters, Used to return modified results.
   * @returns ITestCaseRun
   */
  public updateTestCaseRun (id: TestCaseRunId, testCaseRun: ITestCaseRun, filter = ''): Promise<ITestCaseRun> {
    return this.request('POST', ApiVersion.V1, Endpoint.TESTCASERUNS + `/${id}`, filter, testCaseRun);
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
  public getTestStepRun (id: TestStepRunId, filter = ''): Promise<ITestStepRun> {
    return this.request('GET', ApiVersion.V1, Endpoint.TESTSTEPRUNS + `/${id}`, filter);
  }

  /**
   * Update existing TestStepRun by ID
   *
   * @param id - ID of the TestStepRun you'd like to search
   * @param testStepRun - Update TestStepRun from this object
   * @param filter - (Optional) Sorting and Filters, Used to return modified results.
   * @returns ITestStepRun
   */
  public updateTestStepRun (id: CommentId, testStepRun: ITestStepRun, filter = ''): Promise<ITestStepRun> {
    return this.request('POST', ApiVersion.V1, Endpoint.TESTSTEPRUNS + `/${id}`, filter, testStepRun);
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
  public getTestPlan (id: TestPlanId, filter = ''): Promise<ITestPlan> {
    return this.request('GET', ApiVersion.V1, Endpoint.TESTPLANS + `/${id}`, filter);
  }

  /**
   * Get a TestPlan from a linked UserStory
   *
   * @param id - ID of the UserStory you'd like to search
   * @returns ITestPlan
   */
  public getTestPlanFromUserStory (id: UserStoryId): Promise<ITestPlan> {
    return this.getUserStory(id, '?include=[LinkedTestPlan]').then((resp): Promise<ITestPlan> => {
      return this.getTestPlan(resp.LinkedTestPlan.Id);
    });
  }

  /**
   * Get a TestPlan by ID, includes attached TestCases
   *
   * @param id - ID of the TestPlan you'd like to search
   * @returns ITestPlan
   */
  public getTestPlanIncludeTestCases (id: TestPlanId): Promise<ITestPlan> {
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
  public addOrUpdateTestPlan (testPlan: ITestPlan, filter = ''): Promise<ITestPlan> {
    return this.request('POST', ApiVersion.V1, Endpoint.TESTPLANS, filter, testPlan);
  }

  /**
   * Add new or Update existing TestPlan, include linked UserStory.
   *
   * @param id - ID of the UserStory you'd like to search
   * @param testPlan - Add/Update TestPlan from this object.
   * @param testPlan.Id - (Optional) Omitting ID will create a new TestPlan.
   * @returns ITestPlan
   */
  public addOrUpdateTestPlanIncludeLinkedUserStory (id: UserStoryId, testPlan: ITestPlan): Promise<ITestPlan> {
    return this.getUserStory(id).then((userStory) => {

      // when passing an Existing testplan ID ignore other values
      if (!testPlan.Id) {

        // project ID is required when creating a NEW testplan
        if (userStory.Project && userStory.Project.Id) {
          testPlan.Project = userStory.Project;
        } else {
          throw {
            message: `missing project id: ${testPlan.Project.Id}`
          };
        }

        // link to the user story when creating NEW testplan
        if (!testPlan.LinkedGeneral) {
          testPlan.LinkedGeneral = { Id: id } as IGeneral;
        }

        // use existing testplan ID if found
        if (userStory.LinkedTestPlan && userStory.LinkedTestPlan.Id) {
          testPlan.Id = userStory.LinkedTestPlan.Id;
        }
      }

      if (testPlan.Id) {
        logStuff('INFO', 'update existing linked testplan', testPlan);
      } else {
        logStuff('INFO', 'new testplan will be created', testPlan);
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
  public deleteTestPlan (id: TestPlanId, filter = ''): Promise<ITestPlan> {
    return this.request('DELETE', ApiVersion.V1, Endpoint.TESTPLANS + `/${id}`, filter);
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
  public getTestCase (id: TestCaseId, filter = ''): Promise<ITestCase> {
    return this.request('GET', ApiVersion.V1, Endpoint.TESTCASE + `/${id}`, filter);
  }

  /**
   * Get a TestCase by ID, includes TestSteps
   *
   * @param id - ID of the TestCase you'd like to search
   * @returns ITestCase
   */
  public getTestCaseIncludeTestSteps (id: TestCaseId): Promise<ITestCase> {
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
  public addOrUpdateTestCase (testCase: ITestCase, filter = ''): Promise<ITestCase> {
    return this.request('POST', ApiVersion.V1, Endpoint.TESTCASE, filter, testCase);
  }

  /**
   * Delete a testcase by ID
   *
   * @param id - ID of the TestCase you'd like to delete
   * @param filter - (Optional) Sorting and Filters, Used to return modified results.
   * @returns ITestCase
   */
  public deleteTestCase (id: TestCaseId, filter = ''): Promise<ITestCase> {
    return this.request('DELETE', ApiVersion.V1, Endpoint.TESTCASE + `/${id}`, filter);
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
  public getTestStep (id: TestStepId, filter = ''): Promise<ITestStep> {
    return this.request('GET', ApiVersion.V1, Endpoint.TESTSTEP + `/${id}`, filter);
  }

  /**
   * Add new or Update existing TestStep
   *
   * @param testStep - Add/Update TestStep from this object
   * @param testStep.Id - (Optional) Omitting ID will create a new TestStep.
   * @param filter - (Optional) Sorting and Filters, Used to return modified results.
   * @returns ITestStep
   */
  public addOrUpdateTestStep (testStep: ITestStep, filter = ''): Promise<ITestStep> {
    return this.request('POST', ApiVersion.V1, Endpoint.TESTSTEP, filter, testStep);
  }

  /**
   * Delete a teststep by id
   *
   * @param id - ID of the TestStep you'd like to delete
   * @param filter - (Optional) Sorting and Filters, Used to return modified results.
   * @returns ITestStep
   */
  public deleteTestStep (id: TestStepId, filter = ''): Promise<ITestStep> {
    return this.request('DELETE', ApiVersion.V1, Endpoint.TESTSTEP + `/${id}`, filter);
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
  public getUserStory (id: UserStoryId, filter = ''): Promise<IUserStory> {
    return this.request('GET', ApiVersion.V1, Endpoint.USERSTORY + `/${id}`, filter);
  }

  /**
   * Get a UserStory by ID, includes attached TestCases.
   *
   * @param id - ID of the UserStory you'd like to search.
   * @returns IUserStory
   */
  public getUserStoryIncludeTestCases (id: UserStoryId): Promise<IUserStory> {
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
  public getUser (id?: UserId, filter = ''): Promise<IUser> {
    const path = id ? `/${id}` : '/loggeduser';
    return this.request('GET', ApiVersion.V1, Endpoint.USERS + path, filter);
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
  public getComment (id: CommentId, filter = ''): Promise<IComment> {
    return this.request('GET', ApiVersion.V1, Endpoint.COMMENTS + `/${id}`, filter);
  }

  /**
   * Add new or Update existing Comment for a Story/Task/Bug/TestPlan/TestCase
   *
   * @param comment - Add/Update Comment from this object
   * @param comment.Id - (Optional) Omitting ID will create a new Comment.
   * @param filter - (Optional) Sorting and Filters, Used to return modified results.
   * @returns IComment
   */
  public addOrUpdateComment (comment: IComment, filter = ''): Promise<IComment> {
    return this.request('POST', ApiVersion.V1, Endpoint.COMMENTS, filter, comment);
  }

  /**
   * Update existing Comment by ID
   *
   * @param id - ID of the Comment you'd like to search
   * @param comment - Update Comment from this object
   * @param filter - (Optional) Sorting and Filters, Used to return modified results.
   * @returns IComment
   */
  public updateComment (id: CommentId, comment: IComment, filter = ''): Promise<IComment> {
    return this.request('POST', ApiVersion.V1, Endpoint.COMMENTS + `/${id}`, filter, comment);
  }

  /**
   * Delete a Comment by ID
   *
   * @param id - ID of the Comment you'd like to delete
   * @param filter - (Optional) Sorting and Filters, Used to return modified results.
   * @returns IComment
   */
  public deleteComment (id: CommentId, filter = ''): Promise<IComment> {
    return this.request('DELETE', ApiVersion.V1, Endpoint.COMMENTS + `/${id}`, filter);
  }

  private async request (method: typeof Method[number], version: ApiVersion, endpoint: string, filter?: string, body?: object) {
    filter     = (filter ? `${filter}&` : '?') + this._accessToken;
    const url  = `https://${this._subdomain}.tpondemand.com/${version}/${endpoint}${filter}`;
    const data = {
      method : method,
      headers: this._headers,
      body   : body ? JSON.stringify(body) as BodyInit : undefined
    } as RequestInit;

    const res = await fetch(url, data);

    // throw error when response fails
    if (!res.ok) {
      throw {
        method    : method,
        url       : res.url,
        statusCode: res.status,
        message   : res.statusText
      };
    } else {
      return res.json();
    }
  }
}
