import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
      {
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        // 👇 Change this line to 'product' 👇
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, update_time: String, email_address: String },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },

    // Phase 1: Admin payment verification (held until confirmed)
    isConfirmed: { type: Boolean, required: true, default: false },
    confirmedAt: { type: Date },

    // Phase 2: Dispatch / logistics tracking
    isDispatched: { type: Boolean, required: true, default: false },
    dispatchedAt: { type: Date },
    trackingNumber: { type: String },
    estimatedDelivery: { type: String },

    // Phase 3: Final delivery gateway
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);


const Order = mongoose.model('Order', orderSchema);
export default Order;