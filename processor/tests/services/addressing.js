'use strict'

const { createHash } = require('crypto')

const NAMESPACE = 'f4cb6d'
const PREFIXES = {
  // Entities.
  USERS: '00',
  COMPANY: '01',
  FIELD: '02',
  BATCH: '03',
  EVENT: '04',
  // Types.
  TASK_TYPE: '10',
  PRODUCT_TYPE: '11',
  EVENT_TYPE: '12',
  EVENT_PARAMETER_TYPE: '13'
}
const USER_PREFIXES = {
  SYSTEM_ADMIN: '20',
  COMPANY_ADMIN: '21',
  OPERATOR: '22',
  CERTIFIER: '23'
}

/*** Utilities ***/

/**
 * Return an object containing a concatenation of namespace and prefix for each ones.
 */
const FULL_PREFIXES = Object.keys(PREFIXES).reduce((prefixes, key) => {
  prefixes[key] = NAMESPACE + PREFIXES[key]
  return prefixes
}, {})

// Return a Buffer SHA-512 hash of a string or Buffer.
const sha512 = msg =>
  createHash('sha512')
    .update(msg)
    .digest('hex')

/*** Addressing ***/

/**
 * A function that takes a public key and returns the corresponding system admin
 * address.
 */
const getSystemAdminAddress = publicKey => {
  return (
    FULL_PREFIXES.USERS +
    USER_PREFIXES.SYSTEM_ADMIN +
    sha512(publicKey).slice(0, 60)
  )
}

/**
 * A function that takes a public key and returns the corresponding company admin
 * address.
 */
const getCompanyAdminAddress = publicKey => {
  return (
    FULL_PREFIXES.USERS +
    USER_PREFIXES.COMPANY_ADMIN +
    sha512(publicKey).slice(0, 60)
  )
}

/**
 * A function that takes a company identifier and a public key, returning the
 * corresponding operator address.
 */
const getOperatorAddress = (company, publicKey) => {
  return (
    FULL_PREFIXES.USERS +
    USER_PREFIXES.OPERATOR +
    sha512(company).slice(0, 16) +
    sha512(publicKey).slice(0, 44)
  )
}

/**
 * A function that takes an address and returns true or false depending on
 * whether or not it is a valid address. It should reject an address if:
 *   - it is not a string
 *   - it is not 70 hex characters
 *   - it does not start with the correct namespace
 */
const isValidAddress = address => {
  const regExp = `^${NAMESPACE}[0-9A-Fa-f]{64}$`
  return RegExp(regExp).test(address)
}

module.exports = {
  getSystemAdminAddress,
  getCompanyAdminAddress,
  getOperatorAddress,
  isValidAddress
}
