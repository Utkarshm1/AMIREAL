import { hammingDistance } from './phash';
import db from '../database';

// Thresholds
const EXACT_MATCH_THRESHOLD = 0;
const SIMILAR_MATCH_THRESHOLD = 10; // Allow small Hamming distance for compression

interface VerificationResult {
    status: 'VERIFIED_ORIGINAL' | 'VERIFIED_DERIVED' | 'UNVERIFIED';
    trust_score: number;
    reason_codes: string[];
    content_id?: string;
    media_type?: string;
    details?: string;
}

export function verifyMedia(contentHash: string, pHash: string): VerificationResult {
    const result: VerificationResult = {
        status: 'UNVERIFIED',
        trust_score: 0,
        reason_codes: [],
    };

    // 1. Try Exact Content Hash Match
    const stmtExact = db.prepare('SELECT * FROM contents WHERE content_hash = ?');
    const exactMatch = stmtExact.get(contentHash) as any;

    if (exactMatch) {
        result.status = 'VERIFIED_ORIGINAL';
        result.trust_score = 100;
        result.reason_codes.push('hash_match_exact');
        result.content_id = exactMatch.content_id;
        result.media_type = 'ORIGINAL_CAPTURE';
        result.details = `Exact match found for content captured on ${exactMatch.timestamp}`;
        return result;
    }

    // 2. Try Perceptual Hash Match (Simulated Linear Scan for demo - use VP-Tree in prod)
    // Fetch all phashes (optimization: verifyMedia is distinct from creating it)
    const stmtAll = db.prepare('SELECT content_id, phash, timestamp FROM contents');
    const allContents = stmtAll.all() as any[];

    let bestMatch = null;
    let minDistance = Infinity;

    for (const c of allContents) {
        const dist = hammingDistance(pHash, c.phash);
        if (dist < minDistance) {
            minDistance = dist;
            bestMatch = c;
        }
    }

    if (bestMatch && minDistance <= SIMILAR_MATCH_THRESHOLD) {
        result.status = 'VERIFIED_DERIVED';
        // rudimentary scoring
        result.trust_score = Math.max(0, 90 - (minDistance * 5));
        result.reason_codes.push('phash_near_match');
        result.content_id = bestMatch.content_id;
        result.media_type = 'EDITED_OR_COMPRESSED';
        result.details = `Visual match found (Distance: ${minDistance}) with content from ${bestMatch.timestamp}`;
        return result;
    }

    result.reason_codes.push('no_match_found');
    result.details = "No matching origin certificate found.";
    return result;
}
