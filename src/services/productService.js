const pool = require("../db/pool");

async function getProducts({
  limit,
  category,
  cursorData,
}) {
  const values = [];
  let paramIndex = 1;

  let query = `
    SELECT
      id,
      name,
      category,
      price,
      created_at
    FROM products
  `;

  const conditions = [];

  if (category) {
    conditions.push(
      `category = $${paramIndex++}`
    );
    values.push(category);
  }

  if (cursorData) {
    conditions.push(`
      (
        created_at < $${paramIndex}
        OR
        (
          created_at = $${paramIndex}
          AND id < $${paramIndex + 1}
        )
      )
    `);

    values.push(cursorData.createdAt);
    values.push(cursorData.id);

    paramIndex += 2;
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += `
    ORDER BY created_at DESC, id DESC
    LIMIT $${paramIndex}
  `;

  values.push(limit);

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
}

module.exports = {
  getProducts,
};