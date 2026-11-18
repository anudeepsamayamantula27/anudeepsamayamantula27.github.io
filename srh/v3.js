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
  var INSTAGRAM = 'https://www.instagram.com/itsanudeepgupta/';
  var X = 'https://x.com/_anudeep_gupta_';
  var numsHTML = function (nums) { return nums.map(function (n) { return '<div><b>' + esc(n[0]) + '</b><span>' + esc(n[1]) + '</span></div>'; }).join(''); };
  var io = function (els, fn, opts) {
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { fn(el); }); return; }
    var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fn(e.target); o.unobserve(e.target); } }); }, opts || { threshold: 0.2 });
    els.forEach(function (el) { o.observe(el); });
  };

  /* ============================ smooth scroll ============================ */
  var lenis = null;
  if (!RM && window.Lenis && window.gsap) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var t = document.querySelector(id); if (!t) return;
    e.preventDefault(); closeMenu();
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
    ['squad', 'fixtures', 'vault', 'room', 'gallery', 'fanzone'].forEach(function (id) { var s = document.getElementById(id); if (s) navIO.observe(s); });
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
  var hero = $('.hero'), me = $('.hero-me'), word = $('.hero-word');
  function go() { document.body.classList.add('ready'); }
  if (RM) go();
  else {
    var started = false, start = function () { if (started) return; started = true; setTimeout(go, 150); };
    if (me.complete) start(); else { me.addEventListener('load', start); me.addEventListener('error', start); }
    setTimeout(start, 1500);
  }
  var tk = $('#tk-track');
  var TICK = [['1,000+ fans', 'HYROX Delhi, on the ground'], ['U19 national', 'badminton, for Telangana'], ['Top 5 of 93', 'goSTOPS challenge'], ['₹2L+ revenue', 'The Better Store, dropshipping'], ['₹50L', 'jersey launch plan with NIVIA'], ['55+ reports', 'The Business Research Company'], ['60 players', 'IPL auction draft I ran'], ['10+ tournaments', 'TITANS IBS esports'], ['3 teams', 'one Orange Army']];
  var tkHTML = TICK.map(function (t) { return '<span>' + esc(t[0]) + ' <small>' + esc(t[1]) + '</small></span>'; }).join('');
  tk.innerHTML = tkHTML + tkHTML;
  tk.lastElementChild && $$('span', tk).slice(TICK.length).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });

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
      me.style.translate = (dx * -18) + 'px ' + (dy * -8) + 'px';
      word.style.translate = (dx * 30) + 'px ' + (dy * 14) + 'px';
    });
  }

  /* ============================ reveal ============================ */
  io($$('[data-reveal]'), function (el) { el.classList.add('in'); }, { threshold: 0.15 });

  /* ============================ case dialog ============================ */
  var dlg = $('#case');
  function openCase(c) {
    if (c.page) { location.href = 'case.html?p=' + encodeURIComponent(c.page); return; }
    $('#case-kicker').textContent = c.kicker || ''; $('#case-title').textContent = c.title || ''; $('#case-text').textContent = c.text || '';
    $('#case-nums').innerHTML = numsHTML(c.nums || []);
    $('#case-role').textContent = c.role || '';
    var m = $('#case-media'); m.innerHTML = '';
    if (c.video) m.innerHTML = '<video src="' + c.video + '" poster="' + c.poster + '" muted loop playsinline controls ' + (RM ? '' : 'autoplay') + ' aria-label="The IPL auction draft in progress"></video>';
    else if (c.imgs) m.innerHTML = '<div class="case-strip">' + c.imgs.map(function (i) { return '<img src="' + i + '" alt="" loading="lazy">'; }).join('') + '</div>';
    else if (c.img) m.innerHTML = '<img src="' + c.img + '" alt="" style="object-position:' + (c.pos || '50% 30%') + '">';
    m.hidden = !(c.video || c.img || c.imgs); m.classList.toggle('strip', !!c.imgs);
    var a = $('#case-link'); if (c.link) { a.href = c.link; a.textContent = c.linkText || 'Open the deck'; a.hidden = false; } else a.hidden = true;
    if (lenis) lenis.stop();
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
  }
  $('#case-x').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { var v = dlg.querySelector('video'); if (v) v.pause(); if (lenis) lenis.start(); });

  /* ============================ 1. WALK-OUT (kit change) ============================ */
  var KITS = [
    { img: 'media/kit/kit-1-player.jpg', tag: 'Kit 01 · The player', num: '01', title: 'A player first.',
      text: 'I represented Telangana in national-level badminton as an under-19, and I hold a maroon belt in Kung Fu. I know match day from the court, not only from the stands.',
      nums: [['U19', 'national level, for Telangana'], ['Maroon', 'belt in Kung Fu']] },
    { img: 'media/kit/kit-2-professional.jpg', tag: 'Kit 02 · The researcher', num: '02', title: 'The research desk.',
      text: 'Two and a half years at The Business Research Company, writing market research reports that clients paid for. It taught me to find the number that matters.',
      nums: [['55+', 'market research reports'], ['₹1.9 Cr+', 'in report sales']] },
    { img: 'media/kit/kit-3-organiser.jpg', tag: 'Kit 03 · The organiser', num: '03', title: 'On the ground, with the crowd.',
      text: 'On-ground execution at HYROX Delhi with the Masters’ Union team, and an IPL auction draft I ran for the SMG Club.',
      nums: [['1,000+', 'attendees at HYROX Delhi'], ['60', 'players in the auction draft']] },
    { img: 'media/kit/kit-4-gamer.jpg', tag: 'Kit 04 · The gamer', num: '04', title: 'Communities that play together.',
      text: 'In-game leader and event coordinator at TITANS IBS, the esports club at ICFAI Business School. A community is built one match night at a time.',
      nums: [['10+', 'tournaments for 250+ players'], ['1st', 'place, Valorant tournament']] },
    { img: 'media/kit/kit-5-riser.jpg', tag: 'Kit 05 · The Riser', num: '05', title: 'The one I want to wear.',
      text: 'Hyderabad-raised and Orange Army through and through. I want to help the Sunrisers keep their fans all year, across all three teams.',
      nums: [['3', 'teams'], ['1', 'Orange Army']] }
  ];
  var walk = $('#walkout'), frame = $('#walk-frame'), wcopy = $('#walk-copy'), wbar = $('#walk-bar'), wnum = $('#walk-num'), flash = $('.walk-flash', frame);
  KITS.forEach(function (k, i) {
    var s = document.createElement('div'); s.className = 'walk-shot'; s.style.zIndex = i + 1;
    s.innerHTML = '<img src="' + k.img + '" alt="Anudeep in ' + esc(k.tag.split(' · ')[1].replace('The ', 'the ')) + ' kit" loading="' + (i ? 'lazy' : 'eager') + '">';
    frame.insertBefore(s, wnum);
    var c = document.createElement('article'); c.className = 'walk-ch';
    c.innerHTML = '<p class="mono">' + esc(k.tag) + '</p><h3>' + esc(k.title) + '</h3><p class="t">' + esc(k.text) + '</p><div class="nums">' + numsHTML(k.nums) + '</div>';
    wcopy.appendChild(c); wbar.appendChild(document.createElement('i'));
  });
  var shots = $$('.walk-shot', frame), chs = $$('.walk-ch', wcopy), segs = $$('i', wbar), cur = -1;
  function setKit(idx) {
    if (idx === cur) return; var prev = cur; cur = idx;
    shots.forEach(function (s, i) { s.classList.toggle('on', i === idx); s.classList.toggle('past', i < idx); });
    chs.forEach(function (c, i) { c.classList.toggle('on', i === idx); });
    segs.forEach(function (s, i) { s.classList.toggle('on', i <= idx); });
    wnum.textContent = KITS[idx].num;
    if (prev >= 0 && !RM) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
    if (idx === KITS.length - 1 && prev !== -1) { var r = frame.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height * .4, 70, 1.2); }
  }
  setKit(0);
  if (!RM && window.ScrollTrigger) {
    ScrollTrigger.create({ trigger: walk, start: 'top top', end: function () { return '+=' + innerHeight * 2.4; }, pin: '.walk-pin', anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (s) { setKit(Math.min(KITS.length - 1, Math.floor(s.progress * KITS.length * 0.999))); } });
  } else { walk.classList.add('static'); setKit(KITS.length - 1); chs.forEach(function (c) { c.classList.add('on'); }); }

  /* ============================ 2. SQUAD ============================ */
  var BELT = '<svg viewBox="0 0 200 160" aria-hidden="true"><path d="M10 60 Q100 40 190 60 L190 84 Q100 64 10 84Z" fill="#7a1b1b"/><path d="M10 60 Q100 40 190 60" stroke="#a52a2a" stroke-width="3" fill="none"/><path d="M86 52 L114 52 L118 92 L82 92Z" fill="#6a1414"/><path d="M90 88 L66 150 L82 150 L100 96Z" fill="#7a1b1b"/><path d="M110 88 L134 150 L118 150 L100 96Z" fill="#7a1b1b"/><circle cx="100" cy="72" r="10" fill="#f26522"/></svg>';
  var SQUAD = [
    { num: '01', badge: 'U19', role: 'Player', name: 'Badminton', line: 'National level, under-19, for Telangana', img: 'media/photos/badminton.jpg', pos: '50% 30%',
      kicker: 'Player · Badminton', title: 'Telangana, on court.', text: 'I represented Telangana in national-level badminton as an under-19, after 3rd place in a District U16 tournament. Still on court whenever I can.', nums: [['U19', 'national level'], ['3rd', 'District U16']], role2: 'What it gave me: I know how match day feels for a player, not only for a fan.' },
    { num: '02', badge: 'Belt', role: 'Fighter', name: 'Kung Fu', line: 'Maroon belt', art: BELT,
      kicker: 'Fighter · Kung Fu', title: 'Maroon belt.', text: 'I hold a maroon belt in Kung Fu. Years of training taught me discipline, and that the work no one sees is what shows up on the day.', nums: [['Maroon', 'belt in Kung Fu']], role2: '' },
    { num: '03', badge: 'IGL', role: 'In-game leader', name: 'Esports', line: '1st in Valorant, 2nd in Counter-Strike', img: 'media/photos/titans-jersey.jpg', pos: '50% 25%',
      kicker: 'Player · TITANS IBS', title: 'In-game leader.', text: 'I played Valorant and Counter-Strike competitively in 2021–22 as in-game leader with TITANS IBS, and coordinated the club’s tournaments.', nums: [['1st', 'Valorant tournament'], ['2nd', 'Counter-Strike tournament'], ['10+', 'tournaments run']], role2: 'My role: player, in-game leader and event coordinator.' },
    { num: '04', badge: '2 days', role: 'On-ground', name: 'HYROX Delhi', line: '1,000+ attendees, Masters’ Union team', img: 'media/photos/hyrox.jpg', pos: '50% 30%',
      kicker: 'Events · HYROX Delhi 2026', title: 'Where the crowd is.', text: 'On-ground execution at HYROX Delhi across two days with the Masters’ Union team, leading volunteer logistics and the attendee experience.', nums: [['1,000+', 'attendees'], ['2', 'days']], role2: 'My role: on-ground execution.' },
    { num: '05', badge: 'Lot 01', role: 'Auctioneer', name: 'IPL auction', line: '60 students, 10 teams, ₹5K budget', img: 'media/photos/auction-draft.jpg', pos: '50% 50%',
      kicker: 'Events · SMG Club', title: 'I ran an IPL auction.', text: 'An IPL auction draft for the Masters’ Union SMG Club: real player cards, live bidding and franchise strategy for ten student teams.', nums: [['60', 'participants'], ['10', 'teams'], ['₹5K', 'budget']], role2: 'My role: ran it end to end.', video: 'media/video/auction.mp4', poster: 'media/photos/auction-draft.jpg' },
    { num: '06', badge: '55+', role: 'Analyst', name: 'Research desk', line: '55+ reports, ₹1.9 Cr+ in sales', img: 'media/photos/professional-arms.jpg', pos: '50% 20%',
      kicker: 'Work · The Business Research Company', title: 'Research that sold.', text: 'Two and a half years as an associate consultant, writing market research reports for global clients, and building a green hydrogen database of 600+ projects.', nums: [['55+', 'reports'], ['₹1.9 Cr+', 'in report sales'], ['₹17L+', 'database sales']], role2: 'My role: researched and wrote the reports; built the database.' },
    { num: '07', badge: 'Fan', role: 'Orange Army', name: 'Orange Army', line: 'Hyderabad, through and through', img: 'media/photos/srh-jersey.jpg', pos: '50% 20%',
      kicker: 'Fan · Hyderabad', title: 'Orange Army, from the stands.', text: 'IPL nights in the stands at Uppal, Hyderabad. The crowd is the part of the game I want to work on: what brings fans back, and what keeps them between seasons.', nums: [['Hyderabad', 'home ground'], ['3', 'Sunrisers teams to follow']], role2: 'Looking for: a fan engagement and brand role across the Sunrisers teams.' }
  ];
  var sTrack = $('#squad-track');
  SQUAD.forEach(function (p) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pcard';
    b.setAttribute('aria-label', p.name + ': ' + p.line + '. Read more');
    b.innerHTML = (p.img ? '<img src="' + p.img + '" alt="" loading="lazy" style="object-position:' + p.pos + '">' : '<div class="pc-art">' + p.art + '</div>') +
      '<span class="pc-num" aria-hidden="true">' + p.num + '</span><span class="pc-badge" aria-hidden="true">' + esc(p.badge) + '</span>' +
      '<span class="pc-body"><span class="pc-role">' + esc(p.role) + '</span><span class="pc-name">' + esc(p.name) + '</span><span class="pc-line">' + esc(p.line) + '</span><span class="pc-more">Read more →</span></span>';
    b.addEventListener('click', function () { openCase({ kicker: p.kicker, title: p.title, text: p.text, nums: p.nums, role: p.role2, img: p.img, pos: p.pos, video: p.video, poster: p.poster }); });
    if (!RM && !MOBILE) {
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; b.style.setProperty('--ry', ((x - .5) * 14) + 'deg'); b.style.setProperty('--rx', ((.5 - y) * 10) + 'deg'); b.style.setProperty('--gx', x * 100 + '%'); b.style.setProperty('--gy', y * 100 + '%'); });
      b.addEventListener('pointerleave', function () { b.style.setProperty('--ry', '0deg'); b.style.setProperty('--rx', '0deg'); });
    }
    sTrack.appendChild(b);
  });
  $$('.arw').forEach(function (a) { a.addEventListener('click', function () { var t = document.getElementById(a.dataset.track); t.scrollBy({ left: +a.dataset.dir * Math.min(t.clientWidth * .8, 700), behavior: RM ? 'auto' : 'smooth' }); }); });
  if (window.gsap && !RM) gsap.from('.pcard', { y: 80, opacity: 0, rotate: 4, duration: .9, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: '#squad-track', start: 'top 85%' } });

  /* ============================ 3. MILESTONES ============================ */
  var MILES = [['1,000+', 'attendees on the ground', 'HYROX Delhi 2026'], ['Top 5', 'of 93 teams', 'goSTOPS challenge'], ['₹50L', 'jersey launch plan', 'NIVIA × Indian football'], ['55+', 'market research reports', 'TBRC'],
    ['₹1.9 Cr+', 'in report sales', 'TBRC'], ['60', 'players in an IPL auction draft', 'SMG Club'], ['10+', 'esports tournaments run', 'TITANS IBS'], ['U19', 'national-level badminton', 'Telangana']];
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
    cap.textContent = st === 'today' ? 'Today: Hyderabad cheers for 3 months a year' : 'With One Orange Army: 7 months of Sunrisers cricket to cheer for';
    if (st === 'plan') { var r = monthsEl.getBoundingClientRect(); setTimeout(function () { burst(r.left + r.width * .3, r.top + 40, 30, .8); burst(r.left + r.width * .6, r.top + 40, 30, .8); }, 500); }
  }
  setYear('today');
  segBtns.forEach(function (b) { b.addEventListener('click', function () { userPicked = true; setYear(b.dataset.year); }); });
  io([$('#year')], function () { setTimeout(function () { if (!userPicked) setYear('plan'); }, 1600); }, { threshold: 0.7 });
  io([$('#passport')], function (el) { el.classList.add('in'); }, { threshold: 0.5 });

  /* ============================ 5. ORANGE VAULT ============================ */
  var WORK = [
    { slug: 'one-orange-army', type: 'Concept', title: 'One Orange Army, three seasons', org: 'A concept for the Sunrisers group', big: '4', res: 'Nights in an SA20 2027 pilot', img: 'media/projects/one-orange-army/thumb.jpg', page: true },
    { slug: 'better-store', type: 'Dropshipping', title: 'The Better Store: grades in rupees', org: 'Masters’ Union · dropshipping store', big: '₹2L+', res: 'in revenue from a dropshipping store', img: 'media/projects/better-store/stall-crouch.jpg',
      kicker: 'Dropshipping · Masters’ Union', text: 'A dropshipping store run from a stall on campus, where the stall is the classroom and the grades are in rupees. We sold massage guns, steam irons, humidifiers, gadgets and handmade gifts face to face. When Meta ads started burning too much money, selling through Meesho instead was my idea.', nums: [['₹2L+', 'revenue'], ['Meesho', 'my idea to replace costly Meta ads']], role: 'My role: picked the products, negotiated with suppliers, set the prices, ran the social media marketing and sold to customers at the stall.', imgs: ['media/projects/better-store/stall-crouch.jpg', 'media/projects/better-store/stall-table.jpg', 'media/projects/better-store/stall-customer.jpg', 'media/projects/better-store/stall-pitch.jpg', 'media/projects/better-store/stall-team.jpg'] },
    { slug: 'nivia-india-jersey', type: 'Launch', title: 'Wear the Blue: India’s football jersey', org: 'NIVIA · live industry challenge', big: '₹50L', res: 'launch plan; 30K jerseys in 90 days, base case', img: 'media/projects/nivia-india-jersey/thumb.jpg', page: true },
    { slug: 'gostops-off-season', type: 'Strategy', title: 'Filling hostels in the off-season', org: 'goSTOPS · one-day challenge', big: 'Top 5', res: 'of 93 teams; occupancy 27.5% → 43.8%', img: 'media/projects/gostops-off-season/thumb.jpg', page: true },
    { slug: 'hyrox-delhi', type: 'Event', title: 'HYROX Delhi: 1,000+ people, 2 days', org: 'HYROX Delhi · Masters’ Union', big: '1,000+', res: 'attendees over 2 competition days', img: 'media/projects/hyrox-delhi/thumb.jpg',
      kicker: 'Events · HYROX Delhi 2026', text: 'On-ground execution at HYROX Delhi with the Masters’ Union team, leading volunteer logistics and the attendee experience.', nums: [['1,000+', 'attendees'], ['2', 'days on the ground']], role: 'My role: on-ground team.' },
    { slug: 'ipl-auction-draft', type: 'Event', title: 'An IPL auction, run by students', org: 'SMG Club · Masters’ Union', big: '60', res: 'participants across 10 teams, ₹5K budget', img: 'media/projects/ipl-auction-draft/thumb.jpg',
      kicker: 'Events · SMG Club', text: 'An IPL auction draft for the SMG Club: real player cards, live bidding and franchise strategy for ten student teams.', nums: [['60', 'participants'], ['10', 'teams'], ['₹5K', 'budget']], role: 'My role: ran it end to end.', video: 'media/video/auction.mp4', poster: 'media/photos/auction-draft.jpg' },
    { slug: 'titans-esports', type: 'Community', title: 'TITANS IBS: match nights that grew', org: 'TITANS IBS · ICFAI Business School', big: '4x', res: 'registrations, from 9 to 40', img: 'media/projects/titans-esports/thumb.jpg',
      kicker: 'Community · TITANS IBS', text: 'Ran the college esports club’s tournaments and led its Valorant team. Moving promotion from social feeds to college dashboards grew registrations about four times.', nums: [['10+', 'tournaments'], ['250+', 'participants'], ['9 → 40', 'registrations']], role: 'My role: event coordinator and in-game leader.' },
    { slug: 'pepperfry-shopper', type: 'Research', title: 'Pepperfry: beyond the showroom', org: 'Masters’ Union · Consumer Behaviour', big: '#6', res: 'of 19 brands, with fixes to lift the score to 77.5', img: 'media/projects/pepperfry-shopper/thumb.jpg',
      kicker: 'Consumer research · Pepperfry', text: 'A Furniture Experience Index across 19 brands and 7 touchpoints, built from 19 NCR store visits and 30 customer interviews. Pepperfry ranked #6 of 19 (73.0 against a 66.5 average).', nums: [['19', 'stores visited'], ['30', 'customer interviews'], ['#6 of 19', 'Pepperfry’s rank']], role: 'My role: ran the mystery shopping and interviews and built the index scoring (team project).', link: 'media/docs/pepperfry-odc.pdf' },
    { slug: 'astralis-paradox', type: 'Strategy', title: 'The Astralis Paradox', org: 'Masters’ Union · Term 1', big: 'DKK 5.4M', res: 'annual EBITDA loss diagnosed, with a turnaround', img: 'media/projects/astralis-paradox/thumb.jpg',
      kicker: 'Esports strategy · Masters’ Union', text: 'Why a famous esports team was losing money, and a turnaround built on an asset-light model, D2C membership and an India creator plan.', nums: [['DKK 5.4M', 'annual EBITDA loss diagnosed'], ['Solo', 'project']], role: 'My role: financial diagnosis, turnaround model and India creator go-to-market.' }
  ];
  var vTrack = $('#vault-track');
  WORK.forEach(function (w) {
    var el = document.createElement(w.page ? 'a' : 'button');
    el.className = 'news';
    if (w.page) el.href = 'case.html?p=' + w.slug; else { el.type = 'button'; el.addEventListener('click', function () { openCase({ kicker: w.kicker, title: w.title, text: w.text, nums: w.nums, role: w.role, img: w.img, imgs: w.imgs, video: w.video, poster: w.poster, link: w.link }); }); }
    el.innerHTML = '<div class="news-img"><img src="' + w.img + '" alt="" loading="lazy"><span class="news-type">' + esc(w.type) + '</span></div>' +
      '<div class="news-body"><span class="news-org">' + esc(w.org) + '</span><h3>' + esc(w.title) + '</h3><div class="news-res"><b>' + esc(w.big) + '</b><span>' + esc(w.res) + '</span></div><span class="news-more">' + (w.page ? 'Read the case →' : 'Read more →') + '</span></div>';
    vTrack.appendChild(el);
  });
  if (window.gsap && !RM) gsap.from('.news', { y: 60, opacity: 0, duration: .8, ease: 'power3.out', stagger: .07, scrollTrigger: { trigger: '#vault-track', start: 'top 88%' } });
  var vid = $('#auction-vid');
  if (vid && 'IntersectionObserver' in window && !RM) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } else vid.pause(); }); }, { threshold: .4 }).observe(vid);
  else if (vid) vid.setAttribute('controls', '');

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
    paddle: '<svg viewBox="0 0 80 160"><rect x="34" y="70" width="12" height="86" rx="5" fill="#6b3a1d"/><circle cx="40" cy="42" r="36" fill="#F5F2EE" stroke="#08090B" stroke-width="3"/><text x="40" y="56" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="38" fill="#f26522">01</text></svg>'
  };
  var ROOM = [
    { obj: 'laptop', left: 3, bottom: 30, w: 15, label: 'Laptop · Market research', kicker: 'Work · The Business Research Company', title: 'Research that sold.',
      text: 'Two and a half years as an associate consultant, writing market research reports for global clients.', nums: [['55+', 'reports'], ['₹1.9 Cr+', 'in report sales'], ['₹17L+', 'green hydrogen database sales']], role: 'My role: researched and wrote the reports; built the database.' },
    { obj: 'notebook', left: 19, bottom: 30, w: 11, label: 'Notebook · goSTOPS', title: 'Filling hostels in the off-season', page: 'gostops-off-season' },
    { obj: 'ball', left: 31, bottom: 31, w: 6, label: 'Cricket ball · HYROX Delhi', kicker: 'Events · HYROX Delhi 2026', title: 'Where the crowd is.',
      text: 'On-ground execution at HYROX Delhi across two days with the Masters’ Union team, leading volunteer logistics and the attendee experience.', nums: [['1,000+', 'attendees'], ['2', 'days']], role: 'My role: on-ground execution.', img: 'media/photos/hyrox.jpg' },
    { obj: 'jersey', left: 38, bottom: 30, w: 13, label: 'Jersey · NIVIA launch', title: 'Launching the India jersey', page: 'nivia-india-jersey' },
    { obj: 'clipboard', left: 53, bottom: 30, w: 7, label: 'Scouting clipboard · Pepperfry', kicker: 'Consumer behaviour · Pepperfry', title: 'Scouting the shopper.',
      text: 'A Furniture Experience Index across 19 brands and 7 touchpoints, from 19 store visits and 30 customer interviews. Pepperfry ranked #6 of 19.', nums: [['19', 'stores visited'], ['30', 'interviews'], ['73.0', 'Pepperfry score vs 66.5 average']], role: 'My role: ran the mystery shopping and customer interviews, and built the index scoring (team project).', link: 'media/docs/pepperfry-odc.pdf' },
    { obj: 'trophy', left: 62, bottom: 30, w: 6, label: 'Trophy · Competitive esports', kicker: 'Player · Valorant and Counter-Strike', title: 'In-game leader.',
      text: 'I played Valorant and Counter-Strike competitively in 2021–22, as in-game leader with TITANS IBS.', nums: [['1st', 'Valorant tournament'], ['2nd', 'Counter-Strike tournament']], role: 'My role: player and in-game leader.', img: 'media/photos/titans-jersey.jpg' },
    { obj: 'headset', left: 70, bottom: 30, w: 11, label: 'Headset · Esports events', kicker: 'Community · TITANS IBS', title: 'Match nights, every week.',
      text: 'Coordinated the esports club’s tournaments, from brackets to match-night community. Moving promotion to college dashboards grew registrations about four times.', nums: [['10+', 'tournaments'], ['250+', 'participants'], ['9 → 40', 'registrations']], role: 'My role: event coordinator.' },
    { obj: 'racket', left: 85, bottom: 24, w: 8, label: 'Racket · Badminton', kicker: 'Player · Badminton', title: 'Telangana, on court.',
      text: 'I represented Telangana in national-level badminton as an under-19, after 3rd place in a District U16 tournament. I also hold a maroon belt in Kung Fu.', nums: [['U19', 'national level'], ['3rd', 'District U16']], role: 'What it gave me: I know how match day feels for a player, not only for a fan.', img: 'media/photos/badminton.jpg' },
    { obj: 'board', left: 8, top: 9, w: 14, label: 'Tactics board · Astralis', kicker: 'Esports strategy · Masters’ Union, Term 1', title: 'Rebuilding an esports empire.',
      text: 'A strategic analysis of Astralis: why a famous esports team was losing money, and a turnaround built on an asset-light model, D2C membership and an India creator plan.', nums: [['DKK 5.4M', 'annual EBITDA loss diagnosed'], ['Solo', 'project']], role: 'My role: financial diagnosis, turnaround model and India creator go-to-market.' },
    { obj: 'hanging', left: 43, top: 5, w: 13, label: 'My jersey · About me', kicker: 'About', title: 'Anudeep Gupta.',
      text: 'Hyderabad-raised Orange Army fan and founding-cohort student of Sports Management & Gaming at Masters’ Union. I speak English, Telugu and Hindi, with some Tamil.', nums: [['1 of 8', 'SMG Club core committee'], ['4', 'languages']], role: 'Looking for: a fan engagement and brand role across the Sunrisers teams.', link: 'media/resume.pdf', linkText: 'Open my resume', img: 'media/photos/srh-jersey.jpg' },
    { obj: 'paddle', left: 74, top: 10, w: 6, label: 'Paddle · IPL auction draft', kicker: 'Events · SMG Club', title: 'I ran an IPL auction.',
      text: 'An IPL auction draft for the Masters’ Union SMG Club: real player cards, live bidding and franchise strategy.', nums: [['60', 'participants'], ['10', 'teams'], ['₹5K', 'budget']], role: 'My role: ran it end to end.', video: 'media/video/auction.mp4', poster: 'media/photos/auction-draft.jpg' }
  ];
  var objs = $('#scene-objs'), rlist = $('#room-list');
  ROOM.forEach(function (c, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'obj' + (c.top != null ? ' top' : '') + (i === 1 || i === 10 ? ' pulse' : '');
    b.setAttribute('aria-label', c.label + (c.page ? ': open the full case' : ''));
    b.style.left = c.left + '%'; b.style.width = c.w + '%';
    if (c.top != null) b.style.top = c.top + '%'; else b.style.bottom = c.bottom + '%';
    b.innerHTML = SVG[c.obj] + '<span class="obj-tip">' + esc(c.label) + '</span>';
    b.addEventListener('click', function () { openCase(c); });
    objs.appendChild(b);
    var lb = document.createElement('button'); lb.type = 'button';
    lb.innerHTML = '<span class="mono">' + esc(c.label) + '</span><b>' + esc(c.title) + '</b>';
    lb.addEventListener('click', function () { openCase(c); });
    rlist.appendChild(lb);
  });
  var lbtn = $('#room-list-btn');
  lbtn.addEventListener('click', function () { var on = rlist.classList.toggle('on'); lbtn.setAttribute('aria-expanded', String(on)); lbtn.querySelector('span').textContent = on ? 'Hide the list' : 'Show as a list'; if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  var scene = $('#scene');
  scene.addEventListener('pointermove', function (e) { var r = scene.getBoundingClientRect(); scene.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); scene.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%'); });
  if (window.gsap && !RM) gsap.from('.obj', { y: -40, opacity: 0, duration: .7, ease: 'bounce.out', stagger: .06, scrollTrigger: { trigger: '#scene', start: 'top 75%' } });

  /* ============================ 7. GALLERY + LOGOS ============================ */
  var GAL = [
    ['media/photos/sport-india-2026.jpg', 'Sport India Conference 2026, Vision 2036 panel, Bharat Mandapam', 'wide', '50% 40%'],
    ['media/photos/viren-rasquinha.jpg', 'With Viren Rasquinha, former India hockey captain, at Masters’ Union', ''],
    ['media/photos/hudle-ceo.jpg', 'With Suhail Narain, Founder and CEO of Hudle', ''],
    ['media/photos/pbks-coo.jpg', 'With the COO of Punjab Kings', ''],
    ['media/photos/iamgame-guest.jpg', 'With K. Srinivas Rao, Head of Sports Group at Times of India, at I Am Game 2026', '', '50% 12%'],
    ['media/photos/iamgame-awards.jpg', 'Masters’ Union cohort at the EY I Am Game Sports Awards 2026', ''],
    ['media/photos/conclave-guest.jpg', 'With Manish, VP Commercials & Partnerships at JioStar, at I Am Game 2026', '', '50% 15%'],
    ['media/photos/hyrox.jpg', 'HYROX Delhi 2026, with the Masters’ Union team', ''],
    ['media/projects/better-store/stall-selfie.jpg', 'Running The Better Store stall at Masters’ Union', 'wide', '50% 30%'],
    ['media/photos/nivia-jersey.jpg', 'With the India football jersey, NIVIA live challenge', ''],
    ['media/photos/smg-night.jpg', 'SMG Club night, Masters’ Union', 'wide'],
    ['media/photos/auction-draft.jpg', 'The IPL auction draft, SMG Club', 'wide']
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
    { label: 'Book a call', run: function () { say('Send me a message on LinkedIn and I’ll set up a 15-minute call at a time that suits you.', 'b', LINKEDIN, 'Message me on LinkedIn'); } },
    { label: 'See my resume', run: function () { say('Here’s my one-page resume.', 'b', 'media/resume.pdf', 'Open the PDF'); } },
    { label: 'My socials', run: function () { say('LinkedIn is the best place to reach me.', 'b', LINKEDIN, 'linkedin.com/in/itsanudeepgupta'); setTimeout(function () { var m = say('I’m also on Instagram and X.', 'b', INSTAGRAM, 'instagram.com/itsanudeepgupta'); var a = document.createElement('a'); a.href = X; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'x.com/_anudeep_gupta_'; m.appendChild(a); }, 300); } },
    { label: 'See my idea for SRH', run: function () { say('One Orange Army, three seasons: bringing Eastern Cape and Leeds home to Hyderabad.', 'b', '#fixtures', 'Jump to the idea'); } }
  ];
  R.forEach(function (r) { var b = document.createElement('button'); b.type = 'button'; b.textContent = r.label; b.addEventListener('click', function () { say(r.label, 'u'); setTimeout(r.run, 350); }); choices.appendChild(b); });
  var greeted = false;
  var toggle = function (open) {
    var o = open == null ? !bot.classList.contains('open') : open;
    bot.classList.toggle('open', o); botBtn.setAttribute('aria-expanded', String(o)); teaser.classList.add('hide');
    if (o && !greeted) { greeted = true; say('Hey Riser, nice to meet you! Like you, I’m a Riser too.'); setTimeout(function () { say('What would you like to do?'); }, 500); }
  };
  botBtn.addEventListener('click', function () { toggle(); });
  $('#bot-x').addEventListener('click', function () { toggle(false); });
  teaser.addEventListener('click', function () { toggle(true); });
  msgs.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a && a.getAttribute('href') === '#fixtures') toggle(false); });
  addEventListener('scroll', function () { if (scrollY > 600) teaser.classList.add('hide'); }, { passive: true });

  if (window.ScrollTrigger) addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
