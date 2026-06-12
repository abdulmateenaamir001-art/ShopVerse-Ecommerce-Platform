import PDFDocument from 'pdfkit';

/**
 * Generates a standard store invoice PDF layout using raw coordinates
 * @param {Object} order - The populated Mongoose order document
 * @param {Stream} writeStream - Direct destination write stream (Pass-through or file)
 */
export const generateInvoicePDF = (order, writeStream) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Pipe the document rendering stream to our target handler
  doc.pipe(writeStream);

  const orderShortId = order._id.toString().substring(0, 8).toUpperCase();

  // ================= 🏛️ HEADER LOGO & COMPANY DATA =================
  doc.fillColor('#4f46e5').fontSize(28).text('ShopVerse', 50, 50, { bold: true });
  doc.fillColor('#6b7280').fontSize(9).text('E-COMMERCE MARKETPLACE CORP.', 50, 85);
  doc.text('National University of Technology (NUTECH)', 50, 100);
  doc.text('Support: support@shopverse.com', 50, 115);

  // Invoice Meta-Data Block (Right Aligned)
  doc.fillColor('#1f2937').fontSize(18).text('INVOICE / RECEIPT', 350, 50, { align: 'right' });
  doc.fontSize(10).fillColor('#4b5563');
  doc.text(`Invoice ID: #INV-${orderShortId}`, 350, 75, { align: 'right' });
  doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 350, 90, { align: 'right' });
  doc.text(`Payment Status: SETTLED`, 350, 105, { align: 'right', colors: '#10b981' });

  // Divider Line
  doc.moveTo(50, 140).lineTo(550, 140).strokeColor('#e5e7eb').lineWidth(1).stroke();

  // ================= 👤 BILLING & SHIPPING SPECIFICATIONS =================
  doc.fillColor('#1f2937').fontSize(12).text('Bill To:', 50, 160, { font: 'Helvetica-Bold' });
  doc.fontSize(10).fillColor('#4b5563');
  doc.text(`Customer Name: ${order.user.name}`, 50, 175);
  doc.text(`Email Address: ${order.user.email}`, 50, 190);

  const { address, city, postalCode, country } = order.shippingAddress || {};
  doc.fillColor('#1f2937').fontSize(12).text('Ship Destination:', 300, 160, { font: 'Helvetica-Bold' });
  doc.fontSize(10).fillColor('#4b5563');
  doc.text(`${address || 'N/A'}`, 300, 175);
  doc.text(`${city || 'N/A'}, ${postalCode || 'N/A'}`, 300, 190);
  doc.text(`${country || 'N/A'}`, 300, 205);

  // ================= 🛒 ITEM DETAILS DATA TABLE =================
  let tableTopY = 240;

  // Table Headers Layout
  doc.fillColor('#1f2937').fontSize(10);
  doc.text('Item Description / Name', 50, tableTopY, { font: 'Helvetica-Bold' });
  doc.text('Unit Price', 300, tableTopY, { font: 'Helvetica-Bold', width: 70, align: 'right' });
  doc.text('Qty', 400, tableTopY, { font: 'Helvetica-Bold', width: 40, align: 'center' });
  doc.text('Line Total', 480, tableTopY, { font: 'Helvetica-Bold', width: 70, align: 'right' });

  // Header Border Underline
  doc.moveTo(50, tableTopY + 15).lineTo(550, tableTopY + 15).strokeColor('#9ca3af').lineWidth(1).stroke();

  // Render Purchased Items Dynamically with Safe Fallbacks
  let currentY = tableTopY + 25; // 💡 ONLY DECLARED ONCE NOW!
  order.orderItems.forEach((item) => {
    
    const itemQty = item.qty || item.quantity || 1; 
    const itemPrice = item.price || 0;
    const lineTotal = itemQty * itemPrice;

    doc.fillColor('#4b5563');
    
    // Column 1: Item Name Description
    doc.text(item.name || 'ShopVerse Product', 50, currentY, { width: 230, height: 20 });
    
    // Column 2: Unit Price
    doc.text(`$${itemPrice.toFixed(2)}`, 300, currentY, { width: 70, align: 'right' });
    
    // Column 3: Quantity (Ensuring it forces a plain clean number string)
    doc.text(String(itemQty), 400, currentY, { width: 40, align: 'center' });
    
    // Column 4: Line Total (No more NaN)
    doc.text(`$${lineTotal.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });
    
    currentY += 25;
  });

  // Table Bottom Separation Line
  doc.moveTo(50, currentY).lineTo(550, currentY).strokeColor('#e5e7eb').lineWidth(0.5).stroke();

  // ================= 💵 FINANCIAL PRICING SUMMARY CARD =================
  currentY += 15;
  doc.fillColor('#4b5563').fontSize(10);
  
  doc.text('Subtotal items:', 350, currentY, { width: 110, align: 'right' });
  doc.text(`$${order.itemsPrice.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });
  
  currentY += 15;
  doc.text('Shipping Fees:', 350, currentY, { width: 110, align: 'right' });
  doc.text(`$${order.shippingPrice.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });
  
  currentY += 15;
  doc.text('Calculated Tax:', 350, currentY, { width: 110, align: 'right' });
  doc.text(`$${order.taxPrice.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });
  
  // Total Highlights Line Block
  currentY += 20;
  doc.moveTo(350, currentY - 5).lineTo(550, currentY - 5).strokeColor('#4f46e5').lineWidth(1).stroke();
  
  doc.fillColor('#4f46e5').fontSize(12).text('Total Charged:', 350, currentY, { font: 'Helvetica-Bold', width: 110, align: 'right' });
  doc.text(`$${order.totalPrice.toFixed(2)}`, 480, currentY, { font: 'Helvetica-Bold', width: 70, align: 'right' });

  // Footer Closing Remarks Note
  doc.fillColor('#9ca3af').fontSize(9).text('Thank you for making a purchase with ShopVerse!', 50, 750, { align: 'center', italic: true });

  // Finalize compile steps
  doc.end();
};