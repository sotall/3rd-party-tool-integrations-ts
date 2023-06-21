import {
    CommentId,
    GeneralId,
    Kind,
    Type,
    TestCaseId,
    TestCaseRunId,
    TestCaseRunStatus,
    TestPlanId,
    TestPlanRunId,
    TestStepId,
    TestStepRunId,
    UserStoryId
} from "./constants";

export interface IComment {
    ResourceType: Type['Comment'],
    Id: CommentId,
    Description: string,
    ParentId: number,
    CreateDate: string,
    DescriptionModifyDate: string,
    IsPrivate: boolean,
    IsPinned: boolean,
    General: IGeneral,
    Owner: IGeneralUser
}

export interface IUser {
    ResourceType: Type['User'],
    Kind: typeof Kind[number],
    Id: UserId,
    FirstName: string,
    LastName: string,
    Email: string,
    Login: string,
    FullName: string,
    CreateDate: string,
    ModifyDate: string,
    DeleteDate: string,
    IsActive: boolean,
    IsAdministrator: boolean,
    Locale: unknown, // TODO - confirm type
    GlobalId: string,
    PasswordHashAlgorithm: string,
    LastLoginDate: string,
    WeeklyAvailableHours: number,
    CurrentAllocation: number,
    CurrentAvailableHours: number,
    AvailableFrom: string,
    AvailableFutureAllocation: number,
    AvailableFutureHours: number,
    IsObserver: boolean,
    IsContributor: boolean,
    LegacySkills: unknown, // TODO - confirm type
    ActiveDirectoryName: unknown, // TODO - confirm type
    RichEditor: string,
    Role: IRole,
    CustomFields: ICustomField[]
}

export interface IUserStory {
    ResourceType: Type['UserStory'],
    Id: UserStoryId,
    Name: string,
    Description: string,
    StartDate: string,
    EndDate: string,
    CreateDate: string,
    ModifyDate: string,
    LastCommentDate: string,
    Tags: string,
    NumericPriority: number,
    Effort: number,
    EffortCompleted: number,
    EffortToDo: number,
    Progress: number,
    TimeSpent: number,
    TimeRemain: number,
    LastStateChangeDate: string,
    PlannedStartDate: string,
    PlannedEndDate: string,
    InitialEstimate: number,
    Units: string,
    EntityType: IEntityType,
    Project: IProject,
    LastEditor: IGeneralUser,
    Owner: IGeneralUser,
    Creator: IGeneralUser,
    LastCommentedUser: IGeneralUser,
    LinkedTestPlan: ITestPlan,
    Milestone: unknown, // TODO - confirm type
    Release: IRelease,
    Iteration: null,
    TeamIteration: null,
    Team: ITeam,
    Priority: IPriority,
    EntityState: IEntityState,
    ResponsibleTeam: ITeamAssignment,
    Feature: IFeature,
    Build: unknown, // TODO - confirm type
    Package: IPackage,
    IterationGoal: unknown, // TODO - confirm type
    CustomFields: CustomField[]
}

export interface ITestPlan {
    ResourceType: Type['TestPlan'],
    Id: TestPlanId,
    Name: string,
    Description: string,
    StartDate: string,
    EndDate: string,
    CreateDate: string,
    ModifyDate: string,
    LastCommentDate: string,
    Tags: string,
    NumericPriority: number,
    Effort: number,
    EffortCompleted: number,
    EffortToDo: number,
    Progress: number,
    TimeSpent: number,
    TimeRemain: number,
    LastStateChangeDate: string,
    PlannedStartDate: string,
    PlannedEndDate: string,
    InitialEstimate: number,
    CalculatedEstimate: unknown, // TODO - confirm type
    Units: string,
    EntityType: IEntityType,
    Project: IProject,
    LastEditor: IGeneralUser,
    Owner: IGeneralUser,
    Creator: IGeneralUser,
    LastCommentedUser: unknown, // TODO - confirm type
    LinkedTestPlan: unknown, // TODO - confirm type
    Milestone: unknown, // TODO - confirm type
    Release: unknown, // TODO - confirm type
    Iteration: unknown, // TODO - confirm type
    TeamIteration: unknown, // TODO - confirm type
    Team: ITeam,
    Priority: IPriority,
    EntityState: IEntityState,
    ResponsibleTeam: ITeamAssignment,
    LinkedGeneral: IGeneral,
    LinkedAssignable: IAssignable,
    LinkedEpic: unknown, // TODO - confirm type
    LinkedFeature: unknown, // TODO - confirm type
    LinkedUserStory: IUserStory,
    LinkedTask: unknown, // TODO - confirm type
    LinkedBug: unknown, // TODO - confirm type
    LinkedRequest: unknown, // TODO - confirm type
    LinkedBuild: unknown, // TODO - confirm type
    LinkedRelease: unknown, // TODO - confirm type
    LinkedIteration: unknown, // TODO - confirm type
    LinkedTeamIteration: unknown, // TODO - confirm type
    CustomFields: ICustomField[],
    TestCases: { Items: ITestCase[] },
    ParentTestPlans: { Items: ITestPlan[] },
    ChildTestPlans: { Items: ITestPlan[] }
}

export interface ITestCase {
    ResourceType: Type['TestCase'],
    Id: TestCaseId,
    Name: string,
    Description: string,
    StartDate: string,
    EndDate: string,
    CreateDate: string,
    ModifyDate: string,
    LastCommentDate: string,
    Tags: string,
    NumericPriority: number,
    Steps: unknown, // TODO - confirm type
    Success: unknown, // TODO - confirm type
    LastStatus: boolean,
    LastRunStatus: typeof TestCaseRunStatus[number],
    LastFailureComment: string,
    LastRunDate: string,
    EntityType: IEntityType,
    Project: IProject,
    LastEditor: IGeneralUser,
    Owner: IGeneralUser,
    Creator: IGeneralUser,
    LastCommentedUser: IGeneralUser,
    LinkedTestPlan: unknown, // TODO - confirm type
    Milestone: unknown, // TODO - confirm type
    UserStory: unknown, // TODO - confirm type
    Priority: IPriority,
    CustomFields: ICustomField[],
    TestSteps: { Items: ITestStep[] },
    TestPlans: ITestPlan[]
}

export interface ITestStep {
    ResourceType: Type['TestStep'],
    Id: TestStepId,
    Description: string,
    Result: string,
    RunOrder: number,
    TestCase: ITestCase
}

/**
 * @example - Add New
 * const testPlanRun = {
 *     Name     : 'My Test Plan',
 *     Project  : {Id: projectId},
 *     TestPlan : {Id: testPlanId},
 * } as ITestPlanRun;
 *
 * @example - Update Existing
 * const testPlanRun = {
 *     Id   : testPlanRunId,
 *     Name : '*UPDATE NAME* My Test Plan'
 * } as ITestPlanRun;
 */
export interface ITestPlanRun {
    ResourceType: Type['TestPlanRun'],
    Id: TestPlanRunId,
    Name: string,
    Description: string,
    StartDate: string,
    EndDate: string,
    CreateDate: string,
    ModifyDate: string,
    LastCommentDate: string,
    Tags: string,
    NumericPriority: number,
    Effort: number,
    EffortCompleted: number,
    EffortToDo: number,
    Progress: number,
    TimeSpent: number,
    TimeRemain: number,
    LastStateChangeDate: string,
    PlannedStartDate: string,
    PlannedEndDate: string,
    NotRunCount: number,
    PassedCount: number,
    FailedCount: number,
    OnHoldCount: number,
    BlockedCount: number,
    IsLastStarted: boolean,
    Units: string,
    EntityType: IEntityType,
    Project: IProject,
    LastEditor: IGeneralUser,
    Owner: IGeneralUser,
    Creator: IGeneralUser,
    LastCommentedUser: unknown, // TODO - confirm type
    LinkedTestPlan: unknown, // TODO - confirm type
    Milestone: unknown, // TODO - confirm type
    Release: unknown, // TODO - confirm type
    Iteration: unknown, // TODO - confirm type
    TeamIteration: unknown, // TODO - confirm type
    Team: ITeam,
    Priority: IPriority,
    EntityState: IEntityState,
    ResponsibleTeam: ITeamAssignment,
    Build: unknown, // TODO - confirm type
    TestPlan: ITestPlan,
    ParentTestPlanRun: unknown, // TODO - confirm type
    Package: IPackage,
    CustomFields: ICustomField[]
    TestCaseRuns: { Items: ITestCaseRun[] }
}

/**
 * @example - Update Existing
 * const testCaseRun = {
 *     Id     : testCaseRunId
 *     Status : 'Passed'
 * } as ITestCaseRun;
 */
export interface ITestCaseRun {
    ResourceType: Type['TestCaseRun'],
    Id: TestCaseRunId,
    Executed: boolean,
    Passed: boolean,
    Comment: string,
    EndRunDate: string,
    StartRunDate: string,
    Status: typeof TestCaseRunStatus[number],
    EntityType: IEntityType,
    TestPlanRun: ITestPlanRun,
    RootTestPlanRun: ITestPlanRun,
    TestCase: ITestCase,
    FreezedTestCaseInfo: unknown, // TODO - confirm type
    TestStepRuns: { Items: ITestStepRun[] }
    Priority: IPriority,
    LastExecutor: IUser
}

/**
 * @example - Update Existing
 * const testStepRun = {
 *     Passed: true,
 *     Runned: true
 * } as ITestStepRun;
 */
export interface ITestStepRun {
    ResourceType: Type['TestStepRun'],
    Id: TestStepRunId,
    Passed: boolean,
    Runned: boolean,
    RunOrder: number,
    TestCaseRun: ITestCaseRun,
    TestStep: ITestStep
}

/**
 * Subs
 */

export interface ICustomField {
    Name: string,
    Type: string,
    Value: string | boolean
}

export interface IEntityType {
    ResourceType: Type['EntityType'],
    Id: number,
    Name: string
}

export interface IProject {
    ResourceType: Type['Project'],
    Id: number,
    Name: string,
    Process: IProcess
}

export interface IProcess {
    ResourceType: Type['Process'],
    Id: number
}

export interface IAssignments {
    GeneralUser: IGeneralUser,
    Role: IRole
}

export interface IGeneralUser {
    ResourceType: Type['GeneralUser'],
    Id: number,
    FirstName: string,
    LastName: string,
    Login: string,
    FullName: string
}

export interface IRole {
    ResourceType: Type['Role'],
    Id: number,
    Name: string
}

export interface ITeam {
    ResourceType: Type['Team'],
    Id: number,
    Name: string,
    EmojiIcon: string
}

export interface IPriority {
    ResourceType: Type['Priority'],
    Id: number,
    Name: string,
    Importance: number
}

export interface IEntityState {
    ResourceType: Type['EntityState'],
    Id: number,                     // e.g  687
    Name: string,                   // e.g. Done
    NumericPriority: number
}

export interface IGeneral {
    ResourceType: Type['General'],
    Id: GeneralId,
    Name: string
}

export interface IAssignable {
    ResourceType: Type['Assignable'],
    Id: number,
    Name: string
}

export interface IRelease {
    ResourceType: Type['Release'],
    Id: number,
    Name: string
}

export interface ITeamAssignment {
    ResourceType: Type['TeamAssignment'],
    Id: number
}

export interface IFeature {
    ResourceType: Type['Feature'],
    Id: number,
    Name: string
}

export interface IPackage {
    ResourceType: Type['Package'],
    Id: number,
    Name: string
}
