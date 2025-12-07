const API_URL = 'http://localhost:3000/api';

export interface VerificationResult {
    status: 'VERIFIED_ORIGINAL' | 'VERIFIED_DERIVED' | 'UNVERIFIED';
    trust_score: number;
    reason_codes: string[];
    content_id?: string;
    media_type?: string;
    details?: string;
}

export async function verifyMedia(file: File): Promise<VerificationResult> {
    // Convert to Base64
    const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const res = await fetch(`${API_URL}/verify-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_data: base64 }),
    });

    if (!res.ok) throw new Error('Verification failed');
    return res.json();
}

export async function getProof(contentId: string) {
    const res = await fetch(`${API_URL}/content/${contentId}`);
    if (!res.ok) throw new Error('Proof not found');
    return res.json();
}
