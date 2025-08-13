// Education Loan Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Set the selected loan type to 'education'
    selectedLoanType = 'education';
    window.selectedLoanType = 'education'; // Also set on window for compatibility
    
    // Initialize the calculator
    initializeCalculator();
    
    // Setup event listeners for the calculator
    setupEventListeners();
    
    // Show education loan specific fields
    document.querySelectorAll('.education-loan-extra').forEach(function(element) {
        element.classList.remove('d-none');
    });
});