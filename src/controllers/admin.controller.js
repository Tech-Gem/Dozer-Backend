// const { RenterProfile } = require("../models");

// exports.verifyRenter = async (req, res) => {
//   try {
//     const { renterId } = req.params;

//     // Find the renter by ID
//     const renter = await RenterProfile.findOne({ _id: renterId });

//     if (!renter) {
//       return res.status(404).json({ error: "Renter not found" });
//     }

//     // Update the verification status
//     renter.isVerified = true;
//     await renter.save();

//     res.json({ message: "Renter account verified successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
