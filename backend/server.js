const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();
const db = require('./config/db');
const path = require("path");
const multer = require('multer');
const { error } = require("console");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb'}));
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Fetch popular products based on category
app.get("/popular-products", (req, res) => {
  const category = req.query.category;

  let sqlQuery = "SELECT * FROM allproducts WHERE trending_score > 75";
  let queryParams = [];

  if (category && category !== "All") {
    sqlQuery += " AND LOWER(TRIM(category)) = LOWER(TRIM(?))";
    queryParams.push(category);
  }

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

// Fetch All Products based on category
app.get("/category-products", (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  const sqlQuery = "SELECT * FROM allproducts WHERE LOWER(TRIM(category)) = LOWER(TRIM(?))";
  const queryParams = [category];

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No Products found for this category" });
    }

    res.json(results);
  });
});

//Fetch Weekly Deals using views_count
app.get("/weekly-deals", (req, res) => {
  const sqlQuery = "SELECT * FROM allproducts WHERE views_count > 15000";

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({error: "Internal Server Error"});
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No weekly deals found" });
    }

    res.json(results); 
  });
});

// Fetch Filters based on category or search
app.get("/filters", async (req, res) => {
  const { category, search } = req.query;

  let sqlQuery;
  let queryParams = [];

  if (category) {
    const lowerCaseCategory = category.toLowerCase().replace(/\s/g, '');
    sqlQuery = `
      SELECT brand, ratings, actual_price
      FROM allproducts
      WHERE LOWER(REPLACE(category, ' ', '')) = ?
    `;
    queryParams.push(lowerCaseCategory);
  } else if (search) {
    // Check if the search term matches a category (case-insensitive, space-insensitive)
    const categoryCheckQuery = "SELECT COUNT(*) AS count FROM allproducts WHERE LOWER(REPLACE(category, ' ', '')) = ?";
    try {
      const [categoryCheckResult] = await db.promise().query(categoryCheckQuery, [search.toLowerCase().replace(/\s/g, '')]);
      if (categoryCheckResult[0].count > 0) {
        sqlQuery = `
          SELECT brand, ratings, actual_price
          FROM allproducts
          WHERE LOWER(REPLACE(category, ' ', '')) = ?
        `;
        queryParams.push(search.toLowerCase().replace(/\s/g, ''));
      } else {
        // If not a category, search by product name (case-insensitive)
        sqlQuery = `
          SELECT brand, ratings, actual_price
          FROM allproducts
          WHERE LOWER(name) LIKE ?
        `;
        queryParams.push(`%${search.toLowerCase()}%`);
      }
    } catch (err) {
      console.error("Database Query Error (Category Check):", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(400).json({ error: "Category or Search query is required" });
  }

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

//Fetch Category Name for SearchQuery
app.get("/filters-category-name", (req, res) => {
  const search = req.query.search?.trim();

  if (!search) {
    return res.json({ categoryName: null }); // Return null if no search term
  }

  const sqlQuery = "SELECT category from allproducts WHERE LOWER(name) LIKE LOWER(?) LIMIT 1"; // Limit to 1 result
  const queryParams = [`%${search}%`]; // Add '%' for LIKE search

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Database Query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      res.json({ categoryName: results[0].category }); // Return the first category
    } else {
      res.json({ categoryName: null }); // Return null if no results
    }
  });
});


// Search for products based on name and also category
app.get("/products", (req, res) => {
  const rawSearch = req.query.search || "";
  const search = rawSearch.trim().toLowerCase();

  const likePattern = `%${search.replace(/\s+/g, "")}%`; // remove spaces for comparison

  const sqlQuery = `
    SELECT * FROM allproducts 
    WHERE REPLACE(LOWER(name), ' ', '') LIKE ?
       OR REPLACE(LOWER(category), ' ', '') LIKE ?
  `;

  db.query(sqlQuery, [likePattern, likePattern], (err, results) => {
    if (err) {
      console.error("Search error:", err);
      return res.status(500).json({ error: "Search failed" });
    }

    res.json(results);
  });
});


// Fetch product by ID
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;

  const sqlQuery = "SELECT * FROM allproducts WHERE id = ?";
  const queryParams = [productId];

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results[0]); // Send the first matching product
  });
});


// Fetch product by ID 
app.get("/product-details/:id", (req, res) => {
  const productId = req.params.id;

  const sqlQuery = "SELECT * FROM allproducts WHERE id = ?";
  const queryParams = [productId];

  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(results[0]); // Send the first matching product
  });
});

//Fetch products for color selection
app.get('/product-variants/:name', async (req, res) => {
  const { name } = req.params;
  const query = "SELECT * FROM allproducts WHERE name = ?";

  db.query(query, [name], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

//similar-products
app.get('/similar-products', (req, res) => {
  const { category, excludeId } = req.query;

  const query = 'SELECT * FROM allproducts WHERE category = ? AND id != ? LIMIT 8';
  const params = [category, excludeId];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching similar products:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results);
  });
});



// Register User
app.post("/signup-register", (req, res) => {
  const { name, email, mobileNumber, password } = req.body;

  if (!name || !email || !mobileNumber || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "INSERT INTO users (name, email, mobile_number, password) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, mobileNumber, password], (err, result) => {
    if (err) {
      console.error("Database error:", err); // Logs error details
      return res.status(500).json({ message: "Database Error", error: err.message });
    }

    // Retrieve the ID of the newly inserted user
    const userId = result.insertId;

    // Construct the user object
    const user = {
      id: userId,
      name: name,
    };

    // Send the user object in the response
    res.status(201).json({ message: "User Registered Successfully!", user: user });
  });
});

//User login
app.post("/login-user", (req, res) => {
  const { identifier, password, isEmail } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Email/Mobile number and password are required!" });
  }

  let query;
  let values;

  if (isEmail) {
    query = "SELECT id, name, password FROM users WHERE email = ?";
    values = [identifier];
  } else {
    query = "SELECT id, name, password FROM users WHERE mobile_number = ?";
    values = [identifier];
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ message: "Database Error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found! Please check your credentials." });
    }

    const user = result[0];

    if (user.password === password) {
      // Send back the user's ID and name
      res.json({ message: "Login Successful!", user: { id: user.id, name: user.name } });
    } else {
      return res.status(400).json({ message: "Incorrect password!" });
    }
  });
});


// Shipping Address
app.post("/shipping-address", (req, res) => {
  const { userId, street, city, state, zip, country } = req.body;

  if (!userId || !street || !city || !state || !zip || !country) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "UPDATE users SET street = ?, city = ?, state = ?, zip = ?, country = ? WHERE id = ?";

  db.query(query, [street, city, state, zip, country, userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database Error", error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Address added successfully." });
  });
});

// Get Shipping Address
app.get("/shipping-address/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const query = "SELECT street, city, state, zip, country FROM users WHERE id = ?";
  
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database Error", error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.status(200).json(result[0]); // Return address data
  });
});

//Entering Order Data using Buy now
app.post("/orders", (req, res) => {
  const { userId, productId, quantity, price, address, color_name, product_color_img, name } = req.body;
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  // Stringify the address object
  const addressString = JSON.stringify(address);

  const sql = "INSERT INTO orders (user_id, product_id, order_id, quantity, price, address, color_name, product_color_img, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [userId, productId, orderId, quantity, price, addressString, color_name, product_color_img, name], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "Order placed successfully", orderId });
  });
});

//Entering Order data from Cart
app.post("/orders-cart", (req, res) => {
  const orders = req.body.orders;

  if (!Array.isArray(orders) || orders.length === 0) {
    return res.status(400).json({ message: "No orders found in request" });
  }

  const orderPromises = orders.map(order => {
    const { userId, productId, quantity, final_price, address, color_name, product_color_img, name } = order;
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const addressString = JSON.stringify(address);

    const sql = "INSERT INTO orders (user_id, product_id, order_id, quantity, final_price, address, color_name, product_color_img, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
      db.query(sql, [userId, productId, orderId, quantity, final_price, addressString, color_name, product_color_img, name], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  Promise.all(orderPromises)
    .then(results => {
      res.json({ message: "Orders placed successfully", orderIds: results.map(result => result.insertId) });
    })
    .catch(error => {
      console.error("Database error:", error);
      res.status(500).json({ message: "Database error", error });
    });
});

//Get Orders data using ID
app.get("/orders/:userId", (req, res) => {
  const userId = req.params.userId; // Get user ID from request params
  const query = "SELECT * FROM orders WHERE user_id = ?"; // Fetch orders by user_id

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database Error" });
    }

    if (result.length === 0) {
      return res.status(200).json([]); // Return empty array if no orders
    }

    res.json(result); // Return fetched orders
  });
});

// Get Users data using ID
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Log the error on the server side
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if profile_pic is defined and not null
    const userProfile = results[0];
    if (userProfile.profile_pic) {
      // If the path is relative and needs to be served from a specific directory, construct the full URL.
      // Assuming your images are in the 'uploads' folder:
      userProfile.profile_pic = `/uploads/${userProfile.profile_pic}`; // Or whatever path is correct.
    }

    res.json(userProfile); // Send the user profile with the adjusted profile_pic path
  });
});

// Get User's email and sp_discount by userId
app.get('/users-email/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT email, sp_discount FROM users WHERE id = ?';

  db.query(sql, [userId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.setHeader('Content-Type', 'application/json');
      res.json({ email: results[0].email, sp_discount: results[0].sp_discount });
  });
});


// Updating user profile.
app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const { name, email, mobile_number, street, city, state, zip, country, profile_pic } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ?, mobile_number = ?, street = ?, city = ?, state = ?, zip = ?, country = ?, profile_pic = ? WHERE id = ?';

  db.query(sql, [name, email, mobile_number, street, city, state, zip, country, profile_pic, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User profile updated successfully' });
  });
});

//updating User Profile Picture
app.put('/users/:userId/profile_pic', upload.single('profile_pic'), (req, res) => {
  const userId = req.params.userId;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const sql = 'UPDATE users SET profile_pic = ? WHERE id = ?';
  db.query(sql, [req.file.filename, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile picture updated successfully' });
  });
});

//Inserting card Details
app.post('/card-details', (req, res) => { // Remove async

  const { id, cardNumber, expiryMonth, expiryYear, cvv } = req.body;
  const encryptionKey = process.env.MYSQL_ENCRYPTION_KEY;

  if (!encryptionKey) {
      return res.status(500).json({ error: 'Encryption key not configured' });
  }

  const sqlQuery = 'UPDATE users SET card_number = AES_ENCRYPT(?, ?), expiry_month = ?, expiry_year = ?, cvv = AES_ENCRYPT(?, ?), sp_discount = 1 WHERE id = ?';
  const queryParams = [cardNumber, encryptionKey, expiryMonth, expiryYear, cvv, encryptionKey, id];

  db.query(sqlQuery, queryParams, (err, result) => {
      if (err) {
          console.error("Error processing card details:", err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Card details updated successfully' });
  });
});

// Wishlist Insert
app.post('/wishlist/add', (req, res) => {
  const { productEntryId, userId } = req.body; // Get userId from req.body

  if (!productEntryId || !userId) {
    return res.status(400).json({ message: 'Missing productEntryId or userId' });
  }

  const checkQuery = 'SELECT id FROM wishlist WHERE user_id = ? AND product_entry_id = ?';
  db.query(checkQuery, [userId, productEntryId], (err, existingItem) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (existingItem.length > 0) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    const insertQuery = 'INSERT INTO wishlist (user_id, product_entry_id) VALUES (?, ?)';
    db.query(insertQuery, [userId, productEntryId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.status(200).json({ message: 'Product added to wishlist' });
    });
  });
});

// Wishlist Delete
app.post('/wishlist/remove', (req, res) => {
  const { productEntryId, userId } = req.body; // Get userId from req.body

  if (!productEntryId || !userId) {
    return res.status(400).json({ message: 'Missing productEntryId or userId' });
  }

  const deleteQuery = 'DELETE FROM wishlist WHERE user_id = ? AND product_entry_id = ?';
  db.query(deleteQuery, [userId, productEntryId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Product removed from wishlist' });
    } else {
      res.status(404).json({ message: 'Product not found in wishlist' });
    }
  });
});

// Wishlist Fetch
app.get('/wishlist', (req, res) => {
  const userId = req.query.userId; // Get userId from query parameter (for fetching)

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  const wishlistQuery = 'SELECT product_entry_id FROM wishlist WHERE user_id = ?';
  db.query(wishlistQuery, [userId], (err, wishlistResults) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    const productEntryIds = wishlistResults.map(item => item.product_entry_id);

    if (productEntryIds.length > 0) {
      const placeholders = '?'.repeat(productEntryIds.length).split('').join(',');
      const productsQuery = `SELECT * FROM allproducts WHERE id IN (${placeholders})`;
      db.query(productsQuery, productEntryIds, (err, products) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        const productsWithWishlistStatus = products.map(product => ({ ...product, isInWishlist: true }));
        res.json(productsWithWishlistStatus);
      });
    } else {
      res.json([]); // User's wishlist is empty
    }
  });
});

// Check if a product is in the user's wishlist
app.get('/wishlist/check', (req, res) => {
  const { userId, productId } = req.query;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'Missing userId or productId' });
  }

  const checkQuery = 'SELECT id FROM wishlist WHERE user_id = ? AND product_entry_id = ?';
  db.query(checkQuery, [userId, productId], (err, existingItem) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json({ isInWishlist: existingItem.length > 0 });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});