import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js'; 
import chatRoutes from './routes/chatRoutes.js'; // <-- FIXED: Added this missing import statement!

dotenv.config();
connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

// --- Mount API Routes Here ---
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/orders', orderRoutes); 
app.use('/api/chat', chatRoutes); // <-- Now this will run perfectly without crashing!

// --- Send PayPal Client ID to Frontend ---
app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'ShopVerse API is running perfectly!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = app;