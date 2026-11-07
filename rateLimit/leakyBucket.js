const rateLimiters = {
    // ip: {
    //     queue: [next],
    //     processing: bool
    // }
}

const leakyBucket = (req, res, next) => {
    // const now = Date.now();
    const ip = req.socket.remoteAddress;
    const capasity = 5; // bucket hold
    const leakRate = 2 * 1000;

    if (!rateLimiters[ip]) {
        rateLimiters[ip] = {
            queue: [next],
            processing: false
        }
    }
    let queue = rateLimiters[ip].queue;
    if (queue.length >= capasity)
        return res.end(JSON.stringify({
            err: "Limit is reached"
        }));
    const processing = rateLimiters[ip].processing;
    queue.push(() => next());

    if (!processing)
        processQueue(leakRate, ip);

}
const processQueue = (leakRate, ip) => {

    rateLimiters[ip].processing = true;
    const jop = rateLimiters[ip].queue.shift();

    if (!jop) {
        rateLimiters[ip].processing = false;
        return;
    }

    jop(); // allow the req
    setTimeout(() => processQueue(leakRate, ip), leakRate);
}

export { leakyBucket };

// Leaky Bucket without Waiting
// const leakyBucket = (req, res, next) => {
//     const now = Date.now();
//     const ip = req.socket.remoteAddress;
//     const capasity = 5; // bucket hold
//     const leakRate = 1 * 1000; // 1 sec per req

//     if(!rateLimiters[ip]) {
//         rateLimiters[ip] = {
//             queue: 1,
//             lastCheck: now
//         }

//         return next();
//     }

//     const elapsedTime = now - rateLimiters[ip].lastCheck;
//     rateLimiters[ip].queue = Math.max(0, rateLimiters[ip].queue - Math.floor(elapsedTime / leakRate));
//     rateLimiters[ip].lastCheck = now;
//     if(rateLimiters[ip].queue >= capasity) {
//         return res.end(JSON.stringify({
//             err: "Limit is reached"
//         }));
//     }
//     rateLimiters[ip].queue++;
//     return next();
// }
