import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProof } from '../lib/api';
import { Loader2, ShieldCheck, Calendar, Smartphone } from 'lucide-react';

export default function Proof() {
    const { contentId } = useParams();
    const [proof, setProof] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contentId) return;
        getProof(contentId)
            .then(setProof)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [contentId]);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;
    if (error) return <div className="text-center py-20 text-danger">Error: {error}</div>;
    if (!proof) return <div className="text-center py-20">No proof found.</div>;

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="bg-surface border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-verified/20 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-verified" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Verified Original</h1>
                            <p className="text-slate-400 font-mono text-sm mt-1">{proof.content_id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-background/50 p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3 mb-2 text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">Capture Time</span>
                            </div>
                            <p className="text-xl font-semibold text-white">
                                {new Date(proof.timestamp).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-background/50 p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3 mb-2 text-slate-400">
                                <Smartphone className="w-4 h-4" />
                                <span className="text-sm font-medium">Device ID</span>
                            </div>
                            <p className="text-xl font-semibold text-white font-mono truncate">
                                {proof.device_id}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 bg-verified/10 p-6 rounded-2xl border border-verified/20">
                        <h3 className="text-verified font-semibold mb-2">Cryptographic Proof</h3>
                        <p className="text-verified/80 text-sm leading-relaxed">
                            This content was digitally signed by the device's Secure Enclave at the moment of capture.
                            The signature has been verified against the device's registered public key.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
