module.exports.hourRange = (lower, upper) => {
    let range = [];
    for (let i = lower; i < upper; i++) {
        range.push(i);
    }
    return range;
}