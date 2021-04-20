
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

/**
* Checks if properties match.
* 
* @param {Object} obj1 the object to match against.
* @param {...string} obj2 the object to check.
* @returns {boolean} true if obj2 has all the properties of obj1, false otherwise.
*/
module.exports.checkPropertiesMatch = (obj, ...properties) => {
   let propsMatch = true;
   for (const prop of properties) {
       // for each property, check if the property exists.
       if (!(prop in obj)) {
           propsMatch = false;
       }
   }
   //propsMatch = false;
   return propsMatch;
};