import { TargetProcess } from "../src/target_process";
import key from "../key.json";
import { ITestPlan } from "../src/target_process/interface";

const tp = new TargetProcess(key.token);

tp.downloadTestPlans([12345, 539867]).then((testPlans: any) => {
  console.log('-------------------------------');
  console.log(testPlans);
  console.log('-------------------------------');
  testPlans = testPlans.map((testPlan: ITestPlan) => {
    testPlan.Name = testPlan.Name.replace(/444/g, '555');
    return testPlan;
  });
  tp.uploadTestPlans(testPlans);
});
