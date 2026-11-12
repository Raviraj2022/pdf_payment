
const path = require("path");

const pdfDocuments = [
  {
    id: "pdf_001",
    title: "Complete JavaScript Guide",
    description: "Learn JavaScript from fundamentals to advanced concepts.",
    price: 99,
    currency: "INR",
    thumbnail: "/images/javascript.png",
    filename: "javascript-guide.pdf",
    filePath: path.join(__dirname, "../private-pdfs/javascript-guide.pdf")
  },
  {
    id: "pdf_002",
    title: "Node.js Backend Development",
    description: "Learn backend development using Node.js and Express.",
    price: 149,
    currency: "INR",
    thumbnail: "/images/nodejs.png",
    filename: "nodejs-guide.pdf",
    filePath: path.join(__dirname, "../private-pdfs/nodejs-guide.pdf")
  },
  {
    id: "pdf_003",
    title: "Complete React Guide",
    description: "Learn React with practical examples.",
    price: 199,
    currency: "INR",
    thumbnail: "/images/react.png",
    filename: "react-guide.pdf",
    filePath: path.join(__dirname, "../private-pdfs/react-guide.pdf")
  }
];

module.exports = pdfDocuments;
