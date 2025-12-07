import { ec as EC } from 'elliptic';
import crypto from 'crypto';

const ec = new EC('p256'); // Standard NIST P-256

// Verify a signature
// devicePublicKey: hex string of the public key
// data: string or buffer to verify
// signature: hex string of the signature
export function verifySignature(devicePublicKey: string, data: string, signature: string): boolean {
    try {
        const key = ec.keyFromPublic(devicePublicKey, 'hex');
        const msgHash = crypto.createHash('sha256').update(data).digest();
        return key.verify(msgHash, signature);
    } catch (e) {
        console.error("Signature verification error:", e);
        return false;
    }
}

export function generateKeyPair() {
    const key = ec.genKeyPair();
    return {
        publicKey: key.getPublic('hex'),
        privateKey: key.getPrivate('hex')
    };
}
