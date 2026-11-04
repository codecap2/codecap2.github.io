/* Olimpo · el cielo vivo: día, noche y clima real de donde está quien visita (si no se sabe, Aguascalientes), estaciones y fiestas.
   Para probar: ?hora=dia|noche  ?clima=despejado|nublado|lluvia|tormenta|arena|niebla
   ?fiesta=navidad|anonuevo|reyes|muertos|patrias|sanvalentin|feria|ninguna  ?estacion=primavera|verano|otono|invierno */
(function () {
  var q = new URLSearchParams(location.search);
  document.documentElement.classList.add('arranque');   // sin transiciones en el primer cuadro
  var calma = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  // El cielo sigue el reloj de quien visita: si abres Olimpo de noche, es de noche en Olimpo
  function fechaLocal() {
    var n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate(), hour: n.getHours(), minute: n.getMinutes() };
  }
  var hoy = fechaLocal();
  var C = window.Cielo = { modo: 'noche', clima: 'despejado', estacion: '', fiesta: '', temp: null };

  // ---------- Estación y fiesta según la fecha ----------
  var m = hoy.month, d = hoy.day, md = m * 100 + d;
  function enRango(a, b) { return a <= b ? (md >= a && md <= b) : (md >= a || md <= b); }
  var estacionPedida = q.get('estacion');
  C.estacion = ['primavera', 'verano', 'otono', 'invierno'].indexOf(estacionPedida) >= 0 ? estacionPedida :
    (enRango(320, 620) ? 'primavera' : enRango(621, 922) ? 'verano' : enRango(923, 1220) ? 'otono' : 'invierno');
  // Cada fiesta dura alrededor de su gran día (más o menos una semana antes y una después),
  // y en el gran día (el "pico") todo resalta todavía más. ?fiesta=X&pico=1 para probar.
  var fiestas = [
    // nombre, inicio, fin, días pico
    ['muertos', 1024, 1109, [1031, 1101, 1102]],   // Halloween + Día de Muertos, fusionados
    ['navidad', 1217, 1229, [1224, 1225]],
    ['anonuevo', 1230, 104, [1231, 101]],
    ['reyes', 105, 113, [106]],
    ['sanvalentin', 207, 221, [214]],
    ['feria', 411, 509, [425]],                      // Feria Nacional de San Marcos (día de San Marcos: 25 de abril)
    ['patrias', 908, 923, [915, 916]]
  ];
  var fiestaPedida = q.get('fiesta');
  var fiestaForzada = fiestaPedida === 'ninguna' || fiestas.some(function (f) { return f[0] === fiestaPedida; });
  C.fiesta = fiestaForzada && fiestaPedida !== 'ninguna' ? fiestaPedida : ''; C.pico = !!C.fiesta && q.get('pico') === '1';
  if (!fiestaForzada) fiestas.forEach(function (f) { if (enRango(f[1], f[2])) { C.fiesta = f[0]; C.pico = f[3].indexOf(md) >= 0; } });
  C.halloween = C.fiesta === 'muertos' && (q.get('halloween') === '1' || (!fiestaForzada && md >= 1024 && md <= 1031));
  body.classList.add(C.estacion);
  if (C.fiesta) body.classList.add(C.fiesta, 'en-fiesta');
  if (C.pico) body.classList.add('fiesta-pico');
  if (C.halloween) body.classList.add('halloween');

  C.saludos = {
    muertos: '🌼 Temporada de Día de Muertos: el Olimpo también recuerda a los que se fueron. Sigue el camino de cempasúchil… brilla más de noche.',
    navidad: '🎄 ¡Navidad en el Olimpo! Atento al cielo: alguien pasa repartiendo regalos.',
    anonuevo: '🎆 ¡Año Nuevo en el Olimpo! Toca el cielo y lanza tus propios fuegos artificiales.',
    reyes: '👑 Los Reyes Magos cruzan las dunas siguiendo su estrella…',
    sanvalentin: '💘 Afrodita anda suelta: el Olimpo está enamorado.',
    feria: '🎡 ¡Temporada de la Feria Nacional de San Marcos! Toca el cielo y lanza fuegos artificiales.',
    patrias: '🇲🇽 ¡Viva México! Toca el cielo y lanza fuegos artificiales tricolor.'
  };
  C.iconoEstacion = { primavera: '🌸', verano: '☀️', otono: '🍂', invierno: '❄️' }[C.estacion];
  C.nombreEstacion = { primavera: 'Primavera', verano: 'Verano', otono: 'Otoño', invierno: 'Invierno' }[C.estacion];

  // ---------- Día y noche ----------
  // Cuatro fases: amanecer, dia, atardecer, noche. Con las horas reales del sol en Aguascalientes (si llegan).
  C.ponerModo = function (fase) {
    C.fase = fase; C.modo = (fase === 'dia' || fase === 'amanecer') ? 'dia' : 'noche';
    body.classList.toggle('dia', C.modo === 'dia'); body.classList.toggle('noche', C.modo === 'noche');
    body.classList.toggle('amanecer', fase === 'amanecer'); body.classList.toggle('atardecer', fase === 'atardecer');
    body.dataset.fase = fase;
    moverAstro(document.getElementById('sol'), fase !== 'noche');
    moverAstro(document.getElementById('luna'), fase === 'noche');
    if (window.Sonido) Sonido.actualizarAmbiente();
  };
  // Visible: baja desde arriba (detrás del menú) hasta su lugar. Oculto: se pone detrás de las dunas
  // y, ya escondido, salta en silencio hasta arriba para regresar desde ahí la próxima vez.
  var primera = true;
  function moverAstro(el, visible) {
    if (!el) return; clearTimeout(el._t);
    if (visible) { el.classList.remove('ponerse', 'arriba'); return; }
    if (el.classList.contains('arriba')) return;
    var saltar = function () { el.style.transition = 'none'; el.classList.remove('ponerse'); el.classList.add('arriba'); void el.offsetWidth; el.style.transition = ''; };
    if (primera) { saltar(); return; }
    el.classList.add('ponerse'); el._t = setTimeout(saltar, 3000);
  }
  var salida = 7 * 60 + 10, puesta = 18 * 60 + 15; // minutos; se ajustan con el clima real
  function faseAhora() {
    var n = fechaLocal(), min = n.hour * 60 + n.minute;
    if (min >= salida - 40 && min < salida + 35) return 'amanecer';
    if (min >= salida + 35 && min < puesta - 35) return 'dia';
    if (min >= puesta - 35 && min < puesta + 40) return 'atardecer';
    return 'noche';
  }
  var horaPedida = q.get('hora');
  C.manual = ['amanecer', 'dia', 'atardecer', 'noche'].indexOf(horaPedida) >= 0;
  C.ponerModo(C.manual ? horaPedida : faseAhora()); primera = false;
  setTimeout(function () { document.documentElement.classList.remove('arranque'); }, 120);
  setInterval(function () { if (!C.manual) { var f = faseAhora(); if (f !== C.fase) C.ponerModo(f); } }, 60000);

  // ---------- Clima ----------
  var climas = ['despejado', 'nublado', 'lluvia', 'tormenta', 'arena', 'niebla'];
  var iconos = { despejado: '☀️', nublado: '☁️', lluvia: '🌧️', tormenta: '⛈️', arena: '🌪️', niebla: '🌫️' };
  C.ponerClima = function (c) {
    climas.forEach(function (k) { body.classList.remove(k); });
    C.clima = climas.indexOf(c) >= 0 ? c : 'despejado'; body.classList.add(C.clima); pintarChip();
    if (window.Sonido) Sonido.actualizarAmbiente();
    clearTimeout(C._t); if (c === 'tormenta') programarRayo();
  };
  function pintarChip() {
    var chip = document.getElementById('chipClima'); if (!chip) return;
    var ico = C.clima === 'despejado' && C.modo === 'noche' ? '🌙' : iconos[C.clima];
    chip.querySelector('.ico').textContent = C.iconoEstacion;
    chip.querySelector('.txt').textContent = ico + (C.temp !== null ? ' ' + Math.round(C.temp) + '°' : '') + ' ' + C.lugar;
  }
  // Nombre corto de la ciudad para el chip (Aguascalientes se queda como "Ags", de cariño)
  function nombreCorto(ciudad) {
    if (!ciudad) return 'Ags';
    if (/^aguascalientes$/i.test(ciudad)) return 'Ags';
    return ciudad.length > 12 ? ciudad.slice(0, 11) + '…' : ciudad;
  }
  C.lugar = 'Ags';
  // Ubicación aproximada de quien visita (por su conexión, sin pedir permisos).
  // Si no se puede saber en 3 segundos, se usa Aguascalientes, la casa de Olimpo.
  function ubicacion() {
    var ags = { lat: 21.88, lon: -102.29, ciudad: 'Aguascalientes' };
    var espera = new Promise(function (ok) { setTimeout(function () { ok(ags); }, 3000); });
    var consulta = fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (typeof j.latitude !== 'number' || typeof j.longitude !== 'number') return ags;
        return { lat: j.latitude, lon: j.longitude, ciudad: j.city || '' };
      })
      .catch(function () { return ags; });
    return Promise.race([consulta, espera]);
  }
  function programarRayo() {
    C._t = setTimeout(function () { C.destello(); programarRayo(); }, 7000 + Math.random() * 9000);
  }
  C.destello = function () {
    var el = document.getElementById('destello');
    el.classList.remove('activo'); void el.offsetWidth; el.classList.add('activo');
    if (window.Sonido) setTimeout(function () { Sonido.play('trueno'); }, 250);
  };
  if (climas.indexOf(q.get('clima')) >= 0) { C.ponerClima(q.get('clima')); }
  else {
    C.ponerClima('despejado');
    ubicacion()
      .then(function (u) {
        C.lugar = nombreCorto(u.ciudad);
        return fetch('https://api.open-meteo.com/v1/forecast?latitude=' + u.lat.toFixed(2) + '&longitude=' + u.lon.toFixed(2) +
          '&current=temperature_2m,weather_code,wind_speed_10m&daily=sunrise,sunset&forecast_days=1&timezone=auto');
      })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        try {
          var aMin = function (s) { var t = s.split('T')[1].split(':'); return +t[0] * 60 + +t[1]; };
          salida = aMin(j.daily.sunrise[0]); puesta = aMin(j.daily.sunset[0]);
          if (!C.manual && faseAhora() !== C.fase) C.ponerModo(faseAhora());
        } catch (e) {}
        var c = j.current, w = c.weather_code, v = c.wind_speed_10m, k = 'despejado';
        C.temp = c.temperature_2m; C.viento = v;
        if (w >= 95) k = 'tormenta';
        else if ((w >= 51 && w <= 67) || (w >= 80 && w <= 82)) k = 'lluvia';
        else if (w === 45 || w === 48) k = 'niebla';
        else if (v >= 28) k = 'arena';
        else if (w >= 2) k = 'nublado';
        C.ponerClima(k);
      })
      .catch(function () { pintarChip(); });
  }

  // ---------- Partículas ----------
  var cv = document.getElementById('particulas'), ctx = cv.getContext('2d');
  // En celulares y equipos modestos se dibuja la mitad de partículas, para que todo vaya fluido
  var F = (innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4) ? .5 : 1;
  var cf = document.getElementById('frente'), fx = cf.getContext('2d'), pausa = false;
  C.pausar = function (si) { pausa = si; };
  var W, H, estrellas = [], parts = [], reyesX = .2 + Math.random() * .45, fugaz = null, ultimoFuego = 0;
  // El sol y la luna se esconden DETRÁS de las dunas: se recorta su capa con la forma de la duna del frente
  function recortarAstros() {
    var duna = document.querySelector('.dunas .d1'), capa = document.getElementById('astros');
    if (!duna || !capa || !duna.getScreenCTM) return;
    var m = duna.getScreenCTM(), largo = duna.getTotalLength(), pts = [], svgp = duna.ownerSVGElement.createSVGPoint();
    for (var i = 0; i <= 48; i++) {
      var q = duna.getPointAtLength(largo * i / 48 * .5); svgp.x = q.x; svgp.y = q.y;
      var s = svgp.matrixTransform(m); pts.push(Math.round(s.x) + 'px ' + Math.round(s.y) + 'px');
    }
    capa.style.clipPath = 'polygon(0 0, 100% 0, 100% ' + pts[pts.length - 1].split(' ')[1] + ', ' + pts.reverse().join(', ') + ', 0 ' + pts[pts.length - 1].split(' ')[1] + ')';
  }
  function medir() {
    W = cv.width = cf.width = innerWidth; H = cv.height = cf.height = innerHeight; estrellas = [];
    recortarAstros();
    var n = Math.round(W * H / 8000 * F);
    for (var i = 0; i < n; i++) estrellas.push({ x: Math.random() * W, y: Math.random() * H * .75, r: Math.random() * 1.3 + .2, f: Math.random() * 6.28, oro: i % 9 === 0 });
  }
  // Al cambiar de tamaño (o al hacer zoom con los dedos) se espera a que termine, para no gastar memoria de más
  var tMedir; addEventListener('resize', function () { clearTimeout(tMedir); tMedir = setTimeout(medir, 250); }); medir();

  function agregar(p) { if (parts.length < 700 * F) { if (p.s) p.s = Math.round(p.s / 4) * 4; parts.push(p); } }
  // Los emojis se dibujan una sola vez en una "calcomanía" y luego solo se pegan: así caen fluidos, sin trabarse
  var calcas = {};
  function sprite(e, s) {
    var k = e + s; if (calcas[k]) return calcas[k];
    var c = document.createElement('canvas'), t = Math.ceil(s * 1.4); c.width = c.height = t;
    var x = c.getContext('2d'); x.font = s + 'px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, t / 2, t / 2);
    return (calcas[k] = c);
  }
  function azar(a, b) { return a + Math.random() * (b - a); }

  C.fugaz = function () { fugaz = { x: azar(W * .1, W * .6), y: azar(20, H * .3), vx: 9, vy: 3.5, vida: 60 }; };
  C.fuegos = function (x, y, colores) {
    colores = colores || ['#f1d48a', '#ff5a4a', '#ffffff', '#ffb347'];
    x = x || azar(W * .15, W * .85); y = y || azar(H * .12, H * .4);
    for (var i = 0; i < 70 * F; i++) {
      var a = Math.random() * 6.28, s = azar(1.5, 5.5);
      agregar({ f: 1, t: 'chispa', x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, vida: azar(50, 90), c: colores[i % colores.length] });
    }
  };
  // Cohete: sale de detrás de las dunas, sube silbando y revienta en el cielo (en el lienzo del fondo)
  C.paletaFuegos = function () {
    return C.fiesta === 'patrias' ? ['#0b8a3e', '#ffffff', '#ce1126'] : C.fiesta === 'feria' ? ['#ff4fa3', '#ffd34d', '#4fd1ff', '#9bff6a', '#ff7a3d'] : ['#f1d48a', '#ff5a4a', '#ffffff', '#ffb347', '#8fd3ff'];
  };
  C.cohete = function (x, ty, colores) {
    var dist = Math.max(80, H - ty), v = Math.sqrt(2 * .05 * dist);
    agregar({ t: 'cohete', x: x, y: H + 10, vx: azar(-.4, .4), vy: -v, ty: ty, vida: 400, c: colores || C.paletaFuegos() });
    if (window.Sonido) Sonido.play('cohete');
  };
  function estallar(x, y, cols) {
    var n = Math.round(80 * F), forma = Math.random();
    for (var i = 0; i < n; i++) {
      var a = i / n * 6.28 + Math.random() * .1, s = forma < .5 ? azar(2.5, 4.2) : azar(.8, 4.5);
      agregar({ t: 'chispa', g: .035, tam: 2.2, x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, vida: azar(60, 100), c: cols[i % cols.length] });
    }
    if (window.Sonido) Sonido.play('estallido');
  }
  C.brasas = function (x, y, n, colores) {
    colores = colores || ['#ffcf5a', '#ff8a2a', '#ff4a1f'];
    for (var i = 0; i < (n || 6); i++) agregar({ f: 1, t: 'brasa', x: x + azar(-8, 8), y: y + azar(-8, 8), vx: azar(-1.2, 1.2), vy: azar(-2.6, -.6), vida: azar(30, 60), c: colores[i % colores.length], r: azar(1.2, 3.2) });
  };
  // Polvo de piedra: cae pesado, como cuando chocan las puertas
  C.polvo = function (x, y, n) {
    var cols = ['#8a7f70', '#b5a891', '#6b6154', '#d8cdb9', '#4a4239'];
    for (var i = 0; i < (n || 40); i++) { var a = azar(-3.1, 0), s = azar(.6, 3.6); agregar({ f: 1, t: 'chispa', g: .09, tam: azar(1.5, 4.5), x: x + azar(-6, 6), y: y, vx: Math.cos(a) * s * (Math.random() < .5 ? -1 : 1), vy: Math.sin(a) * s, vida: azar(50, 110), c: cols[i % cols.length] }); }
  };
  C.subir = function (emojis, x, y, n) {
    for (var i = 0; i < (n || 8); i++) agregar({ f: 1, t: 'emoji', x: x + azar(-60, 60), y: y + azar(-10, 20), vx: azar(-.6, .6), vy: azar(-2.4, -1), rot: azar(0, 6), e: emojis[i % emojis.length], s: azar(18, 30), vida: azar(90, 150) });
  };
  C.lluviaDe = function (emojis, n) {
    for (var i = 0; i < (n || 40); i++) agregar({ f: 1, t: 'emoji', x: azar(0, W), y: azar(-H * .6, -10), vx: azar(-.5, .5), vy: azar(1.5, 3.5), rot: azar(0, 6), e: emojis[i % emojis.length], s: azar(16, 30), vida: 400 });
  };

  function generar() {
    var dia = C.modo === 'dia';
    if (dia && Math.random() < .35 * F) agregar({ t: 'arena', x: -5, y: azar(H * .45, H), vx: azar(1, 3), vy: azar(-.2, .2), vida: 900, r: azar(.6, 1.6) });
    if (C.clima === 'arena') for (var i = 0; i < 7 * F; i++) agregar({ t: 'arena', x: azar(-50, W * .3), y: azar(0, H), vx: azar(7, 16), vy: azar(-.6, .8), vida: 300, r: azar(.6, 2.2) });
    if (C.clima === 'lluvia' || C.clima === 'tormenta') for (var j = 0; j < 5; j++) agregar({ t: 'gota', x: azar(0, W + 100), y: -20, vx: -2, vy: azar(12, 18), vida: 200 });
    if (C.fiesta === 'navidad' && Math.random() < .8) agregar({ t: 'copo', x: azar(0, W), y: -6, vx: azar(-.4, .4), vy: azar(.6, 1.6), vida: 1500, r: azar(1, 3) });
    var pico = C.pico ? 2.2 : 1;   // en el gran día, todo se multiplica
    if (C.fiesta === 'muertos' && Math.random() < .12 * pico * F) agregar({ t: 'petalo', x: azar(0, W), y: -10, vx: azar(-.6, .6), vy: azar(.6, 1.4), rot: azar(0, 6), vida: 1500, c: Math.random() < .8 ? '#ff9f1c' : '#c2185b' });
    if (C.halloween && C.modo === 'noche' && Math.random() < .006 * pico) agregar({ t: 'emoji', x: -20, y: azar(H * .1, H * .45), vx: azar(2, 4), vy: azar(-.6, .6), rot: 0, e: '🦇', s: 22, vida: 900 });
    if (C.fiesta === 'sanvalentin' && Math.random() < .05 * pico) agregar({ t: 'emoji', x: azar(0, W), y: H + 20, vx: azar(-.3, .3), vy: azar(-1.4, -.7), rot: 0, e: '💗', s: azar(14, 24), vida: 900 });
    if ((C.fiesta === 'feria' || C.fiesta === 'patrias') && Math.random() < .2 * pico * F) {
      var cols = C.fiesta === 'patrias' ? ['#0b8a3e', '#ffffff', '#ce1126'] : ['#e91e63', '#ffc107', '#00bcd4', '#8bc34a', '#ff5722'];
      agregar({ t: 'confeti', x: azar(0, W), y: -10, vx: azar(-.8, .8), vy: azar(1, 2.2), rot: azar(0, 6), vida: 1200, c: cols[Math.floor(Math.random() * cols.length)] });
    }
    // Fuegos artificiales que salen de detrás de las dunas (de noche, o todo el día en el gran día)
    var ahora = performance.now(), cada = C.pico ? 1300 : 3200;
    if ((C.fiesta === 'anonuevo' || C.fiesta === 'patrias' || C.fiesta === 'feria') && (C.modo === 'noche' || C.pico) && ahora - ultimoFuego > cada) {
      ultimoFuego = ahora; C.cohete(azar(W * .1, W * .9), azar(H * .12, H * .4));
    }
    if (C.modo === 'noche' && !fugaz && Math.random() < .002) C.fugaz();
  }

  function pintar(t) {
    ctx.clearRect(0, 0, W, H);
    var dia = C.modo === 'dia';
    if (!dia) {
      for (var i = 0; i < estrellas.length; i++) {
        var e = estrellas[i]; ctx.globalAlpha = (calma ? .7 : .4 + .45 * Math.sin(t / 900 + e.f)) * (C.fase === 'atardecer' ? .3 : 1);
        ctx.fillStyle = e.oro ? '#f1d48a' : '#fff'; ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.28); ctx.fill();
      }
    }
    if (C.fiesta === 'reyes') {
      reyesX += calma ? 0 : .0004; if (reyesX > 1.2) reyesX = -0.2;
      // Las tres estrellas de los Reyes: grandes, con su destello en cruz que late
      for (var k = 0; k < 3; k++) {
        var rx = (reyesX - k * .06) * W, ry = H * (.13 + k * .035), late = calma ? 1 : .85 + .15 * Math.sin(t / 300 + k), tam = (k === 0 ? 9 : 6.5) * late;
        ctx.globalAlpha = .35; ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.arc(rx, ry, tam * 3.2, 0, 6.28); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = k === 0 ? '#fffbe6' : '#f6dc95';
        ctx.beginPath(); ctx.moveTo(rx, ry - tam * 3); ctx.lineTo(rx + tam * .35, ry - tam * .35); ctx.lineTo(rx + tam * 3, ry); ctx.lineTo(rx + tam * .35, ry + tam * .35);
        ctx.lineTo(rx, ry + tam * 3); ctx.lineTo(rx - tam * .35, ry + tam * .35); ctx.lineTo(rx - tam * 3, ry); ctx.lineTo(rx - tam * .35, ry - tam * .35); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(rx, ry, tam * .7, 0, 6.28); ctx.fill();
      }
    }
    if (fugaz) {
      ctx.globalAlpha = fugaz.vida / 60; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(fugaz.x, fugaz.y); ctx.lineTo(fugaz.x - fugaz.vx * 8, fugaz.y - fugaz.vy * 8); ctx.stroke();
      fugaz.x += fugaz.vx; fugaz.y += fugaz.vy; if (--fugaz.vida <= 0) fugaz = null;
    }
    fx.clearRect(0, 0, W, H);
    for (var p = parts.length - 1; p >= 0; p--) {
      var a = parts[p]; a.x += a.vx; a.y += a.vy; a.vida--;
      if (a.t === 'chispa') { a.vy += a.g || .06; a.vx *= .985; }
      if (a.t === 'brasa') { a.vy -= .02; a.vx *= .97; }
      if (a.t === 'cohete') {
        a.vy += .05;
        if (a.vy >= -.4 || a.y <= a.ty) { estallar(a.x, a.y, a.c); parts.splice(p, 1); continue; }
        if (!pausa) { ctx.globalAlpha = 1; ctx.fillStyle = '#fff6d0'; ctx.fillRect(a.x - 1.2, a.y - 1.2, 2.4, 2.4); ctx.globalAlpha = .45; ctx.fillStyle = '#ffd27a'; ctx.fillRect(a.x - .6, a.y, 1.2, 14); }
        continue;
      }
      if (a.rot !== undefined) a.rot += .03;
      if (a.vida <= 0 || a.y > H + 40 || a.x > W + 60 || a.y < -H) { parts.splice(p, 1); continue; }
      if (pausa && !a.f) continue;
      var g = a.f ? fx : ctx;   // los efectos de los dioses van al frente de todo; el clima, al fondo
      g.globalAlpha = (a.t === 'chispa' || a.t === 'brasa') ? Math.min(1, a.vida / 40) : (a.t === 'emoji' && a.vida < 40 ? a.vida / 40 : 1);
      if (a.t === 'brasa') { g.fillStyle = a.c; g.globalAlpha *= .25; g.beginPath(); g.arc(a.x, a.y, a.r * 3, 0, 6.28); g.fill(); g.globalAlpha *= 4; g.beginPath(); g.arc(a.x, a.y, a.r, 0, 6.28); g.fill(); continue; }
      if (a.t === 'arena') { g.fillStyle = dia ? 'rgba(120,70,30,.55)' : 'rgba(200,180,150,.35)'; g.fillRect(a.x, a.y, a.r * 2.4, a.r); }
      else if (a.t === 'gota') { g.strokeStyle = 'rgba(180,200,230,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(a.x + a.vx, a.y + 10); g.stroke(); }
      else if (a.t === 'copo') { g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(a.x + Math.sin(a.y / 30) * 6, a.y, a.r, 0, 6.28); g.fill(); }
      else if (a.t === 'chispa') { g.fillStyle = a.c; g.fillRect(a.x, a.y, a.tam || 2.4, a.tam || 2.4); }
      else if (a.t === 'petalo' || a.t === 'confeti') {
        g.save(); g.translate(a.x + Math.sin(a.y / 40) * 10, a.y); g.rotate(a.rot); g.fillStyle = a.c;
        if (a.t === 'petalo') { g.beginPath(); g.ellipse(0, 0, 5, 3, 0, 0, 6.28); g.fill(); } else g.fillRect(-4, -2, 8, 4);
        g.restore();
      }
      else if (a.t === 'emoji') { var sp = sprite(a.e, a.s); g.save(); g.translate(a.x, a.y); g.rotate(Math.sin(a.rot) * .4); g.drawImage(sp, -sp.width / 2, -sp.height / 2); g.restore(); }
    }
    ctx.globalAlpha = 1; fx.globalAlpha = 1;
    if (!calma) { generar(); requestAnimationFrame(pintar); }
  }
  requestAnimationFrame(pintar);
  if (calma) addEventListener('resize', function () { pintar(0); });

  // En celular el aviso sale abajo… salvo cuando los botones de "Ver mis trabajos" y "Platiquemos"
  // están en la parte baja de la pantalla: ahí sube arriba, para que nunca tape lo que trae clientes.
  var botones = document.querySelector('.portada .botones');
  if (botones && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      document.documentElement.classList.toggle('botones-abajo', e[0].isIntersecting);
    }, { rootMargin: '-50% 0px 0px 0px' }).observe(botones);
  }
})();
