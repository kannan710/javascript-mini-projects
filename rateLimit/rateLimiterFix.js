const rateLimiters = {
    // ip: {
    //     count: Number,
    //     time: time
    // }
}
const rateLimiterFixedWindow = (req, res, next) => {
    const now = Date.now();
    const ip = req.socket.remoteAddress;
    const timeInterval = 1000 * 10; // 5 seconds
    const count = 3;

    if (!rateLimiters[ip]) {
        rateLimiters[ip] = {
            count: 1,
            time: Date.now()
        };

        return next();
    }
    let elapsedTime = now - rateLimiters[ip].time;
    if (timeInterval > elapsedTime) {
        if (rateLimiters[ip].count <= count) {
            rateLimiters[ip].count += 1;
            return next();
        }
        else {
            return res.end(JSON.stringify({
                err: "Limit is reached"
            }));
        }
    }
    else {
        rateLimiters[ip].count = 1;
        rateLimiters[ip].time = now;
    }
    return next();
}

export { rateLimiterFixedWindow };