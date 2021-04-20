
/**
 * Checks if properties match.
 * 
 * @param {Object} obj1 the object to match against.
 * @param {...string} obj2 the object to check.
 * @returns {boolean} true if obj2 has all the properties of obj1, false otherwise.
 */
 export const checkPropertiesMatch = (obj, ...properties) => {
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


export const checkAllMatch = (obj, properties) => {
    let propsMatch = true;
    for (const prop of properties) {
        if (!(prop in obj)) {
            propsMatch = false;
        }
    }

    return propsMatch;
};