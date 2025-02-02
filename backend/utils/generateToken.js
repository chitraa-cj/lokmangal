import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  // Set JWT Token as HTTP Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV !== "development",
    secure: false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export default generateToken;
