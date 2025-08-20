class ScrollableSubcollections extends HTMLElement {
  constructor() {
    super();
    this.nav = this.querySelector('.scrollable-subcollection-nav');
    this.leftArrow = this.querySelector('.scroll-arrow--left');
    this.rightArrow = this.querySelector('.scroll-arrow--right');
    this.autoScroll = this.nav?.dataset.autoScroll === 'true';
    this.isScrolling = false;
    this.scrollTimeout = null;
    
    this.init();
  }

  init() {
    if (!this.nav) return;
    
    this.setupArrowNavigation();
    this.setupScrollListeners();
    this.setupTouchNavigation();
    this.setupKeyboardNavigation();
    this.updateArrowStates();
    this.markActiveCollection();
    
    if (this.autoScroll) {
      this.setupAutoScroll();
    }

    // Initialize intersection observer for performance
    this.setupIntersectionObserver();
  }

  setupArrowNavigation() {
    if (this.leftArrow) {
      this.leftArrow.addEventListener('click', () => this.scrollLeft());
    }
    
    if (this.rightArrow) {
      this.rightArrow.addEventListener('click', () => this.scrollRight());
    }
  }

  setupScrollListeners() {
    this.nav.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Update arrow states on resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateArrowStates();
      }, 150);
    });
  }

  setupTouchNavigation() {
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;
    let hasMoved = false;

    this.nav.addEventListener('mousedown', (e) => {
      isDown = true;
      hasMoved = false;
      startX = e.pageX - this.nav.offsetLeft;
      scrollLeft = this.nav.scrollLeft;
      this.nav.style.cursor = 'grabbing';
      this.nav.style.userSelect = 'none';
    });

    this.nav.addEventListener('mouseleave', () => {
      isDown = false;
      this.nav.style.cursor = 'grab';
      this.nav.style.userSelect = '';
    });

    this.nav.addEventListener('mouseup', () => {
      isDown = false;
      this.nav.style.cursor = 'grab';
      this.nav.style.userSelect = '';
    });

    this.nav.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      hasMoved = true;
      const x = e.pageX - this.nav.offsetLeft;
      const walk = (x - startX) * 2;
      this.nav.scrollLeft = scrollLeft - walk;
    });

    // Prevent click events when dragging
    this.nav.addEventListener('click', (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Touch events for mobile
    let touchStartX = 0;
    let touchScrollLeft = 0;

    this.nav.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchScrollLeft = this.nav.scrollLeft;
    }, { passive: true });

    this.nav.addEventListener('touchmove', (e) => {
      if (!touchStartX) return;
      const touchX = e.touches[0].clientX;
      const diff = touchStartX - touchX;
      this.nav.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });
  }

  setupKeyboardNavigation() {
    this.nav.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.scrollLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.scrollRight();
          break;
        case 'Home':
          e.preventDefault();
          this.scrollToStart();
          break;
        case 'End':
          e.preventDefault();
          this.scrollToEnd();
          break;
      }
    });
  }

  setupAutoScroll() {
    // Auto-scroll to active item if present
    const activeButton = this.nav.querySelector('.active');
    if (activeButton) {
      setTimeout(() => {
        this.scrollToElement(activeButton);
      }, 100);
    }
  }

  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.updateArrowStates();
          }
        });
      });
      observer.observe(this);
    }
  }

  handleScroll() {
    this.isScrolling = true;
    
    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    // Update arrow states immediately for responsiveness
    this.updateArrowStates();
    
    // Set timeout to mark scrolling as finished
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 150);
  }

  scrollLeft() {
    const scrollAmount = this.getScrollAmount();
    this.smoothScrollBy(-scrollAmount);
  }

  scrollRight() {
    const scrollAmount = this.getScrollAmount();
    this.smoothScrollBy(scrollAmount);
  }

  scrollToStart() {
    this.nav.scrollTo({ left: 0, behavior: 'smooth' });
  }

  scrollToEnd() {
    this.nav.scrollTo({ left: this.nav.scrollWidth, behavior: 'smooth' });
  }

  smoothScrollBy(amount) {
    this.nav.scrollBy({ left: amount, behavior: 'smooth' });
  }

  scrollToElement(element) {
    const elementRect = element.getBoundingClientRect();
    const navRect = this.nav.getBoundingClientRect();
    const scrollLeft = this.nav.scrollLeft;
    
    const targetScroll = scrollLeft + elementRect.left - navRect.left - (navRect.width / 2) + (elementRect.width / 2);
    
    this.nav.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }

  getScrollAmount() {
    // Scroll by 80% of visible width, or at least one button width
    const visibleWidth = this.nav.clientWidth;
    const firstButton = this.nav.querySelector('.scrollable-subcollection-nav-button');
    const minScroll = firstButton ? firstButton.offsetWidth + 12 : 120; // 12px for gap
    
    return Math.max(visibleWidth * 0.8, minScroll);
  }

  updateArrowStates() {
    if (!this.leftArrow || !this.rightArrow) return;
    
    const tolerance = 1; // 1px tolerance for floating point precision
    const isAtStart = this.nav.scrollLeft <= tolerance;
    const isAtEnd = this.nav.scrollLeft >= (this.nav.scrollWidth - this.nav.clientWidth - tolerance);
    
    this.leftArrow.disabled = isAtStart;
    this.rightArrow.disabled = isAtEnd;
    
    // Update ARIA attributes
    this.leftArrow.setAttribute('aria-disabled', isAtStart);
    this.rightArrow.setAttribute('aria-disabled', isAtEnd);
  }

  markActiveCollection() {
    // Mark active collection based on current page
    const currentPath = window.location.pathname;
    const buttons = this.nav.querySelectorAll('.scrollable-subcollection-nav-button');
    
    buttons.forEach(button => {
      const buttonPath = new URL(button.href).pathname;
      if (currentPath === buttonPath || currentPath.startsWith(buttonPath + '/')) {
        button.classList.add('active');
        button.setAttribute('aria-current', 'page');
      } else {
        button.classList.remove('active');
        button.removeAttribute('aria-current');
      }
    });
  }

  // Public methods for external control
  scrollToCollection(handle) {
    const button = this.nav.querySelector(`[data-collection="${handle}"]`);
    if (button) {
      this.scrollToElement(button);
      button.focus();
    }
  }

  refresh() {
    this.updateArrowStates();
    this.markActiveCollection();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    customElements.define('scrollable-subcollections', ScrollableSubcollections);
  });
} else {
  customElements.define('scrollable-subcollections', ScrollableSubcollections);
}

// Export for potential external use
window.ScrollableSubcollections = ScrollableSubcollections;