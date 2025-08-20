/**
 * Product Purchased Together Slider
 * Handles the slider functionality for items often purchased together
 */
class PurchasedTogetherSlider {
  constructor() {
    this.slider = null;
    this.itemsContainer = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.currentIndex = 0;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.slider = document.getElementById('purchased-together-slider');
    this.itemsContainer = document.getElementById('purchased-together-items');
    this.prevBtn = document.getElementById('slider-prev');
    this.nextBtn = document.getElementById('slider-next');

    if (!this.slider || !this.itemsContainer || !this.prevBtn || !this.nextBtn) {
      return;
    }

    this.bindEvents();
    
    // Initialize slider after a short delay to ensure proper rendering
    setTimeout(() => {
      this.updateSlider();
    }, 100);
  }

  bindEvents() {
    this.prevBtn.addEventListener('click', (e) => this.handlePrevClick(e));
    this.nextBtn.addEventListener('click', (e) => this.handleNextClick(e));
    window.addEventListener('resize', () => this.updateSlider());
  }

  handlePrevClick(e) {
    e.preventDefault();
    console.log('Prev clicked, current index:', this.currentIndex);
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  handleNextClick(e) {
    e.preventDefault();
    console.log('Next clicked, current index:', this.currentIndex);
    const visibleItems = this.getVisibleItems();
    const maxIndex = Math.max(0, this.itemsContainer.children.length - visibleItems);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateSlider();
    }
  }

  /**
   * Calculate actual item width including gap
   */
  getItemWidth() {
    const items = this.itemsContainer.children;
    if (items.length > 0) {
      const itemRect = items[0].getBoundingClientRect();
      const gap = parseFloat(getComputedStyle(this.itemsContainer).gap) || 16;
      return itemRect.width + gap;
    }
    return 216; // fallback: 200px + 16px gap
  }

  /**
   * Calculate how many items are visible in the current viewport
   */
  getVisibleItems() {
    const containerWidth = this.slider.offsetWidth;
    const itemWidth = this.getItemWidth();
    return Math.floor(containerWidth / itemWidth);
  }

  /**
   * Update slider position and button states
   */
  updateSlider() {
    const items = this.itemsContainer.children;
    const visibleItems = this.getVisibleItems();
    const maxIndex = Math.max(0, items.length - visibleItems);
    const itemWidth = this.getItemWidth();

    // Ensure currentIndex is within bounds
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, maxIndex));

    // Apply transform
    const translateX = -this.currentIndex * itemWidth;
    this.itemsContainer.style.transform = `translateX(${translateX}px)`;

    // Update button states
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= maxIndex || items.length <= visibleItems;

    // Hide buttons if all items are visible
    if (items.length <= visibleItems) {
      this.prevBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    } else {
      this.prevBtn.style.display = 'flex';
      this.nextBtn.style.display = 'flex';
    }
  }
}

// Initialize the slider
new PurchasedTogetherSlider();