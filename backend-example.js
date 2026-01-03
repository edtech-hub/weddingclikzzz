/*
 * Backend Example - Node.js/Express Server for Email Handling
 *
 * This is a sample backend implementation for sending invoices via email
 * Install required packages: npm install express nodemailer cors body-parser
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('.')); // Serve static files

// Email configuration
const emailConfig = {
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
        user: 'your-email@gmail.com', // Your email
        pass: 'your-app-password'      // App-specific password
    }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Send invoice endpoint
app.post('/api/send-invoice', async (req, res) => {
    try {
        const {
            clientEmail,
            clientName,
            pdfBase64,
            invoiceNumber,
            weddingDate,
            total
        } = req.body;

        // Validate required fields
        if (!clientEmail || !clientName || !pdfBase64) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Email to customer
        const customerMailOptions = {
            from: {
                name: 'WeddingClikzzz',
                address: emailConfig.auth.user
            },
            to: clientEmail,
            subject: `Your Wedding Photography Booking Invoice - ${invoiceNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0;">WeddingClikzzz</h1>
                        <p style="margin: 10px 0 0 0; font-style: italic;">Capturing Your Beautiful Moments</p>
                    </div>

                    <div style="padding: 30px; background: #f8f9fa;">
                        <h2 style="color: #667eea;">Dear ${clientName},</h2>

                        <p style="font-size: 16px; line-height: 1.6;">
                            Thank you for choosing WeddingClikzzz for your special day!
                        </p>

                        <p style="font-size: 16px; line-height: 1.6;">
                            We are thrilled to be part of your wedding celebration on <strong>${new Date(weddingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
                        </p>

                        <p style="font-size: 16px; line-height: 1.6;">
                            Please find your booking invoice attached to this email. The total amount for your selected services is <strong>₹${total.toLocaleString('en-IN')}</strong>.
                        </p>

                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #667eea; margin-top: 0;">Next Steps:</h3>
                            <ul style="line-height: 1.8;">
                                <li>Review the invoice and confirm all details are correct</li>
                                <li>Pay 50% advance to confirm your booking</li>
                                <li>Our team will contact you within 24 hours</li>
                            </ul>
                        </div>

                        <p style="font-size: 16px; line-height: 1.6;">
                            If you have any questions or need to make changes, please don't hesitate to contact us.
                        </p>

                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            We look forward to capturing your beautiful moments!
                        </p>

                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

                        <p style="font-size: 14px; color: #666;">
                            <strong>WeddingClikzzz</strong><br>
                            Email: info@weddingclikzzz.com<br>
                            Phone: +91 98765 43210<br>
                            Address: 123 Photography Street, Mumbai, Maharashtra 400001
                        </p>
                    </div>

                    <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">&copy; 2026 WeddingClikzzz. All rights reserved.</p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: `WeddingClikzzz_Invoice_${invoiceNumber}.pdf`,
                    content: pdfBase64.split('base64,')[1] || pdfBase64,
                    encoding: 'base64'
                }
            ]
        };

        // Email to company
        const companyMailOptions = {
            from: {
                name: 'WeddingClikzzz Booking System',
                address: emailConfig.auth.user
            },
            to: 'info@weddingclikzzz.com', // Company email
            subject: `New Booking - ${clientName} - ${invoiceNumber}`,
            html: `
                <h2>New Wedding Photography Booking</h2>
                <p><strong>Client Name:</strong> ${clientName}</p>
                <p><strong>Client Email:</strong> ${clientEmail}</p>
                <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
                <p><strong>Wedding Date:</strong> ${new Date(weddingDate).toLocaleDateString('en-IN')}</p>
                <p><strong>Total Amount:</strong> ₹${total.toLocaleString('en-IN')}</p>
                <p>Please find the invoice attached.</p>
            `,
            attachments: [
                {
                    filename: `WeddingClikzzz_Invoice_${invoiceNumber}.pdf`,
                    content: pdfBase64.split('base64,')[1] || pdfBase64,
                    encoding: 'base64'
                }
            ]
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(customerMailOptions),
            transporter.sendMail(companyMailOptions)
        ]);

        res.json({
            success: true,
            message: 'Invoice sent successfully to customer and company'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send email',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Make sure to update email configuration in this file');
});

/*
 * Setup Instructions:
 *
 * 1. Install Node.js from https://nodejs.org/
 *
 * 2. Create package.json:
 *    npm init -y
 *
 * 3. Install dependencies:
 *    npm install express nodemailer cors body-parser
 *
 * 4. Update email configuration above with your credentials
 *
 * 5. For Gmail:
 *    - Enable 2-factor authentication
 *    - Create app-specific password: https://myaccount.google.com/apppasswords
 *    - Use app password instead of regular password
 *
 * 6. Run the server:
 *    node backend-example.js
 *
 * 7. Update script.js to call this backend instead of EmailJS
 *
 * Example frontend update for script.js:
 *
 * async function sendInvoiceEmail(pdfBlob, clientEmail, clientName) {
 *     const base64PDF = await blobToBase64(pdfBlob);
 *
 *     const response = await fetch('http://localhost:3000/api/send-invoice', {
 *         method: 'POST',
 *         headers: {
 *             'Content-Type': 'application/json'
 *         },
 *         body: JSON.stringify({
 *             clientEmail: clientEmail,
 *             clientName: clientName,
 *             pdfBase64: base64PDF,
 *             invoiceNumber: 'INV-' + Date.now(),
 *             weddingDate: document.getElementById('weddingDate').value,
 *             total: parseFloat(document.getElementById('total').textContent.replace('₹', '').replace(',', ''))
 *         })
 *     });
 *
 *     const result = await response.json();
 *
 *     if (!result.success) {
 *         throw new Error(result.error);
 *     }
 * }
 */
