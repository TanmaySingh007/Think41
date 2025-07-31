const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../../database/ecommerce.db');
  }

  // Initialize database connection
  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          resolve();
        }
      });
    });
  }

  // Create tables
  async createTables() {
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        department TEXT NOT NULL,
        image_url TEXT,
        stock_quantity INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.run(createProductsTable, (err) => {
        if (err) {
          console.error('Error creating products table:', err.message);
          reject(err);
        } else {
          console.log('Products table created successfully');
          resolve();
        }
      });
    });
  }

  // Load data from CSV
  async loadDataFromCSV() {
    const csvPath = path.join(__dirname, '../data/products.csv');
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            await this.insertProducts(results);
            console.log(`Loaded ${results.length} products from CSV`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  }

  // Insert products into database
  async insertProducts(products) {
    const insertQuery = `
      INSERT OR REPLACE INTO products (id, name, description, price, department, image_url, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(insertQuery);
      
      products.forEach((product) => {
        stmt.run([
          product.id,
          product.name,
          product.description,
          parseFloat(product.price),
          product.department,
          product.image_url,
          parseInt(product.stock_quantity)
        ]);
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error inserting products:', err.message);
          reject(err);
        } else {
          console.log('Products inserted successfully');
          resolve();
        }
      });
    });
  }

  // Get all products
  async getAllProducts() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM products ORDER BY id', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get product by ID
  async getProductById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get products by department
  async getProductsByDepartment(department) {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM products WHERE department = ? ORDER BY id', [department], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = Database; 