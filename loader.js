/* ============================================================
   adsPartners · pantalla de carga (loader)
   - Mínimo 2.5s en pantalla
   - Termina cuando window.load + min se cumplen
   - Llamar window.AdsLoader.done() manualmente para forzar fin
   ============================================================ */
(function () {
  if (window.__adsLoaderInited) return;
  window.__adsLoaderInited = true;

  // ---------- config ----------
  var CFG = {
    minSeconds: 2.5,
    fakeProgressSeconds: 2.0,   // tiempo en el que la barra "fake" llega a 92%
    waveAmplitude: 60,
    waveSpeed: 3,
    msgs: [
      "estamos sirviéndotelo bonito",
      "merece la pena, hazme caso",
      "lo bueno se hace esperar"
    ]
  };

  // ---------- DOM ----------
  var ISO_PATH = "M2492.762,654.936h-310.143c182.176,20.658,317.38,96.95,317.38,187.913,0,106.823-186.483,193.428-416.52,193.428-2.202,0-4.393-.009-6.589-.031-.214.022-.429.031-.648.031h-625.889V470.303c0-6.503-6.343-11.773-14.164-11.773h-19.12c-7.827,0-14.17,5.27-14.17,11.773v565.974h-194.289c-.268,0-.536-.013-.798-.04-2.138.027-4.286.04-6.439.04-100.736,0-193.994-26.582-270.178-71.761v65.743c0,3.325-3.241,6.018-7.237,6.018h-208.748V470.303c0-6.503-6.343-11.773-14.164-11.773h-19.125c-7.822,0-14.164,5.27-14.164,11.773v565.974h-194.921c-.268,0-.536-.013-.798-.04-2.138.027-4.286.04-6.439.04C208.458,1036.277,0,863.075,0,649.425s208.458-386.852,465.597-386.852c2.154,0,4.302.013,6.439.04.262-.027.53-.04.798-.04h451.122c3.996,0,7.237,2.693,7.237,6.013v65.748c76.184-45.179,169.442-71.761,270.178-71.761V6.018c0-3.325,3.241-6.018,7.238-6.018h451.117c4.002,0,7.243,2.693,7.243,6.018v649.421c0-3.321,3.236-6.013,7.238-6.013h310.829c-182.514-20.836-318.066-98.299-318.066-190.668,0-108.345,186.478-196.183,416.509-196.183,2.202,0,4.393.009,6.589.031.214-.022.429-.031.648-.031h402.045c3.996,0,7.238,2.693,7.238,6.013v380.335c0,3.325-3.241,6.013-7.238,6.013Z";

  var html =
    '<div class="adsl-counter">' +
      '<span class="adsl-dot" aria-hidden="true"></span>' +
      '<span class="adsl-num"><span id="adsl-num">0</span><span class="adsl-pct">%</span></span>' +
      '<span class="adsl-label">cargando</span>' +
    '</div>' +
    '<div class="adsl-logo">' +
      '<svg viewBox="0 0 2500 1036.277" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
        '<defs><clipPath id="adslClip"><path d="' + ISO_PATH + '"/></clipPath></defs>' +
        '<path class="adsl-glass-bg" d="' + ISO_PATH + '"/>' +
        '<g clip-path="url(#adslClip)">' +
          '<path id="adsl-waterBack" class="adsl-water" d=""/>' +
          '<path id="adsl-waterFront" class="adsl-water-front" d=""/>' +
          '<circle class="adsl-bubble"    cx="600"  cy="900" r="9"/>' +
          '<circle class="adsl-bubble b2" cx="1100" cy="930" r="6"/>' +
          '<circle class="adsl-bubble b3" cx="1700" cy="900" r="11"/>' +
          '<circle class="adsl-bubble b4" cx="2050" cy="940" r="5"/>' +
          '<circle class="adsl-bubble b2" cx="380"  cy="950" r="7"/>' +
        '</g>' +
        '<path class="adsl-glass" d="' + ISO_PATH + '"/>' +
      '</svg>' +
    '</div>' +
    '<div class="adsl-msgs"><div class="adsl-line" id="adsl-line"></div></div>';

  var root = document.getElementById("ads-loader");
  if (!root) {
    root = document.createElement("div");
    root.id = "ads-loader";
    document.body.appendChild(root);
  }
  root.innerHTML = html;

  var numEl   = root.querySelector("#adsl-num");
  var lineEl  = root.querySelector("#adsl-line");
  var back    = root.querySelector("#adsl-waterBack");
  var front   = root.querySelector("#adsl-waterFront");

  // ---------- estado ----------
  var started = performance.now();
  var progress = 0;
  var realDone = false;
  var finishAt = 0;
  var killed   = false;

  // ---------- agua ----------
  var VB_W = 2500, VB_H = 1036.277, PAD_X = 200, SEG = 60;
  var wavePhase = 0;

  function wavePath(p, phase, ampMul){
    var amp = CFG.waveAmplitude * ampMul;
    var lvl = (1 - p) * (VB_H + amp*2) - amp;
    var d = "M " + (-PAD_X) + " " + (VB_H + 50) + " ";
    d    += "L " + (-PAD_X) + " " + lvl + " ";
    var totalW = VB_W + PAD_X*2;
    for (var i = 0; i <= SEG; i++){
      var x = -PAD_X + (totalW * i / SEG);
      var t = (i / SEG) * Math.PI * 4 + phase;
      var y = lvl + Math.sin(t) * amp + Math.sin(t*0.5 + 1.3) * (amp*0.4);
      d += "L " + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    d += "L " + (VB_W + PAD_X) + " " + (VB_H + 50) + " Z";
    return d;
  }
  function drawWater(p){
    back.setAttribute("d",  wavePath(p, wavePhase,       1.0));
    front.setAttribute("d", wavePath(p, wavePhase + 1.7, 0.7));
  }

  function setProgress(p){
    progress = Math.max(0, Math.min(1, p));
    numEl.textContent = Math.floor(progress * 100);
    drawWater(progress);
  }

  var lastT = performance.now();
  function tickWave(now){
    var dt = (now - lastT)/1000; lastT = now;
    wavePhase += dt * 1.6 * CFG.waveSpeed;
    drawWater(progress);
    if (!killed) requestAnimationFrame(tickWave);
  }
  requestAnimationFrame(tickWave);

  // ---------- progreso ----------
  function loop(now){
    var elapsed = (now - started)/1000;
    var minS  = CFG.minSeconds;
    var fakeS = Math.min(CFG.fakeProgressSeconds, minS - 0.2);

    // curva inversa-exponencial: lento al principio, rápido al final
    var k = Math.min(1, elapsed / fakeS);
    var eased = Math.pow(k, 2.6);
    var p = eased * 0.92;

    var minOk = elapsed >= minS;
    if (realDone && minOk){
      var left = (now - finishAt)/450;
      p = 0.92 + Math.min(1, Math.max(0, left)) * 0.08;
      if (left >= 1){
        setProgress(1);
        bye();
        return;
      }
    } else if (realDone){
      p = Math.min(p, 0.92);
    } else if (p > 0.92){
      p = 0.92;
    }

    setProgress(p);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function markRealDone(){
    if (realDone) return;
    realDone = true;
    finishAt = performance.now();
  }

  // ---------- mensajes ----------
  var msgIdx = 0;
  function nextMsg(){
    if (!CFG.msgs || !CFG.msgs.length) return;
    var text = CFG.msgs[msgIdx % CFG.msgs.length];
    msgIdx++;
    var old = lineEl.querySelector("span.show");
    if (old){
      old.classList.remove("show");
      old.classList.add("out");
      setTimeout(function(){ if (old.parentNode) old.parentNode.removeChild(old); }, 700);
    }
    var sp = document.createElement("span");
    sp.textContent = text;
    lineEl.appendChild(sp);
    requestAnimationFrame(function(){ sp.classList.add("show"); });
  }
  nextMsg();
  var msgInterval = setInterval(nextMsg, 2200);

  // ---------- salida ----------
  function bye(){
    if (killed) return;
    killed = true;
    clearInterval(msgInterval);
    root.classList.add("adsl-bye");
    setTimeout(function(){
      if (root.parentNode) root.parentNode.removeChild(root);
    }, 800);
  }

  // ---------- enganche con la carga real ----------
  if (document.readyState === "complete") {
    markRealDone();
  } else {
    window.addEventListener("load", markRealDone, { once: true });
    // failsafe por si algo falla y "load" no llega
    setTimeout(markRealDone, 12000);
  }

  // API pública
  window.AdsLoader = {
    done: markRealDone,
    forceClose: bye,
    config: CFG
  };
})();
