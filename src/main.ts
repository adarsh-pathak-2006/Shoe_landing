import { createIcons, icons } from 'lucide';
import { animate } from 'motion';
import './index.css';

// --- Types ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  tag?: string;
}

// --- Loading Screen Logic ---

class LoadingScreen {
  private progress = 0;
  private wordIndex = 0;
  private words = ["Stride", "Sprint", "Soar"];
  private startTime: number | null = null;
  private duration = 2700; // 2.7 seconds
  private onComplete: () => void;

  constructor(onComplete: () => void) {
    this.onComplete = onComplete;
  }

  start() {
    this.animateEntrance();
    this.startCounter();
    this.startWordRotation();
  }

  private animateEntrance() {
    const portfolio = document.getElementById('loader-portfolio');
    const counter = document.getElementById('loader-counter');

    if (portfolio) {
      animate(portfolio, { opacity: 1, y: 0 }, { duration: 0.6, delay: 0.1 });
    }
    if (counter) {
      animate(counter, { opacity: 1, y: 0 }, { duration: 0.6, delay: 0.1 });
    }
  }

  private startCounter() {
    const counterEl = document.getElementById('loader-counter');
    const progressEl = document.getElementById('loader-progress');

    const update = (timestamp: number) => {
      if (!this.startTime) this.startTime = timestamp;
      const elapsed = timestamp - this.startTime;
      this.progress = Math.min((elapsed / this.duration) * 100, 100);

      if (counterEl) {
        counterEl.textContent = Math.round(this.progress).toString().padStart(3, '0');
      }
      if (progressEl) {
        animate(progressEl, { scaleX: this.progress / 100 }, { duration: 0.1, ease: "linear" });
      }

      if (this.progress < 100) {
        requestAnimationFrame(update);
      } else {
        setTimeout(() => this.finish(), 400);
      }
    };

    requestAnimationFrame(update);
  }

  private startWordRotation() {
    const container = document.getElementById('loader-words');
    if (!container) return;

    const renderWord = (index: number) => {
      const word = this.words[index];
      const span = document.createElement('span');
      span.className = 'absolute text-4xl md:text-6xl lg:text-7xl font-display italic text-[#f5f5f5]/80';
      span.textContent = word;
      container.appendChild(span);

      // Entrance
      animate(span, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, ease: [0.4, 0, 0.2, 1] });

      // Exit
      if (index < this.words.length - 1) {
        setTimeout(() => {
          animate(span, { opacity: 0, y: -20 }, { duration: 0.4, ease: [0.4, 0, 0.2, 1] }).then(() => span.remove());
        }, 900);
      }
    };

    renderWord(0);
    
    const interval = setInterval(() => {
      this.wordIndex++;
      if (this.wordIndex < this.words.length) {
        renderWord(this.wordIndex);
      } else {
        clearInterval(interval);
      }
    }, 900);
  }

  private finish() {
    const loader = document.getElementById('loader');
    const app = document.getElementById('app');

    if (loader) {
      animate(loader, { opacity: 0 }, { duration: 0.6, ease: [0.4, 0, 0.2, 1] }).then(() => {
        loader.remove();
        document.body.classList.remove('overflow-hidden');
        if (app) {
          app.classList.remove('opacity-0');
          app.classList.add('opacity-100');
        }
        this.onComplete();
      });
    }
  }
}

// --- State ---
let cartCount = 0;
let currentCategory = 'All';
let currentPriceRange = 500;
let currentSort = 'featured';
const productsPerPage = 6;
let visibleProductsCount = productsPerPage;

// --- Data ---
const products: Product[] = [
  {
    id: 1,
    name: "Air Max Pulse",
    category: "Men's Shoes",
    price: 159.99,
    rating: 4.8,
    reviews: 124,
    image: "https://picsum.photos/seed/shoe1/600/600",
    tag: "New Arrival"
  },
  {
    id: 2,
    name: "Zoom Bella 6",
    category: "Women's Shoes",
    price: 129.99,
    rating: 4.6,
    reviews: 89,
    image: "https://picsum.photos/seed/shoe2/600/600",
    tag: "Trending"
  },
  {
    id: 3,
    name: "Impact 4",
    category: "Kids' Shoes",
    price: 89.99,
    rating: 4.5,
    reviews: 56,
    image: "https://picsum.photos/seed/shoe3/600/600"
  },
  {
    id: 4,
    name: "Metcon 9",
    category: "Men's Training",
    price: 149.99,
    rating: 4.9,
    reviews: 210,
    image: "https://picsum.photos/seed/shoe4/600/600",
    tag: "Best Seller"
  },
  {
    id: 5,
    name: "Free Metcon 5",
    category: "Women's Training",
    price: 119.99,
    rating: 4.7,
    reviews: 145,
    image: "https://picsum.photos/seed/shoe5/600/600"
  },
  {
    id: 6,
    name: "Revolution 7",
    category: "Men's Running",
    price: 99.99,
    rating: 4.4,
    reviews: 78,
    image: "https://picsum.photos/seed/shoe6/600/600"
  },
  {
    id: 7,
    name: "Air Force 1 '07",
    category: "Men's Lifestyle",
    price: 110.00,
    rating: 4.9,
    reviews: 1540,
    image: "https://picsum.photos/seed/shoe7/600/600",
    tag: "Classic"
  },
  {
    id: 8,
    name: "Blazer Mid '77",
    category: "Women's Lifestyle",
    price: 105.00,
    rating: 4.7,
    reviews: 820,
    image: "https://picsum.photos/seed/shoe8/600/600"
  },
  {
    id: 9,
    name: "Air Max Excee",
    category: "Men's Lifestyle",
    price: 90.00,
    rating: 4.5,
    reviews: 430,
    image: "https://picsum.photos/seed/shoe9/600/600"
  },
  {
    id: 10,
    name: "Court Vision Low",
    category: "Women's Lifestyle",
    price: 75.00,
    rating: 4.3,
    reviews: 210,
    image: "https://picsum.photos/seed/shoe10/600/600"
  },
  {
    id: 11,
    name: "Precision 6",
    category: "Men's Basketball",
    price: 85.00,
    rating: 4.6,
    reviews: 120,
    image: "https://picsum.photos/seed/shoe11/600/600",
    tag: "Sale"
  },
  {
    id: 12,
    name: "Flex Runner 2",
    category: "Kids' Running",
    price: 55.00,
    rating: 4.8,
    reviews: 95,
    image: "https://picsum.photos/seed/shoe12/600/600"
  }
];

// --- Functions ---

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  // Apply filters
  let filtered = products.filter(product => {
    const categoryMatch = currentCategory === 'All' || product.category.includes(currentCategory);
    const priceMatch = product.price <= currentPriceRange;
    return categoryMatch && priceMatch;
  });

  // Apply sorting
  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const productsToShow = filtered.slice(0, visibleProductsCount);
  
  const countEl = document.getElementById('product-count');
  if (countEl) {
    countEl.textContent = `Showing ${productsToShow.length} of ${filtered.length} Products`;
  }

  grid.innerHTML = productsToShow.map(product => `
    <div class="product-card group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 reveal">
      <div class="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerpolicy="no-referrer"
        />
        ${product.tag ? `<span class="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">${product.tag}</span>` : ''}
        <button class="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-900 hover:bg-black hover:text-white transition-colors duration-300 shadow-sm">
          <i data-lucide="heart" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="p-5">
        <div class="flex justify-between items-start mb-1">
          <h3 class="font-semibold text-gray-900 group-hover:text-black transition-colors">${product.name}</h3>
          <span class="font-bold text-gray-900">$${product.price.toFixed(2)}</span>
        </div>
        <p class="text-xs text-gray-500 mb-3">${product.category}</p>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <div class="flex text-yellow-400">
              ${Array(5).fill(0).map((_, i) => `
                <i data-lucide="star" class="w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : ''}"></i>
              `).join('')}
            </div>
            <span class="text-[10px] font-medium text-gray-400">(${product.reviews})</span>
          </div>
          <button class="add-to-cart-btn p-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all active:scale-95 shadow-md" data-id="${product.id}">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Update Load More button visibility
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    if (visibleProductsCount >= filtered.length) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  }

  // Re-initialize icons for new elements
  createIcons({ icons });
  
  // Add event listeners to new buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const id = target.getAttribute('data-id');
      addToCart(Number(id));
    });
  });
}

function addToCart(productId: number) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  cartCount++;
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) {
    cartBadge.textContent = cartCount.toString();
    cartBadge.classList.remove('hidden');
    
    // Animation effect
    cartBadge.classList.add('scale-125');
    setTimeout(() => cartBadge.classList.remove('scale-125'), 200);
  }

  // Show a simple notification
  showNotification(`Added ${product.name} to cart!`);
}

function showNotification(message: string) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-8 right-8 bg-black text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-300';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('fade-out', 'slide-out-to-bottom-4');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// --- Event Listeners ---

function setupEventListeners() {
  // Category Filters
  document.querySelectorAll('input[name="category"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        currentCategory = target.value;
        // Uncheck others for simplicity in this demo
        document.querySelectorAll('input[name="category"]').forEach(other => {
          if (other !== target) (other as HTMLInputElement).checked = false;
        });
      } else {
        currentCategory = 'All';
      }
      visibleProductsCount = productsPerPage;
      renderProducts();
    });
  });

  // Price Range
  const priceRange = document.getElementById('price-range') as HTMLInputElement;
  const priceValue = document.getElementById('price-value');
  if (priceRange && priceValue) {
    priceRange.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      priceValue.textContent = `$${value}`;
      currentPriceRange = Number(value);
      visibleProductsCount = productsPerPage;
      renderProducts();
    });
  }

  // Sorting
  const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = (e.target as HTMLSelectElement).value;
      renderProducts();
    });
  }

  // Load More
  const loadMoreBtn = document.getElementById('load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleProductsCount += productsPerPage;
      renderProducts();
    });
  }

  // Search (Simple toggle for now)
  const searchBtn = document.querySelector('[data-lucide="search"]')?.parentElement;
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      showNotification("Search functionality coming soon!");
    });
  }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
  const loader = new LoadingScreen(() => {
    console.log("Loading complete");
  });
  loader.start();

  // Initial icon creation for static elements
  createIcons({ icons });

  // Initial render
  renderProducts();
  setupEventListeners();

  // Scroll Reveal
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
