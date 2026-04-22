import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import queueRoutes from './routes/queueRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

const app = express();

const allowedOrigins = process.env.ALLOW_ORIGINS
    ? process.env.ALLOW_ORIGINS.split(',').map(o => o.trim())
    : ['https://queue-indol-phi.vercel.app', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Working...');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/queue', queueRoutes);

export default app;
