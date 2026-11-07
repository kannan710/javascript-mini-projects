let rateLimitersLog = {
    // ip: Number,
    // time: [time]
}

let rateLimitersCou = {
    // ip: {
    //     currWinCou: Number,
    //     currWin: Date,
    //     preWinCou: Number
    // }
}

const rateLimiterSliLog = (req, res, next) => {
    const now = Date.now();
    const ip = req.socket.remoteAddress;
    const timeInterval = 1000 * 5; // 5 seconds
    const count = 2; // 5 req allowed

    if (!rateLimitersLog[ip]) {
        rateLimitersLog[ip] = {
            time: [now]
        }
        return next();
    }
    let i = 0;
    const timeStamps = rateLimitersLog[ip].time
    while (i < timeStamps.length && timeInterval < now - timeStamps[i]) {
        timeStamps.shift();
        i++;
    }
    if (count <= timeStamps.length)
        return res.end(JSON.stringify({
            err: "Limit is reached"
        }));
    timeStamps.push(now);
    return next();
}

const rateLimitersSliCou = (req, res, next) => {
    const now = Date.now();
    const ip = req.socket.remoteAddress;
    const timeInterval = 1000 * 5; // 5 seconds
    const count = 3; // req allowed

    if(!rateLimitersCou[ip]) {
        rateLimitersCou[ip] = {
            currWinCou: 1,
            currWin: now,
            preWinCou: 0
        }

        return next();
    }

    if(now - rateLimitersCou[ip].currWin >= timeInterval) {
        rateLimitersCou[ip].preWinCou = rateLimitersCou[ip].currWinCou;
        rateLimitersCou[ip].currWinCou = 1;
        rateLimitersCou[ip].currWin = now;

        return next();
    }
    const timeCurrWinOverLap = now - rateLimitersCou[ip].currWin;
    const overLap = timeCurrWinOverLap / timeInterval;
    const estimatedCount = (rateLimitersCou[ip].preWinCou * (1- overLap)) + rateLimitersCou[ip].currWinCou;

    if(estimatedCount >= count) {
        return res.end(JSON.stringify({
            err: "Limit is reached"
        }));
    }
    rateLimitersCou[ip].currWinCou++;
    return next();
}

export { rateLimiterSliLog, rateLimitersSliCou };