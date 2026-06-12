import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot'; // <-- 1. Import it
import CartDrawer from '../components/CartDrawer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg transition-colors duration-300 relative">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
      
      <AIChatbot /> {/* <-- 2. Place it here so it hovers over everything */}
      <CartDrawer /> {/* <-- Cart drawer also goes here to ensure it overlays properly */}
    </div>
  );
}