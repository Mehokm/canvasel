function Ease() {}

Ease.inQuad = function(t, b, c, d) {
    t /= d;
    return c * t * t + b;
}

Ease.outQuad = function(t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
}

Ease.inOutQuad = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

Ease.inCubic = function(t, b, c, d) {
    t /= d;
    return c * t * t * t + b;
}

Ease.outCubic = function(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
}

Ease.inOutCubic = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
}

Ease.inQuart = function(t, b, c, d) {
    t /= d;
    return c * t * t * t * t + b;
}

Ease.outQuart = function(t, b, c, d) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
}

Ease.inOutQuart = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t * t + b;
    t -= 2;
    return -c / 2 * (t * t * t * t - 2) + b;
}

Ease.inQuint = function(t, b, c, d) {
    t /= d;
    return c * t * t * t * t * t + b;
}

Ease.outQuint = function(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t * t * t + 1) + b;
}

Ease.inOutQuint = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t * t * t + 2) + b;
}

Ease.inSine = function(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}

Ease.outSine = function(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

Ease.inOutSine = function(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}

Ease.inExpo = function(t, b, c, d) {
    return c * Math.pow(2, 10 * (t / d - 1)) + b;
}

Ease.outExpo = function(t, b, c, d) {
    return c * (-Math.pow(2, -10 * t / d) + 1) + b;
}

Ease.inOutExpo = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    t--;
    return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
}

Ease.inCirc = function(t, b, c, d) {
    t /= d;
    return -c * (Math.sqrt(1 - t * t) - 1) + b;
}

Ease.outCirc = function(t, b, c, d) {
    t /= d;
    t--;
    return c * Math.sqrt(1 - t * t) + b;
}

Ease.inOutCirc = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    t -= 2;
    return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
}