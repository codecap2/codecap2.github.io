/* Olimpo · las fiestas invaden el Olimpo: escenas en las dunas, accesorios en el logo, fuegos al tocar el cielo y sonidos.
   Para probar: ?fiesta=muertos|navidad|anonuevo|reyes|sanvalentin|feria|patrias  (&pico=1 para el gran día, &halloween=1)
   El sol y la luna son el "modo claro / modo oscuro": lo que brilla de noche (cempasúchil, luces de la rueda) brilla en modo oscuro. */
(function () {
  var C = window.Cielo, S = window.Sonido, I = window.Idioma, T = I ? I.t : function (a) { return a; };
  var f = C.fiesta; if (!f) return;
  var body = document.body, $ = function (s) { return document.querySelector(s); };
  var suave = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var astros = $('#astros'), escena = document.createElement('div'); escena.id = 'escenaFiesta'; escena.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(escena, $('#frente'));
  function avisar(txt, ms) { var a = $('#aviso'); if (!a) return; a.textContent = txt; a.classList.add('visible'); clearTimeout(avisar.t); avisar.t = setTimeout(function () { a.classList.remove('visible'); }, ms || 4200); }
  function boton(html, clase, etiqueta, donde) { var b = document.createElement('button'); b.type = 'button'; b.className = 'escena ' + clase; b.innerHTML = html; b.setAttribute('aria-label', etiqueta); (donde || escena).appendChild(b); return b; }

  // ---------- Accesorios junto al logo ----------
  var ACC = {
    navidad: '<img src="img/fiestas/gorro.svg" alt="">',   // gorro de Santa (Openclipart, dominio público)
    muertos: '<svg viewBox="0 0 40 40"><path d="M20 3 C9 3 4 11 4 19 C4 25 8 28 10 30 L10 36 L30 36 L30 30 C32 28 36 25 36 19 C36 11 31 3 20 3 Z" fill="#fbf4e6"/><circle cx="13.5" cy="19" r="5" fill="#ff4fa3"/><circle cx="26.5" cy="19" r="5" fill="#4fd1ff"/><circle cx="13.5" cy="19" r="2.2" fill="#1d1a17"/><circle cx="26.5" cy="19" r="2.2" fill="#1d1a17"/><path d="M20 23 L17.5 28 L22.5 28 Z" fill="#1d1a17"/><path d="M12 32 H28 M15 30 V34 M20 30 V34 M25 30 V34" stroke="#1d1a17" stroke-width="1.3"/><path d="M14 8 Q20 4 26 8" stroke="#ffb02e" stroke-width="2" fill="none"/><circle cx="20" cy="11" r="2" fill="#9bff6a"/></svg>',
    halloween: '<svg viewBox="0 0 40 40"><path d="M20 8 C26 2 30 4 30 4" stroke="#3d7a2a" stroke-width="3" fill="none"/><ellipse cx="13" cy="24" rx="10" ry="12" fill="#ff8a1f"/><ellipse cx="27" cy="24" rx="10" ry="12" fill="#ff8a1f"/><ellipse cx="20" cy="24" rx="8" ry="13" fill="#ffa33a"/><path d="M12 20 L16 24 L10 24 Z M28 20 L24 24 L30 24 Z" fill="#3b1a05"/><path d="M11 29 Q20 36 29 29 L26 30 L24 28 L20 31 L16 28 L14 30 Z" fill="#3b1a05"/></svg>',
    reyes: '<svg viewBox="0 0 40 30"><path d="M4 26 L6 8 L14 16 L20 4 L26 16 L34 8 L36 26 Z" fill="#f1d48a" stroke="#c8963c" stroke-width="1.5"/><circle cx="20" cy="18" r="3" fill="#d8342c"/><circle cx="11" cy="20" r="2" fill="#4fd1ff"/><circle cx="29" cy="20" r="2" fill="#9bff6a"/></svg>',
    sanvalentin: '<svg viewBox="0 0 40 36"><path d="M20 34 C6 24 2 16 2 10 C2 5 6 2 11 2 C15 2 18 5 20 8 C22 5 25 2 29 2 C34 2 38 5 38 10 C38 16 34 24 20 34 Z" fill="#ff3b5c"/><path d="M10 9 Q12 6 15 7" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/></svg>',
    feria: '<svg viewBox="0 0 40 40"><circle cx="20" cy="18" r="13" fill="none" stroke="#f1d48a" stroke-width="2"/><g stroke="#f1d48a" stroke-width="1.2"><path d="M20 5 V31 M7 18 H33 M11 9 L29 27 M29 9 L11 27"/></g><g fill="#ff4fa3"><circle cx="20" cy="5" r="2.4"/><circle cx="33" cy="18" r="2.4" fill="#ffd34d"/><circle cx="20" cy="31" r="2.4" fill="#4fd1ff"/><circle cx="7" cy="18" r="2.4" fill="#9bff6a"/></g><path d="M14 38 L20 18 L26 38" stroke="#c8963c" stroke-width="2" fill="none"/></svg>',
    patrias: '<svg viewBox="0 0 42 30"><rect x="1" y="3" width="13" height="24" fill="#0b8a3e"/><rect x="14" y="3" width="14" height="24" fill="#ffffff"/><rect x="28" y="3" width="13" height="24" fill="#ce1126"/><circle cx="21" cy="15" r="4" fill="#9c6b2e"/></svg>'
  };
  // Cada accesorio hace algo al tocarlo (sin saturar: una reacción corta y un mensaje)
  var CALAVERITAS = [
    T('💀 «La Catrina llegó al Olimpo buscando a quién llevarse, vio páginas tan bonitas que prefirió quedarse.»', '💀 “The Catrina climbed Olympus looking for someone to take, but she saw such lovely websites she stayed for beauty’s sake.”'),
    T('💀 «Hades salió del abismo con su casco invisible, pero al ver tanto detalle irse se le hizo imposible.»', '💀 “Hades rose up from the abyss in his helmet, out of sight, but he saw so many details that he stayed here overnight.”'),
    T('💀 «Dicen que la Calaca no perdona a ningún mortal, pero a los negocios con página los deja en paz, ¡qué tal!»', '💀 “They say Death spares no mortal, no matter where they’re from, but businesses with websites? She says: those are too much fun!”')
  ];
  // Murciélagos con silueta de verdad (Openclipart, dominio público): salen volando en arco, aleteando
  function soltarMurcielagos(n) {
    if (suave) return;
    for (var i = 0; i < n; i++) (function (i) {
      var m = document.createElement('div'); m.className = 'murcielago'; m.setAttribute('aria-hidden', 'true');
      var tam = 26 + Math.random() * 30, x0 = innerWidth * (.15 + Math.random() * .7), y0 = innerHeight * (.55 + Math.random() * .3);
      m.style.width = tam + 'px'; m.style.left = x0 + 'px'; m.style.top = y0 + 'px';
      m.style.setProperty('--dx', ((Math.random() < .5 ? -1 : 1) * (120 + Math.random() * 260)) + 'px');
      m.style.setProperty('--dy', (-(220 + Math.random() * 320)) + 'px');
      m.style.animationDelay = (i * .12) + 's'; m.innerHTML = '<span></span>';
      document.body.appendChild(m); setTimeout(function () { m.remove(); }, 3400 + i * 120);
    })(i);
  }
  var nCal = 0;
  var REACCION = {
    muertos: function (el) { el.classList.add('baila'); setTimeout(function () { el.classList.remove('baila'); }, 900); var r = el.getBoundingClientRect(); C.brasas(r.left + r.width / 2, r.top + r.height / 2, 14, ['#ff9f1c', '#ffd34d', '#ff4fa3']); S.play('muertos'); avisar(CALAVERITAS[nCal++ % CALAVERITAS.length] + T('  (Una calaverita literaria, tradición de Día de Muertos.)', '  (A “calaverita”: a playful Day of the Dead rhyme.)')); },
    halloween: function (el) { el.classList.add('baila'); setTimeout(function () { el.classList.remove('baila'); }, 900); soltarMurcielagos(7); S.play('halloween'); avisar(T('🎃 ¡Dulce o truco! El Olimpo prefiere los dulces… y las páginas con sorpresas.', '🎃 Trick or treat! Olympus prefers treats… and websites full of surprises.')); },
    navidad: function (el) { C.lluviaDe(['❄️', '⭐', '🎁'], 24); S.play('cascabeles'); avisar(T('🎅 El gorrito de Santa le queda bien al Olimpo, ¿no crees?', '🎅 Santa’s hat suits Olympus, doesn’t it?')); },
    reyes: function (el) { var r = el.getBoundingClientRect(); C.brasas(r.left + r.width / 2, r.top, 18, ['#fff6c8', '#f1d48a']); S.play('reyes'); avisar(T('👑 Una corona digna de un rey… o de tu negocio.', '👑 A crown fit for a king… or for your business.')); },
    sanvalentin: function (el) { C.subir(['💗', '💘', '🌹'], innerWidth / 2, innerHeight * .7, 16); S.play('sanvalentin'); avisar(T('💘 Afrodita aprueba este amor por los detalles.', '💘 Aphrodite approves of this love for details.')); },
    feria: function (el) { for (var n = 0; n < 3; n++) setTimeout(function () { C.cohete(innerWidth * (.2 + Math.random() * .6), innerHeight * (.12 + Math.random() * .2)); }, n * 260); S.play('feria'); avisar(T('🎡 ¡Que viva la Feria de San Marcos!', '🎡 Long live the San Marcos Fair!')); },
    patrias: function (el) { for (var n = 0; n < 3; n++) setTimeout(function () { C.cohete(innerWidth * (.2 + Math.random() * .6), innerHeight * (.12 + Math.random() * .2)); }, n * 260); S.play('patrias'); avisar(T('🇲🇽 ¡Viva México!', '🇲🇽 ¡Viva México!')); }
  };
  var logo = $('.logo');
  function ponerAccesorio(tipo) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'accesorio acc-' + tipo; b.innerHTML = ACC[tipo];
    b.setAttribute('aria-label', { muertos: T('Una calaverita de azúcar', 'A sugar skull'), halloween: T('Una calabaza', 'A pumpkin'), navidad: T('El gorrito de Santa', 'Santa’s hat'), reyes: T('Una corona', 'A crown'), sanvalentin: T('Un corazón', 'A heart'), feria: T('Una rueda de la fortuna', 'A Ferris wheel'), patrias: T('La bandera de México', 'The flag of Mexico') }[tipo]);
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); REACCION[tipo](b); });
    logo.appendChild(b);
  }
  if (logo && ACC[f]) { ponerAccesorio(f); if (C.halloween) ponerAccesorio('halloween'); }
  // En Halloween, de noche, de vez en cuando cruzan murciélagos (con silueta y aleteo, no emojis)
  if (C.halloween) { setTimeout(function () { if (C.modo !== 'dia') soltarMurcielagos(3); }, 4000); setInterval(function () { if (C.modo !== 'dia') soltarMurcielagos(3); }, 30000); }
  // El gorro de Navidad se acomoda en la O final de "Olimpo" (se mide la palabra real, en cualquier pantalla)
  var gorro = $('.acc-navidad'), palabra = $('#irInicio');
  function acomodarGorro() {
    if (!gorro || !palabra) return;
    var lr = logo.getBoundingClientRect(), pr = palabra.getBoundingClientRect(), alto = pr.height, ancho = Math.round(alto * .78);
    gorro.style.width = ancho + 'px';
    gorro.style.left = Math.round(pr.right - lr.left - ancho * .95) + 'px';
    gorro.style.top = Math.round(pr.top - lr.top - alto * .22) + 'px';
  }
  if (gorro) { acomodarGorro(); addEventListener('resize', acomodarGorro); if (document.fonts && document.fonts.ready) document.fonts.ready.then(acomodarGorro); }

  // ---------- Papel picado bajo la portada (Muertos, Feria y Patrias) ----------
  var COL_PAPEL = { muertos: ['#ff4fa3', '#ff8a1f', '#9b5cff', '#ffd34d', '#2fc58a'], feria: ['#ff4fa3', '#ffd34d', '#4fd1ff', '#9bff6a', '#ff7a3d'], patrias: ['#0b8a3e', '#ffffff', '#ce1126'] };
  if (COL_PAPEL[f] && $('.portada')) {
    var tira = document.createElement('div'); tira.className = 'papel-picado'; tira.setAttribute('aria-hidden', 'true');
    // Cada banderita trae su propio calado, como el papel picado de verdad: calavera, flor, corazón, estrella, rayo…
    var H = 'fill="#0b0d12" fill-opacity=".62"';   // el "hueco" recortado
    var CALADOS = {
      calavera: function (c) { return '<path d="M28 9 C20 9 16 14 16 20 C16 24 18 26 20 27 L20 31 L36 31 L36 27 C38 26 40 24 40 20 C40 14 36 9 28 9 Z" ' + H + '/><circle cx="23" cy="20" r="3" fill="' + c + '"/><circle cx="33" cy="20" r="3" fill="' + c + '"/><path d="M28 23 L26.5 26 L29.5 26 Z" fill="' + c + '"/><path d="M23 29 H33" stroke="' + c + '" stroke-width="1.2"/>'; },
      flor: function () { var p = ''; for (var k = 0; k < 8; k++) p += '<ellipse cx="28" cy="13" rx="2.6" ry="6" transform="rotate(' + k * 45 + ' 28 20)" ' + H + '/>'; return p + '<circle cx="28" cy="20" r="3.2" ' + H + '/>'; },
      corazon: function () { return '<path d="M28 32 C18 25 15 20 15 16 C15 12 18 10 21 10 C24 10 26 12 28 14 C30 12 32 10 35 10 C38 10 41 12 41 16 C41 20 38 25 28 32 Z" ' + H + '/>'; },
      estrella: function () { return '<path d="M28 7 L31.5 16 L41 16.5 L33.5 22.5 L36 32 L28 26.5 L20 32 L22.5 22.5 L15 16.5 L24.5 16 Z" ' + H + '/>'; },
      rayo: function () { return '<path d="M31 7 L20 22 H27 L24 33 L36 17 H29 Z" ' + H + '/>'; },
      pajaro: function () { return '<path d="M14 22 C18 14 24 14 28 19 C32 14 38 14 42 22 C38 19 34 19 28 24 C22 19 18 19 14 22 Z" ' + H + '/><circle cx="28" cy="27" r="2" ' + H + '/>'; }
    };
    var orden = f === 'muertos' ? ['calavera', 'flor', 'pajaro', 'corazon', 'calavera', 'estrella', 'rayo'] : f === 'patrias' ? ['estrella', 'flor', 'pajaro', 'corazon', 'rayo'] : ['estrella', 'flor', 'corazon', 'pajaro', 'rayo'];
    var s = '<svg viewBox="0 0 1200 70" preserveAspectRatio="none"><path d="M0 4 Q600 26 1200 4" stroke="#c9b48a" stroke-width="2" fill="none"/>';
    // En Fiestas Patrias, las banderitas del centro dicen ¡VIVA MÉXICO! (una letra en cada una)
    var letras = f === 'patrias' ? '¡VIVA  MÉXICO!'.split('') : null;
    for (var i = 0; i < 16; i++) {
      var x = 20 + i * 74, y = 5 + Math.sin(i / 15 * Math.PI) * 11, c = COL_PAPEL[f][i % COL_PAPEL[f].length], celo = '';
      for (var e2 = 0; e2 < 6; e2++) celo += '<path d="M' + (6 + e2 * 9) + ' 3.5 l2.5 2.5 l-2.5 2.5 l-2.5 -2.5 Z" ' + H + '/>';   // greca de rombitos arriba
      var letra = letras && i >= 1 && i <= 14 ? letras[i - 1] : '', dibujo;
      if (letra && letra !== ' ') dibujo = '<text x="28" y="31" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="700" font-size="25" fill="' + (c === '#ffffff' ? '#0b8a3e' : '#ffffff') + '">' + letra + '</text>';
      else dibujo = CALADOS[orden[i % orden.length]](c);
      s += '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 0 H56 V40 L48 48 L40 40 L32 48 L24 40 L16 48 L8 40 L0 48 Z" fill="' + c + '" opacity=".94"/>' + celo + dibujo +
        '<path d="M4 37 H52" stroke="#0b0d12" stroke-opacity=".4" stroke-width="1.4" stroke-dasharray="3 3"/></g>';
    }
    tira.innerHTML = s + '</svg>'; $('.portada').appendChild(tira);
  }

  // ---------- Día de Muertos: altar y camino de cempasúchil que brilla en modo oscuro ----------
  if (f === 'muertos') {
    var camino = document.createElement('div'); camino.className = 'cempasuchil'; camino.setAttribute('aria-hidden', 'true');
    escena.appendChild(camino);
    // Camino en perspectiva: nace cerca de quien mira (pétalos grandes) y llega DIRECTO a la base del altar
    // (pétalos diminutos). Se calcula con la posición real del altar y se vuelve a trazar si cambia la pantalla.
    function trazarCamino() {
      var cr = camino.getBoundingClientRect(), ar = altar.getBoundingClientRect();
      var W = Math.max(1, cr.width), Hh = Math.max(1, cr.height);
      var ex = ar.left + ar.width * .5 - cr.left, ey = ar.top + ar.height * .949 - cr.top;   // base del altar
      var sx = W * .6, sy = Hh + 6;                                                      // cerca, abajo
      var p1x = W * .72, p1y = Hh * .55, p2x = ex + W * .28, p2y = ey + (Hh - ey) * .2;    // curva suave en S
      var bz = function (t, a, b, c, d) { var u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
      var esc = Math.min(1.25, Math.max(.7, W / 1300));                                     // tamaño según la pantalla
      var s = '<svg viewBox="0 0 ' + W.toFixed(0) + ' ' + Hh.toFixed(0) + '">', velas = '', flores = '';
      // Azar con semilla: el camino se ve natural, pero es el mismo cada vez que se vuelve a trazar
      var semilla = 7; var rnd = function () { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; };
      var tonosP = ['#ff9f1c', '#ffb02e', '#ff8a1f', '#ffc23a', '#ff7a1a'];
      var anchoFin = Math.max(3, ar.width * .13);
      var flor = function (x, y, r) { return '<g class="petalo-c"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#ff8a1f"/><circle cx="' + x.toFixed(1) + '" cy="' + (y - r * .08).toFixed(1) + '" r="' + (r * .7).toFixed(1) + '" fill="#ffa52a"/><circle cx="' + x.toFixed(1) + '" cy="' + (y - r * .12).toFixed(1) + '" r="' + (r * .38).toFixed(1) + '" fill="#ffd34d"/></g>'; };
      // De lejos hacia cerca, para que los pétalos grandes queden encima
      var pasos = W < 760 ? 63 : 89, densidad = W < 760 ? .8 : 1;   // en celular, menos pétalos (no se nota y va más fluido)
      for (var k = pasos; k >= 0; k--) {
        var t = k / pasos, lejos = Math.pow(t, .75), px = bz(t, sx, p1x, p2x, ex), py = bz(t, sy, p1y, p2y, ey);
        var r = Math.max(.9, (6 - lejos * 4.9) * esc), ancho = (62 * esc) * (1 - lejos) + anchoFin * lejos;
        // El camino va lleno de pétalos, de orilla a orilla
        var n = Math.max(3, Math.round(ancho * 2 / (r * 1.9) * densidad));
        for (var p = 0; p < n; p++) {
          var ox = -ancho + (p + .5) * (ancho * 2 / n) + (rnd() - .5) * r * 1.2, oy = (rnd() - .5) * r * 1.1;
          s += '<ellipse cx="' + (px + ox).toFixed(1) + '" cy="' + (py + oy).toFixed(1) + '" rx="' + (r * (.8 + rnd() * .4)).toFixed(1) + '" ry="' + (r * .55).toFixed(1) +
            '" transform="rotate(' + Math.round(rnd() * 180) + ' ' + (px + ox).toFixed(1) + ' ' + (py + oy).toFixed(1) + ')" fill="' + tonosP[Math.floor(rnd() * tonosP.length)] + '"/>';
        }
        // Y flores de cempasúchil enteras en las orillas
        if (k % (W < 760 ? 3 : 4) === 0) for (var lado = -1; lado <= 1; lado += 2) flores += flor(px + lado * (ancho + r * .6), py, r * 2);
        // Velitas que acompañan el último tramo, como las que alumbran el camino a casa
        if (k === Math.round(pasos * .65) || k === Math.round(pasos * .81) || k === Math.round(pasos * .94)) {
          var hv = (9 - lejos * 5) * esc, wv = Math.max(1.6, 3.2 * esc * (1 - lejos * .5));
          for (var l2 = -1; l2 <= 1; l2 += 2) {
            var vx = px + l2 * (ancho + r * 2.8 + 4 * esc), vy = py;
            velas += '<rect x="' + (vx - wv / 2).toFixed(1) + '" y="' + (vy - hv).toFixed(1) + '" width="' + wv.toFixed(1) + '" height="' + hv.toFixed(1) + '" rx=".6" fill="#fbf4e6"/>' +
              '<ellipse class="llamita" cx="' + vx.toFixed(1) + '" cy="' + (vy - hv - hv * .35).toFixed(1) + '" rx="' + (wv * .55).toFixed(1) + '" ry="' + (hv * .38).toFixed(1) + '" fill="#ffd34d"/>';
          }
        }
      }
      // Un tapetito de pétalos al pie del altar, donde termina el camino
      for (var q2 = 0; q2 < 14; q2++) {
        var an2 = q2 / 14 * Math.PI * 2, rr = ar.width * .34;
        s += '<circle class="petalo-c" cx="' + (ex + Math.cos(an2) * rr * (q2 % 2 ? .6 : 1)).toFixed(1) + '" cy="' + (ey + 2 + Math.sin(an2) * rr * .16).toFixed(1) + '" r="' + (1.6 * esc + (q2 % 3) * .4).toFixed(1) + '" fill="' + (q2 % 3 ? '#ff9f1c' : '#ffc23a') + '"/>';
      }
      camino.innerHTML = s + flores + '<g class="velas-camino">' + velas + '</g></svg>';
    }
    // Altar de tres niveles, pequeño y a lo lejos sobre las dunas, lleno de detalles
    var cempa = function (x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#ff9f1c"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * .55) + '" fill="#ffc23a"/>'; };
    var arco = ''; for (var a1 = 0; a1 <= 18; a1++) { var an = Math.PI - a1 / 18 * Math.PI; arco += cempa((100 + Math.cos(an) * 84).toFixed(1), (112 - Math.sin(an) * 92).toFixed(1), a1 % 2 ? 5 : 6); }
    var calavera = function (x, y, c1, c2b) { return '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 -7 C-5 -7 -7 -3 -7 0 C-7 3 -5 4 -4 5 L-4 7 L4 7 L4 5 C5 4 7 3 7 0 C7 -3 5 -7 0 -7 Z" fill="#fbf4e6"/><circle cx="-2.6" cy="0" r="1.8" fill="' + c1 + '"/><circle cx="2.6" cy="0" r="1.8" fill="' + c2b + '"/><path d="M-2 5 H2" stroke="#1d1a17" stroke-width=".8"/></g>'; };
    var vela = function (x, y, h) { return '<rect x="' + (x - 2.5) + '" y="' + (y - h) + '" width="5" height="' + h + '" rx="1" fill="#fbf4e6"/><ellipse class="llamita" cx="' + x + '" cy="' + (y - h - 4) + '" rx="2.4" ry="4.2" fill="#ffd34d"/><ellipse cx="' + x + '" cy="' + (y - h - 3) + '" rx="1" ry="2" fill="#fff"/>'; };
    // Altar de 7 niveles, como dice la tradición (de abajo hacia arriba):
    // 1 la tierra: velas, copal y cempasúchil · 2 calaveritas de azúcar · 3 las fotos de quienes recordamos
    // 4 su comida favorita, fruta y jarrito · 5 pan de muerto y el vaso de agua · 6 la sal · 7 la cruz, en lo más alto
    arco = ''; for (var a2 = 0; a2 <= 22; a2++) { var an3 = Math.PI - a2 / 22 * Math.PI; arco += cempa((100 + Math.cos(an3) * 93).toFixed(1), (192 - Math.sin(an3) * 176).toFixed(1), a2 % 2 ? 4.6 : 5.6); }
    var papelAltar = ''; ['#ff4fa3', '#ff8a1f', '#9b5cff', '#ffd34d', '#2fc58a', '#ff4fa3', '#9b5cff'].forEach(function (cc, i) { papelAltar += '<path d="M' + (44 + i * 16) + ' 26 h14 v9 l-3.5 3 l-3.5 -3 l-3.5 3 l-3.5 -3 Z" fill="' + cc + '"/>'; });
    var tonos = ['#4a1f63', '#6a2f8a', '#8e2a8a', '#c2185b', '#e0457b', '#ff8a1f', '#ffb43a'], flecos = ['#ffd34d', '#2fc58a', '#4fd1ff', '#ff4fa3', '#fbf4e6'];
    var yt = function (g) { return 196 - (g + 1) * 18; };
    var gradas = '<rect x="4" y="196" width="192" height="6" rx="1" fill="#c98a3c"/><path d="M4 199 h192 M4 201 h192" stroke="#8a5a2a" stroke-width=".6"/>';
    for (var g = 0; g < 7; g++) {
      var w = 172 - g * 20, gx = 100 - w / 2;
      gradas += '<rect x="' + gx + '" y="' + yt(g) + '" width="' + w + '" height="18" fill="' + tonos[g] + '"/>';
      for (var z = 0; z < Math.floor(w / 8); z++) gradas += '<path d="M' + (gx + z * 8) + ' ' + yt(g) + ' h8 l-4 5 Z" fill="' + flecos[(z + g) % flecos.length] + '" opacity=".9"/>';
    }
    var pan = function (x, y) { return '<ellipse cx="' + x + '" cy="' + (y - 4) + '" rx="7" ry="4.5" fill="#c98a3c"/><path d="M' + (x - 5) + ' ' + (y - 5) + ' h10 M' + x + ' ' + (y - 8) + ' v7" stroke="#f1d48a" stroke-width="1.4" stroke-linecap="round"/><circle cx="' + x + '" cy="' + (y - 8.5) + '" r="1.4" fill="#f1d48a"/>'; };
    var foto = function (x, y, ww, hh) { return '<rect x="' + (x - ww / 2) + '" y="' + (y - hh) + '" width="' + ww + '" height="' + hh + '" rx="1" fill="#2a1a10" stroke="#f1d48a" stroke-width="1.4"/><circle cx="' + x + '" cy="' + (y - hh * .62) + '" r="' + (ww * .18) + '" fill="#6a5040"/><path d="M' + (x - ww * .32) + ' ' + (y - 1.5) + ' Q' + x + ' ' + (y - hh * .45) + ' ' + (x + ww * .32) + ' ' + (y - 1.5) + '" fill="#6a5040"/>'; };
    // El arco se arma sobre caña de azúcar, como en los pueblos
    var cana = '<path d="M7 192 C7 60 52 16 100 16 C148 16 193 60 193 192" stroke="#7fae3a" stroke-width="2.2" fill="none"/>';
    var altar = boton('<svg viewBox="0 -64 200 274">' + cana + arco + papelAltar + gradas +
      // En el petate: la cruz de pétalos, para que el alma se oriente
      '<circle cx="100" cy="199" r="1.6" fill="#ffc23a"/><circle cx="96" cy="199" r="1.4" fill="#ff9f1c"/><circle cx="104" cy="199" r="1.4" fill="#ff9f1c"/><circle cx="92" cy="199" r="1.2" fill="#ff9f1c"/><circle cx="108" cy="199" r="1.2" fill="#ff9f1c"/>' +
      // Nivel 1, la tierra: copal, sombrero, mezcal, un juguete y flores
      '<path d="M92 178 h16 l-3 -7 h-10 Z" fill="#8a5a3a"/><ellipse cx="100" cy="171" rx="4" ry="1.4" fill="#ff7a2a"/>' +
      '<ellipse cx="68" cy="176" rx="9" ry="2" fill="#d9b26a"/><path d="M63 176 q5 -9 10 0 Z" fill="#e8c77e"/>' +
      '<rect x="118" y="164" width="5" height="14" rx="1.5" fill="#7a9a5a"/><rect x="119.3" y="160" width="2.4" height="5" fill="#7a9a5a"/>' +
      '<circle cx="134" cy="174.5" r="3.5" fill="#4fd1ff"/><path d="M130.5 174.5 h7" stroke="#ff4fa3" stroke-width="1.2"/>' +
      cempa(38, 173, 5.5) + cempa(50, 174, 4.5) + cempa(150, 174, 4.5) + cempa(162, 173, 5.5) +
      // Nivel 2, las fotos de quienes recordamos
      foto(100, 160, 18, 20) + foto(68, 160, 12, 14) + foto(132, 160, 12, 14) + cempa(32, 156, 4.5) + cempa(168, 156, 4.5) +
      // Nivel 3, su comida y bebida favoritas, la fruta y el jarrito
      '<circle cx="56" cy="138" r="3.6" fill="#ff8a1f"/><circle cx="62" cy="139" r="3.4" fill="#ffa53a"/><path d="M134 141 q6 -9 12 -4 q-6 -1 -12 4 Z" fill="#ffd34d"/>' +
      '<ellipse cx="100" cy="140" rx="9" ry="2.8" fill="#fbf4e6"/><ellipse cx="100" cy="139" rx="6.5" ry="1.8" fill="#8a2a1a"/>' +
      '<path d="M116 142 h7 l1 -6 q-4.5 -3 -9 0 Z" fill="#b5562a"/><path d="M124 138 q3 0 2 3" stroke="#b5562a" stroke-width="1.2" fill="none"/>' +
      // Nivel 4, pan de muerto y vaso de agua
      pan(74, 124) + pan(126, 124) + '<rect x="96.5" y="114" width="7" height="10" rx="1" fill="#9fd8ff" opacity=".85"/><rect x="96.5" y="114" width="7" height="2" fill="#e6f6ff"/>' +
      // Nivel 5, la sal
      '<ellipse cx="100" cy="105" rx="8" ry="2.4" fill="#e8e0d0"/><path d="M94 105 q6 -7 12 0 Z" fill="#ffffff"/>' +
      // Nivel 6, las ánimas: velitas y calaveritas de azúcar
      calavera(86, 81, '#ff4fa3', '#4fd1ff') + calavera(114, 81, '#9bff6a', '#ff8a1f') +
      // Nivel 7, lo más alto: la cruz
      '<rect x="98.4" y="50" width="3.2" height="20" fill="#f1d48a"/><rect x="92.5" y="55.5" width="15" height="3.2" fill="#f1d48a"/>' +
      '<g class="velas">' + vela(22, 178, 15) + vela(178, 178, 15) + vela(48, 160, 9) + vela(152, 160, 9) + vela(44, 142, 9) + vela(156, 142, 9) +
        vela(74, 106, 7) + vela(126, 106, 7) + vela(70, 88, 7) + vela(130, 88, 7) + vela(84, 70, 7) + vela(116, 70, 7) + '</g>' +
      // El humo del copal sube en un hilo hasta lo más alto… y se vuelve calaverita, luego cruz, luego vela
      '<path class="humo" pathLength="100" d="M100 170 C94 150 106 130 100 110 C94 90 106 70 100 48 C95 28 105 8 100 -10 C98 -15 100 -18 100 -22" stroke="#efe8dc" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<g class="humo-forma f1" stroke="#efe8dc" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
        '<path pathLength="100" d="M100 -22 C88 -22 86 -32 86 -40 C86 -50 93 -56 100 -56 C107 -56 114 -50 114 -40 C114 -32 112 -22 100 -22"/>' +
        '<circle pathLength="100" cx="94.5" cy="-41" r="3.2"/><circle pathLength="100" cx="105.5" cy="-41" r="3.2"/><path pathLength="100" d="M100 -36 l-1.6 3 h3.2 Z"/><path pathLength="100" d="M94 -27 h12 M97 -29.5 v5 M100 -29.5 v5 M103 -29.5 v5"/></g>' +
      '<g class="humo-forma f2" stroke="#efe8dc" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
        '<path pathLength="100" d="M97.5 -22 V-38 H89 C86 -38 86 -44 89 -44 H97.5 V-53 C97.5 -57 102.5 -57 102.5 -53 V-44 H111 C114 -44 114 -38 111 -38 H102.5 V-22 Z"/>' +
        '<circle pathLength="100" cx="100" cy="-41" r="1.8"/></g>' +
      '<g class="humo-forma f3" stroke="#efe8dc" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
        '<path pathLength="100" d="M94 -22 V-42 Q100 -44 106 -42 V-22 Z"/><path pathLength="100" d="M100 -44 V-47"/>' +
        '<path pathLength="100" d="M100 -47 C95.5 -51 97.5 -56 100 -61 C102.5 -56 104.5 -51 100 -47 Z"/></g>' +
      '</svg>', 'altar', T('Un altar de muertos de siete niveles', 'A seven-level Day of the Dead altar'));
    altar.addEventListener('click', function () {
      altar.classList.add('vivo'); setTimeout(function () { altar.classList.remove('vivo'); }, 2400);
      var r = altar.getBoundingClientRect(); for (var n = 0; n < 4; n++) C.brasas(r.left + r.width * (.2 + n * .2), r.top + r.height * .45, 6, ['#ffd34d', '#ff9f1c', '#ffffff']);
      C.lluviaDe(['🌼', '🧡', '🌼'], 26); S.play('muertos');
      avisar(T('🕯️ El altar guía a las almas de regreso a casa con la luz de las velas y el aroma del cempasúchil. El Olimpo también recuerda.', '🕯️ The altar guides souls back home with candlelight and the scent of marigolds. Olympus remembers too.'));
    });
    // El xoloitzcuintle: sentado al final del camino, junto al altar. Con cada clic explica un nivel.
    var xolo = boton('<svg viewBox="0 0 40 50">' +
      '<path d="M31 43 C38 41 38 33 35 30" stroke="#1c1a1f" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M14 2 L18.5 14 L11.5 15 Z M27 2 L22.5 14 L29.5 15 Z" fill="#1c1a1f"/><path d="M14.6 5.5 L16.8 12.5 L13.2 13 Z M26.4 5.5 L24.2 12.5 L27.8 13 Z" fill="#4a3a44"/>' +
      '<path d="M15 21 C12 28 11 37 12.5 46 L29 46 C31 37 28.5 27 25.5 21 Z" fill="#1c1a1f"/><ellipse cx="27" cy="41" rx="6" ry="5.2" fill="#1c1a1f"/>' +
      '<rect x="15.5" y="33" width="3" height="14" rx="1.4" fill="#1c1a1f"/><rect x="22" y="33" width="3" height="14" rx="1.4" fill="#1c1a1f"/>' +
      '<ellipse cx="20.5" cy="16" rx="7.5" ry="6.6" fill="#1c1a1f"/><ellipse cx="20.5" cy="21" rx="3.8" ry="3" fill="#1c1a1f"/><circle cx="20.5" cy="19.6" r="1" fill="#4a3a44"/>' +
      '<circle class="ojo" cx="17.6" cy="15" r="1" fill="#ffd34d"/><circle class="ojo" cx="23.4" cy="15" r="1" fill="#ffd34d"/>' +
      '<path d="M15.5 25 Q20.5 28 25.5 25" stroke="#ff8a1f" stroke-width="1.6" fill="none"/><circle cx="20.5" cy="27.4" r="2" fill="#ff9f1c"/><circle cx="20.5" cy="27.4" r="1.1" fill="#ffd34d"/>' +
      '</svg>', 'xolo', T('Un xoloitzcuintle que explica el altar', 'A xoloitzcuintle who explains the altar'));
    var guia = [
      ['🐕 ¡Guau! Soy un xoloitzcuintle. Según la tradición mexica, ayudo a las almas a cruzar el río hacia el Mictlán. Dame clic y te explico el altar, nivel por nivel.', '🐕 Woof! I am a xoloitzcuintle. In Mexica tradition, I help souls cross the river to Mictlán. Click me and I will explain the altar, level by level.'],
      ['Hay muchas versiones del altar de siete niveles; esta es de las más conocidas. 1️⃣ Abajo está la tierra: la cruz de pétalos, el copal, las velas y algunos objetos que la persona quería.', 'There are many versions of the seven-level altar; this is one of the best known. 1️⃣ At the bottom is the earth: the petal cross, copal, candles and a few things the person loved.'],
      ['2️⃣ Las fotos de quienes recordamos. Se ponen para que sepan que esta ofrenda es para ellos.', '2️⃣ Photos of those we remember, so they know this offering is for them.'],
      ['3️⃣ Su comida y bebida favoritas, la fruta y el jarrito. Llegan con hambre del largo viaje.', '3️⃣ Their favorite food and drink, fruit and the clay jug. They arrive hungry from the long journey.'],
      ['4️⃣ El pan de muerto y un vaso de agua, para calmar la sed del camino. El pan lleva "huesitos" encima.', '4️⃣ Pan de muerto and a glass of water to quench the thirst of the road. The bread has little "bones" on top.'],
      ['5️⃣ La sal, que purifica y protege a las almas en su camino.', '5️⃣ Salt, which purifies and protects souls on their way.'],
      ['6️⃣ Las ánimas: velitas para iluminarlas y calaveritas de azúcar, que nos recuerdan la muerte con dulzura.', '6️⃣ The souls: candles to light their way and sugar skulls, which remind us of death with sweetness.'],
      ['7️⃣ Lo más alto: la cruz, el puente entre el cielo y la tierra.', '7️⃣ The very top: the cross, the bridge between heaven and earth.'],
      ['🌼 El arco de cempasúchil es la puerta al mundo de los muertos, y el camino de pétalos les enseña por dónde llegar a casa. Su color y su aroma los guían. ¡Gracias por recordar conmigo!', '🌼 The marigold arch is the doorway to the world of the dead, and the petal path shows them the way home. Its color and scent guide them. Thank you for remembering with me!']
    ];
    var paso = 0;
    xolo.addEventListener('click', function () {
      xolo.classList.remove('salta'); void xolo.offsetWidth; xolo.classList.add('salta');
      avisar(T(guia[paso][0], guia[paso][1]), 9000); paso = (paso + 1) % guia.length;
    });
    trazarCamino();
    var tCamino; addEventListener('resize', function () { clearTimeout(tCamino); tCamino = setTimeout(trazarCamino, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(trazarCamino);
  }

  // ---------- Tu foto también se viste para la fiesta ----------
  var med = $('.medallon');
  var ROPA = {
    muertos: function () { var s = '<svg viewBox="0 0 260 260" class="corona-flores">'; for (var i = 0; i < 26; i++) { var a = i / 26 * Math.PI * 2, x = 130 + Math.cos(a) * 118, y = 130 + Math.sin(a) * 118, r = i % 2 ? 9 : 11; s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="#ff9f1c"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r * .5) + '" fill="#ffc23a"/>'; } return s + '</svg><span class="pin-foto">' + ACC.muertos + '</span>'; },
    navidad: function () { return '<span class="gorro-foto">' + ACC.navidad + '</span>'; },
    reyes: function () { return '<span class="gorro-foto corona-foto">' + ACC.reyes + '</span>'; },
    sanvalentin: function () { return '<span class="pin-foto">' + ACC.sanvalentin + '</span>'; },
    patrias: function () { return '<span class="pin-foto">' + ACC.patrias + '</span>'; },
    feria: function () { return '<span class="pin-foto">' + ACC.feria + '</span>'; }
  };
  if (med && ROPA[f]) { var ropa = document.createElement('div'); ropa.className = 'ropa-fiesta'; ropa.setAttribute('aria-hidden', 'true'); ropa.innerHTML = ROPA[f](); med.appendChild(ropa); }

  // ---------- Feria de San Marcos: rueda de la fortuna gigante detrás de las dunas ----------
  if (f === 'feria') {
    var rueda = '<svg viewBox="0 0 200 220"><path d="M70 220 L100 100 L130 220" stroke="#5a4030" stroke-width="6" fill="none"/><g class="giro-rueda"><circle cx="100" cy="100" r="88" fill="none" stroke="#c9b48a" stroke-width="4"/><circle cx="100" cy="100" r="70" fill="none" stroke="#c9b48a" stroke-width="2"/>';
    for (var g = 0; g < 12; g++) { var a = g * 30 * Math.PI / 180, gx = 100 + Math.cos(a) * 88, gy = 100 + Math.sin(a) * 88; rueda += '<line x1="100" y1="100" x2="' + gx.toFixed(1) + '" y2="' + gy.toFixed(1) + '" stroke="#c9b48a" stroke-width="1.6"/><circle class="foquito" cx="' + gx.toFixed(1) + '" cy="' + gy.toFixed(1) + '" r="5" fill="' + ['#ff4fa3', '#ffd34d', '#4fd1ff', '#9bff6a'][g % 4] + '"/><rect x="' + (gx - 7).toFixed(1) + '" y="' + (gy + 4).toFixed(1) + '" width="14" height="10" rx="2" fill="#d8342c"/>'; }
    rueda += '<circle cx="100" cy="100" r="8" fill="#f1d48a"/></g></svg>';
    var rb = boton(rueda, 'rueda', T('La rueda de la fortuna de la Feria', 'The fair’s Ferris wheel'), astros);
    rb.addEventListener('click', function () {
      rb.classList.add('rapida'); setTimeout(function () { rb.classList.remove('rapida'); }, 3000); S.play('feria');
      for (var n = 0; n < 4; n++) setTimeout(function () { C.cohete(innerWidth * (.15 + Math.random() * .7), innerHeight * (.12 + Math.random() * .25)); }, n * 280);
      avisar(T('🎡 ¡La Feria Nacional de San Marcos, la más grande de México, aquí en Aguascalientes!', '🎡 The San Marcos National Fair, the biggest in Mexico, right here in Aguascalientes!'));
    });
  }

  // ---------- Navidad: Santa cruza el cielo de vez en cuando ----------
  if (f === 'navidad') {
    // Silueta de Santa y sus renos (Openclipart, dominio público). La nariz de Rodolfo brilla roja al frente.
    var trineo = boton('<span class="silueta"></span><span class="nariz"></span>', 'trineo', T('El trineo de Santa', 'Santa’s sleigh'), astros);
    var vuelos = 0;
    function pasar() { if (suave || C.modo === 'dia') return;   // Santa solo vuela de noche
      trineo.classList.remove('vuela-trineo'); void trineo.offsetWidth; trineo.classList.add('vuela-trineo'); vuelos++; }   // pasa en silencio: la melodía suena solo si lo tocan
    setTimeout(pasar, 2500); setInterval(pasar, C.pico ? 14000 : 26000);
    trineo.addEventListener('click', function () {
      var r = trineo.getBoundingClientRect(); C.lluviaDe(['🎁', '⭐', '🎁'], 22); S.play('trineo');
      avisar(T('🎅 ¡Jo, jo, jo! Santa te deja un regalo: una página que tus clientes no van a olvidar.', '🎅 Ho, ho, ho! Santa leaves you a gift: a website your customers won’t forget.'));
    });
  }

  // ---------- Reyes Magos: la caravana cruza las dunas ----------
  if (f === 'reyes') {
    // Los Reyes Magos son las tres estrellas del cielo de noche (como las conoce la gente: el cinturón de Orión)
    // La estrella más grande del cielo (se dibuja en el cielo de noche); este botón invisible la sigue para poder tocarla
    var guia = boton('', 'toque-estrella', T('La estrella que guía a los Reyes', 'The star guiding the Kings'), document.body);
    (function seguir() {
      var e = C.estrellaReyes;
      if (e && e.visible) { guia.style.display = 'block'; guia.style.transform = 'translate(' + (e.x - 26) + 'px,' + (e.y - 26) + 'px)'; } else guia.style.display = 'none';
      requestAnimationFrame(seguir);
    })();
    guia.addEventListener('click', function () {
      var e = C.estrellaReyes; if (e) C.brasas(e.x, e.y, 22, ['#fff6c8', '#f1d48a', '#ffffff']); S.play('reyes');
      avisar(T('⭐ Melchor, Gaspar y Baltasar brillan en el cielo de noche. ¿Ya partiste la rosca?', '⭐ Melchior, Caspar and Balthazar shine in the night sky. Have you cut the rosca yet?'));
    });
  }

  // ---------- Fiestas Patrias: una bandera a lo lejos, sobre las dunas, ondeando; al tocarla se ilumina ----------
  if (f === 'patrias') {
    var bandera = boton('<svg viewBox="0 0 60 80"><rect x="4" y="2" width="2.4" height="78" rx="1" fill="#6b5236"/><circle cx="5.2" cy="2.2" r="2.2" fill="#d9b066"/>' +
      '<g class="tela"><path d="M6.4 6 Q20 2 33 6 T60 6 V36 Q46 32 33 36 T6.4 36 Z" fill="#ffffff"/>' +
      '<path d="M6.4 6 Q12 4.6 24 4.4 V34.4 Q12 34.6 6.4 36 Z" fill="#0b8a3e"/><path d="M42 4.6 Q51 5.6 60 6 V36 Q51 35.6 42 34.6 Z" fill="#ce1126"/>' +
      '<ellipse cx="33" cy="20.5" rx="3.6" ry="3" fill="#8a5a2a"/><path d="M29.5 23 Q33 26 36.5 23" stroke="#2f7a3a" stroke-width="1" fill="none"/></g></svg>',
      'bandera-dunas', T('La bandera de México, a lo lejos', 'The flag of Mexico, in the distance'));
    bandera.addEventListener('click', function () {
      bandera.classList.remove('iluminada'); void bandera.offsetWidth; bandera.classList.add('iluminada');
      var r = bandera.getBoundingClientRect(); C.brasas(r.left + r.width * .6, r.top + r.height * .25, 18, ['#0b8a3e', '#ffffff', '#ce1126']); S.play('patrias');
      avisar(T('🇲🇽 ¡Viva México!', '🇲🇽 ¡Viva México!'));
    });
  }

  // ---------- Tocar el cielo lanza fuegos artificiales (Año Nuevo, Feria y Patrias) ----------
  if (f === 'anonuevo' || f === 'feria' || f === 'patrias') {
    document.addEventListener('click', function (e) {
      if (document.documentElement.classList.contains('en-templo') || $('#codice.abierto')) return;
      if (e.target.closest('a, button, input, nav, .vidrio, .servicio, .paso, h1, h2, h3, p, .reto, #codice')) return;
      C.cohete(e.clientX, Math.max(innerHeight * .08, e.clientY));
    });
  }

  // ---------- El gran día: saludo especial y sonido ----------
  var GRAN = {
    muertos: C.halloween ? T('🎃 ¡Feliz Halloween! Hoy el Olimpo se llena de calabazas y murciélagos.', '🎃 Happy Halloween! Today Olympus fills with pumpkins and bats.') : T('💀 Hoy es Día de Muertos: el camino de cempasúchil brilla con más fuerza para guiar a quienes regresan.', '💀 Today is Day of the Dead: the marigold path shines brighter to guide those who return.'),
    navidad: T('🎄 ¡Feliz Navidad! Hoy Santa pasa más seguido por el Olimpo.', '🎄 Merry Christmas! Today Santa flies over Olympus more often.'),
    anonuevo: T('🎆 ¡Feliz ' + (new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear()) + '! Que este sea el año de tu negocio.', '🎆 Happy ' + (new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear()) + '! May this be your business’s year.'),
    reyes: T('👑 ¡Feliz Día de Reyes!', '👑 Happy Three Kings’ Day!'),
    sanvalentin: T('💘 ¡Feliz Día del Amor y la Amistad!', '💘 Happy Valentine’s Day!'),
    feria: T('🎡 ¡Hoy es día de San Marcos! La feria está en su punto.', '🎡 Today is Saint Mark’s Day! The fair is at its peak.'),
    patrias: T('🇲🇽 ¡Viva México! Hoy se da el grito.', '🇲🇽 ¡Viva México! Tonight is the Grito de Independencia.')
  };
  if (C.pico && GRAN[f]) setTimeout(function () { avisar(GRAN[f]); }, 6800);
})();
