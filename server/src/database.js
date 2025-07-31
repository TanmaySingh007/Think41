const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../database/ecommerce_refactored.db');
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

  // Create tables with refactored schema
  async createTables() {
    // Create departments table first
    const createDepartmentsTable = `
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create products table with department_id foreign key
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        department_id INTEGER NOT NULL,
        image_url TEXT,
        stock_quantity INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments (id)
      )
    `;

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Create departments table
        this.db.run(createDepartmentsTable, (err) => {
          if (err) {
            console.error('Error creating departments table:', err.message);
            reject(err);
          } else {
            console.log('Departments table created successfully');
          }
        });

        // Create products table
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
    });
  }

  // Insert departments from CSV data
  async insertDepartments(products) {
    const departments = [...new Set(products.map(p => p.department))];
    
    const insertDepartmentQuery = `
      INSERT OR IGNORE INTO departments (name) VALUES (?)
    `;

    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(insertDepartmentQuery);
      
      departments.forEach((department) => {
        stmt.run([department]);
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error inserting departments:', err.message);
          reject(err);
        } else {
          console.log(`Inserted ${departments.length} departments`);
          resolve(departments);
        }
      });
    });
  }

  // Get department ID by name
  async getDepartmentId(departmentName) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT id FROM departments WHERE name = ?', [departmentName], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.id : null);
        }
      });
    });
  }

  // Load data from CSV with refactored structure
  async loadDataFromCSV() {
    const csvPath = path.join(__dirname, '../data/products.csv');
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            // First insert departments
            await this.insertDepartments(results);
            
            // Then insert products with department_id
            await this.insertProductsWithDepartments(results);
            
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

  // Insert products with department_id foreign key
  async insertProductsWithDepartments(products) {
    const insertQuery = `
      INSERT OR REPLACE INTO products (id, name, description, price, department_id, image_url, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(insertQuery);
      
      const insertProduct = async (product) => {
        try {
          const departmentId = await this.getDepartmentId(product.department);
          if (departmentId) {
            stmt.run([
              product.id,
              product.name,
              product.description,
              parseFloat(product.price),
              departmentId,
              product.image_url,
              parseInt(product.stock_quantity)
            ]);
          }
        } catch (error) {
          console.error(`Error inserting product ${product.id}:`, error);
        }
      };

      // Process products sequentially to ensure departments exist
      const processProducts = async () => {
        for (const product of products) {
          await insertProduct(product);
        }
        
        stmt.finalize((err) => {
          if (err) {
            console.error('Error finalizing product insertions:', err.message);
            reject(err);
          } else {
            console.log('Products inserted successfully with department references');
            resolve();
          }
        });
      };

      processProducts();
    });
  }

  // Get all products with department information
  async getAllProducts() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT p.*, d.name as department 
        FROM products p 
        JOIN departments d ON p.department_id = d.id 
        ORDER BY p.id
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get product by ID with department information
  async getProductById(id) {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT p.*, d.name as department 
        FROM products p 
        JOIN departments d ON p.department_id = d.id 
        WHERE p.id = ?
      `, [id], (err, row) => {
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
      this.db.all(`
        SELECT p.*, d.name as department 
        FROM products p 
        JOIN departments d ON p.department_id = d.id 
        WHERE d.name = ? 
        ORDER BY p.id
      `, [department], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get all departments
  async getAllDepartments() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM departments ORDER BY name', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get department by ID
  async getDepartmentById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM departments WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Get departments with product counts
  async getDepartmentsWithProductCounts() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT d.*, COUNT(p.id) as product_count
        FROM departments d
        LEFT JOIN products p ON d.id = p.department_id
        GROUP BY d.id
        ORDER BY d.name
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get department statistics
  async getDepartmentStats(departmentId) {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT 
          d.*,
          COUNT(p.id) as total_products,
          AVG(p.price) as avg_price,
          MIN(p.price) as min_price,
          MAX(p.price) as max_price,
          SUM(p.stock_quantity) as total_stock
        FROM departments d
        LEFT JOIN products p ON d.id = p.department_id
        WHERE d.id = ?
        GROUP BY d.id
      `, [departmentId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Search departments by name
  async searchDepartments(searchTerm) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT d.*, COUNT(p.id) as product_count
        FROM departments d
        LEFT JOIN products p ON d.id = p.department_id
        WHERE d.name LIKE ?
        GROUP BY d.id
        ORDER BY d.name
      `, [`%${searchTerm}%`], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Create new department
  async createDepartment(name, description = null) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        INSERT INTO departments (name, description)
        VALUES (?, ?)
      `, [name, description], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, description });
        }
      });
    });
  }

  // Update department
  async updateDepartment(id, name, description = null) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        UPDATE departments 
        SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, description, id], function(err) {
        if (err) {
          reject(err);
        } else {
          if (this.changes > 0) {
            resolve({ id, name, description });
          } else {
            reject(new Error('Department not found'));
          }
        }
      });
    });
  }

  // Delete department (only if no products are associated)
  async deleteDepartment(id) {
    return new Promise((resolve, reject) => {
      // First check if department has products
      this.db.get(`
        SELECT COUNT(*) as product_count
        FROM products
        WHERE department_id = ?
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row.product_count > 0) {
          reject(new Error('Cannot delete department with associated products'));
        } else {
          // Delete the department
          this.db.run('DELETE FROM departments WHERE id = ?', [id], function(err) {
            if (err) {
              reject(err);
            } else {
              if (this.changes > 0) {
                resolve({ id, deleted: true });
              } else {
                reject(new Error('Department not found'));
              }
            }
          });
        }
      });
    });
  }

  // Get products with pagination and filtering
  async getProductsWithFilters(filters = {}) {
    const { 
      search, 
      department, 
      minPrice, 
      maxPrice, 
      limit = 20, 
      offset = 0,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = filters;

    let query = `
      SELECT p.*, d.name as department 
      FROM products p 
      JOIN departments d ON p.department_id = d.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (department) {
      query += ` AND d.name = ?`;
      params.push(department);
    }

    if (minPrice !== undefined) {
      query += ` AND p.price >= ?`;
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      query += ` AND p.price <= ?`;
      params.push(maxPrice);
    }

    // Validate sortBy to prevent SQL injection
    const validSortFields = ['name', 'price', 'department', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY p.${sortField} ${order}`;
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
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