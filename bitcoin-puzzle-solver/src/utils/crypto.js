import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';

const ECPair = ECPairFactory(ecc);

/**
 * Convert decimal private key to hex format
 */
export function decimalToHex(decimal) {
  const bn = BigInt(decimal);
  return bn.toString(16).padStart(64, '0');
}

/**
 * Convert hex private key to decimal format
 */
export function hexToDecimal(hex) {
  return BigInt('0x' + hex).toString(10);
}

/**
 * Convert private key to WIF format
 */
export function privateKeyToWIF(privateKeyHex, compressed = true) {
  try {
    const keyPair = ECPair.fromPrivateKey(
      Buffer.from(privateKeyHex, 'hex'),
      { compressed }
    );
    return keyPair.toWIF();
  } catch (error) {
    console.error('Error converting to WIF:', error);
    return null;
  }
}

/**
 * Convert WIF to hex private key
 */
export function wifToHex(wif) {
  try {
    const keyPair = ECPair.fromWIF(wif);
    return keyPair.privateKey.toString('hex');
  } catch (error) {
    console.error('Error converting from WIF:', error);
    return null;
  }
}

/**
 * Convert decimal to binary string
 */
export function decimalToBinary(decimal) {
  return BigInt(decimal).toString(2);
}

/**
 * Convert binary to decimal
 */
export function binaryToDecimal(binary) {
  return BigInt('0b' + binary).toString(10);
}

/**
 * Generate Bitcoin address from private key
 */
export function privateKeyToAddress(privateKeyHex, compressed = true) {
  try {
    const keyPair = ECPair.fromPrivateKey(
      Buffer.from(privateKeyHex, 'hex'),
      { compressed }
    );
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
    });
    return address;
  } catch (error) {
    console.error('Error generating address:', error);
    return null;
  }
}

/**
 * Get public key from private key
 */
export function privateKeyToPublicKey(privateKeyHex, compressed = true) {
  try {
    const keyPair = ECPair.fromPrivateKey(
      Buffer.from(privateKeyHex, 'hex'),
      { compressed }
    );
    return keyPair.publicKey.toString('hex');
  } catch (error) {
    console.error('Error generating public key:', error);
    return null;
  }
}

/**
 * Validate private key format
 */
export function validatePrivateKey(key, format = 'hex') {
  try {
    if (format === 'hex') {
      if (!/^[0-9a-fA-F]{64}$/.test(key)) return false;
      const bn = BigInt('0x' + key);
      return bn > 0n && bn < BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
    } else if (format === 'decimal') {
      const bn = BigInt(key);
      return bn > 0n && bn < BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
    } else if (format === 'wif') {
      ECPair.fromWIF(key);
      return true;
    } else if (format === 'binary') {
      if (!/^[01]+$/.test(key)) return false;
      const bn = BigInt('0b' + key);
      return bn > 0n && bn < BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Convert between any key formats
 */
export function convertKey(key, fromFormat, toFormat) {
  try {
    let hex;
    
    // Convert to hex first
    if (fromFormat === 'hex') {
      hex = key;
    } else if (fromFormat === 'decimal') {
      hex = decimalToHex(key);
    } else if (fromFormat === 'wif') {
      hex = wifToHex(key);
    } else if (fromFormat === 'binary') {
      const decimal = binaryToDecimal(key);
      hex = decimalToHex(decimal);
    }
    
    if (!hex) return null;
    
    // Convert from hex to target format
    if (toFormat === 'hex') {
      return hex;
    } else if (toFormat === 'decimal') {
      return hexToDecimal(hex);
    } else if (toFormat === 'wif') {
      return privateKeyToWIF(hex);
    } else if (toFormat === 'binary') {
      const decimal = hexToDecimal(hex);
      return decimalToBinary(decimal);
    }
    
    return null;
  } catch (error) {
    console.error('Error converting key:', error);
    return null;
  }
}
