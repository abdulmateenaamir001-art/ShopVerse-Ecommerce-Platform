import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiBox, FiTruck, FiCreditCard, FiLoader, FiAlertCircle, FiCheckCircle, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

// --- NEW: Stripe Imports ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// 1. Initialize Stripe (You will replace this with your real public key later)
const stripePromise = loadStripe('pk_test_51TXULOHpXBniDV5loubrthVScY7bSTRH89LnjKjwJmlsy7yPaKjGlJRA4ilVLW2C8giq8clMhBRzSqBrdEch0sxc006Jf3ptjg');

// ------------------------------------------------------------------
// COMPONENT A: The Actual Credit Card Form
// ------------------------------------------------------------------
const CheckoutForm = ({ orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const auth = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}/pay`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.user.token}`,
          },
          body: JSON.stringify(paymentIntent),
        });

        if (response.ok) {
          toast.success('Payment Successful!');
          onSuccess(); 
        } else {
          toast.error('Payment succeeded, but failed to update database.');
        }
      } catch (err) {
        toast.error('Network Error during database update.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="p-4 bg-white dark:bg-dark-bg rounded-xl border border-gray-200 dark:border-gray-700">
        <PaymentElement />
      </div>
      <button 
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? <FiLoader className="animate-spin" /> : <><FiLock /> Pay Now</>}
      </button>
    </form>
  );
};

// ------------------------------------------------------------------
// COMPONENT B: The Main Order Details Page
// ------------------------------------------------------------------
export default function OrderDetails() {
  const { id } = useParams();
  const auth = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${auth.user.token}` },
      });
      const data = await response.json();
      if (response.ok) setOrder(data);
      else setError(data.message);
    } catch (err) {
      setError('Failed to fetch order details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, auth.user.token]);

  // --- Admin: Confirm Order Payment ---
  const confirmOrderHandler = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${order._id}/confirm`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Order payment confirmed!');
        fetchOrder();
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || 'Failed to confirm order payment.');
      }
    } catch (err) {
      toast.error('Network Error during confirmation update.');
    }
  };

  // --- Admin: Dispatch Order ---
  const dispatchOrderHandler = async (trackingNum, estimatedDeliveryValue) => {
    try {
      const payload = {
        trackingNumber: trackingNum,
        estimatedDelivery: estimatedDeliveryValue || 'TBD',
      };

      const response = await fetch(`http://localhost:5000/api/orders/${order._id}/dispatch`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Order dispatched!');
        fetchOrder();
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || 'Failed to dispatch order.');
      }
    } catch (err) {
      toast.error('Network Error during dispatch update.');
    }
  };

  // --- Admin: Mark Delivery ---
  const deliverOrderHandler = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${order._id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${auth.user.token}`,
        },
      });

      if (response.ok) {
        toast.success('Order Marked as Delivered!');
        fetchOrder();
      } else {
        toast.error('Failed to deliver order.');
      }
    } catch (err) {
      toast.error('Network Error during delivery update.');
    }
  };

  // --- Fetch the Stripe Secret Token from your Backend ---
  useEffect(() => {
    const getStripeToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${id}/stripe`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${auth.user.token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error("Failed to fetch Stripe token", err);
      }
    };

    if (order && !order.isPaid) {
      getStripeToken();
    }
  }, [order, id, auth.user.token]);

  if (isLoading) return <div className="py-20 text-center"><FiLoader className="animate-spin text-5xl mx-auto text-primary-600" /></div>;
  if (error) return <div className="py-20 text-center text-red-500 font-bold text-2xl">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Order {order._id}</h1>
      <p className="text-gray-500 mb-8">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Order Info */}
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2"><FiTruck /> Shipping</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              <strong>Name: </strong> {order.user.name} <br />
              <strong>Email: </strong> {order.user.email} <br />
              <strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>

            {/* Tracking Step Progress (Paid → Confirmed → Dispatched → Delivered) */}
            {auth.user ? (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4 border border-gray-100 dark:border-dark-border">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Order Tracking</span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Live status</span>
                  </div>

                  {/* Steps */}
                  <div className="grid grid-cols-4 gap-3">
                    {/* Step 1: Paid */}
                    <div className="text-center">
                      <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center border-2 ${order.isPaid ? 'bg-green-600 border-green-600 text-white' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-400'}`}>
                        {order.isPaid ? <FiCheckCircle /> : <FiLoader className="animate-spin" />}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-200">Paid</p>
                    </div>

                    {/* connectors */}
                    <div className="hidden sm:block col-span-1">
                      <div className={`h-1 mt-5 ${order.isPaid ? 'bg-green-600' : 'bg-gray-200 dark:bg-dark-border'}`}></div>
                    </div>

                    {/* Step 2: Confirmed */}
                    <div className="text-center col-start-2">
                      <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center border-2 ${order.isConfirmed ? 'bg-green-600 border-green-600 text-white' : (order.isPaid ? 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-400' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-400')}`}>
                        {order.isConfirmed ? <FiCheckCircle /> : <FiLock />}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-200">Confirmed</p>
                    </div>

                    <div className="hidden sm:block col-span-1">
                      <div className={`h-1 mt-5 ${order.isConfirmed ? 'bg-green-600' : (order.isPaid ? 'bg-gray-300 dark:bg-dark-border' : 'bg-gray-200 dark:bg-dark-border')}`}></div>
                    </div>

                    {/* Step 3: Dispatched */}
                    <div className="text-center col-start-3">
                      <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center border-2 ${order.isDispatched ? 'bg-green-600 border-green-600 text-white' : (order.isConfirmed ? 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-400' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-400')}`}>
                        {order.isDispatched ? <FiCheckCircle /> : <FiTruck />}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-200">Dispatched</p>
                    </div>

                    <div className="hidden sm:block col-span-1">
                      <div className={`h-1 mt-5 ${order.isDispatched ? 'bg-green-600' : 'bg-gray-200 dark:bg-dark-border'}`}></div>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="text-center col-start-4">
                      <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center border-2 ${order.isDelivered ? 'bg-green-600 border-green-600 text-white' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-400'}`}>
                        {order.isDelivered ? <FiCheckCircle /> : <FiAlertCircle />}
                      </div>
                      <p className="mt-2 text-xs font-semibold text-gray-700 dark:text-gray-200">Delivered</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    {order.isDispatched && (
                      <div className="space-y-1">
                        <div><span className="font-bold">Tracking #:</span> {order.trackingNumber}</div>
                        <div><span className="font-bold">Estimated delivery:</span> {order.estimatedDelivery}</div>
                      </div>
                    )}
                    {!order.isDispatched && (
                      <div className="text-gray-500 dark:text-gray-400">Tracking will appear once your order is dispatched.</div>
                    )}
                  </div>
                </div>

                {order.isDelivered ? (
                  <div className="bg-green-100 text-green-800 p-4 rounded-xl flex items-center gap-2 font-bold">
                    <FiCheckCircle /> Delivered
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-bold">
                    <FiAlertCircle /> Not Delivered Yet
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">Sign in to track your order.</div>
            )}
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2"><FiCreditCard /> Payment Method</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              <strong>Method: </strong> Stripe (Credit/Debit Card)
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-xl flex items-center gap-2 font-bold"><FiCheckCircle /> Paid on {new Date(order.paidAt).toLocaleDateString()}</div>
            ) : (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-bold"><FiAlertCircle /> Not Paid</div>
            )}
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold dark:text-white mb-4 flex items-center gap-2"><FiBox /> Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 dark:border-dark-border pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                    <Link to={`/products/${item.product}`} className="hover:text-primary-600 font-medium dark:text-gray-200">{item.title}</Link>
                  </div>
                  <div className="text-right dark:text-gray-300">
                    {item.quantity} x ${item.price} = <span className="font-bold">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary, STRIPE & ADMIN BUTTON */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border sticky top-24">
            <h2 className="text-2xl font-bold dark:text-white mb-6 border-b border-gray-100 dark:border-dark-border pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between dark:text-gray-300"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between dark:text-gray-300"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between dark:text-gray-300"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
              <hr className="border-gray-100 dark:border-dark-border" />
              <div className="flex justify-between text-xl font-extrabold dark:text-white mb-6">
                <span>Total</span>
                <span className="text-primary-600">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Render Stripe Payment Box (Only if NOT paid) */}
            {!order.isPaid && (
              <div className="mt-4 border-t border-gray-100 dark:border-dark-border pt-4">
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm orderId={order._id} onSuccess={fetchOrder} />
                  </Elements>
                ) : (
                  <div className="flex justify-center py-4 text-gray-500">
                    <FiLoader className="animate-spin text-2xl mr-2 text-indigo-600" /> Securely connecting to Stripe...
                  </div>
                )}
              </div>
            )}

            {/* ================= ADMIN ACTION FULLFILLMENT MODULE ================= */}
            {auth.user && auth.user.isAdmin && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border space-y-4">
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider border-b pb-2">
                  Admin Fulfillment Panel
                </h3>

                {/* STEP 1: CONFIRM ORDER */}
                {order.isPaid && !order.isConfirmed && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      User payment received. Verify details and confirm order to clear it for the warehouse team.
                    </p>
                    <button
                      onClick={confirmOrderHandler}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
                    >
                      Confirm Order & Clear Payment
                    </button>
                  </div>
                )}

                {/* STEP 2: DISPATCH ORDER */}
                {order.isConfirmed && !order.isDispatched && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">
                      Order is cleared. Enter shipment tracking logistics before handing off the parcel to the courier hub.
                    </p>

                    <div>
                      <label
                        className="block text-[10px] font-bold text-gray-400 uppercase mb-1"
                        htmlFor="trackingInput"
                      >
                        Tracking Number / Courier ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. DHL-93821-PK"
                        id="trackingInput"
                        className="w-full px-3 py-2 text-xs border rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-dark-bg text-gray-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const trackingNum = document.getElementById('trackingInput')?.value || '';
                        if (!trackingNum.trim()) {
                          toast.error('Tracking number is required.');
                          return;
                        }
                        dispatchOrderHandler(trackingNum);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      🚚 Dispatch Package to Courier
                    </button>
                  </div>
                )}

                {/* STEP 3: MARK AS DELIVERED */}
                {order.isDispatched && !order.isDelivered && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      Parcel is currently in transit. Click below only when the courier service confirms arrival at destination address.
                    </p>
                    <button
                      onClick={deliverOrderHandler}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
                    >
                      Mark as Successfully Delivered
                    </button>
                  </div>
                )}

                {/* LIFECYCLE COMPLETED */}
                {order.isDelivered && (
                  <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl text-center">
                    <p className="text-xs font-bold text-gray-500">Order Lifecycle Complete ✓</p>
                  </div>
                )}
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}