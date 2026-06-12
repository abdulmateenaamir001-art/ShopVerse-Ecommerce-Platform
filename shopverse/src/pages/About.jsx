import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiGlobe, FiTrendingUp, FiArrowRight, FiShield, FiStar, FiZap, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// ── DATA ────────────────────────────────────────────────────────────────────
const timeline = [
  { year: "2024", cat: "milestone", title: "The vision", desc: "ShopVerse launched from a small apartment with one conviction: e-commerce deserved to feel elegant, not cluttered." },
  { year: "2024 Q3", cat: "product", title: "Frictionless checkout", desc: "Our one-tap checkout reduced average purchase time by 40%, delighting early adopters worldwide." },
  { year: "2025 Q1", cat: "milestone", title: "Red Dot Design Award", desc: "Recognized internationally for setting a new standard in e-commerce UX and interface design." },
  { year: "2025 Q3", cat: "impact", title: "Carbon neutral commitment", desc: "Every package shipped is now 100% carbon-neutral, driven by a fully overhauled sustainable supply chain." },
  { year: "2026 Q1", cat: "product", title: "AI curation engine", desc: "Our ML-powered discovery system launched, increasing average basket size by 28% on day one." },
  { year: "2026", cat: "milestone", title: "1 million customers", desc: "Crossed the seven-figure milestone — each one a passionate ambassador for the ShopVerse experience." },
];

const reviews = [
  { name: "Priya S.", loc: "London, UK", init: "PS", bg: "bg-purple-100 dark:bg-purple-900/30", tc: "text-purple-700 dark:text-purple-300", stars: 5, text: "The packaging alone won me over. Everything arrived beautifully presented, and the product quality is genuinely exceptional.", tag: "Verified purchase" },
  { name: "Carlos M.", loc: "Madrid, ES", init: "CM", bg: "bg-blue-100 dark:bg-blue-900/30", tc: "text-blue-700 dark:text-blue-300", stars: 5, text: "Checkout was unbelievably fast. The one-tap system works flawlessly. Already ordered three times this month.", tag: "Returning customer" },
  { name: "Yuki T.", loc: "Tokyo, JP", init: "YT", bg: "bg-green-100 dark:bg-green-900/30", tc: "text-green-700 dark:text-green-300", stars: 4, text: "Great curation — you can tell a human thought about every product. The biodegradable box was a lovely touch.", tag: "Eco-conscious" },
  { name: "David C.", loc: "New York, US", init: "DC", bg: "bg-indigo-100 dark:bg-indigo-900/30", tc: "text-indigo-700 dark:text-indigo-300", stars: 5, text: "The AI recommendations nailed my taste on the very first try. A genuinely impressive discovery experience.", tag: "Power shopper" },
];

const ratingBars = [[5, 82], [4, 12], [3, 4], [2, 1], [1, 1]];

// ── SUB-COMPONENTS & HOOKS ──────────────────────────────────────────────────

function Stars({ count, size = 14 }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar key={i} size={size} className={i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
      ))}
    </span>
  );
}

// Custom Hook for Animated Numbers
function useCounter(target, active, suffix = "", divisor = 1) {
  const [val, setVal] = useState("0");
  useEffect(() => {
    if (!active) return;
    const dur = 1400, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const v = Math.round(p * target / divisor);
      setVal(v + suffix);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, divisor, suffix]);
  return val;
}

// Animated Interactive Canvas Background
function HeroCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init();
    }

    function init() {
      const W = canvas.width, H = canvas.height;
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        o: Math.random() * 0.55 + 0.2,
        c: Math.random() > 0.5 ? "167,139,250" : "129,140,248",
      }));
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0f172a"; // Tailwind slate-900
      ctx.fillRect(0, 0, W, H);

      const g1 = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.6);
      g1.addColorStop(0, "rgba(79, 70, 229, 0.3)"); // Indigo-600
      g1.addColorStop(1, "rgba(15, 23, 42, 0)");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 95) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(167,139,250,${0.12 * (1 - d / 95)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });
      animId = requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function About() {
  const [tlFilter, setTlFilter] = useState("all");
  const filteredTl = timeline.filter(t => tlFilter === "all" || t.cat === tlFilter);

  const [statsInView, setStatsInView] = useState(false);
  const customers = useCounter(1000000, statsInView, "M+", 1000000);
  const awards = useCounter(15, statsInView, "+", 1);
  const products = useCounter(50000, statsInView, "K+", 1000);
  const carbon = useCounter(100, statsInView, "%", 1);

  return (
    <div className="w-full pb-24 overflow-hidden bg-gray-50 dark:bg-dark-bg">

      {/* ── HERO CANVAS ── */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <HeroCanvas />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <span className="px-5 py-2 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest rounded-full mb-6 inline-block border border-indigo-500/20 backdrop-blur-md">
              The ShopVerse Story
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              We don't just sell. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">We curate.</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Building tomorrow's e-commerce — sustainable, thoughtful, and beautifully designed from the ground up.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl -mt-16 relative z-20">
        
        {/* ── ANIMATED STATS ROW ── */}
        <motion.div 
          onViewportEnter={() => setStatsInView(true)}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: "👥", val: customers, label: "Happy Customers" },
            { icon: "🏆", val: awards, label: "Design Awards" },
            { icon: "📦", val: products, label: "Products Curated" },
            { icon: "🌿", val: carbon, label: "Carbon Neutral" }
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.val}</div>
              <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── PREMIUM BENTO BOX GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-24">
          {/* Card 1: Brand/Award Image Focus */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:col-span-2 lg:col-span-3 bg-indigo-600 rounded-3xl overflow-hidden relative shadow-xl group h-[300px]">
             <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 mix-blend-overlay" alt="Team" />
             <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent p-8 flex flex-col justify-end">
               <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-4"><FiAward size={24} /></div>
               <h3 className="text-2xl font-extrabold text-white mb-2">Red Dot Design Award</h3>
               <p className="text-indigo-100 font-medium">Recognized globally for setting the new standard in user experience.</p>
             </div>
          </motion.div>

          {/* Card 2: Security & Authenticity */}
      {/* Card 2: Security & Authenticity */}
{/* Card 2: Security & Authenticity */}
<motion.div 
  variants={fadeUp} 
  initial="hidden" 
  whileInView="visible" 
  viewport={{ once: true }} 
  className="md:col-span-2 lg:col-span-3 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-3xl overflow-hidden relative shadow-xl group h-[300px]"
>
  {/* The Background Image - High clarity, crisp presentation */}
  <img 
    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop" 
    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 dark:opacity-20 absolute inset-0 pointer-events-none" 
    alt="Authenticity Certification" 
  />

  {/* Premium Gradient Overlay - Keeps text super readable without washing out the image */}
  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-dark-card dark:via-dark-card/80 dark:to-transparent z-0" />

  {/* Content Layer */}
  <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm">
      <FiShield size={24} />
    </div>
    
    <div>
      <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
        100%
      </h3>
      <p className="text-gray-700 dark:text-gray-300 font-bold text-sm leading-relaxed max-w-[90%]">
        Authenticated products from verified brand partners only.
      </p>
    </div>
  </div>
</motion.div>
          {/* Card 3: Logistics Image Focus */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:col-span-4 lg:col-span-6 bg-gray-900 rounded-3xl overflow-hidden relative shadow-xl group h-[300px]">
            <img src="https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-luminosity" alt="Logistics" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent p-8 md:p-12 flex flex-col justify-center max-w-2xl">
               <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm"><FiTruck size={24} /></div>
               <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Next-Gen Logistics</h3>
               <p className="text-gray-300 text-lg">Automated warehouses and AI routing ensure your order arrives 3x faster than the industry average, with zero carbon footprint.</p>
            </div>
          </motion.div>
        </div>

        {/* ── FILTERABLE TIMELINE ── */}
        <div className="max-w-3xl mx-auto mb-32">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-gray-500 dark:text-gray-400">We didn't just build a store. We built an ecosystem.</p>
          </div>

          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {["all", "milestone", "product", "impact"].map(f => (
              <button key={f} onClick={() => setTlFilter(f)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${tlFilter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-dark-card text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 md:ml-8">
            <AnimatePresence mode="popLayout">
              {filteredTl.map((item, i) => (
                <motion.div 
                  key={item.year + item.title}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                  className="relative pl-8 md:pl-12 pb-12"
                >
                  <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-dark-bg" />
                  <div className="text-indigo-600 dark:text-indigo-400 font-black text-sm tracking-widest mb-1">{item.year}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <div className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase rounded-full mb-3">
                      {item.cat}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── REVIEWS & RATING BARS ── */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">What Customers Say</h2>
            <p className="text-gray-500 dark:text-gray-400">Real reviews from our community of 1M+ shoppers.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Rating Summary Block */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full lg:w-1/3 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-3xl p-8 shadow-sm h-fit">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                <div className="text-6xl font-black text-gray-900 dark:text-white">4.9</div>
                <div>
                  <Stars count={5} size={20} />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">1,248 verified reviews</p>
                </div>
              </div>
              <div className="space-y-4">
                {ratingBars.map(([stars, pct], i) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500 w-4">{stars}</span>
                    <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-yellow-400 rounded-full" />
                    </div>
                    <span className="text-sm font-bold text-gray-500 w-10 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Review Cards Grid */}
            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${r.bg} ${r.tc}`}>
                      {r.init}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{r.name}</div>
                      <div className="text-xs text-gray-500">{r.loc}</div>
                    </div>
                  </div>
                  <Stars count={r.stars} />
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 leading-relaxed line-clamp-3">"{r.text}"</p>
                  <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{r.tag}</span>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">✓ Verified</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA WITH WORKING REACT ROUTER LINK ── */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to experience the difference?</h2>
            <p className="text-indigo-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have upgraded their lifestyle with ShopVerse.
            </p>
            {/* FIXED: Replaced standard <button> with proper React Router <Link> */}
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-indigo-900 hover:bg-gray-50 hover:-translate-y-1 px-10 py-4 rounded-full font-extrabold text-lg transition-all shadow-xl">
              Start Shopping <FiArrowRight />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}