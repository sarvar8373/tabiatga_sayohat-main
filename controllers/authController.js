import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DB } from "../utils/db.js";
import util from "util";

const salt = 10;
const query = util.promisify(DB.query).bind(DB);
const JWT_SECRET = "jwt_secret_key";

// Handle user login
export const loginUser = async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    const users = await query("SELECT * FROM users WHERE phone_number = ?", [
      phone_number,
    ]);

    if (users.length === 0) {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "Raqam topilmadi" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ loginStatus: false, Error: "Parol xato" });
    }

    // Token yaratish
    const payload = {
      id: user.id,
      phone_number: user.phone_number,
      full_name: user.full_name,
      role: user.role,
      region_id: user.region_id,
      district_id: user.district_id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return res.json({
      loginStatus: true,
      token: token,
      user: payload, // Frontend kutayotgan format
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ loginStatus: false, Error: "Server xatosi" });
  }
};

// Handle user logout
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
};
// Add a new user
export const addUser = async (req, res) => {
  const { phone_number, full_name, password, role = "customer" } = req.body;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const sql =
      "INSERT INTO users (phone_number, full_name, password, role) VALUES (?, ?, ?, ?)";
    await query(sql, [phone_number, full_name, hash, role]);

    return res.json({ Status: true });
  } catch (err) {
    return res
      .status(500)
      .json({ Status: false, Error: "Query xatosi yoki foydalanuvchi mavjud" });
  }
};

// Get user info
export const getUserInfo = (req, res) => {
  // verifyUser middleware req.user ni to'ldirib beradi
  if (!req.user || !req.user.id) {
    return res
      .status(404)
      .json({ Status: false, Message: "Foydalanuvchi topilmadi" });
  }

  // Frontend App.js dagi dispatch(authSuccess(response.user)) ga moslash
  return res.json({
    Status: true,
    user: {
      id: req.user.id,
      phone_number: req.user.phone_number,
      full_name: req.user.full_name,
      role: req.user.role,
      region_id: req.user.region_id,
      district_id: req.user.district_id,
    },
  });
};
// Check if phone number exists
const checkPhoneNumber = (req, res) => {
  const { phone_number } = req.body;
  const sql = "SELECT * FROM users WHERE phone_number = ?";
  DB.query(sql, [phone_number], (err, result) => {
    if (err)
      return res.status(500).json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, exists: result.length > 0 });
  });
};

// Update user details
export const updateUser = async (req, res) => {
  const userID = req.params.id;
  const { phone_number, full_name, password, role, region_id, district_id } =
    req.body;

  try {
    let sql, values;

    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, saltRounds);
      sql =
        "UPDATE users SET phone_number=?, full_name=?, password=?, role=?, region_id=?, district_id=? WHERE id=?";
      values = [
        phone_number,
        full_name,
        hash,
        role,
        region_id,
        district_id,
        userID,
      ];
    } else {
      sql =
        "UPDATE users SET phone_number=?, full_name=?, role=?, region_id=?, district_id=? WHERE id=?";
      values = [phone_number, full_name, role, region_id, district_id, userID];
    }

    const result = await query(sql, values);

    if (result.affectedRows > 0) {
      const updatedUser = await query(
        "SELECT id, phone_number, full_name, role, region_id, district_id FROM users WHERE id = ?",
        [userID],
      );
      return res.json({ Status: true, Result: updatedUser[0] });
    }

    return res.status(404).json({ Status: false, Error: "Topilmadi" });
  } catch (err) {
    return res.status(500).json({ Status: false, Error: "Database xatosi" });
  }
};

// Retrieve user by ID
const getUserById = (req, res) => {
  const userID = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";
  DB.query(sql, [userID], (err, result) => {
    if (err)
      return res.status(500).json({ Status: false, Error: "Query error" });
    return result.length > 0
      ? res.json({ Status: true, Result: result[0] })
      : res.status(404).json({ Status: false, Error: "User not found" });
  });
};

// Retrieve all users
const getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  DB.query(sql, (err, result) => {
    if (err)
      return res.status(500).json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
};

// Delete a user by ID
const deleteUser = (req, res) => {
  const userID = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";
  DB.query(sql, [userID], (err, result) => {
    if (err)
      return res.status(500).json({ Status: false, Error: "Query error" });
    return result.affectedRows > 0
      ? res.json({ Status: true, Message: "User deleted successfully" })
      : res
          .status(404)
          .json({ Status: false, Error: "User not found or already deleted" });
  });
};

// Handle SQL query results
const handleQueryResult = (res) => (err, result) => {
  if (err) return res.status(500).json({ Status: false, Error: "Query error" });
  return result.affectedRows > 0
    ? res.json({ Status: true, Message: "Operation successful" })
    : res
        .status(404)
        .json({ Status: false, Error: "User not found or not updated" });
};

export { checkPhoneNumber, getUserById, getAllUsers, deleteUser };
