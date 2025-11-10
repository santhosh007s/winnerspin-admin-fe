// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const {
//   PromoterModel,
//   SeasonModel,
//   CustomerModel,
//   PromoterSeasonModel,
// } = require("../data-base/schema");
// const Admin_key = process.env.AUTH_JWT_SECRET_ADMIN;
// const Promoter_key = process.env.AUTH_JWT_SECRET_PROMOTER;
// const Customer_key = process.env.AUTH_JWT_SECRET_CUSTOMER;

// async function authMiddleware(req, res, next) {
//   const token = req.headers["token"];
//   if (!token) {
//     return res.status(401).json({ message: "Token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, Admin_key);
//     req.admin = { id: decoded.id };
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// }

// module.exports = authMiddleware;

// async function promoterAuthMiddleware(req, res, next) {
//   const token = req.headers["token"];
//   const seasonId = req.headers["seasonid"]; // Read seasonId from headers

//   if (!token) {
//     return res.status(401).json({ message: "Token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, Promoter_key);

//     if (!decoded) {
//       return res.status(401).json({
//         message: "Unauthorized Promoter",
//       });
//     }
//     // Check admin approved or not
//     const promoter = await PromoterModel.findById(decoded.id);

//     if (!promoter) {
//       return res.status(401).json({
//         message: "Promoter not found",
//       });
//     }

//     // Add check for promoter's active status
//     if (!promoter.isActive) {
//       return res.status(403).json({
//         message:
//           "Your account has been deactivated. Please contact the administrator.",
//       });
//     }

//     // The middleware now primarily attaches the promoter's core ID.
//     // Individual routes are responsible for checking season-specific status.
//     // However, we can still do a basic approval check here if a seasonId is provided.
//     let isApprovedInSeason = false;
//     if (seasonId) {
//       const promoterSeasonData = await PromoterSeasonModel.findOne({
//         promoter: promoter._id,
//         season: seasonId,
//       });
//       if (promoterSeasonData && promoterSeasonData.status === "approved") {
//         isApprovedInSeason = true;
//       }
//     }

//     req.promoter = {
//       _id: decoded.id,
//       isApproved: isApprovedInSeason, // This property reflects approval for the *specific season* if provided
//     };

//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// }

// async function customerAuthMiddleware(req, res, next) {
//   console.log("hello");
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies && req.cookies.customer_token) {
//     token = req.cookies.customer_token;
//   } else if (req.headers["token"]) {
//     // Fallback for existing header
//     token = req.headers["token"];
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, Customer_key);
//     if (!decoded || !decoded.id) {
//       return res.status(401).json({ message: "Unauthorized Customer" });
//     }

//     const customer = await CustomerModel.findById(decoded.id);
//     if (!customer) {
//       return res.status(401).json({ message: "Customer not found" });
//     }

//     req.customer = {
//       _id: decoded.id,
//     };

//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// }

// module.exports = {
//   authMiddleware,
//   promoterAuthMiddleware,
//   customerAuthMiddleware,
// };
