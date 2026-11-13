
const path = require("path");

const PDF_PRICE = 99;

if (!Number.isInteger(PDF_PRICE) || PDF_PRICE <= 0) {
  throw new Error("Please configure a valid PDF_PRICE_INR in .env");
}

const privateDirectory = path.join(__dirname, "../private-pdfs");

const pdfDocuments = [
  {
    id: "cosmology-insights",
    title: "Cosmology Insights",
    description: "Consciousness, Brahman, Shunya and cosmology.",
    filename: "Cosmology_Insights.pdf"
  },
  {
    id: "soul-karma-rebirth",
    title: "Soul, Karma & Rebirth",
    description: "Soul, Atman, Jiva, Karma and Rebirth.",
    filename: "STAPS.pdf"
  },
  {
    id: "dvbl",
    title: "Dharmic Values-Based Leadership",
    description: "Dharma, Nishkama Karma and Lokasangraha.",
    filename: "DVBL.pdf"
  },
  {
    id: "djtl",
    title: "Dharma-Justice Transformational Leadership",
    description: "Human transformation and organisational sustainability.",
    filename: "transformational-leadership-text.pdf"
  },
  {
    id: "spiritual-organisation-leadership",
    title: "Spiritual Organisational Leadership",
    description: "Spirituality, ethics and organisational leadership.",
    filename: "Spritual_Organisation_Leadership.pdf"
  },
  {
    id: "spiritual-intelligence",
    title: "Spiritual Intelligence, Self-Awareness & Meaning-Making",
    description: "Spiritual intelligence and consciousness growth.",
    filename: "spritual-intelligence.pdf"
  }
].map(pdf => ({
  ...pdf,
  price: PDF_PRICE,
  currency: "INR",
  filePath: path.join(privateDirectory, pdf.filename)
}));

module.exports = pdfDocuments;
