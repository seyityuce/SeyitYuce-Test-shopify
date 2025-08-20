/**
 * Breadcrumb Navigation Enhancement
 * Handles dynamic collection context and URL parameter parsing
 */

class BreadcrumbNavigation {
  constructor() {
    this.init();
  }

  init() {
    // Handle collection context from URL parameters
    this.handleCollectionContext();
    
    // Add click tracking for analytics
    this.addClickTracking();
    
    // Handle responsive truncation
    this.handleResponsiveTruncation();
  }

  /**
   * Handle collection context from URL parameters
   * Useful when navigating from collection to product
   */
  handleCollectionContext() {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionHandle = urlParams.get('collection');
    
    if (collectionHandle && window.location.pathname.includes('/products/')) {
      // Update breadcrumb if collection context is provided via URL
      this.updateProductBreadcrumb(collectionHandle);
    }
  }

  /**
   * Update product breadcrumb with specific collection context
   * @param {string} collectionHandle - The collection handle from URL
   */
  updateProductBreadcrumb(collectionHandle) {
    const breadcrumbList = document.querySelector('.breadcrumb__list');
    if (!breadcrumbList) return;

    // Find the collection link in breadcrumb
    const collectionLink = breadcrumbList.querySelector('a[href*="/collections/"]');
    if (collectionLink && !collectionLink.href.includes(collectionHandle)) {
      // Update the collection link to match the URL context
      const newHref = `/collections/${collectionHandle}`;
      collectionLink.href = newHref;
      
      // Optionally fetch and update the collection title
      this.fetchCollectionTitle(collectionHandle).then(title => {
        if (title) {
          collectionLink.textContent = title;
        }
      });
    }
  }

  /**
   * Fetch collection title from Shopify API
   * @param {string} handle - Collection handle
   * @returns {Promise<string|null>} Collection title or null
   */
  async fetchCollectionTitle(handle) {
    try {
      const response = await fetch(`/collections/${handle}.json`);
      if (response.ok) {
        const data = await response.json();
        return data.collection?.title || null;
      }
    } catch (error) {
      console.warn('Failed to fetch collection title:', error);
    }
    return null;
  }

  /**
   * Add click tracking for breadcrumb analytics
   */
  addClickTracking() {
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb__link');
    
    breadcrumbLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        // Track breadcrumb clicks for analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'breadcrumb_click', {
            'breadcrumb_position': index + 1,
            'breadcrumb_text': link.textContent.trim(),
            'breadcrumb_url': link.href
          });
        }
        
        // Custom event for other analytics tools
        window.dispatchEvent(new CustomEvent('breadcrumb:click', {
          detail: {
            position: index + 1,
            text: link.textContent.trim(),
            url: link.href
          }
        }));
      });
    });
  }

  /**
   * Handle responsive truncation for long breadcrumb items
   */
  handleResponsiveTruncation() {
    const breadcrumbItems = document.querySelectorAll('.breadcrumb__item');
    
    // Add title attributes for truncated items on mobile
    breadcrumbItems.forEach(item => {
      const link = item.querySelector('.breadcrumb__link');
      const text = item.querySelector('.breadcrumb__text');
      const element = link || text;
      
      if (element && element.textContent.length > 20) {
        element.title = element.textContent.trim();
      }
    });

    // Handle window resize for dynamic truncation
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.adjustBreadcrumbDisplay();
      }, 250);
    });

    // Initial adjustment
    this.adjustBreadcrumbDisplay();
  }

  /**
   * Adjust breadcrumb display based on available space
   */
  adjustBreadcrumbDisplay() {
    const breadcrumb = document.querySelector('.breadcrumb');
    const breadcrumbList = document.querySelector('.breadcrumb__list');
    
    if (!breadcrumb || !breadcrumbList) return;

    const breadcrumbItems = Array.from(breadcrumbList.children);
    const containerWidth = breadcrumb.offsetWidth;
    const isMobile = window.innerWidth < 750;

    if (isMobile && breadcrumbItems.length > 3) {
      // On mobile, show only first, last, and current items if too many
      breadcrumbItems.forEach((item, index) => {
        const isFirst = index === 0;
        const isLast = index === breadcrumbItems.length - 1;
        const isSecondLast = index === breadcrumbItems.length - 2;
        
        if (breadcrumbItems.length > 4 && !isFirst && !isLast && !isSecondLast) {
          item.style.display = 'none';
          
          // Add ellipsis after first item
          if (index === 1) {
            const ellipsis = document.createElement('li');
            ellipsis.className = 'breadcrumb__item breadcrumb__ellipsis';
            ellipsis.innerHTML = '<span class="breadcrumb__text">...</span>';
            item.parentNode.insertBefore(ellipsis, item);
          }
        } else {
          item.style.display = 'flex';
        }
      });
    } else {
      // Show all items on desktop or when few items
      breadcrumbItems.forEach(item => {
        item.style.display = 'flex';
      });
      
      // Remove any ellipsis
      const ellipsis = breadcrumbList.querySelector('.breadcrumb__ellipsis');
      if (ellipsis) {
        ellipsis.remove();
      }
    }
  }

  /**
   * Update breadcrumb separator
   * @param {string} separator - New separator character
   */
  updateSeparator(separator) {
    const style = document.createElement('style');
    style.textContent = `
      .breadcrumb__item:not(:last-child)::after {
        content: '${separator}';
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize breadcrumb navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BreadcrumbNavigation();
  });
} else {
  new BreadcrumbNavigation();
}

// Export for potential external use
window.BreadcrumbNavigation = BreadcrumbNavigation;