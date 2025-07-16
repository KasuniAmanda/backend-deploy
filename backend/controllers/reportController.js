const Invoice = require('../models/invoice'); // adjust path as needed

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const invoices = await Invoice.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.itemName',
          totalQuantity: { $sum: '$items.quantity' },
          totalSales: {
            $sum: {
              $multiply: [
                '$items.quantity',
                { $toDouble: '$items.itemPrice' }
              ]
            }
          },
          totalProfit: {
            $sum: {
              $multiply: [
                '$items.quantity',
                { $toDouble: '$items.profit' }
              ]
            }
          }
        }
      }
    ]);

    res.json(invoices);
  } catch (err) {
    console.error('Error generating sales report:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
