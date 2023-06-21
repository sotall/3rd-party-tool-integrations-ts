import { ICustomField } from "./interface";
export declare enum Subdomain {
    NWEA = "nwea"
}
export declare enum ApiVersion {
    V1 = "api/v1",
    V2 = "api/v2"
}
export declare const Method: readonly ["GET", "POST", "PUT", "DELETE"];
export declare enum Endpoint {
    ASSIGNABLES = "assignables",
    BUGS = "bugs",
    COMMENTS = "comment",
    ENTITYSTATES = "entitystates",
    GENERALS = "generals",
    TAGS = "tags",
    TESTCASE = "testcase",
    TESTCASES = "testcases",
    TESTSTEP = "teststep",
    TESTPLANS = "testplans",
    TESTPLANRUNS = "testplanruns",
    TESTCASERUNS = "testcaseruns",
    TESTSTEPRUNS = "teststepruns",
    USERSTORY = "userstory",
    USERS = "users"
}
export declare const State: readonly ["PASSED", "FAILED"];
export declare const LogType: readonly ["INFO", "WARN", "ERROR"];
export declare const ResourceType: readonly ["Comment", "Process", "Project", "TestPlan", "TestCase", "EntityType"];
export declare const Priority: readonly ["Low", "Medium", "High"];
export declare const WorkType: readonly ["Roadmap", "Tech Debt", "Maintenance", "Innovation"];
export declare const Platform: readonly ["MAP Growth", "Altair", "Test Publishing", "Test Player Free", "Summative", "MAP Accelerator", "CPAA", "MAP Skills", "MAP Reading Fluency", "Platform Tools", "PL Online", "OECD", "Through Year", "Accessibility", "Security", "Data Quality", "NWEA.org", "ICP", "No Platform/Product"];
export declare const Triage: readonly ["Migrated to Roadmap", "Hotfix", "Change Request", "NY POC", "NE Internal UAT", "NE External UAT", "NE Go Live", "Needs MBL Ranking", "Maintenance Backlog", "Security", "Tech Debt", "Don't Fix"];
export declare const maintBacklogPriority: readonly [1, 2, 3, 4];
export declare const workPhase: readonly ["Design", "Delivery"];
export declare const NNL: readonly ["Now", "Next", "Later", "Ongoing", "Never", "Not Yet - Not Prioritized"];
export declare enum Tags {
    CICD = "CICD",
    AWS = "AWS",
    COMPLETE = "Complete",
    ACCESSIBILITY = "Accessibility"
}
export declare const AutomationStatus: readonly ["Automated", "Can Not Automate", "In Progress", "Manual", "Needs Automation"];
export declare const TestCaseRunStatus: readonly ["NotRun", "Passed", "Failed", "OnHold", "Blocked"];
export declare const BusinessValue: readonly ["Highest", "High", "Moderate", "Low"];
export declare const Kind: readonly ["User"];
export declare const Type: readonly ["Comment", "User", "UserStory", "TestPlan", "TestCase", "TestStep", "TestPlanRun", "TestCaseRun", "TestStepRun", "EntityType", "Project", "Process", "GeneralUser", "Role", "Team", "Priority", "EntityState", "General", "Assignable", "Release", "TeamAssignment", "Feature", "Package"];
export declare enum TestCaseRunStatusOLD {
    NotRun = "NotRun",
    Passed = "Passed",
    Failed = "Failed",
    OnHold = "OnHold",
    Blocked = "Blocked"
}
export declare enum CustomFieldType {
    CHECKBOX = "CheckBox",
    DATE = "Date",
    DROP_DOWN = "DropDown",
    MULTIPLE_SELECTION_LIST = "MultipleSelectionList",
    NUMBER = "Number",
    RICH_TEXT = "RichText",
    TEXT = "Text"
}
export declare enum EntityState {
    OPEN = 685,
    InProgress = 686,
    DONE = 687
}
export declare type BugId = number;
export declare type CommentId = number;
export declare type GeneralId = UserStoryId | TaskId | BugId | TestPlanId | TestCaseId;
export declare type ProjectId = number;
export declare type LinkedGeneralId = ProjectId | GeneralId;
export declare type TaskId = number;
export declare type TestCaseId = number;
export declare type TestCaseRunId = number;
export declare type TestPlanId = number;
export declare type TestPlanRunId = number;
export declare type TestStepId = number;
export declare type TestStepRunId = number;
export declare type UserId = number;
export declare type UserStoryId = number;
export declare type IdListFile = string;
export declare const CustomField: {
    TESTING_PRIORITY: (v: (typeof Priority)[number]) => ICustomField;
    SMOKE_TEST: (v: boolean) => {
        Name: string;
        Type: CustomFieldType;
        Value: boolean;
    };
    AUTOMATION_STATUS: (v: (typeof AutomationStatus)[number]) => {
        Name: string;
        Type: CustomFieldType;
        Value: "Automated" | "Can Not Automate" | "In Progress" | "Manual" | "Needs Automation";
    };
    USE_FOR_REGRESSION: (v: boolean) => {
        Name: string;
        Type: CustomFieldType;
        Value: boolean;
    };
    INTEGRATION_TEST: (v: boolean) => {
        Name: string;
        Type: CustomFieldType;
        Value: boolean;
    };
    REVIEWED: (v: boolean) => {
        Name: string;
        Type: CustomFieldType;
        Value: boolean;
    };
    AUTOMATION_PRIORITY: (v: (typeof Priority)[number]) => {
        Name: string;
        Type: CustomFieldType;
        Value: "Low" | "Medium" | "High";
    };
    EXIST_IN_PROD: (v: boolean) => {
        Name: string;
        Type: CustomFieldType;
        Value: boolean;
    };
    WORK_TYPE: (v: (typeof WorkType)[number]) => {
        Name: string;
        Type: CustomFieldType;
        Value: "Roadmap" | "Tech Debt" | "Maintenance" | "Innovation";
    };
    Platform: (v: (typeof Platform)[number]) => {
        Name: string;
        Type: CustomFieldType;
        Value: "MAP Growth" | "Altair" | "Test Publishing" | "Test Player Free" | "Summative" | "MAP Accelerator" | "CPAA" | "MAP Skills" | "MAP Reading Fluency" | "Platform Tools" | "PL Online" | "OECD" | "Through Year" | "Accessibility" | "Security" | "Data Quality" | "NWEA.org" | "ICP" | "No Platform/Product";
    };
    Triage: (v: (typeof Triage)[number]) => {
        Name: string;
        Type: CustomFieldType;
        Value: "Tech Debt" | "Security" | "Migrated to Roadmap" | "Hotfix" | "Change Request" | "NY POC" | "NE Internal UAT" | "NE External UAT" | "NE Go Live" | "Needs MBL Ranking" | "Maintenance Backlog" | "Don't Fix";
    };
    MAINTENANCE_BACKLOG_PRIORITY: (v: (typeof maintBacklogPriority)[number]) => {
        Name: string;
        Type: CustomFieldType;
        Value: 4 | 2 | 3 | 1;
    };
    DEPLOYMENT_DATE: (v: string) => {
        Name: string;
        Type: CustomFieldType;
        Value: string;
    };
    LINKED_TEST_PLAN_ID: (v: number) => {
        Name: string;
        Type: CustomFieldType;
        Value: number;
    };
    ACCEPTANCE_CRITERIA: (v: string) => {
        Name: string;
        Type: CustomFieldType;
        Value: string;
    };
    READY_TO_REALIZE_TARGET: (v: string) => {
        Name: string;
        Type: CustomFieldType;
        Value: string;
    };
    DISCOVERY_INCREMENT: (v: string) => {
        Name: string;
        Type: CustomFieldType;
        Value: string;
    };
    BASELINE_DISCOVERY_SPRINT: (v: string) => {
        Name: string;
        Type: CustomFieldType;
        Value: string;
    };
    WORK_PHASE: (v: (typeof workPhase)[number]) => {
        Name: string;
        Type: CustomFieldType;
        Value: "Design" | "Delivery";
    };
    CROSS_TEAM_DEPENDENCY: (v: boolean) => {
        Name: string;
        Type: CustomFieldType;
        Value: boolean;
    };
    BASELINE_READY_TO_REALIZE_TARGET: (v: string) => {
        Name: string;
        Type: CustomFieldType;
        Value: string;
    };
    NNL_STATE_ONLY: (v: (typeof NNL)[number]) => {
        Name: string;
        Type: CustomFieldType;
        Value: "Now" | "Next" | "Later" | "Ongoing" | "Never" | "Not Yet - Not Prioritized";
    };
    FEATURE_FLAG: (v: string) => {
        Name: string;
        Type: CustomFieldType;
        Value: string;
    };
};
