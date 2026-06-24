function encodeCursor(createdAt, id) {
  return Buffer.from(
    JSON.stringify({
      createdAt,
      id,
    })
  ).toString("base64");
}

function decodeCursor(cursor) {
  return JSON.parse(
    Buffer.from(cursor, "base64").toString()
  );
}

module.exports = {
  encodeCursor,
  decodeCursor,
};