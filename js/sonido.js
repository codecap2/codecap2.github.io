/* Olimpo · sonidos hechos con código (Web Audio), sin archivos de nadie, buscando que suenen reales:
   ruido café para viento, mar y truenos; cuerdas pulsadas de verdad (Karplus-Strong) para la lira y el arpa;
   campanas y metales con armónicos inarmónicos, como los reales. Empieza apagado (botón 🔇/🔊). */
(function () {
  var S = window.Sonido = { on: false };
  var ctx, blanco, cafe, maestro, reverb, amb = [], tGrillos, tRafaga, cuerdas = {};

  // En celulares todo es más ligero: ecos más cortos y menos chasquidos, para que el audio no truene
  var LIGERO = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4 || /iPhone|iPad|Android/i.test(navigator.userAgent);
  function iniciar() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      maestro = ctx.createGain(); maestro.gain.value = .62; maestro.connect(ctx.destination);
      var n = ctx.sampleRate * 3;
      blanco = ctx.createBuffer(1, n, ctx.sampleRate); cafe = ctx.createBuffer(1, n, ctx.sampleRate);
      var b = blanco.getChannelData(0), c = cafe.getChannelData(0), ult = 0;
      for (var i = 0; i < n; i++) { b[i] = Math.random() * 2 - 1; ult = (ult + .02 * b[i]) / 1.02; c[i] = ult * 3.5; }
      // Eco de templo: una reverberación suave para que todo suene en un lugar, no "dentro de la compu"
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}   // iPhone: que suene aunque esté en silencio el timbre
      var largo = Math.floor(ctx.sampleRate * (LIGERO ? 1.2 : 2.2)), ir = ctx.createBuffer(2, largo, ctx.sampleRate);
      for (var k = 0; k < 2; k++) { var d = ir.getChannelData(k); for (var j = 0; j < largo; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / largo, 3); }
      reverb = ctx.createConvolver(); reverb.buffer = ir;
      var rg = ctx.createGain(); rg.gain.value = .22; reverb.connect(rg); rg.connect(maestro);
      // Eco del cielo para el trueno: una sala enorme (5 s) + rebotes que se van apagando, como entre montañas
      var largoG = Math.floor(ctx.sampleRate * (LIGERO ? 2.5 : 5)), irG = ctx.createBuffer(2, largoG, ctx.sampleRate);
      for (var k2 = 0; k2 < 2; k2++) { var dG = irG.getChannelData(k2); for (var j2 = 0; j2 < largoG; j2++) dG[j2] = (Math.random() * 2 - 1) * Math.pow(1 - j2 / largoG, 2.2); }
      cielo = ctx.createConvolver(); cielo.buffer = irG;
      var cg = ctx.createGain(); cg.gain.value = .55; cielo.connect(cg); cg.connect(maestro);
      rebote = ctx.createDelay(2); rebote.delayTime.value = .55;
      var vuelta = ctx.createGain(), apaga = ctx.createBiquadFilter(); vuelta.gain.value = .42; apaga.type = 'lowpass'; apaga.frequency.value = 700;
      rebote.connect(apaga); apaga.connect(vuelta); vuelta.connect(rebote);
      var rsal = ctx.createGain(); rsal.gain.value = .5; apaga.connect(rsal); rsal.connect(maestro); rsal.connect(cielo);
      return true;
    } catch (e) { return false; }
  }
  var cielo, rebote, enElCielo = false;
  function salida(g, eco) { g.connect(maestro); if (eco !== false) g.connect(reverb); if (enElCielo) { g.connect(cielo); g.connect(rebote); } }
  function env(g, t, ataque, vol, dura) {
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(vol, .0002), t + ataque);
    g.gain.exponentialRampToValueAtTime(.0001, t + dura);
  }
  function tono(f, tipo, vol, dura, retraso, desliza, ataque, eco) {
    var t = ctx.currentTime + (retraso || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo || 'sine'; o.frequency.setValueAtTime(f, t);
    if (desliza) o.frequency.exponentialRampToValueAtTime(desliza, t + dura);
    env(g, t, ataque || .01, vol, dura); o.connect(g); salida(g, eco); o.start(t); o.stop(t + dura + .05);
  }
  function soplo(tipoFiltro, f1, f2, vol, dura, retraso, q, ataque, buffer, eco) {
    var t = ctx.currentTime + (retraso || 0), s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buffer || cafe; s.loop = true; s.loopStart = Math.random(); fl.type = tipoFiltro; fl.Q.value = q || .8;
    fl.frequency.setValueAtTime(f1, t); fl.frequency.exponentialRampToValueAtTime(f2, t + dura * .6);
    env(g, t, ataque || dura * .15, vol, dura); s.connect(fl); fl.connect(g); salida(g, eco); s.start(t, Math.random() * 2); s.stop(t + dura + .05);
  }
  function siseo(f1, f2, vol, dura, retraso, q, ataque) { soplo('bandpass', f1, f2, vol, dura, retraso, q, ataque, blanco); }
  // Metal real: armónicos que no son múltiplos exactos, con un golpe de ruido al inicio
  function metal(f, vol, dura, retraso) {
    [[1, 1], [2.76, .5], [5.4, .25], [8.93, .12], [13.3, .06]].forEach(function (p, i) { tono(f * p[0], 'sine', vol * p[1], dura / (1 + i * .6), retraso, 0, .002); });
    siseo(f * 3, f * 2, vol * .5, .05, retraso, 1.5, .002);
  }
  function campana(f, vol, dura, retraso) { [[1, 1], [2, .55], [2.4, .4], [3, .3], [4.2, .2], [5.4, .12]].forEach(function (p) { tono(f * p[0], 'sine', vol * p[1], dura * (1.2 - p[0] * .1), retraso, 0, .004); }); }
  // Cuerda pulsada (Karplus-Strong): suena a lira o arpa de verdad
  function cuerda(f, vol, retraso, brillo) {
    var clave = Math.round(f) + '|' + (brillo || .5), buf = cuerdas[clave];
    if (!buf) {
      var sr = ctx.sampleRate, n = Math.floor(sr * 2.2), per = Math.round(sr / f), linea = new Float32Array(per);
      for (var i = 0; i < per; i++) linea[i] = Math.random() * 2 - 1;
      buf = ctx.createBuffer(1, n, sr); var d = buf.getChannelData(0), p = 0, decae = .996 + (brillo || .5) * .003;
      for (var j = 0; j < n; j++) { var sig = (p + 1) % per; var v = (linea[p] + linea[sig]) * .5 * decae; d[j] = linea[p]; linea[p] = v; p = sig; }
      cuerdas[clave] = buf;
    }
    var t = ctx.currentTime + (retraso || 0), s = ctx.createBufferSource(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    fl.type = 'lowpass'; fl.frequency.value = 2500 + (brillo || .5) * 4000;
    s.buffer = buf; g.gain.value = vol; s.connect(fl); fl.connect(g); salida(g); s.start(t);
  }
  // Lira griega: cuerdas de tripa (tono cálido) sobre una caja de madera que resuena
  function lira(f, vol, retraso) {
    var clave = 'lira' + Math.round(f), buf = cuerdas[clave];
    if (!buf) {
      var sr = ctx.sampleRate, n = Math.floor(sr * 2.6), per = Math.round(sr / f), linea = new Float32Array(per);
      for (var i = 0; i < per; i++) linea[i] = (Math.random() * 2 - 1) * (i < per * .5 ? 1 : .4);   // pulsada con el dedo, no con púa
      buf = ctx.createBuffer(1, n, sr); var d = buf.getChannelData(0), p = 0;
      for (var j = 0; j < n; j++) { var sig = (p + 1) % per; var v = (linea[p] * .52 + linea[sig] * .48) * .9965; d[j] = linea[p]; linea[p] = v; p = sig; }
      cuerdas[clave] = buf;
    }
    var t = ctx.currentTime + (retraso || 0), g = ctx.createGain(), suave = ctx.createBiquadFilter(), caja = ctx.createBiquadFilter(), aire = ctx.createBiquadFilter();
    suave.type = 'lowpass'; suave.frequency.value = 3200;
    caja.type = 'peaking'; caja.frequency.value = 280; caja.Q.value = 1.4; caja.gain.value = 7;      // resonancia de la caja de madera
    aire.type = 'peaking'; aire.frequency.value = 1100; aire.Q.value = 2; aire.gain.value = 3;
    g.gain.value = vol; suave.connect(caja); caja.connect(aire); aire.connect(g); salida(g);
    [1, 1.003].forEach(function (desafine, k) {   // dos cuerdas casi iguales, como en un instrumento real
      var s = ctx.createBufferSource(); s.buffer = buf; s.playbackRate.value = desafine;
      var gg = ctx.createGain(); gg.gain.value = k ? .35 : 1; s.connect(gg); gg.connect(suave); s.start(t + k * .004);
    });
  }
  function crujido(n, dura, retraso, vol) { if (LIGERO) n = Math.ceil(n / 3); for (var i = 0; i < n; i++) siseo(1500 + Math.random() * 4000, 1200, (vol || .2) * Math.random(), .02 + Math.random() * .03, (retraso || 0) + Math.random() * dura, 2, .001); }

  var EF = {
    // Zeus: el rayo es un latigazo grave; el trueno retumba y rueda a lo lejos
    trueno: function () {
      enElCielo = true;   // todo lo del trueno pasa por el eco del cielo
      try {
        var t = ctx.currentTime;
        // 1) El rayo: un desgarro rápido de muchas descargas, grave y con cuerpo (no un siseo eléctrico)
        for (var i = 0; i < 14; i++) soplo('lowpass', 2600 - i * 120, 2600 - i * 120, .5 * Math.random() + .3, .05 + Math.random() * .05, i * .012 + Math.random() * .01, .5, .002, blanco);
        tono(70, 'sine', .9, .7, 0, 32, .003);
        // 2) El trueno: un solo retumbar grave cuyo volumen sube y baja al azar, como cuando rueda entre las nubes
        var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), fl2 = ctx.createBiquadFilter(), g = ctx.createGain();
        s.buffer = cafe; s.loop = true; fl.type = 'lowpass'; fl.frequency.value = 190; fl.Q.value = .4; fl2.type = 'lowpass'; fl2.frequency.value = 420; fl2.Q.value = .3;
        g.gain.setValueAtTime(.0001, t);
        var at = t + .08, nivel = 1.1;
        g.gain.exponentialRampToValueAtTime(nivel, at + .25);
        for (var k = 0; k < 11; k++) { at += .35 + Math.random() * .45; nivel *= .82; g.gain.setTargetAtTime(nivel * (.5 + Math.random() * .7), at, .18); }
        g.gain.setTargetAtTime(.0001, at + .3, .9);
        s.connect(fl); fl.connect(fl2); fl2.connect(g); salida(g); s.start(t, Math.random() * 2); s.stop(at + 5);
        tono(34, 'sine', .45, 5.5, .15, 24, .5);
      } finally { enElCielo = false; }
    },
    logro: function () { siseo(2500, 4000, .05, .18, 0, 1.2, .01); siseo(1800, 3000, .04, .14, .12, 1.2, .01); },   // el códice: un pergamino que se desenrolla
    hoja: function () { siseo(1800, 3500, .1, .25, 0, 1, .02); },
    // Hera: el canto del pavo real es un grito agudo de dos tiempos, muy vocal
    pavo: function () {
      [0, .55].forEach(function (r, i) {
        var t = ctx.currentTime + r, o = ctx.createOscillator(), f1 = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(i ? 760 : 620, t); o.frequency.linearRampToValueAtTime(i ? 1150 : 980, t + .18); o.frequency.linearRampToValueAtTime(i ? 900 : 760, t + .42);
        f1.type = 'bandpass'; f1.frequency.value = 1100; f1.Q.value = 6; f2.type = 'bandpass'; f2.frequency.value = 2400; f2.Q.value = 8;
        env(g, t, .04, .22, .45); o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); salida(g); o.start(t); o.stop(t + .5);
      });
    },
    // Poseidón: la ola crece, rompe con espuma y se retira
    ola: function () { soplo('lowpass', 200, 900, .9, 2.4, 0, .6, 1); siseo(1500, 5000, .35, 1.4, .9, .6, .25); soplo('lowpass', 600, 150, .4, 2, 1.6, .6, .4); },
    // Deméter: el trigal que suena con el viento y una flauta lejana
    cosecha: function () {
      for (var i = 0; i < 4; i++) siseo(2500, 4500, .07, 1.2, i * .4, .5, .4);
      [[587, .6, .5], [659, 1.15, .45], [784, 1.65, .9], [659, 2.6, .9]].forEach(function (n) {
        var t = ctx.currentTime + n[1], o = ctx.createOscillator(), lfo = ctx.createOscillator(), lg = ctx.createGain(), g = ctx.createGain();
        o.frequency.value = n[0]; lfo.frequency.value = 5; lg.gain.value = 6; lfo.connect(lg); lg.connect(o.frequency);
        env(g, t, .12, .09, n[2]); o.connect(g); salida(g); o.start(t); lfo.start(t); o.stop(t + n[2] + .1); lfo.stop(t + n[2] + .1);
        siseo(n[0] * 2, n[0] * 2, .02, n[2], n[1], 10, .1);
      });
    },
    // Atenea: el ulular del búho es suave y con aire
    buho: function () {
      [[0, .5], [.75, .35], [1.15, .7]].forEach(function (h) { tono(360, 'sine', .22, h[1], h[0], 310, .12); siseo(360, 330, .05, h[1], h[0], 6, .12); });
    },
    // Helios: el viento cálido del atardecer y un acorde de arpa grave
    sol: function () { soplo('bandpass', 300, 600, .25, 3, 0, .6, 1.2); [196, 247, 294, 392].forEach(function (f, i) { cuerda(f, .5, .3 + i * .18, .3); }); },
    // Selene: noche serena, notas de arpa altas y suaves
    luna: function () { [784, 988, 1175, 1568].forEach(function (f, i) { cuerda(f, .3, i * .28, .7); }); },
    lira: function () { [262, 294, 330, 392, 440, 523].forEach(function (f, i) { lira(f, .38, i * .13); }); },
    // Artemisa: la cuerda del arco vibra y la flecha corta el aire
    arco: function () { cuerda(98, .9, 0, .2); siseo(2500, 6000, .25, .45, .04, .8, .02); },
    espada: function () { siseo(4000, 9000, .25, .5, 0, 2, .02); metal(1700, .14, 1.4, .05); },
    tambor: function () { [0, .3, .6, .9].forEach(function (r, i) { tono(95, 'sine', .9, .5, r, 48, .003); soplo('lowpass', 300, 90, .45, .3, r, .7, .003); if (i % 2) siseo(800, 500, .08, .1, r, 1, .002); }); },
    arpa: function () { [523, 587, 659, 784, 880, 1047, 1175, 1319].forEach(function (f, i) { cuerda(f, .4, i * .08, .6); }); },
    // Hefesto: martillo pesado sobre el yunque, lento
    forja: function () { [0, .7, 1.4].forEach(function (r) { metal(640, .5, 1.8, r); tono(90, 'sine', .55, .25, r, 55, .002); soplo('lowpass', 900, 200, .4, .15, r, .7, .002); }); },
    // Hermes: el aleteo de unas alas grandes
    alas: function () { for (var i = 0; i < 7; i++) soplo('lowpass', 900, 300, .45, .16, i * .12, .7, .02); siseo(800, 3000, .15, .8, .6, .6, .2); },
    // Dioniso: vino que se sirve, copas que brindan y una lira de fiesta
    fiesta: function () {
      for (var i = 0; i < 10; i++) siseo(600 + (i % 2) * 300, 500, .12, .09, i * .1, 4, .01);
      [1.2, 1.32].forEach(function (r) { metal(2400, .12, .9, r); });
      [392, 494, 587, 784].forEach(function (f, i) { cuerda(f, .35, 1.6 + i * .06, .6); });
    },
    hades: function () { soplo('lowpass', 120, 60, .7, 4, 0, .6, 1.2); tono(41, 'sine', .35, 4, .1, 34, 1); siseo(300, 200, .05, 3, .5, 4, 1); },
    zumbido: function () { soplo('bandpass', 400, 1600, .55, .5, 0, 1.2, .1); },
    hielo: function () { crujido(20, .5, 0, .3); [3100, 4300, 5600].forEach(function (f, i) { tono(f, 'sine', .05, 1.2, i * .05, 0, .002); }); siseo(5000, 8000, .12, .8, 0, 1, .05); },
    // Fuego real: un rugido grave con chasquidos de leña
    fuego: function () { soplo('lowpass', 250, 700, .7, 2.4, 0, .5, .3); crujido(40, 2.2, .1, .3); },
    golpe: function () { tono(48, 'sine', 1, 1, 0, 30, .003); soplo('lowpass', 400, 70, 1, .9, 0, .6, .003); crujido(16, .6, .05, .2); },
    arrastre: function () { soplo('lowpass', 180, 120, .45, 1.1, 0, 2, .2); crujido(10, 1, 0, .08); },
    cadena: function () { for (var i = 0; i < 12; i++) metal(1700 + Math.random() * 1100, .07, .25, i * .06 + Math.random() * .03); },
    chispas: function () { crujido(25, .5, 0, .35); },
    impacto: function () { metal(820, .3, .8); tono(65, 'sine', .8, .4, 0, 38, .002); soplo('lowpass', 800, 140, .6, .3, 0, .7, .002); },
    // El fénix: llamarada que crece, un grito de ave lejano y destellos
    fenix: function () {
      soplo('lowpass', 200, 1200, .7, 3, 0, .5, .8); crujido(50, 3, 0, .25);
      var t = ctx.currentTime + .6, o = ctx.createOscillator(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(1200, t); o.frequency.linearRampToValueAtTime(1900, t + .25); o.frequency.linearRampToValueAtTime(1400, t + .7);
      fl.type = 'bandpass'; fl.frequency.value = 1800; fl.Q.value = 5; env(g, t, .05, .1, .8); o.connect(fl); fl.connect(g); salida(g); o.start(t); o.stop(t + .9);
      [1568, 2093, 2637].forEach(function (f, i) { tono(f, 'sine', .04, 1.5, 1.2 + i * .15, 0, .01); });
    },
    // ---- Fiestas ----
    // Cohete: silbido que sube; estallido: golpe grave lejano y chisporroteo que cae
    cohete: function () { var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(2600, t + 1.1); env(g, t, .05, .04, 1.2); o.connect(g); salida(g); o.start(t); o.stop(t + 1.25); siseo(3000, 6000, .05, 1.1, 0, 1.2, .2); },
    estallido: function () { enElCielo = true; try { soplo('lowpass', 900, 120, .9, 1.4, 0, .6, .004); tono(55, 'sine', .7, 1, 0, 32, .004); crujido(30, 1.6, .15, .22); } finally { enElCielo = false; } },
    // Cascabeles del trineo: muchos metalitos agudos sacudidos en ritmo
    cascabeles: function () { for (var k = 0; k < 14; k++) { var r = k * .16; for (var j = 0; j < 3; j++) metal(2600 + Math.random() * 1400, .05, .25, r + j * .02 + Math.random() * .02); } },
    // Muertos: una guitarra suave en tono menor y una campana lejana
    muertos: function () { [220, 262, 330, 392, 330, 262].forEach(function (f, i) { cuerda(f, .4, i * .22, .4); }); campana(440, .12, 3, 1.4); },
    // Feria: un organillo de feria en vals, alegre y lejano
    feria: function () { var notas = [392, 494, 587, 494, 440, 523, 659, 523, 392, 494, 587, 784]; notas.forEach(function (f, i) { var r = i * .22, acento = i % 3 === 0; tono(f, 'triangle', acento ? .1 : .07, .2, r); tono(f * 2, 'square', .015, .15, r); if (acento) tono(f / 4, 'triangle', .1, .3, r); }); },
    // Reyes: campanas suaves y brillo de estrella
    reyes: function () { campana(523, .14, 3); campana(659, .1, 3, .35); campana(784, .09, 3, .7); },
    victoria: function () { campana(220, .45, 5); campana(330, .25, 4.5, .9); [392, 494, 587, 784, 988].forEach(function (f, i) { cuerda(f, .4, 1.4 + i * .1, .6); }); }
  };
  S.nota = function (f) { if (!S.on || !iniciar()) return false; lira(f, .42, 0); return true; };
  S.play = function (n) { if (!S.on || !EF[n] || !iniciar()) return; try { EF[n](); } catch (e) {} };

  // ---------- Ambiente del desierto ----------
  function lazo(tipo, f, q, vol, buffer) {
    var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = buffer || cafe; s.loop = true; fl.type = tipo; fl.frequency.value = f; fl.Q.value = q; g.gain.value = vol;
    s.connect(fl); fl.connect(g); g.connect(maestro); s.start(); amb.push(s); return { f: fl, g: g };
  }
  function ambiente() {
    pararAmbiente(); if (!S.on || !iniciar()) return;
    var cl = (window.Cielo && Cielo.clima) || 'despejado', noche = window.Cielo && Cielo.modo === 'noche';
    // Viento: ráfagas que suben y bajan. Más fuerte en la mañana y en la tarde, y arrecia con el viento real.
    var fase = (window.Cielo && Cielo.fase) || 'dia', km = (window.Cielo && Cielo.viento) || 8;
    var base = { amanecer: .1, atardecer: .1, dia: .07, noche: .045 }[fase] || .07;
    var fuerza = Math.min(3, Math.max(.7, km / 12)) * (cl === 'arena' ? 1.8 : 1);
    (function rafaga() {
      tRafaga = setTimeout(function () {
        if (!S.on) return;
        soplo('bandpass', 250 + Math.random() * 150, 500 + Math.random() * 300, base * fuerza, 4 + Math.random() * 3, 0, 1.2, 1.6);
        rafaga();
      }, Math.max(1500, 7000 / fuerza) + Math.random() * 4000);
    })();
    if (cl === 'arena') lazo('lowpass', 320, .5, .05);
    if (cl === 'lluvia' || cl === 'tormenta') lazo('bandpass', 2400, .4, .05, blanco);
    // Grillos en las noches tranquilas
    if (noche && cl !== 'lluvia' && cl !== 'tormenta' && cl !== 'arena') (function grillo() {
      tGrillos = setTimeout(function () {
        if (!S.on) return;
        var f = 4100 + Math.random() * 500;
        for (var i = 0; i < 3; i++) tono(f, 'sine', .022, .045, i * .065, 0, .004, false);
        grillo();
      }, 700 + Math.random() * 1500);
    })();
  }
  function pararAmbiente() { amb.forEach(function (n) { try { n.stop(); } catch (e) {} }); amb = []; clearTimeout(tGrillos); clearTimeout(tRafaga); }
  S.actualizarAmbiente = function () { if (S.on) ambiente(); };

  // Empieza ENCENDIDO. Los navegadores no dejan sonar nada hasta que el visitante toca la página,
  // así que el ambiente arranca con su primer clic, toque o tecla. El botón 🔊 lo apaga.
  var btn = document.getElementById('btnSonido');
  S.on = true;
  function pintarBoton() { if (!btn) return; btn.textContent = S.on ? '🔊' : '🔇'; var en = window.Idioma && Idioma.lang === 'en'; btn.setAttribute('aria-label', S.on ? (en ? 'Turn sound off' : 'Apagar sonido') : (en ? 'Turn sound on' : 'Encender sonido')); }
  pintarBoton();
  var despertado = false;
  function despertar(e) {
    if (despertado) return; despertado = true;
    ['pointerdown', 'keydown', 'touchstart', 'touchend', 'click'].forEach(function (t) { removeEventListener(t, despertar, true); });
    if (e && btn && btn.contains(e.target)) return;   // si su primer toque fue para apagarlo, no suena nada
    if (S.on && iniciar()) ambiente();
  }
  // iPhone a veces crea el audio "dormido": se despierta en cualquier toque o clic
  ['touchend', 'click'].forEach(function (t) { addEventListener(t, function () { if (ctx && ctx.state !== 'running') ctx.resume(); }, true); });
  ['pointerdown', 'keydown', 'touchstart', 'touchend', 'click'].forEach(function (t) { addEventListener(t, despertar, true); });
  if (btn) btn.addEventListener('click', function () {
    S.on = !S.on; pintarBoton(); despertado = true;
    if (S.on) { iniciar(); ambiente(); EF.hoja(); } else pararAmbiente();
  });
})();
