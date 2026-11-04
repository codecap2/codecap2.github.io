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
  function avisar(txt) { var a = $('#aviso'); if (!a) return; a.textContent = txt; a.classList.add('visible'); clearTimeout(avisar.t); avisar.t = setTimeout(function () { a.classList.remove('visible'); }, 4200); }
  function boton(html, clase, etiqueta, donde) { var b = document.createElement('button'); b.type = 'button'; b.className = 'escena ' + clase; b.innerHTML = html; b.setAttribute('aria-label', etiqueta); (donde || escena).appendChild(b); return b; }

  // ---------- Accesorios junto al logo ----------
  var ACC = {
    navidad: '<svg viewBox="0 0 40 34"><path d="M4 26 C8 10 20 2 32 6 C36 8 37 14 34 18 C28 14 20 16 14 26 Z" fill="#d8342c"/><path d="M2 24 Q18 20 30 26 Q31 32 18 32 Q4 32 2 24 Z" fill="#f4efe6"/><circle cx="35" cy="20" r="4" fill="#f4efe6"/></svg>',
    muertos: '<svg viewBox="0 0 40 40"><path d="M20 3 C9 3 4 11 4 19 C4 25 8 28 10 30 L10 36 L30 36 L30 30 C32 28 36 25 36 19 C36 11 31 3 20 3 Z" fill="#fbf4e6"/><circle cx="13.5" cy="19" r="5" fill="#ff4fa3"/><circle cx="26.5" cy="19" r="5" fill="#4fd1ff"/><circle cx="13.5" cy="19" r="2.2" fill="#1d1a17"/><circle cx="26.5" cy="19" r="2.2" fill="#1d1a17"/><path d="M20 23 L17.5 28 L22.5 28 Z" fill="#1d1a17"/><path d="M12 32 H28 M15 30 V34 M20 30 V34 M25 30 V34" stroke="#1d1a17" stroke-width="1.3"/><path d="M14 8 Q20 4 26 8" stroke="#ffb02e" stroke-width="2" fill="none"/><circle cx="20" cy="11" r="2" fill="#9bff6a"/></svg>',
    halloween: '<svg viewBox="0 0 40 40"><path d="M20 8 C26 2 30 4 30 4" stroke="#3d7a2a" stroke-width="3" fill="none"/><ellipse cx="13" cy="24" rx="10" ry="12" fill="#ff8a1f"/><ellipse cx="27" cy="24" rx="10" ry="12" fill="#ff8a1f"/><ellipse cx="20" cy="24" rx="8" ry="13" fill="#ffa33a"/><path d="M12 20 L16 24 L10 24 Z M28 20 L24 24 L30 24 Z" fill="#3b1a05"/><path d="M11 29 Q20 36 29 29 L26 30 L24 28 L20 31 L16 28 L14 30 Z" fill="#3b1a05"/></svg>',
    reyes: '<svg viewBox="0 0 40 30"><path d="M4 26 L6 8 L14 16 L20 4 L26 16 L34 8 L36 26 Z" fill="#f1d48a" stroke="#c8963c" stroke-width="1.5"/><circle cx="20" cy="18" r="3" fill="#d8342c"/><circle cx="11" cy="20" r="2" fill="#4fd1ff"/><circle cx="29" cy="20" r="2" fill="#9bff6a"/></svg>',
    sanvalentin: '<svg viewBox="0 0 40 36"><path d="M20 34 C6 24 2 16 2 10 C2 5 6 2 11 2 C15 2 18 5 20 8 C22 5 25 2 29 2 C34 2 38 5 38 10 C38 16 34 24 20 34 Z" fill="#ff3b5c"/><path d="M10 9 Q12 6 15 7" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/></svg>',
    feria: '<svg viewBox="0 0 40 40"><circle cx="20" cy="18" r="13" fill="none" stroke="#f1d48a" stroke-width="2"/><g stroke="#f1d48a" stroke-width="1.2"><path d="M20 5 V31 M7 18 H33 M11 9 L29 27 M29 9 L11 27"/></g><g fill="#ff4fa3"><circle cx="20" cy="5" r="2.4"/><circle cx="33" cy="18" r="2.4" fill="#ffd34d"/><circle cx="20" cy="31" r="2.4" fill="#4fd1ff"/><circle cx="7" cy="18" r="2.4" fill="#9bff6a"/></g><path d="M14 38 L20 18 L26 38" stroke="#c8963c" stroke-width="2" fill="none"/></svg>',
    patrias: '<svg viewBox="0 0 42 30"><rect x="1" y="3" width="13" height="24" fill="#0b8a3e"/><rect x="14" y="3" width="14" height="24" fill="#ffffff"/><rect x="28" y="3" width="13" height="24" fill="#ce1126"/><circle cx="21" cy="15" r="4" fill="#9c6b2e"/></svg>'
  };
  var logo = $('.logo');
  if (logo && ACC[f]) {
    var acc = document.createElement('span'); acc.className = 'accesorio acc-' + f; acc.setAttribute('aria-hidden', 'true'); acc.innerHTML = ACC[f];
    logo.appendChild(acc);
    if (C.halloween) { var cal = document.createElement('span'); cal.className = 'accesorio acc-halloween'; cal.setAttribute('aria-hidden', 'true'); cal.innerHTML = ACC.halloween; logo.appendChild(cal); }
  }

  // ---------- Papel picado bajo la portada (Muertos, Feria y Patrias) ----------
  var COL_PAPEL = { muertos: ['#ff4fa3', '#ff8a1f', '#9b5cff', '#ffd34d', '#2fc58a'], feria: ['#ff4fa3', '#ffd34d', '#4fd1ff', '#9bff6a', '#ff7a3d'], patrias: ['#0b8a3e', '#ffffff', '#ce1126'] };
  if (COL_PAPEL[f] && $('.portada')) {
    var tira = document.createElement('div'); tira.className = 'papel-picado'; tira.setAttribute('aria-hidden', 'true');
    var s = '<svg viewBox="0 0 1200 70" preserveAspectRatio="none"><path d="M0 4 Q600 26 1200 4" stroke="#c9b48a" stroke-width="2" fill="none"/>';
    for (var i = 0; i < 16; i++) {
      var x = 20 + i * 74, y = 5 + Math.sin(i / 15 * Math.PI) * 11, c = COL_PAPEL[f][i % COL_PAPEL[f].length];
      s += '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 0 H56 V40 L48 48 L40 40 L32 48 L24 40 L16 48 L8 40 L0 48 Z" fill="' + c + '" opacity=".92"/><circle cx="28" cy="18" r="7" fill="#0b0d12" opacity=".55"/><path d="M10 10 h8 v8 h-8z M38 10 h8 v8 h-8z M14 30 h28 v4 h-28z" fill="#0b0d12" opacity=".45"/></g>';
    }
    tira.innerHTML = s + '</svg>'; $('.portada').appendChild(tira);
  }

  // ---------- Día de Muertos: altar y camino de cempasúchil que brilla en modo oscuro ----------
  if (f === 'muertos') {
    var camino = document.createElement('div'); camino.className = 'cempasuchil'; camino.setAttribute('aria-hidden', 'true');
    var c2 = '<svg viewBox="0 0 1440 320" preserveAspectRatio="none">';
    for (var k = 0; k < 70; k++) { var t = k / 69, px = 180 + t * 1180, py = 300 - t * 90 + Math.sin(t * 9) * 12 + (Math.random() - .5) * 8; c2 += '<circle cx="' + px.toFixed(0) + '" cy="' + py.toFixed(0) + '" r="' + (5 + Math.random() * 4).toFixed(1) + '" fill="' + (k % 5 ? '#ff9f1c' : '#ffc23a') + '"/>'; }
    camino.innerHTML = c2 + '</svg>'; escena.appendChild(camino);
    var altar = boton('<svg viewBox="0 0 160 150">' +
      '<path d="M10 40 Q80 4 150 40" stroke="#ff8a1f" stroke-width="8" fill="none" stroke-dasharray="2 6" stroke-linecap="round"/>' +
      '<rect x="20" y="96" width="120" height="16" fill="#7a3b1c"/><rect x="34" y="74" width="92" height="22" fill="#8c4a24"/><rect x="50" y="54" width="60" height="20" fill="#9e5a2e"/>' +
      '<rect x="66" y="26" width="28" height="28" rx="2" fill="#2a1a10" stroke="#f1d48a" stroke-width="2"/><circle cx="80" cy="38" r="6" fill="#5a4030"/><path d="M71 52 Q80 42 89 52" fill="#5a4030"/>' +
      '<g class="velas"><rect x="40" y="62" width="5" height="12" fill="#fbf4e6"/><rect x="115" y="62" width="5" height="12" fill="#fbf4e6"/><rect x="28" y="84" width="5" height="12" fill="#fbf4e6"/><rect x="127" y="84" width="5" height="12" fill="#fbf4e6"/>' +
      '<ellipse class="llamita" cx="42.5" cy="59" rx="2.4" ry="4" fill="#ffd34d"/><ellipse class="llamita" cx="117.5" cy="59" rx="2.4" ry="4" fill="#ffd34d"/><ellipse class="llamita" cx="30.5" cy="81" rx="2.4" ry="4" fill="#ffd34d"/><ellipse class="llamita" cx="129.5" cy="81" rx="2.4" ry="4" fill="#ffd34d"/></g>' +
      '<circle cx="58" cy="90" r="6" fill="#d9a85a"/><circle cx="102" cy="90" r="6" fill="#d9a85a"/><g fill="#ff9f1c"><circle cx="24" cy="108" r="6"/><circle cx="136" cy="108" r="6"/><circle cx="52" cy="70" r="4"/><circle cx="108" cy="70" r="4"/><circle cx="80" cy="92" r="5"/></g>' +
      '<rect x="12" y="112" width="136" height="10" fill="#5a2a12"/></svg>', 'altar', T('Un altar de muertos', 'A Day of the Dead altar'));
    altar.addEventListener('click', function () {
      altar.classList.add('vivo'); setTimeout(function () { altar.classList.remove('vivo'); }, 2400);
      var r = altar.getBoundingClientRect(); for (var n = 0; n < 4; n++) C.brasas(r.left + r.width * (.2 + n * .2), r.top + r.height * .45, 6, ['#ffd34d', '#ff9f1c', '#ffffff']);
      C.lluviaDe(['🌼', '🧡', '🌼'], 26); S.play('muertos');
      avisar(T('🕯️ El altar guía a las almas de regreso a casa con la luz de las velas y el aroma del cempasúchil. El Olimpo también recuerda.', '🕯️ The altar guides souls back home with candlelight and the scent of marigolds. Olympus remembers too.'));
    });
  }

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
    var trineo = boton('<svg viewBox="0 0 260 70"><g fill="#2a2420"><path d="M8 40 L22 30 L28 36 L40 34 L44 40 L36 46 L18 46 Z"/><path d="M58 40 L72 30 L78 36 L90 34 L94 40 L86 46 L68 46 Z"/><path d="M108 40 L122 30 L128 36 L140 34 L144 40 L136 46 L118 46 Z"/><path d="M22 30 L18 20 M26 30 L30 22 M72 30 L68 20 M76 30 L80 22 M122 30 L118 20 M126 30 L130 22" stroke="#2a2420" stroke-width="2"/></g><circle cx="24" cy="34" r="2.6" fill="#ff2a12"/><path d="M44 40 H58 M94 40 H108 M144 40 H170" stroke="#c9b48a" stroke-width="1.2"/><path d="M170 30 H230 Q246 30 244 46 L238 52 H176 Q166 52 170 30 Z" fill="#b3120c"/><path d="M172 58 H246" stroke="#c9b48a" stroke-width="3" stroke-linecap="round"/><circle cx="205" cy="22" r="9" fill="#d8342c"/><circle cx="205" cy="16" r="5" fill="#f6d7b9"/><path d="M198 12 L212 12 L206 2 Z" fill="#d8342c"/><circle cx="206" cy="2" r="2.4" fill="#fff"/><rect x="218" y="18" width="16" height="14" fill="#2fc58a"/><rect x="222" y="16" width="8" height="18" fill="#ffd34d" opacity=".9"/></svg>', 'trineo', T('El trineo de Santa', 'Santa’s sleigh'), astros);
    var vuelos = 0;
    function pasar() { if (suave) return; trineo.classList.remove('vuela-trineo'); void trineo.offsetWidth; trineo.classList.add('vuela-trineo'); S.play('cascabeles'); vuelos++; }
    setTimeout(pasar, 2500); setInterval(pasar, C.pico ? 14000 : 26000);
    trineo.addEventListener('click', function () {
      var r = trineo.getBoundingClientRect(); C.lluviaDe(['🎁', '⭐', '🎁'], 22); S.play('cascabeles');
      avisar(T('🎅 ¡Jo, jo, jo! Santa te deja un regalo: una página que tus clientes no van a olvidar.', '🎅 Ho, ho, ho! Santa leaves you a gift: a website your customers won’t forget.'));
    });
  }

  // ---------- Reyes Magos: la caravana cruza las dunas ----------
  if (f === 'reyes') {
    var rey = '<g fill="#2a2420"><path d="M10 50 Q14 36 26 36 Q32 30 38 36 L46 36 Q50 28 54 32 L52 40 L48 50 L44 50 L44 44 L22 44 L20 50 Z"/><path d="M24 36 L26 22 L34 22 L36 36 Z"/><circle cx="30" cy="18" r="4"/></g><path d="M26 14 L28 10 L30 13 L32 10 L34 14 Z" fill="#f1d48a"/>';
    var car = boton('<svg viewBox="0 0 200 60"><g>' + rey + '</g><g transform="translate(60 2)">' + rey + '</g><g transform="translate(120 0)">' + rey + '</g></svg>', 'caravana', T('Los Reyes Magos', 'The Three Kings'));
    car.addEventListener('click', function () {
      var r = car.getBoundingClientRect(); C.brasas(r.left + r.width / 2, r.top, 18, ['#fff6c8', '#f1d48a', '#ffffff']); S.play('reyes');
      avisar(T('👑 Melchor, Gaspar y Baltasar siguen la estrella. ¿Ya partiste la rosca?', '👑 Melchior, Caspar and Balthazar follow the star. Have you cut the rosca yet?'));
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
