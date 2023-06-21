import {TargetProcess} from "../src/target_process";
import key from '../key.json';

const tp          = new TargetProcess(key.token);
const userStoryId = 522917
const testPlanId = 216921

tp.getTestCasesForUserStoryId(userStoryId).then((testCases) => {
    console.log(`testCases: ${JSON.stringify(testCases)}`)
});

tp.getTestCasesForTestPlanId(testPlanId).then((testCases) => {
    console.log(`testCases: ${JSON.stringify(testCases)}`)
});



