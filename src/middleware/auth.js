import jwt from "jsonwebtoken";
import { asyncHandler } from "./catchError.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("No token, authorization denied");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // You can access this in your routes
    next();
  } catch (err) {
    err.statusCode = 401;
    err.message = "Token is not valid or expired";
    throw err;
  }
});