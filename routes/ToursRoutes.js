import express from "express";
import { DB } from "../utils/db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

router.post("/add_tour", upload.fields([{ name: "images" }]), (req, res) => {
  console.log("🔹 Req body:", req.body);

  const {
    title,
    description,
    price,
    price_description,
    country,
    user_id,
    region_id,
    district_id,
    status,
    notification_id,
    tourism_service_id,
    start_date,
    end_date,
    age_limit,
    people_count,
    season,
    accommodation_type,
    meal_type,
    transport_type,
    risk_level,
    location,
    coordinates,
    max_booking,
  } = req.body;

  const organization_id = req.body.organization_id
    ? parseInt(req.body.organization_id)
    : null;

  console.log("✅ organization_id:", organization_id);

  if (!organization_id || isNaN(organization_id)) {
    return res.json({
      Status: false,
      Error: "organization_id topilmadi yoki noto‘g‘ri formatda",
    });
  }

  const cleanRegion = region_id ? parseInt(region_id) : null;
  const cleanDistrict = district_id ? parseInt(district_id) : null;

  const images = req.files?.images
    ? req.files.images.map((file) => file.filename).join(",")
    : "";

  const sql = `
INSERT INTO tours (
  images,
  tour,
  title,
  reviewStars,
  description,
  price,
  price_description,
  country,
  user_id,
  region_id,
  district_id,
  status,
  notification_id,
  organization_id,
  tourism_service_id,
  start_date,
  end_date,
  age_limit,
  people_count,
  season,
  accommodation_type,
  meal_type,
  transport_type,
  risk_level,
  location,
  coordinates,
  max_booking
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const values = [
    images,
    null, // tour (old cause maydoni), hozircha null
    title,
    null, // reviewStars hozir ishlatilmaydi, null yozamiz
    description,
    price,
    price_description,
    country,
    user_id,
    region_id,
    district_id,
    status,
    notification_id,
    organization_id,
    tourism_service_id, // "3,4,5"
    start_date,
    end_date,
    age_limit,
    people_count,
    season,
    accommodation_type,
    meal_type,
    transport_type,
    risk_level,
    location,
    coordinates,
    max_booking,
  ];

  console.log("🧾 VALUES:", values);

  DB.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.json({ Status: false, Error: err.sqlMessage });
    }

    res.json({ Status: true, Message: "Tour muvaffaqiyatli qo'shildi" });
  });
});

router.put("/tour/status/:id", (req, res) => {
  const tourID = req.params.id;
  const { status } = req.body;

  // Validate status
  if (status === undefined) {
    return res.status(400).json({ Status: false, Error: "Status is required" });
  }

  const sql = "UPDATE tours SET status = ? WHERE id = ?";
  const params = [status, tourID];

  DB.query(sql, params, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ Status: false, Error: "Query error" });
    }

    if (result.affectedRows > 0) {
      return res.json({
        Status: true,
        Message: "Tour status updated successfully",
      });
    } else {
      return res.status(404).json({
        Status: false,
        Error: "Tour not found or status not updated",
      });
    }
  });
});

router.put("/tour/cause/:id", (req, res) => {
  const tourID = req.params.id;
  const { cause } = req.body;

  // Validate cause
  if (cause === undefined) {
    return res.status(400).json({ Status: false, Error: "Cause is required" });
  }

  const sql = "UPDATE tours SET tour = ? WHERE id = ?";
  const params = [cause, tourID];

  DB.query(sql, params, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ Status: false, Error: "Query error" });
    }

    if (result.affectedRows > 0) {
      return res.json({
        Status: true,
        Message: "Tour cause updated successfully",
      });
    } else {
      return res.status(404).json({
        Status: false,
        Error: "Tour not found or cause not updated",
      });
    }
  });
});

// Route to delete a tour by ID
router.delete("/tour/:id", (req, res) => {
  const tourId = req.params.id;

  // SQL query to delete the tour
  const sql = "DELETE FROM tours WHERE id = ?";

  DB.query(sql, [tourId], (err, result) => {
    if (err) {
      console.error("Error deleting tour:", err);
      return res.json({ Status: false, Error: "Query error" });
    }

    if (result.affectedRows > 0) {
      return res.json({
        Status: true,
        Message: "Tour deleted successfully",
      });
    } else {
      return res.json({
        Status: false,
        Error: "Tour not found or already deleted",
      });
    }
  });
});

// Route to update a tour by ID
router.put("/tour/:id", upload.array("images"), (req, res) => {
  const tourID = req.params.id;
  const {
    title,
    description,
    price,
    price_description,
    region_id,
    district_id,
    status,
    tourism_service_id,
    organization_id,
    start_date,
    end_date,
    age_limit,
    people_count,
    season,
    accommodation_type,
    meal_type,
    transport_type,
    risk_level,
    location,
    coordinates,
    max_booking,
  } = req.body;
  const newImages = req.files
    ? req.files.map((file) => file.filename).join(",")
    : null;

  let sql = `
    UPDATE tours 
    SET title = ?, 
        description = ?, 
        tourism_service_id = ?, 
        price = ?, 
        price_description = ?, 
        region_id = ?, 
        district_id = ?, 
        status = ?, 
        organization_id = ?,
        start_date= ?,
        end_date= ?,
        age_limit= ?,
        people_count= ?,
        season= ?,
        accommodation_type= ?,
        meal_type= ?,
        transport_type= ?,
        risk_level= ?,
        location= ?,
        coordinates= ?,
        max_booking`;

  let params = [
    title,
    description,
    tourism_service_id,
    price,
    price_description,
    region_id,
    district_id,
    status,
    organization_id,
    start_date,
    end_date,
    age_limit,
    people_count,
    season,
    accommodation_type,
    meal_type,
    transport_type,
    risk_level,
    location,
    coordinates,
    max_booking,
  ];

  if (newImages) {
    sql += ", images = ?";
    params.push(newImages);
  }

  sql += " WHERE id = ?";
  params.push(tourID);

  DB.query(sql, params, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.json({ Status: false, Error: "Query error" });
    }

    if (result.affectedRows > 0) {
      DB.query("SELECT * FROM tours WHERE id = ?", [tourID], (err, rows) => {
        if (err) {
          console.error("SQL Error:", err);
          return res.json({ Status: false, Error: "Query error" });
        }

        return res.json({ Status: true, Result: rows[0] });
      });
    } else {
      return res.json({
        Status: false,
        Error: "Tour not found or not updated",
      });
    }
  });
});

// Route to get a tour by ID
router.get("/tour/:id", (req, res) => {
  const tourId = req.params.id;
  const sql = "SELECT * FROM tours WHERE id = ?";

  DB.query(sql, [tourId], (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "Query error" });
    }

    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "Tour not found" });
    }
  });
});

// Route to get all tours
router.get("/", (req, res) => {
  const userId = req.query.user_id; // Assuming user_id is passed as a query parameter
  const sql = userId
    ? "SELECT * FROM tours WHERE user_id = ?"
    : "SELECT * FROM tours";

  DB.query(sql, userId ? [userId] : [], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});

export { router as ToursRouter };
