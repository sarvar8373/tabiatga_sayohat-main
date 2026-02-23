import jwt from "jsonwebtoken";

// Middleware to verify JWT tokens
const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Agar header yo'q bo'lsa yoki "Token " bilan boshlanmasa
  if (!authHeader || !authHeader.startsWith("Token ")) {
    return res
      .status(401)
      .json({ Status: false, Message: "Avtorizatsiya xatosi" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ Status: false, Message: "Token not provided" });
  } else {
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ Status: false, Message: "Authentication error" });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

export { verifyUser };
