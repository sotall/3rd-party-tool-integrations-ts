import {TargetProcess} from "../src/target_process";
import key from '../key.json';

const tp = new TargetProcess(key.token);

// get currently logged in user
tp.getUser().then((user) => {
    console.log('--------getUser--------')
    console.log(user.Id)
    console.log('----------------')

    // get user with ID
    tp.getUser(user.Id).then((user) => {
        console.log('--------getUser--------')
        console.log(user.Id)
        console.log('----------------')
    });
});



