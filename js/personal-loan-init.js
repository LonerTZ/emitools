// Personal Loan Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Set the selected loan type to 'personal'
    selectedLoanType = 'personal';
    window.selectedLoanType = 'personal'; // Also set on window for compatibility
    
    // Initialize the calculator
    initializeCalculator();
    
    // Setup event listeners for the calculator
    setupEventListeners();
    
    // Show personal loan specific fields
    document.querySelectorAll('.personal-loan-extra').forEach(function(element) {
        element.classList.remove('d-none');
    });
});