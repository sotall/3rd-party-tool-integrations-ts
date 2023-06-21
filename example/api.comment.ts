import {TargetProcess} from "../src/target_process";
import key from '../key.json';
import {IComment, IGeneral} from "../src/target_process/interface";

const tp          = new TargetProcess(key.token);
const userStoryId = 522917;
const newComment  = {
    Description: 'Hello World!',
    General    : {Id: userStoryId} as IGeneral
} as IComment;

tp.addOrUpdateComment(newComment).then((comment) => {
    const commentId = comment.Id;
    tp.getComment(commentId).then((gComment) => {
        gComment.Description = '*UPDATE* Hello World!';
        tp.updateComment(commentId, gComment).then((uComment) => {
            tp.deleteComment(uComment.Id).then((dComment) => {
                console.log(dComment);
            })
        })
    })
})
