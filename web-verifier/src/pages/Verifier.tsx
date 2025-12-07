import { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertTriangle, XCircle, Loader2, ShieldCheck, FileImage } from 'lucide-react';
import { verifyMedia, VerificationResult } from '../lib/api';

export default function Verifier() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = async (e: any) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            await handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setLoading(true);
        setResult(null);
        try {
            const res = await verifyMedia(file);
            setResult(res);
        } catch (err) {
            console.error(err);
            alert("Verification failed. Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-12 max-w-2xl px-4">
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary mb-6">
                    Is it Real?
                </h2>
                <p className="text-lg text-slate-400">
                    Verify the authenticity of any media file instantly.
                    AM i REAL uses cryptographic provenance to separate reality from fiction.
                </p>
            </div>

            <div
                className={`
          relative w-full max-w-xl aspect-video rounded-3xl border-2 border-dashed 
          flex flex-col items-center justify-center transition-all duration-300
          ${dragActive ? 'border-primary bg-primary/10 scale-105' : 'border-white/10 hover:border-white/20 bg-white/5'}
          cursor-pointer overflow-hidden
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept="image/*"
                />

                {loading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <span className="text-slate-400 font-medium tracking-wide">Analyzing Provenance...</span>
                    </div>
                ) : !result ? (
                    <div className="flex flex-col items-center gap-4 pointer-events-none">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center backdrop-blur-sm shadow-xl">
                            <Upload className="w-10 h-10 text-white/70" />
                        </div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-lg">Drop your image here</p>
                            <p className="text-slate-500 text-sm mt-1">or click to browse</p>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
                        {result.status === 'VERIFIED_ORIGINAL' && <ShieldCheck className="w-20 h-20 text-verified mb-4" />}
                        {result.status === 'VERIFIED_DERIVED' && <CheckCircle className="w-20 h-20 text-warning mb-4" />}
                        {result.status === 'UNVERIFIED' && <XCircle className="w-20 h-20 text-danger mb-4" />}

                        <h3 className="text-2xl font-bold mb-2">
                            {result.status === 'VERIFIED_ORIGINAL' && <span className="text-verified">Verified Original</span>}
                            {result.status === 'VERIFIED_DERIVED' && <span className="text-warning">Verified Derived</span>}
                            {result.status === 'UNVERIFIED' && <span className="text-danger">Unverified</span>}
                        </h3>

                        <p className="text-slate-400 mb-6 max-w-sm">{result.details}</p>

                        {result.trust_score > 0 && (
                            <div className="w-full max-w-xs bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${result.trust_score > 80 ? 'bg-verified' : 'bg-warning'}`}
                                    style={{ width: `${result.trust_score}%` }}
                                />
                            </div>
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setResult(null);
                            }}
                            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                        >
                            Check Another
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-4">
                <Feature
                    icon={<FileImage className="w-6 h-6 text-primary" />}
                    title="Content Integrity"
                    desc="Checks cryptographic hashes against a secure ledger."
                />
                <Feature
                    icon={<ShieldCheck className="w-6 h-6 text-secondary" />}
                    title="Trusted Devices"
                    desc="Verifies signature from registered hardware security modules."
                />
                <Feature
                    icon={<CheckCircle className="w-6 h-6 text-verified" />}
                    title="Traceable Origin"
                    desc="See exactly when and where the content was captured."
                />
            </div>
        </div>
    );
}

function Feature({ icon, title, desc }: any) {
    return (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="mb-4">{icon}</div>
            <h4 className="font-semibold text-white mb-2">{title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}
