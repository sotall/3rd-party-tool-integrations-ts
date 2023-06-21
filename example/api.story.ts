import {TargetProcess} from "../src/target_process";
import key from '../key.json';
import {IGeneral, ITestCase, ITestPlan, ITestStep} from "../src/target_process/interface";
import {CustomField, Tags} from "../src/target_process/constants";

const tp          = new TargetProcess(key.token);
const userStoryId = 522917
const testPlanId  = 536396
const projectId   = 258112 // VS: State
const teamId      = 124091 // Test Experience "Taco Dog"

const newTestPlan       = {} as ITestPlan;
newTestPlan.Name        = '*UPDATE* My new Test Plan';
newTestPlan.Description = '<div><b>*UPDATE2* My Test Plan Description:</b></div>\n' +
    '\n' +
    '<ul>\n' +
    '\t<li>Must have pre-requisites setup</li>\n' +
    '\t<li>Tests for basic functionalty</li>\n' +
    '</ul>';
newTestPlan.Tags        = `${Tags.CICD}`;

const newTestCase       = {} as ITestCase;
newTestCase.Name        = 'my testcase 001';
newTestCase.Description = JSON.stringify(`<div><b>*UPDATE 123* My Test Case Description:</b></div><ul><li>Must have pre-requisites setup</li><li>Tests for basic functionality of Home Page</li></ul>`);
newTestCase.Tags        = `${Tags.AWS}, ${Tags.CICD}, ${Tags.COMPLETE}`;
newTestCase.TestSteps   = {Items: []}
newTestCase.TestSteps.Items.push({Description: 'Step #1 Action6', Result: 'Step #1 Expected result'} as ITestStep);
newTestCase.TestSteps.Items.push({Description: 'Step #2 Action6', Result: 'Step #2 Expected result'} as ITestStep);
newTestCase.TestSteps.Items.push({Description: 'Step #3 Action6', Result: 'Step #3 Expected result'} as ITestStep);
newTestCase.TestSteps.Items.push({Description: 'Step #4 Action6', Result: 'Step #4 Expected result'} as ITestStep);
newTestCase.TestSteps.Items.push({Result: 'Step #5 Expected result'} as ITestStep);
newTestCase.TestSteps.Items.push({Description: 'Step #6 Action6'} as ITestStep);
newTestCase.TestSteps.Items.push({Description: 'Step #7 Action6'} as ITestStep);
newTestCase.TestSteps.Items.push({Description: 'Step #8 Action6', Result: 'Step #8 Expected result'} as ITestStep);
newTestCase.CustomFields?.push(CustomField.TESTING_PRIORITY('Low'));
newTestCase.CustomFields?.push(CustomField.SMOKE_TEST(true));
newTestCase.CustomFields?.push(CustomField.AUTOMATION_STATUS('Automated'));
newTestCase.CustomFields?.push(CustomField.USE_FOR_REGRESSION(false));
newTestCase.CustomFields?.push(CustomField.INTEGRATION_TEST(false));
newTestCase.CustomFields?.push(CustomField.REVIEWED(false));
newTestCase.CustomFields?.push(CustomField.AUTOMATION_PRIORITY('High'));


const plans = tp.getUserStory(userStoryId).then((userStory) => {
    newTestPlan.Project       = userStory.Project;
    newTestPlan.Id            = userStory.LinkedTestPlan?.Id;
    newTestPlan.LinkedGeneral = {Id: userStory.Id} as IGeneral;
    return newTestPlan;
}).then(tp.addOrUpdateTestPlan).then((testPlan) =>{
    return testPlan.LinkedUserStory.Id
}).then(tp.getTestPlanFromUserStory)




tp.getUserStory(userStoryId).then((userStory) => {
    console.log('--------getUserStory--------')
    console.log(userStory.Id)

    newTestPlan.Project       = userStory.Project;
    newTestPlan.Id            = userStory.LinkedTestPlan?.Id;
    newTestPlan.LinkedGeneral = {Id: userStory.Id} as IGeneral;
    tp.addOrUpdateTestPlan(newTestPlan).then((testPlan) => {
        console.log('--------addTestPlan--------')
        console.log(testPlan)

        tp.getTestPlanFromUserStory(userStoryId).then((testPlan) => {
            console.log('--------getLinkedTestPlanByUserStoryId--------')
            console.log(testPlan)

            newTestPlan.Id   = testPlan.Id;
            newTestPlan.Name = '*UPDATE UPDATE* My new Test Plan';
            tp.addOrUpdateTestPlanIncludeLinkedUserStory(userStoryId, newTestPlan).then((testPlan) => {
                let testPlanId = testPlan.Id;
                tp.addOrUpdateTestCaseForTestPlan(testPlanId, newTestCase).then((testCase) => {
                    console.log('--------updateOrCreateTestCaseInTestPlan--------')
                    console.log(testCase)

                    let testCaseId = testCase.Id;
                    tp.getTestCaseIncludeTestSteps(testCaseId).then((testCase) => {
                        console.log('--------getTestCaseWithTestSteps--------')
                        console.log(testCase)

                        let testStepId = testCase.TestSteps.Items[0].Id;
                        tp.getTestStep(testStepId).then((getTestStep) => {
                            console.log('--------getTestStep--------')
                            console.log(getTestStep)

                            tp.deleteTestStep(testStepId).then((deleteTestStep) => {
                                console.log('--------deleteTestStep--------')
                                console.log(deleteTestStep)

                                tp.deleteTestCase(testCaseId).then((deleteTestCase) => {
                                    console.log('--------deleteTestCase--------')
                                    console.log(deleteTestCase)

                                    tp.deleteTestPlan(testPlanId).then((deleteTestPlan) => {
                                        console.log('--------deleteTestPlan--------')
                                        console.log(deleteTestPlan)
                                    })
                                })
                            })
                        })
                    });
                });
            });
        });
    });
})
