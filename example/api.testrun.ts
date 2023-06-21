import {TargetProcess} from "../src/target_process";
import key from '../key.json';
import {
    ITestCaseRun,
    ITestPlanRun,
    ITestStepRun
} from "../src/target_process/interface";

const tp            = new TargetProcess(key.token);
const projectId     = 258112
const userStoryId   = 522917
const testPlanId    = 539867
const testPlanRunId = 540225;
const testCaseRunId = 369362;

const newTestPlanRun = {
    Id      : testPlanRunId,
    Name    : 'My Test Plan 888',
    Project : {Id: projectId},
    TestPlan: {Id: testPlanId}
} as ITestPlanRun;

tp.addOrUpdateTestPlanRunIncludeTestCaseRun(newTestPlanRun).then((testPlanRun) => {
    console.log('--------getTestPlanRun--------')
    console.log(testPlanRun)
    console.log(JSON.stringify(testPlanRun.TestCaseRuns.Items))
    console.log('----------------')

    tp.getTestPlanRun(testPlanRunId).then((testPlanRun) => {
        console.log('--------getTestPlanRun--------')
        console.log(testPlanRun.Id)
        console.log('----------------')

        testPlanRun.Name = '*UPDATE*' + testPlanRun.Name;
        tp.updateTestPlanRun(testPlanRunId, testPlanRun).then((uTestPlanRun) => {
            console.log('--------uTestPlanRun--------')
            console.log(uTestPlanRun.Id)
            console.log('----------------')

            tp.getTestPlanRunIncludeTestCaseRuns(uTestPlanRun.Id).then((uTestCaseRun) => {
                console.log('--------testCaseRun--------')
                let testCaseRun = uTestCaseRun.TestCaseRuns.Items[0];
                console.log(testCaseRun.Id)
                console.log('----------------')

                // testCaseRun.Status      = 'Passed'
                const updateTestCaseRun = {
                    Id    : testCaseRunId,
                    Status: 'Passed'
                } as ITestCaseRun;
                tp.addOrUpdateTestCaseRun(updateTestCaseRun).then((uTestCaseRun) => {
                    console.log('--------uTestCaseRun--------')
                    console.log(uTestCaseRun.Id)
                    console.log('----------------')

                    tp.getTestCaseRunIncludeTestStepRuns(uTestCaseRun.Id).then((gTestCaseRun) => {
                        console.log('--------gTestCaseRun--------')
                        console.log(gTestCaseRun.Id)
                        console.log(gTestCaseRun.TestStepRuns.Items.length)
                        console.log('----------------')

                        let testStepRunId = gTestCaseRun.TestStepRuns.Items[0].Id;
                        tp.getTestStepRun(testStepRunId).then((gTestStepRun) => {
                            console.log('--------gTestStepRun--------')
                            console.log(gTestStepRun.Id)
                            console.log('----------------')

                            const newTestStepRun = {
                                Passed: true,
                                Runned: true
                            } as ITestStepRun;
                            tp.updateTestStepRun(testStepRunId, newTestStepRun).then((uTestStepRun) => {
                                console.log('--------uTestStepRun--------')
                                console.log(uTestStepRun)
                                console.log('----------------')
                            })
                        })
                    })
                })
            })
        })
    })
})
