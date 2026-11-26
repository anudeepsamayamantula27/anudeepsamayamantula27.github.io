/* ==========================================================================
   v3.js: floodlit intro, embers, walk-out kit change, squad cards, milestones,
   fixtures calendar + passport, orange vault, dressing room, auction finale,
   Hey Riser chatbot.
   ========================================================================== */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOBILE = matchMedia('(max-width: 760px)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var LINKEDIN = 'https://www.linkedin.com/in/itsanudeepgupta/';
  var BOOK = 'https://calendar.app.google/GHTx8vktZ8kw6CNe8';
  var INSTAGRAM = 'https://www.instagram.com/itsanudeepgupta/';
  var X = 'https://x.com/_anudeep_gupta_';
  var numsHTML = function (nums) { return nums.map(function (n) { return '<div><b>' + esc(n[0]) + '</b><span>' + esc(n[1]) + '</span></div>'; }).join(''); };
  var io = function (els, fn, opts) {
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { fn(el); }); return; }
    var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, opts || { threshold: 0.2 });
    els.forEach(function (el) { o.observe(el); });
  };

  /* ============================ smooth scroll ============================ */
  var lenis = null, navJump = false, navTimer = null;
  function markJump() { navJump = true; clearTimeout(navTimer); navTimer = setTimeout(function () { navJump = false; }, 2200); }
  if (!RM && window.Lenis && window.gsap) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  function openMore() {
    var mb = document.getElementById('more-body'), btn = document.getElementById('more-btn');
    if (!mb || !mb.hidden) return;
    mb.hidden = false; btn.setAttribute('aria-expanded', 'true'); btn.textContent = 'Hide the full story';
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    if (lenis) lenis.resize && lenis.resize();
  }
  function closeMore() {
    var mb = document.getElementById('more-body'), btn = document.getElementById('more-btn');
    mb.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'See the full story';
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  (function () { var btn = document.getElementById('more-btn'); if (btn) btn.addEventListener('click', function () { if (document.getElementById('more-body').hidden) { openMore(); var t = document.getElementById('squad'); setTimeout(function () { markJump(); if (lenis) lenis.scrollTo(t, { offset: -70 }); else t.scrollIntoView({ behavior: 'smooth' }); }, 80); } else closeMore(); }); })();
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var t = document.querySelector(id); if (!t) return;
    var mb = document.getElementById('more-body'); if (mb && mb.hidden && mb.contains(t)) openMore();
    e.preventDefault(); closeMenu();
    markJump();
    if (lenis) lenis.scrollTo(t, { offset: id === '#top' ? -200 : -70 }); else t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
  });

  /* ============================ header ============================ */
  var menuBtn = $('.hd-menu'), nav = $('#hd-nav');
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function () { var o = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', String(o)); });
  if ('IntersectionObserver' in window) {
    var links = $$('.hd-nav a');
    var navIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['proposal', 'fixtures', 'vault', 'biz', 'gallery', 'fanzone', 'more'].forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
  }

  /* ============================ effects canvas (bursts) ============================ */
  var fx = document.createElement('canvas'); fx.setAttribute('aria-hidden', 'true');
  fx.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:85';
  document.body.appendChild(fx);
  var fctx = fx.getContext('2d'), sparks = [], fxOn = false, DPR = Math.min(2, devicePixelRatio || 1);
  function sizeFx() { fx.width = innerWidth * DPR; fx.height = innerHeight * DPR; }
  sizeFx(); addEventListener('resize', sizeFx);
  var COLS = ['#f26522', '#ff8a2a', '#ffb000', '#ffd27a', '#d8341b'];
  function burst(x, y, n, power) {
    if (RM) return;
    for (var i = 0; i < (n || 40); i++) {
      var a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 7) * (power || 1);
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 3, life: 1, r: 2 + Math.random() * 4, c: COLS[i % COLS.length], sq: Math.random() > .5 });
    }
    if (!fxOn) { fxOn = true; requestAnimationFrame(fxLoop); }
  }
  function fxLoop() {
    fctx.setTransform(DPR, 0, 0, DPR, 0, 0); fctx.clearRect(0, 0, innerWidth, innerHeight);
    sparks = sparks.filter(function (p) { return p.life > 0; });
    sparks.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.22; p.vx *= 0.985; p.life -= 0.014;
      fctx.globalAlpha = Math.max(0, p.life); fctx.fillStyle = p.c;
      if (p.sq) { fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.life * 8); fctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); fctx.restore(); }
      else { fctx.beginPath(); fctx.arc(p.x, p.y, p.r, 0, 7); fctx.fill(); }
    });
    if (sparks.length) requestAnimationFrame(fxLoop); else { fxOn = false; fctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.btn-fire'); if (b) burst(e.clientX, e.clientY, 22, .7);
  });

  /* ============================ hero: intro + embers + parallax ============================ */
  var hero = $('.hero'), me = $('.hero-me'), me2 = $('.hero-alt'), word = $('.hero-word');
  // two poses, swapping while the hero is on screen
  (function () {
    if (!me2) return;
    var phone = function () { return innerWidth <= 760; };
    function sync() {
      if (phone()) { me2.style.top = me.offsetTop + 'px'; me2.style.left = me.offsetLeft + 'px'; me2.style.width = me.offsetWidth + 'px'; me2.style.height = me.offsetHeight + 'px'; }
      else { me2.style.top = me2.style.left = me2.style.width = me2.style.height = ''; }
    }
    sync(); addEventListener('resize', sync); addEventListener('load', sync); me.addEventListener('load', sync);
    if (RM) return;
    var seen = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: .25 }).observe(hero);
    var zap = $('#hero-zap'), zp = $$('path', zap), zipping = false;
    zap.style.webkitMaskImage = zap.style.maskImage = 'url(' + me.src + '), url(' + me2.src + ')';
    function place(el) { el.style.left = me.offsetLeft + 'px'; el.style.top = me.offsetTop + 'px'; el.style.width = me.offsetWidth + 'px'; el.style.height = me.offsetHeight + 'px'; }
    // a slim lightning seam zips down through the photo; the new pose is revealed above it
    function strike() {
      if (zipping) return; zipping = true; sync(); place(zap);
      var toAlt = !hero.classList.contains('alt-on'), N = 14, base = [], T = 720, t0 = 0;
      for (var i = 0; i <= N; i++) base.push((Math.random() - .5) * 9);
      hero.classList.add('zipping'); zap.classList.add('on');
      function frame(ts) {
        if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / T), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var y0 = -12 + e * 124, pts = [];
        for (var i = 0; i <= N; i++) pts.push([(i / N * 100), y0 + base[i] + (Math.random() - .5) * 1.6]);
        var edge = pts.map(function (p) { return p[0].toFixed(2) + '% ' + p[1].toFixed(2) + '%'; });
        var above = 'polygon(0% -20%, 100% -20%, ' + edge.slice().reverse().join(', ') + ')';
        var below = 'polygon(' + edge.join(', ') + ', 100% 120%, 0% 120%)';
        me2.style.clipPath = me2.style.webkitClipPath = toAlt ? above : below;
        var d = 'M' + pts.map(function (p) { return p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join(' L');
        zp[0].setAttribute('d', d); zp[1].setAttribute('d', d);
        if (k < 1) requestAnimationFrame(frame);
        else { hero.classList.toggle('alt-on', toAlt); me2.style.clipPath = me2.style.webkitClipPath = ''; hero.classList.remove('zipping'); zap.classList.remove('on'); zipping = false; }
      }
      requestAnimationFrame(frame);
    }
    setTimeout(function () { hero.classList.add('swapping'); }, 3200);
    setInterval(function () { if (!seen || document.hidden || !hero.classList.contains('swapping')) return; strike(); }, 4500);
  })();
  function go() { document.body.classList.add('ready'); }
  if (RM) go();
  else {
    var started = false, start = function () { if (started) return; started = true; setTimeout(go, 150); };
    if (me.complete) start(); else { me.addEventListener('load', start); me.addEventListener('error', start); }
    setTimeout(start, 1500);
  }
  var tk = $('#tk-track');
  var TICK = [['10,500 athletes', 'HYROX Delhi, I ran the MU zone'], ['U19 national', 'badminton, for Telangana'], ['Top 5 of 93', 'goSTOPS challenge'], ['₹2L+ revenue', 'The Better Store, dropshipping'], ['Top 3 of 15', 'NIVIA jersey challenge'], ['55+ reports', 'The Business Research Company'], ['60 players', 'IPL auction draft I ran'], ['10+ tournaments', 'TITANS IBS esports'], ['Vortilix', 'co-founding a startup in the MU Venture Initiation Program'], ['3 teams', 'one Orange Army']];
  var tkHTML = TICK.map(function (t) { return '<span>' + esc(t[0]) + ' <small>' + esc(t[1]) + '</small></span>'; }).join('');
  tk.innerHTML = '<div class="tk-g">' + tkHTML + '</div><div class="tk-g" aria-hidden="true">' + tkHTML + '</div>';

  var cv = $('#embers'), ctx = cv.getContext('2d'), embers = [], heroVisible = true;
  function sizeEm() { cv.width = hero.clientWidth * DPR; cv.height = hero.clientHeight * DPR; }
  function mkEmber(init) {
    var w = hero.clientWidth, h = hero.clientHeight;
    return { x: w * (0.35 + Math.random() * 0.65), y: init ? Math.random() * h : h + 10, vy: 0.4 + Math.random() * 1.3, vx: (Math.random() - .5) * .4, r: .8 + Math.random() * 2.4, a: .3 + Math.random() * .7, ph: Math.random() * 6 };
  }
  if (!RM) {
    sizeEm(); addEventListener('resize', sizeEm);
    for (var i = 0; i < (MOBILE ? 40 : 80); i++) embers.push(mkEmber(true));
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; if (heroVisible) requestAnimationFrame(emLoop); }).observe(hero);
    var emLoop = function (t) {
      if (!heroVisible) return;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, hero.clientWidth, hero.clientHeight);
      embers.forEach(function (e, i) {
        e.y -= e.vy; e.x += e.vx + Math.sin(t / 900 + e.ph) * .35;
        if (e.y < -10) embers[i] = mkEmber(false);
        var fl = .6 + .4 * Math.sin(t / 180 + e.ph);
        ctx.globalAlpha = e.a * fl; ctx.fillStyle = e.r > 2.2 ? '#ffb000' : '#ff7a2a';
        ctx.shadowColor = '#ff6a1a'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 7); ctx.fill();
      });
      requestAnimationFrame(emLoop);
    };
    requestAnimationFrame(emLoop);
    if (!MOBILE) hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      me.style.translate = me2.style.translate = (dx * -18) + 'px ' + (dy * -8) + 'px';
      word.style.translate = (dx * 30) + 'px ' + (dy * 14) + 'px';
    });
  }

  /* ============================ reveal ============================ */
  io($$('[data-reveal]'), function (el) { el.classList.add('in'); }, { threshold: 0.15 });

  /* ============================ case dialog ============================ */
  /* projects that used to open their own page now open in the same pop-up */
  var CASE_PDF = { 'one-orange-army': ['media/docs/one-orange-army.pdf', 'Open the full plan (PDF)'], 'nivia-india-jersey': ['media/docs/nivia-gtm.pdf', 'Open the deck'], 'gostops-off-season': ['media/docs/gostops-gtm.pdf', 'Open the deck'] };
  var portfolioP = null;
  function openPage(slug) {
    portfolioP = portfolioP || fetch('content/portfolio.json').then(function (r) { return r.json(); });
    portfolioP.then(function (d) {
      var p = (d.projects || []).filter(function (x) { return x.slug === slug; })[0], pg = (d.project_pages || {})[slug] || {};
      if (!p) return;
      var nums = (pg.results || []).slice(0, 3).map(function (r) { return [r.value, r.metric]; });
      var text = p.summary + (pg.problem ? ' ' + pg.problem : '');
      var pdf = CASE_PDF[slug];
      openCase({ kicker: p.org + (p.year ? ' · ' + p.year : ''), title: p.title, text: text, nums: nums, role: 'My role: ' + (pg.my_role || p.role), img: 'media/' + p.thumbnail, link: pdf && pdf[0], linkText: pdf && pdf[1] });
    });
  }
  var dlg = $('#case');
  function openCase(c) {
    if (c.page) { openPage(c.page === true ? c.slug : c.page); return; }
    $('#case-kicker').textContent = c.kicker || ''; $('#case-title').textContent = c.title || ''; $('#case-text').textContent = c.text || '';
    $('#case-nums').innerHTML = numsHTML(c.nums || []);
    $('#case-role').textContent = c.role || '';
    var m = $('#case-media'); m.innerHTML = '';
    if (c.video) m.innerHTML = '<video src="' + c.video + '" poster="' + c.poster + '" muted loop playsinline controls ' + (RM ? '' : 'autoplay') + ' aria-label="The IPL auction draft in progress"></video>';
    else if (c.imgs) m.innerHTML = '<div class="case-strip">' + c.imgs.map(function (i) { return /\.mp4$/.test(i) ? '<video src="' + i + '" muted loop playsinline controls preload="metadata"' + (RM ? '' : ' autoplay') + '></video>' : '<img src="' + i + '" alt="" loading="lazy">'; }).join('') + '</div>';
    else if (c.decks) m.innerHTML = $('#dbm-tpl').innerHTML;
    else if (c.group) {
      m.innerHTML = '<div class="decks subs">' + c.group.map(function (lab) {
        var x = byLabel[lab], d = x.store ? STORE : x, n = (d.nums && d.nums[0]) || ['', ''];
        return '<button type="button" class="deck sub" data-sub="' + esc(lab) + '"><span class="sub-art">' + SVG[x.obj] + '</span><span class="mono">' + esc(x.kicker || d.kicker || '') + '</span><b>' + esc(lab) + '</b><small><em>' + esc(n[0]) + '</em> ' + esc(n[1]) + '</small><span class="sub-go">Open →</span></button>';
      }).join('') + '</div>';
      $$('[data-sub]', m).forEach(function (bt) { bt.addEventListener('click', function () { openOf(byLabel[bt.dataset.sub])(); }); });
    }
    else if (c.img) m.innerHTML = '<img class="bg" src="' + c.img + '" alt=""><img class="fg" src="' + c.img + '" alt="">';
    m.hidden = !(c.video || c.img || c.imgs || c.decks || c.group); m.classList.toggle('strip', !!(c.imgs || c.decks || c.group)); m.classList.toggle('decks-on', !!(c.decks || c.group));
    $('#case-kitnav').hidden = !c.kit;
    var a = $('#case-link'); if (c.link) { a.href = c.link; a.textContent = c.linkText || 'Open the deck'; a.hidden = false; } else a.hidden = true;
    if (lenis) lenis.stop();
    if (!dlg.open) { dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', ''); }
    dlg.scrollTop = 0; var dc = dlg.querySelector('.case-body, .case-in'); if (dc) dc.scrollTop = 0;
  }
  $('#case-x').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { var v = dlg.querySelector('video'); if (v) v.pause(); if (lenis) lenis.start(); });

  // tiny pre-blurred copies (media/blur) stand in for live CSS blur, which is costly to repaint while scrolling
  var blurOf = function (src) { return 'media/blur/' + src.replace('media/', '').replace(/\//g, '_').replace(/\.[a-z]+$/, '.jpg'); };
  /* pause looping animations in sections that are off screen, so scrolling stays light */
  if ('IntersectionObserver' in window) {
    var po = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('anim-off', !e.isIntersecting); }); }, { rootMargin: '120px 0px' });
    $$('main section').forEach(function (sec) { po.observe(sec); });
  }

  /* ============================ 1. WALK-OUT (kit change) ============================ */
  var KITS = [
    { img: 'media/kit/kit-1-player.webp', tag: 'Kit 01 · The player', num: '01', title: 'A player first.',
      text: 'I represented Telangana in national-level badminton as an under-19, and I hold a maroon belt in Kung Fu. I know match day from the court, not only from the stands.',
      nums: [['U19', 'national level, for Telangana'], ['Maroon', 'belt in Kung Fu']] },
    { img: 'media/kit/kit-2-professional.webp', tag: 'Kit 02 · The researcher', num: '02', title: 'The research desk.',
      text: 'Nearly 3 years at The Business Research Company: 55+ reports across 10 industries, delivered in 2–3 business days instead of 7, and a database idea that became a new product. It taught me to find the number that matters.',
      nums: [['55+', 'market research reports'], ['2 → 4', 'reports a week, after my Excel workflow']] },
    { img: 'media/kit/kit-3-organiser.webp', tag: 'Kit 03 · The organiser', num: '03', title: 'On the ground, with the crowd.',
      text: 'Not a racer: as a volunteer lead at HYROX Delhi, I ran the Masters’ Union zone for three days. I also ran an IPL auction draft for the SMG Club.',
      nums: [['10,500', 'athletes at HYROX Delhi'], ['Repeat', 'IPL auction students asked for again']] },
    { img: 'media/kit/kit-4-gamer.webp', tag: 'Kit 04 · The gamer', num: '04', title: 'Communities that play together.',
      text: 'In-game leader and event coordinator at TITANS IBS, the esports club at ICFAI Business School. A community is built one match night at a time.',
      nums: [['10+', 'tournaments for 250+ players'], ['1st', 'place, Valorant tournament']] },
    { img: 'media/kit/kit-5-riser.webp', tag: 'Kit 05 · The Riser', num: '05', title: 'Orange Army since I was a kid.',
      text: 'That’s me at Uppal about 11 years ago, Sunrisers headband on. Hyderabad-raised and Orange Army ever since. Now I want to help the Sunrisers keep their fans all year, across all three teams.',
      nums: [['11 yrs', 'in the Orange Army'], ['3', 'Sunrisers teams']] }
  ];
  var krow = $('#kits-row'), kitAt = -1;
  KITS.forEach(function (k, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'kit';
    b.setAttribute('aria-label', k.tag + ': ' + k.title);
    b.innerHTML = '<img src="' + k.img + '" alt="" loading="lazy"><span>' + esc((function (n) { return n.charAt(0).toUpperCase() + n.slice(1); })(k.tag.split(' · ')[1].replace('The ', ''))) + '</span>';
    b.addEventListener('click', function () { openKit(i); });
    krow.appendChild(b);
  });
  function openKit(i) {
    kitAt = (i + KITS.length) % KITS.length; var k = KITS[kitAt];
    openCase({ kicker: k.tag, title: k.title, text: k.text, nums: k.nums, img: k.img, kit: true });
    $('#kit-count').textContent = String(kitAt + 1).padStart(2, '0') + ' / ' + String(KITS.length).padStart(2, '0');
  }
  $('#kit-prev').addEventListener('click', function () { openKit(kitAt - 1); });
  $('#kit-next').addEventListener('click', function () { openKit(kitAt + 1); });

  /* ============================ 2. SQUAD ============================ */
  var RACKET = '<svg viewBox="0 0 200 220" aria-hidden="true"><g transform="rotate(-30 100 110)"><ellipse cx="100" cy="62" rx="38" ry="52" fill="rgba(255,255,255,.06)" stroke="#f26522" stroke-width="6"/><g stroke="#f3e9df" stroke-width="1.2" opacity=".75"><path d="M76 24V100M88 14V110M100 10V114M112 14V110M124 24V100"/><path d="M64 40H136M62 54H138M62 68H138M64 82H136M70 96H130"/></g><rect x="96" y="114" width="8" height="58" fill="#c9ccd3"/><rect x="92" y="170" width="16" height="44" rx="6" fill="#16171c"/></g><g transform="translate(152 44) rotate(25)"><path d="M0 0 L-14 -32 H14Z" fill="#f3e9df"/><circle cx="0" cy="6" r="8" fill="#f26522"/></g></svg>';
  var BELT = '<svg viewBox="0 0 200 160" aria-hidden="true"><path d="M10 60 Q100 40 190 60 L190 84 Q100 64 10 84Z" fill="#7a1b1b"/><path d="M10 60 Q100 40 190 60" stroke="#a52a2a" stroke-width="3" fill="none"/><path d="M86 52 L114 52 L118 92 L82 92Z" fill="#6a1414"/><path d="M90 88 L66 150 L82 150 L100 96Z" fill="#7a1b1b"/><path d="M110 88 L134 150 L118 150 L100 96Z" fill="#7a1b1b"/><circle cx="100" cy="72" r="10" fill="#f26522"/></svg>';
  var PAD = '<svg viewBox="0 0 200 160" aria-hidden="true"><path d="M52 52 Q100 38 148 52 Q176 60 182 104 Q186 132 162 132 Q146 132 132 110 L68 110 Q54 132 38 132 Q14 132 18 104 Q24 60 52 52Z" fill="rgba(255,255,255,.06)" stroke="#f26522" stroke-width="6" stroke-linejoin="round"/><path d="M58 70 v28 M44 84 h28" stroke="#f3e9df" stroke-width="7" stroke-linecap="round"/><circle cx="138" cy="74" r="7" fill="#f26522"/><circle cx="152" cy="88" r="7" fill="#f3e9df"/><circle cx="124" cy="88" r="7" fill="#f3e9df"/><circle cx="138" cy="102" r="7" fill="#f26522"/></svg>';
  var SQUAD = [
    { num: '01', badge: 'U19', role: 'Player', name: 'Badminton', line: 'National level, under-19, for Telangana', art: RACKET, dimg: 'media/kit/kit-1-player.webp',
      kicker: 'Player · Badminton', title: 'Telangana, on court.', text: 'I represented Telangana in national-level badminton as an under-19, after 3rd place in a District U16 tournament. Still on court whenever I can.', nums: [['U19', 'national level'], ['3rd', 'District U16']], role2: 'What it gave me: I know how match day feels for a player, not only for a fan.' },
    { num: '02', badge: 'Belt', role: 'Fighter', name: 'Kung Fu', line: 'Maroon belt', art: BELT,
      kicker: 'Fighter · Kung Fu', title: 'Maroon belt.', text: 'I hold a maroon belt in Kung Fu. Years of training taught me discipline, and that the work no one sees is what shows up on the day.', nums: [['Maroon', 'belt in Kung Fu']], role2: '' },
    { num: '03', badge: 'IGL', role: 'In-game leader', name: 'Esports', line: '1st in Valorant, 2nd in Counter-Strike', art: PAD,
      kicker: 'Player · TITANS IBS', title: 'In-game leader.', text: 'I played Valorant and Counter-Strike competitively in 2021–22 as in-game leader with TITANS IBS, and coordinated the club’s tournaments.', nums: [['1st', 'Valorant tournament'], ['2nd', 'Counter-Strike tournament'], ['10+', 'tournaments run']], role2: 'My role: player, in-game leader and event coordinator.' },
    { num: '04', badge: '3 days', role: 'On-ground', name: 'HYROX Delhi', line: '10,500 athletes; I ran the Masters’ Union zone', img: 'media/projects/hyrox-delhi/course.webp', pos: '50% 50%',
      kicker: 'Events · HYROX Delhi 2026', title: 'Where the crowd is.', text: 'At HYROX Delhi (10,500 athletes over three days), I volunteered and took charge of the Masters’ Union zone, 7 AM to 9 PM each day. We handed out 8,000+ finisher goodies bags, about 80% of all athletes. The personalised time tags were being typed up from AI-read photos of scorecards, and about 100 came out wrong. I fixed them on the spot from athletes’ own timestamp photos, then pushed to switch to HYROX’s official timing data. From day two, wrong tags dropped to zero. At peak, I moved volunteers between stations so queues of 80–100 athletes cleared in 10–15 minutes.', nums: [['8,000+', 'goodies bags, ~80% of athletes'], ['~100 → 0', 'wrong time tags'], ['~20', 'volunteers in the zone']], role2: 'My role: volunteer who took charge of the Masters’ Union zone.', imgs: ['media/projects/hyrox-delhi/hall.webp', 'media/video/hyrox.mp4', 'media/projects/hyrox-delhi/course.webp', 'media/projects/hyrox-delhi/finish.webp', 'media/projects/hyrox-delhi/classof.webp', 'media/projects/hyrox-delhi/venue.webp', 'media/projects/hyrox-delhi/letters.webp'] },
    { num: '05', badge: 'Lot 01', role: 'Auctioneer', name: 'IPL auction', line: 'Students asked for a repeat', img: 'media/photos/auction-draft.webp', pos: '50% 50%',
      kicker: 'Events · SMG Club', title: 'An auction students asked to repeat.', text: 'An IPL auction for the Masters’ Union SMG Club. Ten student teams planned their budgets around live bidding and surprise wildcards, like a star player ruled out injured mid-auction. It ran on time and within its ₹5K budget. Masters’ Union’s Student Union President rated it the best event across the 13 student clubs, and students asked us to run another.', nums: [['Top', 'event of MU’s 13 clubs, per the Student Union President'], ['Repeat', 'event requested by students'], ['60', 'students, 10 teams']], role2: 'My role: ran it end to end.', video: 'media/video/auction.mp4', poster: 'media/photos/auction-draft.webp' },
    { num: '06', badge: '55+', role: 'Analyst', name: 'Research desk', line: 'New product, 2 clients; delivery 7 → 2–3 days', img: 'media/photos/blazer-full.webp', pos: '50% 15%',
      kicker: 'Work · The Business Research Company', title: 'The research desk.', text: 'Nearly 3 years as an associate consultant: 55+ market research reports across 10 industries and 5 regions. I proposed a green hydrogen database that TBRC turned into a new product, sold to 2 clients at $10K each. I proposed an automated drafting workflow that doubled weekly output from 2 to 4, and cut report delivery from 7 to 2–3 business days. I also ran first-level QC on every report and wrote proposal sample pages for 500–600 reports for the sales team.', nums: [['2', 'clients for my database, at $10K each'], ['7 → 2–3', 'business days to deliver a report'], ['2 → 4', 'reports a week, my workflow']], role2: 'My role: researched, wrote and QC’d reports; proposed the database and the workflow.' },
    { num: '07', badge: 'Fan', role: 'Orange Army', name: 'Orange Army', line: 'Hyderabad, through and through', crest: true, dimg: 'media/photos/portrait-mic.webp',
      kicker: 'Fan · Hyderabad', title: 'Orange Army, from the stands.', text: 'IPL nights in the stands at Uppal, Hyderabad. The crowd is the part of the game I want to work on: what brings fans back, and what keeps them between seasons.', nums: [['Hyderabad', 'home ground'], ['3', 'Sunrisers teams to follow']], role2: 'Looking for: a fan engagement and brand role across the Sunrisers teams.' },
    { num: '08', badge: '₹2L+', role: 'Founder', name: 'Entrepreneur', line: 'A ₹2L+ dropshipping store, and Vortilix', img: 'media/projects/better-store/stall-table.webp', pos: '50% 20%',
      kicker: 'Founder · Masters’ Union', title: 'Two businesses from zero.', text: 'The Better Store, a dropshipping store run from a campus stall, made ₹2L+ in revenue. Now I’m co-founding Vortilix, a nutraceutical focus shot, in the Masters’ Union Venture Initiation Program.', nums: [['₹2L+', 'Better Store revenue'], ['3', 'Vortilix co-founders']], role2: 'My role: products, suppliers, pricing and marketing at the store; marketing and go-to-market at Vortilix.', dimg: 'media/projects/better-store/stall-crouch.webp' },
  ];
  var sTrack = $('#squad-track');
  SQUAD.forEach(function (p) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pcard';
    b.setAttribute('aria-label', p.name + ': ' + p.line + '. Read more');
    b.innerHTML = (p.img ? '<img src="' + p.img + '" alt="" loading="lazy" style="object-position:' + p.pos + '">' : p.crest ? '<div class="pc-art crest"><img src="media/logos/srh-logo.webp" alt=""></div>' : '<div class="pc-art">' + p.art + '</div>') +
      '<span class="pc-num" aria-hidden="true">' + p.num + '</span><span class="pc-badge" aria-hidden="true">' + esc(p.badge) + '</span>' +
      '<span class="pc-body"><span class="pc-role">' + esc(p.role) + '</span><span class="pc-name">' + esc(p.name) + '</span><span class="pc-line">' + esc(p.line) + '</span><span class="pc-more">Read more →</span></span>';
    b.addEventListener('click', function () { openCase({ kicker: p.kicker, title: p.title, text: p.text, nums: p.nums, role: p.role2, img: p.dimg || p.img, imgs: p.imgs, pos: p.pos, video: p.video, poster: p.poster }); });
    if (!RM && !MOBILE) {
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; b.style.setProperty('--ry', ((x - .5) * 14) + 'deg'); b.style.setProperty('--rx', ((.5 - y) * 10) + 'deg'); b.style.setProperty('--gx', x * 100 + '%'); b.style.setProperty('--gy', y * 100 + '%'); });
      b.addEventListener('pointerleave', function () { b.style.setProperty('--ry', '0deg'); b.style.setProperty('--rx', '0deg'); });
    }
    sTrack.appendChild(b);
  });
  $$('.arw').forEach(function (a) { a.addEventListener('click', function () { var t = document.getElementById(a.dataset.track); t.scrollBy({ left: +a.dataset.dir * Math.min(t.clientWidth * .8, 700), behavior: RM ? 'auto' : 'smooth' }); }); });
  if (window.gsap && !RM) gsap.from('.pcard', { y: 80, opacity: 0, duration: .9, ease: 'power3.out', stagger: .08, clearProps: 'transform,opacity', scrollTrigger: { trigger: '#squad-track', start: 'top 85%' } });

  /* ============================ 3. MILESTONES ============================ */
  var MILES = [['8,000+', 'finisher bags delivered', 'HYROX Delhi 2026 · 10,500 athletes'], ['Top 5', 'of 93 teams', 'goSTOPS challenge'], ['Top 3', 'of 15 teams, ₹50L launch plan', 'NIVIA × Indian football'], ['₹2L+', 'dropshipping revenue', 'The Better Store'],
    ['2 → 4', 'reports a week, my workflow', 'TBRC'], ['Repeat', 'event requested after my IPL auction', 'SMG Club'], ['10+', 'esports tournaments run', 'TITANS IBS'], ['U19', 'national-level badminton', 'Telangana']];
  var mg = $('#miles-grid');
  mg.innerHTML = MILES.map(function (m) { return '<div class="mile" data-reveal><b data-count="' + esc(m[0]) + '">' + esc(m[0]) + '</b><span>' + esc(m[1]) + '</span><small>' + esc(m[2]) + '</small></div>'; }).join('');
  io($$('.mile', mg), function (el) {
    el.classList.add('in');
    var b = $('b', el), raw = b.dataset.count, m = raw.match(/^(\D*?)(\d[\d,]*\.?\d*)(.*)$/);
    if (!m || RM || /U19/.test(raw)) return;
    var pre = m[1], num = parseFloat(m[2].replace(/,/g, '')), suf = m[3], dec = (m[2].split('.')[1] || '').length, comma = m[2].indexOf(',') > -1, t0 = null;
    var step = function (t) {
      if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3), v = num * e;
      var s = dec ? v.toFixed(dec) : String(Math.round(v)); if (comma) s = Number(s).toLocaleString('en-IN');
      b.textContent = pre + s + suf; if (p < 1) requestAnimationFrame(step); else b.textContent = raw;
    };
    requestAnimationFrame(step);
  }, { threshold: 0.4 });
  $$('.mile', mg).forEach(function (m, i) { m.style.transitionDelay = (i % 4) * 0.08 + 's'; });

  /* ============================ 4. FIXTURES: year + passport ============================ */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var TEAM = { 0: 'SEC', 1: 'SEC', 2: 'SRH', 3: 'SRH', 4: 'SRH', 6: 'LDS', 7: 'LDS' };
  var monthsEl = $('#months');
  monthsEl.innerHTML = MONTHS.map(function (m, i) { return '<div class="mo" data-i="' + i + '"><span class="m">' + m + '</span><span class="t">' + (TEAM[i] || '') + '</span></div>'; }).join('');
  var mos = $$('.mo', monthsEl), cap = $('#year-cap'), segBtns = $$('.seg button'), yearState = 'today', userPicked = false;
  function setYear(st) {
    yearState = st;
    segBtns.forEach(function (b) { var on = b.dataset.year === st; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    mos.forEach(function (m, i) {
      var lit = st === 'today' ? TEAM[i] === 'SRH' : !!TEAM[i];
      setTimeout(function () { m.classList.toggle('lit', lit); }, RM ? 0 : i * 60);
    });
    cap.textContent = st === 'today' ? 'Today: Hyderabad gathers for 3 months a year' : 'With One Orange Army: 7 months of Sunrisers cricket to cheer for';
    if (st === 'plan') { var r = monthsEl.getBoundingClientRect(); setTimeout(function () { burst(r.left + r.width * .3, r.top + 40, 30, .8); burst(r.left + r.width * .6, r.top + 40, 30, .8); }, 500); }
  }
  setYear('today');
  segBtns.forEach(function (b) { b.addEventListener('click', function () { userPicked = true; setYear(b.dataset.year); }); });
  var planBtn = $('.seg button[data-year="plan"]'); planBtn.classList.add('hint');
  segBtns.forEach(function (b) { b.addEventListener('click', function () { planBtn.classList.remove('hint'); }); });
  io([$('#passport')], function (el) { el.classList.add('in'); }, { threshold: 0.5 });

  /* ============================ thesis deck ============================ */
  (function () {
    var tr = $('#ts-track'); if (!tr) return;
    var slides = $$('.tslide', tr), dots = $('#ts-dots'), cnt = $('#ts-count'), prev = $('#ts-prev'), next = $('#ts-next'), chaps = $$('.ts-chaps button');
    dots.innerHTML = slides.map(function () { return '<i></i>'; }).join('');
    var di = $$('i', dots), cur = 0;
    function idx() { var x = tr.scrollLeft, b = 0, d = 1e9; slides.forEach(function (s, i) { var e = Math.abs(s.offsetLeft - slides[0].offsetLeft - x); if (e < d) { d = e; b = i; } }); return b; }
    function paint() {
      cur = Math.max(0, Math.min(slides.length - 1, idx()));
      di.forEach(function (d, i) { d.classList.toggle('on', i <= cur); });
      cnt.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      prev.disabled = cur === 0; next.disabled = cur === slides.length - 1;
      var c = cur < 2 ? 0 : cur < 3 ? 1 : cur < 6 ? 2 : 3; chaps.forEach(function (b, i) { b.classList.toggle('on', i === c); });
      if (cur === 6 && !userPicked) setYear('plan');
    }
    function go(i) { i = Math.max(0, Math.min(slides.length - 1, i)); cur = i; tr.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: RM ? 'auto' : 'smooth' }); }
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });
    chaps.forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.go); }); });
    tr.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); } });
    var t; tr.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(paint, 60); }, { passive: true });
    addEventListener('resize', function () { go(cur); });
    paint();
  })();

  /* ============================ 5. ORANGE VAULT ============================ */
  var WORK = [
    { slug: 'one-orange-army', type: 'Concept', title: 'One Orange Army, three seasons', org: 'A concept for the Sunrisers group', big: '4', res: 'Nights in an SA20 2027 pilot', img: 'media/projects/one-orange-army/thumb.webp', page: true },
    { slug: 'nivia-india-jersey', fit: true, type: 'Launch', title: 'Wear the Blue: India’s football jersey', org: 'NIVIA · live industry challenge', big: 'Top 3', res: 'of 15 teams; ₹50L plan, 30K jerseys in 90 days, base case', img: 'media/projects/nivia-india-jersey/thumb.webp', page: true },
    { slug: 'gostops-off-season', fit: true, type: 'Strategy', title: 'Filling hostels in the off-season', org: 'goSTOPS · one-day challenge', big: 'Top 5', res: 'of 93 teams; occupancy 27.5% → 43.8%', img: 'media/projects/gostops-off-season/thumb.webp', page: true },
    { slug: 'hyrox-delhi', type: 'Event', title: 'HYROX Delhi: running the MU zone', org: 'HYROX Delhi · Masters’ Union', big: '8,000+', res: 'finisher bags; wrong time tags cut from ~100 to zero', img: 'media/projects/hyrox-delhi/hall.webp',
      kicker: 'Events · HYROX Delhi 2026', text: 'At HYROX Delhi (10,500 athletes over three days), I volunteered and took charge of the Masters’ Union zone, 7 AM to 9 PM each day. We handed out 8,000+ finisher goodies bags, about 80% of all athletes. The personalised time tags were being typed up from AI-read photos of scorecards, and about 100 came out wrong. I fixed them on the spot from athletes’ own timestamp photos, then pushed to switch to HYROX’s official timing data. From day two, wrong tags dropped to zero. At peak, I moved volunteers between stations so queues of 80–100 athletes cleared in 10–15 minutes.', nums: [['8,000+', 'goodies bags, ~80% of athletes'], ['~100 → 0', 'wrong time tags'], ['~20', 'volunteers in the zone']], role: 'My role: volunteer who took charge of the Masters’ Union zone.', imgs: ['media/projects/hyrox-delhi/hall.webp', 'media/video/hyrox.mp4', 'media/projects/hyrox-delhi/course.webp', 'media/projects/hyrox-delhi/finish.webp', 'media/projects/hyrox-delhi/classof.webp', 'media/projects/hyrox-delhi/venue.webp', 'media/projects/hyrox-delhi/letters.webp'] },
    { slug: 'titans-esports', type: 'Community', title: 'TITANS IBS: match nights that grew', org: 'TITANS IBS · ICFAI Business School', big: '4x', res: 'registrations, from 9 to 40', img: 'media/projects/titans-esports/thumb.webp',
      kicker: 'Community · TITANS IBS', text: 'Ran the college esports club’s tournaments and led its Valorant team. Moving promotion from social feeds to college dashboards grew registrations about four times.', nums: [['10+', 'tournaments'], ['250+', 'participants'], ['9 → 40', 'registrations']], role: 'My role: event coordinator and in-game leader.' },
    { slug: 'pepperfry-shopper', fit: true, type: 'Research', title: 'Pepperfry: beyond the showroom', org: 'Masters’ Union · Consumer Behaviour', big: '#6', res: 'of 19 brands, with fixes to lift the score to 77.5', img: 'media/projects/pepperfry-shopper/thumb.webp',
      kicker: 'Consumer research · Pepperfry', text: 'A Furniture Experience Index across 19 brands and 7 touchpoints, built from 19 NCR store visits and 30 customer interviews. Pepperfry ranked #6 of 19 (73.0 against a 66.5 average).', nums: [['19', 'stores visited'], ['30', 'customer interviews'], ['#6 of 19', 'Pepperfry’s rank']], role: 'My role: ran the mystery shopping and interviews and built the index scoring (team project).', link: 'media/docs/pepperfry-odc.pdf' },
    { slug: 'oohlala-growth', fit: true, type: 'Growth analytics', title: 'Oohlala: fix the leaks before buying traffic', org: 'Masters’ Union · Marketing Analytics Lab', big: 'Top 5', res: 'of 30 teams; plan built on the brand’s real GA4 data', img: 'media/projects/oohlala/thumb.webp',
      kicker: 'Growth analytics · Oohlala Stories', text: 'A Q4 growth plan for a D2C brand, built from seven months of its website’s GA4 data and presented to the founders. Most shoppers were lost between adding to cart and starting checkout, so we argued for fixing those leaks before buying more traffic, and ranked three fixes, each with a target, a stop rule and a date to read the result.', nums: [['Top 5', 'of 30 teams'], ['3', 'ranked fixes, each with a test plan'], ['7', 'months of GA4 data analysed']], role: 'My role: pulled and analysed the GA4 data, built the performance measures and channel analysis, wrote the recommendation summary and structured the deck (team of 4).' },
    { slug: 'astralis-paradox', fit: true, type: 'Strategy', title: 'The Astralis Paradox', org: 'Masters’ Union · Term 1', big: 'DKK 5.4M', res: 'annual EBITDA loss diagnosed, with a turnaround', img: 'media/projects/astralis-paradox/thumb.webp',
      kicker: 'Esports strategy · Masters’ Union', text: 'Why a famous esports team was losing money, and a turnaround built on an asset-light model, D2C membership and an India creator plan.', nums: [['DKK 5.4M', 'annual EBITDA loss diagnosed'], ['Solo', 'project']], role: 'My role: financial diagnosis, turnaround model and India creator go-to-market.' }
  ];
  var STORE = { slug: 'better-store', type: 'Dropshipping', title: 'The Better Store: grades in rupees', org: 'Masters’ Union · dropshipping store', big: '₹2L+', res: 'in revenue from a dropshipping store', img: 'media/projects/better-store/stall-crouch.webp',
      kicker: 'Dropshipping · Masters’ Union', text: 'A dropshipping store run from a stall on campus, where the stall is the classroom and the grades are in rupees. We sold massage guns, steam irons, humidifiers, gadgets and handmade gifts face to face. When Meta ads started burning too much money, selling through Meesho instead was my idea.', nums: [['₹2L+', 'revenue'], ['Meesho', 'my idea to replace costly Meta ads']], role: 'My role: picked the products, negotiated with suppliers, set the prices, ran the social media marketing and sold to customers at the stall.', imgs: ['media/projects/better-store/stall-crouch.webp', 'media/projects/better-store/stall-table.webp', 'media/projects/better-store/stall-customer.webp', 'media/projects/better-store/stall-pitch.webp', 'media/projects/better-store/stall-team.webp'] };
  $$('[data-open-page]').forEach(function (b) { b.addEventListener('click', function () { openPage(b.getAttribute('data-open-page')); }); });
  $$('[data-open="store"]').forEach(function (b) { b.addEventListener('click', function () { openCase(STORE); }); });
  var vTrack = $('#vault-track');
  WORK.forEach(function (w) {
    var el = document.createElement('button');
    el.className = 'news';
    el.type = 'button';
    if (w.page) el.addEventListener('click', function () { openPage(w.slug); }); else { el.addEventListener('click', function () { openCase({ kicker: w.kicker, title: w.title, text: w.text, nums: w.nums, role: w.role, img: w.img, imgs: w.imgs, video: w.video, poster: w.poster, link: w.link }); }); }
    el.innerHTML = '<div class="news-img"><img class="bg pre" src="' + blurOf(w.img) + '" alt="" loading="lazy" aria-hidden="true"><img class="fg' + (w.fit ? ' fit' : '') + '" src="' + w.img + '" alt="" loading="lazy"><span class="news-type">' + esc(w.type) + '</span></div>' +
      '<div class="news-body"><span class="news-org">' + esc(w.org) + '</span><h3>' + esc(w.title) + '</h3><div class="news-res"><b>' + esc(w.big) + '</b><span>' + esc(w.res) + '</span></div><span class="news-more">' + ('Read more →') + '</span></div>';
    vTrack.appendChild(el);
  });
  if (window.gsap && !RM) gsap.from('.news', { y: 60, opacity: 0, duration: .8, ease: 'power3.out', stagger: .07, scrollTrigger: { trigger: '#vault-track', start: 'top 88%' } });

  /* ============================ 6. DRESSING ROOM ============================ */
  var SVG = {
    laptop: '<svg viewBox="0 0 200 130"><rect x="32" y="2" width="136" height="90" rx="6" fill="#1b1d24" stroke="#3a3d47" stroke-width="3"/><rect x="40" y="10" width="120" height="74" rx="2" fill="#0b1626"/><rect x="52" y="58" width="12" height="18" fill="#f26522"/><rect x="70" y="46" width="12" height="30" fill="#f26522"/><rect x="88" y="36" width="12" height="40" fill="#FF8A4C"/><rect x="106" y="26" width="12" height="50" fill="#f26522"/><rect x="124" y="18" width="12" height="58" fill="#FFB27F"/><path d="M8 96 H192 L200 112 H0Z" fill="#a4a9b3"/><rect x="0" y="112" width="200" height="6" rx="3" fill="#6b707a"/></svg>',
    notebook: '<svg viewBox="0 0 150 100"><path d="M14 30 L124 18 L140 80 L28 94Z" fill="#e9e1d3"/><path d="M10 26 L120 14 L136 76 L24 90Z" fill="#1f2a44"/><path d="M98 17 L114 73" stroke="#f26522" stroke-width="6"/><rect x="34" y="40" width="50" height="18" rx="2" transform="rotate(-6 59 49)" fill="#F5F2EE"/><text x="59" y="54" text-anchor="middle" transform="rotate(-6 59 49)" font-family="Anton,Impact,sans-serif" font-size="12" fill="#1f2a44">CASES</text></svg>',
    ball: '<svg viewBox="0 0 80 80"><defs><radialGradient id="bg1" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#e0473c"/><stop offset="1" stop-color="#6e110c"/></radialGradient></defs><circle cx="40" cy="40" r="36" fill="url(#bg1)"/><path d="M14 18 C 34 34, 46 46, 66 62" stroke="#f3e9df" stroke-width="2.5" fill="none"/><path d="M18 14 C 38 30, 50 42, 70 58" stroke="#f3e9df" stroke-width="2.5" fill="none" stroke-dasharray="3 4"/><path d="M10 22 C 30 38, 42 50, 62 66" stroke="#f3e9df" stroke-width="2.5" fill="none" stroke-dasharray="3 4"/></svg>',
    jersey: '<svg viewBox="0 0 170 90"><path d="M8 60 L162 60 L162 84 L8 84Z" fill="#163a9c"/><path d="M14 40 L156 40 L162 62 L8 62Z" fill="#1d4ed8"/><path d="M20 22 L150 22 L156 42 L14 42Z" fill="#2b5cf0"/><path d="M70 22 L85 36 L100 22" fill="none" stroke="#f26522" stroke-width="4"/><text x="85" y="78" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="14" fill="#fff" opacity=".8">INDIA</text></svg>',
    clipboard: '<svg viewBox="0 0 110 140"><rect x="6" y="14" width="98" height="122" rx="8" fill="#8a5330"/><rect x="14" y="24" width="82" height="104" rx="3" fill="#F5F2EE"/><rect x="36" y="4" width="38" height="22" rx="6" fill="#9aa0aa"/><path d="M24 52 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M24 78 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M24 104 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M50 54 H86 M50 80 H86 M50 106 H80" stroke="#1f2a44" stroke-width="4" stroke-linecap="round"/></svg>',
    racket: '<svg viewBox="0 0 120 300"><ellipse cx="60" cy="74" rx="46" ry="66" fill="rgba(255,255,255,.06)" stroke="#f26522" stroke-width="7"/><g stroke="#f3e9df" stroke-width="1.2" opacity=".8"><path d="M30 26 V122 M42 16 V132 M54 10 V138 M66 10 V138 M78 16 V132 M90 26 V122"/><path d="M18 50 H102 M15 66 H105 M14 82 H106 M16 98 H104 M24 114 H96 M24 36 H96"/></g><rect x="56" y="138" width="8" height="96" fill="#c9ccd3"/><rect x="52" y="230" width="16" height="66" rx="6" fill="#16171c"/><g transform="translate(92 250)"><path d="M0 0 L-16 -34 H16Z" fill="#f3e9df"/><circle cx="0" cy="6" r="9" fill="#f26522"/></g></svg>',
    trophy: '<svg viewBox="0 0 100 130"><path d="M26 10 H74 V44 C74 66 62 78 50 78 C38 78 26 66 26 44Z" fill="#f2b632"/><path d="M26 18 H8 C8 44 18 52 30 54 M74 18 H92 C92 44 82 52 70 54" fill="none" stroke="#f2b632" stroke-width="7"/><rect x="44" y="78" width="12" height="22" fill="#c98f1c"/><rect x="26" y="100" width="48" height="12" rx="3" fill="#16171c"/><rect x="18" y="112" width="64" height="12" rx="3" fill="#2b2d35"/><text x="50" y="52" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="28" fill="#7a5206">1</text></svg>',
    board: '<svg viewBox="0 0 200 130"><rect x="2" y="2" width="196" height="126" rx="6" fill="#f4f1ea" stroke="#9aa0aa" stroke-width="5"/><circle cx="46" cy="44" r="9" fill="none" stroke="#1f2a44" stroke-width="3"/><circle cx="96" cy="84" r="9" fill="none" stroke="#1f2a44" stroke-width="3"/><path d="M130 34 l16 16 M146 34 l-16 16 M150 78 l16 16 M166 78 l-16 16" stroke="#f26522" stroke-width="4" stroke-linecap="round"/><path d="M56 48 C 80 40, 84 70, 90 76" fill="none" stroke="#1f2a44" stroke-width="3" stroke-dasharray="6 5"/><path d="M106 82 C 130 76, 140 60, 148 56" fill="none" stroke="#f26522" stroke-width="3"/><text x="100" y="120" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="13" fill="#1f2a44">TURNAROUND PLAN</text></svg>',
    headset: '<svg viewBox="0 0 160 110"><path d="M22 70 C 22 18, 138 18, 138 70" fill="none" stroke="#2b2d35" stroke-width="12" stroke-linecap="round"/><path d="M22 70 C 22 18, 138 18, 138 70" fill="none" stroke="#f26522" stroke-width="3"/><rect x="6" y="58" width="34" height="46" rx="14" fill="#16171c"/><rect x="120" y="58" width="34" height="46" rx="14" fill="#16171c"/><rect x="12" y="66" width="22" height="30" rx="10" fill="#f26522"/><rect x="126" y="66" width="22" height="30" rx="10" fill="#f26522"/><path d="M26 98 Q40 108 58 104" stroke="#2b2d35" stroke-width="4" fill="none"/><circle cx="60" cy="104" r="5" fill="#2b2d35"/></svg>',
    hanging: '<svg viewBox="0 0 200 230"><path d="M100 4 a10 10 0 1 1 -8 16" fill="none" stroke="#c9ccd3" stroke-width="4"/><path d="M100 22 L30 62 H170Z" fill="none" stroke="#c9ccd3" stroke-width="4"/><path d="M58 52 L28 64 L6 120 L36 132 L46 106 L46 222 L154 222 L154 106 L164 132 L194 120 L172 64 L142 52 Q100 72 58 52Z" fill="#f26522"/><path d="M58 52 Q100 72 142 52" fill="none" stroke="#08090B" stroke-width="6"/><text x="100" y="118" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="26" fill="#08090B">ANUDEEP</text><path d="M46 222 H154" stroke="#08090B" stroke-width="6"/></svg>',
    kettlebell: '<svg viewBox="0 0 100 110"><path d="M30 44 C 22 10, 78 10, 70 44" fill="none" stroke="#2b2d35" stroke-width="12" stroke-linecap="round"/><path d="M30 44 C 22 10, 78 10, 70 44" fill="none" stroke="#4a4d57" stroke-width="3"/><ellipse cx="50" cy="72" rx="40" ry="36" fill="#1b1d24"/><ellipse cx="38" cy="60" rx="12" ry="9" fill="#3a3d47"/><rect x="34" y="66" width="32" height="18" rx="4" fill="#f26522"/><text x="50" y="80" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="14" fill="#0a0a0b">24</text><ellipse cx="50" cy="106" rx="30" ry="4" fill="#000" opacity=".4"/></svg>',
    bag: '<svg viewBox="0 0 100 120"><path d="M34 34 C 34 8, 66 8, 66 34" fill="none" stroke="#6b3a1d" stroke-width="5"/><path d="M12 32 H88 L94 116 H6Z" fill="#c9965f"/><path d="M12 32 H88 L90 46 H10Z" fill="#b5824c"/><rect x="18" y="56" width="64" height="38" rx="4" fill="#F5F2EE"/><text x="50" y="72" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="12" fill="#1f2a44">THE BETTER</text><text x="50" y="88" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="14" fill="#f26522">STORE</text><text x="50" y="108" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="11" fill="#6b3a1d">₹2L+</text></svg>',
    flag: '<svg viewBox="0 0 140 170"><rect x="10" y="4" width="7" height="164" rx="3" fill="#c9ccd3"/><circle cx="13.5" cy="5" r="6" fill="#f2b632"/><path d="M17 12 C 50 4, 80 24, 132 12 L132 86 C 80 98, 50 78, 17 86Z" fill="#f26522"/><path d="M17 12 C 50 4, 80 24, 132 12 L132 22 C 80 34, 50 14, 17 22Z" fill="#ff8a4c" opacity=".6"/><text x="74" y="46" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="19" fill="#0a0a0b">ONE ORANGE</text><text x="74" y="70" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="22" fill="#0a0a0b">ARMY</text></svg>',
    vortilix: "<svg viewBox='0 0 240 300' aria-hidden='true'><defs><linearGradient id='vx' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#ff8a2a'/><stop offset='1' stop-color='#d8341b'/></linearGradient></defs><ellipse cx='120' cy='282' rx='70' ry='10' fill='rgba(0,0,0,.45)'/><rect x='96' y='20' width='48' height='34' rx='6' fill='#1b1b1f' stroke='#ffb000' stroke-width='3'/><path d='M92 54 H148 L160 88 V262 Q160 276 146 276 H94 Q80 276 80 262 V88Z' fill='url(#vx)'/><rect x='80' y='130' width='80' height='84' fill='#0a0a0b'/><text x='120' y='166' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='21' fill='#f5f2ee' letter-spacing='1'>VORTILIX</text><text x='120' y='192' text-anchor='middle' font-family='Space Mono,monospace' font-size='10' fill='#ffb000'>FOCUS SHOT</text><path d='M100 70 Q108 100 100 118' stroke='rgba(255,255,255,.35)' stroke-width='5' fill='none' stroke-linecap='round'/></svg>",
    tablet: "<svg viewBox='0 0 150 120'><path d='M62 106 L56 118 H94 L88 106Z' fill='#2b2d35'/><rect x='4' y='4' width='142' height='104' rx='10' fill='#16171c' stroke='#3a3d47' stroke-width='3'/><rect x='12' y='12' width='126' height='88' rx='4' fill='#F5F2EE'/><path d='M12 16 a4 4 0 0 1 4 -4 H134 a4 4 0 0 1 4 4 V28 H12Z' fill='#f26522'/><text x='20' y='24' font-family='Arial,sans-serif' font-weight='700' font-size='9' fill='#fff'>MEET2TRACKER</text><rect x='20' y='36' width='11' height='11' rx='2' fill='none' stroke='#f26522' stroke-width='2'/><path d='M22 42 l3 3 l5 -6' stroke='#f26522' stroke-width='2' fill='none'/><rect x='38' y='39' width='58' height='5' rx='2' fill='#1f2a44'/><rect x='104' y='39' width='26' height='5' rx='2' fill='#9aa0aa'/><rect x='20' y='54' width='11' height='11' rx='2' fill='none' stroke='#f26522' stroke-width='2'/><path d='M22 60 l3 3 l5 -6' stroke='#f26522' stroke-width='2' fill='none'/><rect x='38' y='57' width='58' height='5' rx='2' fill='#1f2a44'/><rect x='104' y='57' width='26' height='5' rx='2' fill='#9aa0aa'/><rect x='20' y='72' width='11' height='11' rx='2' fill='none' stroke='#f26522' stroke-width='2'/><path d='M22 78 l3 3 l5 -6' stroke='#f26522' stroke-width='2' fill='none'/><rect x='38' y='75' width='58' height='5' rx='2' fill='#1f2a44'/><rect x='104' y='75' width='26' height='5' rx='2' fill='#9aa0aa'/></svg>",
    vinyl: "<svg viewBox='0 0 160 116'><circle cx='104' cy='60' r='52' fill='#111114'/><circle cx='104' cy='60' r='44' fill='none' stroke='#2c2c30' stroke-width='1.2'/><circle cx='104' cy='60' r='38' fill='none' stroke='#2c2c30' stroke-width='1.2'/><circle cx='104' cy='60' r='32' fill='none' stroke='#2c2c30' stroke-width='1.2'/><circle cx='104' cy='60' r='26' fill='none' stroke='#2c2c30' stroke-width='1.2'/><circle cx='104' cy='60' r='16' fill='#f2b632'/><circle cx='104' cy='60' r='3' fill='#111'/><rect x='4' y='8' width='104' height='104' rx='4' fill='#f26522'/><rect x='4' y='8' width='104' height='104' rx='4' fill='none' stroke='rgba(0,0,0,.25)' stroke-width='3'/><path d='M44 74 V38 l30 -6 v34' fill='none' stroke='#0a0a0b' stroke-width='6' stroke-linejoin='round'/><circle cx='38' cy='76' r='8' fill='#0a0a0b'/><circle cx='68' cy='68' r='8' fill='#0a0a0b'/><text x='56' y='102' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='15' fill='#0a0a0b' letter-spacing='1'>VAADYLE</text></svg>",
    ashta: "<svg viewBox='0 0 170 114'><polygon points='26,26 144,26 166,98 4,98' fill='#e9d7b5' stroke='#8a5330' stroke-width='4' stroke-linejoin='round'/><path d='M49.6 26.0L36.4 98.0M21.6 40.4L148.4 40.4M73.2 26.0L68.8 98.0M17.2 54.8L152.8 54.8M96.8 26.0L101.2 98.0M12.8 69.2L157.2 69.2M120.4 26.0L133.6 98.0M8.4 83.6L161.6 83.6' stroke='#8a5330' stroke-width='1.6'/><path d='M76.7 58.4L93.5 65.6M93.3 58.4L76.5 65.6M77.8 29.6L92.5 36.8M92.2 29.6L77.5 36.8M75.7 87.2L94.6 94.4M94.3 87.2L75.4 94.4M21.6 58.4L36.7 65.6M38.1 58.4L19.6 65.6M131.9 58.4L150.4 65.6M148.4 58.4L133.3 65.6' stroke='#d8341b' stroke-width='1.8' stroke-linecap='round'/><circle cx='29.0' cy='59.0' r='4.5' fill='#f26522' stroke='#0a0a0b' stroke-width='1'/><circle cx='85.0' cy='30.2' r='4.5' fill='#2b5cf0' stroke='#0a0a0b' stroke-width='1'/><circle cx='141.0' cy='59.0' r='4.5' fill='#f26522' stroke='#0a0a0b' stroke-width='1'/><circle cx='85.0' cy='87.8' r='4.5' fill='#2b5cf0' stroke='#0a0a0b' stroke-width='1'/><g transform='translate(40 104) rotate(-10)'><ellipse rx='6' ry='4' fill='#fbf6ec' stroke='#b9a88a' stroke-width='1'/><path d='M-4 0 H4' stroke='#8a7656' stroke-width='1.4'/></g><g transform='translate(56 106) rotate(15)'><ellipse rx='6' ry='4' fill='#fbf6ec' stroke='#b9a88a' stroke-width='1'/><path d='M-4 0 H4' stroke='#8a7656' stroke-width='1.4'/></g><g transform='translate(124 105) rotate(-20)'><ellipse rx='6' ry='4' fill='#fbf6ec' stroke='#b9a88a' stroke-width='1'/><path d='M-4 0 H4' stroke='#8a7656' stroke-width='1.4'/></g><g transform='translate(140 103) rotate(8)'><ellipse rx='6' ry='4' fill='#fbf6ec' stroke='#b9a88a' stroke-width='1'/><path d='M-4 0 H4' stroke='#8a7656' stroke-width='1.4'/></g></svg>",
    binders: "<svg viewBox='0 0 264 150'><rect x='8' y='14' width='38' height='128' rx='4' fill='#f26522' stroke='rgba(0,0,0,.35)' stroke-width='2'/><rect x='15' y='30' width='24' height='40' rx='3' fill='#F5F2EE'/><text x='27' y='60' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='22' fill='#0a0a0b'>A</text><circle cx='27' cy='120' r='6' fill='none' stroke='rgba(0,0,0,.4)' stroke-width='3'/><rect x='50' y='20' width='38' height='122' rx='4' fill='#1f2a44' stroke='rgba(0,0,0,.35)' stroke-width='2'/><rect x='57' y='36' width='24' height='40' rx='3' fill='#F5F2EE'/><text x='69' y='66' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='22' fill='#0a0a0b'>M</text><circle cx='69' cy='120' r='6' fill='none' stroke='rgba(0,0,0,.4)' stroke-width='3'/><rect x='92' y='12' width='38' height='130' rx='4' fill='#f2b632' stroke='rgba(0,0,0,.35)' stroke-width='2'/><rect x='99' y='28' width='24' height='40' rx='3' fill='#F5F2EE'/><text x='111' y='58' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='22' fill='#0a0a0b'>T</text><circle cx='111' cy='120' r='6' fill='none' stroke='rgba(0,0,0,.4)' stroke-width='3'/><rect x='134' y='18' width='38' height='124' rx='4' fill='#e9e1d3' stroke='rgba(0,0,0,.35)' stroke-width='2'/><rect x='141' y='34' width='24' height='40' rx='3' fill='#F5F2EE'/><text x='153' y='64' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='22' fill='#0a0a0b'>S</text><circle cx='153' cy='120' r='6' fill='none' stroke='rgba(0,0,0,.4)' stroke-width='3'/><rect x='176' y='14' width='38' height='128' rx='4' fill='#d8341b' stroke='rgba(0,0,0,.35)' stroke-width='2'/><rect x='183' y='30' width='24' height='40' rx='3' fill='#F5F2EE'/><text x='195' y='60' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='22' fill='#0a0a0b'>I</text><circle cx='195' cy='120' r='6' fill='none' stroke='rgba(0,0,0,.4)' stroke-width='3'/><rect x='218' y='22' width='38' height='120' rx='4' fill='#2b5cf0' stroke='rgba(0,0,0,.35)' stroke-width='2'/><rect x='225' y='38' width='24' height='40' rx='3' fill='#F5F2EE'/><text x='237' y='68' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='22' fill='#0a0a0b'>C</text><circle cx='237' cy='120' r='6' fill='none' stroke='rgba(0,0,0,.4)' stroke-width='3'/><g transform='translate(238 22) rotate(12)'><circle r='18' fill='#f2b632' stroke='#0a0a0b' stroke-width='2'/><text y='8' text-anchor='middle' font-family='Anton,Impact,sans-serif' font-size='22' fill='#0a0a0b'>A</text></g></svg>",
    paddle: '<svg viewBox="0 0 80 160"><rect x="34" y="70" width="12" height="86" rx="5" fill="#6b3a1d"/><circle cx="40" cy="42" r="36" fill="#F5F2EE" stroke="#08090B" stroke-width="3"/><text x="40" y="56" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="38" fill="#f26522">01</text></svg>'
  };
  var svgIn = function (k) { return SVG[k].replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''); };
  SVG.venture = '<svg viewBox="0 0 190 140"><g transform="translate(4 18)">' + svgIn('bag') + '</g><g transform="translate(104 2) scale(.46)">' + svgIn('vortilix') + '</g></svg>';
  SVG.apps = '<svg viewBox="0 0 120 180"><rect x="8" y="4" width="104" height="172" rx="18" fill="#16171c" stroke="#3a3d47" stroke-width="3"/><rect x="17" y="22" width="86" height="134" rx="6" fill="#0b1626"/><rect x="48" y="10" width="24" height="5" rx="2.5" fill="#2b2d35"/>'
    + '<rect x="26" y="34" width="30" height="30" rx="8" fill="#f26522"/><path d="M33 49l5 5 10-11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<rect x="64" y="34" width="30" height="30" rx="8" fill="#f2b632"/><path d="M75 57V41l12-3v15" stroke="#0a0a0b" stroke-width="3.5" fill="none"/><circle cx="72" cy="57" r="3.5" fill="#0a0a0b"/><circle cx="84" cy="54" r="3.5" fill="#0a0a0b"/>'
    + '<rect x="26" y="74" width="30" height="30" rx="8" fill="#e9d7b5"/><path d="M36 74v30M46 74v30M26 84h30M26 94h30" stroke="#8a5330" stroke-width="2"/><path d="M38 86l6 6M44 86l-6 6" stroke="#d8341b" stroke-width="2"/>'
    + '<rect x="64" y="74" width="30" height="30" rx="8" fill="none" stroke="#3a3d47" stroke-width="2" stroke-dasharray="4 3"/><path d="M79 82v14M72 89h14" stroke="#3a3d47" stroke-width="2.5"/>'
    + '<text x="60" y="138" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="15" fill="#f3e9df" letter-spacing="1">3 APPS</text></svg>';
  var ROOM = [
    { obj: 'hanging', left: 5, top: 2.2, w: 11, label: 'About me', cat: 'personal', kicker: 'About', title: 'Anudeep Gupta.',
      text: 'Hyderabad-raised Orange Army fan and founding-cohort student of Sports Management & Gaming at Masters’ Union. I speak English, Telugu and Hindi, with some Tamil.', nums: [['1 of 8', 'SMG Club core committee'], ['4', 'languages']], role: 'Open to a full-time role or internship, starting now.', link: 'media/resume.pdf', linkText: 'Open my resume', img: 'media/photos/portrait-arms.webp?v=1795635861' },
    { obj: 'flag', left: 21, top: 4.5, w: 9, label: 'One Orange Army', cat: 'strategy', title: 'One Orange Army, three seasons', page: 'one-orange-army' },
    { obj: 'tv', left: 38, top: 2.2, w: 24, label: 'IPL auction draft', cat: 'events', kicker: 'Events · SMG Club', title: 'An auction students asked to repeat.', text: 'An IPL auction for the Masters’ Union SMG Club. Ten student teams planned their budgets around live bidding and surprise wildcards, like a star player ruled out injured mid-auction. It ran on time and within its ₹5K budget. Masters’ Union’s Student Union President rated it the best event across the 13 student clubs, and students asked us to run another.', nums: [['Top', 'event of MU’s 13 clubs, per the Student Union President'], ['Repeat', 'event requested by students'], ['60', 'students, 10 teams']], role: 'My role: ran it end to end.', video: 'media/video/auction.mp4', poster: 'media/photos/auction-draft.webp' },
    { obj: 'board', left: 69, top: 6, w: 14, label: 'Astralis', cat: 'strategy', kicker: 'Esports strategy · Masters’ Union, Term 1', title: 'Rebuilding an esports empire.',
      text: 'A strategic analysis of Astralis: why a famous esports team was losing money, and a turnaround built on an asset-light model, D2C membership and an India creator plan.', nums: [['DKK 5.4M', 'annual EBITDA loss diagnosed'], ['Solo', 'project']], role: 'My role: financial diagnosis, turnaround model and India creator go-to-market.' },
    { obj: 'laptop', left: 2, bottom: 47.8, w: 13, label: 'Market research', cat: 'strategy', kicker: 'Work · The Business Research Company', title: 'The research desk.',
      text: 'Nearly 3 years as an associate consultant: 55+ market research reports across 10 industries and 5 regions. I proposed a green hydrogen database that TBRC turned into a new product, sold to 2 clients at $10K each. I proposed an automated drafting workflow that doubled weekly output from 2 to 4, and cut report delivery from 7 to 2–3 business days. I also ran first-level QC on every report and wrote proposal sample pages for 500–600 reports for the sales team.', nums: [['2', 'clients for my database, at $10K each'], ['7 → 2–3', 'business days to deliver a report'], ['2 → 4', 'reports a week, my workflow']], role: 'My role: researched, wrote and QC’d reports; proposed the database and the workflow.' },
    { obj: 'notebook', left: 16.5, bottom: 47.8, w: 9.5, label: 'goSTOPS', cat: 'strategy', title: 'Filling hostels in the off-season', page: 'gostops-off-season' },
    { obj: 'kettlebell', left: 28.5, bottom: 47.8, w: 5.5, label: 'HYROX Delhi', cat: 'events', kicker: 'Events · HYROX Delhi 2026', title: 'Where the crowd is.',
      text: 'At HYROX Delhi (10,500 athletes over three days), I volunteered and took charge of the Masters’ Union zone, 7 AM to 9 PM each day. We handed out 8,000+ finisher goodies bags, about 80% of all athletes. The personalised time tags were being typed up from AI-read photos of scorecards, and about 100 came out wrong. I fixed them on the spot from athletes’ own timestamp photos, then pushed to switch to HYROX’s official timing data. From day two, wrong tags dropped to zero. At peak, I moved volunteers between stations so queues of 80–100 athletes cleared in 10–15 minutes.', nums: [['8,000+', 'goodies bags, ~80% of athletes'], ['~100 → 0', 'wrong time tags'], ['~20', 'volunteers in the zone']], role: 'My role: volunteer who took charge of the Masters’ Union zone.', imgs: ['media/projects/hyrox-delhi/hall.webp', 'media/video/hyrox.mp4', 'media/projects/hyrox-delhi/course.webp', 'media/projects/hyrox-delhi/finish.webp', 'media/projects/hyrox-delhi/classof.webp', 'media/projects/hyrox-delhi/venue.webp', 'media/projects/hyrox-delhi/letters.webp'] },
    { obj: 'jersey', left: 37.5, bottom: 47.8, w: 11.5, label: 'NIVIA launch', cat: 'strategy', title: 'Launching the India jersey', page: 'nivia-india-jersey' },
    { obj: 'clipboard', left: 52, bottom: 47.8, w: 6, label: 'Pepperfry', cat: 'strategy', kicker: 'Consumer behaviour · Pepperfry', title: 'Scouting the shopper.',
      text: 'A Furniture Experience Index across 19 brands and 7 touchpoints, from 19 store visits and 30 customer interviews. Pepperfry ranked #6 of 19.', nums: [['19', 'stores visited'], ['30', 'interviews'], ['73.0', 'Pepperfry score vs 66.5 average']], role: 'My role: ran the mystery shopping and customer interviews, and built the index scoring (team project).', link: 'media/docs/pepperfry-odc.pdf' },
    { obj: 'trophy', left: 61, bottom: 47.8, w: 5, label: 'Esports', cat: 'personal', kicker: 'Player · Valorant and Counter-Strike', title: 'In-game leader.',
      text: 'I played Valorant and Counter-Strike competitively in 2021–22, as in-game leader with TITANS IBS.', nums: [['1st', 'Valorant tournament'], ['2nd', 'Counter-Strike tournament']], role: 'My role: player and in-game leader.' },
    { obj: 'headset', left: 69.5, bottom: 47.8, w: 9.5, label: 'TITANS IBS', cat: 'events', kicker: 'Community · TITANS IBS', title: 'Match nights, every week.',
      text: 'Coordinated the esports club’s tournaments, from brackets to match-night community. Moving promotion to college dashboards grew registrations about four times.', nums: [['10+', 'tournaments'], ['250+', 'participants'], ['9 → 40', 'registrations']], role: 'My role: event coordinator.' },
    { obj: 'racket', left: 84, bottom: 47.8, w: 7, label: 'Badminton', cat: 'personal', kicker: 'Player · Badminton', title: 'Telangana, on court.',
      text: 'I represented Telangana in national-level badminton as an under-19, after 3rd place in a District U16 tournament. I also hold a maroon belt in Kung Fu.', nums: [['U19', 'national level'], ['3rd', 'District U16']], role: 'What it gave me: I know how match day feels for a player, not only for a fan.', img: 'media/photos/badminton.webp' },
    { row: 2, obj: 'bag', left: 5, bottom: 13, w: 8.5, label: 'The Better Store', cat: 'business', store: true },
    { row: 2, obj: 'vortilix', left: 15, bottom: 13, w: 8, label: 'Vortilix', cat: 'business', kicker: 'Startup · building now', title: 'Vortilix.', text: 'A nutraceutical focus shot I’m co-founding through the Masters’ Union Venture Initiation Program. Samples are being tested before a production run, so no sales are claimed yet.', nums: [['3', 'co-founders'], ['VIP', 'Masters’ Union Venture Initiation Program']], role: 'My role: marketing, pricing and the go-to-market plan.' },
    { row: 2, obj: 'tablet', left: 29.5, bottom: 13, w: 10.5, label: 'Meet2Tracker', cat: 'ai', kicker: 'AI product · launched 15 Nov 2026', title: 'Meet2Tracker.', text: 'Paste a meeting transcript and get a task tracker with owners and deadlines. I ran the launch on ₹0: a plan, two videos and five channels. Day one: about 680 views, no signups yet.', nums: [['₹0', 'launch budget'], ['~680', 'views on day one']], role: 'Built with Darshan Kulkarni; I ran the launch.', link: 'https://meet2tracker.app', linkText: 'Visit meet2tracker.app' },
    { row: 2, obj: 'vinyl', left: 42, bottom: 13, w: 10.5, label: 'Vaadyle', cat: 'ai', kicker: 'Built with AI tools · daily music puzzle', title: 'Vaadyle.', text: 'An Indian-music daily puzzle. Everyone gets the same song, revealed one instrument at a time, with streaks and a share card, like Wordle.', nums: [['Daily', 'one song for everyone'], ['Stems', 'every song split by instrument']], role: 'I built the game and the landing page, and split every song into stems.', link: 'https://vaadyle.lovable.app', linkText: 'Play Vaadyle' },
    { row: 2, obj: 'ashta', left: 54.5, bottom: 13, w: 10.5, label: 'Ashta Chamma', cat: 'ai', kicker: 'Built with AI tools · browser game', title: 'Ashta Chamma.', text: 'The ancient Indian board game, a lot like Ludo, rebuilt so anyone can play it in the browser.', nums: [['Online', 'the board game, playable in the browser']], role: 'I built the game end to end.', link: 'https://ashta-chamma.lovable.app', linkText: 'Play Ashta Chamma' },
    { row: 2, obj: 'binders', left: 71, bottom: 13, w: 23, label: 'Decoding Business Models', cat: 'strategy', kicker: 'Strategy · Masters’ Union coursework', title: 'Six businesses. All graded A.', text: 'Decoding Business Models: six businesses my teams designed and pitched, one per business model. Tap a deck to open it.', decks: true },
    { obj: 'venture', label: 'Entrepreneurship', cat: 'business', kicker: 'Entrepreneurship · built from scratch', title: 'Two businesses, from zero.', text: 'A dropshipping store that sold ₹2L+, and a focus-shot startup now in testing. Tap one to open it.', group: ['The Better Store', 'Vortilix'] },
    { obj: 'apps', label: 'Apps I built', cat: 'ai', kicker: 'Apps I built · with AI tools', title: 'Three apps, all live.', text: 'A meeting-to-task-tracker tool, a daily Indian-music puzzle and an online version of an ancient board game. Tap one to open it.', group: ['Meet2Tracker', 'Vaadyle', 'Ashta Chamma'] },
  ];
  var rlist = $('#room-list'), tvVid = null;
  var WALLS = {
    L: [['Strategy & research', ['Market research', 'Astralis', 'goSTOPS', 'NIVIA launch']]],
    B: [['The player', ['About me', 'Badminton', 'Esports']], ['', ['IPL auction draft']], ['Fans & events', ['One Orange Army', 'HYROX Delhi', 'TITANS IBS']]],
    R: [['Coursework', ['Pepperfry', 'Decoding Business Models']], ['Built from scratch', ['Entrepreneurship', 'Apps I built']]]
  };
  var SHORT = { 'Decoding Business Models': 'Business models', 'The Better Store': 'Better Store', 'IPL auction draft': 'IPL auction', 'Market research': 'Market research' };
  var byLabel = {}; ROOM.forEach(function (c) { byLabel[c.label] = c; });
  var openOf = function (c) { return function () { if (c.store) openCase(STORE); else if (c.page) openPage(c.page); else openCase(c); }; };
  Object.keys(WALLS).forEach(function (w) {
    var wall = $('#lr-' + w);
    WALLS[w].forEach(function (g) {
      var grp = document.createElement('div'); grp.className = 'lr-grp' + (g[0] ? '' : ' lr-grp-tv'); grp.style.flexGrow = g[1].length * (g[0] ? 1 : 3);
      grp.innerHTML = '<p class="lr-tag mono">' + esc(g[0]) + '</p><div class="lr-lks"></div>';
      var row = grp.querySelector('.lr-lks');
      g[1].forEach(function (lab) {
        var c = byLabel[lab]; if (!c) return;
        var b = document.createElement('button'); b.type = 'button';
        b.className = 'lk' + (c.obj === 'tv' ? ' lk-tv' : '');
        b.setAttribute('aria-label', c.label + (c.page ? ': open the full case' : ': open'));
        var pl = SHORT[lab] || lab, plate = '<span class="lk-plate' + (/^\S{12,}$/.test(pl) ? ' long' : '') + '"><b>' + esc(pl) + '</b></span>';
        if (c.obj === 'tv') {
          b.innerHTML = plate + '<span class="lk-cub"><span class="tv-box"><video muted loop playsinline preload="none" poster="' + c.poster + '" data-src="' + c.video + '" aria-hidden="true"></video><span class="tv-live mono"><i class="live" aria-hidden="true"></i>Live · Auction night</span><span class="tv-cap"><b>I ran an IPL auction for 60 students.</b><span>Tap to watch →</span></span></span></span>';
          tvVid = b.querySelector('video');
        } else b.innerHTML = plate + '<span class="lk-cub"><i class="lk-rod" aria-hidden="true"></i>' + SVG[c.obj] + '</span><span class="lk-seat" aria-hidden="true"></span>';
        b.dataset.cat = c.cat || '';
        b.addEventListener('click', openOf(c));
        row.appendChild(b);
      });
      wall.appendChild(grp);
    });
  });
  ROOM.forEach(function (c) {
    if (c.group) return;
    var lb = document.createElement('button'); lb.type = 'button';
    lb.innerHTML = '<span class="mono">' + esc(c.label) + '</span><b>' + esc(c.store ? STORE.title : c.title) + '</b>';
    lb.dataset.cat = c.cat || '';
    lb.addEventListener('click', openOf(c));
    rlist.appendChild(lb);
  });
  // phones: start the swipeable room centred on the TV
  var sceneEl = $('#lr-stage'), tvBtn = $('.lk-tv');
  var centreTV = function () { if (sceneEl.scrollWidth > sceneEl.clientWidth + 4 && tvBtn) sceneEl.scrollLeft = tvBtn.getBoundingClientRect().left - sceneEl.getBoundingClientRect().left + sceneEl.scrollLeft + tvBtn.offsetWidth / 2 - sceneEl.clientWidth / 2; };
  centreTV(); addEventListener('load', centreTV);
  if (tvVid && 'IntersectionObserver' in window && !RM) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (!tvVid.src) tvVid.src = tvVid.dataset.src; var p = tvVid.play(); if (p && p.catch) p.catch(function () {}); } else tvVid.pause(); }); }, { threshold: .3 }).observe(tvVid);
  // shelf labels: filter the room by kind of work
  $$('#room-cats button').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.dataset.cat;
      $$('#room-cats button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === chip)); });
      $$('#scene .lk, #room-list button').forEach(function (o) { o.classList.toggle('dim', cat !== 'all' && o.dataset.cat !== cat); });
    });
  });
  var lbtn = $('#room-list-btn');
  lbtn.addEventListener('click', function () { var on = rlist.classList.toggle('on'); lbtn.setAttribute('aria-expanded', String(on)); lbtn.querySelector('span').textContent = on ? 'Hide the list' : 'Show as a list'; if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  var scene = $('#scene');
  scene.addEventListener('pointermove', function (e) { var r = scene.getBoundingClientRect(); scene.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); scene.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%'); });
  $$('.lk', scene).forEach(function (o, i) { o.style.transitionDelay = (i * 0.035) + 's'; });
  io([scene], function (el) { el.classList.add('in'); setTimeout(function () { $$('.lk', el).forEach(function (o) { o.style.transitionDelay = ''; }); }, 1600); }, { threshold: .2 });

  /* ============================ 7. GALLERY + LOGOS ============================ */
  var GAL = [
    ['media/photos/uppal-srh-kid.webp', 'At Uppal for a Sunrisers game, about 11 years ago', ''],
    ['media/photos/sport-india-2026.webp', 'Sport India Conference 2026, Vision 2036 panel, Bharat Mandapam', 'wide', '50% 40%'],
    ['media/photos/neel-shah.webp', 'With Neel Shah, CEO of Dream Sports Foundation, after his session at Masters’ Union', '', '50% 15%'],
    ['media/photos/viren-rasquinha.webp', 'With Viren Rasquinha, former India hockey captain, at Masters’ Union', ''],
    ['media/photos/hudle-ceo.webp', 'With Suhail Narain, Founder and CEO of Hudle', ''],
    ['media/photos/pbks-coo.webp', 'With Saurabh Arora, COO of Punjab Kings', ''],
    ['media/photos/iamgame-guest.webp', 'With K. Srinivas Rao, Head of Sports Group at Times of India, at I Am Game 2026', '', '50% 12%'],
    ['media/photos/iamgame-awards.webp', 'Masters’ Union cohort at the EY I Am Game Sports Awards 2026', ''],
    ['media/photos/conclave-guest.webp', 'With Manish, VP Commercials & Partnerships at JioBLAST, at I Am Game 2026', '', '50% 15%'],
    ['media/photos/hyrox.webp', 'HYROX Delhi 2026, with the Masters’ Union team', ''],
    ['media/projects/better-store/stall-pratham.webp', 'With Pratham Mittal, founder of Masters’ Union, at The Better Store stall', ''],
    ['media/photos/pro-panja.webp', 'With Parvinn Dabass, owner of the Pro Panja League', ''],
    ['media/photos/smg-auction-team.webp', 'The SMG Club team after the IPL auction draft, with our guest auctioneer', ''],
    ['media/photos/nivia-jersey.webp', 'With the India football jersey, NIVIA live challenge', ''],
    ['media/photos/smg-night.webp', 'Mentorship dinner with Karndeep Sharma, AVP Marketing at NODWIN Gaming', 'wide'],
    ['media/photos/auction-draft.webp', 'The IPL auction draft, SMG Club', 'wide']
  ];
  $('#gal-grid').innerHTML = GAL.map(function (g) { return '<figure class="' + g[2] + '" data-reveal><img src="' + g[0] + '" alt="' + esc(g[1]) + '" loading="lazy" style="object-position:' + (g[3] || '50% 20%') + '"><figcaption>' + esc(g[1]) + '</figcaption></figure>'; }).join('');
  io($$('#gal-grid figure'), function (el) { el.classList.add('in'); }, { threshold: .15 });
  var LOGOS = [['media/logos/orgs/masters-union.svg', 'Masters’ Union · SMG Club'], ['media/logos/orgs/hyrox.svg', 'HYROX Delhi 2026'], ['media/logos/orgs/tbrc.svg', 'The Business Research Company'], ['media/logos/orgs/titans.svg', 'TITANS IBS esports'], ['media/logos/orgs/icfai.svg', 'ICFAI Business School'], ['', 'NIVIA · live challenge', 'NIVIA'], ['', 'goSTOPS · live challenge', 'goSTOPS'], ['media/logos/orgs/examate.svg', 'Examate']];
  $('#logos').innerHTML = LOGOS.map(function (l) { return '<div class="logo" data-reveal>' + (l[0] ? '<img src="' + l[0] + '" alt="" loading="lazy">' : '<b style="font:400 30px/1 var(--disp);text-transform:uppercase;color:var(--tx)">' + esc(l[2]) + '</b>') + '<span>' + esc(l[1]) + '</span></div>'; }).join('');
  io($$('#logos .logo'), function (el) { el.classList.add('in'); }, { threshold: .1 });

  /* ============================ 8. FANZONE: auction finale ============================ */
  var bids = $$('#bids li'), sold = $('#sold'), soldRow = $('.sold-row');
  var soldT = [];
  function playSold() {
    soldT.forEach(clearTimeout); soldT = [];
    bids.forEach(function (b, i) { soldT.push(setTimeout(function () { b.classList.add('on'); }, RM ? 0 : 200 + i * 450)); });
    soldT.push(setTimeout(function () {
      sold.classList.add('on'); soldRow.classList.add('on');
      soldT.push(setTimeout(function () { var r = sold.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 90, 1.3); }, 260));
    }, RM ? 0 : 200 + bids.length * 450 + 150));
  }
  function resetSold() { soldT.forEach(clearTimeout); soldT = []; bids.forEach(function (b) { b.classList.remove('on'); }); sold.classList.remove('on'); soldRow.classList.remove('on'); }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) playSold(); else resetSold(); }); }, { threshold: .35 }).observe($('#bids'));
  else playSold();

  /* ============================ 9. HEY RISER ============================ */
  var bot = $('#bot'), botBtn = $('#bot-btn'), msgs = $('#bot-msgs'), choices = $('#bot-choices'), teaser = $('#bot-teaser');
  var say = function (text, who, href, linkText) {
    var m = document.createElement('div'); m.className = 'm ' + (who || 'b'); m.textContent = text;
    if (href) { var a = document.createElement('a'); a.href = href; a.textContent = linkText; if (/^http/.test(href) || /\.pdf$/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } m.appendChild(a); }
    msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight; return m;
  };
  var R = [
    { label: 'Book a call', run: function () { say('Pick any free slot in my calendar. It’s a 15-minute Google Meet, and you’ll get the invite straight away.', 'b', BOOK, 'Book a 15-min call'); } },
    { label: 'See my resume', run: function () { say('Here’s my one-page resume.', 'b', 'media/resume.pdf', 'Open the PDF'); } },
    { label: 'My socials', run: function () { say('LinkedIn is the best place to reach me.', 'b', LINKEDIN, 'linkedin.com/in/itsanudeepgupta'); setTimeout(function () { var m = say('I’m also on Instagram and X.', 'b', INSTAGRAM, 'instagram.com/itsanudeepgupta'); var a = document.createElement('a'); a.href = X; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'x.com/_anudeep_gupta_'; m.appendChild(a); }, 300); } },
    { label: 'See my idea for SRH', run: function () { say('One Orange Army, three seasons: bringing Eastern Cape and Leeds home to Hyderabad.', 'b', '#fixtures', 'Jump to the idea'); } }
  ];
  R.forEach(function (r) { var b = document.createElement('button'); b.type = 'button'; b.textContent = r.label; b.addEventListener('click', function () { say(r.label, 'u'); setTimeout(r.run, 350); }); choices.appendChild(b); });
  // typed questions: answered from a fixed set of facts (runs in the browser, no AI service, so it never makes things up)
  var KB = [
    { k: ['10th', 'tenth', 'class x', 'class 10', 'ssc', 'school', 'st martin', 'cbse'], a: 'Class X at St. Martin’s High School, Hyderabad (CBSE, 2017): a perfect 10/10 CGPA, one of 9 students to get it. I was also playing national-level badminton and earned a maroon belt in Kung Fu.' },
    { k: ['12th', 'twelfth', 'class xii', 'class 12', 'intermediate', 'inter ', 'junior college', 'avinash', 'tsbie'], a: 'Class XII at Avinash College of Commerce, Hyderabad (TSBIE, 2017–19): 90.5%. I won a 95% merit scholarship (₹50K) for Class XI and was runner-up in the college cricket tournament.' },
    { k: ['bba', 'degree', 'graduation', 'graduate', 'undergrad', 'bachelor', 'icfai', 'ibs', 'college'], a: 'BBA at ICFAI Business School, Hyderabad (2019–22): CGPA 9.75/10, in the top 5% of 650+ students, with a ₹3.3L merit scholarship.' },
    { k: ['masters union', 'masters', 'mu ', 'pgp', 'mba', 'currently studying', 'studying now', 'sports management', 'gre', 'scholarship'], a: 'I’m in the founding cohort of the PGP in Sports Management & Gaming at Masters’ Union, Gurugram, on the Pankaj Bansal Scholarship for Young Leaders (₹5.5L). GRE 328. I was 1 of 8 picked for the SMG Club core committee from about 500 students.' },
    { w: 0.8, k: ['study', 'studied', 'education', 'qualification', 'academic'], a: 'Quick version: Class X at St. Martin’s (10/10 CGPA), Class XII at Avinash College (90.5%), a BBA at ICFAI Business School (9.75/10), and now the Sports Management & Gaming PGP at Masters’ Union. Ask about any of them for more.' },
    { k: ['how many years', 'years of experience', 'experience', 'how long', 'worked for', 'work ex', 'job', 'career', 'worked'], a: 'Nearly 3 years: I was an Associate Consultant at The Business Research Company (TBRC), Hyderabad, from July 2022 to April 2025. Before that I interned at Examate and Unschool.' },
    { w: 1.3, k: ['tbrc', 'business research', 'research company', 'consultant', 'research', 'report'], a: 'At TBRC I proposed a green hydrogen database that became a new product, bought by 2 clients at $10K each. I also proposed an automated drafting workflow that doubled weekly output from 2 to 4 reports, and cut delivery from 7 to 2–3 business days across 55+ reports in 10 industries.' },
    { k: ['intern', 'examate', 'unschool'], a: 'Examate (2021): I converted 10 of 70+ qualified leads into course enrolments and helped grow the intern team 20%. Unschool: ₹45K+ in sales from 40+ course conversions, which earned a Certificate of Excellence.' },
    { k: ['hyrox'], a: 'At HYROX Delhi (10,500 athletes over 3 days) I took charge of the Masters’ Union zone. Wrong finisher time tags dropped from about 100 to zero after I pushed to use HYROX’s official timing data, and peak queues of 80–100 athletes cleared in 10–15 minutes.' },
    { k: ['nivia', 'jersey', 'football'], a: 'NIVIA live challenge: my team came Top 3 of 15 with a ₹50L launch plan for India’s football jersey, modelling 30K sales in 90 days.' },
    { k: ['gostops', 'hostel', 'occupancy'], a: 'goSTOPS one-day challenge: Top 5 of 93 teams, with a plan to lift July–September occupancy from 27.5% to 43.8%.' },
    { k: ['astralis', 'esports strategy'], a: 'The Astralis Paradox: a solo strategy project on why a famous esports team was losing DKK 5.4M a year, with a turnaround built on an asset-light model, D2C membership and an India creator plan.' },
    { k: ['esports', 'gaming', 'valorant', 'counter strike', 'cs ', 'titans', 'games'], a: 'I was in-game leader for TITANS IBS: 1st in a Valorant tournament and 2nd in Counter-Strike. I also ran 10+ esports tournaments for 250+ players, and grew registrations about 4x (9 to 40) by moving promotion to college dashboards.' },
    { k: ['badminton', 'sport', 'sports', 'play', 'kung fu', 'athlete', 'cricket'], a: 'I represented Telangana in national-level badminton (U19) after placing 3rd in a District U16 tournament. I also hold a maroon belt in Kung Fu, and played competitive Valorant and Counter-Strike.' },
    { k: ['auction', 'ipl auction', 'smg club', 'club'], a: 'I ran an IPL auction for 60 students across 10 teams for the Masters’ Union SMG Club, with wildcards like a star player ruled out injured. It ran on time within ₹5K, Masters’ Union’s Student Union President rated it the best event across the 13 student clubs, and students asked for a repeat. I’m on the club’s core committee and lead its 50+ member gaming community.' },
    { k: ['business', 'entrepreneur', 'startup', 'founder', 'dropshipping', 'better store', 'vortilix', 'revenue'], a: 'Two businesses from zero: The Better Store, a dropshipping store that made ₹2L+ in revenue (moving to Meesho was my idea), and Vortilix, a focus-shot startup I co-founded where I lead marketing, pricing and go-to-market.' },
    { k: ['app', 'built', 'build', 'vaadyle', 'meet2tracker', 'ashta chamma', 'product', 'code', 'lovable'], a: 'I’ve built Vaadyle (a daily Indian-music puzzle), Meet2Tracker (meeting notes to action items) and Ashta Chamma (an ancient Indian board game, like Ludo). They’re live, but not yet marketed.' },
    { k: ['business model', 'decoding', 'athletiq', 'messmafia', 'twyde', 'skoolms', 'insurequest', 'chandni chowk', 'deck'], a: 'Decoding Business Models: six businesses my teams designed and pitched from scratch at Masters’ Union, one per model, all graded A: AthletIQ (sports-tech for schools), MessMafia (D2C), TWYDE (marketplace), skooLMS (SaaS), Insurequest (fintech) and Chandni Chowk & Co. (F&B). All six decks are on the site.', href: '#room', link: 'See the decks' },
    { k: ['oohlala', 'ga4', 'analytics', 'growth plan', 'funnel'], a: 'Oohlala growth plan (Marketing Analytics Lab): Top 5 of 30 teams. We used seven months of the brand’s real GA4 data to show where shoppers dropped off, and ranked three fixes with targets and test plans. I pulled and analysed the data and wrote the recommendation.', href: '#cards', link: 'See the project' },
    { k: ['skill', 'tools', 'excel', 'power bi', 'python', 'canva', 'good at'], a: 'Skills: GTM strategy, campaign planning, market research, consumer segmentation, content and performance marketing, event operations and community building. Tools: Excel, Power BI, Python, Canva and PowerPoint.' },
    { k: ['certificat', 'course', 'bloomberg', 'ibm', 'coursera'], a: 'Certifications: Bloomberg Finance Fundamentals (Nov 2026), Digital Marketing Pro from My Captain (2023) and the IBM Data Science Specialization on Coursera (2022).' },
    { k: ['language', 'telugu', 'hindi', 'tamil', 'speak'], a: 'English, Telugu and Hindi, plus some Tamil.' },
    { k: ['why srh', 'why sunrisers', 'sunrisers', 'srh', 'orange army', 'fan'], a: 'I grew up in Hyderabad in the Orange Army; I was at Uppal in a Sunrisers headband about 11 years ago. I want to help the Sunrisers keep fans engaged all year, across Hyderabad, Eastern Cape and Leeds.', href: '#fixtures', link: 'See my idea for SRH' },
    { k: ['survey', 'fans said', 'data', 'research', 'findings', 'results'], a: 'I surveyed 339 IPL fans in Nov 2026, 246 of them SRH fans, via SRH fan accounts on X and Reddit. 98% already knew about Eastern Cape and Leeds, but 37% have never been to the home stadium, 75% own no official merch, and 61% of those living in Hyderabad rated a local watch-along 4 or 5 out of 5.', href: '#fixtures', link: 'See the results' },
    { k: ['idea', 'thesis', 'plan', 'one orange army', 'proposal'], a: 'One Orange Army: bring Sunrisers Eastern Cape and Leeds home to Hyderabad with watch-along nights and a fan passport, so fans stay with the group between IPL seasons.', href: '#fixtures', link: 'Read the idea' },
    { w: 1.3, k: ['classes', 'student', 'still studying', 'manage', 'attendance', 'online', 'commit full', 'work full', 'how will you', 'how can you', 'balance', 'course end', 'graduate when'], a: 'Masters’ Union lets placed students take classes online, so I can work full-time from day one. Happy to walk you through how I’d balance both on a call.', href: BOOK, link: 'Book a 15-min call' },
    { k: ['available', 'join', 'notice', 'start', 'role', 'hire', 'internship', 'full time', 'full-time', 'looking for', 'opportunit', 'apply', 'vacanc', 'open to', 'open for'], a: 'I’m open to a full-time role or an internship, starting now.' },
    { w: 0.7, k: ['where', 'location', 'based', 'live', 'from', 'hometown', 'city'], a: 'I’m from Hyderabad, and I’m currently in Gurugram for Masters’ Union.' },
    { k: ['contact', 'reach', 'email', 'call', 'linkedin', 'connect', 'talk', 'phone', 'number'], a: 'Book a 15-minute call straight into my calendar, or message me on LinkedIn: linkedin.com/in/itsanudeepgupta.', href: BOOK, link: 'Book a 15-min call' },
    { k: ['resume', 'cv'], a: 'Here’s my one-page resume.', href: 'media/resume.pdf', link: 'Open my resume' },
    { k: ['salary', 'ctc', 'pay', 'compensation', 'expect'], a: 'Happy to talk about that on a call. Right now, getting started with the right team matters more to me.' },
    { k: ['hobby', 'hobbies', 'free time', 'fun'], a: 'Badminton, competitive gaming (Valorant), building small apps, and IPL nights in the stands.' },
    { w: 0.3, k: ['who are you', 'about you', 'about anudeep', 'tell me about', 'introduce', 'yourself', 'who is'], a: 'I’m Anudeep Gupta, from Hyderabad: nearly 3 years in market research at TBRC, now in Masters’ Union’s Sports Management & Gaming programme, and a lifelong Orange Army fan. I want to work with the Sunrisers.' },
    { w: 0.4, k: ['hi ', 'hello', 'hey ', 'namaste'], a: 'Hey Riser! Ask me anything about my studies, work, projects or sports.' },
    { w: 0.4, k: ['thank', 'great ', 'cool ', 'nice '], a: 'Thank you! If you’d like to talk, pick a slot in my calendar.', href: BOOK, link: 'Book a 15-min call' }
  ];
  var answer = function (q) {
    var t = ' ' + q.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+\- ]/g, ' ').replace(/\s+/g, ' ') + ' ';
    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var sc = 0;
      e.k.forEach(function (k) { var kk = k.trim(); var re = new RegExp('(^|[^a-z0-9])' + kk.replace(/[+]/g, '\\+') + (k.slice(-1) === ' ' ? '([^a-z0-9]|$)' : '')); if (re.test(t)) sc += kk.split(' ').length * (kk.length > 3 ? 2 : 1); });
      sc *= (e.w || 1);
      if (sc > bestScore) { bestScore = sc; best = e; }
    });
    if (best) say(best.a, 'b', best.href, best.link);
    else say('I don’t have that one in my notes yet. Try asking about my studies, work, projects or sports, or message me on LinkedIn.', 'b', LINKEDIN, 'Message me on LinkedIn');
  };
  $('#bot-ask').addEventListener('submit', function (e) {
    e.preventDefault(); var inp = $('#bot-q'), q = inp.value.trim(); if (!q) return;
    say(q, 'u'); inp.value = ''; setTimeout(function () { answer(q); }, 350);
  });
  var greeted = false;
  var toggle = function (open) {
    var o = open == null ? !bot.classList.contains('open') : open;
    bot.classList.toggle('open', o); botBtn.setAttribute('aria-expanded', String(o)); teaser.classList.add('hide'); teaser.classList.remove('peek'); if (o) bot.classList.add('seen');
    if (o && !greeted) { greeted = true; say('Hey Riser, nice to meet you! Like you, I’m a Riser too.'); setTimeout(function () { say('Ask me anything, like where I studied or how long I worked, or tap an option below.'); }, 500); }
  };
  botBtn.addEventListener('click', function () { toggle(); });
  $('#bot-x').addEventListener('click', function () { toggle(false); });
  teaser.addEventListener('click', function () { toggle(true); });
  msgs.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a && a.getAttribute('href') === '#fixtures') toggle(false); });
  var firstHide = function () { if (scrollY > 600) { teaser.classList.add('hide'); removeEventListener('scroll', firstHide); } };
  addEventListener('scroll', firstHide, { passive: true });
  // bring the chat back into view at key moments, so visitors notice it (once per section, never after they've opened it)
  var peekT = null;
  var peek = function (text) {
    if (bot.classList.contains('open') || bot.classList.contains('seen')) return;
    teaser.textContent = text; teaser.classList.remove('hide'); teaser.classList.add('peek');
    clearTimeout(peekT); peekT = setTimeout(function () { teaser.classList.add('hide'); teaser.classList.remove('peek'); }, 7000);
  };
  if ('IntersectionObserver' in window) {
    [['proposal', 'Short on time? Ask me anything →'], ['room', 'Want the 60-second version? Chat with me →'], ['fanzone', 'Ready to talk? Book a call here →']].forEach(function (p) {
      var el = document.getElementById(p[0]); if (!el) return;
      var ob = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { peek(p[1]); ob.disconnect(); } }); }, { threshold: 0.35 });
      ob.observe(el);
    });
  }


  if (window.ScrollTrigger) {
    addEventListener('load', function () { ScrollTrigger.refresh(); });
    var rt; $$('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', function () { clearTimeout(rt); rt = setTimeout(function () { ScrollTrigger.refresh(); }, 200); }); });
  }
})();
