/**
 * Converts minutes to milliseconds
 * @param {string | number} minutes string in the form of "15m" or number representing minutes.
 * @returns {number} number in milliseconds.
 */
const minutesToMillis = (minutes) => {
    // if param is "15m", strip m and convert to number.
    let parsedMinutes;
    if (typeof(minutes) === 'string' && minutes.endsWith('m')) {
        parsedMinutes = parseInt(minutes.replace('m', ''));
    } else {
        parsedMinutes = minutes;
    }
    return parsedMinutes * 60 * 1000;
};

/**
 * Converts days to milliseconds.
 * @param {string | number} days string in the form of "15d" or number.
 * @returns {number} number in milliseconds.
 */
const daysToMillis = (days) => {
    // param may be in the form of "15d".
    let parsedDays;
    if (typeof(days) === 'string' && days.endsWith('d')) {
        parsedDays = parseInt(days.replace('d', ''));
    } else {
        parsedDays = days;
    }
    let hours = parsedDays * 24;
    let minutes = hours * 60;
    let milliseconds = minutesToMillis(minutes);
    return milliseconds;
};

const stringToMillis = (str) => {
    let parsed;
    if (typeof(str) === 'string') {
        if (str.endsWith('d')) {
            parsed = module.exports.daysToMillis(str);
        } else if (str.endsWith('m')) {
            parsed = module.exports.minutesToMillis(str);
        }
    } else {
        parsed = Number(str);
    }
    return parsed;
};

module.exports = {minutesToMillis, daysToMillis, stringToMillis};