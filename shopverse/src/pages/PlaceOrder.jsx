import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import toast from 'react-hot-toast';
import { FiPackage, FiTruck, FiCreditCard, FiLoader } from 'react-icons/fi';

export default function PlaceOrder() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);

  // 1. Math: Calculate Prices
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

  const itemsPrice = addDecimals(cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0));
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10); // Free shipping over $100
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2))); // 15% Tax
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  // 2. Security: If they missed a step, send them back
  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

 const placeOrderHandler = async () => {
  setIsLoading(true);
  try {
    // ✅ Validation: Check cart has items
    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      setIsLoading(false);
      return;
    }

    // ✅ Validation: Check user is authenticated
    if (!auth.user || !auth.user.token) {
      toast.error('Please login to place an order');
      navigate('/login');
      setIsLoading(false);
      return;
    }

    const orderData = {
      // 👇 Map it to 'product' so it matches Mongoose 👇
      orderItems: cart.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id || item.id, // Safely grabs the ID!
      })),
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };

    // 🕵️ DEBUGGING MAGIC: This will print the data in your browser console!
    console.log("Sending this to the backend:", orderData);
    console.log("Auth token:", auth.user.token);

    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.user.token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok && data._id) {
      toast.success('Order placed successfully! 🎉');
      dispatch(clearCart());
      navigate(`/dashboard/orders/${data._id}`);
    } else {
      const errorMsg = data.message || 'Failed to place order';
      console.error('Order Error Response:', data);
      toast.error(errorMsg);
    }
  } catch (err) {
    console.error("Network/Order Error:", err);
    toast.error(err.message || 'Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="container mx-auto px-4 py-12">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Left Side: Order Details */}
        <div className="lg:w-2/3 space-y-6">
          {/* Shipping Info */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2"><FiTruck /> Shipping</h2>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Address: </strong> 
              {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2"><FiCreditCard /> Payment Method</h2>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Method: </strong> {cart.paymentMethod}
            </p>
          </div>

          {/* Cart Items Review */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2"><FiPackage /> Order Items</h2>
            {cart.items.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <Link to={`/products/${item._id}`} className="hover:text-primary-600 font-medium dark:text-gray-200">
                        {item.title}
                      </Link>
                    </div>
                    <div className="text-right dark:text-gray-300">
                      {item.quantity} x ${item.price} = <span className="font-bold">${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border sticky top-24">
            <h2 className="text-2xl font-bold dark:text-white mb-6 border-b border-gray-100 dark:border-dark-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between dark:text-gray-300">
                <span>Items Subtotal</span>
                <span>${itemsPrice}</span>
              </div>
              <div className="flex justify-between dark:text-gray-300">
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </div>
              <div className="flex justify-between dark:text-gray-300">
                <span>Estimated Tax</span>
                <span>${taxPrice}</span>
              </div>
              <hr className="border-gray-100 dark:border-dark-border" />
              <div className="flex justify-between text-xl font-extrabold dark:text-white">
                <span>Total</span>
                <span className="text-primary-600">${totalPrice}</span>
              </div>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={cart.items.length === 0 || isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <FiLoader className="animate-spin" /> : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}