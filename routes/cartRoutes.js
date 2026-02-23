import express from "express";
import { DB } from "../utils/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Savatni olish
router.get("/", authMiddleware, (req, res) => {
  const sql = `
    SELECT c.*, t.title, t.price
    FROM cart c
    JOIN tours t ON t.id = c.tour_id
    WHERE c.user_id = ?
  `;

  DB.query(sql, [req.user.id], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    res.json({ Status: true, Result: result });
  });
});

// Savatga qo‘shish
router.post("/from-cart", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const getCartSql = `
    SELECT c.*, t.price
    FROM cart c
    JOIN tours t ON t.id = c.tour_id
    WHERE c.user_id = ?
  `;

  DB.query(getCartSql, [userId], (err, cart) => {
    if (cart.length === 0)
      return res.json({ Status: false, Error: "Savat bo‘sh" });

    cart.forEach((item) => {
      DB.query(
        `INSERT INTO orders (user_id, tour_id, quantity, total_price)
         VALUES (?, ?, ?, ?)`,
        [userId, item.tour_id, item.quantity, item.quantity * item.price]
      );
    });

    DB.query("DELETE FROM cart WHERE user_id = ?", [userId]);

    res.json({ Status: true, Message: "Order yaratildi" });
  });
});

// Savatdan o‘chirish
router.delete("/:tour_id", authMiddleware, (req, res) => {
  DB.query(
    "DELETE FROM cart WHERE user_id = ? AND tour_id = ?",
    [req.user.id, req.params.tour_id],
    () => res.json({ Status: true })
  );
});

// Savatni tozalash
router.delete("/", authMiddleware, (req, res) => {
  DB.query("DELETE FROM cart WHERE user_id = ?", [req.user.id], () =>
    res.json({ Status: true })
  );
});

export const CartRouter = router;
