/* =============================================
   ProteinCart — script.js
   ============================================= */

/* ===== LOADING SCREEN ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    initAnimatedCounters();
  }, 2200);
});

/* ===== AOS INIT ===== */
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .cat-card, .meal-card, .why-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; });
});

/* ===== SCROLL PROGRESS ===== */
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
});

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ===== SMOOTH SCROLL ===== */
window.scrollTo = (selector) => {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

/* ===== SEARCH BAR TOGGLE ===== */
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
searchBtn.addEventListener('click', () => {
  searchInput.classList.toggle('open');
  if (searchInput.classList.contains('open')) searchInput.focus();
});
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  document.querySelectorAll('.meal-card').forEach(card => {
    const name = card.querySelector('.meal-name')?.textContent.toLowerCase() || '';
    card.style.display = name.includes(q) ? '' : 'none';
  });
});

/* ===== PARTICLE CANVAS ===== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '#00ff88' : '#ff7b00';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = 'rgba(0,255,136,' + (0.05 * (1 - dist / 100)) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== ANIMATED COUNTERS ===== */
function initAnimatedCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const isDecimal = target < 10;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
    }, 25);
  });
}

/* ===== MEALS DATA ===== */
const mealsData = [
  { name: 'Grilled Chicken Bowl', emoji: '🥩', protein: 48, cal: 520, price: 349, badge: 'Best Seller', badgeClass: 'badge-seller', rating: '4.9 ★', cat: 'high-protein' },
  { name: 'Salmon Power Salad', emoji: '🍣', protein: 42, cal: 480, price: 429, badge: 'High Protein', badgeClass: 'badge-protein', rating: '4.8 ★', cat: 'high-protein' },
  { name: 'Keto Beef Stir Fry', emoji: '🥘', protein: 38, cal: 420, price: 379, badge: null, rating: '4.7 ★', cat: 'keto' },
  { name: 'Vegan Tofu Bowl', emoji: '🥗', protein: 28, cal: 380, price: 299, badge: 'New', badgeClass: 'badge-new', rating: '4.6 ★', cat: 'vegan' },
  { name: 'Egg White Omelette', emoji: '🥚', protein: 32, cal: 280, price: 249, badge: null, rating: '4.7 ★', cat: 'weight-loss' },
  { name: 'Whey Protein Shake', emoji: '🥤', protein: 35, cal: 260, price: 199, badge: 'Best Seller', badgeClass: 'badge-seller', rating: '4.9 ★', cat: 'shakes' },
  { name: 'Pre-Workout Meal', emoji: '⚡', protein: 30, cal: 500, price: 329, badge: 'High Protein', badgeClass: 'badge-protein', rating: '4.8 ★', cat: 'workout' },
  { name: 'Greek Yogurt Parfait', emoji: '🫙', protein: 22, cal: 320, price: 229, badge: null, rating: '4.5 ★', cat: 'weight-loss' },
  { name: 'Quinoa Protein Bowl', emoji: '🍲', protein: 26, cal: 440, price: 319, badge: 'New', badgeClass: 'badge-new', rating: '4.6 ★', cat: 'vegan' },
  { name: 'Turkey Meatballs', emoji: '🍝', protein: 44, cal: 460, price: 399, badge: 'High Protein', badgeClass: 'badge-protein', rating: '4.7 ★', cat: 'high-protein' },
  { name: 'Avocado Tuna Wrap', emoji: '🌯', protein: 36, cal: 410, price: 359, badge: null, rating: '4.6 ★', cat: 'keto' },
  { name: 'Post-Workout Recovery', emoji: '💪', protein: 40, cal: 350, price: 279, badge: 'Best Seller', badgeClass: 'badge-seller', rating: '4.9 ★', cat: 'workout' },
];

function renderMeals(filter = 'all') {
  const grid = document.getElementById('mealsGrid');
  grid.innerHTML = '';
  const filtered = filter === 'all' ? mealsData : mealsData.filter(m => m.cat === filter);
  filtered.forEach((meal, i) => {
    const card = document.createElement('div');
    card.className = 'meal-card';
    card.setAttribute('data-cat', meal.cat);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (i % 4) * 80);
    card.innerHTML = `
      <div class="meal-img">
        ${meal.badge ? `<span class="meal-badge ${meal.badgeClass}">${meal.badge}</span>` : ''}
        <button class="meal-wish" onclick="toggleWish(this)" title="Wishlist">🤍</button>
        <span style="font-size:4.5rem">${meal.emoji}</span>
      </div>
      <div class="meal-body">
        <h3 class="meal-name">${meal.name}</h3>
        <p class="meal-rating">${meal.rating}</p>
        <div class="meal-macros">
          <span class="macro-chip mc-protein">${meal.protein}g Protein</span>
          <span class="macro-chip mc-cal">${meal.cal} kcal</span>
        </div>
        <div class="meal-footer">
          <span class="meal-price">₹${meal.price}</span>
          <button class="add-cart-btn" onclick='addToCart(${JSON.stringify(meal)})'>+ Add</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  AOS.refresh();
}
renderMeals();

/* ===== FILTER ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMeals(btn.dataset.filter);
  });
});

/* ===== WISHLIST ===== */
function toggleWish(btn) {
  btn.classList.toggle('liked');
  btn.textContent = btn.classList.contains('liked') ? '❤️' : '🤍';
  showToast(btn.classList.contains('liked') ? 'Added to wishlist! ❤️' : 'Removed from wishlist');
}

/* ===== CART ===== */
let cart = [];

function addToCart(meal) {
  cart.push(meal);
  updateCart();
  toggleCart();
  showToast(`${meal.name} added to cart! 🛒`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const count = cart.length;
  document.getElementById('cartCount').textContent = count;

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (count === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p><small>Add some fuel for your journey!</small></div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';
  itemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <p class="ci-name">${item.name}</p>
        <p class="ci-price">₹${item.price}</p>
      </div>
      <button class="ci-remove" onclick="removeFromCart(${i})">✕</button>
    </div>`).join('');

  const total = cart.reduce((s, i) => s + i.price, 0);
  document.getElementById('cartTotal').textContent = '₹' + total;
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}
document.getElementById('cartBtn').addEventListener('click', toggleCart);

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ===== NUTRITION TRACKER ===== */
let trackerState = { protein: 0, cal: 0, water: 0 };
const trackerMax = { protein: 150, cal: 2500, water: 3.5 };

function updateTracker(key, val) {
  trackerState[key] = Math.min(trackerState[key] + val, trackerMax[key]);
  renderTracker();
}
function resetTracker() { trackerState = { protein: 0, cal: 0, water: 0 }; renderTracker(); }

function renderTracker() {
  const pp = Math.round((trackerState.protein / trackerMax.protein) * 100);
  const cp = Math.round((trackerState.cal / trackerMax.cal) * 100);
  const wp = Math.round((trackerState.water / trackerMax.water) * 100);
  document.getElementById('proteinBar').style.width = pp + '%';
  document.getElementById('calBar').style.width = cp + '%';
  document.getElementById('waterBar').style.width = wp + '%';
  document.getElementById('proteinVal').textContent = trackerState.protein + 'g / ' + trackerMax.protein + 'g';
  document.getElementById('calVal').textContent = trackerState.cal + ' / ' + trackerMax.cal + ' kcal';
  document.getElementById('waterVal').textContent = trackerState.water.toFixed(2) + ' / ' + trackerMax.water + ' L';
  // Circles
  const c = 251.2;
  document.getElementById('circProtein').setAttribute('stroke-dasharray', (pp/100*c) + ' ' + c);
  document.getElementById('circCal').setAttribute('stroke-dasharray', (cp/100*c) + ' ' + c);
  document.getElementById('circWater').setAttribute('stroke-dasharray', (wp/100*c) + ' ' + c);
  document.getElementById('circProteinPct').textContent = pp + '%';
  document.getElementById('circCalPct').textContent = cp + '%';
  document.getElementById('circWaterPct').textContent = wp + '%';
}

/* ===== BMI CALCULATOR ===== */
function calcBMI() {
  const h = parseFloat(document.getElementById('heightInput').value);
  const w = parseFloat(document.getElementById('weightInput').value);
  if (!h || !w || h < 100 || w < 20) { showToast('Please enter valid height and weight.'); return; }
  const bmi = w / ((h / 100) ** 2);
  const bmiEl = document.getElementById('bmiValue');
  const labelEl = document.getElementById('bmiLabel');
  const result = document.getElementById('bmiResult');
  const indicator = document.getElementById('bmiIndicator');
  result.style.display = 'block';
  bmiEl.textContent = bmi.toFixed(1);
  let label = '', color = '', pct = 0;
  if (bmi < 18.5)      { label = 'Underweight'; color = '#00b4ff'; pct = 10; }
  else if (bmi < 25)   { label = 'Normal Weight ✓'; color = '#00ff88'; pct = 35; }
  else if (bmi < 30)   { label = 'Overweight'; color = '#ffb800'; pct = 62; }
  else                 { label = 'Obese'; color = '#ff4444'; pct = 88; }
  labelEl.textContent = label;
  labelEl.style.color = color;
  indicator.style.left = pct + '%';
  showToast('BMI calculated: ' + bmi.toFixed(1) + ' — ' + label);
}

/* ===== DIET PLANNER ===== */
const mealSuggestions = {
  lose: { veg: ['Paneer Tikka Salad', 'Dal & Brown Rice', 'Vegetable Oats Bowl', 'Moong Dal Chilla'], nonveg: ['Grilled Chicken Salad', 'Egg White Omelette', 'Tuna Brown Rice Bowl', 'Chicken Soup'], vegan: ['Tofu Stir Fry', 'Lentil Soup', 'Quinoa Salad', 'Chickpea Bowl'] },
  maintain: { veg: ['Paneer Rice Bowl', 'Sprouts Wrap', 'Greek Yogurt Parfait', 'Vegetable Biryani'], nonveg: ['Chicken Biryani', 'Egg Curry + Rice', 'Fish Tacos', 'Turkey Sandwich'], vegan: ['Buddha Bowl', 'Tempeh Stir Fry', 'Chickpea Curry', 'Vegan Protein Shake'] },
  gain: { veg: ['Paneer + Sweet Potato', 'Rajma + Ghee Rice', 'Full Cream Greek Yogurt', 'Nut Butter Toast + Banana'], nonveg: ['Beef + Rice Bowl', 'Whole Egg Omelette + Toast', 'Chicken Pasta', 'Mass Gainer Shake'], vegan: ['Peanut Butter Oats', 'Soya Chunks Curry', 'Nut & Date Balls', 'Vegan Mass Gainer'] },
};

function calcPlan() {
  const goal = document.getElementById('planGoal').value;
  const meal = document.getElementById('planMeal').value;
  const activity = parseFloat(document.getElementById('planActivity').value);
  const w = parseInt(document.getElementById('planWeight').value);
  const h = parseInt(document.getElementById('planHeight').value);
  document.getElementById('weightLabel').textContent = w;
  document.getElementById('heightLabel').textContent = h;
  // Mifflin-St Jeor (male average, age 25)
  let bmr = 10 * w + 6.25 * h - 5 * 25 + 5;
  let tdee = Math.round(bmr * activity);
  let targetCal = goal === 'lose' ? tdee - 400 : goal === 'gain' ? tdee + 400 : tdee;
  let protein = Math.round(w * (goal === 'gain' ? 2.2 : goal === 'lose' ? 2.0 : 1.8));
  let fat = Math.round((targetCal * 0.27) / 9);
  let carbs = Math.round((targetCal - protein * 4 - fat * 9) / 4);
  document.getElementById('prProtein').textContent = protein;
  document.getElementById('prCal').textContent = targetCal;
  document.getElementById('prCarbs').textContent = Math.max(carbs, 0);
  document.getElementById('prFat').textContent = fat;
  const meals = mealSuggestions[goal][meal];
  document.getElementById('planMealList').innerHTML = meals.map(m => `<li>${m}</li>`).join('');
}
calcPlan();

/* ===== TESTIMONIALS SLIDER ===== */
const track = document.getElementById('testiTrack');
const dotsContainer = document.getElementById('testiDots');
const cards = document.querySelectorAll('.testi-card');
let currentIndex = 0;
let autoSlide;

function getVisibleCount() {
  if (window.innerWidth < 600) return 1;
  if (window.innerWidth < 900) return 2;
  return 3;
}

function setupDots() {
  dotsContainer.innerHTML = '';
  const maxSlides = cards.length - getVisibleCount() + 1;
  for (let i = 0; i < maxSlides; i++) {
    const d = document.createElement('div');
    d.className = 'testi-dot' + (i === currentIndex ? ' active' : '');
    d.addEventListener('click', () => slideTo(i));
    dotsContainer.appendChild(d);
  }
}

function slideTo(i) {
  const maxSlides = cards.length - getVisibleCount() + 1;
  currentIndex = Math.max(0, Math.min(i, maxSlides - 1));
  const cardW = cards[0].offsetWidth + 24; // gap
  track.style.transform = `translateX(-${currentIndex * cardW}px)`;
  cards.forEach((c, idx) => c.classList.toggle('active', idx === currentIndex));
  document.querySelectorAll('.testi-dot').forEach((d, idx) => d.classList.toggle('active', idx === currentIndex));
}

document.getElementById('testiPrev').addEventListener('click', () => { slideTo(currentIndex - 1); resetAutoSlide(); });
document.getElementById('testiNext').addEventListener('click', () => { slideTo(currentIndex + 1); resetAutoSlide(); });

function startAutoSlide() {
  autoSlide = setInterval(() => {
    const maxSlides = cards.length - getVisibleCount() + 1;
    slideTo((currentIndex + 1) % maxSlides);
  }, 4000);
}
function resetAutoSlide() { clearInterval(autoSlide); startAutoSlide(); }

setupDots();
startAutoSlide();
window.addEventListener('resize', () => { setupDots(); slideTo(0); });

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.cat-card, .why-card, .meal-card');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; revealObs.observe(el); });

/* ===== RIPPLE EFFECT ===== */
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);width:10px;height:10px;left:${x}px;top:${y}px;transform:translate(-50%,-50%) scale(0);animation:rippleAnim 0.5s ease-out forwards;pointer-events:none;`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes rippleAnim{to{transform:translate(-50%,-50%) scale(20);opacity:0;}}';
document.head.appendChild(styleEl);

/* ===== GALLERY HOVER ===== */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.background = 'radial-gradient(circle at 50% 50%, rgba(0,255,136,0.1), #1a1a1a)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.background = '';
  });
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--green)' : '';
  });
}, { passive: true });
