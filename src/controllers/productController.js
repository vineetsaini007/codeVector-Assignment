const productService = require(
  "../services/productService"
);

const {
  encodeCursor,
  decodeCursor,
} = require("../utils/cursor");

async function getProducts(req, res) {
  try {
    const limit = Math.min(
      Number(req.query.limit) || 20,
      100
    );

    const category =
      req.query.category || null;

    let cursorData = null;

    if (req.query.cursor) {
      cursorData = decodeCursor(
        req.query.cursor
      );
    }

    const products =
      await productService.getProducts({
        limit,
        category,
        cursorData,
      });

    let nextCursor = null;

    if (products.length === limit) {
      const last =
        products[products.length - 1];

      nextCursor = encodeCursor(
        last.created_at,
        last.id
      );
    }

    res.status(200).json({
      success: true,
      count: products.length,
      nextCursor,
      data: products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  getProducts,
};