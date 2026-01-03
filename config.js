// Business Configuration File
// Update these settings to customize your wedding photography booking website

const CONFIG = {
    // Company Information
    company: {
        name: 'WeddingClikzzz',
        tagline: 'Capturing Your Beautiful Moments',
        address: '123 Photography Street, Mumbai, Maharashtra 400001',
        email: 'info@weddingclikzzz.com',
        phone: '+91 98765 43210',
        gst: '27XXXXX1234X1ZX',
        pan: 'XXXXX1234X'
    },

    // Email Configuration (EmailJS)
    email: {
        publicKey: 'YOUR_PUBLIC_KEY',
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID'
    },

    // Tax Configuration
    tax: {
        rate: 0.18, // 18% GST
        label: 'GST (18%)'
    },

    // Payment Terms
    terms: [
        '50% advance payment required to confirm booking',
        'Balance payment due before or on the wedding date',
        'Raw footage will not be provided',
        'Edited photos/videos will be delivered within 30-45 days',
        'Cancellation charges apply as per agreement',
        'All rights reserved by WeddingClikzzz'
    ],

    // Invoice Settings
    invoice: {
        prefix: 'INV-',
        currency: '₹',
        locale: 'en-IN'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
