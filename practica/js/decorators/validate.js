//@ts-check
// Patrón: Decorator

/**
 * Adds isString validation to the given host object.
 * @param {Object} hostInstance
 */
export function addStringValidation(hostInstance) {
  // @ts-ignore
  hostInstance.validate = {
    // @ts-ignore
    ...hostInstance.validate,
    isString
  }
}

/**
 * Validates if the given field value is a valid string.
 * @param {any} fieldValue The value to validate.
 * @param {string} fieldName The name of the field to validate.
 * @returns {boolean} True if the value is a valid string, false otherwise.
 */
function isString(fieldValue, fieldName) {
  if (typeof fieldValue === 'string') {
    return true
  } else {
    try {
      throw new TypeError(`${fieldName} must be a valid text string`)
    } catch (err) {
      const typedError = /** @type {Error} */(err)
      console.error(typedError.name, typedError.message)
      if (err instanceof TypeError) console.log(err.stack)
    }
    return false
  }
}