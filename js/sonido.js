/* Olimpo · sonidos hechos con código (Web Audio), sin archivos de nadie, buscando que suenen reales:
   ruido café para viento, mar y truenos; cuerdas pulsadas de verdad (Karplus-Strong) para la lira y el arpa;
   campanas y metales con armónicos inarmónicos, como los reales. Arranca tras el primer gesto (botón 🔇/🔊). */
(function () {
  var S = window.Sonido = { on: false };
  var ctx, blanco, cafe, maestro, reverb, amb = [], tGrillos, tRafaga, cuerdas = {};

  // En celulares todo es más ligero: ecos más cortos y menos chasquidos, para que el audio no truene
  var LIGERO = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4 || /iPhone|iPad|Android/i.test(navigator.userAgent);
  function iniciar() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      maestro = ctx.createGain(); maestro.gain.value = .82; maestro.connect(ctx.destination);
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
  // El coro de "Jingle Bells" (dominio público); con "cuantas" se toca solo el principio
  function melodiaNavidad(cuantas) {
    var q = .27, t = 0, notas = [[659, 1], [659, 1], [659, 2], [659, 1], [659, 1], [659, 2], [659, 1], [784, 1], [523, 1.5], [587, .5], [659, 4],
      [698, 1], [698, 1], [698, 1.5], [698, .5], [698, 1], [659, 1], [659, 1], [659, .5], [659, .5], [659, 1], [587, 1], [587, 1], [659, 1], [587, 2], [784, 2]];
    notas.slice(0, cuantas || notas.length).forEach(function (n) { campanita(n[0], .075, t + .05); t += n[1] * q; });
  }
  // Rasgueo de guitarra: las cuerdas suenan una tras otra, muy rápido, como con la mano
  function rasgueo(notas, vol, retraso, haciaArriba) {
    var orden = haciaArriba ? notas.slice().reverse() : notas;
    orden.forEach(function (f, i) { cuerda(f, vol * (1 - i * .08), retraso + i * .014, .45); });
  }
  // Órgano de carrusel: tubos (fundamental, octava y quinta) un poquito desafinados entre sí, que "laten" como los de verdad
  function organo(f, vol, dura, retraso) {
    [[1, 1], [1.004, .6], [2, .45], [3, .2]].forEach(function (p) { tono(f * p[0], 'sine', vol * p[1], dura, retraso, 0, .03); });
    siseo(f * 2, f * 2, vol * .05, dura * .6, retraso, 2, .02);   // el aire de los tubos
  }
  // Trompeta de mariachi: metal brillante que se abre al soplar, con vibrato
  function trompeta(f, vol, dura, retraso) {
    var t = ctx.currentTime + (retraso || 0), o = ctx.createOscillator(), fl = ctx.createBiquadFilter(), g = ctx.createGain(), vib = ctx.createOscillator(), vg = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f * .985, t); o.frequency.exponentialRampToValueAtTime(f, t + .05);
    vib.frequency.value = 5.5; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * .012, t + dura * .6); vib.connect(vg); vg.connect(o.frequency);
    fl.type = 'lowpass'; fl.Q.value = 1.2; fl.frequency.setValueAtTime(f * 1.5, t); fl.frequency.exponentialRampToValueAtTime(f * 7, t + .06); fl.frequency.exponentialRampToValueAtTime(f * 4, t + dura);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .04); g.gain.setValueAtTime(vol * .85, t + dura * .7); g.gain.exponentialRampToValueAtTime(.0001, t + dura + .08);
    o.connect(fl); fl.connect(g); salida(g); o.start(t); vib.start(t); o.stop(t + dura + .12); vib.stop(t + dura + .12);
  }
  // Toca una melodía: [frecuencia (0 = silencio), duración en tiempos], con el instrumento que se le pase
  function tocar(notas, q, instrumento, desde) {
    var t = desde || 0;
    notas.forEach(function (n) { if (n[0]) instrumento(n[0], n[1] * q, t); t += n[1] * q; });
    return t;
  }
  // Notas (Hz) para escribir las melodías de forma legible
  var N = { G2: 98, A2: 110, B2: 123.5, C3: 130.8, D3: 146.8, E3: 164.8, F3: 174.6, G3: 196, A3: 220, B3: 246.9, C4: 261.6, D4: 293.7, E4: 329.6, F4: 349.2, G4: 392, Gs4: 415.3, A4: 440, B4: 493.9,
    C5: 523.3, D5: 587.3, E5: 659.3, F5: 698.5, G5: 784, A5: 880, B5: 987.8, C6: 1046.5, Gs3: 207.7, E2: 82.4, D2: 73.4 };
  // Campanita tipo celesta (más dulce que la campana grande), para melodías
  function campanita(f, vol, retraso) {
    [[1, 1], [2, .28], [3.01, .1], [4.1, .05]].forEach(function (p, i) { tono(f * p[0], 'sine', vol * p[1], .9 / (1 + i * .8), retraso, 0, .003); });
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
    // Apolo: una frase corta en la lira, que sube, respira y se resuelve (ya no una escala de práctica)
    lira: function () { [[262, 0], [330, .14], [392, .28], [523, .42], [494, .7], [392, .88], [440, 1.12]].forEach(function (n) { lira(n[0], .38, n[1]); }); },
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
    // Halloween: un theremín de película de terror que se desliza entre notas, sobre un zumbido grave y una campana lejana
    halloween: function () {
      var t = ctx.currentTime, o = ctx.createOscillator(), vib = ctx.createOscillator(), vg = ctx.createGain(), g = ctx.createGain();
      o.type = 'sine'; vib.frequency.value = 6; vg.gain.value = 7; vib.connect(vg); vg.connect(o.frequency);
      var notas = [[N.E4, 0], [N.B4, .5], [N.A4, 1.1], [N.F4, 1.6], [N.E4, 2.2], [N.Gs3 * 2, 2.8]];
      o.frequency.setValueAtTime(notas[0][0], t);
      notas.forEach(function (n, i) { if (i) o.frequency.exponentialRampToValueAtTime(n[0], t + n[1]); });   // se desliza de una nota a otra
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .3); g.gain.setValueAtTime(.08, t + 2.6); g.gain.exponentialRampToValueAtTime(.0001, t + 3.6);
      o.connect(g); salida(g); o.start(t); vib.start(t); o.stop(t + 3.7); vib.stop(t + 3.7);
      tono(N.E2, 'sine', .25, 3.5, 0, 0, .8); soplo('lowpass', 150, 90, .25, 3.5, 0, .6, 1);
      campana(N.E3 * 2, .06, 3, 2.4);
    },
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
    // Navidad: la melodía de "Jingle Bells" (tradicional, de 1857) con timbre de campanitas.
    // Al tocar algo suena solo el inicio; cuando pasa Santa suena el coro completo.
    cascabeles: function () { melodiaNavidad(11); },
    trineo: function () { melodiaNavidad(); },
    // Día de Muertos: un vals en La menor con guitarra (bajo + rasgueo) y una melodía de requinto; al final, una campana lejana
    muertos: function () {
      var q = .32, A = [N.A3, N.C4, N.E4], Dm = [N.D4, N.F4, N.A4], E = [N.Gs3, N.B3, N.E4], bajos = [N.A2, N.D3, N.E2, N.A2], acordes = [A, Dm, E, A];
      for (var c = 0; c < 4; c++) { var r = c * 3 * q; cuerda(bajos[c], .55, r, .3); rasgueo(acordes[c], .22, r + q); rasgueo(acordes[c], .18, r + 2 * q, true); }
      tocar([[N.E5, 1], [N.A4, 1], [N.C5, 1], [N.D5, 1.5], [N.C5, .5], [N.A4, 1], [N.B4, 1], [N.Gs4, 1], [N.B4, 1], [N.A4, 3]], q, function (f, d, t) { cuerda(f, .42, t, .75); });
      campana(N.A4, .1, 3.5, 12 * q);
    },
    // Feria: el vals del carrusel, con órgano de tubos, "um-pa-pa" en el bajo y la melodía arriba
    // Feria de San Marcos: "Son de la Feria", una melodía original de Olimpo (solo nuestra), con estilo de banda:
    // dos trompetas en terceras, tuba haciendo "um-pa", tambora en el tiempo fuerte y platillo a contratiempo
    feria: function () {
      var q = .17, Bb4 = 466.2, Bb2 = 116.5, F2 = 87.3, C2 = 65.4, A5 = 880, C6 = 1046.5;
      var mel = [[N.C5, 1], [N.A4, 1], [N.C5, 1], [N.F5, 1], [A5, 1], [N.G5, 1], [N.F5, 1], [N.E5, 1],
        [N.D5, 1], [Bb4, 1], [N.D5, 1], [N.G5, 1], [N.F5, 1], [N.E5, 1], [N.D5, 1], [N.C5, 1],
        [N.C5, 1], [N.A4, 1], [N.C5, 1], [N.F5, 1], [A5, 1], [C6, 1], [A5, 1], [N.F5, 1],
        [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.E5, 1], [N.F5, 2], [0, 2]];
      var tercera = { 523.3: N.A4, 440: N.F4, 698.5: N.D5, 880: N.F5, 784: N.E5, 659.3: N.C5, 587.3: Bb4, 466.2: N.G4, 1046.5: A5, 392: N.E4 };
      tocar(mel, q, function (f, d, t) { trompeta(f, .055, d * .8, t); });
      tocar(mel.map(function (n) { return [n[0] ? (tercera[n[0]] || n[0] * .8) : 0, n[1]]; }), q, function (f, d, t) { trompeta(f, .036, d * .8, t); });
      // Armonía por compás (4 corcheas): Fa, Fa, Si bemol, Do, Fa, Fa, Do, Fa
      var raices = [[F2, N.C3], [F2, N.C3], [Bb2, F2], [N.C3, N.G2], [F2, N.C3], [F2, N.C3], [N.C3, N.G2], [F2, N.C3]];
      raices.forEach(function (rz, i) {
        var r = i * 4 * q;
        trompeta(rz[0], .07, q * 1.4, r); trompeta(rz[1], .06, q * 1.4, r + 2 * q);     // tuba: um… pa
        tono(70, 'sine', .55, .22, r, 45, .003); soplo('lowpass', 260, 90, .3, .18, r, .7, .003);   // tambora
        [1, 3].forEach(function (b) { siseo(6000, 8000, .05, .14, r + b * q, 1.2, .003); });        // platillo
      });
    },
    // Fiestas Patrias: fanfarria de mariachi, dos trompetas en terceras, guitarrón y vihuela
    patrias: function () {
      // El tema más famoso del Jarabe Tapatío (son tradicional de Jalisco, dominio público) tocado con REQUINTO:
      // la guitarrita aguda y brillante de los tríos, en dos voces, con guitarrón y vihuela de fondo
      var q = .16,
        t1 = [[N.G4, 1], [N.C5, 2], [0, 1], [N.G4, 1], [N.C5, 2], [0, 1], [N.G4, 1], [N.C5, 1], [N.D5, 1], [N.C5, 1], [N.B4, 1], [N.C5, 1], [N.D5, 2],
          [N.G4, 1], [N.B4, 2], [0, 1], [N.G4, 1], [N.B4, 2], [0, 1], [N.G4, 1], [N.B4, 1], [N.C5, 1], [N.B4, 1], [N.A4, 1], [N.B4, 1], [N.C5, 3]],
        baja = { 523.3: N.A4 || 440, 587.3: N.B4, 493.9: N.G4, 392: N.E4, 440: N.F4 };
      var t2 = t1.map(function (n) { return [n[0] ? (baja[n[0]] || n[0] * .8) : 0, n[1]]; });
      // Requinto: una octava arriba, cuerda brillante; las notas largas se "trémolo" (punteo rápido), como lo hacen los requintistas
      var requinto = function (vol) { return function (f, d, t) {
        var veces = d >= 2 * q ? Math.round(d / (q / 2)) : 1;
        for (var k = 0; k < veces; k++) cuerda(f * 2, vol * (k ? .7 : 1), t + k * (d / veces), .95);
      }; };
      tocar(t1, q, requinto(.42)); tocar(t2, q, requinto(.26));
      // Guitarrón y vihuela: "um-pa" en Do y en Sol, como lleva el son
      var C = [N.C4, N.E4, N.G4], G = [N.B3, N.D4, N.G4];
      for (var b = 0; b < 8; b++) { var ac = b < 4 ? C : G, raiz = b < 4 ? N.C3 : N.G2, r = b * 4 * q; cuerda(raiz, .6, r, .25); rasgueo(ac, .18, r + 2 * q); }
      cuerda(N.C3, .6, 32 * q, .25); rasgueo(C, .2, 32 * q);
    },
    // Reyes: "Noche de paz" (de 1818, dominio público) con campanitas, y una campana grave al empezar
    reyes: function () {
      campana(N.C4, .08, 4);
      tocar([[N.G4, 1.5], [N.A4, .5], [N.G4, 1], [N.E4, 3], [N.G4, 1.5], [N.A4, .5], [N.G4, 1], [N.E4, 3], [N.D5, 2], [N.D5, 1], [N.B4, 3], [N.C5, 2], [N.C5, 1], [N.G4, 3]], .36,
        function (f, d, t) { campanita(f, .07, t + .05); });
    },
    // San Valentín: arpa en acordes románticos (Do, La menor, Fa, Sol), de abajo hacia arriba
    sanvalentin: function () {
      [[N.C4, N.E4, N.G4, N.C5], [N.A3, N.C4, N.E4, N.A4], [N.F3, N.A3, N.C4, N.F4], [N.G3, N.B3, N.D4, N.G4, N.B4, N.D5]].forEach(function (ac, i) { ac.forEach(function (f, j) { cuerda(f, .38, i * .55 + j * .07, .65); }); });
    },
    victoria: function () { campana(220, .45, 5); campana(330, .25, 4.5, .9); [392, 494, 587, 784, 988].forEach(function (f, i) { cuerda(f, .4, 1.4 + i * .1, .6); }); }
  };
  S.nota = function (f) { if (!S.on || !iniciar()) return false; lira(f, .42, 0); return true; };
  S.play = function (n) { if (!S.on || !EF[n] || !iniciar()) return; try { EF[n](); } catch (e) { if (window.console) console.warn('Sonido ' + n + ':', e); } };

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
        for (var i = 0; i < 4; i++) tono(f, 'sine', .016, .018, i * .032, 0, .002, false);   // 4 pulsitos muy rápidos: así frota las alas un grillo
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
