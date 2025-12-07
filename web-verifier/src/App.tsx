import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Verifier from './pages/Verifier';
import Proof from './pages/Proof';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background text-white selection:bg-primary/20">
                <header className="p-6 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse" />
                            <h1 className="text-xl font-bold tracking-tight">AM i REAL</h1>
                        </div>
                        <nav className="text-sm font-medium text-white/50 space-x-4">
                            <a href="/" className="hover:text-white transition-colors">Verify</a>
                            <a href="#" className="hover:text-white transition-colors">Download App</a>
                        </nav>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<Verifier />} />
                        <Route path="/p/:contentId" element={<Proof />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
