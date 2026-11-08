/**
 * Sri Piyadassi Dhamma College - Interactive Scripts
 * Features: Web Audio Temple Bell Chime, Gallery Lightbox, Daily Dhammapada Quotes,
 * Responsive Navigation, Admission Form Validation, Curriculum Tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBellChime();
  initDhammapadaQuotes();
  initCurriculumTabs();
  initGalleryFilterAndLightbox();
  initAdmissionForm();
  initScrollTop();
});

/* --------------------------------------------------------------------------
   1. Navbar & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.main-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy active indicator
    const scrollPos = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggleBtn.innerHTML = isOpen 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close mobile menu when clicking a link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    // Close mobile menu when tapping anywhere outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !header.contains(e.target)) {
        navLinks.classList.remove('open');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. Web Audio Buddhist Temple Bell / Singing Bowl Chime
   -------------------------------------------------------------------------- */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTempleBell() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Frequencies of a resonant Tibetan / Buddhist bronze temple bell
    const fundamental = 392.00; // G4 serene note
    const harmonics = [
      { ratio: 1.0, gain: 0.6, decay: 4.5 },
      { ratio: 1.503, gain: 0.35, decay: 3.8 },
      { ratio: 2.001, gain: 0.25, decay: 3.2 },
      { ratio: 2.76, gain: 0.18, decay: 2.5 },
      { ratio: 4.15, gain: 0.08, decay: 1.8 }
    ];

    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * h.ratio, now);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(h.gain, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + h.decay + 0.1);
    });

    showToast("🔔 සාදු! පින්බර ඝණ්ඨා නාදය (Serene Temple Bell)");
  } catch (err) {
    console.error("Audio chime error:", err);
  }
}

function initBellChime() {
  const bellButtons = document.querySelectorAll('.trigger-temple-bell');
  bellButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playTempleBell();
    });
  });
}

/* --------------------------------------------------------------------------
   3. Daily Dhammapada Quotes
   -------------------------------------------------------------------------- */
const dhammaQuotes = [
  {
    pali: "මනොපුබ්බඞ්ගමා ධම්මා මනොසෙට්ඨා මනොමයා",
    english: "Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If one speaks or acts with a pure mind, happiness follows like an ever-present shadow.",
    source: "Dhammapada — Yamaka Vagga, Verse 1"
  },
  {
    pali: "න හි වෙරෙන වෙරානි සම්මන්තීධ කුදාචනං | අවෙරෙන ච සම්මන්තී එස ධම්මො සනන්තනො",
    english: "Hatred is never appeased by hatred in this world. By loving-kindness alone is hatred appeased. This is an eternal law.",
    source: "Dhammapada — Yamaka Vagga, Verse 5"
  },
  {
    pali: "අත්තා හි අත්තනො නාථො කො හි නාථො පරො සියා",
    english: "One truly is one's own protector; who else could the protector be? With oneself thoroughly subdued, one discovers a refuge so hard to find.",
    source: "Dhammapada — Atta Vagga, Verse 160"
  },
  {
    pali: "අරෝග්‍ය පරමා ලාභා - සන්තුට්ඨි පරමං ධනං | විස්සාස පරමා ඤාතී - නිබ්බාණං පරමං සුඛං",
    english: "Health is the greatest gift, contentment is the greatest wealth, a trusted friend is the best relative, and Nibbana is the supreme bliss.",
    source: "Dhammapada — Sukha Vagga, Verse 204"
  },
  {
    pali: "යො ච වස්සසතං ජීවෙ කුසීතො හීනවීරියො | එකාහං ජීවිතං සෙය්‍යො විරියමාරභතො දළ්හං",
    english: "Better is a single day of life lived with steadfast energy and moral courage, than a hundred years lived lazily and devoid of effort.",
    source: "Dhammapada — Sahassa Vagga, Verse 112"
  }
];

let currentQuoteIndex = 0;

function initDhammapadaQuotes() {
  const paliEl = document.getElementById('quote-pali');
  const englishEl = document.getElementById('quote-english');
  const sourceEl = document.getElementById('quote-source');
  const nextBtn = document.getElementById('next-quote-btn');

  if (!paliEl || !nextBtn) return;

  function updateQuote(index) {
    paliEl.style.opacity = '0';
    englishEl.style.opacity = '0';

    setTimeout(() => {
      const q = dhammaQuotes[index];
      paliEl.textContent = `“${q.pali}”`;
      englishEl.textContent = q.english;
      sourceEl.textContent = q.source;

      paliEl.style.opacity = '1';
      englishEl.style.opacity = '1';
    }, 250);
  }

  nextBtn.addEventListener('click', () => {
    currentQuoteIndex = (currentQuoteIndex + 1) % dhammaQuotes.length;
    updateQuote(currentQuoteIndex);
    playTempleBell();
  });
}

/* --------------------------------------------------------------------------
   4. Curriculum Tabs
   -------------------------------------------------------------------------- */
function initCurriculumTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Photo Gallery & Lightbox
   -------------------------------------------------------------------------- */
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox opening
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-overlay h4')?.textContent || 'Sri Piyadassi Dhamma College';
      
      if (lightbox && lightboxImg && img) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
      }
    });
  });

  // Close Lightbox
  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. Student Admission / Registration Form
   -------------------------------------------------------------------------- */
function initAdmissionForm() {
  const form = document.getElementById('admission-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const studentName = document.getElementById('student-name')?.value.trim();
    const parentPhone = document.getElementById('parent-phone')?.value.trim();
    const gradeLevel = document.getElementById('student-grade')?.value;

    if (!studentName || !parentPhone || !gradeLevel) {
      showToast("⚠️ කරුණාකර සියලු තොරතුරු සම්පූර්ණ කරන්න (Please fill all fields)");
      return;
    }

    // Success response
    showToast(`🌸 සාදු! ${studentName} දරුවාගේ ලියාපදිංචි ඉල්ලීම සාර්ථකව භාරගන්නා ලදී!`);
    playTempleBell();
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   7. Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-dharmachakra fa-spin"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

/* --------------------------------------------------------------------------
   8. Scroll To Top Button
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
