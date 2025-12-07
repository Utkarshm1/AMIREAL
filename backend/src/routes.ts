import express from 'express';
import crypto from 'crypto';
import db from './database';
import { verifySignature } from './services/crypto';
import { computePHash } from './services/phash';
import { verifyMedia } from './services/verification';

export const router = express.Router();

// --- User & Device Management ---

router.post('/register-user', (req, res) => {
    const { email, password } = req.body;
    // Stub: Create user
    try {
        const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
        const info = stmt.run(email, 'hash_' + password);
        res.json({ user_id: info.lastInsertRowid, email });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

router.post('/register-device', (req, res) => {
    const { user_id, public_key, model, device_id } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO devices (id, user_id, public_key, model) VALUES (?, ?, ?, ?)');
        stmt.run(device_id, user_id, public_key, model);
        res.json({ status: 'registered', device_id });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

// --- Content Ledger (Mobile App) ---

router.post('/content/secure', (req, res) => {
    const {
        content_id,
        content_hash,
        phash,
        device_id,
        timestamp,
        origin_signature,
        media_type
    } = req.body;

    // 1. Verify Device exists and fetch Public Key
    const dev = db.prepare('SELECT public_key, revoked FROM devices WHERE id = ?').get(device_id) as any;
    if (!dev) return res.status(404).json({ error: 'Device not found' });
    if (dev.revoked) return res.status(403).json({ error: 'Device revoked' });

    // 2. Verify Signature
    // Signed message expected: content_hash + timestamp + device_id
    const msg = content_hash + timestamp + device_id;
    const isValid = verifySignature(dev.public_key, msg, origin_signature);

    if (!isValid) return res.status(401).json({ error: 'Invalid signature' });

    // 3. Store in Ledger
    try {
        const stmt = db.prepare(`
      INSERT INTO contents (content_id, content_hash, phash, device_id, device_signature, timestamp, media_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(content_id, content_hash, phash, device_id, origin_signature, timestamp, media_type || 'ORIGINAL');
        res.json({ status: 'secured', content_id });
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

// --- Verification (Web Verifier) ---

// Expects JSON with base64 encoded image for simplicity in this scaffold
// { image_data: "base64..." }
router.post('/verify-media', async (req, res) => {
    const { image_data } = req.body; // Base64 string
    if (!image_data) return res.status(400).json({ error: 'No image data provided' });

    try {
        const buffer = Buffer.from(image_data.replace(/^data:image\/\w+;base64,/, ""), 'base64');

        // 1. Compute Hash (SHA-256)
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');

        // 2. Compute pHash
        const pHash = await computePHash(buffer);

        // 3. Verify
        const result = verifyMedia(hash, pHash);

        res.json(result);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: 'Verification failed processing' });
    }
});

// Get public proof info
router.get('/content/:id', (req, res) => {
    const row = db.prepare('SELECT content_id, timestamp, device_id, trust_level, media_type FROM contents WHERE content_id = ?').get(req.params.id);
    if (row) res.json(row);
    else res.status(404).json({ error: 'Not found' });
});
