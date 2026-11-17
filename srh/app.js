(function () {
  'use strict';

  // ---------- links still to fill in ----------
  var CAL_URL = '';          // e.g. 'https://cal.com/anudeepgupta/15min'
  var INSTAGRAM_URL = '';    // e.g. 'https://instagram.com/...'
  var X_URL = '';            // e.g. 'https://x.com/...'
  var LINKEDIN_URL = 'https://www.linkedin.com/in/itsanudeepgupta';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function sectionProgress(el) {
    var r = el.getBoundingClientRect();
    var total = el.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }

  // =========================================================
  // 1. NIGHT AT UPPAL: a stadium drawn on canvas
  // =========================================================
  var canvas = document.getElementById('stadium');
  var ctx = canvas.getContext('2d');
  var uppal = document.getElementById('uppal');
  var screenEl = document.getElementById('screen');
  var screenLine = document.getElementById('screenLine');
  var heroCopy = document.getElementById('heroCopy');
  var stats = document.getElementById('stats');
  var W = 0, H = 0, DPR = 1, crowd = [], stars = [];
  var towers = [0, 0, 0, 0];           // light level of each tower, 0..1
  var towerTarget = [0, 0, 0, 0];
  var start = performance.now();

  function rand(seed) { var x = Math.sin(seed) * 10000; return x - Math.floor(x); }

  function geometry() {
    var cx = W / 2, cy = H * 0.68;
    return {
      cx: cx, cy: cy,
      orx: W * 0.66, ory: H * 0.42,   // outer stands
      irx: W * 0.44, iry: H * 0.225,  // inner edge of stands
      frx: W * 0.40, fry: H * 0.195   // field
    };
  }

  function buildCrowd() {
    var g = geometry();
    crowd = [];
    var n = Math.round(clamp(W * H / 520, 900, 3200));
    for (var i = 0; i < n; i++) {
      var a = Math.PI + rand(i * 3.1) * Math.PI;           // upper half
      if (rand(i * 7.7) < 0.25) a = rand(i * 5.3) * Math.PI; // a few below
      var t = rand(i * 1.9);
      var rx = g.irx + (g.orx - g.irx) * t;
      var ry = g.iry + (g.ory - g.iry) * t;
      var x = g.cx + Math.cos(a) * rx;
      var y = g.cy + Math.sin(a) * ry;
      if (y > H * 0.98) continue;
      var c = rand(i * 2.7);
      crowd.push({ x: x, y: y, r: 0.7 + t * 1.3, c: c < 0.58 ? 0 : (c < 0.72 ? 1 : 2), ph: rand(i) * 6.28 });
    }
    stars = [];
    for (var s = 0; s < 70; s++) stars.push({ x: rand(s * 9.1) * W, y: rand(s * 4.3) * H * 0.3, r: rand(s) * 1.1 + 0.2 });
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildCrowd();
  }

  function towerPos(i) {
    var xs = [0.08, 0.27, 0.73, 0.92], ys = [0.2, 0.1, 0.1, 0.2];
    return { x: W * xs[i], y: H * ys[i] };
  }

  function draw(now) {
    var g = geometry();
    var lit = (towers[0] + towers[1] + towers[2] + towers[3]) / 4;

    // sky
    var sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#04050A'); sky.addColorStop(1, '#0B0D18');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,' + (0.6 - lit * 0.45) + ')';
    for (var s = 0; s < stars.length; s++) { ctx.beginPath(); ctx.arc(stars[s].x, stars[s].y, stars[s].r, 0, 6.283); ctx.fill(); }

    // stands (rings)
    for (var k = 0; k < 6; k++) {
      var t = k / 5;
      ctx.beginPath();
      ctx.ellipse(g.cx, g.cy, g.orx - (g.orx - g.irx) * t, g.ory - (g.ory - g.iry) * t, 0, 0, 6.283);
      var base = 16 + k * 3, warm = lit * (20 + k * 6);
      ctx.fillStyle = 'rgb(' + Math.round(base + warm * 1.3) + ',' + Math.round(base + warm * 0.75) + ',' + Math.round(base + 6 + warm * 0.45) + ')';
      ctx.fill();
    }

    // crowd
    var tt = now / 1000;
    for (var i = 0; i < crowd.length; i++) {
      var p = crowd[i];
      var tw = 0.55 + 0.45 * Math.sin(tt * 2 + p.ph);
      var a = (0.25 + lit * 0.75) * tw;
      ctx.fillStyle = p.c === 0 ? 'rgba(242,101,34,' + a + ')' : (p.c === 1 ? 'rgba(255,240,225,' + a + ')' : 'rgba(90,92,104,' + a + ')');
      ctx.fillRect(p.x, p.y, p.r * 1.6, p.r * 1.6);
    }

    // field
    ctx.save();
    ctx.beginPath(); ctx.ellipse(g.cx, g.cy, g.frx, g.fry, 0, 0, 6.283); ctx.clip();
    var f = ctx.createRadialGradient(g.cx, g.cy, 10, g.cx, g.cy, g.frx);
    var gl = 0.18 + lit * 0.82;
    f.addColorStop(0, 'rgb(' + Math.round(40 * gl + 10) + ',' + Math.round(130 * gl + 20) + ',' + Math.round(52 * gl + 12) + ')');
    f.addColorStop(1, 'rgb(' + Math.round(20 * gl + 6) + ',' + Math.round(80 * gl + 14) + ',' + Math.round(34 * gl + 8) + ')');
    ctx.fillStyle = f; ctx.fillRect(0, 0, W, H);
    // mowing stripes
    ctx.fillStyle = 'rgba(0,0,0,' + (0.07 + lit * 0.05) + ')';
    var stripe = g.frx / 7;
    for (var x = g.cx - g.frx; x < g.cx + g.frx; x += stripe * 2) ctx.fillRect(x, g.cy - g.fry, stripe, g.fry * 2);
    // 30-yard circle
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.12 + lit * 0.3) + ')'; ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.ellipse(g.cx, g.cy, g.frx * 0.55, g.fry * 0.55, 0, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
    // pitch
    var pw = Math.max(10, W * 0.022), ph = g.fry * 0.62;
    ctx.fillStyle = 'rgba(' + Math.round(150 + lit * 60) + ',' + Math.round(120 + lit * 55) + ',' + Math.round(80 + lit * 35) + ',1)';
    ctx.beginPath();
    ctx.moveTo(g.cx - pw * 0.42, g.cy - ph / 2); ctx.lineTo(g.cx + pw * 0.42, g.cy - ph / 2);
    ctx.lineTo(g.cx + pw * 0.58, g.cy + ph / 2); ctx.lineTo(g.cx - pw * 0.58, g.cy + ph / 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.3 + lit * 0.6) + ')'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(g.cx - pw * 0.6, g.cy - ph * 0.38); ctx.lineTo(g.cx + pw * 0.6, g.cy - ph * 0.38);
    ctx.moveTo(g.cx - pw * 0.75, g.cy + ph * 0.38); ctx.lineTo(g.cx + pw * 0.75, g.cy + ph * 0.38); ctx.stroke();
    ctx.restore();
    // boundary rope
    ctx.strokeStyle = 'rgba(242,101,34,' + (0.25 + lit * 0.55) + ')'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(g.cx, g.cy, g.frx * 0.97, g.fry * 0.97, 0, 0, 6.283); ctx.stroke();

    // floodlight towers
    for (var j = 0; j < 4; j++) {
      var tp = towerPos(j), L = towers[j];
      // pole
      ctx.strokeStyle = '#1a1c24'; ctx.lineWidth = Math.max(3, W * 0.004);
      ctx.beginPath(); ctx.moveTo(tp.x, tp.y + 18); ctx.lineTo(tp.x + (g.cx - tp.x) * 0.05, g.cy - g.ory * 0.72); ctx.stroke();
      if (L > 0.01) {
        // light cone
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        var cone = ctx.createLinearGradient(tp.x, tp.y, g.cx, g.cy);
        cone.addColorStop(0, 'rgba(255,236,205,' + 0.2 * L + ')'); cone.addColorStop(1, 'rgba(255,236,205,0)');
        ctx.fillStyle = cone;
        ctx.beginPath(); ctx.moveTo(tp.x - 14, tp.y); ctx.lineTo(tp.x + 14, tp.y);
        ctx.lineTo(g.cx + (tp.x < g.cx ? g.frx * 0.25 : g.frx * 0.75) * (tp.x < g.cx ? 1 : 0.4), g.cy + g.fry * 0.6);
        ctx.lineTo(g.cx - (tp.x < g.cx ? g.frx * 0.75 : -g.frx * 0.1), g.cy + g.fry * 0.2); ctx.closePath(); ctx.fill();
        // glow
        var glow = ctx.createRadialGradient(tp.x, tp.y, 2, tp.x, tp.y, W * 0.16);
        glow.addColorStop(0, 'rgba(255,244,220,' + 0.75 * L + ')'); glow.addColorStop(0.2, 'rgba(255,214,160,' + 0.25 * L + ')'); glow.addColorStop(1, 'rgba(255,200,140,0)');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(tp.x, tp.y, W * 0.16, 0, 6.283); ctx.fill();
        ctx.restore();
      }
      // lamp panel
      var cw = Math.max(5, W * 0.006), gap = 2, cols = 4, rows = 3;
      var px = tp.x - (cols * (cw + gap)) / 2, py = tp.y - (rows * (cw + gap)) / 2;
      ctx.fillStyle = '#0e0f14'; ctx.fillRect(px - 3, py - 3, cols * (cw + gap) + 4, rows * (cw + gap) + 4);
      for (var r = 0; r < rows; r++) for (var c2 = 0; c2 < cols; c2++) {
        var on = L > (r * cols + c2) / (rows * cols) * 0.9;
        ctx.fillStyle = on ? 'rgba(255,248,232,' + (0.6 + 0.4 * L) + ')' : '#24262e';
        ctx.fillRect(px + c2 * (cw + gap), py + r * (cw + gap), cw, cw);
      }
    }
  }

  function lightsSequence() {
    if (reduce) { towers = [1, 1, 1, 1]; towerTarget = [1, 1, 1, 1]; screenEl.classList.add('on'); return; }
    [0, 3, 1, 2].forEach(function (i, n) { setTimeout(function () { towerTarget[i] = 1; }, 500 + n * 420); });
    setTimeout(function () { screenEl.classList.add('on'); }, 2300);
  }

  var lines = ['FAN MARKETING · HYDERABAD', '3 TEAMS · 1 ORANGE ARMY', 'TEAM SHEET COMING UP'];
  function tick(now) {
    for (var i = 0; i < 4; i++) {
      var d = towerTarget[i] - towers[i];
      // flicker while switching on
      towers[i] += d * 0.08 + (d > 0.02 ? (Math.random() - 0.5) * 0.12 : 0);
      towers[i] = clamp(towers[i], 0, 1);
    }
    var p = sectionProgress(uppal);
    var z = reduce ? 1 : 1 + p * 0.9;
    canvas.style.transform = 'scale(' + z + ') translateY(' + (p * 6) + '%)';
    heroCopy.style.opacity = String(clamp(1 - p * 3, 0, 1));
    heroCopy.style.transform = 'translateY(' + (-p * 80) + 'px)';
    stats.classList.toggle('on', p > 0.28);
    var li = p < 0.33 ? 0 : (p < 0.66 ? 1 : 2);
    if (screenLine.textContent !== lines[li]) screenLine.textContent = lines[li];
    draw(now);
    requestAnimationFrame(tick);
  }

  // =========================================================
  // 2. KIT CHANGE
  // =========================================================
  var KITS = [
    { kit: 'Formal shirt', photo: 'The researcher look', color: '#3B4A63', detail: 'shirt',
      kicker: 'Chapter 1 · The researcher', title: 'Market research, 55+ reports deep.',
      text: '2.5 years at The Business Research Company, turning markets into reports people paid for. It taught me to find the number that matters.',
      nums: [['55+', 'market research reports'], ['₹1.9 Cr+', 'in report sales']] },
    { kit: 'MU blazer', photo: 'The student look', color: '#15171C', detail: 'blazer',
      kicker: 'Chapter 2 · The student', title: 'Back to school, for sport.',
      text: "Founding cohort of the PGP in Sports Management & Gaming at Masters' Union. Picked for the SMG Club Core Committee.",
      nums: [['1 of 8', 'Core Committee, picked from ~500 students'], ['Top 5', 'of 93 teams, goSTOPS challenge']] },
    { kit: 'Event crew tee', photo: 'The organiser look', color: '#E8E4DC', detail: 'tee',
      kicker: 'Chapter 3 · The organiser', title: 'On the ground, with the crowd.',
      text: 'Two days of on-ground execution at HYROX Delhi, and an IPL auction draft I ran for the SMG Club.',
      nums: [['1,000+', 'attendees at HYROX Delhi'], ['60', 'participants across 10 teams']] },
    { kit: 'Gaming jersey', photo: 'The gamer look', color: '#5B2BB5', detail: 'jersey',
      kicker: 'Chapter 4 · The gamer', title: 'Communities that play together.',
      text: 'Esports tournaments with TITANS IBS, where I learned that a community is built one match night at a time.',
      nums: [['10+', 'esports tournaments coordinated'], ['250+', 'participants']] },
    { kit: 'SRH jersey', photo: 'The Riser look', color: '#F26522', detail: 'srh',
      kicker: 'Chapter 5 · The Riser', title: 'The one I want to wear.',
      text: 'Hyderabad-raised and Orange Army through and through. I want to help the Sunrisers keep their fans all year, across all three teams.',
      nums: [['3', 'teams'], ['1', 'Orange Army']] }
  ];

  function figure(k) {
    var body = k.color, trim = k.detail === 'srh' ? '#08090B' : (k.detail === 'tee' ? '#F26522' : '#F26522');
    var extra = '';
    if (k.detail === 'blazer') extra = '<path d="M150 210 L190 330 L230 210" fill="#F5F2EE"/><path d="M190 330 L150 210 L120 240 L170 360Z M190 330 L230 210 L260 240 L210 360Z" fill="#0c0d11"/>';
    if (k.detail === 'shirt') extra = '<path d="M165 205 L190 240 L215 205" fill="none" stroke="#dfe6f0" stroke-width="5"/><line x1="190" y1="240" x2="190" y2="400" stroke="#2c3850" stroke-width="3"/>';
    if (k.detail === 'tee') extra = '<text x="190" y="300" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="34" fill="#F26522">CREW</text>';
    if (k.detail === 'jersey') extra = '<path d="M95 260 L285 300 L285 318 L95 278Z" fill="#F26522"/><text x="190" y="350" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="44" fill="#fff">TITANS</text>';
    if (k.detail === 'srh') extra = '<path d="M95 300 L285 300 L285 318 L95 318Z" fill="#08090B"/><text x="190" y="290" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="40" fill="#08090B">RISER</text>';
    return '<svg viewBox="0 0 380 440" aria-hidden="true">' +
      '<circle cx="190" cy="120" r="64" fill="#2a2c33"/>' +
      '<path d="M40 440 C 40 300, 90 205, 190 200 C 290 205, 340 300, 340 440Z" fill="' + body + '"/>' +
      '<path d="M160 196 Q190 226 220 196" fill="none" stroke="' + trim + '" stroke-width="6"/>' + extra + '</svg>';
  }

  var frame = document.getElementById('frame');
  var chaptersEl = document.getElementById('chapters');
  var dotsEl = document.getElementById('dots');
  KITS.forEach(function (k, i) {
    var look = document.createElement('div');
    look.className = 'look' + (i === 0 ? ' on' : '');
    look.style.background = 'linear-gradient(160deg,' + (k.detail === 'srh' ? '#2a1307' : '#16181f') + ', #08090B)';
    look.innerHTML = figure(k) + '<span class="ph">Photo coming: ' + k.kit + '</span><span class="tag">' + k.photo.toUpperCase() + '</span>';
    frame.appendChild(look);
    var ch = document.createElement('article');
    ch.className = 'chapter' + (i === 0 ? ' on' : '');
    ch.innerHTML = '<p class="mono" style="color:var(--orange);margin:0">' + k.kicker + '</p><h2 class="display">' + k.title + '</h2><p>' + k.text + '</p><div class="num">' +
      k.nums.map(function (n) { return '<div><b>' + n[0] + '</b><span>' + n[1] + '</span></div>'; }).join('') + '</div>';
    chaptersEl.appendChild(ch);
    dotsEl.appendChild(document.createElement('i'));
  });
  var kit = document.getElementById('kit');
  var looks = frame.children, chapters = chaptersEl.children, dots = dotsEl.children, current = -1;
  function updateKit() {
    var p = sectionProgress(kit);
    var idx = clamp(Math.floor(p * KITS.length), 0, KITS.length - 1);
    if (idx === current) return;
    current = idx;
    for (var i = 0; i < KITS.length; i++) {
      looks[i].classList.toggle('on', i === idx);
      looks[i].classList.toggle('past', i < idx);
      looks[i].style.zIndex = String(i);
      chapters[i].classList.toggle('on', i === idx);
      dots[i].classList.toggle('on', i === idx);
    }
  }

  // =========================================================
  // 3. DRESSING ROOM
  // =========================================================
  var SVG = {
    laptop: '<svg viewBox="0 0 200 130"><rect x="32" y="2" width="136" height="90" rx="6" fill="#1b1d24" stroke="#3a3d47" stroke-width="3"/><rect x="40" y="10" width="120" height="74" rx="2" fill="#0b1626"/><rect x="52" y="58" width="12" height="18" fill="#F26522"/><rect x="70" y="46" width="12" height="30" fill="#F26522"/><rect x="88" y="36" width="12" height="40" fill="#FF8A4C"/><rect x="106" y="26" width="12" height="50" fill="#F26522"/><rect x="124" y="18" width="12" height="58" fill="#FFB27F"/><path d="M8 96 H192 L200 112 H0Z" fill="#a4a9b3"/><rect x="0" y="112" width="200" height="6" rx="3" fill="#6b707a"/></svg>',
    notebook: '<svg viewBox="0 0 150 100"><path d="M14 30 L124 18 L140 80 L28 94Z" fill="#e9e1d3"/><path d="M10 26 L120 14 L136 76 L24 90Z" fill="#1f2a44"/><path d="M98 17 L114 73" stroke="#F26522" stroke-width="6"/><rect x="34" y="40" width="50" height="18" rx="2" transform="rotate(-6 59 49)" fill="#F5F2EE"/><text x="59" y="54" text-anchor="middle" transform="rotate(-6 59 49)" font-family="Anton,Impact,sans-serif" font-size="12" fill="#1f2a44">CASES</text></svg>',
    ball: '<svg viewBox="0 0 80 80"><defs><radialGradient id="bg1" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#e0473c"/><stop offset="1" stop-color="#6e110c"/></radialGradient></defs><circle cx="40" cy="40" r="36" fill="url(#bg1)"/><path d="M14 18 C 34 34, 46 46, 66 62" stroke="#f3e9df" stroke-width="2.5" fill="none"/><path d="M18 14 C 38 30, 50 42, 70 58" stroke="#f3e9df" stroke-width="2.5" fill="none" stroke-dasharray="3 4"/><path d="M10 22 C 30 38, 42 50, 62 66" stroke="#f3e9df" stroke-width="2.5" fill="none" stroke-dasharray="3 4"/></svg>',
    jersey: '<svg viewBox="0 0 170 90"><path d="M8 60 L162 60 L162 84 L8 84Z" fill="#163a9c"/><path d="M14 40 L156 40 L162 62 L8 62Z" fill="#1d4ed8"/><path d="M20 22 L150 22 L156 42 L14 42Z" fill="#2b5cf0"/><path d="M70 22 L85 36 L100 22" fill="none" stroke="#F26522" stroke-width="4"/><text x="85" y="78" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="14" fill="#fff" opacity=".8">INDIA</text></svg>',
    glass: '<svg viewBox="0 0 120 100"><rect x="68" y="58" width="44" height="14" rx="7" transform="rotate(35 68 58)" fill="#6b3a1d"/><circle cx="48" cy="44" r="32" fill="rgba(170,215,255,.22)" stroke="#cfd3da" stroke-width="8"/><path d="M30 30 Q40 22 52 24" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/></svg>',
    headset: '<svg viewBox="0 0 160 110"><path d="M22 70 C 22 18, 138 18, 138 70" fill="none" stroke="#2b2d35" stroke-width="12" stroke-linecap="round"/><path d="M22 70 C 22 18, 138 18, 138 70" fill="none" stroke="#F26522" stroke-width="3"/><rect x="6" y="58" width="34" height="46" rx="14" fill="#16171c"/><rect x="120" y="58" width="34" height="46" rx="14" fill="#16171c"/><rect x="12" y="66" width="22" height="30" rx="10" fill="#F26522"/><rect x="126" y="66" width="22" height="30" rx="10" fill="#F26522"/><path d="M26 98 Q40 108 58 104" stroke="#2b2d35" stroke-width="4" fill="none"/><circle cx="60" cy="104" r="5" fill="#2b2d35"/></svg>',
    hanging: '<svg viewBox="0 0 200 230"><path d="M100 4 a10 10 0 1 1 -8 16" fill="none" stroke="#c9ccd3" stroke-width="4"/><path d="M100 22 L30 62 H170Z" fill="none" stroke="#c9ccd3" stroke-width="4"/><path d="M58 52 L28 64 L6 120 L36 132 L46 106 L46 222 L154 222 L154 106 L164 132 L194 120 L172 64 L142 52 Q100 72 58 52Z" fill="#F26522"/><path d="M58 52 Q100 72 142 52" fill="none" stroke="#08090B" stroke-width="6"/><text x="100" y="118" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="26" fill="#08090B">ANUDEEP</text><path d="M46 222 H154" stroke="#08090B" stroke-width="6"/></svg>',
    paddle: '<svg viewBox="0 0 80 160"><rect x="34" y="70" width="12" height="86" rx="5" fill="#6b3a1d"/><circle cx="40" cy="42" r="36" fill="#F5F2EE" stroke="#08090B" stroke-width="3"/><text x="40" y="56" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="38" fill="#F26522">01</text></svg>'
  };

  var CASES = [
    { id: 'tbrc', obj: 'laptop', left: 5, bottom: 30, w: 17, label: 'Laptop · Market research',
      kicker: 'Work · The Business Research Company', title: 'Research that sold.',
      text: 'Two and a half years as an associate consultant, writing market research reports that brought in real sales.',
      nums: [['55+', 'reports written'], ['₹1.9 Cr+', 'in report sales']], role: 'My role: researched and wrote the reports.', link: '' },
    { id: 'gostops', obj: 'notebook', left: 24, bottom: 30, w: 13, label: 'Notebook · goSTOPS',
      kicker: 'Live challenge · Marketing strategy', title: 'Filling hostels in the off-season.',
      text: "An off-season plan to lift goSTOPS' July–September occupancy, built in one day for a live challenge. We finished in the top 5 of 93 teams.",
      nums: [['Top 5', 'of 93 teams'], ['27.5% → 43.8%', 'projected occupancy'], ['₹300 → ₹559', 'revenue per bed']], role: 'My role: presented the team’s strategy to the judges (team of four).', link: 'docs/gostops-gtm.pdf' },
    { id: 'hyrox', obj: 'ball', left: 39, bottom: 31, w: 7, label: 'Cricket ball · On the ground',
      kicker: 'Events · SMG Club', title: 'Where the crowd is.',
      text: 'On-ground execution at HYROX Delhi across two days, as part of the Masters’ Union SMG Club.',
      nums: [['1,000+', 'attendees'], ['2', 'days on the ground']], role: 'My role: on-ground execution.', link: '' },
    { id: 'nivia', obj: 'jersey', left: 48, bottom: 30, w: 15, label: 'Jersey · NIVIA launch',
      kicker: 'Live industry challenge · NIVIA', title: 'Launching the India jersey.',
      text: 'A go-to-market plan for the Indian national team jersey: three fan segments, a sales model and a budget split across channels.',
      nums: [['₹50L', 'launch budget'], ['30K', 'jerseys, 90-day base case'], ['4', 'channels: performance, creators, tournaments, OOH']], role: 'My role: led the work end to end: research, segments, pricing, budget and sales model (team project).', link: '' },
    { id: 'pepperfry', obj: 'glass', left: 66, bottom: 31, w: 10, label: 'Magnifier · Pepperfry',
      kicker: 'Consumer behaviour · Pepperfry', title: 'What shoppers really feel.',
      text: 'An observational study of the Pepperfry buying experience, scored with a Furniture Experience Index we built.',
      nums: [['FEI', 'Furniture Experience Index, our scoring model']], role: 'My role: ran the mystery shopping and customer interviews, and built the index scoring.', link: 'docs/pepperfry-odc.pdf' },
    { id: 'esports', obj: 'headset', left: 79, bottom: 30, w: 13, label: 'Headset · Esports',
      kicker: 'Community · TITANS IBS', title: 'Match nights, every week.',
      text: 'Coordinating esports tournaments with TITANS IBS, from brackets to match-night community.',
      nums: [['10+', 'tournaments'], ['250+', 'participants']], role: 'My role: coordinated the tournaments.', link: '' },
    { id: 'about', obj: 'hanging', left: 43, top: 5, w: 13, label: 'My jersey · About me',
      kicker: 'About', title: 'Anudeep Gupta.',
      text: "Hyderabad-raised, Orange Army fan, founding-cohort student of Sports Management & Gaming at Masters' Union. I speak English, Telugu and Hindi, with some Tamil.",
      nums: [['1 of 8', 'SMG Club Core Committee'], ['4', 'languages']], role: 'Looking for: a fan-engagement and brand role across the Sunrisers teams.', link: 'resume.pdf', linkText: 'Open my resume' },
    { id: 'auction', obj: 'paddle', left: 74, top: 8, w: 6, label: 'Paddle · IPL auction draft',
      kicker: 'Events · SMG Club', title: 'I ran an IPL auction.',
      text: 'An IPL auction draft for the Masters’ Union SMG Club: real player cards, live bidding and franchise strategy.',
      nums: [['60', 'participants'], ['10', 'teams']], role: 'My role: ran the auction draft.', link: '' }
  ];

  var objects = document.getElementById('objects');
  var list = document.getElementById('caseList');
  CASES.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'obj';
    b.setAttribute('aria-label', c.label);
    b.style.left = c.left + '%';
    b.style.width = c.w + '%';
    if (c.top != null) b.style.top = c.top + '%'; else b.style.bottom = c.bottom + '%';
    b.innerHTML = (c.top != null ? SVG[c.obj] + '<span class="tip">' + c.label + '</span>' : '<span class="tip">' + c.label + '</span>' + SVG[c.obj]);
    b.addEventListener('click', function () { openCase(c); });
    objects.appendChild(b);
    var lb = document.createElement('button');
    lb.innerHTML = '<span class="mono" style="color:var(--orange)">' + c.kicker + '</span><b>' + c.title + '</b><span>' + c.nums[0][0] + ' ' + c.nums[0][1] + '</span>';
    lb.addEventListener('click', function () { openCase(c); });
    list.appendChild(lb);
  });
  var listBtn = document.getElementById('listBtn');
  listBtn.addEventListener('click', function () {
    var on = list.classList.toggle('on');
    listBtn.setAttribute('aria-expanded', String(on));
    listBtn.textContent = on ? 'Hide the list' : 'Show as a list';
  });

  var dlg = document.getElementById('caseDialog');
  function openCase(c) {
    document.getElementById('caseKicker').textContent = c.kicker;
    document.getElementById('caseTitle').textContent = c.title;
    document.getElementById('caseText').textContent = c.text;
    document.getElementById('caseNums').innerHTML = c.nums.map(function (n) { return '<div><b>' + n[0] + '</b><span>' + n[1] + '</span></div>'; }).join('');
    document.getElementById('caseRole').textContent = c.role;
    var a = document.getElementById('caseLink');
    if (c.link) { a.href = c.link; a.textContent = c.linkText || 'Open the deck'; a.style.display = ''; } else { a.style.display = 'none'; }
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  document.getElementById('caseClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  // =========================================================
  // CHATBOT
  // =========================================================
  var bot = document.getElementById('bot'), botBtn = document.getElementById('botBtn');
  var msgs = document.getElementById('botMsgs'), choices = document.getElementById('botChoices');
  var teaser = document.getElementById('botTeaser');
  function say(text, who, href, linkText) {
    var m = document.createElement('div');
    m.className = 'm ' + (who || 'b');
    m.textContent = text;
    if (href) { var a = document.createElement('a'); a.href = href; a.textContent = linkText; if (/^http/.test(href) || /\.pdf$/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; } m.appendChild(a); }
    msgs.appendChild(m); msgs.scrollTop = msgs.scrollHeight;
  }
  function socialsText() {
    var parts = ['LinkedIn'];
    if (INSTAGRAM_URL) parts.push('Instagram');
    if (X_URL) parts.push('X');
    return 'Find me on ' + parts.join(', ') + '.';
  }
  var REPLIES = [
    { label: 'Book a call', run: function () {
      if (CAL_URL) say('Pick any 15-minute slot that suits you.', 'b', CAL_URL, 'Open my calendar');
      else say('Send me a message on LinkedIn and I’ll set up a 15-minute call at your time.', 'b', LINKEDIN_URL, 'Message me on LinkedIn');
    } },
    { label: 'See my resume', run: function () { say('Here’s my one-page resume.', 'b', 'resume.pdf', 'Open the PDF'); } },
    { label: 'My socials', run: function () {
      say(socialsText(), 'b', LINKEDIN_URL, 'linkedin.com/in/itsanudeepgupta');
      if (INSTAGRAM_URL) say('Instagram', 'b', INSTAGRAM_URL, INSTAGRAM_URL.replace(/^https?:\/\//, ''));
      if (X_URL) say('X', 'b', X_URL, X_URL.replace(/^https?:\/\//, ''));
    } },
    { label: 'See my idea for SRH', run: function () { say('One Orange Army, three seasons: bringing Eastern Cape and Leeds home to Hyderabad.', 'b', '#idea', 'Jump to the idea'); } }
  ];
  REPLIES.forEach(function (r) {
    var b = document.createElement('button');
    b.textContent = r.label;
    b.addEventListener('click', function () { say(r.label, 'u'); setTimeout(r.run, 350); });
    choices.appendChild(b);
  });
  var greeted = false;
  function toggleBot(open) {
    var isOpen = open == null ? !bot.classList.contains('open') : open;
    bot.classList.toggle('open', isOpen);
    botBtn.setAttribute('aria-expanded', String(isOpen));
    teaser.classList.add('hide');
    if (isOpen && !greeted) {
      greeted = true;
      say('Hey Riser, nice to meet you! Like you, I’m a Riser too.');
      setTimeout(function () { say('What would you like to do?'); }, 500);
    }
  }
  botBtn.addEventListener('click', function () { toggleBot(); });
  document.getElementById('botClose').addEventListener('click', function () { toggleBot(false); });
  teaser.addEventListener('click', function () { toggleBot(true); });
  msgs.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (a && a.getAttribute('href') === '#idea') toggleBot(false);
  });

  // call link
  var callLink = document.getElementById('callLink');
  if (CAL_URL) { callLink.href = CAL_URL; callLink.target = '_blank'; }
  else { callLink.href = LINKEDIN_URL; callLink.target = '_blank'; callLink.rel = 'noopener'; callLink.textContent = 'Message me to book a call'; }

  // =========================================================
  // page progress + boot
  // =========================================================
  var bar = document.getElementById('progress');
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY > 200) teaser.classList.add('hide');
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    updateKit();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { resize(); onScroll(); });
  resize(); onScroll(); lightsSequence();
  requestAnimationFrame(tick);
})();
