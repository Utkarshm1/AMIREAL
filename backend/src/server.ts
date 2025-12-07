import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initDb } from './database';
import { router } from './routes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Allow large image uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Init DB
try {
    initDb();
} catch (e) {
    console.error("Failed to init DB:", e);
}

// Routes
app.use('/api', router);

app.get('/', (req, res) => {
    res.send('AM i REAL Backend is running.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
