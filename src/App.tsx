import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext.js";
import { Navbar } from "./components/Navbar.js";
import { Footer } from "./components/Footer.js";
import { Toasts } from "./components/Toasts.js";
import { Home } from "./pages/Home.js";
import { Products } from "./pages/Products.js";
import { ProductDetail } from "./pages/ProductDetail.js";
import { About } from "./pages/About.js";
import { Contact } from "./pages/Contact.js";
import { UserPortal } from "./pages/UserPortal.js";
import { Admin } from "./pages/Admin.js";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900 relative overflow-x-hidden">
          
          {/* Background Mesh Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
          <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-stone-200/30 rounded-full blur-[80px] pointer-events-none -z-10"></div>
          
          {/* Top navigation */}
          <Navbar />
          
          {/* Main content body with flex grow for footer sticky alignments */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<UserPortal />} />
              <Route path="/admin" element={<Admin />} />
              
              {/* Fallback redirect */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          
          {/* Global Toast portal overlay */}
          <Toasts />
          
          {/* Footer block */}
          <Footer />
          
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
