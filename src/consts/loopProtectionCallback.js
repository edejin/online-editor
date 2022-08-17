/**
 * @param lineNumber {number} Infinity loop line number
 */
/* eslint no-undef: off */
const line = lineNumber || 0;

/** Send notification to parent window */
window.infinityLoopError();
debugger;
throw new Error(`Bad loop on line ${line}`);