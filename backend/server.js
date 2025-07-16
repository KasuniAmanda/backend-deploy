const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // Load .env variables


const app = express();
const PORT = 8080;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Import Routes

const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategory');
const reportRoutes = require('./routes/reportRoutes');
const salesRoutes = require('./routes/salesRoutes');
const catalogRoutes = require('./routes/catalogRoutes');

const purchasesRoutes = require('./routes/purchasesRoutes');
const purchasereportRoutes = require('./routes/purchasereportRoutes');
app.use('/api/purchase-report', purchasereportRoutes);


const billRoutes = require('./routes/billRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const returnRoutes = require('./routes/returnRoutes');
const refundRoutes = require('./routes/refundRoutes'); // ✅ Added refund routes
const productSalesRoutes = require('./routes/productSales'); // ✅ Order routes



// ✅ Use Routes

app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/purchase', purchasesRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/refunds', refundRoutes); // ✅ Refund route in use
app.use('/api/productsales', productSalesRoutes);

// === Serve React build ===
// 1) Serve all files from frontend/dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 2) Fallback to index.html for client‑side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// ✅ MongoDB connection using your Atlas connection string from .env
const mongoURI = process.env.MONGODB_URI || '';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));




// ✅ Start server
app.listen(PORT, () => {

  console.log(`🚀 Server running at http://localhost:${PORT}`);
});