let rateLimiters = {
    // ip: {
    //     token: Number
    //     lastRefillTime: Time
    // }
}

const tokenBucket = (req, res, next) => {
    const now = Date.now();
    const ip = req.socket.remoteAddress;
    const refillInterval = 1000 * 1; // 1 second per token
    const bucketCapasity = 5; // 5 req at initial

    if(!rateLimiters[ip]) {
        rateLimiters[ip] = {
            token: bucketCapasity - 1,
            lastRefillTime: now
        }
        return next();
    }

    const elapsedTime = now - rateLimiters[ip].lastRefillTime;
    rateLimiters[ip].token = Math.min(bucketCapasity, rateLimiters[ip].token + (elapsedTime / refillInterval));

    rateLimiters[ip].lastRefillTime = now;
    if(rateLimiters[ip].token <= 0) {
        return res.end(JSON.stringify({
            err: "Limit is reached"
        }));
    }
    rateLimiters[ip].token--;
    return next();
}