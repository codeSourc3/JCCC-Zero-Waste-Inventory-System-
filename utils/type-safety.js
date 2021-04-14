
module.exports.isNumber = (value) => {
    return typeof(value) === 'number';
};

module.exports.isString = (value) => {
    return typeof(value) === 'string';
};

module.exports.isBoolean = (value) => {
    return typeof(value) === 'boolean';
};

module.exports.requireNonNull = (value, message) => {
    if (typeof(value) === 'undefined' || value === null) {
        throw new Error(message);
    }
};

module.exports.isNullOrUndefined = (value) => {
    return typeof(value) === 'undefined' || value === null
};

module.exports.hasProperty = (obj, property) => {
    return property in obj;
};

/**
 * 
 * @param {Object} obj 
 * @param  {...string} properties 
 * @returns 
 */
module.exports.hasProperties = (obj, ...properties) => {
    return properties.every(value => value in obj);
};