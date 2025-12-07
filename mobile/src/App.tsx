import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';

// Mock Native Module Interface
const NativeMediaObserver = {
    addListener: (event: string, cb: any) => {
        // In real app, this connects to NativeEventEmitter
        console.log(`Listening for ${event}`);
    },
    scanNow: async () => {
        return [
            { id: '1', width: 4000, height: 3000, timestamp: Date.now() },
            { id: '2', width: 4000, height: 3000, timestamp: Date.now() - 10000 }
        ];
    },
    secureContent: async (id: string) => {
        return { status: 'secured', hash: 'abc...', signature: 'xyz...' };
    }
};

export default function App() {
    const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
    const [securedCount, setSecuredCount] = useState(128);

    useEffect(() => {
        // Simulate detecting new photos
        NativeMediaObserver.addListener('onNewCapture', (data: any) => {
            setPendingPhotos(prev => [...prev, data]);
        });

        // Initial scan
        NativeMediaObserver.scanNow().then(setPendingPhotos);
    }, []);

    const handleSecureAll = async () => {
        // In reality, this would iterate and call native secureContent
        // which does the hashing/signing in background
        setSecuredCount(prev => prev + pendingPhotos.length);
        setPendingPhotos([]);
        alert("All photos secured! Hashes sent to Ledger.");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>AM i REAL</Text>
                <Text style={styles.subtitle}>Mobile Verifier</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardLabel}>TRUST SCORE</Text>
                <Text style={styles.score}>100%</Text>
                <Text style={styles.stat}>{securedCount} Secured Originals</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending Verification</Text>
                {pendingPhotos.length === 0 ? (
                    <Text style={styles.empty}>No new photos detected.</Text>
                ) : (
                    <ScrollView horizontal style={styles.scroll}>
                        {pendingPhotos.map((p, i) => (
                            <View key={i} style={styles.thumb}>
                                <View style={styles.thumbPlaceholder} />
                                <Text style={styles.thumbText}>IMG_{i}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            {pendingPhotos.length > 0 && (
                <TouchableOpacity style={styles.button} onPress={handleSecureAll}>
                    <Text style={styles.buttonText}>Secure {pendingPhotos.length} Photos</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617', padding: 20, paddingTop: 60 },
    header: { marginBottom: 30 },
    title: { color: 'white', fontSize: 28, fontWeight: 'bold' },
    subtitle: { color: '#6366f1', fontSize: 16 },
    card: { backgroundColor: '#1e293b', padding: 20, borderRadius: 20, marginBottom: 30 },
    cardLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
    score: { color: '#22c55e', fontSize: 48, fontWeight: 'bold' },
    stat: { color: 'white', marginTop: 10 },
    section: { flex: 1 },
    sectionTitle: { color: 'white', fontSize: 18, marginBottom: 15, fontWeight: '600' },
    thumb: { marginRight: 15 },
    thumbPlaceholder: { width: 100, height: 100, backgroundColor: '#334155', borderRadius: 12, marginBottom: 5 },
    thumbText: { color: '#cbd5e1', fontSize: 12, textAlign: 'center' },
    empty: { color: '#64748b', fontStyle: 'italic' },
    button: { backgroundColor: '#06b6d4', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
    buttonText: { color: 'black', fontWeight: 'bold', fontSize: 16 },
    scroll: { maxHeight: 150 }
});
