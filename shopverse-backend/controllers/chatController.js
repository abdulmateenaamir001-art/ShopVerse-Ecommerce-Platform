import OpenAI from 'openai';
import Product from '../models/Product.js';

export const handleChat = async (req, res) => {
  const { messages } = req.body; 

  try {
const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1', // <-- FIX: Must be 'openai', NOT 'openapi'
    });

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: 'Chatbot configuration credentials missing.' });
    }

    // 1. Fetch title, price, category, and our brand new countInStock field!
    const liveProducts = await Product.find({}).select('title price category countInStock');

    // 2. Build a highly detailed inventory layout context for the AI
    const inventorySummary = liveProducts
      .map(p => {
        let stockStatus = `${p.countInStock} items available`;
        if (p.countInStock === 0) stockStatus = 'OUT OF STOCK';
        else if (p.countInStock <= 3) stockStatus = 'LOW STOCK - RUNNING OUT FAST';

        return `- [${p.category}] ${p.title}: $${p.price} (${stockStatus})`;
      })
      .join('\n');

    const systemPrompt = `You are "VerseBot", the ultra-professional, friendly AI concierge for the ShopVerse premium mega-marketplace.
  
CURRENT USER CONTEXT:
- Logged In: ${req.user ? 'Yes' : 'No'}
- User Name: ${req.user ? req.user.name : 'Guest Customer'}

LIVE STORE DEPARTMENTS & INVENTORY METRICS:
${inventorySummary || 'No items available at this second.'}

CRITICAL BUSINESS INTELLIGENCE RULES:
1. Stock Context: If an item is labeled 'OUT OF STOCK', apologize politely and suggest a similar item from the same category.
2. Low Stock Urgency: If an item is labeled 'LOW STOCK', subtly encourage the customer to checkout quickly before it sells out.
3. Category Navigation: If a customer searches broad departments like "Men's clothes", "Fragrances", "Desk setups", or "Toys", look up the matching category values ('Mens Fashion', 'Perfumes', 'Home Decor', 'Games', 'Kids') and present options.
4. Professionalism: Keep your answers brief, informative, and beautifully styled with clear bullet points.`;

    const chatPayload = [{ role: 'system', content: systemPrompt }, ...messages];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', 
      messages: chatPayload,
    });

    res.json({ message: completion.choices[0].message.content });

  } catch (error) {
    console.error("Cloud Chatbot API Error:", error);
    res.status(500).json({ message: 'Chatbot service temporarily unavailable.' });
  }
};