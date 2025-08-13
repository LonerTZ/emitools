// Global variables
let selectedLoanType = 'home';
let selectedCurrency = 'INR';
let loanTypeData = {
    home: { name: 'Home Loan', icon: 'fa-home', color: 'primary' },
    car: { name: 'Car Loan', icon: 'fa-car', color: 'success' },
    personal: { name: 'Personal Loan', icon: 'fa-user', color: 'warning' },
    education: { name: 'Education Loan', icon: 'fa-graduation-cap', color: 'info' }
};

// Currency data with symbols and formatting
let currencyData = {
    INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', minAmount: 1000, maxAmount: 100000000 },
    USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', minAmount: 100, maxAmount: 10000000 },
    EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', minAmount: 100, maxAmount: 10000000 },
    GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', minAmount: 100, maxAmount: 10000000 },
    JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', minAmount: 10000, maxAmount: 1000000000 },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', minAmount: 100, maxAmount: 10000000 },
    AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', minAmount: 100, maxAmount: 10000000 },
    CHF: { symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH', minAmount: 100, maxAmount: 10000000 },
    CNY: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', minAmount: 1000, maxAmount: 100000000 },
    SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', minAmount: 100, maxAmount: 10000000 },
    HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'en-HK', minAmount: 1000, maxAmount: 100000000 },
    NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ', minAmount: 100, maxAmount: 10000000 },
    KRW: { symbol: '₩', name: 'South Korean Won', locale: 'ko-KR', minAmount: 100000, maxAmount: 1000000000 },
    TZS: { symbol: 'TSh', name: 'Tanzanian Shilling', locale: 'sw-TZ', minAmount: 1000, maxAmount: 1000000000 }
};

// Initialize the calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    setupEventListeners();
});

// Initialize calculator with default values
function initializeCalculator() {
    // Check if there's a demo example to load with enhanced security
    const demoExample = localStorage.getItem('emiExample');
    
    if (demoExample) {
        try {
            // Load and validate demo example
            const example = JSON.parse(demoExample);
            
            // Validate loan type
            const validLoanTypes = ['home', 'car', 'personal', 'education'];
            if (example.loanType && validLoanTypes.includes(example.loanType)) {
                selectLoanType(example.loanType);
            } else {
                selectLoanType('home'); // Default to home if invalid
            }
            
            // Set currency if specified and valid
            const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF', 'CNY', 'SGD', 'HKD', 'NZD', 'KRW'];
            if (example.currency && validCurrencies.includes(example.currency)) {
                document.getElementById('currencySelect').value = example.currency;
                selectedCurrency = example.currency;
                updateCurrencyUI();
            }
            
            // Validate and set amount
            if (example.amount && !isNaN(Number(example.amount))) {
                const amount = Number(example.amount);
                const currency = currencyData[selectedCurrency];
                if (amount >= currency.minAmount && amount <= currency.maxAmount) {
                    document.getElementById('loanAmount').value = amount;
                }
            }
            
            // Validate and set interest rate
            if (example.rate && !isNaN(Number(example.rate))) {
                const rate = Number(example.rate);
                if (rate >= 1 && rate <= 30) {
                    document.getElementById('interestRate').value = rate;
                }
            }
            
            // Validate and set loan tenure
            if (example.months && !isNaN(Number(example.months))) {
                const months = Number(example.months);
                if (months >= 1 && months <= 360) {
                    document.getElementById('loanTenureMonths').value = months;
                }
            }
            
            // Clear the demo data
            localStorage.removeItem('emiExample');
            
            // Auto-calculate the demo
            setTimeout(() => {
                calculateEMI();
            }, 500);
        } catch (error) {
            console.error('Error loading demo example:', error);
            // Clear localStorage on error to prevent future issues
            localStorage.removeItem('emiExample');
            // Set default loan type as fallback
            selectLoanType('home');
        }
    } else {
        // Set default loan type
        selectLoanType('home');
        
        // Set default values
        document.getElementById('loanAmount').value = '500000';
        document.getElementById('interestRate').value = '8.5';
        document.getElementById('loanTenureMonths').value = '240';
        
        // Removed auto-calculate on load to avoid default calculation
        // Users will click Calculate to run the EMI
    }
    
    // Add input validation and real-time updates
    setupInputValidation();
    
    // Initialize currency UI
    updateCurrencyUI();
    updateAmountRange();
}

// Setup event listeners
function setupEventListeners() {
    // Loan type selection
    document.querySelectorAll('.loan-type-card').forEach(card => {
        card.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            selectLoanType(type);
        });
    });

    // Currency selection
    document.getElementById('currencySelect').addEventListener('change', function() {
        selectedCurrency = this.value;
        updateCurrencyUI();
        updateAmountRange();
    });



    // Real-time EMI preview on input change
    document.getElementById('loanAmount').addEventListener('input', debounce(updateEMIPreview, 500));
    document.getElementById('interestRate').addEventListener('input', debounce(updateEMIPreview, 500));
    document.getElementById('loanTenureMonths').addEventListener('input', debounce(updateEMIPreview, 500));
}

// Show/hide home loan extra fields
function toggleHomeLoanExtras(show) {
    document.querySelectorAll('.home-loan-extra').forEach(el => {
        if (show) {
            el.classList.remove('d-none');
        } else {
            el.classList.add('d-none');
        }
    });
}

// Update selectLoanType to show/hide extras
function selectLoanType(type) {
    selectedLoanType = type;
    // Remove active class from all cards
    document.querySelectorAll('.loan-type-card').forEach(card => {
        card.classList.remove('active');
    });
    // Add active class to selected card
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    // Update UI based on loan type
    updateLoanTypeUI(type);
    // Show/hide home loan extras
    toggleHomeLoanExtras(type === 'home');
}

// Update UI based on selected loan type
function updateLoanTypeUI(type) {
    const data = loanTypeData[type];
    
    // Update page title
    document.title = `${data.name} EMI Calculator - Smart EMI Calculator`;
    
    // Update header with safer DOM manipulation
    const header = document.querySelector('.display-4');
    
    // Clear existing content
    while (header.firstChild) {
        header.removeChild(header.firstChild);
    }
    
    // Create icon element
    const icon = document.createElement('i');
    icon.className = `fas ${data.icon} me-3`;
    header.appendChild(icon);
    
    // Add text node
    const text = document.createTextNode(`${data.name} EMI Calculator`);
    header.appendChild(text);
    
    // Update description
    const description = document.querySelector('.lead');
    description.textContent = `Calculate EMI for ${data.name.toLowerCase()} with detailed breakdown and amortization schedule`;
}

// Update UI based on selected currency
function updateCurrencyUI() {
    const currency = currencyData[selectedCurrency];
    
    // Update loan amount placeholder
    document.getElementById('loanAmount').placeholder = `Enter loan amount in ${currency.name}`;
    
    // Update amount range display
    updateAmountRange();
    
    // Update validation limits
    document.getElementById('loanAmount').min = currency.minAmount;
    document.getElementById('loanAmount').max = currency.maxAmount;
    
    // Clear results if currency changes
    if (!document.getElementById('resultsSection').classList.contains('d-none')) {
        document.getElementById('resultsSection').classList.add('d-none');
    }
}

// Update amount range display based on selected currency
function updateAmountRange() {
    const currency = currencyData[selectedCurrency];
    const minFormatted = formatCurrency(currency.minAmount);
    const maxFormatted = formatCurrency(currency.maxAmount);
    
    document.getElementById('amountRange').textContent = `${minFormatted} - ${maxFormatted}`;
}

// Setup input validation
function setupInputValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            clearValidation(this);
        });
    });
}

// Validate and sanitize input field
function validateInput(input) {
    // Sanitize input - remove any non-numeric characters except decimal point
    let sanitizedValue = input.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (sanitizedValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
        sanitizedValue = sanitizedValue.replace(/\./g, function(match, offset) {
            return offset === sanitizedValue.indexOf('.') ? '.' : '';
        });
    }
    
    // Update input with sanitized value if different
    if (sanitizedValue !== input.value) {
        input.value = sanitizedValue;
    }
    
    const value = parseFloat(sanitizedValue);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (isNaN(value) || value < min || value > max) {
        input.classList.add('is-invalid');
        return false;
    }
    
    input.classList.remove('is-invalid');
    return true;
}

// Clear validation styling
function clearValidation(input) {
    input.classList.remove('is-invalid');
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update EMI preview in real-time
function updateEMIPreview() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value);
    const tenure = parseFloat(document.getElementById('loanTenureMonths').value);
    
    if (amount && rate && tenure && amount > 0 && rate > 0 && tenure > 0) {
        const emi = calculateEMIAmount(amount, rate, tenure);
        if (emi > 0) {
            // Show a subtle preview (optional)
            // console.log('EMI Preview:', emi);
        }
    }
}

// Main EMI calculation function
function calculateEMI() {
    // Get input values
    let amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value);
    const tenure = parseFloat(document.getElementById('loanTenureMonths').value);

    let downPayment = 0, processingFees = 0, insurancePremium = 0, taxDeduction = 0;
    if (selectedLoanType === 'home') {
        downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        processingFees = parseFloat(document.getElementById('processingFees').value) || 0;
        insurancePremium = parseFloat(document.getElementById('insurancePremium').value) || 0;
        taxDeduction = parseFloat(document.getElementById('taxDeduction').value) || 0;
        // Subtract down payment, add fees/premium
        amount = Math.max(0, amount - downPayment + processingFees + insurancePremium);
    }

    // Validate inputs
    if (!validateInputs(amount, rate, tenure)) {
        showError('Please enter valid values for all fields.');
        return;
    }

    // Show loading state
    const calculateBtn = document.querySelector('.btn-calculate');
    const originalText = calculateBtn.innerHTML;
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Calculating...';
    calculateBtn.disabled = true;

    // Simulate calculation delay for better UX
    setTimeout(() => {
        try {
            // Calculate EMI
            const emi = calculateEMIAmount(amount, rate, tenure);
            const totalAmount = emi * tenure;
            const totalInterest = totalAmount - amount;

            // Display results (standard)
            displayResults(emi, totalInterest, totalAmount, amount);

            // Generate amortization schedule
            generateAmortizationSchedule(amount, rate, tenure, emi);

            // Show results section
            document.getElementById('resultsSection').classList.remove('d-none');

            // Scroll to results
            document.getElementById('resultsSection').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });

            // Show effective EMI if tax deduction is entered
            if (selectedLoanType === 'home' && taxDeduction > 0) {
                const effectiveInterest = totalInterest * (1 - taxDeduction / 100);
                const effectiveTotal = amount + effectiveInterest;
                const effectiveEMI = Math.round(effectiveTotal / tenure);
                document.getElementById('monthlyEMI').textContent = formatCurrency(emi) + ' (Standard)';
                // Show effective EMI below
                let effDiv = document.getElementById('effectiveEMI');
                if (!effDiv) {
                    effDiv = document.createElement('div');
                    effDiv.id = 'effectiveEMI';
                    effDiv.className = 'mt-2';
                    document.getElementById('monthlyEMI').parentNode.appendChild(effDiv);
                }
                effDiv.innerHTML = `<span class='fw-bold text-success'>Effective EMI after tax: ${formatCurrency(effectiveEMI)}</span>`;
            } else {
                // Remove effective EMI if not applicable
                const effDiv = document.getElementById('effectiveEMI');
                if (effDiv) effDiv.remove();
            }

            // Show success message
            showSuccess('EMI calculation completed successfully!');

        } catch (error) {
            showError('An error occurred during calculation. Please try again.');
            console.error('Calculation error:', error);
        } finally {
            // Restore button state
            calculateBtn.innerHTML = originalText;
            calculateBtn.disabled = false;
        }
    }, 800);
}

// Validate all inputs with enhanced security
function validateInputs(amount, rate, tenure) {
    // Check for null, undefined, NaN or zero values
    if (!amount || !rate || !tenure || isNaN(amount) || isNaN(rate) || isNaN(tenure)) return false;
    
    // Ensure values are positive numbers
    if (amount <= 0 || rate <= 0 || tenure <= 0) return false;
    
    // Validate against currency limits
    const currency = currencyData[selectedCurrency];
    if (amount < currency.minAmount || amount > currency.maxAmount) return false;
    
    // Validate rate and tenure within reasonable limits
    if (rate < 1 || rate > 30) return false;
    if (tenure < 1 || tenure > 360) return false;
    
    // Additional validation for extreme values that could cause calculation issues
    if (rate > 100 || tenure > 1200) return false;
    
    return true;
}

// Calculate EMI amount using the formula
function calculateEMIAmount(principal, rate, tenure) {
    // Convert annual rate to monthly rate
    const monthlyRate = (rate / 100) / 12;
    
    // EMI formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    
    return Math.round(emi);
}

// Format currency based on selected currency with XSS prevention
function formatCurrency(amount) {
    // Ensure amount is a valid number
    if (isNaN(amount) || amount === null || amount === undefined) {
        return 'Invalid amount';
    }
    
    // Convert to number to ensure no string injection
    amount = Number(amount);
    
    const currency = currencyData[selectedCurrency];
    try {
        return currency.symbol + amount.toLocaleString(currency.locale);
    } catch (error) {
        console.error('Currency formatting error:', error);
        // Fallback formatting with basic sanitization
        return currency.symbol + amount.toFixed(0);
    }
}

// Display calculation results with sanitization
function displayResults(emi, totalInterest, totalAmount, principal) {
    // Sanitize all values by ensuring they are valid numbers
    const safeEmi = sanitizeNumber(emi);
    const safeTotalInterest = sanitizeNumber(totalInterest);
    const safeTotalAmount = sanitizeNumber(totalAmount);
    const safePrincipal = sanitizeNumber(principal);
    
    // Update result cards using textContent (not innerHTML) to prevent XSS
    document.getElementById('monthlyEMI').textContent = formatCurrency(safeEmi);
    document.getElementById('totalInterest').textContent = formatCurrency(safeTotalInterest);
    document.getElementById('totalAmount').textContent = formatCurrency(safeTotalAmount);
    
    // Update loan summary
    document.getElementById('principalAmount').textContent = formatCurrency(safePrincipal);
    document.getElementById('interestAmount').textContent = formatCurrency(safeTotalInterest);
    
    // Update progress bars with bounds checking
    const total = safePrincipal + safeTotalInterest;
    const principalPercentage = total > 0 ? (safePrincipal / total) * 100 : 0;
    const interestPercentage = total > 0 ? (safeTotalInterest / total) * 100 : 0;
    
    // Ensure percentages are within valid range (0-100)
    const safePrincipalPercentage = Math.min(Math.max(principalPercentage, 0), 100);
    const safeInterestPercentage = Math.min(Math.max(interestPercentage, 0), 100);
    
    document.getElementById('principalBar').style.width = safePrincipalPercentage + '%';
    document.getElementById('interestBar').style.width = safeInterestPercentage + '%';
}

// Helper function to sanitize numbers
function sanitizeNumber(value) {
    // Convert to number and handle invalid values
    const num = Number(value);
    return isNaN(num) ? 0 : num;
}

// Generate amortization schedule with enhanced security
function generateAmortizationSchedule(principal, rate, tenure, emi) {
    // Sanitize input values
    principal = sanitizeNumber(principal);
    rate = sanitizeNumber(rate);
    tenure = Math.floor(sanitizeNumber(tenure)); // Ensure tenure is an integer
    emi = sanitizeNumber(emi);
    
    const monthlyRate = (rate / 100) / 12;
    let balance = principal;
    const tableBody = document.getElementById('amortizationTableBody');
    
    // Clear existing table using safer method
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    
    // Limit the number of rows to prevent DoS
    const maxTenure = Math.min(tenure, 1000);
    
    // Generate rows for each month
    for (let month = 1; month <= maxTenure; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = emi - interest;
        balance = balance - principalPaid;
        
        // Create table row using safer DOM methods
        const row = document.createElement('tr');
        
        // Create month cell
        const monthCell = document.createElement('td');
        monthCell.className = 'fw-semibold';
        monthCell.textContent = month;
        row.appendChild(monthCell);
        
        // Create EMI cell
        const emiCell = document.createElement('td');
        emiCell.className = 'text-success fw-bold';
        emiCell.textContent = formatCurrency(Math.round(emi));
        row.appendChild(emiCell);
        
        // Create principal cell
        const principalCell = document.createElement('td');
        principalCell.className = 'text-primary';
        principalCell.textContent = formatCurrency(Math.round(principalPaid));
        row.appendChild(principalCell);
        
        // Create interest cell
        const interestCell = document.createElement('td');
        interestCell.className = 'text-warning';
        interestCell.textContent = formatCurrency(Math.round(interest));
        row.appendChild(interestCell);
        
        // Create balance cell
        const balanceCell = document.createElement('td');
        balanceCell.className = 'text-muted';
        balanceCell.textContent = formatCurrency(Math.max(0, Math.round(balance)));
        row.appendChild(balanceCell);
        
        tableBody.appendChild(row);
        
        // Show only first 12 months by default, rest can be expanded
        if (month === 12 && maxTenure > 12) {
            const expandRow = document.createElement('tr');
            const expandCell = document.createElement('td');
            expandCell.colSpan = 5;
            expandCell.className = 'text-center';
            
            const expandButton = document.createElement('button');
            expandButton.className = 'btn btn-outline-primary btn-sm';
            expandButton.onclick = function() { toggleAmortizationView(); };
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-chevron-down me-2';
            expandButton.appendChild(icon);
            
            const buttonText = document.createTextNode(`Show More (${maxTenure - 12} months)`);
            expandButton.appendChild(buttonText);
            
            expandCell.appendChild(expandButton);
            expandRow.appendChild(expandCell);
            tableBody.appendChild(expandRow);
            break;
        }
    }
}

// Toggle amortization view (show all vs show limited)
function toggleAmortizationView() {
    const tableBody = document.getElementById('amortizationTableBody');
    const button = tableBody.querySelector('.btn');
    
    if (button.innerHTML.includes('Show More')) {
        // Show all months
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const rate = parseFloat(document.getElementById('interestRate').value);
        const tenure = parseFloat(document.getElementById('loanTenureMonths').value);
        const emi = calculateEMIAmount(amount, rate, tenure);
        
        generateAmortizationSchedule(amount, rate, tenure, emi);
        
        button.innerHTML = `
            <i class="fas fa-chevron-up me-2"></i>
            Show Less
        `;
    } else {
        // Show limited months
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const rate = parseFloat(document.getElementById('interestRate').value);
        const tenure = parseFloat(document.getElementById('loanTenureMonths').value);
        const emi = calculateEMIAmount(amount, rate, tenure);
        
        generateAmortizationSchedule(amount, rate, tenure, emi);
    }
}

// Show error message
function showError(message) {
    // Create a simple error alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Show success message
function showSuccess(message) {
    // Create a simple success alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// Reset calculator
function resetCalculator() {
    document.getElementById('loanAmount').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('loanTenureMonths').value = '';
    
    // Reset currency to INR
    document.getElementById('currencySelect').value = 'INR';
    selectedCurrency = 'INR';
    updateCurrencyUI();
    updateAmountRange();
    
    document.getElementById('resultsSection').classList.add('d-none');
    
    // Clear validation styling
    document.querySelectorAll('.is-invalid').forEach(input => {
        input.classList.remove('is-invalid');
    });
}

// Export results to PDF (placeholder function)
function exportToPDF() {
    try {
        // Sanitize data before export
        const sanitizedData = {
            loanType: loanTypeData[selectedLoanType].name,
            currency: selectedCurrency,
            amount: sanitizeNumber(document.getElementById('loanAmount').value),
            rate: sanitizeNumber(document.getElementById('interestRate').value),
            tenure: sanitizeNumber(document.getElementById('loanTenureMonths').value),
            emi: sanitizeNumber(document.getElementById('monthlyEMI').textContent.replace(/[^0-9.]/g, '')),
            interest: sanitizeNumber(document.getElementById('totalInterest').textContent.replace(/[^0-9.]/g, '')),
            total: sanitizeNumber(document.getElementById('totalAmount').textContent.replace(/[^0-9.]/g, ''))
        };
        
        // Log sanitized data for debugging
        console.log('Export data:', sanitizedData);
        
        // This would integrate with a PDF library like jsPDF
        alert('PDF export feature coming soon! Data has been sanitized for security.');
    } catch (error) {
        console.error('Export error:', error);
        alert('Could not prepare data for export');
    }
}

// Share results (placeholder function)
function shareResults() {
    try {
        // Sanitize data before sharing
        const sanitizedData = {
            loanType: loanTypeData[selectedLoanType].name,
            currency: selectedCurrency,
            amount: sanitizeNumber(document.getElementById('loanAmount').value),
            emi: sanitizeNumber(document.getElementById('monthlyEMI').textContent.replace(/[^0-9.]/g, '')),
            interest: sanitizeNumber(document.getElementById('totalInterest').textContent.replace(/[^0-9.]/g, '')),
            total: sanitizeNumber(document.getElementById('totalAmount').textContent.replace(/[^0-9.]/g, ''))
        };
        
        // Log sanitized data for debugging
        console.log('Share data:', sanitizedData);
        
        if (navigator.share) {
            navigator.share({
                title: 'EMI Calculation Results',
                text: 'Check out my EMI calculation results!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    } catch (error) {
        console.error('Share error:', error);
        alert('Could not prepare data for sharing');
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to calculate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        calculateEMI();
    }
    
    // Escape to reset
    if (e.key === 'Escape') {
        resetCalculator();
    }
});

// Service worker functionality removed for security reasons
// If offline functionality is needed in the future, implement a proper service worker

// Toggle car loan extras
function toggleCarLoanExtras(show) {
    document.querySelectorAll('.car-loan-extra').forEach(el => {
        if (show) el.classList.remove('d-none'); else el.classList.add('d-none');
    });
}

// Extend selectLoanType to handle car extras and tenure constraints
(function() {
    const originalSelectLoanType = selectLoanType;
    selectLoanType = function(type) {
        originalSelectLoanType(type);
        toggleCarLoanExtras(type === 'car');
        const tenureMonthsEl = document.getElementById('loanTenureMonths');
        if (type === 'car') {
            // Car loan tenure 12-84 months by default
            tenureMonthsEl.min = 12;
            tenureMonthsEl.max = 84;
            if (tenureMonthsEl.value) {
                let v = parseInt(tenureMonthsEl.value, 10);
                if (v < 12) tenureMonthsEl.value = 12;
                if (v > 84) tenureMonthsEl.value = 84;
            }
        } else {
            // Reset to general limits
            tenureMonthsEl.min = 1;
            tenureMonthsEl.max = 360;
        }
    }
})();

// Helper to compute EMI with optional balloon payment (final payment B)
function calculateEmiWithBalloon(principal, annualRatePct, months, balloonPayment) {
    const r = (annualRatePct / 100) / 12; // monthly rate
    if (r === 0) {
        // No interest case
        const base = principal - (balloonPayment || 0);
        return Math.max(0, Math.round(base / months));
    }
    const factor = Math.pow(1 + r, months);
    const presentValueOfBalloon = (balloonPayment || 0) / factor;
    const principalForEmi = Math.max(0, principal - presentValueOfBalloon);
    // Standard EMI on reduced principal
    const emi = principalForEmi * r * factor / (factor - 1);
    return Math.round(emi);
}

// Wrap calculateEMI to add car-loan specific adjustments
(function(){
    const originalCalculateEMI = calculateEMI;
    calculateEMI = function() {
        // For car loans, adjust principal before delegating to original calculation path
        if (selectedLoanType === 'car') {
            const amountEl = document.getElementById('loanAmount');
            const tenureEl = document.getElementById('loanTenureMonths');
            let amount = parseFloat(amountEl.value);
            const rate = parseFloat(document.getElementById('interestRate').value);
            const tenure = parseFloat(tenureEl.value);
            const downPct = parseFloat(document.getElementById('carDownPaymentPct').value) || 0;
            const fees = parseFloat(document.getElementById('carProcessingFees').value) || 0;
            const insurance = parseFloat(document.getElementById('carInsurancePremium').value) || 0;
            const balloon = parseFloat(document.getElementById('carBalloonPayment').value) || 0;

            // Enforce car tenure limits
            if (tenure < 12 || tenure > 84) {
                showError('For car loans, tenure must be between 12 and 84 months.');
                return;
            }

            // Apply down payment percentage to reduce principal
            const downAmount = amount * (downPct / 100);
            amount = Math.max(0, amount - downAmount + fees + insurance);

            // Validate common inputs using existing function
            if (!validateInputs(amount, rate, tenure)) {
                showError('Please enter valid values for all fields.');
                return;
            }

            // Show loading state
            const calculateBtn = document.querySelector('.btn-calculate');
            const originalText = calculateBtn.innerHTML;
            calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Calculating...';
            calculateBtn.disabled = true;

            setTimeout(() => {
                try {
                    // Compute EMI with optional balloon payment
                    const emi = calculateEmiWithBalloon(amount, rate, tenure, balloon);
                    
                    // For reporting, compute totals assuming fixed EMI and final balloon if any
                    const monthlyRate = (rate / 100) / 12;
                    let balance = amount;
                    let totalPaid = 0;
                    let totalInterest = 0;
                    for (let m = 1; m <= tenure; m++) {
                        const interest = balance * monthlyRate;
                        const principalPaid = emi - interest;
                        balance = balance - principalPaid;
                        totalPaid += emi;
                        totalInterest += interest;
                    }
                    if (balloon > 0) {
                        // Add balloon final payment
                        totalPaid += balloon;
                        // Interest effect already accounted for via schedule iterations
                    }
                    const totalAmount = Math.round(totalPaid);
                    totalInterest = Math.round(totalInterest);

                    displayResults(emi, totalInterest, totalAmount, amount);
                    
                    // Generate schedule that respects balloon: last row balance should reach ~balloon then paid
                    generateAmortizationScheduleWithBalloon(amount, rate, tenure, emi, balloon);

                    document.getElementById('resultsSection').classList.remove('d-none');
                    document.getElementById('resultsSection').scrollIntoView({behavior:'smooth', block:'start'});
                    showSuccess('EMI calculation completed successfully!');
                } catch (error) {
                    showError('An error occurred during calculation. Please try again.');
                    console.error('Calculation error:', error);
                } finally {
                    calculateBtn.innerHTML = originalText;
                    calculateBtn.disabled = false;
                }
            }, 600);
            return;
        }

        // Non-car loans: proceed with original flow
        originalCalculateEMI();
    }
})();

// Amortization schedule that includes balloon payment at the end
function generateAmortizationScheduleWithBalloon(principal, rate, tenure, emi, balloon) {
    const monthlyRate = (rate / 100) / 12;
    let balance = principal;
    const tableBody = document.getElementById('amortizationTableBody');
    tableBody.innerHTML = '';

    for (let month = 1; month <= tenure; month++) {
        const interest = balance * monthlyRate;
        let principalPaid = emi - interest;
        let rowBalloon = 0;
        if (month === tenure && balloon > 0) {
            // On final month, pay remaining balance via principalPaid plus balloon
            const expectedBalanceAfterEmi = balance - principalPaid;
            // Add balloon to clear the balance
            rowBalloon = balloon;
            balance = expectedBalanceAfterEmi - (balloon);
        } else {
            balance = balance - principalPaid;
        }
        
        const row = document.createElement('tr');
        const displayBalance = Math.max(0, Math.round(balance));
        row.innerHTML = `
            <td class="fw-semibold">${month}</td>
            <td class="text-success fw-bold">${formatCurrency(Math.round(emi + (month === tenure ? rowBalloon : 0)))}</td>
            <td class="text-primary">${formatCurrency(Math.round(Math.max(0, principalPaid)))}</td>
            <td class="text-warning">${formatCurrency(Math.round(interest))}</td>
            <td class="text-muted">${formatCurrency(displayBalance)}</td>
        `;
        tableBody.appendChild(row);

        if (month === 12 && tenure > 12) {
            const expandRow = document.createElement('tr');
            expandRow.innerHTML = `
                <td colspan="5" class="text-center">
                    <button class="btn btn-outline-primary btn-sm" onclick="toggleAmortizationView()">
                        <i class="fas fa-chevron-down me-2"></i>
                        Show More (${tenure - 12} months)
                    </button>
                </td>
            `;
            tableBody.appendChild(expandRow);
            break;
        }
    }
}

// Toggle personal loan extras
function togglePersonalLoanExtras(show) {
    document.querySelectorAll('.personal-loan-extra').forEach(el => {
        if (show) el.classList.remove('d-none'); else el.classList.add('d-none');
    });
}

// Extend selectLoanType hook to include personal loan behavior
(function() {
    const prevSelect = selectLoanType;
    selectLoanType = function(type) {
        prevSelect(type);
        togglePersonalLoanExtras(type === 'personal');
        const tenureEl = document.getElementById('loanTenureMonths');
        if (type === 'personal') {
            tenureEl.min = 12; tenureEl.max = 60;
            if (tenureEl.value) {
                let v = parseInt(tenureEl.value, 10);
                if (v < 12) tenureEl.value = 12;
                if (v > 60) tenureEl.value = 60;
            }
        } else if (type !== 'car') { // don't override car's already-set limits
            tenureEl.min = 1; tenureEl.max = 360;
        }
    }
})();

// Utility to get adjusted rate based on credit score bucket
function adjustRateForCreditScore(baseAnnualRatePct, scoreBucket) {
    // Simple illustrative adjustments
    switch (scoreBucket) {
        case 'excellent': return Math.max(0, baseAnnualRatePct - 2);
        case 'good': return Math.max(0, baseAnnualRatePct - 1);
        case 'fair': return baseAnnualRatePct; // no change
        case 'poor': return baseAnnualRatePct + 2; // higher rate for risk
        default: return baseAnnualRatePct;
    }
}

(function(){
    const originalCalculateEMI = calculateEMI;
    calculateEMI = function() {
        if (selectedLoanType === 'personal') {
            const amount = parseFloat(document.getElementById('loanAmount').value);
            let rate = parseFloat(document.getElementById('interestRate').value);
            const tenure = parseFloat(document.getElementById('loanTenureMonths').value);
            const scoreBucket = (document.getElementById('personalCreditScore')?.value) || 'fair';
            const processingFeePct = parseFloat(document.getElementById('personalProcessingFeePct')?.value) || 0;

            // Enforce personal loan tenure limits
            if (tenure < 12 || tenure > 60) {
                showError('For personal loans, tenure must be between 12 and 60 months.');
                return;
            }

            // Adjust the rate based on credit score bucket
            const adjustedRate = adjustRateForCreditScore(rate, scoreBucket);
            rate = adjustedRate;

            // Validate inputs
            if (!validateInputs(amount, rate, tenure)) {
                showError('Please enter valid values for all fields.');
                return;
            }

            const calculateBtn = document.querySelector('.btn-calculate');
            const originalText = calculateBtn.innerHTML;
            calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Calculating...';
            calculateBtn.disabled = true;

            setTimeout(() => {
                try {
                    const emi = calculateEMIAmount(amount, rate, tenure);
                    const totalAmount = emi * tenure;
                    const totalInterest = totalAmount - amount;

                    displayResults(emi, totalInterest, totalAmount, amount);
                    generateAmortizationSchedule(amount, rate, tenure, emi);

                    // Show net disbursed note (processing fee deducted from disbursed amount)
                    const netDisbursed = Math.max(0, amount - (amount * (processingFeePct / 100)));
                    let note = document.getElementById('personalLoanNote');
                    if (!note) {
                        note = document.createElement('div');
                        note.id = 'personalLoanNote';
                        note.className = 'text-muted mt-2';
                        document.querySelector('#resultsSection .row').appendChild(note);
                    }
                    note.innerHTML = `Net disbursed (after ${processingFeePct}% processing fee): <span class='fw-semibold'>${formatCurrency(Math.round(netDisbursed))}</span>. Effective annual rate applied: <span class='fw-semibold'>${rate}%</span> (${scoreBucket}).`;

                    document.getElementById('resultsSection').classList.remove('d-none');
                    document.getElementById('resultsSection').scrollIntoView({behavior: 'smooth', block: 'start'});
                    showSuccess('EMI calculation completed successfully!');
                } catch (e) {
                    console.error(e);
                    showError('An error occurred during calculation. Please try again.');
                } finally {
                    calculateBtn.innerHTML = originalText;
                    calculateBtn.disabled = false;
                }
            }, 600);
            return;
        }
        originalCalculateEMI();
    }
})();

// Toggle education loan extras
function toggleEducationLoanExtras(show) {
    document.querySelectorAll('.education-loan-extra').forEach(el => {
        if (show) el.classList.remove('d-none'); else el.classList.add('d-none');
    });
}

// Extend selectLoanType for education loan behavior
(function() {
    const prevSelect = selectLoanType;
    selectLoanType = function(type) {
        prevSelect(type);
        toggleEducationLoanExtras(type === 'education');
        const tenureEl = document.getElementById('loanTenureMonths');
        if (type === 'education') {
            // Total months still represent repayment duration (post-moratorium)
            tenureEl.min = 60; tenureEl.max = 180; // 5-15 years typical for repayment phase
            if (tenureEl.value) {
                let v = parseInt(tenureEl.value, 10);
                if (v < 60) tenureEl.value = 60;
                if (v > 180) tenureEl.value = 180;
            }
        } else if (type !== 'car' && type !== 'personal') {
            tenureEl.min = 1; tenureEl.max = 360;
        }
    }
})();

// Education loan calculation wrapper
(function(){
    const originalCalculateEMI = calculateEMI;
    calculateEMI = function() {
        if (selectedLoanType !== 'education') {
            return originalCalculateEMI();
        }

        let principal = parseFloat(document.getElementById('loanAmount').value);
        const baseRate = parseFloat(document.getElementById('interestRate').value);
        const repayMonths = parseFloat(document.getElementById('loanTenureMonths').value); // repayment duration only
        const moratoriumMonths = parseFloat(document.getElementById('eduMoratoriumMonths').value) || 0;
        const graceMonths = parseFloat(document.getElementById('eduGraceMonths').value) || 0;
        const interestOnly = document.getElementById('eduInterestOnly').checked;
        const subsidyPct = parseFloat(document.getElementById('eduSubsidyPct').value) || 0;
        const taxDeduction = parseFloat(document.getElementById('eduTaxDeduction').value) || 0;

        // Validate minimums
        if (repayMonths < 60 || repayMonths > 180) {
            showError('For education loans, repayment tenure must be between 60 and 180 months.');
            return;
        }
        if (!validateInputs(principal, baseRate, repayMonths)) {
            showError('Please enter valid values for all fields.');
            return;
        }

        const calculateBtn = document.querySelector('.btn-calculate');
        const originalText = calculateBtn.innerHTML;
        calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Calculating...';
        calculateBtn.disabled = true;

        setTimeout(() => {
            try {
                const monthlyRate = (baseRate / 100) / 12;

                // Phase 1: Moratorium + Grace accumulation or interest-only
                let accumulatedPrincipal = principal;
                const holdMonths = moratoriumMonths + graceMonths;
                let studyInterestPaid = 0;
                let studyInterestAccrued = 0;

                for (let m = 1; m <= holdMonths; m++) {
                    const interest = accumulatedPrincipal * monthlyRate;
                    const subsidy = interest * (subsidyPct / 100);
                    const netInterest = Math.max(0, interest - subsidy);

                    if (interestOnly) {
                        // Pay the net interest (after subsidy) monthly
                        studyInterestPaid += netInterest;
                        // principal remains the same
                    } else {
                        // No payment; interest (after subsidy) capitalizes
                        accumulatedPrincipal += netInterest;
                        studyInterestAccrued += netInterest;
                    }
                }

                // Phase 2: Repayment EMI on accumulated principal
                const emi = calculateEMIAmount(Math.round(accumulatedPrincipal), baseRate, repayMonths);
                const totalRepayment = emi * repayMonths;
                const totalInterestRepayPhase = totalRepayment - Math.round(accumulatedPrincipal);

                // Totals across phases
                const totalInterestOverall = Math.round(studyInterestPaid + studyInterestAccrued + totalInterestRepayPhase);
                const totalPaidOverall = Math.round((interestOnly ? studyInterestPaid : 0) + totalRepayment);
                const principalBase = Math.round(principal);

                // Display results (standard)
                displayResults(emi, totalInterestOverall, principalBase + totalInterestOverall, principalBase);

                // Generate schedule showing moratorium/grace rows then repayment rows
                generateEducationSchedule(principalBase, baseRate, repayMonths, emi, {
                    moratoriumMonths,
                    graceMonths,
                    interestOnly,
                    subsidyPct
                });

                // Effective EMI after tax during repayment
                if (taxDeduction > 0) {
                    const effectiveInterest = totalInterestRepayPhase * (1 - taxDeduction / 100);
                    const effectiveTotal = Math.round(accumulatedPrincipal) + effectiveInterest;
                    const effectiveEMI = Math.round(effectiveTotal / repayMonths);
                    let effDiv = document.getElementById('effectiveEMI');
                    if (!effDiv) {
                        effDiv = document.createElement('div');
                        effDiv.id = 'effectiveEMI';
                        effDiv.className = 'mt-2';
                        document.getElementById('monthlyEMI').parentNode.appendChild(effDiv);
                    }
                    effDiv.innerHTML = `<span class='fw-bold text-success'>Effective EMI after tax during repayment: ${formatCurrency(effectiveEMI)}</span>`;
                }

                document.getElementById('resultsSection').classList.remove('d-none');
                document.getElementById('resultsSection').scrollIntoView({behavior:'smooth', block:'start'});
                showSuccess('EMI calculation completed successfully!');
            } catch (e) {
                console.error(e);
                showError('An error occurred during calculation. Please try again.');
            } finally {
                calculateBtn.innerHTML = originalText;
                calculateBtn.disabled = false;
            }
        }, 700);
    }
})();

// Generate education schedule with moratorium/grace then repayment
function generateEducationSchedule(principal, rate, repayMonths, emi, opts) {
    const { moratoriumMonths, graceMonths, interestOnly, subsidyPct } = opts;
    const monthlyRate = (rate / 100) / 12;
    let balance = principal;
    const tableBody = document.getElementById('amortizationTableBody');
    tableBody.innerHTML = '';

    const holdMonths = moratoriumMonths + graceMonths;

    // Study period rows (interest-only or capitalization)
    for (let m = 1; m <= holdMonths; m++) {
        const interest = balance * monthlyRate;
        const subsidy = interest * (subsidyPct / 100);
        const netInterest = Math.max(0, interest - subsidy);
        let emiDisplay = 0;
        let principalPaid = 0;

        if (interestOnly) {
            emiDisplay = netInterest; // paying interest-only
            // balance unchanged
        } else {
            // no EMI; interest capitalizes
            emiDisplay = 0;
            balance += netInterest;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-semibold">Study ${m}</td>
            <td class="text-success fw-bold">${formatCurrency(Math.round(emiDisplay))}</td>
            <td class="text-primary">${formatCurrency(Math.round(principalPaid))}</td>
            <td class="text-warning">${formatCurrency(Math.round(netInterest))}</td>
            <td class="text-muted">${formatCurrency(Math.round(balance))}</td>
        `;
        tableBody.appendChild(row);
        if (m === 12 && holdMonths > 12) {
            const expandRow = document.createElement('tr');
            expandRow.innerHTML = `
                <td colspan="5" class="text-center">
                    <button class="btn btn-outline-primary btn-sm" onclick="toggleAmortizationView()">
                        <i class="fas fa-chevron-down me-2"></i>
                        Show More (${holdMonths - 12} months)
                    </button>
                </td>
            `;
            tableBody.appendChild(expandRow);
            break;
        }
    }

    // Repayment phase rows
    const startIndex = holdMonths > 12 ? 13 : 1; // if we broke earlier, repayment shows when expanded
    let repaymentRowIndex = 1;
    for (let month = 1; month <= repayMonths; month++) {
        const interest = balance * monthlyRate;
        const principalPaid = emi - interest;
        balance = balance - principalPaid;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-semibold">Repay ${month}</td>
            <td class="text-success fw-bold">${formatCurrency(Math.round(emi))}</td>
            <td class="text-primary">${formatCurrency(Math.round(principalPaid))}</td>
            <td class="text-warning">${formatCurrency(Math.round(interest))}</td>
            <td class="text-muted">${formatCurrency(Math.max(0, Math.round(balance)))} </td>
        `;
        tableBody.appendChild(row);

        if (holdMonths === 0 && month === 12 && repayMonths > 12) {
            const expandRow = document.createElement('tr');
            expandRow.innerHTML = `
                <td colspan="5" class="text-center">
                    <button class="btn btn-outline-primary btn-sm" onclick="toggleAmortizationView()">
                        <i class="fas fa-chevron-down me-2"></i>
                        Show More (${repayMonths - 12} months)
                    </button>
                </td>
            `;
            tableBody.appendChild(expandRow);
            break;
        }
    }
}