// Home Loan Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Set the selected loan type to 'home'
    selectedLoanType = 'home';
    window.selectedLoanType = 'home'; // Also set on window for compatibility
    
    // Initialize the calculator
    initializeCalculator();
    
    // Setup event listeners for the calculator
    setupEventListeners();
    
    // Show home loan specific fields
    document.querySelectorAll('.home-loan-extra').forEach(function(element) {
        element.classList.remove('d-none');
    });
});