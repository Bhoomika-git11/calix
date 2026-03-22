/* ═══════════════════════════════════════════════════
   CALIX Scientific Calculator — calix.js
   ─ DevTools / inspect protection
   ─ Door animation
   ─ Full scientific calculator logic
   ═══════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════
   1.  PROTECTION
   ══════════════════════════════════════ */
(function protect() {

  /* Disable right-click */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault(); return false;
  });

  /* Block DevTools shortcuts */
  document.addEventListener('keydown', function (e) {
    var ctrl  = e.ctrlKey || e.metaKey;
    var shift = e.shiftKey;
    var k     = e.key;

    if (k === 'F12')                           { e.preventDefault(); return false; }
    if (ctrl && k.toLowerCase() === 'u')       { e.preventDefault(); return false; }
    if (ctrl && k.toLowerCase() === 's')       { e.preventDefault(); return false; }
    if (ctrl && shift && k.toLowerCase()==='i'){ e.preventDefault(); return false; }
    if (ctrl && shift && k.toLowerCase()==='j'){ e.preventDefault(); return false; }
    if (ctrl && shift && k.toLowerCase()==='c'){ e.preventDefault(); return false; }
    if (ctrl && shift && k.toLowerCase()==='k'){ e.preventDefault(); return false; }
  });

  /* DevTools window-size detection */
  var devOpen = false;
  function checkDev() {
    var w = window.outerWidth  - window.innerWidth;
    var h = window.outerHeight - window.innerHeight;
    if (w > 160 || h > 160) {
      if (!devOpen) {
        devOpen = true;
        document.body.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;' +
          'height:100vh;font-family:JetBrains Mono,monospace;font-size:20px;' +
          'color:#a855f7;background:#07050f;letter-spacing:3px;">' +
          '⛔ &nbsp; DevTools Detected</div>';
      }
    } else {
      devOpen = false;
    }
  }
  setInterval(checkDev, 800);

  /* Disable selection & drag */
  document.addEventListener('selectstart', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart',   function (e) { e.preventDefault(); });

})();


/* ══════════════════════════════════════
   2.  DOOR
   ══════════════════════════════════════ */
(function initDoor() {

  var doorScene = document.getElementById('doorScene');
  var door      = document.getElementById('door');
  var calcWrap  = document.getElementById('calcWrap');
  var closeBtn  = document.getElementById('closeBtn');
  var kr        = document.getElementById('kr');
  var opening   = false;

  function knockFX() {
    kr.classList.remove('burst');
    void kr.offsetWidth;
    kr.classList.add('burst');
  }

  function openDoor() {
    if (opening) return;
    opening = true;
    door.classList.add('open');
    setTimeout(function () {
      doorScene.classList.add('gone');
      calcWrap.classList.remove('hidden');
      opening = false;
    }, 900);
  }

  document.getElementById('doorFrame').addEventListener('click', function () {
    knockFX();
    setTimeout(openDoor, 180);
  });

  closeBtn.addEventListener('click', function () {
    calcWrap.classList.add('hidden');
    door.classList.remove('open');
    setTimeout(function () {
      doorScene.classList.remove('gone');
    }, 100);
  });

})();


/* ══════════════════════════════════════
   3.  CALCULATOR
   ══════════════════════════════════════ */
(function initCalc() {

  var screenEl = document.getElementById('screen');
  var histEl   = document.getElementById('hist');
  var prevEl   = document.getElementById('prev');
  var dispEl   = document.getElementById('dispEl');
  var sciPanel = document.getElementById('sciPanel');
  var btnBasic = document.getElementById('btnBasic');
  var btnSci   = document.getElementById('btnSci');
  var btnDeg   = document.getElementById('btnDeg');
  var btnRad   = document.getElementById('btnRad');

  var expr   = '';
  var fresh  = false;
  var useDeg = true;

  /* BASIC / SCI */
  btnSci.addEventListener('click', function () {
    btnSci.classList.add('active');
    btnBasic.classList.remove('active');
    sciPanel.classList.remove('collapsed');
  });
  btnBasic.addEventListener('click', function () {
    btnBasic.classList.add('active');
    btnSci.classList.remove('active');
    sciPanel.classList.add('collapsed');
  });

  /* DEG / RAD */
  btnDeg.addEventListener('click', function () {
    useDeg = true;
    btnDeg.classList.add('active');
    btnRad.classList.remove('active');
  });
  btnRad.addEventListener('click', function () {
    useDeg = false;
    btnRad.classList.add('active');
    btnDeg.classList.remove('active');
  });

  /* Evaluator */
  function calcExpr(str) {
    var s = str
      .replace(/÷/g,  '/')
      .replace(/×/g,  '*')
      .replace(/−/g,  '-')
      .replace(/\^/g, '**')
      .replace(/sin\(/g,  '__s(')
      .replace(/cos\(/g,  '__c(')
      .replace(/tan\(/g,  '__t(')
      .replace(/log\(/g,  'Math.log10(')
      .replace(/ln\(/g,   'Math.log(')
      .replace(/√\(/g,    'Math.sqrt(')
      .replace(/π/g,      'Math.PI')
      .replace(/ℯ/g,      'Math.E')
      .replace(/⌊\(/g,    'Math.floor(')
      .replace(/⌈\(/g,    'Math.ceil(');

    var dc = useDeg ? '(v*Math.PI/180)' : 'v';
    var h =
      'function __s(v){return Math.sin('  + dc + ');}' +
      'function __c(v){return Math.cos('  + dc + ');}' +
      'function __t(v){return Math.tan('  + dc + ');}' +
      'function factorial(n){' +
        'n=Math.round(n);if(n<0)return NaN;if(n===0)return 1;' +
        'var r=1;for(var i=2;i<=n;i++)r*=i;return r;}';

    return Function('"use strict";' + h + 'return (' + s + ')')(); // eslint-disable-line
  }

  /* Screen */
  function setScreen(v) {
    var val = v || '0';
    screenEl.textContent = val;
    var l = val.length;
    screenEl.style.fontSize =
      l > 18 ? '16px' :
      l > 14 ? '22px' :
      l > 10 ? '28px' :
      l >  7 ? '36px' : '44px';
  }

  /* Preview */
  function livePreview() {
    if (!expr) { prevEl.innerHTML = '&nbsp;'; return; }
    try {
      var r = calcExpr(expr);
      if (isFinite(r) && r.toString() !== expr)
        prevEl.textContent = '≈ ' + parseFloat(r.toFixed(10));
      else
        prevEl.innerHTML = '&nbsp;';
    } catch (e) { prevEl.innerHTML = '&nbsp;'; }
  }

  function pop() {
    screenEl.classList.remove('pop');
    void screenEl.offsetWidth;
    screenEl.classList.add('pop');
  }
  function showError() {
    screenEl.classList.add('shake');
    dispEl.classList.add('flash');
    screenEl.addEventListener('animationend', function () { screenEl.classList.remove('shake'); }, { once:true });
    dispEl.addEventListener('animationend',   function () { dispEl.classList.remove('flash');   }, { once:true });
  }

  /* Ripple */
  function ripple(btn, e) {
    var r  = document.createElement('span');
    r.className = 'rpl';
    var rc = btn.getBoundingClientRect();
    var sz = Math.max(rc.width, rc.height);
    var cx = (e && e.clientX != null) ? e.clientX : rc.left + rc.width  / 2;
    var cy = (e && e.clientY != null) ? e.clientY : rc.top  + rc.height / 2;
    r.style.cssText =
      'width:'  + sz + 'px;height:' + sz + 'px;' +
      'left:'   + (cx - rc.left - sz / 2) + 'px;' +
      'top:'    + (cy - rc.top  - sz / 2) + 'px;';
    btn.appendChild(r);
    r.addEventListener('animationend', function () { r.remove(); });
  }

  /* Action handler */
  function handle(action, e, btn) {
    if (btn && e) ripple(btn, e);

    if (action === 'ac') {
      expr = ''; fresh = false;
      setScreen(''); prevEl.innerHTML = '&nbsp;'; histEl.innerHTML = '&nbsp;';
      return;
    }

    if (action === 'del') {
      if (fresh) { expr = ''; fresh = false; setScreen(''); return; }
      expr = expr.slice(0, -1);
      setScreen(expr); livePreview(); return;
    }

    if (action === '=') {
      if (!expr) return;
      try {
        var r = calcExpr(expr);
        if (!isFinite(r)) throw new Error();
        histEl.textContent = expr + ' =';
        var d = parseFloat(r.toFixed(10)).toString();
        expr = d; fresh = true; setScreen(d); prevEl.innerHTML = '&nbsp;'; pop();
      } catch (e2) {
        showError(); prevEl.textContent = 'ERROR';
        expr = ''; fresh = false; setScreen('');
      }
      return;
    }

    if (action === 'pct') {
      if (!expr) return;
      try {
        var rv = calcExpr(expr);
        var dv = parseFloat((rv / 100).toFixed(10)).toString();
        expr = dv; fresh = true; setScreen(dv); pop();
      } catch (e3) { showError(); }
      return;
    }

    var unary = {
      pow2:  function(v) { return v * v; },
      pow3:  function(v) { return v * v * v; },
      inv:   function(v) { return 1 / v; },
      abs:   function(v) { return Math.abs(v); },
      floor: function(v) { return Math.floor(v); },
      ceil:  function(v) { return Math.ceil(v); },
      fact:  function(v) {
        var n = Math.round(v), res = 1;
        if (n < 0) return NaN;
        for (var i = 2; i <= n; i++) res *= i;
        return res;
      }
    };
    if (unary[action]) {
      if (!expr) return;
      try {
        var uv = calcExpr(expr);
        var ur = unary[action](uv);
        if (!isFinite(ur)) throw new Error();
        histEl.textContent = action + '(' + expr + ') =';
        var ud = parseFloat(ur.toFixed(10)).toString();
        expr = ud; fresh = true; setScreen(ud); prevEl.innerHTML = '&nbsp;'; pop();
      } catch (e4) { showError(); }
      return;
    }

    var prefix = { sin:'sin(', cos:'cos(', tan:'tan(', log:'log(', ln:'ln(', sqrt:'√(' };
    if (prefix[action]) {
      if (fresh) { expr = ''; fresh = false; }
      expr += prefix[action]; setScreen(expr); livePreview(); return;
    }

    if (action === 'powN') {
      var ops = ['÷','×','−','+','^'];
      if (expr && ops.indexOf(expr.slice(-1)) === -1) expr += '^';
      fresh = false; setScreen(expr); return;
    }

    if (action === 'pi')    { if (fresh){expr='';fresh=false;} expr += 'π'; setScreen(expr); livePreview(); return; }
    if (action === 'euler') { if (fresh){expr='';fresh=false;} expr += 'ℯ'; setScreen(expr); livePreview(); return; }
    if (action === 'open')  { expr += '('; setScreen(expr); return; }
    if (action === 'close') { expr += ')'; setScreen(expr); livePreview(); return; }

    var isOp = ['÷','×','−','+','^'].indexOf(action) !== -1;
    if (fresh && !isOp) { expr = ''; fresh = false; }
    fresh = false;

    if (action === '.') {
      var seg = expr.split(/[÷×−+^(]/).pop();
      if (seg.indexOf('.') !== -1) return;
    }

    expr += action;
    setScreen(expr);
    livePreview();
  }

  /* Bind buttons */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) { handle(btn.dataset.a, e, btn); });
  });

  /* Keyboard */
  var keyMap = {
    'Enter':'=', 'Backspace':'del', 'Escape':'ac',
    '*':'×', '/':'÷', '-':'−',
    's':'sin', 'c':'cos', 't':'tan', 'l':'log', 'r':'sqrt', 'p':'pi'
  };
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey) return;
    var cw = document.getElementById('calcWrap');
    if (cw.classList.contains('hidden')) return;
    var mapped = keyMap[e.key] || e.key;
    var ok = /^[0-9+.()^]$/.test(mapped) || !!keyMap[e.key] || mapped === 'del' || mapped === 'ac';
    if (ok) { e.preventDefault(); handle(mapped, null, null); }
  });

})();
