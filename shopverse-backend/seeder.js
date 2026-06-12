import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js'; 
import { products } from './data/products.js';

dotenv.config();
connectDB(); 

const importData = async () => {
  try {
    // 1. Clear out ONLY products (your previous users are completely untouched!)
    await Product.deleteMany(); 
    console.log('🧹 Database product collection cleared...');

    // 2. Locate any pre-existing Admin profile in your actual database
    let adminUser = await User.findOne({ isAdmin: true });

    // 💡 If no admin profile exists yet in MongoDB, create one automatically
    if (!adminUser) {
      console.log('👑 No admin detected. Creating a default master admin profile...');
      adminUser = await User.create({
        name: 'Admin Master',
        email: 'admin@shopverse.com',
        password: 'securepassword123', // Your Mongoose model hashes this automatically on .create()
        isAdmin: true,
      });
    }

    // 3. Map your 50 products using your model's required 'title' schema key
    const sampleProducts = products.map((p) => {
      let cleanCategory = p.category;
      if (p.category === 'Gaming') cleanCategory = 'Games';
      if (p.category === 'Home') cleanCategory = 'Home Decor';
      if (p.category === 'Fashion') cleanCategory = 'Mens Fashion';

      return { 
        title: p.title,
        price: p.price,
        image: p.image,
        category: cleanCategory,
        brand: p.brand,
        description: p.description,
        countInStock: p.countInStock,
        sizes: p.sizes || [],
        colors: p.colors || [],
        featured: p.featured || false,
        rating: p.rating || 4.5, 
        numReviews: p.numReviews || 0, 
        user: adminUser._id 
      };
    });

    // 4. Load the collection cleanly into MongoDB
    await Product.insertMany(sampleProducts);
    console.log('🚀 All 50 Premium Products Seeded! All previous customer logins are safe.');
    
    process.exit(); 
  } catch (error) {
    console.error(`❌ Data Seeding Interruption: ${error.message}`);
    process.exit(1); 
  }
};

importData();