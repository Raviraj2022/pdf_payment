
const fs = require("fs");
const pdfDocuments = require("../data/pdfData");

exports.getAllPdfs = (req, res) => {
  const pdfs = pdfDocuments.map(pdf => ({
    id: pdf.id,
    title: pdf.title,
    description: pdf.description,
    price: pdf.price,
    currency: pdf.currency,
    thumbnail: pdf.thumbnail
  }));

  res.json({
    success: true,
    data: pdfs
  });
};

exports.getPdfDetails = (req, res) => {
  const pdf = pdfDocuments.find(
    item => item.id === req.params.id
  );

  if (!pdf) {
    return res.status(404).json({
      success: false,
      message: "PDF not found"
    });
  }

  res.json({
    success: true,
    data: {
      id: pdf.id,
      title: pdf.title,
      description: pdf.description,
      price: pdf.price,
      currency: pdf.currency,
      thumbnail: pdf.thumbnail
    }
  });
};

exports.viewPdf = (req, res) => {
  const pdf = pdfDocuments.find(
    item => item.id === req.params.id
  );

  if (!pdf || !fs.existsSync(pdf.filePath)) {
    return res.status(404).json({
      success: false,
      message: "PDF file not found"
    });
  }

  res.sendFile(pdf.filePath, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store"
    }
  });
};

exports.downloadPdf = (req, res) => {
  const pdf = pdfDocuments.find(
    item => item.id === req.params.id
  );

  if (!pdf || !fs.existsSync(pdf.filePath)) {
    return res.status(404).json({
      success: false,
      message: "PDF file not found"
    });
  }

  res.download(pdf.filePath, pdf.filename);
};
