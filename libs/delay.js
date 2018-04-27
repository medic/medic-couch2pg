const log = require('./log');

let errorCount = 0;

const delayLoop = (errored, sleepMs) => {
  return new Promise(resolve => {
    const ms = sleepTime(errored, sleepMs);
    log.info('Run '+(errored ? 'errored' : 'complete') + '. Next run at ' + new Date(new Date().getTime() + ms));
    if (ms === 0) {
      resolve();
    } else {
      setTimeout(resolve, ms);
    }
  });
};

const sleepTime = (errored, sleepMs) => {
  if (errored) {
    var backoffMs = ++errorCount * 1000 * 60;
    return Math.min(backoffMs, sleepMs);
  } else {
    errorCount = 0;
  }
  return sleepMs;
};

module.exports = {
  delayLoop: delayLoop
};
