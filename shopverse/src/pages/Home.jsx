import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiClock, FiArrowRight,
  FiLoader, FiTruck, FiShield, FiRefreshCw, FiHeadphones,
  FiZap, FiAward, FiStar, FiTrendingUp
} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';

/* ─── DATA ────────────────────────────────────────────────── */

const heroSlides = [
  {
    id: 1,
    title: "The Future of Tech",
    titleAccent: "is Here.",
    subtitle: "Discover the next-gen Smart Watch with advanced health tracking and AI-powered insights.",
    buttonText: "Shop Wearables",
    badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop",
    bgClass: "bg-blue-900",
    accentColor: "#6366f1",
  },
  {
    id: 2,
    title: "Premium Sound.",
    titleAccent: "Zero Noise.",
    subtitle: "Immerse yourself in high-fidelity audio with our top-rated noise-cancelling headphones.",
    buttonText: "Shop Audio",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop",
    bgClass: "bg-gray-900",
    accentColor: "#818cf8",
  },
  {
    id: 3,
    title: "Capture Every",
    titleAccent: "Moment.",
    subtitle: "Professional-grade mirrorless cameras for creators, storytellers, and enthusiasts.",
    buttonText: "Explore Cameras",
    badge: "Editor's Pick",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
    bgClass: "bg-stone-900",
    accentColor: "#a5b4fc",
  }
];

const trustFeatures = [
  { Icon: FiTruck,      title: "Free Shipping",   subtitle: "On orders over $100"  },
  { Icon: FiShield,     title: "Secure Checkout", subtitle: "256-bit SSL encryption" },
  { Icon: FiRefreshCw,  title: "30-Day Returns",  subtitle: "No questions asked"   },
  { Icon: FiHeadphones, title: "24/7 Support",    subtitle: "Always here for you"  },
];

const categories = [
  { name: "Electronics",  Icon: FiZap,       count: "124 items", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",  color: "from-blue-700/80 to-indigo-800/90"   },
  { name: "Accessories",  Icon: FiAward,     count: "89 items",  image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80",  color: "from-violet-700/80 to-purple-800/90" },
  { name: "Fashion",      Icon: FiStar,      count: "213 items", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",      color: "from-rose-700/80 to-pink-800/90"     },
  { name: "Home & Decor", Icon: FiTrendingUp,count: "67 items",  image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",  color: "from-emerald-700/80 to-teal-800/90"  },
];

/* ─── ANIMATION VARIANTS ──────────────────────────────────── */

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }
  })
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

/* ─── COMPONENT ───────────────────────────────────────────── */

export default function Home() {
  const [featuredProducts, setFeaturedProducts]  = useState([]);
  const [isLoading, setIsLoading]                = useState(true);
  const [currentSlide, setCurrentSlide]          = useState(0);
  const [timeLeft, setTimeLeft]                  = useState({ hours: 14, minutes: 32, seconds: 59 });
  const timerRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 500], [0, 70]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.55]);

  /* fetch featured */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        if (res.ok) setFeaturedProducts(data.products ? data.products.slice(0, 4) : data.slice(0, 4));
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    })();
  }, []);

  /* hero auto-advance */
  const startSlideTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() =>
      setCurrentSlide(p => (p === heroSlides.length - 1 ? 0 : p + 1)), 5000);
  };
  useEffect(() => { startSlideTimer(); return () => clearInterval(timerRef.current); }, []);

  /* countdown */
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(p => {
      let { hours: h, minutes: m, seconds: s } = p;
      if (s > 0) s--; else { s = 59; if (m > 0) m--; else { m = 59; if (h > 0) h--; } }
      return { hours: h, minutes: m, seconds: s };
    }), 1000);
    return () => clearInterval(id);
  }, []);

  const goNext = () => { setCurrentSlide(p => (p === heroSlides.length - 1 ? 0 : p + 1)); startSlideTimer(); };
  const goPrev = () => { setCurrentSlide(p => (p === 0 ? heroSlides.length - 1 : p - 1)); startSlideTimer(); };

  const slide = heroSlides[currentSlide];

  return (
    <div className="w-full pb-16 overflow-hidden">

      {/* ══ 1. HERO CAROUSEL ══════════════════════════════════ */}
      <section
        className="relative w-full h-[520px] md:h-[600px] lg:h-[680px] overflow-hidden"
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={startSlideTimer}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 ${slide.bgClass}`}
          >
            {/* parallax bg image */}
            <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-40" />
            </motion.div>

            {/* gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* accent orb */}
            <motion.div
              className="absolute right-1/4 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none"
              style={{ background: slide.accentColor, opacity: 0.18 }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.14, 0.22, 0.14] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* text content */}
            <div className="relative container mx-auto px-6 lg:px-14 h-full flex items-center">
              <div className="max-w-xl text-white">

                <motion.span
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-5 text-[11px] font-bold uppercase tracking-widest rounded-full"
                  style={{ background: slide.accentColor + "28", color: slide.accentColor, border: `1px solid ${slide.accentColor}50` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: slide.accentColor }} />
                  {slide.badge}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl md:text-7xl font-black leading-none tracking-tight"
                >
                  {slide.title}
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-5"
                  style={{ color: slide.accentColor }}
                >
                  {slide.titleAccent}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-md"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <Link
                    to="/products"
                    className="group inline-flex items-center gap-2.5 bg-white text-gray-900 hover:bg-indigo-50 font-bold py-3.5 px-8 rounded-full shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {slide.buttonText}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/products" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                    All collections →
                  </Link>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* arrows */}
        <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white rounded-full hidden md:flex items-center justify-center transition-all hover:scale-110 border border-white/20 z-10">
          <FiChevronLeft size={20} />
        </button>
        <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white rounded-full hidden md:flex items-center justify-center transition-all hover:scale-110 border border-white/20 z-10">
          <FiChevronRight size={20} />
        </button>

        {/* dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => { setCurrentSlide(i); startSlideTimer(); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-indigo-400' : 'w-1.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
        <div className="absolute bottom-6 right-6 text-white/40 text-xs font-mono hidden md:block z-10">
          {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </div>
      </section>

      {/* ══ 2. TRUST BAR ══════════════════════════════════════ */}
      <motion.section
        variants={fadeIn} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="container mx-auto px-4 mt-8 relative z-20"
      >
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-2 lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
            {trustFeatures.map(({ Icon, title, subtitle }, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="group flex items-center gap-3 p-5 md:p-6 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-colors rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={17} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══ 3. FLASH SALE ═════════════════════════════════════ */}
      <motion.section
        variants={fadeIn} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="container mx-auto px-4 mt-10"
      >
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-rose-700 shadow-xl">
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
          <div className="relative px-7 py-6 md:px-10 md:py-7 flex flex-col md:flex-row items-center justify-between gap-6 text-white">

            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
              <div className="flex items-center gap-4">
                <div className="relative p-3 bg-white/15 rounded-xl border border-white/20">
                  <FiClock size={26} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-200">Limited Time</p>
                  <h2 className="text-xl md:text-2xl font-black">Flash Sale — Ends In</h2>
                  <p className="text-red-200 text-xs mt-0.5">Up to 40% off selected electronics</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[{ v: timeLeft.hours, l: "HRS" }, { v: timeLeft.minutes, l: "MIN" }, { v: timeLeft.seconds, l: "SEC" }].map(({ v, l }, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <AnimatePresence mode="popLayout">
                        <motion.div key={v}
                          initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="w-13 h-13 w-[52px] h-[52px] bg-white text-red-600 rounded-xl flex items-center justify-center text-xl font-black shadow-md tabular-nums"
                        >
                          {v.toString().padStart(2, '0')}
                        </motion.div>
                      </AnimatePresence>
                      <span className="text-[9px] uppercase font-extrabold mt-1 tracking-widest text-red-200">{l}</span>
                    </div>
                    {i < 2 && <span className="text-lg font-black opacity-50 self-start mt-2">:</span>}
                  </div>
                ))}
              </div>
            </div>

            <Link to="/products"
              className="group inline-flex items-center gap-2.5 bg-white text-red-600 hover:bg-red-50 font-black py-3 px-7 rounded-full shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm">
              Shop Deals <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ══ 4. SHOP BY CATEGORY ═══════════════════════════════ */}
      <motion.section
        variants={fadeIn} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="container mx-auto px-4 mt-14"
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">Browse</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Shop by Category</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm">
            All <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(({ name, Icon, count, image, color }, i) => (
            <motion.div key={name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Link to={`/products?category=${name}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-400 hover:-translate-y-1">
                <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${color} transition-opacity`} />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <Icon size={16} className="mb-1.5 opacity-75" />
                  <h3 className="font-extrabold text-base leading-tight">{name}</h3>
                  <p className="text-[11px] opacity-60 mt-0.5">{count}</p>
                </div>
                <div className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiArrowRight size={13} className="text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══ 5. TRENDING PRODUCTS (Featured Grid) ═════════════ */}
      <motion.section
        variants={fadeIn} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="container mx-auto px-4 mt-14"
      >
        <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4 border-b border-gray-200 dark:border-dark-border pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">Curated for You</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Trending Right Now</h2>
          </div>
          <Link to="/products" className="group flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-sm">
            View all products <FiArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><FiLoader className="animate-spin text-4xl text-indigo-600" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product, i) => (
              <motion.div key={product._id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ══ 6. HIGHEST RATED CAROUSEL ═════════════════════════ */}
      <motion.section
        variants={fadeIn} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="container mx-auto px-4 mt-14"
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">Top Picks</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Highest Rated</h2>
          </div>
        </div>
        <ProductCarousel />
      </motion.section>

      {/* ══ 7. PROMO BANNER ═══════════════════════════════════ */}
      <motion.section
        variants={fadeIn} initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="container mx-auto px-4 mt-14"
      >
        <div className="relative rounded-2xl overflow-hidden bg-gray-950 dark:bg-slate-900">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 15% 50%, #3730a3 0%, transparent 65%), radial-gradient(ellipse 50% 60% at 85% 50%, #1e1b4b 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative flex flex-col md:flex-row items-center gap-8 px-8 md:px-14 py-12">
            <div className="flex-1 text-white">
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-3">Member Exclusive</p>
              <h2 className="text-3xl md:text-4xl font-black leading-tight mb-3">
                New Members Get<br />
                <span className="text-indigo-400">20% Off</span> First Order
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Create a free account and unlock exclusive discounts, early access to drops, and priority support.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Link to="/register"
                className="inline-flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-10 rounded-full shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap">
                Create Free Account
              </Link>
              <Link to="/products"
                className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Continue browsing →
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

    </div>
  );
}