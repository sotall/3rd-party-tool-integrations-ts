"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomField = exports.EntityState = exports.CustomFieldType = exports.TestCaseRunStatusOLD = exports.Type = exports.Kind = exports.BusinessValue = exports.TestCaseRunStatus = exports.AutomationStatus = exports.Tags = exports.NNL = exports.workPhase = exports.maintBacklogPriority = exports.Triage = exports.Platform = exports.WorkType = exports.Priority = exports.ResourceType = exports.LogType = exports.State = exports.Endpoint = exports.Method = exports.ApiVersion = exports.Subdomain = void 0;
var Subdomain;
(function (Subdomain) {
    Subdomain["NWEA"] = "nwea";
})(Subdomain = exports.Subdomain || (exports.Subdomain = {}));
var ApiVersion;
(function (ApiVersion) {
    ApiVersion["V1"] = "api/v1";
    ApiVersion["V2"] = "api/v2";
})(ApiVersion = exports.ApiVersion || (exports.ApiVersion = {}));
exports.Method = [
    'GET',
    'POST',
    'PUT',
    'DELETE'
];
var Endpoint;
(function (Endpoint) {
    Endpoint["ASSIGNABLES"] = "assignables";
    Endpoint["BUGS"] = "bugs";
    Endpoint["COMMENTS"] = "comment";
    Endpoint["ENTITYSTATES"] = "entitystates";
    Endpoint["GENERALS"] = "generals";
    Endpoint["TAGS"] = "tags";
    Endpoint["TESTCASE"] = "testcase";
    Endpoint["TESTCASES"] = "testcases";
    Endpoint["TESTSTEP"] = "teststep";
    Endpoint["TESTPLANS"] = "testplans";
    Endpoint["TESTPLANRUNS"] = "testplanruns";
    Endpoint["TESTCASERUNS"] = "testcaseruns";
    Endpoint["TESTSTEPRUNS"] = "teststepruns";
    Endpoint["USERSTORY"] = "userstory";
    Endpoint["USERS"] = "users";
})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));
exports.State = [
    'PASSED',
    'FAILED'
];
exports.LogType = [
    'INFO',
    'WARN',
    'ERROR'
];
exports.ResourceType = [
    'Comment',
    'Process',
    'Project',
    'TestPlan',
    'TestCase',
    'EntityType'
];
exports.Priority = [
    'Low',
    'Medium',
    'High'
];
exports.WorkType = [
    'Roadmap',
    'Tech Debt',
    'Maintenance',
    'Innovation'
];
exports.Platform = [
    'MAP Growth',
    'Altair',
    'Test Publishing',
    'Test Player Free',
    'Summative',
    'MAP Accelerator',
    'CPAA',
    'MAP Skills',
    'MAP Reading Fluency',
    'Platform Tools',
    'PL Online',
    'OECD',
    'Through Year',
    'Accessibility',
    'Security',
    'Data Quality',
    'NWEA.org',
    'ICP',
    'No Platform/Product'
];
exports.Triage = [
    'Migrated to Roadmap',
    'Hotfix',
    'Change Request',
    'NY POC',
    'NE Internal UAT',
    'NE External UAT',
    'NE Go Live',
    'Needs MBL Ranking',
    'Maintenance Backlog',
    'Security',
    'Tech Debt',
    'Don\'t Fix'
];
exports.maintBacklogPriority = [
    1,
    2,
    3,
    4
];
exports.workPhase = [
    'Design',
    'Delivery'
];
exports.NNL = [
    'Now',
    'Next',
    'Later',
    'Ongoing',
    'Never',
    'Not Yet - Not Prioritized'
];
var Tags;
(function (Tags) {
    Tags["CICD"] = "CICD";
    Tags["AWS"] = "AWS";
    Tags["COMPLETE"] = "Complete";
    Tags["ACCESSIBILITY"] = "Accessibility";
})(Tags = exports.Tags || (exports.Tags = {}));
exports.AutomationStatus = [
    'Automated',
    'Can Not Automate',
    'In Progress',
    'Manual',
    'Needs Automation'
];
exports.TestCaseRunStatus = [
    'NotRun',
    'Passed',
    'Failed',
    'OnHold',
    'Blocked'
];
exports.BusinessValue = [
    'Highest',
    'High',
    'Moderate',
    'Low'
];
exports.Kind = [
    'User'
];
exports.Type = [
    'Comment',
    'User',
    'UserStory',
    'TestPlan',
    'TestCase',
    'TestStep',
    'TestPlanRun',
    'TestCaseRun',
    'TestStepRun',
    'EntityType',
    'Project',
    'Process',
    'GeneralUser',
    'Role',
    'Team',
    'Priority',
    'EntityState',
    'General',
    'Assignable',
    'Release',
    'TeamAssignment',
    'Feature',
    'Package'
];
var TestCaseRunStatusOLD;
(function (TestCaseRunStatusOLD) {
    TestCaseRunStatusOLD["NotRun"] = "NotRun";
    TestCaseRunStatusOLD["Passed"] = "Passed";
    TestCaseRunStatusOLD["Failed"] = "Failed";
    TestCaseRunStatusOLD["OnHold"] = "OnHold";
    TestCaseRunStatusOLD["Blocked"] = "Blocked";
})(TestCaseRunStatusOLD = exports.TestCaseRunStatusOLD || (exports.TestCaseRunStatusOLD = {}));
var CustomFieldType;
(function (CustomFieldType) {
    CustomFieldType["CHECKBOX"] = "CheckBox";
    CustomFieldType["DATE"] = "Date";
    CustomFieldType["DROP_DOWN"] = "DropDown";
    CustomFieldType["MULTIPLE_SELECTION_LIST"] = "MultipleSelectionList";
    CustomFieldType["NUMBER"] = "Number";
    CustomFieldType["RICH_TEXT"] = "RichText";
    CustomFieldType["TEXT"] = "Text";
})(CustomFieldType = exports.CustomFieldType || (exports.CustomFieldType = {}));
var EntityState;
(function (EntityState) {
    EntityState[EntityState["OPEN"] = 685] = "OPEN";
    EntityState[EntityState["InProgress"] = 686] = "InProgress";
    EntityState[EntityState["DONE"] = 687] = "DONE";
})(EntityState = exports.EntityState || (exports.EntityState = {}));
exports.CustomField = {
    TESTING_PRIORITY: (v) => {
        return {
            Name: 'Testing Priority',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    SMOKE_TEST: (v) => {
        return {
            Name: 'Smoke Test',
            Type: CustomFieldType.CHECKBOX,
            Value: v
        };
    },
    AUTOMATION_STATUS: (v) => {
        return {
            Name: 'Automation Status',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    USE_FOR_REGRESSION: (v) => {
        return {
            Name: 'Use for Regression',
            Type: CustomFieldType.CHECKBOX,
            Value: v
        };
    },
    INTEGRATION_TEST: (v) => {
        return {
            Name: 'Integration Test',
            Type: CustomFieldType.CHECKBOX,
            Value: v
        };
    },
    REVIEWED: (v) => {
        return {
            Name: 'Reviewed',
            Type: CustomFieldType.CHECKBOX,
            Value: v
        };
    },
    AUTOMATION_PRIORITY: (v) => {
        return {
            Name: 'Automation Priority',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    EXIST_IN_PROD: (v) => {
        return {
            Name: 'Exist in Prod',
            Type: CustomFieldType.CHECKBOX,
            Value: v
        };
    },
    WORK_TYPE: (v) => {
        return {
            Name: 'Work Type',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    Platform: (v) => {
        return {
            Name: 'Platform (Product)',
            Type: CustomFieldType.MULTIPLE_SELECTION_LIST,
            Value: v
        };
    },
    Triage: (v) => {
        return {
            Name: 'Triage',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    MAINTENANCE_BACKLOG_PRIORITY: (v) => {
        return {
            Name: 'Maintenance Backlog Priority',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    DEPLOYMENT_DATE: (v) => {
        return {
            Name: 'Deployment Date',
            Type: CustomFieldType.DATE,
            Value: v
        };
    },
    LINKED_TEST_PLAN_ID: (v) => {
        return {
            Name: 'LinkedTestPlanID',
            Type: CustomFieldType.NUMBER,
            Value: v
        };
    },
    ACCEPTANCE_CRITERIA: (v) => {
        return {
            Name: 'Acceptance Criteria',
            Type: CustomFieldType.RICH_TEXT,
            Value: v
        };
    },
    READY_TO_REALIZE_TARGET: (v) => {
        return {
            Name: 'Ready to Realize Target',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    DISCOVERY_INCREMENT: (v) => {
        return {
            Name: 'Discovery Increment',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    BASELINE_DISCOVERY_SPRINT: (v) => {
        return {
            Name: 'Baseline Discovery Sprint',
            Type: CustomFieldType.TEXT,
            Value: v
        };
    },
    WORK_PHASE: (v) => {
        return {
            Name: 'Work Phase',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    CROSS_TEAM_DEPENDENCY: (v) => {
        return {
            Name: 'Cross Team Dependency',
            Type: CustomFieldType.CHECKBOX,
            Value: v
        };
    },
    BASELINE_READY_TO_REALIZE_TARGET: (v) => {
        return {
            Name: 'Baseline Ready to Realize Target',
            Type: CustomFieldType.TEXT,
            Value: v
        };
    },
    NNL_STATE_ONLY: (v) => {
        return {
            Name: 'NNL_State Only',
            Type: CustomFieldType.DROP_DOWN,
            Value: v
        };
    },
    FEATURE_FLAG: (v) => {
        return {
            Name: 'Feature Flag',
            Type: CustomFieldType.TEXT,
            Value: v
        };
    }
};
