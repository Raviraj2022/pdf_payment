
const express = require("express");
const router = express.Router();

const pdfController = require("../controllers/pdfController");
const { checkPdfAccess } = require("../middleware/auth");

router.get("/", pdfController.getAllPdfs);

router.get("/:id", pdfController.getPdfDetails);

router.get(
  "/:id/view",
  checkPdfAccess,
  pdfController.viewPdf
);

router.get(
  "/:id/download",
  checkPdfAccess,
  pdfController.downloadPdf
);

module.exports = router;
