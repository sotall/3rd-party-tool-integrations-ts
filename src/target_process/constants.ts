import {ICustomField} from "./interface";

export enum Subdomain {
    NWEA = 'nwea'
}

export enum ApiVersion {
    V1 = 'api/v1',
    V2 = 'api/v2'
}

export const Method = [
    'GET',
    'POST',
    'PUT',
    'DELETE'
] as const

export enum Endpoint {
    ASSIGNABLES  = 'assignables',
    BUGS         = 'bugs',
    COMMENTS     = 'comment',
    ENTITYSTATES = 'entitystates',
    GENERALS     = 'generals',
    TAGS         = 'tags',
    TESTCASE     = 'testcase',
    TESTCASES    = 'testcases',
    TESTSTEP     = 'teststep',
    TESTPLANS    = 'testplans',
    TESTPLANRUNS = 'testplanruns',
    TESTCASERUNS = 'testcaseruns',
    TESTSTEPRUNS = 'teststepruns',
    USERSTORY    = 'userstory',
    USERS        = 'users'
}

export const State = [
    'PASSED',
    'FAILED'
] as const

export const LogType = [
    'INFO',
    'WARN',
    'ERROR'
] as const

export const ResourceType = [
    'Comment',
    'Process',
    'Project',
    'TestPlan',
    'TestCase',
    'EntityType'
] as const

export const Priority = [
    'Low',
    'Medium',
    'High'
] as const

export const WorkType = [
    'Roadmap',
    'Tech Debt',
    'Maintenance',
    'Innovation'
] as const

export const Platform = [
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
] as const

export const Triage = [
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
] as const

export const maintBacklogPriority = [
    1,
    2,
    3,
    4
] as const

export const workPhase = [
    'Design',
    'Delivery'
] as const

export const NNL = [
    'Now',
    'Next',
    'Later',
    'Ongoing',
    'Never',
    'Not Yet - Not Prioritized'
] as const

export enum Tags {
    CICD          = 'CICD',
    AWS           = 'AWS',
    COMPLETE      = 'Complete',
    ACCESSIBILITY = 'Accessibility'
}

export const AutomationStatus = [
    'Automated',
    'Can Not Automate',
    'In Progress',
    'Manual',
    'Needs Automation'
] as const

export const TestCaseRunStatus = [
    'NotRun',
    'Passed',
    'Failed',
    'OnHold',
    'Blocked'
] as const

export const BusinessValue = [
    'Highest',
    'High',
    'Moderate',
    'Low'
] as const

export const Kind = [
    'User'
] as const

export const Type = [
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
] as const

export enum TestCaseRunStatusOLD {
    NotRun  = 'NotRun',
    Passed  = 'Passed',
    Failed  = 'Failed',
    OnHold  = 'OnHold',
    Blocked = 'Blocked'
}

export enum CustomFieldType {
    CHECKBOX                = 'CheckBox',
    DATE                    = 'Date',
    DROP_DOWN               = 'DropDown',
    MULTIPLE_SELECTION_LIST = 'MultipleSelectionList',
    NUMBER                  = 'Number',
    RICH_TEXT               = 'RichText',
    TEXT                    = 'Text'
}

export enum EntityState {
    OPEN       = 685,
    InProgress = 686,
    DONE       = 687
}

export type BugId = number; //TODO - confirm type
export type CommentId = number;
export type GeneralId = UserStoryId | TaskId | BugId | TestPlanId | TestCaseId;
export type ProjectId = number;
export type LinkedGeneralId = ProjectId | GeneralId;
export type TaskId = number; //TODO - confirm type
export type TestCaseId = number;
export type TestCaseRunId = number;
export type TestPlanId = number;
export type TestPlanRunId = number;
export type TestStepId = number;
export type TestStepRunId = number;
export type UserId = number;
export type UserStoryId = number;
export type IdListFile = string;

export const CustomField = {
    TESTING_PRIORITY                : (v: typeof Priority[number]) => {
        return {
            Name : 'Testing Priority',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        } as ICustomField;
    },
    SMOKE_TEST                      : (v: boolean) => {
        return {
            Name : 'Smoke Test',
            Type : CustomFieldType.CHECKBOX,
            Value: v
        }
    },
    AUTOMATION_STATUS               : (v: typeof AutomationStatus[number]) => {
        return {
            Name : 'Automation Status',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    USE_FOR_REGRESSION              : (v: boolean) => {
        return {
            Name : 'Use for Regression',
            Type : CustomFieldType.CHECKBOX,
            Value: v
        }
    },
    INTEGRATION_TEST                : (v: boolean) => {
        return {
            Name : 'Integration Test',
            Type : CustomFieldType.CHECKBOX,
            Value: v
        }
    },
    REVIEWED                        : (v: boolean) => {
        return {
            Name : 'Reviewed',
            Type : CustomFieldType.CHECKBOX,
            Value: v
        }
    },
    AUTOMATION_PRIORITY             : (v: typeof Priority[number]) => {
        return {
            Name : 'Automation Priority',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    EXIST_IN_PROD                   : (v: boolean) => {
        return {
            Name : 'Exist in Prod',
            Type : CustomFieldType.CHECKBOX,
            Value: v
        }
    },
    WORK_TYPE                       : (v: typeof WorkType[number]) => {
        return {
            Name : 'Work Type',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    Platform                        : (v: typeof Platform[number]) => {
        return {
            Name : 'Platform (Product)',
            Type : CustomFieldType.MULTIPLE_SELECTION_LIST,
            Value: v
        }
    },
    Triage                          : (v: typeof Triage[number]) => {
        return {
            Name : 'Triage',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    MAINTENANCE_BACKLOG_PRIORITY    : (v: typeof maintBacklogPriority[number]) => {
        return {
            Name : 'Maintenance Backlog Priority',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    DEPLOYMENT_DATE                 : (v: string) => {
        return {
            Name : 'Deployment Date',
            Type : CustomFieldType.DATE,
            Value: v
        }
    },
    LINKED_TEST_PLAN_ID             : (v: number) => {
        return {
            Name : 'LinkedTestPlanID',
            Type : CustomFieldType.NUMBER,
            Value: v
        }
    },
    ACCEPTANCE_CRITERIA             : (v: string) => {
        return {
            Name : 'Acceptance Criteria',
            Type : CustomFieldType.RICH_TEXT,
            Value: v
        }
    },
    READY_TO_REALIZE_TARGET         : (v: string) => {
        return {
            Name : 'Ready to Realize Target',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    DISCOVERY_INCREMENT             : (v: string) => {
        return {
            Name : 'Discovery Increment',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    BASELINE_DISCOVERY_SPRINT       : (v: string) => {
        return {
            Name : 'Baseline Discovery Sprint',
            Type : CustomFieldType.TEXT,
            Value: v
        }
    },
    WORK_PHASE                      : (v: typeof workPhase[number]) => {
        return {
            Name : 'Work Phase',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    CROSS_TEAM_DEPENDENCY           : (v: boolean) => {
        return {
            Name : 'Cross Team Dependency',
            Type : CustomFieldType.CHECKBOX,
            Value: v
        }
    },
    BASELINE_READY_TO_REALIZE_TARGET: (v: string) => {
        return {
            Name : 'Baseline Ready to Realize Target',
            Type : CustomFieldType.TEXT,
            Value: v
        }
    },
    NNL_STATE_ONLY                  : (v: typeof NNL[number]) => {
        return {
            Name : 'NNL_State Only',
            Type : CustomFieldType.DROP_DOWN,
            Value: v
        }
    },
    FEATURE_FLAG                    : (v: string) => {
        return {
            Name : 'Feature Flag',
            Type : CustomFieldType.TEXT,
            Value: v
        }
    }
}
