/* ==========================================================================
   ag.js: Anudeep's additions. Kit change, dressing room, Hey Riser chatbot.
   Loads after app.js; uses the same gsap + ScrollTrigger + Lenis clock.
   ========================================================================== */
(function () {
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var LINKEDIN = 'https://www.linkedin.com/in/itsanudeepgupta/';
  var INSTAGRAM = 'https://www.instagram.com/itsanudeepgupta/';
  var X = 'https://x.com/_anudeep_gupta_';

  /* ============================ 1. KIT CHANGE ============================ */
  var KITS = [
    { img: 'media/kit/kit-1-player.jpg', tag: 'Kit 01 · The player', num: '01', title: 'A player before anything else.',
      text: 'I represented Telangana in national-level badminton as an under-19, and hold a maroon belt in Kung Fu. I know match day from the court, not only from the stands.',
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
  var kitSec = $('#ag-kit');
  if (kitSec) {
    var frame = $('.ag-kit-frame', kitSec), copy = $('.ag-kit-copy', kitSec), dots = $('.ag-kit-dots', kitSec), numEl = $('.ag-kit-num', kitSec), tagEl = $('.ag-kit-tag', kitSec);
    KITS.forEach(function (k, i) {
      var s = document.createElement('div'); s.className = 'ag-kit-shot' + (i === 0 ? ' on' : ''); s.style.zIndex = i;
      s.innerHTML = '<img src="' + k.img + '" alt="Anudeep in ' + esc(k.tag.split(' · ')[1].replace('The ', 'the ') + ' kit') + '" loading="' + (i ? 'lazy' : 'eager') + '">';
      frame.insertBefore(s, tagEl);
      var c = document.createElement('article'); c.className = 'ag-kit-ch' + (i === 0 ? ' on' : '');
      c.innerHTML = '<p class="kicker mono">' + esc(k.tag) + '</p><h2>' + esc(k.title) + '</h2><p>' + esc(k.text) + '</p><div class="ag-kit-nums">' +
        k.nums.map(function (n) { return '<div><b>' + esc(n[0]) + '</b><span>' + esc(n[1]) + '</span></div>'; }).join('') + '</div>';
      copy.appendChild(c); dots.appendChild(document.createElement('i'));
    });
    var shots = frame.querySelectorAll('.ag-kit-shot'), chs = copy.querySelectorAll('.ag-kit-ch'), ds = dots.querySelectorAll('i'), cur = -1;
    var setKit = function (idx) {
      if (idx === cur) return; cur = idx;
      for (var i = 0; i < KITS.length; i++) {
        shots[i].classList.toggle('on', i === idx); shots[i].classList.toggle('past', i < idx);
        chs[i].classList.toggle('on', i === idx); ds[i].classList.toggle('on', i === idx);
      }
      numEl.textContent = KITS[idx].num; tagEl.textContent = KITS[idx].tag;
      if (!RM && window.K && K.burst && idx === KITS.length - 1) { var r = frame.getBoundingClientRect(); K.burst(r.left + r.width / 2, r.top + r.height / 2, 26, 1.3); }
    };
    setKit(0);
    if (!RM && window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: kitSec, start: 'top top', end: function () { return '+=' + innerHeight * 4; }, pin: '.ag-kit-pin', scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: function (s) { setKit(Math.min(KITS.length - 1, Math.floor(s.progress * KITS.length * 0.999))); } });
    } else {
      kitSec.classList.add('ag-static'); setKit(KITS.length - 1);
    }
  }

  /* ============================ 2. DRESSING ROOM ============================ */
  var SVG = {
    laptop: '<svg viewBox="0 0 200 130"><rect x="32" y="2" width="136" height="90" rx="6" fill="#1b1d24" stroke="#3a3d47" stroke-width="3"/><rect x="40" y="10" width="120" height="74" rx="2" fill="#0b1626"/><rect x="52" y="58" width="12" height="18" fill="#f26522"/><rect x="70" y="46" width="12" height="30" fill="#f26522"/><rect x="88" y="36" width="12" height="40" fill="#FF8A4C"/><rect x="106" y="26" width="12" height="50" fill="#f26522"/><rect x="124" y="18" width="12" height="58" fill="#FFB27F"/><path d="M8 96 H192 L200 112 H0Z" fill="#a4a9b3"/><rect x="0" y="112" width="200" height="6" rx="3" fill="#6b707a"/></svg>',
    notebook: '<svg viewBox="0 0 150 100"><path d="M14 30 L124 18 L140 80 L28 94Z" fill="#e9e1d3"/><path d="M10 26 L120 14 L136 76 L24 90Z" fill="#1f2a44"/><path d="M98 17 L114 73" stroke="#f26522" stroke-width="6"/><rect x="34" y="40" width="50" height="18" rx="2" transform="rotate(-6 59 49)" fill="#F5F2EE"/><text x="59" y="54" text-anchor="middle" transform="rotate(-6 59 49)" font-family="Anton,Impact,sans-serif" font-size="12" fill="#1f2a44">CASES</text></svg>',
    ball: '<svg viewBox="0 0 80 80"><defs><radialGradient id="bg1" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#e0473c"/><stop offset="1" stop-color="#6e110c"/></radialGradient></defs><circle cx="40" cy="40" r="36" fill="url(#bg1)"/><path d="M14 18 C 34 34, 46 46, 66 62" stroke="#f3e9df" stroke-width="2.5" fill="none"/><path d="M18 14 C 38 30, 50 42, 70 58" stroke="#f3e9df" stroke-width="2.5" fill="none" stroke-dasharray="3 4"/><path d="M10 22 C 30 38, 42 50, 62 66" stroke="#f3e9df" stroke-width="2.5" fill="none" stroke-dasharray="3 4"/></svg>',
    jersey: '<svg viewBox="0 0 170 90"><path d="M8 60 L162 60 L162 84 L8 84Z" fill="#163a9c"/><path d="M14 40 L156 40 L162 62 L8 62Z" fill="#1d4ed8"/><path d="M20 22 L150 22 L156 42 L14 42Z" fill="#2b5cf0"/><path d="M70 22 L85 36 L100 22" fill="none" stroke="#f26522" stroke-width="4"/><text x="85" y="78" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="14" fill="#fff" opacity=".8">INDIA</text></svg>',
    clipboard: '<svg viewBox="0 0 110 140"><rect x="6" y="14" width="98" height="122" rx="8" fill="#8a5330"/><rect x="14" y="24" width="82" height="104" rx="3" fill="#F5F2EE"/><rect x="36" y="4" width="38" height="22" rx="6" fill="#9aa0aa"/><path d="M24 52 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M24 78 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M24 104 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M50 54 H86 M50 80 H86 M50 106 H80" stroke="#1f2a44" stroke-width="4" stroke-linecap="round"/></svg>',
    racket: '<svg viewBox="0 0 120 300"><ellipse cx="60" cy="74" rx="46" ry="66" fill="rgba(255,255,255,.06)" stroke="#f26522" stroke-width="7"/><g stroke="#f3e9df" stroke-width="1.2" opacity=".8"><path d="M30 26 V122 M42 16 V132 M54 10 V138 M66 10 V138 M78 16 V132 M90 26 V122"/><path d="M18 50 H102 M15 66 H105 M14 82 H106 M16 98 H104 M24 114 H96 M24 36 H96"/></g><rect x="56" y="138" width="8" height="96" fill="#c9ccd3"/><rect x="52" y="230" width="16" height="66" rx="6" fill="#16171c"/><g transform="translate(92 250)"><path d="M0 0 L-16 -34 H16Z" fill="#f3e9df"/><circle cx="0" cy="6" r="9" fill="#f26522"/></g></svg>',
    trophy: '<svg viewBox="0 0 100 130"><path d="M26 10 H74 V44 C74 66 62 78 50 78 C38 78 26 66 26 44Z" fill="#f2b632"/><path d="M26 18 H8 C8 44 18 52 30 54 M74 18 H92 C92 44 82 52 70 54" fill="none" stroke="#f2b632" stroke-width="7"/><rect x="44" y="78" width="12" height="22" fill="#c98f1c"/><rect x="26" y="100" width="48" height="12" rx="3" fill="#16171c"/><rect x="18" y="112" width="64" height="12" rx="3" fill="#2b2d35"/><text x="50" y="52" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="28" fill="#7a5206">1</text></svg>',
    board: '<svg viewBox="0 0 200 130"><rect x="2" y="2" width="196" height="126" rx="6" fill="#f4f1ea" stroke="#9aa0aa" stroke-width="5"/><circle cx="46" cy="44" r="9" fill="none" stroke="#1f2a44" stroke-width="3"/><circle cx="96" cy="84" r="9" fill="none" stroke="#1f2a44" stroke-width="3"/><path d="M130 34 l16 16 M146 34 l-16 16 M150 78 l16 16 M166 78 l-16 16" stroke="#f26522" stroke-width="4" stroke-linecap="round"/><path d="M56 48 C 80 40, 84 70, 90 76" fill="none" stroke="#1f2a44" stroke-width="3" stroke-dasharray="6 5"/><path d="M106 82 C 130 76, 140 60, 148 56" fill="none" stroke="#f26522" stroke-width="3"/><text x="100" y="120" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="13" fill="#1f2a44">TURNAROUND PLAN</text></svg>',
    glass: '<svg viewBox="0 0 120 100"><rect x="68" y="58" width="44" height="14" rx="7" transform="rotate(35 68 58)" fill="#6b3a1d"/><circle cx="48" cy="44" r="32" fill="rgba(170,215,255,.22)" stroke="#cfd3da" stroke-width="8"/><path d="M30 30 Q40 22 52 24" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/></svg>',
    headset: '<svg viewBox="0 0 160 110"><path d="M22 70 C 22 18, 138 18, 138 70" fill="none" stroke="#2b2d35" stroke-width="12" stroke-linecap="round"/><path d="M22 70 C 22 18, 138 18, 138 70" fill="none" stroke="#f26522" stroke-width="3"/><rect x="6" y="58" width="34" height="46" rx="14" fill="#16171c"/><rect x="120" y="58" width="34" height="46" rx="14" fill="#16171c"/><rect x="12" y="66" width="22" height="30" rx="10" fill="#f26522"/><rect x="126" y="66" width="22" height="30" rx="10" fill="#f26522"/><path d="M26 98 Q40 108 58 104" stroke="#2b2d35" stroke-width="4" fill="none"/><circle cx="60" cy="104" r="5" fill="#2b2d35"/></svg>',
    hanging: '<svg viewBox="0 0 200 230"><path d="M100 4 a10 10 0 1 1 -8 16" fill="none" stroke="#c9ccd3" stroke-width="4"/><path d="M100 22 L30 62 H170Z" fill="none" stroke="#c9ccd3" stroke-width="4"/><path d="M58 52 L28 64 L6 120 L36 132 L46 106 L46 222 L154 222 L154 106 L164 132 L194 120 L172 64 L142 52 Q100 72 58 52Z" fill="#f26522"/><path d="M58 52 Q100 72 142 52" fill="none" stroke="#08090B" stroke-width="6"/><text x="100" y="118" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="26" fill="#08090B">ANUDEEP</text><path d="M46 222 H154" stroke="#08090B" stroke-width="6"/></svg>',
    paddle: '<svg viewBox="0 0 80 160"><rect x="34" y="70" width="12" height="86" rx="5" fill="#6b3a1d"/><circle cx="40" cy="42" r="36" fill="#F5F2EE" stroke="#08090B" stroke-width="3"/><text x="40" y="56" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="38" fill="#f26522">01</text></svg>'
  };
  SVG.clipboard = '<svg viewBox="0 0 110 140"><rect x="6" y="14" width="98" height="122" rx="8" fill="#8a5330"/><rect x="14" y="24" width="82" height="104" rx="3" fill="#F5F2EE"/><rect x="36" y="4" width="38" height="22" rx="6" fill="#9aa0aa"/><path d="M24 52 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M24 78 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M24 104 l6 6 l10 -12" stroke="#f26522" stroke-width="4" fill="none"/><path d="M50 54 H86 M50 80 H86 M50 106 H80" stroke="#1f2a44" stroke-width="4" stroke-linecap="round"/></svg>';
  SVG.racket = '<svg viewBox="0 0 120 300"><ellipse cx="60" cy="74" rx="46" ry="66" fill="rgba(255,255,255,.06)" stroke="#f26522" stroke-width="7"/><g stroke="#f3e9df" stroke-width="1.2" opacity=".8"><path d="M30 26 V122 M42 16 V132 M54 10 V138 M66 10 V138 M78 16 V132 M90 26 V122"/><path d="M18 50 H102 M15 66 H105 M14 82 H106 M16 98 H104 M24 114 H96 M24 36 H96"/></g><rect x="56" y="138" width="8" height="96" fill="#c9ccd3"/><rect x="52" y="230" width="16" height="66" rx="6" fill="#16171c"/><g transform="translate(92 250)"><path d="M0 0 L-16 -34 H16Z" fill="#f3e9df"/><circle cx="0" cy="6" r="9" fill="#f26522"/></g></svg>';
  SVG.trophy = '<svg viewBox="0 0 100 130"><path d="M26 10 H74 V44 C74 66 62 78 50 78 C38 78 26 66 26 44Z" fill="#f2b632"/><path d="M26 18 H8 C8 44 18 52 30 54 M74 18 H92 C92 44 82 52 70 54" fill="none" stroke="#f2b632" stroke-width="7"/><rect x="44" y="78" width="12" height="22" fill="#c98f1c"/><rect x="26" y="100" width="48" height="12" rx="3" fill="#16171c"/><rect x="18" y="112" width="64" height="12" rx="3" fill="#2b2d35"/><text x="50" y="52" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="28" fill="#7a5206">1</text></svg>';
  SVG.board = '<svg viewBox="0 0 200 130"><rect x="2" y="2" width="196" height="126" rx="6" fill="#f4f1ea" stroke="#9aa0aa" stroke-width="5"/><circle cx="46" cy="44" r="9" fill="none" stroke="#1f2a44" stroke-width="3"/><circle cx="96" cy="84" r="9" fill="none" stroke="#1f2a44" stroke-width="3"/><path d="M130 34 l16 16 M146 34 l-16 16 M150 78 l16 16 M166 78 l-16 16" stroke="#f26522" stroke-width="4" stroke-linecap="round"/><path d="M56 48 C 80 40, 84 70, 90 76" fill="none" stroke="#1f2a44" stroke-width="3" stroke-dasharray="6 5"/><path d="M106 82 C 130 76, 140 60, 148 56" fill="none" stroke="#f26522" stroke-width="3"/><text x="100" y="120" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="13" fill="#1f2a44">TURNAROUND PLAN</text></svg>';
  SVG.hanging = SVG.hanging.replace('ANUDEEP</text>', 'ANUDEEP</text>');

  var CASES = [
    { obj: 'laptop', left: 3, bottom: 30, w: 15, label: 'Laptop · Market research', kicker: 'Work · The Business Research Company', title: 'Research that sold.',
      text: 'Two and a half years as an associate consultant, writing market research reports for global clients.', nums: [['55+', 'reports'], ['₹1.9 Cr+', 'in report sales'], ['₹17L+', 'green hydrogen database sales']], role: 'My role: researched and wrote the reports; built the database.' },
    { obj: 'notebook', left: 19, bottom: 30, w: 11, label: 'Notebook · goSTOPS', page: 'gostops-off-season' },
    { obj: 'ball', left: 31, bottom: 31, w: 6, label: 'Cricket ball · HYROX Delhi', kicker: 'Events · HYROX Delhi 2026', title: 'Where the crowd is.',
      text: 'On-ground execution at HYROX Delhi across two days with the Masters’ Union team, leading volunteer logistics and the attendee experience.', nums: [['1,000+', 'attendees'], ['2', 'days']], role: 'My role: on-ground execution.', img: 'media/photos/hyrox.jpg' },
    { obj: 'jersey', left: 38, bottom: 30, w: 13, label: 'Jersey · NIVIA launch', page: 'nivia-india-jersey' },
    { obj: 'clipboard', left: 53, bottom: 30, w: 7, label: 'Scouting clipboard · Pepperfry', kicker: 'Consumer behaviour · Pepperfry', title: 'Scouting the shopper.',
      text: 'A Furniture Experience Index across 19 brands and 7 touchpoints, from 19 store visits and 30 customer interviews. Pepperfry ranked #6 of 19.', nums: [['19', 'stores visited'], ['30', 'interviews'], ['73.0', 'Pepperfry score vs 66.5 average']], role: 'My role: ran the mystery shopping and customer interviews, and built the index scoring (team project).', link: 'media/docs/pepperfry-odc.pdf' },
    { obj: 'trophy', left: 62, bottom: 30, w: 6, label: 'Trophy · Competitive esports', kicker: 'Player · Valorant and Counter-Strike', title: 'In-game leader.',
      text: 'I played Valorant and Counter-Strike competitively in 2021–22, as in-game leader with TITANS IBS.', nums: [['1st', 'Valorant tournament'], ['2nd', 'Counter-Strike tournament']], role: 'My role: player and in-game leader.', img: 'media/photos/titans-jersey.jpg' },
    { obj: 'headset', left: 70, bottom: 30, w: 11, label: 'Headset · Esports events', kicker: 'Community · TITANS IBS', title: 'Match nights, every week.',
      text: 'Coordinated the esports club’s tournaments, from brackets to match-night community. Moving promotion to college dashboards grew registrations about four times.', nums: [['10+', 'tournaments'], ['250+', 'participants'], ['9 → 40', 'registrations']], role: 'My role: event coordinator.' },
    { obj: 'racket', left: 85, bottom: 24, w: 8, label: 'Racket · Badminton', kicker: 'Player · Badminton', title: 'Telangana, on court.',
      text: 'I represented Telangana in national-level badminton as an under-19, after 3rd place in a District U16 tournament. I also hold a maroon belt in Kung Fu.', nums: [['U19', 'national level'], ['3rd', 'District U16']], role: 'What it gave me: I know how match day feels for a player, not only for a fan.', img: 'media/photos/badminton.jpg' },
    { obj: 'board', left: 8, top: 7, w: 14, label: 'Tactics board · Astralis', kicker: 'Esports strategy · Masters’ Union, Term 1', title: 'Rebuilding an esports empire.',
      text: 'A strategic analysis of Astralis: why a famous esports team was losing money, and a turnaround built on an asset-light model, D2C membership and an India creator plan.', nums: [['DKK 5.4M', 'annual EBITDA loss diagnosed'], ['Solo', 'project']], role: 'My role: financial diagnosis, turnaround model and India creator go-to-market.' },
    { obj: 'hanging', left: 43, top: 5, w: 13, label: 'My jersey · About me', kicker: 'About', title: 'Anudeep Gupta.',
      text: 'Hyderabad-raised Orange Army fan and founding-cohort student of Sports Management & Gaming at Masters’ Union. I speak English, Telugu and Hindi, with some Tamil.', nums: [['1 of 8', 'SMG Club core committee'], ['4', 'languages']], role: 'Looking for: a fan engagement and brand role across the Sunrisers teams.', link: 'media/resume.pdf', linkText: 'Open my resume', img: 'media/photos/srh-jersey.jpg' },
    { obj: 'paddle', left: 74, top: 8, w: 6, label: 'Paddle · IPL auction draft', kicker: 'Events · SMG Club', title: 'I ran an IPL auction.',
      text: 'An IPL auction draft for the Masters’ Union SMG Club: real player cards, live bidding and franchise strategy.', nums: [['60', 'participants'], ['10', 'teams'], ['₹5K', 'budget']], role: 'My role: ran it end to end.', video: 'media/video/auction.mp4', poster: 'media/photos/auction-draft.jpg' }
  ];
  var objs = $('#ag-objects'), list = $('#ag-list'), dlg = $('#ag-case');
  function openCase(c) {
    if (c.page) { location.href = 'project.html?p=' + encodeURIComponent(c.page); return; }
    $('#ag-case-kicker').textContent = c.kicker; $('#ag-case-title').textContent = c.title; $('#ag-case-text').textContent = c.text;
    $('#ag-case-nums').innerHTML = c.nums.map(function (n) { return '<div><b>' + esc(n[0]) + '</b><span>' + esc(n[1]) + '</span></div>'; }).join('');
    $('#ag-case-role').textContent = c.role;
    var m = $('#ag-case-media'); m.innerHTML = '';
    if (c.video) m.innerHTML = '<video src="' + c.video + '" poster="' + c.poster + '" muted loop playsinline ' + (RM ? 'controls' : 'autoplay') + ' aria-label="The IPL auction draft in progress"></video>';
    else if (c.img) m.innerHTML = '<img src="' + c.img + '" alt="" loading="lazy">';
    m.hidden = !(c.video || c.img);
    var a = $('#ag-case-link'); if (c.link) { a.href = c.link; a.textContent = c.linkText || 'Open the deck'; a.hidden = false; } else a.hidden = true;
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
  }
  if (objs) {
    CASES.forEach(function (c) {
      var b = document.createElement('button'); b.className = 'ag-obj'; b.type = 'button';
      b.setAttribute('aria-label', c.label + (c.page ? ': open the full case' : ''));
      b.style.left = c.left + '%'; b.style.width = c.w + '%';
      if (c.top != null) b.style.top = c.top + '%'; else b.style.bottom = c.bottom + '%';
      b.innerHTML = c.top != null ? SVG[c.obj] + '<span class="ag-tip">' + esc(c.label) + '</span>' : '<span class="ag-tip">' + esc(c.label) + '</span>' + SVG[c.obj];
      b.addEventListener('click', function () { openCase(c); });
      objs.appendChild(b);
      var lb = document.createElement('button'); lb.type = 'button';
      lb.innerHTML = '<span class="mono">' + esc(c.label) + '</span><b>' + esc(c.title || (c.page === 'nivia-india-jersey' ? 'Launching the India jersey' : 'Filling hostels in the off-season')) + '</b>';
      lb.addEventListener('click', function () { openCase(c); });
      list.appendChild(lb);
    });
    var lbtn = $('#ag-list-btn');
    lbtn.addEventListener('click', function () { var on = list.classList.toggle('on'); lbtn.setAttribute('aria-expanded', String(on)); lbtn.querySelector('span').textContent = on ? 'Hide the list' : 'Show as a list'; });
    $('#ag-case-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { var v = dlg.querySelector('video'); if (v) v.pause(); });
    var scene = $('#ag-scene');
    scene.addEventListener('pointermove', function (e) { var r = scene.getBoundingClientRect(); scene.style.setProperty('--mx2', ((e.clientX - r.left) / r.width * 100) + '%'); scene.style.setProperty('--my2', ((e.clientY - r.top) / r.height * 100) + '%'); });
  }

  /* ============================ 3. HEY RISER ============================ */
  var bot = $('#ag-bot'), botBtn = $('#ag-bot-btn'), msgs = $('#ag-bot-msgs'), choices = $('#ag-bot-choices'), teaser = $('#ag-bot-teaser');
  if (bot) {
    var say = function (text, who, href, linkText) {
      var m = document.createElement('div'); m.className = 'ag-m ' + (who || 'b'); m.textContent = text;
      if (href) { var a = document.createElement('a'); a.href = href; a.textContent = linkText; if (/^http/.test(href) || /\.pdf$/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } m.appendChild(a); }
      msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight;
    };
    var R = [
      { label: 'Book a call', run: function () { say('Send me a message on LinkedIn and I’ll set up a 15-minute call at a time that suits you.', 'b', LINKEDIN, 'Message me on LinkedIn'); } },
      { label: 'See my resume', run: function () { say('Here’s my one-page resume.', 'b', 'media/resume.pdf', 'Open the PDF'); } },
      { label: 'My socials', run: function () { say('LinkedIn is the best place to reach me.', 'b', LINKEDIN, 'linkedin.com/in/itsanudeepgupta'); setTimeout(function () { say('I’m also on Instagram and X.', 'b', INSTAGRAM, 'instagram.com/itsanudeepgupta'); var last = msgs.lastChild, a = document.createElement('a'); a.href = X; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'x.com/_anudeep_gupta_'; last.appendChild(a); }, 300); } },
      { label: 'See my idea for SRH', run: function () { say('One Orange Army, three seasons: bringing Eastern Cape and Leeds home to Hyderabad.', 'b', '#film', 'Jump to the idea'); } }
    ];
    R.forEach(function (r) { var b = document.createElement('button'); b.type = 'button'; b.className = 'chip chip-sm'; b.textContent = r.label; b.addEventListener('click', function () { say(r.label, 'u'); setTimeout(r.run, 350); }); choices.appendChild(b); });
    var greeted = false;
    var toggle = function (open) {
      var o = open == null ? !bot.classList.contains('open') : open;
      bot.classList.toggle('open', o); botBtn.setAttribute('aria-expanded', String(o)); teaser.classList.add('hide');
      if (o && !greeted) { greeted = true; say('Hey Riser, nice to meet you! Like you, I’m a Riser too.'); setTimeout(function () { say('What would you like to do?'); }, 500); }
    };
    botBtn.addEventListener('click', function () { toggle(); });
    $('#ag-bot-close').addEventListener('click', function () { toggle(false); });
    teaser.addEventListener('click', function () { toggle(true); });
    msgs.addEventListener('click', function (e) { var a = e.target.closest('a'); if (a && a.getAttribute('href') === '#film') toggle(false); });
    addEventListener('scroll', function () { if (scrollY > 400) teaser.classList.add('hide'); }, { passive: true });
  }
})();
