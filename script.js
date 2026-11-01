/* Bizmate Consulting Service — site interactions */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- current year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- sticky header shadow ---------- */
  var header = $('#siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile drawer ---------- */
  var drawer = $('#drawer');
  var navToggle = $('#navToggle');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var first = drawer.querySelector('.drawer-close');
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
    document.body.style.overflow = '';
  }

  if (navToggle) navToggle.addEventListener('click', openDrawer);
  if (drawer) {
    $$('[data-close]', drawer).forEach(function (el) {
      el.addEventListener('click', closeDrawer);
    });
    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) closeDrawer();
  });

  /* ---------- hero slideshow ---------- */
  var show = $('#heroSlideshow');
  if (show) {
    var slides = $$('.slide', show);
    var dots = $$('.dot', show);
    var index = 0;
    var timer = null;
    var DURATION = 6000;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle('is-active', n === index);
        s.setAttribute('aria-hidden', n === index ? 'false' : 'true');
      });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === index);
        d.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () { goTo(index + 1); }, DURATION);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { goTo(n); start(); });
    });
    show.addEventListener('mouseenter', stop);
    show.addEventListener('mouseleave', start);
    show.addEventListener('focusin', stop);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
  }

  /* ---------- scroll reveal ---------- */
  var revealables = $$('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
        io.observe(el);
      });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------- nav active state on inner pages ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav a, .drawer-panel nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop().split('#')[0].split('?')[0];
    if (href && href === path) a.setAttribute('aria-current', 'page');
  });

  /* ---------- consultation form ---------- */
  var form = $('#bookingForm');
  if (form) {
    var EMAIL = 'adu@vritjobs.com';
    var WA_NUMBER = '9779709083870';
    var status = $('#formStatus');

    /* pre-select service from ?service=BOSS%20Demo */
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get('service');
    var select = $('#service');
    if (wanted && select) {
      var match = Array.prototype.slice.call(select.options).filter(function (o) {
        return o.value.toLowerCase() === wanted.toLowerCase();
      })[0];
      if (match) select.value = match.value;
    }

    function val(id) {
      var el = document.getElementById(id);
      return el ? String(el.value || '').trim() : '';
    }

    function fieldWrap(el) {
      return el ? el.closest('.field') : null;
    }

    function fail(el, message) {
      if (!el) return;
      el.classList.add('is-invalid');
      var wrap = fieldWrap(el);
      var err = wrap ? wrap.querySelector('.field-error') : null;
      if (!err) {
        err = document.createElement('span');
        err.className = 'field-error';
        if (wrap) wrap.appendChild(err);
      }
      err.textContent = message;
      err.classList.add('is-visible');
    }

    function clearErrors() {
      $$('.is-invalid', form).forEach(function (el) { el.classList.remove('is-invalid'); });
      $$('.field-error', form).forEach(function (el) {
        el.classList.remove('is-visible');
        el.textContent = '';
      });
    }

    function validate() {
      clearErrors();
      var ok = true;
      var name = document.getElementById('businessName');
      if (!val('businessName') || val('businessName').length < 2) {
        fail(name, 'Please tell us your business name.');
        ok = false;
      }
      var contact = document.getElementById('contactNumbers');
      var digits = val('contactNumbers').replace(/[^0-9]/g, '');
      if (digits.length < 7) {
        fail(contact, 'Please add a phone number we can reach you on.');
        ok = false;
      }
      var msg = document.getElementById('message');
      if (!val('message') || val('message').length < 8) {
        fail(msg, 'A sentence or two about what you need is enough.');
        ok = false;
      }
      if (!ok) {
        var firstBad = form.querySelector('.is-invalid');
        if (firstBad) firstBad.focus();
      }
      return ok;
    }

    function buildText() {
      var lines = [
        'Business name: ' + (val('businessName') || 'Not provided'),
        'Interested in: ' + (val('service') || 'Not provided'),
        'Business size: ' + (val('businessSize') || 'Not specified'),
        'Contact numbers: ' + (val('contactNumbers') || 'Not provided')
      ];
      if (val('email')) lines.push('Email: ' + val('email'));
      lines.push('', 'Message:', val('message') || 'Not provided');
      return lines.join('\n');
    }

    function subject() {
      var who = val('businessName') || 'Website enquiry';
      return 'Consultation request: ' + who + ' (' + (val('service') || 'General Inquiry') + ')';
    }

    function note(text) {
      if (!status) return;
      status.textContent = text;
      status.classList.add('is-visible');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var url = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject()) + '&body=' + encodeURIComponent(buildText());
      window.location.href = url;
      note('Your email app should open with the details filled in. If it does not, use the WhatsApp button or call +977-9709083870.');
    });

    var waBtn = $('#whatsappBtn');
    if (waBtn) {
      waBtn.addEventListener('click', function () {
        if (!validate()) return;
        var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(subject() + '\n\n' + buildText());
        window.open(url, '_blank', 'noopener');
        note('Opening WhatsApp with your details filled in.');
      });
    }
  }
})();
