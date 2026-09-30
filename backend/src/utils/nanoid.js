const crypto = require('crypto');

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a URL-safe random ID without external dependencies.
 * @param {number} size - Length of the ID
 */
function nanoid(size = 8) {
  const bytes = crypto.randomBytes(size);
  return Array.from(bytes)
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join('');
}

module.exports = { nanoid };
