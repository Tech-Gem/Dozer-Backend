// middleware/otp.js
const setUserPhoneNumber = (req, res, next) => {
  const { phoneNumber } = req.body;
  if (phoneNumber) {
    req.session.phoneNumber = phoneNumber;
    next();
  } else {
    res
      .status(400)
      .json({ error: "Phone number is missing in the request body" });
  }
};

module.exports = { setUserPhoneNumber };
