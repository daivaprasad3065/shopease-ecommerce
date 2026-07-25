// // backend/src/utils/orderNotification.js

// const { sendEmail } = require("../utils/nodemailer");

// exports.sendOrderNotifications = async (order, user, formattedAddress, totalAmount, updatedProducts) => {
    
//     // --- Helper to generate the Date string ---
//     const orderDate = new Date().toLocaleDateString('en-IN', {
//         year: 'numeric', month: 'long', day: 'numeric',
//         hour: '2-digit', minute: '2-digit'
//     });

//     // --- 1. USER EMAIL TEMPLATE (The Receipt) ---
//     const emailSubject = `Order Placed Successfully! ID: ${order._id}`;
    
//     const emailContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
//         <div style="background-color: #2563EB; padding: 20px; text-align: center; color: white;">
//             <h1 style="margin: 0; font-size: 24px;">Satya's Fashion Book</h1>
//             <p style="margin: 5px 0 0; font-size: 14px;">Thank you for your purchase!</p>
//         </div>

//         <div style="padding: 20px;">
//             <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
//             <p style="color: #555; line-height: 1.5;">
//                 Your order has been successfully placed. We are getting it ready for shipment. 
//                 You can pay <strong>₹${totalAmount}</strong> via Cash on Delivery when it arrives.
//             </p>

//             <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #eee;">
//                 <p style="margin: 0 0 10px; font-size: 14px;"><strong>Order ID:</strong> <span style="color: #2563EB;">${order._id}</span></p>
//                 <p style="margin: 0; font-size: 14px;"><strong>Date:</strong> ${orderDate}</p>
//             </div>

//             <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; color: #333;">Order Summary</h3>
//             <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//                 <thead>
//                     <tr style="background-color: #f3f4f6; text-align: left;">
//                         <th style="padding: 10px; font-size: 14px; border-bottom: 1px solid #ddd;">Item</th>
//                         <th style="padding: 10px; font-size: 14px; border-bottom: 1px solid #ddd; text-align: center;">Qty</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${updatedProducts.map(item => `
//                         <tr>
//                             <td style="padding: 10px; border-bottom: 1px solid #eee; color: #555;">
//                                 <div style="font-weight: bold; color: #333;">${item.name}</div>
//                                 ${/* Check if Size or Color exists and display them */ ''}
//                                 ${(item.size || item.color) ? `
//                                     <div style="font-size: 12px; color: #777; margin-top: 4px;">
//                                         ${item.color ? `Color: ${item.color}` : ''} 
//                                         ${(item.color && item.size) ? '|' : ''} 
//                                         ${item.size ? `Size: ${item.size}` : ''}
//                                     </div>
//                                 ` : ''}
//                             </td>
//                             <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center; color: #555;">${item.quantity}</td>
//                         </tr>
//                     `).join("")}
//                 </tbody>
//                 <tfoot>
//                     <tr>
//                         <td style="padding: 15px 10px; font-weight: bold; color: #333; text-align: right;">Total Amount:</td>
//                         <td style="padding: 15px 10px; font-weight: bold; color: #2563EB; font-size: 18px; text-align: center;">₹${totalAmount}</td>
//                     </tr>
//                 </tfoot>
//             </table>

//             <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; color: #333;">Delivery Address</h3>
//             <p style="color: #555; line-height: 1.6; background-color: #f9fafb; padding: 15px; border-radius: 6px;">
//                 <strong>${user.name}</strong><br>
//                 ${formattedAddress.line1}<br>
//                 ${formattedAddress.line2 ? formattedAddress.line2 + '<br>' : ''}
//                 ${formattedAddress.city}, ${formattedAddress.state} - ${formattedAddress.pincode}<br>
//                 <strong>Phone:</strong> ${formattedAddress.phone}
//             </p>

//             <div style="text-align: center; margin-top: 30px;">
//                 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/account?view=orders" style="background-color: #2563EB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">View Order Status</a>
//             </div>
//         </div>

//         <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #888;">
//             <p>&copy; 2025 Fashion Book. All rights reserved.</p>
//             <p>Need help? Contact us at support@fashionbook.com</p>
//         </div>
//     </div>
//     `;


//     // --- 2. ADMIN EMAIL TEMPLATE (Action Oriented) ---
//     const adminEmailSubject = `🛒 New Order: ${order._id} - ₹${totalAmount}`;
    
//     const adminEmailContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #333;">
//         <div style="background-color: #333; padding: 15px; text-align: center; color: white;">
//             <h2 style="margin: 0;">New Order Received</h2>
//         </div>
//         <div style="padding: 20px;">
//             <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
//             <p><strong>Order ID:</strong> ${order._id}</p>
//             <p><strong>Total Value:</strong> <span style="font-size: 18px; font-weight: bold;">₹${totalAmount}</span></p>
            
//             <hr>
            
//             <h3>Items to Pack:</h3>
//             <ul>
//                 ${updatedProducts.map(item => `
//                     <li style="margin-bottom: 8px; border-bottom: 1px dashed #ccc; padding-bottom: 5px;">
//                         <strong>${item.quantity} x</strong> ${item.name}
//                         ${/* Display Variants for the Admin clearly */ ''}
//                         ${(item.size || item.color) ? `
//                             <br>
//                             <span style="font-family: monospace; color: #d63384; font-size: 14px; background-color: #f3f4f6; padding: 2px 5px; border-radius: 3px;">
//                                 [ ${item.color || 'No Color'} | Size: ${item.size || 'N/A'} ]
//                             </span>
//                         ` : ''}
//                     </li>
//                 `).join("")}
//             </ul>

//             <hr>

//             <h3>Shipping Label Info:</h3>
//             <div style="background-color: #eee; padding: 10px; font-family: monospace;">
//                 ${user.name}<br>
//                 ${formattedAddress.line1}, ${formattedAddress.line2 || ''}<br>
//                 ${formattedAddress.city}, ${formattedAddress.state} - ${formattedAddress.pincode}<br>
//                 Phone: ${formattedAddress.phone}
//             </div>
//         </div>
//     </div>
//     `;

//     // Admin Email
//     const adminEmail = "22pa1a4214@vishnu.edu.in"; 

//     await Promise.all([
//         sendEmail(user.email, emailSubject, emailContent),
//         sendEmail(adminEmail, adminEmailSubject, adminEmailContent)
//     ]);
// };