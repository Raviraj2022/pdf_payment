
const crypto = require("crypto");
const { randomUUID } = require("crypto");

const razorpay = require("../config/razorpay");
const pdfDocuments = require("../data/pdfData");

// Temporary storage for development.
// Later replace these Maps with database tables.
const orders = new Map();
const sessions = new Map();

// CREATE ORDER
exports.createOrder = async (req, res) => {
//     console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
// console.log(
//   "Secret loaded:",
//   Boolean(process.env.RAZORPAY_KEY_SECRET)
// );
  try {
    const { pdfId } = req.body;

    const pdf = pdfDocuments.find(item => item.id === pdfId);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found"
      });
    }

    const order = await razorpay.orders.create({
      amount: pdf.price * 100,
      currency: "INR",
      receipt: `receipt_${pdf.id}_${Date.now()}`,
      notes: {
        pdfId: pdf.id
      }
    });

    orders.set(order.id, pdf.id);

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      pdf: {
        id: pdf.id,
        title: pdf.title
      }
    });

  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create payment order"
    });
  }
};


// VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const pdfId = orders.get(razorpay_order_id);

    if (!pdfId || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment details"
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const signatureBuffer = Buffer.from(generatedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    if (
      signatureBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed"
      });
    }

    // Confirm the actual payment with Razorpay.
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      payment.currency !== "INR"
    ) {
      return res.status(409).json({
        success: false,
        message: "Payment is not captured yet"
      });
    }

    const pdf = pdfDocuments.find(item => item.id === pdfId);

    if (!pdf || payment.amount !== pdf.price * 100) {
      return res.status(400).json({
        success: false,
        message: "Payment amount validation failed"
      });
    }

    // Create or reuse a browser access session.
    let sessionId = req.cookies.pdf_session;

    if (!sessionId || !sessions.has(sessionId)) {
      sessionId = randomUUID();
      sessions.set(sessionId, new Set());
    }

    sessions.get(sessionId).add(pdfId);

    res.cookie("pdf_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/"
    });

    orders.delete(razorpay_order_id);

    return res.json({
      success: true,
      message: "Payment verified. PDF access granted.",
      pdfId
    });

  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};

module.exports.sessions = sessions;
