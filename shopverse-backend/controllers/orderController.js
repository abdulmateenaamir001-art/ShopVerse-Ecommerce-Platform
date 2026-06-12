import Order from '../models/Order.js';
import Stripe from 'stripe';
import sendEmail from '../utils/sendEmail.js';
import { PassThrough } from 'stream'; // <-- ADD THIS IMPORT AT THE VERY TOP OF YOUR CONTROLLER
import { generateInvoicePDF } from '../utils/generateInvoice.js'; // <-- ADD THIS UTILITY IMPORT AS WELL


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated. Please login.' });
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing shipping address or payment method' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('❌ Order Creation Error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Fetch Order Error:", error.message);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email');

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.created ? String(req.body.created) : String(Date.now()),
        email_address: req.body.receipt_email || order.user.email,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Database Update Error:", error.message);
    res.status(500).json({ message: 'Server error updating payment' });
  }
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/orders/:id/stripe
// @access  Private
export const createStripePaymentIntent = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const amountInCents = Math.round(order.totalPrice * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        metadata: { order_id: order._id.toString() }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ message: 'Server error generating Stripe intent' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Fetch My Orders Error:", error.message);
    res.status(500).json({ message: 'Server error fetching your orders' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// @desc    Admin confirm payment verification & trigger REAL email
// @route   PUT /api/orders/:id/confirm
// @access  Private/Admin

export const confirmOrderPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order payment not completed yet' });
    }

    if (order.isConfirmed) {
      return res.json(order);
    }

    // 💡 AUTOMATED INVENTORY AUTO-DECREMENT SYSTEM
    // Import the Product model dynamically to avoid any circular dependency compilation errors
    const { default: Product } = await import('../models/Product.js');

    // Loop through each item present inside the user's purchased order items array
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product || item._id);

      if (product) {
        const purchaseQty = item.qty || item.quantity || 1;
        
        // Subtract the purchased quantity from the database countInStock pool
        product.countInStock = Math.max(0, product.countInStock - purchaseQty); // Math.max prevents stock from going below 0
        
        await product.save();
        console.log(`📦 [Inventory Sync] Subtracted ${purchaseQty} from "${product.name}". New Stock: ${product.countInStock}`);
      } else {
        console.warn(`⚠️ [Inventory Warning] Product ID ${item.product} not found in database catalog.`);
      }
    }

    // Set the lifecycle confirmations parameters
    order.isConfirmed = true;
    order.confirmedAt = Date.now();

    const updatedOrder = await order.save();

    // ==== 🚀 LIVE IN-MEMORY PDF STREAM GENERATION & SMTP TRANSMISSION ====
    try {
      const orderShortId = order._id.toString().substring(0, 8).toUpperCase();
      const { address, city, postalCode, country } = order.shippingAddress || {};

      const pdfStream = new PassThrough();
      const buffers = [];
      
      pdfStream.on('data', (chunk) => buffers.push(chunk));
      pdfStream.on('end', async () => {
        const pdfBuffer = Buffer.concat(buffers);

        await sendEmail({
          email: order.user.email, 
          subject: `ShopVerse Order Confirmed & Receipt: #${orderShortId}`,
          message: `Hello ${order.user.name}, your transaction invoice is attached!`,
          htmlMessage: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #10b981; margin-top: 0;">Payment Verified Successfully! ✓</h2>
              <p>Hello <strong>${order.user.name}</strong>,</p>
              <p>Our team has settled your payment data. Your purchase receipt has been automatically compiled and attached below as a downloadable PDF document for your records.</p>
              
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0; font-size: 13px;"><strong>Order Reference:</strong> #${orderShortId}</p>
                <p style="margin: 5px 0; font-size: 13px;"><strong>Delivery To:</strong> ${address || 'N/A'}, ${city || 'N/A'}</p>
                <p style="margin: 5px 0; font-size: 14px; color: #4f46e5; font-weight: bold;"><strong>Total Paid:</strong> $${order.totalPrice.toFixed(2)}</p>
              </div>
              <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">Your invoice file can be downloaded instantly via the email attachments portal clip above.</p>
            </div>
          `,
          attachments: [
            {
              filename: `ShopVerse_Invoice_INV-${orderShortId}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf'
            }
          ]
        });
        console.log(`📡 [ShopVerse SMTP] Invoice PDF compiled and dispatched to: ${order.user.email}`);
      });

      generateInvoicePDF(order, pdfStream);

    } catch (mailError) {
      console.error('❌ Invoice Email Delivery System Failed:', mailError.message);
    }

    return res.json(updatedOrder);
  } catch (error) {
    console.error('Server error confirming payment:', error);
    return res.status(500).json({ message: 'Server error confirming order payment' });
  }
};

// @desc    Admin dispatch order + tracking
// @route   PUT /api/orders/:id/dispatch
// @access  Private/Admin
export const dispatchOrder = async (req, res) => {
  try {
    const { trackingNumber, estimatedDelivery } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!order.isPaid || !order.isConfirmed) {
      return res.status(400).json({ message: 'Order must be paid and confirmed before dispatch' });
    }

    if (!trackingNumber || !estimatedDelivery) {
      return res.status(400).json({ message: 'Missing tracking reference or delivery estimations' });
    }

    if (order.isDispatched) {
      return res.json(order);
    }

    order.isDispatched = true;
    order.dispatchedAt = Date.now();
    order.trackingNumber = trackingNumber;
    order.estimatedDelivery = estimatedDelivery;

    const updatedOrder = await order.save();

    try {
      await sendEmail({
        email: order.user.email,
        subject: `Your ShopVerse Package Has Been Shipped! 🚚`,
        message: `Hello ${order.user.name}, your package is in transit! ID: ${trackingNumber}`,
        htmlMessage: `
          <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #2563eb; margin-top: 0;">Your Package Is On Its Way! 🚚</h2>
            <p>Hello <strong>${order.user.name}</strong>,</p>
            <p>Our logistics hub has dispatched your container package to the shipping courier distribution center.</p>
            <div style="background-color: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 14px;">
              <p style="margin: 5px 0;"><strong>Carrier Tracking Reference:</strong> <span style="font-family: monospace; font-weight: bold; color: #1e40af;">${trackingNumber}</span></p>
              <p style="margin: 5px 0;"><strong>Estimated Arrival Window:</strong> <strong>${estimatedDelivery}</strong></p>
            </div>
            <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">Open your account history panel to view live courier tracking logistics routing parameters.</p>
          </div>
        `
      });
    } catch (mailError) {
      console.error('❌ Shipment Notification Failed:', mailError.message);
    }

    return res.json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Server error dispatching order' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!order.isPaid || !order.isConfirmed || !order.isDispatched) {
      return res.status(400).json({ message: 'Order must be paid, confirmed, and dispatched before delivery' });
    }

    if (order.isDelivered) {
      return res.json(order);
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    try {
      await sendEmail({
        email: order.user.email,
        subject: `Delivered: Your ShopVerse Package Has Arrived! 🎉`,
        message: `Your package has been successfully delivered.`,
        htmlMessage: `
          <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center;">
            <h1 style="color: #4f46e5; font-size: 40px; margin-bottom: 10px;">🎁</h1>
            <h2 style="color: #4f46e5; margin-top: 0;">Package Delivered!</h2>
            <p>Hello <strong>${order.user.name}</strong>,</p>
            <p>According to our courier telemetry indicators, your package was successfully dropped off at your destination tracking registry target address.</p>
            <p style="background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 10px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 14px; margin: 20px auto; max-w: 300px;">
              Status: Handed Over ✓
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 25px;">Thank you for shopping with ShopVerse marketplace services!</p>
          </div>
        `
      });
    } catch (mailError) {
      console.error('❌ Delivery Email System Failed:', mailError.message);
    }

    return res.json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating delivery status' });
  }
};

// @desc    Get dashboard metrics summary data
// @route   GET /api/orders/summary
// @access  Private/Admin
export const getAdminSummary = async (req, res) => {
  try {
    const totalSalesData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = totalSalesData.length > 0 ? totalSalesData[0].totalRevenue : 0;
    const numOrders = await Order.countDocuments();

    const { default: Product } = await import('../models/Product.js');
    const { default: User } = await import('../models/User.js');

    const numUsers = await User.countDocuments();
    const numProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lte: 5 } });

    res.status(200).json({
      totalRevenue,
      numOrders,
      numUsers,
      numProducts,
     lowStockCount: lowStockProducts,
    });
  } catch (error) {
    console.error('Error fetching admin summary stats:', error);
    res.status(500).json({ message: 'Server error generating summary matrix data' });
  }
};