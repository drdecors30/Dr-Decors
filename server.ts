import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { DB } from "./src/server/db.js";

async function startServer() {
  const app = express();
  app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
  const PORT = Number(process.env.PORT) || 3000;

  // Midddleware to parse JSON & URLEncoded bodies
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // Request logger helper
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Authentication Middlewares
  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const payload = DB.verifyToken(token);
    if (!payload) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    const user = DB.getUserById(payload.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ error: "Your account is suspended" });
    }

    (req as any).user = user;
    next();
  };

  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, () => {
      const user = (req as any).user;
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: "Administrator rights required" });
      }
      next();
    });
  };

  // --- API ROUTES ---

  // Auth
  app.post("/api/auth/register", (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }
      const safeUser = DB.createUser(name, email, password);
      const token = DB.generateToken({ id: safeUser.id, email: safeUser.email, isAdmin: safeUser.isAdmin });
      res.status(201).json({ user: safeUser, token });
    } catch (e: any) {
      res.status(400).json({ error: e.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = DB.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (user.isSuspended) {
        return res.status(403).json({ error: "Your account has been suspended" });
      }

      const valid = DB.hashAndCompare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { passwordHash, ...safeUser } = user;
      const token = DB.generateToken({ id: safeUser.id, email: safeUser.email, isAdmin: safeUser.isAdmin });
      res.json({ user: safeUser, token });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req, res) => {
    const user = (req as any).user;
    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
  });

  // Profile management & Wishlist
  app.put("/api/users/profile", authenticateToken, (req, res) => {
    try {
      const user = (req as any).user;
      const { name, savedAddress, wishlist, searchHistory } = req.body;
      const updates: any = {};
      
      if (name !== undefined) updates.name = name;
      if (savedAddress !== undefined) updates.savedAddress = savedAddress;
      if (wishlist !== undefined) updates.wishlist = wishlist;
      if (searchHistory !== undefined) updates.searchHistory = searchHistory;

      const updatedUser = DB.updateUser(user.id, updates);
      res.json(updatedUser);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Admin user management
  app.get("/api/users", requireAdmin, (req, res) => {
    try {
      const users = DB.getUsers().map(({ passwordHash, ...u }) => u);
      res.json(users);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/users/:id/suspend", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const { isSuspended } = req.body;
      const updated = DB.updateUser(id, { isSuspended });
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/users/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      DB.deleteUser(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Products
  app.get("/api/products", (req, res) => {
    try {
      let products = DB.getProducts();
      
      // Filter out hidden/draft products for non-admins
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      let isAdmin = false;
      if (token) {
        const payload = DB.verifyToken(token);
        if (payload?.isAdmin) {
          isAdmin = true;
        }
      }

      if (!isAdmin) {
        products = products.filter(p => p.status === "published");
      }

      res.json(products);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      const product = DB.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Record page view (non-blocking)
      DB.incrementProductViews(id);

      res.json(product);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/products", requireAdmin, (req, res) => {
    try {
      const productData = req.body;
      // Setup some defaults
      if (!productData.name || !productData.price || !productData.category) {
        return res.status(400).json({ error: "Name, price, and category are required" });
      }
      
      const newProduct = DB.createProduct({
        name: productData.name,
        shortDescription: productData.shortDescription || "",
        fullDescription: productData.fullDescription || "",
        price: Number(productData.price),
        discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
        discountPercentage: productData.discountPercentage ? Number(productData.discountPercentage) : undefined,
        category: productData.category,
        subcategory: productData.subcategory || "",
        sku: productData.sku || "DEE-" + Math.floor(1000 + Math.random() * 9000),
        availableStock: Number(productData.availableStock ?? 1),
        images: productData.images && productData.images.length ? productData.images : ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600"],
        primaryImage: productData.primaryImage || (productData.images && productData.images[0]) || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
        materialsUsed: productData.materialsUsed || [],
        dimensions: productData.dimensions || "N/A",
        weight: productData.weight || "N/A",
        color: productData.color || "N/A",
        style: productData.style || "N/A",
        tags: productData.tags || [],
        brand: productData.brand || "DEE-Decors",
        featured: !!productData.featured,
        trending: !!productData.trending,
        newArrival: !!productData.newArrival,
        bestSeller: !!productData.bestSeller,
        status: productData.status || "published",
      });

      res.status(201).json(newProduct);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/products/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = DB.updateProduct(id, updates);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/products/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      DB.deleteProduct(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Bulk Product operations
  app.post("/api/products/bulk-delete", requireAdmin, (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: "Product IDs must be an array" });
      }
      ids.forEach(id => DB.deleteProduct(id));
      res.json({ success: true, count: ids.length });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/products/bulk-upload", requireAdmin, (req, res) => {
    try {
      const { products } = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: "Products list must be an array" });
      }

      const added: any[] = [];
      products.forEach(p => {
        if (p.name && p.price && p.category) {
          const newP = DB.createProduct({
            name: p.name,
            shortDescription: p.shortDescription || "",
            fullDescription: p.fullDescription || "",
            price: Number(p.price),
            discountPrice: p.discountPrice ? Number(p.discountPrice) : undefined,
            discountPercentage: p.discountPercentage ? Number(p.discountPercentage) : undefined,
            category: p.category,
            subcategory: p.subcategory || "",
            sku: p.sku || "DEE-" + Math.floor(1000 + Math.random() * 9000),
            availableStock: Number(p.availableStock ?? 5),
            images: p.images || ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600"],
            primaryImage: p.primaryImage || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
            materialsUsed: p.materialsUsed || [],
            dimensions: p.dimensions || "N/A",
            weight: p.weight || "N/A",
            color: p.color || "N/A",
            style: p.style || "N/A",
            tags: p.tags || [],
            brand: "DEE-Decors",
            featured: !!p.featured,
            trending: !!p.trending,
            newArrival: !!p.newArrival,
            bestSeller: !!p.bestSeller,
            status: p.status || "published",
          });
          added.push(newP);
        }
      });
      res.status(201).json({ success: true, count: added.length, products: added });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Categories
  app.get("/api/categories", (req, res) => {
    try {
      res.json(DB.getCategories());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/categories", requireAdmin, (req, res) => {
    try {
      const { name, description, image, banner, order } = req.body;
      if (!name) return res.status(400).json({ error: "Category name is required" });
      const newCat = DB.createCategory({
        name,
        description: description || "",
        image: image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300",
        banner: banner || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200",
        order: Number(order ?? 10),
      });
      res.status(201).json(newCat);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/categories/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = DB.updateCategory(id, updates);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/categories/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      DB.deleteCategory(id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Website Settings
  app.get("/api/settings", (req, res) => {
    try {
      res.json(DB.getSettings());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/settings", requireAdmin, (req, res) => {
    try {
      const updated = DB.updateSettings(req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // WhatsApp purchase tracking
  app.post("/api/products/:id/purchase-click", (req, res) => {
    try {
      const { id } = req.params;
      const { userName, userEmail, whatsAppMessage } = req.body;
      
      const product = DB.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      DB.incrementProductPurchaseClicks(id);

      const request = DB.createPurchaseRequest({
        productId: product.id,
        productName: product.name,
        productPrice: product.discountPrice || product.price,
        userName: userName || "Guest Customer",
        userEmail: userEmail || "guest@deedecors.com",
        whatsAppMessage: whatsAppMessage || `Interested in buying: ${product.name}`,
      });

      res.status(201).json(request);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/purchase-requests", requireAdmin, (req, res) => {
    try {
      res.json(DB.getPurchaseRequests());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Visitors count trigger
  app.post("/api/visitors", (req, res) => {
    try {
      const current = DB.incrementVisitorsCount();
      res.json({ count: current });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Contact
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }
      const msg = DB.createContactMessage(name, email, message);
      res.status(201).json(msg);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/contact-messages", requireAdmin, (req, res) => {
    try {
      res.json(DB.getContactMessages());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/contact-messages/:id/status", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = DB.updateContactMessageStatus(id, status);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Newsletter
  app.post("/api/newsletter/subscribe", (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const sub = DB.addNewsletterSubscriber(email);
      res.json({ success: true, data: sub });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/newsletter-subscribers", requireAdmin, (req, res) => {
    try {
      res.json(DB.getNewsletterSubscribers());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin dashboard Analytics
  app.get("/api/analytics", requireAdmin, (req, res) => {
    try {
      const products = DB.getProducts();
      const users = DB.getUsers();
      const categories = DB.getCategories();
      const purchaseRequests = DB.getPurchaseRequests();
      const visitors = DB.getVisitorsCount();

      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === "published").length;
      const outOfStockProducts = products.filter(p => p.availableStock <= 0).length;

      // Product views and popularity analytics
      const popularProducts = [...products]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(p => ({ id: p.id, name: p.name, views: p.views || 0 }));

      // Most purchased products (purchaseClicks)
      const clickedProducts = [...products]
        .sort((a, b) => (b.purchaseClicks || 0) - (a.purchaseClicks || 0))
        .slice(0, 5)
        .map(p => ({ id: p.id, name: p.name, purchaseClicks: p.purchaseClicks || 0 }));

      // Products per category
      const categoryCounts = categories.map(cat => {
        const count = products.filter(p => p.category === cat.name).length;
        return { name: cat.name, count };
      });

      res.json({
        stats: {
          totalProducts,
          activeProducts,
          outOfStockProducts,
          totalCategories: categories.length,
          totalUsers: users.length - 1, // Exclude initial admin
          totalRequests: purchaseRequests.length,
          visitorsCount: visitors,
        },
        popularProducts,
        clickedProducts,
        categoryCounts,
        recentRequests: purchaseRequests.slice(-5).reverse(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- VITE DEV AND PROD SERVING ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DEE-Decors Server running on http://localhost:${PORT}`);
  });
}

startServer();
