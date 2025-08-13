// Car Loan Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Set the selected loan type to 'car'
    selectedLoanType = 'car';
    window.selectedLoanType = 'car'; // Also set on window for compatibility
    
    // Initialize the calculator
    initializeCalculator();
    
    // Setup event listeners for the calculator
    setupEventListeners();
    
    // Show car loan specific fields
    document.querySelectorAll('.car-loan-extra').forEach(function(element) {
        element.classList.remove('d-none');
    });
});