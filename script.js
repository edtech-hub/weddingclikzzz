// Service Pricing Data
const servicePricing = {
    cinematography: { name: 'Cinematography', description: 'Full cinematic wedding film', price: 35000 },
    droneShoot: { name: 'Drone Shoot', description: 'Aerial photography & video', price: 15000 },
    candidPhotography: { name: 'Candid Photography', description: 'Natural, unposed moments', price: 25000 },
    traditionalPhotography: { name: 'Traditional Photography', description: 'Classic wedding shots', price: 18000 },
    traditionalVideography: { name: 'Traditional Videography', description: 'Complete event recording', price: 20000 },
    photoAlbum: { name: 'Premium Photo Album', description: '40-page premium album', price: 12000 }
};

const eventNames = {
    reception: 'Reception',
    haldi: 'Haldi',
    marriage: 'Marriage',
    engagement: 'Engagement',
    mehendi: 'Mehendi',
    sangeet: 'Sangeet',
    prewedding: 'Pre-Wedding Shoot',
    other: 'Other Event'
};

// State Management
let selectedEvents = [];
let selectedServices = {};
let customerDetails = {};

// DOM Elements
const eventCards = document.querySelectorAll('.event-card');
const stepItems = document.querySelectorAll('.step-item');
const formSections = document.querySelectorAll('.form-section');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initEventHandlers();
    initNavigationHandlers();
    initScrollEffects();
    setMinWeddingDate();
});

function setMinWeddingDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('weddingDate').setAttribute('min', today);
}

// Event Selection Handlers
function initEventHandlers() {
    eventCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            card.classList.toggle('selected');
            const checkbox = card.querySelector('input');
            checkbox.checked = card.classList.contains('selected');
            updateSelectedEvents();
        });
    });
}

function updateSelectedEvents() {
    selectedEvents = Array.from(document.querySelectorAll('.event-card.selected'))
        .map(card => card.dataset.event);

    document.getElementById('toStep2').disabled = selectedEvents.length === 0;
}

// Navigation Handlers
function initNavigationHandlers() {
    // Step 1 to 2
    document.getElementById('toStep2').addEventListener('click', () => {
        generateServicesForEvents();
        goToStep(2);
    });

    // Step 2 to 1
    document.getElementById('backToStep1').addEventListener('click', () => goToStep(1));

    // Step 2 to 3
    document.getElementById('toStep3').addEventListener('click', () => goToStep(3));

    // Step 3 to 2
    document.getElementById('backToStep2').addEventListener('click', () => goToStep(2));

    // Step 3 to 4
    document.getElementById('toStep4').addEventListener('click', () => {
        if (validateCustomerDetails()) {
            generateInvoicePreview();
            goToStep(4);
        }
    });

    // Step 4 to 3
    document.getElementById('backToStep3').addEventListener('click', () => goToStep(3));

    // Generate Invoice
    document.getElementById('generateInvoice').addEventListener('click', generatePDF);

    // Start Over
    document.getElementById('startOver').addEventListener('click', resetForm);
}

function goToStep(step) {
    // Update step indicators
    stepItems.forEach((item, index) => {
        item.classList.remove('active', 'completed');
        if (index + 1 < step) {
            item.classList.add('completed');
        } else if (index + 1 === step) {
            item.classList.add('active');
        }
    });

    // Update form sections
    formSections.forEach(section => section.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');

    // Scroll to top of form
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Generate Services for Selected Events
function generateServicesForEvents() {
    const container = document.getElementById('servicesContainer');
    container.innerHTML = '';

    selectedEvents.forEach(event => {
        if (!selectedServices[event]) {
            selectedServices[event] = [];
        }

        const eventBlock = document.createElement('div');
        eventBlock.className = 'event-services-block';
        eventBlock.innerHTML = `
            <div class="event-services-header">
                <h3>${eventNames[event]}</h3>
            </div>
            <div class="services-grid" data-event="${event}">
                ${Object.entries(servicePricing).map(([key, service]) => `
                    <div class="service-item ${selectedServices[event].includes(key) ? 'selected' : ''}" data-service="${key}">
                        <input type="checkbox" ${selectedServices[event].includes(key) ? 'checked' : ''}>
                        <div class="service-checkbox">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <div class="service-info">
                            <h4>${service.name}</h4>
                            <p>${service.description}</p>
                        </div>
                        <div class="service-price">₹${service.price.toLocaleString('en-IN')}</div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(eventBlock);
    });

    // Add event listeners to service items
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const event = item.closest('.services-grid').dataset.event;
            const service = item.dataset.service;

            item.classList.toggle('selected');
            const checkbox = item.querySelector('input');
            checkbox.checked = item.classList.contains('selected');

            if (item.classList.contains('selected')) {
                if (!selectedServices[event].includes(service)) {
                    selectedServices[event].push(service);
                }
            } else {
                selectedServices[event] = selectedServices[event].filter(s => s !== service);
            }

            updateStep3Button();
        });
    });

    updateStep3Button();
}

function updateStep3Button() {
    const hasServices = Object.values(selectedServices).some(services => services.length > 0);
    document.getElementById('toStep3').disabled = !hasServices;
}

// Validate Customer Details
function validateCustomerDetails() {
    let isValid = true;

    // Clear all previous errors
    clearAllErrors();

    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const weddingDate = document.getElementById('weddingDate').value;

    if (!name) {
        showFieldError('clientName', 'Please enter your full name');
        isValid = false;
    }

    if (!email) {
        showFieldError('clientEmail', 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('clientEmail', 'Please enter a valid email address');
        isValid = false;
    }

    if (!phone) {
        showFieldError('clientPhone', 'Please enter your phone number');
        isValid = false;
    }

    if (!weddingDate) {
        showFieldError('weddingDate', 'Please select your wedding date');
        isValid = false;
    }

    if (!isValid) {
        // Scroll to the first error
        const firstError = document.querySelector('.form-group input.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return false;
    }

    customerDetails = {
        name,
        partnerName: document.getElementById('partnerName').value.trim(),
        email,
        phone,
        weddingDate,
        venue: document.getElementById('weddingVenue').value.trim(),
        address: document.getElementById('clientAddress').value.trim(),
        notes: document.getElementById('additionalNotes').value.trim()
    };

    return true;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    field.classList.add('error');
    if (errorElement) {
        errorElement.querySelector('span').textContent = message;
        errorElement.classList.add('show');
    }

    // Remove error on input
    field.addEventListener('input', function removeError() {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        field.removeEventListener('input', removeError);
    }, { once: true });
}

function clearAllErrors() {
    const errorFields = document.querySelectorAll('.form-group input.error, .form-group textarea.error');
    errorFields.forEach(field => field.classList.remove('error'));

    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.classList.remove('show'));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Calculate Totals
function calculateTotals() {
    let subtotal = 0;
    const items = [];

    selectedEvents.forEach(event => {
        const eventServices = selectedServices[event] || [];
        eventServices.forEach(serviceKey => {
            const service = servicePricing[serviceKey];
            subtotal += service.price;
            items.push({
                event: eventNames[event],
                service: service.name,
                price: service.price
            });
        });
    });

    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + tax;

    return { subtotal, tax, total, items };
}

// Generate Invoice Preview
function generateInvoicePreview() {
    const { subtotal, tax, total, items } = calculateTotals();
    const invoiceNumber = 'WC-' + Date.now().toString().slice(-8);
    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const weddingDateFormatted = new Date(customerDetails.weddingDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // Group items by event
    const groupedItems = {};
    items.forEach(item => {
        if (!groupedItems[item.event]) {
            groupedItems[item.event] = [];
        }
        groupedItems[item.event].push(item);
    });

    const invoicePreview = document.getElementById('invoicePreview');
    invoicePreview.innerHTML = `
        <div class="invoice-header">
            <div class="invoice-header-top">
                <div class="invoice-logo">
                    <h2>Wedding<span>Clickz</span></h2>
                </div>
                <div class="invoice-badge">QUOTATION</div>
            </div>
            <div class="invoice-meta">
                <div class="invoice-meta-item">
                    <label>Invoice Number</label>
                    <span>${invoiceNumber}</span>
                </div>
                <div class="invoice-meta-item">
                    <label>Invoice Date</label>
                    <span>${today}</span>
                </div>
                <div class="invoice-meta-item">
                    <label>Wedding Date</label>
                    <span>${weddingDateFormatted}</span>
                </div>
            </div>
        </div>
        <div class="invoice-body">
            <div class="invoice-parties">
                <div class="invoice-party">
                    <h4>From</h4>
                    <p>
                        <strong>WeddingClickz Photography</strong><br>
                        2nd floor, 47th Cross Rd, 5th Block,<br>
                        TMC Layout, 1st Phase, Jayanagar,<br>
                        Bengaluru, Karnataka 560041<br>
                        Phone: +91 97402 22927
                    </p>
                </div>
                <div class="invoice-party">
                    <h4>To</h4>
                    <p>
                        <strong>${customerDetails.name}${customerDetails.partnerName ? ' & ' + customerDetails.partnerName : ''}</strong><br>
                        ${customerDetails.address ? customerDetails.address + '<br>' : ''}
                        Email: ${customerDetails.email}<br>
                        Phone: ${customerDetails.phone}
                        ${customerDetails.venue ? '<br>Venue: ' + customerDetails.venue : ''}
                    </p>
                </div>
            </div>
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(groupedItems).map(([event, services]) => `
                        <tr>
                            <td class="event-name">${event}</td>
                            <td></td>
                        </tr>
                        ${services.map(service => `
                            <tr>
                                <td class="service-name">↳ ${service.service}</td>
                                <td>₹${service.price.toLocaleString('en-IN')}</td>
                            </tr>
                        `).join('')}
                    `).join('')}
                </tbody>
            </table>
            <div class="invoice-totals">
                <div class="invoice-totals-box">
                    <div class="invoice-totals-row">
                        <span>Subtotal</span>
                        <span>₹${subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="invoice-totals-row">
                        <span>GST (18%)</span>
                        <span>₹${tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="invoice-totals-row total">
                        <span>Total</span>
                        <span>₹${total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="invoice-footer">
            <h4>Terms & Conditions</h4>
            <ul>
                <li>50% advance payment required to confirm booking</li>
                <li>Remaining balance due 7 days before the event</li>
                <li>All edited photos delivered within 10 working days</li>
                <li>Cinematic films delivered within 2-4 weeks</li>
                <li>Travel and accommodation charges extra for outstation events</li>
            </ul>
        </div>
    `;

    // Update price summary
    const priceSummary = document.getElementById('priceSummaryFinal');
    priceSummary.innerHTML = `
        <h3>Price Summary</h3>
        <div class="price-items">
            ${Object.entries(groupedItems).map(([event, services]) => `
                <div class="price-item">
                    <span class="price-item-name">${event}</span>
                    <span class="price-item-value">₹${services.reduce((sum, s) => sum + s.price, 0).toLocaleString('en-IN')}</span>
                </div>
            `).join('')}
        </div>
        <div class="price-item">
            <span class="price-item-name">Subtotal</span>
            <span class="price-item-value">₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div class="price-item">
            <span class="price-item-name">GST (18%)</span>
            <span class="price-item-value">₹${tax.toLocaleString('en-IN')}</span>
        </div>
        <div class="price-total">
            <span class="price-total-label">Total</span>
            <span class="price-total-value">₹${total.toLocaleString('en-IN')}</span>
        </div>
    `;
}

// Generate PDF Invoice
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 0;

    const { subtotal, tax, total, items } = calculateTotals();
    const invoiceNumber = 'WC-' + Date.now().toString().slice(-8);
    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const weddingDateFormatted = new Date(customerDetails.weddingDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // Header Background
    doc.setFillColor(44, 44, 44);
    doc.rect(0, 0, pageWidth, 55, 'F');

    // Logo Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Wedding', margin, 25);
    doc.setTextColor(201, 168, 124);
    doc.text('Clickz', margin + 38, 25);

    // Quotation Badge
    doc.setFillColor(201, 168, 124);
    doc.roundedRect(pageWidth - margin - 35, 15, 35, 10, 2, 2, 'F');
    doc.setTextColor(44, 44, 44);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', pageWidth - margin - 32, 22);

    // Invoice Meta
    doc.setTextColor(232, 213, 183);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    doc.text('INVOICE NUMBER', margin, 40);
    doc.text('INVOICE DATE', pageWidth/2 - 15, 40);
    doc.text('WEDDING DATE', pageWidth - margin - 25, 40);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(invoiceNumber, margin, 47);
    doc.text(today, pageWidth/2 - 15, 47);
    doc.text(weddingDateFormatted, pageWidth - margin - 25, 47);

    y = 70;

    // From / To Section
    doc.setTextColor(201, 168, 124);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('FROM', margin, y);
    doc.text('TO', pageWidth/2 + 10, y);

    y += 6;
    doc.setTextColor(26, 26, 26);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('WeddingClickz Photography', margin, y);
    doc.text(customerDetails.name + (customerDetails.partnerName ? ' & ' + customerDetails.partnerName : ''), pageWidth/2 + 10, y);

    y += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 107, 107);

    const fromLines = [
        '2nd floor, 47th Cross Rd, 5th Block,',
        'TMC Layout, 1st Phase, Jayanagar,',
        'Bengaluru, Karnataka 560041',
        'Phone: +91 97402 22927'
    ];

    const toLines = [];
    if (customerDetails.address) toLines.push(customerDetails.address);
    toLines.push('Email: ' + customerDetails.email);
    toLines.push('Phone: ' + customerDetails.phone);
    if (customerDetails.venue) toLines.push('Venue: ' + customerDetails.venue);

    fromLines.forEach((line, i) => {
        doc.text(line, margin, y + (i * 5));
    });

    toLines.forEach((line, i) => {
        const displayLine = line.length > 40 ? line.substring(0, 40) + '...' : line;
        doc.text(displayLine, pageWidth/2 + 10, y + (i * 5));
    });

    y += Math.max(fromLines.length, toLines.length) * 5 + 10;

    // Table Header
    doc.setFillColor(250, 247, 242);
    doc.rect(margin, y, pageWidth - (margin * 2), 10, 'F');

    doc.setTextColor(139, 115, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', margin + 5, y + 7);
    doc.text('AMOUNT', pageWidth - margin - 25, y + 7);

    y += 15;

    // Group items by event
    const groupedItems = {};
    items.forEach(item => {
        if (!groupedItems[item.event]) {
            groupedItems[item.event] = [];
        }
        groupedItems[item.event].push(item);
    });

    // Table Content
    doc.setFontSize(10);
    Object.entries(groupedItems).forEach(([event, services]) => {
        // Event name
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 44, 44);
        doc.text(event, margin + 5, y);
        y += 6;

        // Services
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 107, 107);
        services.forEach(service => {
            doc.text('↳ ' + service.service, margin + 10, y);
            doc.setTextColor(44, 44, 44);
            doc.text('₹' + service.price.toLocaleString('en-IN'), pageWidth - margin - 25, y);
            doc.setTextColor(107, 107, 107);

            // Separator line
            doc.setDrawColor(232, 213, 183);
            doc.setLineWidth(0.1);
            doc.line(margin, y + 3, pageWidth - margin, y + 3);
            y += 8;
        });

        y += 3;
    });

    y += 5;

    // Totals
    const totalsX = pageWidth - margin - 70;

    doc.setTextColor(107, 107, 107);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal', totalsX, y);
    doc.setTextColor(44, 44, 44);
    doc.text('₹' + subtotal.toLocaleString('en-IN'), pageWidth - margin - 25, y);

    y += 7;
    doc.setTextColor(107, 107, 107);
    doc.text('GST (18%)', totalsX, y);
    doc.setTextColor(44, 44, 44);
    doc.text('₹' + tax.toLocaleString('en-IN'), pageWidth - margin - 25, y);

    y += 3;
    doc.setDrawColor(201, 168, 124);
    doc.setLineWidth(0.5);
    doc.line(totalsX, y, pageWidth - margin, y);

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL', totalsX, y);
    doc.setTextColor(139, 115, 85);
    doc.setFontSize(14);
    doc.text('₹' + total.toLocaleString('en-IN'), pageWidth - margin - 25, y);

    // Terms & Conditions
    y += 20;
    doc.setFillColor(250, 247, 242);
    doc.rect(margin, y, pageWidth - (margin * 2), 45, 'F');

    y += 8;
    doc.setTextColor(44, 44, 44);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms & Conditions', margin + 5, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 107, 107);

    const terms = [
        '• 50% advance payment required to confirm booking',
        '• Remaining balance due 7 days before the event',
        '• All edited photos delivered within 10 working days',
        '• Cinematic films delivered within 2-4 weeks',
        '• Travel and accommodation charges extra for outstation events'
    ];

    terms.forEach((term, i) => {
        doc.text(term, margin + 5, y + (i * 5));
    });

    // Footer
    doc.setTextColor(201, 168, 124);
    doc.setFontSize(8);
    doc.text('Thank you for choosing WeddingClickz!', pageWidth/2, pageHeight - 15, { align: 'center' });

    // Save PDF
    const fileName = `WeddingClickz_Invoice_${invoiceNumber}.pdf`;
    doc.save(fileName);

    showToast('Invoice downloaded successfully!', 'success');

    // Show success step
    formSections.forEach(section => section.classList.remove('active'));
    document.getElementById('successStep').classList.add('active');
}

// Reset Form
function resetForm() {
    selectedEvents = [];
    selectedServices = {};
    customerDetails = {};

    // Reset event cards
    eventCards.forEach(card => {
        card.classList.remove('selected');
        card.querySelector('input').checked = false;
    });

    // Reset form fields
    document.getElementById('clientName').value = '';
    document.getElementById('partnerName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';
    document.getElementById('weddingDate').value = '';
    document.getElementById('weddingVenue').value = '';
    document.getElementById('clientAddress').value = '';
    document.getElementById('additionalNotes').value = '';

    // Reset buttons
    document.getElementById('toStep2').disabled = true;
    document.getElementById('toStep3').disabled = true;

    // Go to step 1
    goToStep(1);
}

// Scroll Effects
function initScrollEffects() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toast.className = 'toast ' + type;
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
