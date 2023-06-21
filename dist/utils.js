"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDuplicateId = exports.joinString = exports.logStuff = void 0;
const logStuff = (logType, msg, value) => {
    if (value) {
        console.log(`${logType}: ${msg} - ${JSON.stringify(value)}`);
    }
    else {
        console.log(`${logType}: ${msg}`);
    }
};
exports.logStuff = logStuff;
const joinString = (tags) => {
    if (Array.isArray(tags)) {
        return tags.join(',');
    }
    return tags;
};
exports.joinString = joinString;
// check if we have any duplicate IDs
const isDuplicateId = (id, existingIds) => {
    if (existingIds.includes(id)) {
        return true;
    }
    else {
        existingIds.push(id);
        return false;
    }
};
exports.isDuplicateId = isDuplicateId;
