# WeddingClikzzz - Professional Wedding Photography Booking Website

A clean, modern wedding photography booking website that provides an elegant and professional experience for customers to select services and receive detailed invoices. Designed with a minimalist aesthetic featuring refined typography and a sophisticated color palette.

## Features

- **Modern Minimalist Design**: Clean, professional aesthetic with focus on usability and elegance
- **Hero Section**: Stunning full-height hero banner with refined typography and smooth scroll navigation
- **Event Selection**: Choose from multiple wedding events (Reception, Haldi, Marriage, Engagement, Mehendi, Sangeet)
- **Service Selection**: Select photography and videography services for each event with clean card-based UI
- **Automatic Price Calculation**: Real-time pricing with subtotal, GST (18%), and total
- **Professional PDF Invoice**: Branded invoice with itemized services
- **Email Delivery**: Automated email delivery to customer and company
- **Responsive Design**: Fully responsive layout that works seamlessly on all devices
- **Smooth Animations**: Subtle scroll-triggered animations and transitions
- **Premium Typography**: Elegant Google Fonts (Cormorant Garamond, Montserrat)

## Services Offered

| Service | Description | Price (₹) |
|---------|-------------|-----------|
| Cinematography | Full cinematic wedding film with professional editing | 25,000 |
| Drone Shoot | Aerial photography and video coverage | 15,000 |
| Candid Photography | Natural, unposed photography capturing emotions | 20,000 |
| Traditional Photography | Classic wedding photography with posed shots | 18,000 |
| Traditional Videography | Complete event video recording | 22,000 |
| Pre-Wedding Shoot | Romantic pre-wedding photoshoot session | 30,000 |
| Album Design | Premium photo album design and printing | 12,000 |
| Photo Editing | Professional photo editing and enhancement | 8,000 |

## Design Theme

### Modern Professional Aesthetics

The website features a clean, minimalist design focused on elegance and usability:

**Color Palette:**
- **Primary Gold (#C9A961)**: Subtle accent color for CTAs and highlights
- **Text Primary (#2C2C2C)**: Main text color for optimal readability
- **Text Secondary (#6B6B6B)**: Supporting text and secondary information
- **Background White (#FFFFFF)**: Clean white backgrounds
- **Background Subtle (#F9F9F9)**: Light gray for section differentiation
- **Background Cream (#FAF8F5)**: Warm neutral for feature sections
- **Border Light (#E8E8E8)**: Subtle borders and dividers

**Typography:**
- **Cormorant Garamond**: Elegant serif font for headings and titles (400 weight for refined look)
- **Montserrat**: Modern sans-serif for body text and UI elements (300-500 weights)
- Clean, readable font sizes with proper hierarchy
- Generous letter-spacing for refined feel

**Design Principles:**
- Minimalist aesthetic with focus on content
- Generous white space for breathing room
- Subtle shadows for depth (no heavy effects)
- Clean borders and simple shapes
- Refined hover states with subtle animations
- Scroll-triggered fade-in animations
- Professional card-based layouts

**Sections:**
1. **Sticky Navigation**: Clean white with subtle shadow
2. **Hero Section**: Dark full-height banner with elegant typography
3. **Booking Form**: Step-by-step process with clean numbered sections
4. **Features Section**: Card-based layout on cream background
5. **Footer**: Dark professional footer with company information

## Installation & Setup

### Option 1: Simple Setup (No Email Functionality)

1. **Download the files**
   - Ensure you have `index.html`, `styles.css`, and `script.js` in the same folder

2. **Open the website**
   - Double-click `index.html` or
   - Right-click and select "Open with" → Your preferred browser

3. **Start using**
   - The website will work immediately for service selection and PDF generation
   - Invoices will be downloaded automatically

### Option 2: Full Setup with Email Functionality

To enable email delivery, you need to set up EmailJS:

#### Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

#### Step 2: Configure EmailJS

1. **Create Email Service**
   - Go to Email Services
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions
   - Note your **Service ID**

2. **Create Email Template**
   - Go to Email Templates
   - Click "Create New Template"
   - Use this template structure:

   ```
   Subject: Your Wedding Photography Booking Invoice

   Dear {{to_name}},

   {{message}}

   Best Regards,
   WeddingClikzzz Team
   ```

   - Note your **Template ID**

3. **Get Public Key**
   - Go to Account → General
   - Copy your **Public Key**

#### Step 3: Update Configuration

Open `script.js` and update these lines (around line 25-28):

```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your actual public key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your actual service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your actual template ID
const COMPANY_EMAIL = 'info@weddingclikzzz.com'; // Replace with your company email
```

**Note**: EmailJS free tier has limitations on attachments. For production use with PDF attachments, consider:
- Upgrading to EmailJS paid plan
- Using a backend service (Node.js, PHP, Python) with services like:
  - SendGrid
  - AWS SES
  - Mailgun
  - Nodemailer

### Option 3: Deploy to Web Hosting

1. **Using GitHub Pages** (Free)
   - Create a GitHub repository
   - Upload `index.html`, `styles.css`, `script.js`
   - Go to Settings → Pages
   - Select main branch and save
   - Your site will be live at `https://yourusername.github.io/repository-name`

2. **Using Netlify** (Free)
   - Go to [Netlify](https://www.netlify.com/)
   - Drag and drop your folder
   - Your site will be live instantly

3. **Using Vercel** (Free)
   - Go to [Vercel](https://vercel.com/)
   - Import your project
   - Deploy with one click

## Usage Guide

### For Customers

1. **Select Events**
   - Choose the wedding events you need coverage for
   - Multiple events can be selected

2. **Choose Services**
   - For each selected event, choose photography/videography services
   - View prices for each service

3. **Calculate Price**
   - Click "Calculate Price" to see the total
   - Review itemized breakdown with GST

4. **Enter Details**
   - Fill in your name, email, phone, and wedding date
   - Add address and special requests (optional)

5. **Generate Invoice**
   - Click "Generate Invoice & Send Email"
   - PDF will be downloaded automatically
   - Email will be sent (if configured)

### For Business Owners

#### Customizing Prices

Edit the `servicePrices` object in `script.js` (line 2-11):

```javascript
const servicePrices = {
    'Cinematography': 25000,
    'Drone Shoot': 15000,
    // ... add or modify services and prices
};
```

#### Adding New Services

1. Add to `servicePrices` object
2. Add description to `serviceDescriptions` object
3. Services will automatically appear in the selection

#### Changing Tax Rate

Modify line 174 in `script.js`:

```javascript
const tax = subtotal * 0.18; // Change 0.18 to your tax rate (0.18 = 18%)
```

#### Customizing Invoice

Edit the `generateInvoicePDF()` function in `script.js` (starting line 219) to:
- Change company name, address, contact details
- Modify invoice layout
- Update terms and conditions
- Change colors and styling

#### Updating Company Information

In `script.js`, update:
- Line 28: `COMPANY_EMAIL`
- Line 238-243: Company details in PDF generation

In `index.html`, update:
- Line 12: Page title
- Line 18-19: Company name and tagline
- Line 185-186: Footer contact information

## File Structure

```
weddingclikzzz/
│
├── index.html          # Main HTML file with form structure
├── styles.css          # Styling and responsive design
├── script.js           # All functionality (selection, calculation, PDF, email)
└── README.md          # This file
```

## Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with modern gradients and responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **jsPDF**: PDF generation library
- **EmailJS**: Email delivery service

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Troubleshooting

### PDF not generating
- Check browser console for errors
- Ensure jsPDF library is loaded (check internet connection)
- Try a different browser

### Email not sending
- Verify EmailJS configuration
- Check EmailJS dashboard for quota limits
- Ensure internet connection
- Check browser console for errors

### Styling issues
- Clear browser cache
- Ensure `styles.css` is in the same folder as `index.html`
- Check browser developer tools for CSS errors

## Future Enhancements

Possible improvements:
- Backend integration for secure email sending with attachments
- Payment gateway integration
- Customer dashboard to track bookings
- Gallery showcase
- Booking calendar with date availability
- Multi-language support
- WhatsApp integration
- Admin panel for managing bookings

## Backend Integration (Recommended for Production)

For production use, consider implementing a backend with:

### Node.js + Express Example

```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');

const app = express();
app.use(express.json());

app.post('/send-invoice', async (req, res) => {
    const { email, name, pdfBase64 } = req.body;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-app-password'
        }
    });

    // Send email with PDF attachment
    await transporter.sendMail({
        from: 'WeddingClikzzz <your-email@gmail.com>',
        to: email,
        cc: 'info@weddingclikzzz.com',
        subject: 'Your Wedding Photography Invoice',
        html: `<p>Dear ${name},</p><p>Please find your invoice attached.</p>`,
        attachments: [{
            filename: 'invoice.pdf',
            content: pdfBase64,
            encoding: 'base64'
        }]
    });

    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## License

This project is open source and available for personal and commercial use.

## Support

For questions or support:
- Email: info@weddingclikzzz.com
- Phone: +91 98765 43210

## Credits

Created for WeddingClikzzz - Capturing Your Beautiful Moments

---

Made with ❤️ for wedding photographers
