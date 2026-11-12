
const { sessions } = require("../controllers/paymentController");

exports.checkPdfAccess = (req, res, next) => {
  const { id } = req.params;
  const sessionId = req.cookies.pdf_session;

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(403).json({
      success: false,
      message: "Please purchase this PDF first."
    });
  }

  const purchasedPdfs = sessions.get(sessionId);

  if (!purchasedPdfs.has(id)) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this PDF."
    });
  }

  next();
};
