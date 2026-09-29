(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
      nav.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
      nav.classList.toggle('is-open', !isOpen);
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = document.querySelectorAll([
    '.service-card', '.strengths-intro', '.strength-item', '.home-section-heading',
    '.scenario-card', '.steps-intro', '.step-item', '.home-profile-heading',
    '.home-profile-photo', '.home-profile-content', '.page-hero-inner > div',
    '.menu-aside', '.menu-detail-head', '.feature-list li', '.menu-footnote',
    '.flow-grid > div',
    '.about-intro-grid > div', '.profile-visual', '.profile-copy',
    '.value-grid article', '.access-grid > div',
    '.contact-grid > div', '.closing-inner > div', '.closing-inner > .button'
  ].join(','));

  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${(index % 3) * 100}ms`);
      element.classList.add('reveal-pending');
    });

    window.requestAnimationFrame(() => {
      revealTargets.forEach((element) => observer.observe(element));
    });

    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', (event) => {
        if (event.matches) {
          observer.disconnect();
          document.querySelectorAll('.reveal-pending').forEach((element) => {
            element.classList.add('is-visible');
          });
        }
      });
    }
  }

  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (reduceMotion.matches || event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          link.target && link.target !== '_self' || link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!/^(index|menu|about|access)\.html(?:#.*)?$/.test(href)) return;
      const destination = new URL(href, window.location.href);
      if (destination.pathname === window.location.pathname && destination.hash) return;

      event.preventDefault();
      document.body.classList.add('is-leaving');
      window.setTimeout(() => { window.location.href = destination.href; }, 230);
    });
  });

  window.addEventListener('pageshow', () => {
    document.body.classList.remove('is-leaving');
  });
})();
