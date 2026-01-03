// Service pricing configuration
const servicePrices = {
    'Cinematography': 25000,
    'Drone Shoot': 15000,
    'Candid Photography': 20000,
    'Traditional Photography': 18000,
    'Traditional Videography': 22000,
    'Pre-Wedding Shoot': 30000,
    'Album Design': 12000,
    'Photo Editing': 8000
};

const serviceDescriptions = {
    'Cinematography': 'Full cinematic wedding film with professional editing',
    'Drone Shoot': 'Aerial photography and video coverage',
    'Candid Photography': 'Natural, unposed photography capturing emotions',
    'Traditional Photography': 'Classic wedding photography with posed shots',
    'Traditional Videography': 'Complete event video recording',
    'Pre-Wedding Shoot': 'Romantic pre-wedding photoshoot session',
    'Album Design': 'Premium photo album design and printing',
    'Photo Editing': 'Professional photo editing and enhancement'
};

// Global state
let selectedServices = {};
let selectedEvents = [];

// Initialize EmailJS (Replace with your actual EmailJS credentials)
// Sign up at https://www.emailjs.com/ and replace these values
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your public key
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your template ID
const COMPANY_EMAIL = 'info@weddingclikzzz.com'; // Your company email

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Event selection checkboxes
    const eventCheckboxes = document.querySelectorAll('input[name="event"]');
    eventCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleEventSelection);
    });

    // Calculate button
    document.getElementById('calculateBtn').addEventListener('click', calculatePricing);

    // Generate invoice button
    document.getElementById('generateInvoiceBtn').addEventListener('click', generateAndSendInvoice);
});

// Handle event selection
function handleEventSelection() {
    selectedEvents = [];
    const eventCheckboxes = document.querySelectorAll('input[name="event"]:checked');

    eventCheckboxes.forEach(checkbox => {
        selectedEvents.push(checkbox.value);
    });

    if (selectedEvents.length > 0) {
        showServiceSelection();
    } else {
        hideServiceSelection();
    }
}

// Show service selection for selected events
function showServiceSelection() {
    const serviceSection = document.getElementById('serviceSection');
    const serviceContainer = document.getElementById('serviceSelectionContainer');
    const calculateBtn = document.getElementById('calculateBtn');

    serviceSection.style.display = 'block';
    calculateBtn.style.display = 'inline-block';

    // Clear previous services
    serviceContainer.innerHTML = '';
    selectedServices = {};

    // Create service selection for each event
    selectedEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-services';
        eventDiv.innerHTML = `
            <h4>${event}</h4>
            <div class="services-grid" id="services-${event}"></div>
        `;
        serviceContainer.appendChild(eventDiv);

        // Add service checkboxes
        const servicesGrid = eventDiv.querySelector('.services-grid');
        Object.keys(servicePrices).forEach(service => {
            const serviceDiv = document.createElement('div');
            serviceDiv.className = 'service-item';
            serviceDiv.innerHTML = `
                <label>
                    <input type="checkbox"
                           class="service-checkbox"
                           data-event="${event}"
                           data-service="${service}"
                           data-price="${servicePrices[service]}">
                    ${service}
                </label>
                <div class="service-price">₹${servicePrices[service].toLocaleString('en-IN')}</div>
                <div class="service-description">${serviceDescriptions[service]}</div>
            `;
            servicesGrid.appendChild(serviceDiv);

            // Add change listener
            const checkbox = serviceDiv.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', handleServiceSelection);
        });

        // Initialize selectedServices for this event
        selectedServices[event] = [];
    });
}

// Hide service selection
function hideServiceSelection() {
    document.getElementById('serviceSection').style.display = 'none';
    document.getElementById('pricingSection').style.display = 'none';
    document.getElementById('detailsSection').style.display = 'none';
    document.getElementById('calculateBtn').style.display = 'none';
    document.getElementById('generateInvoiceBtn').style.display = 'none';
}

// Handle service selection
function handleServiceSelection(e) {
    const event = e.target.dataset.event;
    const service = e.target.dataset.service;
    const price = parseInt(e.target.dataset.price);

    if (e.target.checked) {
        selectedServices[event].push({
            service: service,
            price: price
        });
    } else {
        selectedServices[event] = selectedServices[event].filter(s => s.service !== service);
    }
}

// Calculate pricing
function calculatePricing() {
    let subtotal = 0;
    const itemizedList = document.getElementById('itemizedList');
    itemizedList.innerHTML = '';

    // Calculate subtotal and create itemized list
    Object.keys(selectedServices).forEach(event => {
        if (selectedServices[event].length > 0) {
            selectedServices[event].forEach(service => {
                subtotal += service.price;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'itemized-item';
                itemDiv.innerHTML = `
                    <span>${event} - ${service.service}</span>
                    <span>₹${service.price.toLocaleString('en-IN')}</span>
                `;
                itemizedList.appendChild(itemDiv);
            });
        }
    });

    // Calculate tax and total
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    // Update display
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('tax').textContent = `₹${tax.toLocaleString('en-IN')}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString('en-IN')}`;

    // Show pricing and details sections
    if (subtotal > 0) {
        document.getElementById('pricingSection').style.display = 'block';
        document.getElementById('detailsSection').style.display = 'block';
        document.getElementById('generateInvoiceBtn').style.display = 'inline-block';
    } else {
        alert('Please select at least one service');
    }
}

// Generate and send invoice
async function generateAndSendInvoice() {
    // Validate form
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const weddingDate = document.getElementById('weddingDate').value;

    if (!clientName || !clientEmail || !clientPhone || !weddingDate) {
        alert('Please fill in all required fields (Name, Email, Phone, Wedding Date)');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
        alert('Please enter a valid email address');
        return;
    }

    // Show loading
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        // Generate PDF
        const pdfBlob = await generateInvoicePDF();

        // Send email
        await sendInvoiceEmail(pdfBlob, clientEmail, clientName);

        // Hide loading
        document.getElementById('loadingOverlay').style.display = 'none';

        // Show success modal
        document.getElementById('successModal').style.display = 'flex';

        // Reset form after 3 seconds
        setTimeout(() => {
            // location.reload();
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('loadingOverlay').style.display = 'none';
        alert('An error occurred. Please try again. Error: ' + error.message);
    }
}

// Generate PDF invoice
async function generateInvoicePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get form data
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const weddingDate = document.getElementById('weddingDate').value;
    const clientAddress = document.getElementById('clientAddress').value;
    const specialRequests = document.getElementById('specialRequests').value;

    // Get pricing data
    const subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('₹', '').replace(',', ''));
    const tax = parseFloat(document.getElementById('tax').textContent.replace('₹', '').replace(',', ''));
    const total = parseFloat(document.getElementById('total').textContent.replace('₹', '').replace(',', ''));

    // Invoice number and date
    const invoiceNumber = 'INV-' + Date.now();
    const invoiceDate = new Date().toLocaleDateString('en-IN');

    // PDF Layout
    let yPos = 20;

    // Header - Company Name
    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text('WeddingClikzzz', 105, yPos, { align: 'center' });

    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Capturing Your Beautiful Moments', 105, yPos, { align: 'center' });

    yPos += 15;

    // Company Details
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text('WeddingClikzzz Photography & Videography', 20, yPos);
    yPos += 5;
    doc.text('123 Photography Street, Mumbai, Maharashtra 400001', 20, yPos);
    yPos += 5;
    doc.text('Email: info@weddingclikzzz.com | Phone: +91 98765 43210', 20, yPos);
    yPos += 5;
    doc.text('GST: 27XXXXX1234X1ZX | PAN: XXXXX1234X', 20, yPos);

    yPos += 10;

    // Line separator
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);

    yPos += 10;

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(102, 126, 234);
    doc.text('INVOICE', 105, yPos, { align: 'center' });

    yPos += 10;

    // Invoice details
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, yPos);
    doc.text(`Invoice Date: ${invoiceDate}`, 140, yPos);
    yPos += 6;
    doc.text(`Wedding Date: ${new Date(weddingDate).toLocaleDateString('en-IN')}`, 140, yPos);

    yPos += 10;

    // Client Details
    doc.setFontSize(11);
    doc.setTextColor(102, 126, 234);
    doc.text('Bill To:', 20, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(clientName, 20, yPos);
    yPos += 5;
    doc.text(`Email: ${clientEmail}`, 20, yPos);
    yPos += 5;
    doc.text(`Phone: ${clientPhone}`, 20, yPos);
    if (clientAddress) {
        yPos += 5;
        const addressLines = doc.splitTextToSize(clientAddress, 170);
        doc.text(addressLines, 20, yPos);
        yPos += (addressLines.length * 5);
    }

    yPos += 10;

    // Table Header
    doc.setFillColor(102, 126, 234);
    doc.rect(20, yPos, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Event', 22, yPos + 5);
    doc.text('Service', 70, yPos + 5);
    doc.text('Amount (₹)', 160, yPos + 5);

    yPos += 10;

    // Table Rows
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);

    Object.keys(selectedServices).forEach(event => {
        selectedServices[event].forEach(service => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(event, 22, yPos);
            doc.text(service.service, 70, yPos);
            doc.text(service.price.toLocaleString('en-IN'), 160, yPos);
            yPos += 6;
        });
    });

    yPos += 5;

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);

    yPos += 8;

    // Totals
    doc.setFontSize(10);
    doc.text('Subtotal:', 130, yPos);
    doc.text(`₹${subtotal.toLocaleString('en-IN')}`, 160, yPos);
    yPos += 6;

    doc.text('GST (18%):', 130, yPos);
    doc.text(`₹${tax.toLocaleString('en-IN')}`, 160, yPos);
    yPos += 6;

    doc.setLineWidth(0.5);
    doc.line(130, yPos, 190, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.setTextColor(102, 126, 234);
    doc.text('Total Amount:', 130, yPos);
    doc.text(`₹${total.toLocaleString('en-IN')}`, 160, yPos);

    yPos += 15;

    // Special Requests
    if (specialRequests) {
        doc.setFontSize(10);
        doc.setTextColor(102, 126, 234);
        doc.text('Special Requests:', 20, yPos);
        yPos += 6;
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        const requestLines = doc.splitTextToSize(specialRequests, 170);
        doc.text(requestLines, 20, yPos);
        yPos += (requestLines.length * 5) + 10;
    }

    // Terms and Conditions
    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(10);
    doc.setTextColor(102, 126, 234);
    doc.text('Terms & Conditions:', 20, yPos);
    yPos += 6;

    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    const terms = [
        '1. 50% advance payment required to confirm booking',
        '2. Balance payment due before or on the wedding date',
        '3. Raw footage will not be provided',
        '4. Edited photos/videos will be delivered within 30-45 days',
        '5. Cancellation charges apply as per agreement',
        '6. All rights reserved by WeddingClikzzz'
    ];

    terms.forEach(term => {
        doc.text(term, 20, yPos);
        yPos += 5;
    });

    yPos += 10;

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing WeddingClikzzz!', 105, yPos, { align: 'center' });
    yPos += 5;
    doc.text('For any queries, contact us at info@weddingclikzzz.com or +91 98765 43210', 105, yPos, { align: 'center' });

    // Save and return blob
    const pdfBlob = doc.output('blob');

    // Also trigger download for user
    doc.save(`WeddingClikzzz_Invoice_${clientName.replace(/\s/g, '_')}.pdf`);

    return pdfBlob;
}

// Send invoice via email
async function sendInvoiceEmail(pdfBlob, clientEmail, clientName) {
    // Convert blob to base64
    const base64PDF = await blobToBase64(pdfBlob);

    const clientEmailParams = {
        to_email: clientEmail,
        to_name: clientName,
        from_name: 'WeddingClikzzz',
        message: `Dear ${clientName},\n\nThank you for choosing WeddingClikzzz for your special day!\n\nPlease find attached your booking invoice. We are excited to capture your beautiful moments.\n\nIf you have any questions, feel free to contact us.\n\nBest Regards,\nWeddingClikzzz Team`,
        pdf_attachment: base64PDF
    };

    // Note: EmailJS has limitations with attachments in free tier
    // For production, you should use a backend service to send emails with attachments

    console.log('Invoice generated and downloaded');
    console.log('Email would be sent to:', clientEmail);
    console.log('Company email copy would be sent to:', COMPANY_EMAIL);

    // If you have EmailJS configured with proper template and attachment support:
    /*
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, clientEmailParams);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Email sending failed. However, PDF has been downloaded.');
    }
    */

    // For demonstration, we're just logging and downloading the PDF
    // In production, implement a backend API to handle email sending with attachments
}

// Helper function to convert blob to base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

// Close modal
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
    // Optionally reload the page to start fresh
    // location.reload();
}
