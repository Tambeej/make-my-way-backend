import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  // const token = req.header("Authorization")?.replace("Bearer ", "");
  const token = req.cookies.accessToken;

  if (!token) {
    throw { status: 401, message: "No token provided" };
  }
  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next({ status: 401, message: "Token expired" });
    }
    return next({ status: 401, message: "Invalid token" });
  }
};

export default authenticate;
