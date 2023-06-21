import * as constants from './constants';

export const logStuff = (logType: typeof constants.LogType[number], msg: string, value?: unknown): void => {
  if (value) {
    console.log(`${logType}: ${msg} - ${JSON.stringify(value)}`);
  } else {
    console.log(`${logType}: ${msg}`);
  }
};

export const joinString = (tags: string | Array<string>): string => {
  if (Array.isArray(tags)) {
    return tags.join(',');
  }
  return tags;
};

// check if we have any duplicate IDs
export const isDuplicateId = (id: number, existingIds: Array<number>): boolean => {
  if (existingIds.includes(id)) {
    return true;
  } else {
    existingIds.push(id);
    return false;
  }
};