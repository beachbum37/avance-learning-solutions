document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var headerLogo = header ? header.querySelector('.logo-img') : null;
  var mobileNav = document.querySelector('.mobile-nav');
  var toggle = document.querySelector('.nav-toggle');

  // avance-logo.png is the dark/black-ink mark -> use on light backgrounds.
  // avance-logo-light.png is the light/white-ink mark -> use on dark backgrounds.
  var LOGO_FOR_DARK_BG = 'assets/avance-logo-light.png';
  var LOGO_FOR_LIGHT_BG = 'assets/avance-logo.png';

  // The header sits on a light background whenever it's scrolled (blurred
  // paper backdrop) OR the mobile nav is open (full-screen paper overlay,
  // regardless of scroll position) -> logo/toggle icon must follow both.
  var updateHeaderState = function () {
    var isScrolled = window.scrollY > 20;
    var isMenuOpen = mobileNav ? mobileNav.classList.contains('is-open') : false;
    var onLightBg = isScrolled || isMenuOpen;
    header.classList.toggle('is-scrolled', isScrolled);
    header.classList.toggle('on-light-bg', onLightBg);
    if (headerLogo) {
      headerLogo.src = onLightBg ? LOGO_FOR_LIGHT_BG : LOGO_FOR_DARK_BG;
    }
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      updateHeaderState();
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        document.body.style.overflow = '';
        updateHeaderState();
      });
    });
  }

  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el, i) {
      el.style.setProperty('--i', i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.innerHTML = 'Message received — we’ll be in touch';
      btn.disabled = true;
      form.reset();
      setTimeout(function () { btn.innerHTML = original; btn.disabled = false; }, 4000);
    });
  }
});
