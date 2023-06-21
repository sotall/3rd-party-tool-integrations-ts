import * as constants from './constants';
export declare const logStuff: (logType: (typeof constants.LogType)[number], msg: string, value?: unknown) => void;
export declare const joinString: (tags: string | Array<string>) => string;
export declare const isDuplicateId: (id: number, existingIds: Array<number>) => boolean;
