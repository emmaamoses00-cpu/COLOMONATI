const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 5000;

const JWT_SECRET =
    process.env.JWT_SECRET || "linkmart-development-secret-change-this";

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(cors());
app.use(express.json());

// Serve your existing website
app.use(express.static(path.join(__dirname, "..")));

// --------------------------------------------------
// DATABASE
// --------------------------------------------------

const db = new sqlite3.Database(
    path.join(__dirname, "linkmart.db"),
    (error) => {
        if (error) {
            console.error("Database connection error:", error.message);
        } else {
            console.log("Connected to LinkMart database.");
        }
    }
);

// Helper functions

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve({
                    id: this.lastID,
                    changes: this.changes
                });
            }
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error, row) => {
            if (error) {
                reject(error);
            } else {
                resolve(row);
            }
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
}

// --------------------------------------------------
// CREATE TABLES
// --------------------------------------------------

async function initializeDatabase() {

    await run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            supplier_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT,
            image TEXT,
            wholesale_price REAL NOT NULL,
            selling_price REAL,
            stock INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (supplier_id) REFERENCES users(id)
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES users(id)
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS commissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            affiliate_id INTEGER NOT NULL,
            order_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (affiliate_id) REFERENCES users(id),
            FOREIGN KEY (order_id) REFERENCES orders(id)
        )
    `);

    console.log("Database tables ready.");
}

// --------------------------------------------------
// AUTHENTICATION MIDDLEWARE
// --------------------------------------------------

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Login required."
        });
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {

        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token."
            });
        }

        req.user = user;

        next();
    });
}

// --------------------------------------------------
// HOME
// --------------------------------------------------

app.get("/api", (req, res) => {

    res.json({
        message: "Welcome to the LinkMart API!",
        status: "Backend is working."
    });

});

// --------------------------------------------------
// REGISTER
// --------------------------------------------------

app.post("/api/auth/register", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }

        const allowedRoles = [
            "supplier",
            "affiliate",
            "trader",
            "customer"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid account type."
            });
        }

        const existingUser = await get(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await run(
            `
            INSERT INTO users
            (first_name, last_name, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                firstName,
                lastName,
                email,
                phone || "",
                passwordHash,
                role
            ]
        );

        res.status(201).json({
            message: "Account created successfully.",
            userId: result.id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error while creating account."
        });

    }

});

// --------------------------------------------------
// LOGIN
// --------------------------------------------------

app.post("/api/auth/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await get(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({

            message: "Login successful.",

            token,

            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error while logging in."
        });

    }

});

// --------------------------------------------------
// GET CURRENT USER
// --------------------------------------------------

app.get("/api/auth/me", authenticateToken, async (req, res) => {

    const user = await get(
        `
        SELECT id, first_name, last_name, email, phone, role
        FROM users
        WHERE id = ?
        `,
        [req.user.id]
    );

    if (!user) {
        return res.status(404).json({
            message: "User not found."
        });
    }

    res.json(user);

});

// --------------------------------------------------
// PRODUCTS
// --------------------------------------------------

// Get all products

app.get("/api/products", async (req, res) => {

    try {

        const { search, category } = req.query;

        let sql = `
            SELECT
                products.*,
                users.first_name AS supplier_first_name,
                users.last_name AS supplier_last_name
            FROM products
            LEFT JOIN users
            ON products.supplier_id = users.id
            WHERE products.status = 'active'
        `;

        const params = [];

        if (search) {

            sql += `
                AND (
                    products.name LIKE ?
                    OR products.description LIKE ?
                    OR products.category LIKE ?
                )
            `;

            const searchValue = `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue
            );
        }

        if (category) {

            sql += " AND products.category = ?";

            params.push(category);
        }

        sql += " ORDER BY products.created_at DESC";

        const products = await all(sql, params);

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not load products."
        });

    }

});

// Get one product

app.get("/api/products/:id", async (req, res) => {

    try {

        const product = await get(
            `
            SELECT
                products.*,
                users.first_name AS supplier_first_name,
                users.last_name AS supplier_last_name
            FROM products
            LEFT JOIN users
            ON products.supplier_id = users.id
            WHERE products.id = ?
            `,
            [req.params.id]
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Could not load product."
        });

    }

});

// --------------------------------------------------
// ADD PRODUCT
// --------------------------------------------------

app.post(
    "/api/products",
    authenticateToken,
    async (req, res) => {

        try {

            if (req.user.role !== "supplier") {

                return res.status(403).json({
                    message: "Only suppliers can add products."
                });

            }

            const {
                name,
                description,
                category,
                image,
                wholesalePrice,
                sellingPrice,
                stock
            } = req.body;

            if (!name || wholesalePrice === undefined) {

                return res.status(400).json({
                    message: "Product name and wholesale price are required."
                });

            }

            const result = await run(
                `
                INSERT INTO products
                (
                    supplier_id,
                    name,
                    description,
                    category,
                    image,
                    wholesale_price,
                    selling_price,
                    stock
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    req.user.id,
                    name,
                    description || "",
                    category || "",
                    image || "",
                    wholesalePrice,
                    sellingPrice || 0,
                    stock || 0
                ]
            );

            res.status(201).json({
                message: "Product added successfully.",
                productId: result.id
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Could not add product."
            });

        }

    }
);

// --------------------------------------------------
// SUPPLIER PRODUCTS
// --------------------------------------------------

app.get(
    "/api/supplier/products",
    authenticateToken,
    async (req, res) => {

        if (req.user.role !== "supplier") {

            return res.status(403).json({
                message: "Supplier access only."
            });

        }

        const products = await all(
            `
            SELECT *
            FROM products
            WHERE supplier_id = ?
            ORDER BY created_at DESC
            `,
            [req.user.id]
        );

        res.json(products);

    }
);

// --------------------------------------------------
// ORDERS
// --------------------------------------------------

app.post(
    "/api/orders",
    authenticateToken,
    async (req, res) => {

        try {

            const { items } = req.body;

            if (!Array.isArray(items) || items.length === 0) {

                return res.status(400).json({
                    message: "Your order is empty."
                });

            }

            let total = 0;
            const orderItems = [];

            for (const item of items) {

                const product = await get(
                    "SELECT * FROM products WHERE id = ?",
                    [item.productId]
                );

                if (!product) {
                    return res.status(404).json({
                        message: `Product ${item.productId} not found.`
                    });
                }

                const quantity = Number(item.quantity);

                if (!quantity || quantity < 1) {
                    return res.status(400).json({
                        message: "Invalid quantity."
                    });
                }

                const price =
                    product.selling_price ||
                    product.wholesale_price;

                total += price * quantity;

                orderItems.push({
                    productId: product.id,
                    quantity,
                    price
                });

            }

            const order = await run(
                `
                INSERT INTO orders
                (customer_id, total_amount)
                VALUES (?, ?)
                `,
                [
                    req.user.id,
                    total
                ]
            );

            for (const item of orderItems) {

                await run(
                    `
                    INSERT INTO order_items
                    (order_id, product_id, quantity, price)
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        order.id,
                        item.productId,
                        item.quantity,
                        item.price
                    ]
                );

            }

            res.status(201).json({

                message: "Order created successfully.",

                orderId: order.id,

                totalAmount: total

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Could not create order."
            });

        }

    }
);

// --------------------------------------------------
// CUSTOMER ORDERS
// --------------------------------------------------

app.get(
    "/api/orders",
    authenticateToken,
    async (req, res) => {

        const orders = await all(
            `
            SELECT *
            FROM orders
            WHERE customer_id = ?
            ORDER BY created_at DESC
            `,
            [req.user.id]
        );

        res.json(orders);

    }
);

// --------------------------------------------------
// AFFILIATE COMMISSIONS
// --------------------------------------------------

app.get(
    "/api/commissions",
    authenticateToken,
    async (req, res) => {

        if (req.user.role !== "affiliate") {

            return res.status(403).json({
                message: "Affiliate access only."
            });

        }

        const commissions = await all(
            `
            SELECT *
            FROM commissions
            WHERE affiliate_id = ?
            ORDER BY created_at DESC
            `,
            [req.user.id]
        );

        res.json(commissions);

    }
);
// --------------------------------------------------
// ADD STARTER PRODUCTS
// --------------------------------------------------

async function addStarterProducts() {

    const existingProducts = await get(
        "SELECT COUNT(*) AS count FROM products"
    );

    if (existingProducts.count > 0) {
        console.log("Products already exist. Skipping starter products.");
        return;
    }

    const starterProducts = [
        {
            name: "Wireless Earbuds",
            description: "High-quality wireless earbuds.",
            category: "Electronics",
            image: "🎧",
            wholesalePrice: 18,
            sellingPrice: 24.99,
            stock: 50
        },
        {
            name: "Running Shoes",
            description: "Comfortable everyday running shoes.",
            category: "Fashion",
            image: "👟",
            wholesalePrice: 25,
            sellingPrice: 32.50,
            stock: 40
        },
        {
            name: "Smart Watch Pro",
            description: "Modern smart watch with smart features.",
            category: "Electronics",
            image: "⌚",
            wholesalePrice: 35,
            sellingPrice: 45,
            stock: 30
        },
        {
            name: "Skincare Set",
            description: "Complete daily skincare collection.",
            category: "Beauty",
            image: "🧴",
            wholesalePrice: 12,
            sellingPrice: 18.99,
            stock: 25
        }
    ];

    for (const product of starterProducts) {

        await run(
            `
            INSERT INTO products
            (
                name,
                description,
                category,
                image,
                wholesale_price,
                selling_price,
                stock
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                product.name,
                product.description,
                product.category,
                product.image,
                product.wholesalePrice,
                product.sellingPrice,
                product.stock
            ]
        );
    }

    console.log("Starter products added to database.");
}
// --------------------------------------------------
// START SERVER
// --------------------------------------------------

initializeDatabase()
    .then(() => addStarterProducts())
    .then(() => {

        app.listen(PORT, () => {

            console.log("");
            console.log("==================================");
            console.log("       COLOMONATI BACKEND");
            console.log("==================================");
            console.log(`Server running at http://localhost:${PORT}`);
            console.log(`API running at http://localhost:${PORT}/api`);
            console.log("==================================");
            console.log("");

        });

    })
    .catch((error) => {

        console.error(
            "Failed to initialize database:",
            error
        );

    });