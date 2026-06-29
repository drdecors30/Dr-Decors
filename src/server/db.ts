import fs from "fs";
import path from "path";
import crypto from "crypto";
import { User, Product, Category, WebsiteSettings, PurchaseRequest, ContactMessage, NewsletterSubscriber } from "../types.js";


// Ensure data folder exists
const DATA_DIR = path.join(process.cwd(), "data");

const DB_PATH = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: Array<User & { passwordHash: string }>;
  products: Product[];
  categories: Category[];
  settings: WebsiteSettings;
  purchaseRequests: PurchaseRequest[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  visitorsCount: number;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Paintings", description: "Hand-painted exquisite art canvases", order: 1 },
  { id: "cat-2", name: "Wall Clocks", description: "Elegant handcrafted functional timepieces", order: 2 },
  { id: "cat-3", name: "Resin Art", description: "Beautiful custom glass-like resin decor pieces", order: 3 },
  { id: "cat-4", name: "Photo Frames", description: "Preserve your memories in customized frame styles", order: 4 },
  { id: "cat-5", name: "Thread Art", description: "Intricate string and thread masterpieces", order: 5 },
  { id: "cat-6", name: "Pop Art", description: "Vibrant modern contemporary pop culture items", order: 6 },
  { id: "cat-7", name: "Neon Light Art", description: "Glowing customizable neon signs and decorations", order: 7 },
  { id: "cat-8", name: "Wood Art", description: "Rustic and polished high-quality wood carvings", order: 8 },
  { id: "cat-9", name: "Canvas Art", description: "Bespoke digital and traditional canvas work", order: 9 },
  { id: "cat-10", name: "Custom Gifts", description: "Personalized curated hampers and gift packs", order: 10 },
  { id: "cat-11", name: "Home Decor", description: "General interior design items and centerpieces", order: 11 },
  { id: "cat-12", name: "Wall Decor", description: "Mirrors, hangings, shelves, and panel decorations", order: 12 },
  { id: "cat-13", name: "Handmade Crafts", description: "Carefully designed table and counter accessories", order: 13 },
  { id: "cat-14", name: "Festival Decor", description: "Seasonal decorations for festive vibes", order: 14 },
  { id: "cat-15", name: "Customized Orders", description: "Let us bring your custom ideas to life", order: 15 },
];

const DEFAULT_SETTINGS: WebsiteSettings = {
  websiteName: "Dr.Decors",
  logo: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200",
  themeColor: "amber",
  whatsAppNumber: "+919876543210",
  businessAddress: "123 Elegance Lane, Artisan Quarter, Jaipur, India",
  contactEmail: "info@drdecors.com",
  facebookUrl: "https://facebook.com/drdecors",
  instagramUrl: "https://instagram.com/drdecors",
  seoDescription: "Premium handcrafted and customized home decor products - Dr.Decors.",
  seoKeywords: "home decor, customized gifts, resin art, wall clocks, thread art, paintings",
};

// Default Admin User password: adminpassword
const DEFAULT_ADMIN_HASH = hashPassword("Faisal123");

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "deedecors-salt-key-9283").digest("hex");
}

function getInitialDB(): DatabaseSchema {
  return {
    users: [
      {
        id: "admin-1",
        email: "drdecors30@gmail.com",
        name: "Raghav",
        isAdmin: true,
        isSuspended: false,
        wishlist: [],
        searchHistory: [],
        createdAt: new Date().toISOString(),
        passwordHash: "8333a0555ae38ab9890b632d8dcd9bac2e55050a4cde865b926d79e5553d48ac",
      }
    ],
    products: [],
    categories: DEFAULT_CATEGORIES,
    settings: DEFAULT_SETTINGS,
    purchaseRequests: [],
    contactMessages: [],
    newsletterSubscribers: [],
    visitorsCount: 142, // Seed visitor count for analytics
  };
}

export class DB {
  private static load(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      this.save(getInitialDB());
    }

    console.log("========== DB DEBUG ==========");
    console.log("Working Directory:", process.cwd());
    console.log("DB Path:", DB_PATH);
    console.log("DB Exists:", fs.existsSync(DB_PATH));

    if (fs.existsSync(DB_PATH)) {
      console.log("DB Size:", fs.statSync(DB_PATH).size);
    }

    const data = fs.readFileSync(DB_PATH, "utf-8");

    console.log("Products:", JSON.parse(data).products.length);
    console.log("==============================");

    return JSON.parse(data);

  } catch (e) {
    console.error("DB LOAD ERROR:", e);
    throw e;
  }
}
  }


  private static save(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(
      DB_PATH,
      JSON.stringify(data, null, 2),
      "utf8"
    );
  } catch (e) {
    console.error("DB SAVE ERROR:", e);
    throw e;
  }
}

  // Auth & User operations
  public static getUsers() {
    const db = this.load();
    return db.users;
  }

  public static getUserByEmail(email: string) {
    const db = this.load();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public static getUserById(id: string) {
    const db = this.load();
    return db.users.find(u => u.id === id);
  }

  public static createUser(name: string, email: string, passwordPlain: string): User {
    const db = this.load();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("User already exists with this email");
    }

    const newUser = {
      id: "usr-" + crypto.randomBytes(6).toString("hex"),
      name,
      email,
      isAdmin: false,
      isSuspended: false,
      wishlist: [],
      searchHistory: [],
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(passwordPlain),
    };

    db.users.push(newUser);
    this.save(db);

    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  public static updateUser(id: string, updates: Partial<User>) {
    const db = this.load();
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");

    db.users[index] = { ...db.users[index], ...updates };
    this.save(db);
    const { passwordHash, ...safeUser } = db.users[index];
    return safeUser;
  }

  public static deleteUser(id: string) {
    const db = this.load();
    db.users = db.users.filter(u => u.id !== id);
    this.save(db);
  }

  public static hashAndCompare(passwordPlain: string, hash: string): boolean {
    return hashPassword(passwordPlain) === hash;
  }

  // Token security operations
  public static generateToken(payload: { id: string; email: string; isAdmin: boolean }): string {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
    const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
    
    const signature = crypto
      .createHmac("sha256", "deedecors-secret-key-102938")
      .update(`${header}.${body}`)
      .digest("base64url");

    return `${header}.${body}.${signature}`;
  }

  public static verifyToken(token: string): { id: string; email: string; isAdmin: boolean } | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const [header, body, signature] = parts;

      const expectedSignature = crypto
        .createHmac("sha256", "deedecors-secret-key-102938")
        .update(`${header}.${body}`)
        .digest("base64url");

      if (signature !== expectedSignature) return null;

      const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        return null; // Expired
      }

      return payload;
    } catch (e) {
      return null;
    }
  }

  // Products Operations
  public static getProducts(): Product[] {
    const db = this.load();
    return db.products;
  }

  public static getProductById(id: string): Product | undefined {
    const db = this.load();
    return db.products.find(p => p.id === id);
  }

  public static createProduct(productData: Omit<Product, "id" | "createdDate" | "updatedDate" | "views" | "purchaseClicks">): Product {
    const db = this.load();
    const newProduct: Product = {
      ...productData,
      id: "prd-" + crypto.randomBytes(6).toString("hex"),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      views: 0,
      purchaseClicks: 0,
    };
    db.products.push(newProduct);
    this.save(db);
    return newProduct;
  }

  public static updateProduct(id: string, updates: Partial<Product>): Product {
    const db = this.load();
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");

    db.products[index] = {
      ...db.products[index],
      ...updates,
      updatedDate: new Date().toISOString()
    };
    this.save(db);
    return db.products[index];
  }

  public static deleteProduct(id: string): void {
    const db = this.load();
    db.products = db.products.filter(p => p.id !== id);
    this.save(db);
  }

  public static incrementProductViews(id: string): void {
    const db = this.load();
    const p = db.products.find(x => x.id === id);
    if (p) {
      p.views = (p.views || 0) + 1;
      this.save(db);
    }
  }

  public static incrementProductPurchaseClicks(id: string): void {
    const db = this.load();
    const p = db.products.find(x => x.id === id);
    if (p) {
      p.purchaseClicks = (p.purchaseClicks || 0) + 1;
      this.save(db);
    }
  }

  // Categories Operations
  public static getCategories(): Category[] {
    const db = this.load();
    return db.categories.sort((a, b) => a.order - b.order);
  }

  public static createCategory(categoryData: Omit<Category, "id">): Category {
    const db = this.load();
    const newCategory: Category = {
      ...categoryData,
      id: "cat-" + crypto.randomBytes(6).toString("hex"),
    };
    db.categories.push(newCategory);
    this.save(db);
    return newCategory;
  }

  public static updateCategory(id: string, updates: Partial<Category>): Category {
    const db = this.load();
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Category not found");

    db.categories[index] = { ...db.categories[index], ...updates };
    this.save(db);
    return db.categories[index];
  }

  public static deleteCategory(id: string): void {
    const db = this.load();
    db.categories = db.categories.filter(c => c.id !== id);
    this.save(db);
  }

  // Settings
  public static getSettings(): WebsiteSettings {
    const db = this.load();
    return db.settings || DEFAULT_SETTINGS;
  }

  public static updateSettings(updates: Partial<WebsiteSettings>): WebsiteSettings {
    const db = this.load();
    db.settings = { ...db.settings, ...updates };
    this.save(db);
    return db.settings;
  }

  // Purchase Requests
  public static getPurchaseRequests(): PurchaseRequest[] {
    const db = this.load();
    return db.purchaseRequests;
  }

  public static createPurchaseRequest(reqData: Omit<PurchaseRequest, "id" | "clickedAt">): PurchaseRequest {
    const db = this.load();
    const newRequest: PurchaseRequest = {
      ...reqData,
      id: "req-" + crypto.randomBytes(6).toString("hex"),
      clickedAt: new Date().toISOString(),
    };
    db.purchaseRequests.push(newRequest);
    this.save(db);
    return newRequest;
  }

  // Visitors & Analytics counts
  public static incrementVisitorsCount(): number {
    const db = this.load();
    db.visitorsCount = (db.visitorsCount || 0) + 1;
    this.save(db);
    return db.visitorsCount;
  }

  public static getVisitorsCount(): number {
    const db = this.load();
    return db.visitorsCount || 142;
  }

  // Newsletter
  public static getNewsletterSubscribers(): NewsletterSubscriber[] {
    const db = this.load();
    return db.newsletterSubscribers || [];
  }

  public static addNewsletterSubscriber(email: string): NewsletterSubscriber {
    const db = this.load();
    const existing = db.newsletterSubscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;

    const newSub: NewsletterSubscriber = {
      id: "sub-" + crypto.randomBytes(6).toString("hex"),
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
    };
    db.newsletterSubscribers.push(newSub);
    this.save(db);
    return newSub;
  }

  // Contact Messages
  public static getContactMessages(): ContactMessage[] {
    const db = this.load();
    return db.contactMessages || [];
  }

  public static createContactMessage(name: string, email: string, message: string): ContactMessage {
    const db = this.load();
    const newMessage: ContactMessage = {
      id: "msg-" + crypto.randomBytes(6).toString("hex"),
      name,
      email,
      message,
      sentAt: new Date().toISOString(),
      status: "unread",
    };
    db.contactMessages.push(newMessage);
    this.save(db);
    return newMessage;
  }

  public static updateContactMessageStatus(id: string, status: "unread" | "read"): ContactMessage {
    const db = this.load();
    const index = db.contactMessages.findIndex(m => m.id === id);
    if (index === -1) throw new Error("Message not found");

    db.contactMessages[index].status = status;
    this.save(db);
    return db.contactMessages[index];
  }
}
