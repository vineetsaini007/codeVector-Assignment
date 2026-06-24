require("dotenv").config();

const pool = require("../src/db/pool");

async function seed() {
  try {
    console.log("Starting seed...");

    await pool.query(`
      DROP TABLE IF EXISTS products;

      CREATE TABLE products (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
      );
    `);

    console.log("Table created");

    await pool.query(`
      CREATE INDEX idx_products_created_at_id
      ON products(created_at DESC, id DESC);

      CREATE INDEX idx_products_category_created_at_id
      ON products(category, created_at DESC, id DESC);
    `);

    console.log("Indexes created");

    await pool.query(`
      INSERT INTO products (
        name,
        category,
        price,
        created_at
      )
      SELECT
        CONCAT(
          (ARRAY[
            'Premium',
            'Smart',
            'Ultra',
            'Pro',
            'Deluxe',
            'Advanced',
            'Classic',
            'Eco'
          ])[
            floor(random() * 8 + 1)
          ],
          ' ',
          (ARRAY[
            'Phone',
            'Laptop',
            'Chair',
            'Shoes',
            'Book',
            'Watch',
            'Camera',
            'Tablet'
          ])[
            floor(random() * 8 + 1)
          ],
          ' ',
          gs
        ) AS name,

        (ARRAY[
          'Electronics',
          'Books',
          'Fashion',
          'Home',
          'Sports',
          'Beauty',
          'Furniture',
          'Toys'
        ])[
          floor(random() * 8 + 1)
        ] AS category,

        ROUND(
          (random() * 5000 + 100)::numeric,
          2
        ) AS price,

        NOW()
        - (
            random() * INTERVAL '365 days'
          ) AS created_at

      FROM generate_series(
        1,
        200000
      ) gs;
    `);

    console.log(
      "200,000 products inserted successfully"
    );

    const count = await pool.query(`
      SELECT COUNT(*) FROM products
    `);

    console.log(
      `Total products: ${count.rows[0].count}`
    );

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();