require("dotenv").config();

const pool = require("./src/db/pool");

async function test() {
  try {
    const result = await pool.query(
      "SELECT NOW()"
    );

    console.log("Database Connected ✅");
    console.log(result.rows);

    process.exit(0);
  } catch (error) {
    console.error("Connection Failed ❌");
    console.error(error);

    process.exit(1);
  }
}

test();