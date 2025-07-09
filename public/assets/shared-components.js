// Shared Header and Footer Components for Standalone Pages

const SharedComponents = {
    // Header HTML
    getHeader: () => `
        <header class="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-center border-b bg-white/80 backdrop-blur-sm px-4">
            <div class="flex items-center space-x-3">
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <div>
                    <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        UniTracker
                    </h1>
                    <p class="text-sm text-gray-500">Smart Application Management</p>
                </div>
            </div>
        </header>
    `,

    // Footer Navigation HTML
    getFooter: (currentPage = '') => `
        <div class="fixed bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-sm">
            <div class="bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-1.5 sm:p-2">
                <div class="flex items-center justify-between space-x-1 sm:space-x-2">
                    <a href="index.html" class="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex-1 ${currentPage === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}">
                        <svg class="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                        </svg>
                        <span class="text-xs font-medium hidden xs:block sm:block">Dashboard</span>
                    </a>
                    <a href="applications.html" class="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex-1 ${currentPage === 'applications' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}">
                        <svg class="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-xs font-medium hidden xs:block sm:block">Applications</span>
                    </a>
                    <a href="#" class="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex-1 ${currentPage === 'analytics' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}">
                        <svg class="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <span class="text-xs font-medium hidden xs:block sm:block">Analytics</span>
                    </a>
                    <a href="#" class="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 flex-1 ${currentPage === 'settings' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}">
                        <svg class="h-4 w-4 sm:h-5 sm:w-5 mb-0.5 sm:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="text-xs font-medium hidden xs:block sm:block">Settings</span>
                    </a>
                </div>
            </div>
        </div>
    `,

    // Initialize header and footer on a page
    init: (currentPage = '') => {
        // Insert header
        const headerContainer = document.querySelector('[data-header]');
        if (headerContainer) {
            headerContainer.innerHTML = SharedComponents.getHeader();
        }

        // Insert footer
        const footerContainer = document.querySelector('[data-footer]');
        if (footerContainer) {
            footerContainer.innerHTML = SharedComponents.getFooter(currentPage);
        }
    }
};

// Auto-initialize if data attributes are found
document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.querySelector('[data-header]');
    const footerContainer = document.querySelector('[data-footer]');
    
    if (headerContainer || footerContainer) {
        // Try to detect current page from URL
        const currentPath = window.location.pathname;
        let currentPage = '';
        
        if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '') {
            currentPage = 'dashboard';
        } else if (currentPath.includes('applications.html')) {
            currentPage = 'applications';
        }
        
        SharedComponents.init(currentPage);
    }
});