/**
 * EMI Calculator - Ad Manager
 * Handles Ezoic ad integration and provides utility functions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ad containers
    initAdContainers();
    
    // Check for ad blockers and handle gracefully
    checkAdBlocker();
});

/**
 * Initialize ad containers and set up responsive behavior
 */
function initAdContainers() {
    // Get all ad containers
    const adContainers = document.querySelectorAll('.ad-container');
    
    // Add loading state
    adContainers.forEach(container => {
        // Add a subtle loading animation
        container.classList.add('ad-loading');
        
        // Listen for ad load events from Ezoic
        window.addEventListener('load', function() {
            // Remove loading state after a short delay
            setTimeout(() => {
                container.classList.remove('ad-loading');
            }, 1000);
        });
    });
    
    // Handle responsive layout changes
    handleResponsiveAds();
}

/**
 * Handle responsive behavior for ads
 */
function handleResponsiveAds() {
    // Check window width and adjust ad containers if needed
    function adjustAdContainers() {
        const windowWidth = window.innerWidth;
        const adContainers = document.querySelectorAll('.ad-container');
        
        adContainers.forEach(container => {
            // On mobile, ensure ads don't disrupt the user experience
            if (windowWidth < 768) {
                container.classList.add('mobile-optimized');
            } else {
                container.classList.remove('mobile-optimized');
            }
        });
    }
    
    // Run on load
    adjustAdContainers();
    
    // Run on resize
    window.addEventListener('resize', adjustAdContainers);
}

/**
 * Check for ad blockers and handle gracefully
 */
function checkAdBlocker() {
    // Simple ad blocker detection
    setTimeout(function() {
        const adContainers = document.querySelectorAll('.ad-container');
        
        adContainers.forEach(container => {
            // Check if container has any children (ads)
            if (container.children.length === 0 || 
                (container.children.length === 1 && container.children[0].offsetHeight === 0)) {
                // Ad might be blocked, hide the container to avoid empty spaces
                container.style.display = 'none';
            }
        });
    }, 2000); // Check after 2 seconds to allow ads to load
}

/**
 * Refresh ads - can be called after dynamic content changes
 */
function refreshAds() {
    // If Ezoic's functions are available
    if (typeof ezstandalone !== 'undefined') {
        ezstandalone.cmd.push(function() {
            ezstandalone.define(100, 101, 102, 103, 104); // Define the ad slots
            ezstandalone.enable();
            ezstandalone.display();
        });
    }
}