/* ======================================================
AI EVENT BUS
Allows AI engines to communicate using events
====================================================== */

const listeners = {};

/* ====================================
REGISTER EVENT LISTENER
==================================== */

export function subscribe(event, handler){

if(!listeners[event]){
listeners[event] = [];
}

listeners[event].push(handler);

}

/* ====================================
EMIT EVENT
==================================== */

export async function emit(event, payload){

const handlers = listeners[event];

if(!handlers || handlers.length === 0){
return;
}

console.log("📡 AI Event:",event);

for(const handler of handlers){


try{

  await handler(payload);

}
catch(err){

  console.error(
    "AI Event handler error:",
    err.message
  );

}

}

}
