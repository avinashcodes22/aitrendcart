const failureState = {};

/* ====================================
   TRACK AI FAILURE
==================================== */

export async function trackAIFailure(engine){

  const now = Date.now();

  if(!failureState[engine]){
    failureState[engine] = [];
  }

  failureState[engine].push(now);

  /* remove failures older than 60 sec */

  failureState[engine] =
    failureState[engine].filter(
      t => now - t < 60000
    );

  const count = failureState[engine].length;

  console.log(`⚠ ${engine} failure count: ${count}`);

  return count;

}

/* ====================================
   SHOULD ENGINE PAUSE
==================================== */

export function shouldPauseEngine(engine){

  const failures = failureState[engine] || [];

  return failures.length >= 5;

}

/* ====================================
   RESET ENGINE FAILURES
==================================== */

export function resetEngine(engine){

  failureState[engine] = [];

}