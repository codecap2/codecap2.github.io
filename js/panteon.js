/* Olimpo · el panteón: 15 dioses escondidos, el códice, los templos y los guiños. */
(function () {
  var C = window.Cielo, S = window.Sonido, I = window.Idioma, T = I.t, body = document.body;
  // Texto de un dios en el idioma actual (el español vive en DIOSES; el inglés, en Idioma.dioses)
  function campo(g, k) { var en = I.lang === 'en' && I.dioses[g.id]; return en && en[k] ? en[k] : g[k]; }
  var $ = function (s) { return document.querySelector(s); };
  var suave = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  // e: emoji · n: nombre · d: dominio · m: relato corto · f: dato curioso (al voltear) · p: pista
  var DIOSES = [
    { id: 'zeus', e: '⚡', n: 'Zeus', d: 'Rey de los dioses · cielo y rayo', m: 'Venció a su padre Cronos y a los titanes, y se repartió el mundo con sus hermanos: a él le tocó el cielo.', f: 'Su árbol sagrado era el roble. En el oráculo de Dodona, los sacerdotes escuchaban el susurro de sus hojas como si fuera la voz de Zeus.', p: 'El rey guarda su rayo en lo más alto… y no le gusta que lo toquen una sola vez.' },
    { id: 'hera', e: '🦚', n: 'Hera', d: 'Reina del Olimpo · matrimonio y familia', m: 'Su ave es el pavo real: la leyenda dice que puso en su cola los cien ojos del gigante Argos, su fiel guardián.', f: 'Según un mito, la Vía Láctea nació de la leche de Hera, que se derramó por el cielo cuando apartó al pequeño Heracles.', p: 'Una reina presume sus colores donde se ofrecen los servicios.' },
    { id: 'poseidon', e: '🔱', n: 'Poseidón', d: 'Señor de los mares · terremotos y caballos', m: 'Compitió con Atenea por la ciudad de Atenas. Él ofreció una fuente de agua salada; ella, el olivo, y ganó.', f: 'En una versión del mito, creó el primer caballo golpeando una roca con su tridente. Por eso también era el dios de los caballos.', p: 'Dentro del templo de los trabajos, el señor de los mares vigila.' },
    { id: 'demeter', e: '🌾', n: 'Deméter', d: 'Cosechas y estaciones', m: 'Cuando Hades se llevó a su hija Perséfone, la tierra se secó de tristeza. Cada vez que Perséfone regresa, vuelve la primavera.', f: 'Enseñó la agricultura al príncipe Triptólemo, que recorrió el mundo en un carro tirado por serpientes aladas repartiendo semillas.', p: 'La diosa de las estaciones vive junto al clima.' },
    { id: 'atenea', e: '🦉', n: 'Atenea', d: 'Sabiduría y estrategia', m: 'Nació ya adulta y armada, directo de la cabeza de Zeus. Su búho representa ver con claridad, incluso en la oscuridad.', f: 'La ciudad de Atenas lleva su nombre, y el Partenón, en lo alto de la Acrópolis, se construyó en su honor.', p: 'Donde Isaac se presenta, la sabiduría lo observa todo.' },
    { id: 'apolo', e: '🎶', n: 'Apolo', d: 'Luz, música y profecía', m: 'Tocaba la lira que le regaló Hermes y su oráculo de Delfos era el más famoso del mundo. Con los siglos, muchos lo confundieron con Helios.', f: 'En su honor se celebraban los Juegos Píticos de Delfos, que además de deportes tenían concursos de música y poesía.', p: 'Las columnas de la portada suenan como cuerdas… tócalas todas.' },
    { id: 'artemisa', e: '🏹', n: 'Artemisa', d: 'Cacería y bosques', m: 'Gemela de Apolo y protectora de los animales; nunca fallaba un tiro con su arco. Con los siglos, también la vieron como la luna, igual que a Selene.', f: 'Su templo en Éfeso era tan impresionante que fue una de las Siete Maravillas del Mundo Antiguo.', p: 'Quien nunca falla vigila que la entrega llegue a tiempo.' },
    { id: 'ares', e: '⚔️', n: 'Ares', d: 'Guerra y valor', m: 'El dios de la batalla, temido incluso en el Olimpo. Curiosamente, su hermana Atenea casi siempre le ganaba con estrategia.', f: 'Los romanos lo llamaban Marte. Por eso el planeta rojo y el mes de marzo llevan su nombre.', p: 'Hasta la mejor forma de trabajar tiene sus armas.' },
    { id: 'afrodita', e: '🌹', n: 'Afrodita', d: 'Amor y belleza', m: 'Nació de la espuma del mar y llegó a la orilla sobre una concha. Donde pisaba, crecían flores.', f: 'Los romanos la llamaban Venus, y así se llama el planeta más brillante del cielo después de la Luna.', p: 'El amor florece justo donde se invita a platicar.' },
    { id: 'hefesto', e: '🔨', n: 'Hefesto', d: 'Fuego, forja y artesanos', m: 'El herrero de los dioses: forjó el rayo de Zeus, armaduras y hasta autómatas de oro que le ayudaban en su taller.', f: 'Estaba casado con Afrodita, y para atraparla con Ares forjó una red invisible que nadie podía romper.', p: 'Toda página se forja en algún taller… busca el lugar que todavía está libre.' },
    { id: 'hermes', e: '🪽', n: 'Hermes', d: 'Mensajero · viajeros y comercio', m: 'Recién nacido se escapó de la cuna, robó el ganado de Apolo y, para contentarlo, le regaló la lira que inventó.', f: 'Su bastón con dos serpientes entrelazadas se llama caduceo, y era el patrón de viajeros, comerciantes… y ladrones.', p: 'El mensajero espera al final del camino.' },
    { id: 'dioniso', e: '🍇', n: 'Dioniso', d: 'Fiesta, vino y teatro', m: 'Del culto a Dioniso nació el teatro griego: las tragedias y comedias se presentaban en sus festivales.', f: 'Se dice que nació dos veces: Zeus lo salvó y lo terminó de gestar cosido en su propio muslo.', p: 'La fiesta se esconde junto a la firma.' },
    { id: 'hades', e: '💀', n: 'Hades', d: 'Señor del inframundo', m: 'No era malvado: era el guardián justo de los muertos. Los cíclopes le forjaron un casco que lo volvía invisible, y su perro de tres cabezas, Cerbero, cuidaba la entrada.', f: 'Era el más rico de los dioses, porque todo el oro y las piedras preciosas bajo tierra le pertenecían. Los romanos lo llamaban Plutón.', p: 'Más abajo de todo, en el abismo, arde una pequeña llama.' },
    { id: 'helios', e: '☀️', n: 'Helios', d: 'Titán del sol', m: 'Cada día cruzaba el cielo en un carro de fuego tirado por caballos, y como lo veía todo, era el gran testigo de los dioses.', f: 'El Coloso de Rodas, otra de las Siete Maravillas, era una estatua gigante de Helios a la entrada de un puerto.', p: 'De día, alguien brilla más que todos. Tócalo.' },
    { id: 'selene', e: '🌙', n: 'Selene', d: 'Titánide de la luna', m: 'Hermana de Helios y de Eos, la aurora: cada noche cruzaba el cielo en su carro de plata. Se enamoró del pastor Endimión, y Zeus lo dejó dormido para siempre para que ella pudiera visitarlo cada noche.', f: 'Los romanos la llamaban Luna, y de ella viene el nombre del lunes.', p: 'De noche, la hermana del sol vigila el cielo.' }
  ];
  var N = DIOSES.length, hallados = {}; // a propósito no se guarda: cada recarga es una nueva aventura
  function total() { return Object.keys(hallados).length; }
  function reiniciar(el, clase) { el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase); }
  function quitarLuego(el, clase, ms) { setTimeout(function () { el.classList.remove(clase); }, ms); }

  // ---------- Aviso: dura según lo que hay que leer ----------
  var aviso = $('#aviso'), reloj;
  function decir(txt, ms, idDios, link, mito) {
    aviso.textContent = txt;
    if (idDios) {
      link = link || [' · 📜 ', T('Ver en el códice', 'See it in the codex'), ''];
      var b = document.createElement('button'); b.type = 'button'; b.className = 'ver'; b.textContent = link[1];
      b.onclick = function () { abrirCodice(idDios); };
      var grupo = document.createElement('span'); grupo.className = 'grupo';   // "📜 Ares entra a tu códice (7/15)" nunca se parte
      grupo.appendChild(document.createTextNode('· ' + link[0].replace(/^\s*·\s*/, ''))); grupo.appendChild(b); grupo.appendChild(document.createTextNode(link[2]));
      aviso.appendChild(document.createTextNode(' ')); aviso.appendChild(grupo);
    }
    if (mito) { var m = document.createElement('span'); m.className = 'mito'; m.textContent = mito; aviso.appendChild(m); }
    aviso.classList.add('visible');
    var t = ms || Math.min(10500, Math.max(3600, 2400 + aviso.textContent.length * 40));
    clearTimeout(reloj); reloj = setTimeout(function () { aviso.classList.remove('visible'); }, t);
  }

  // Al tocar cualquier otra cosa, el aviso anterior se va al instante (así nunca queda estorbando ni "pegado")
  addEventListener('pointerdown', function (e) { if (aviso.classList.contains('visible') && !e.target.closest('#aviso')) { aviso.classList.remove('visible'); clearTimeout(reloj); } }, true);
  function hallar(id, frase) {
    var g = DIOSES.filter(function (x) { return x.id === id; })[0], nuevo = !hallados[id];
    if (nuevo) hallados[id] = true;
    pintarCodice();
    document.querySelectorAll('[data-dios="' + id + '"]').forEach(function (b) { b.classList.add('hallado'); });
    if (I.lang === 'en') {
      if (id === 'demeter') frase = C.iconoEstacion + ' Demeter brings ' + I.estaciones[C.estacion] + ' and its harvest. The sky follows the real weather where you are.' + (I.saludos[C.fiesta] ? '  ' + I.saludos[C.fiesta] : '');
      else if (I.frases[id]) frase = I.frases[id];
    }
    var nom = campo(g, 'n');
    decir(frase, 0, id, nuevo ? ['  ·  📜 ' + nom + ' ', T('entra a tu códice', 'enters your codex'), ' (' + total() + '/' + N + ')'] : ['  ·  📜 ', T('Ver a ' + nom + ' en tu códice', 'See ' + nom + ' in your codex'), ''], nuevo ? campo(g, 'm') : '');
    if (nuevo) setTimeout(function () { S.play('logro'); }, 1100);
    if (nuevo && total() === N) setTimeout(victoria, 3200);
  }

  // La carta 16: el Fénix, que solo aparece cuando conquistas el Olimpo (no cuenta en los 15)
  function cartaSecreta() {
    if (total() < N) return '<div class="dios bloqueado especial"><div class="giro"><div class="cara frente"><div class="em">🔒</div><h3>' + T('Carta secreta', 'Secret card') + '</h3><div class="dom">' + T('Sin revelar', 'Not revealed') + '</div><p>' + T('Se revela cuando conquistas el Olimpo.', 'Revealed when you conquer Olympus.') + '</p></div></div></div>';
    var en = I.lang === 'en';
    return '<div class="dios hallada especial fenix" data-carta="fenix" tabindex="0" role="button" aria-label="' + T('Voltear la tarjeta del Fénix', 'Flip the Phoenix card') + '"><div class="giro">' +
      '<div class="cara frente"><div class="em">' + aveSVG('fenix') + '</div><h3>' + T('El Fénix', 'The Phoenix') + '</h3><div class="dom">' + T('Criatura legendaria · carta secreta', 'Legendary creature · secret card') + '</div><p>' + T('Los griegos lo conocían por el historiador Heródoto: un ave sagrada que aparecía cada 500 años. Relatos posteriores cuentan que al morir arde en llamas y renace de sus propias cenizas.', 'The Greeks knew it from the historian Herodotus: a sacred bird that appeared every 500 years. Later tales say that when it dies it bursts into flames and is reborn from its own ashes.') + '</p><div class="voltear">' + T('↻ Voltéala para un dato curioso', '↻ Flip it for a fun fact') + '</div></div>' +
      '<div class="cara reverso"><h4>' + T('✨ Dato curioso', '✨ Fun fact') + '</h4><p>' + T('En griego se llamaba phoínix, una palabra que también nombraba al rojo púrpura, el color de su plumaje… o sea, un rojo intenso 😉.', 'In Greek it was called phoínix, a word that also named purple-red, the color of its feathers… an intense red 😉.') + '</p><div class="voltear">' + T('↻ Volver', '↻ Back') + '</div></div></div></div>';
  }
  // Aves con siluetas de verdad (Openclipart, dominio público) que aletean; el fénix va pintado de fuego
  function aveSVG(tipo) {
    return '<span class="sil sil-' + (tipo === 'buho' ? 'buho' : 'fenix') + '" aria-hidden="true"></span>';
  }
  function aveSVGviejo(tipo) {
    if (tipo === 'buho') return '<svg viewBox="0 0 100 100" aria-hidden="true">' +
      '<path class="ala-i" d="M44 50 C26 38 8 48 6 66 C18 62 30 64 44 66 Z" fill="#6b4524"/>' +
      '<path class="ala-d" d="M56 50 C74 38 92 48 94 66 C82 62 70 64 56 66 Z" fill="#6b4524"/>' +
      '<ellipse cx="50" cy="60" rx="17" ry="22" fill="#8a5a30"/><ellipse cx="50" cy="66" rx="11" ry="14" fill="#d9b98a"/>' +
      '<path d="M36 36 L40 24 L46 33 Z M64 36 L60 24 L54 33 Z" fill="#6b4524"/><circle cx="50" cy="40" r="15" fill="#8a5a30"/>' +
      '<circle cx="44" cy="40" r="6" fill="#fff6e0"/><circle cx="56" cy="40" r="6" fill="#fff6e0"/><circle cx="44" cy="40" r="3.4" fill="#f0a020"/><circle cx="56" cy="40" r="3.4" fill="#f0a020"/>' +
      '<circle cx="44" cy="40" r="1.6" fill="#1d1a17"/><circle cx="56" cy="40" r="1.6" fill="#1d1a17"/><path d="M48 45 L52 45 L50 50 Z" fill="#e0a040"/></svg>';
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="gFenix" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".4" stop-color="#ffb02e"/><stop offset=".8" stop-color="#ff4a1f"/><stop offset="1" stop-color="#a3201d"/></linearGradient></defs>' +
      '<path d="M40 62 C26 70 12 84 2 96 C14 92 24 88 34 80 C26 90 22 96 20 100 C34 92 42 82 48 70 Z" fill="url(#gFenix)" opacity=".9"/>' +
      '<path class="ala-i" d="M46 52 C34 30 18 18 4 16 C12 28 16 38 26 46 C16 44 10 46 4 50 C20 56 34 58 46 58 Z" fill="url(#gFenix)" opacity=".85"/>' +
      '<path class="ala-d" d="M54 52 C66 28 82 14 98 12 C90 26 86 38 76 46 C86 44 92 46 98 50 C82 58 66 60 54 58 Z" fill="url(#gFenix)"/>' +
      '<ellipse cx="50" cy="58" rx="8" ry="14" fill="url(#gFenix)"/><circle cx="54" cy="42" r="6" fill="#ffb02e"/>' +
      '<path d="M54 36 C56 28 60 26 62 22 C62 28 60 32 58 37 Z" fill="#ff4a1f"/><path d="M59 42 L66 44 L59 46 Z" fill="#ffe08a"/><circle cx="55.5" cy="41" r="1.3" fill="#1d1a17"/></svg>';
  }
  function crearAve(tipo, x, y, tam) {
    var a = document.createElement('div'); a.className = 'ave'; a.innerHTML = aveSVG(tipo);
    a.style.left = x + 'px'; a.style.top = y + 'px'; if (tam) { a.style.width = tam + 'px'; a.style.height = tam + 'px'; }
    if (tipo === 'fenix') a.style.filter = 'drop-shadow(0 0 16px #ff6a1f) drop-shadow(0 0 34px rgba(255,42,0,.7))';
    body.appendChild(a); return a;
  }
  // El vuelo del fénix: renace en la parte de abajo, sube en curva aleteando y deja una estela de fuego
  function vueloFenix() {
    if (suave) return;
    var W = innerWidth, H = innerHeight, tam = Math.min(160, W * .3), f = crearAve('fenix', -tam, H * .72, tam);
    S.play('fenix');
    var marcos = [];
    for (var i = 0; i <= 12; i++) { var p = i / 12; marcos.push({ transform: 'translate(' + (p * (W + tam * 2)) + 'px,' + (-Math.sin(p * Math.PI) * H * .45 + Math.sin(p * Math.PI * 4) * 18) + 'px) rotate(' + (Math.cos(p * Math.PI) * -14) + 'deg) scale(' + (.8 + Math.sin(p * Math.PI) * .5) + ')' }); }
    var anim = f.animate(marcos, { duration: 3600, easing: 'linear' });
    var estela = setInterval(function () { var q = f.getBoundingClientRect(); C.brasas(q.left + q.width * .25, q.top + q.height * .75, 7); C.brasas(q.left + q.width * .25, q.top + q.height * .75, 2, ['#ffffff', '#fff3b0']); }, 30);
    anim.onfinish = function () { clearInterval(estela); f.remove(); acompanarFenix(); };
  }
  C.acompanarFenix = function () { acompanarFenix(); };   // para probarlo sin encontrar a los 15 dioses
  // Después de renacer, un fénix pequeñito te acompaña por toda la página: sigue tu cursor (o tus toques) con calma
  function acompanarFenix() {
    if (suave || $('.fenix-amigo')) return;
    var a = document.createElement('button'); a.type = 'button'; a.className = 'fenix-amigo';
    a.setAttribute('aria-label', T('El fénix que te acompaña', 'The phoenix keeping you company'));
    a.innerHTML = '<span class="sil sil-fenix"></span>'; body.appendChild(a);
    var x = innerWidth - 90, y = innerHeight - 120, mx = x, my = y, ultimaBrasa = 0;
    var tactil = matchMedia('(hover: none)').matches;
    addEventListener(tactil ? 'pointerdown' : 'pointermove', function (e) { mx = e.clientX + 26; my = e.clientY - 46; }, { passive: true });
    (function paso(t) {
      var dx = mx - x, dy = my - y; x += dx * .06; y += dy * .06;   // lo sigue con calma, como si planeara
      a.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + Math.max(-18, Math.min(18, dx * .08)).toFixed(1) + 'deg)';
      if (Math.abs(dx) + Math.abs(dy) > 30 && t - ultimaBrasa > 140) { ultimaBrasa = t; C.brasas(x + 10, y + 30, 2); }
      requestAnimationFrame(paso);
    })(0);
    a.addEventListener('click', function () {
      C.brasas(x + 22, y + 22, 18); S.play('fuego');
      decir(T('🔥 El fénix renació y ahora te acompaña. Como tu negocio: siempre se levanta más fuerte.', '🔥 The phoenix was reborn and now keeps you company. Like your business: it always rises stronger.'), 4200);
    });
  }

  // ---------- Códice: cada dios encontrado brilla y se puede voltear ----------
  function pintarCodice() {
    $('#cuenta').textContent = total();
    $('#progreso').style.width = (total() / N * 100) + '%';
    $('#listaDioses').innerHTML = DIOSES.map(function (g) {
      if (!hallados[g.id]) return '<div class="dios bloqueado" data-carta="' + g.id + '"><div class="giro"><div class="cara frente"><div class="em">' + g.e + '</div><h3>???</h3><div class="dom">' + T('Sin descubrir', 'Undiscovered') + '</div><p>' + T('Pista: ', 'Hint: ') + campo(g, 'p') + '</p></div></div></div>';
      return '<div class="dios hallada" data-carta="' + g.id + '" tabindex="0" role="button" aria-label="' + T('Voltear la tarjeta de ', 'Flip the card of ') + campo(g, 'n') + '"><div class="giro">' +
        '<div class="cara frente"><div class="em">' + g.e + '</div><h3>' + campo(g, 'n') + '</h3><div class="dom">' + campo(g, 'd') + '</div><p>' + campo(g, 'm') + '</p><div class="voltear">' + T('↻ Voltéala para un dato curioso', '↻ Flip it for a fun fact') + '</div></div>' +
        '<div class="cara reverso"><h4>' + T('✨ Dato curioso', '✨ Fun fact') + '</h4><p>' + campo(g, 'f') + '</p><div class="voltear">' + T('↻ Volver', '↻ Back') + '</div></div></div></div>';
    }).join('') + cartaSecreta();
    document.querySelectorAll('.dios.hallada').forEach(function (d) {
      var voltear = function () { d.classList.toggle('volteada'); S.play('hoja'); };
      d.onclick = voltear; d.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); voltear(); } };
    });
    var r = '';
    if (hallados.atenea) r += T('<p>🦉 <b>Regalo de Atenea:</b> <a href="cv/CV_IECS_2026.pdf" target="_blank" rel="noopener">el pergamino de Isaac (su CV)</a></p>', '<p>🦉 <b>Athena’s gift:</b> <a href="cv/CV_IECS_2026.pdf" target="_blank" rel="noopener">Isaac’s scroll (his résumé, in Spanish)</a></p>');
    if (total() === N) r += T('<p class="gloria">🏛️ Conquistaste el Olimpo.<br>Si quieres una página así de viva para tu negocio,<br><a href="#contacto" id="irContacto">ya sabes dónde encontrarme</a>.</p>', '<p class="gloria">🏛️ You conquered Olympus.<br>If you want a website this alive for your business,<br><a href="#contacto" id="irContacto">you know where to find me</a>.</p>');
    $('#recompensa').innerHTML = r;
    var ir = $('#irContacto'); if (ir) ir.onclick = cerrarCodice;
  }
  function abrirCodice(id) {
    pintarCodice(); $('#codice').classList.add('abierto'); aviso.classList.remove('visible');
    var carta = id && document.querySelector('[data-carta="' + id + '"]');
    if (carta) { carta.scrollIntoView({ block: 'center' }); carta.classList.add('resalta'); }
    else $('#cerrarCodice').focus();
  }
  function cerrarCodice() { $('#codice').classList.remove('abierto'); }
  $('#btnCodice').onclick = function () { abrirCodice(); };
  $('#abrirReto').onclick = function () { abrirCodice(); };
  $('#cerrarCodice').onclick = cerrarCodice;
  $('#codice').addEventListener('click', function (e) { if (e.target.id === 'codice') cerrarCodice(); });
  // Escape cierra lo que esté encima: primero el códice, luego el templo
  addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if ($('#codice').classList.contains('abierto')) cerrarCodice();
    else if (abierto) location.hash = '#servicios';
  });

  function victoria() {
    body.classList.add('conquistado');
    S.play('victoria'); C.fuegos(); setTimeout(function () { C.fuegos(); }, 400); setTimeout(function () { C.fuegos(); }, 900);
    setTimeout(vueloFenix, 1400);
    decir(T('🏛️ ¡Encontraste a los ' + N + ' dioses! Eres oficialmente parte del Olimpo. Todas las tarjetas brillan en oro… y algo renació de las cenizas.', '🏛️ You found all ' + N + ' gods! You are officially part of Olympus. Every card shines in gold… and something rose from the ashes.'), 0, 'fenix', [' · 📜 ', T('Abre tu códice', 'Open your codex'), '']);
  }

  // ---------- Templos con puertas de piedra ----------
  var templos = { 'trabajos': $('#templo-trabajos'), 'sobre-mi': $('#templo-sobre-mi') }, abierto = null, moviendo = false, focoPrevio = null;
  function mostrarTemplo(nombre, conPuertas) {
    var cambiar = function () {
      Object.keys(templos).forEach(function (k) { templos[k].classList.toggle('abierto', k === nombre); });
      document.querySelectorAll('nav ul a').forEach(function (a) { a.classList.toggle('activo', a.dataset.templo === nombre); });
      if (nombre) templos[nombre].scrollTop = 0;
      document.documentElement.classList.toggle('en-templo', !!nombre); C.pausar(!!nombre);   // el templo es otra página: el resto se apaga
      // Accesibilidad: el foco del teclado entra al templo, y al salir regresa a donde estaba
      if (nombre) { focoPrevio = document.activeElement; templos[nombre].focus({ preventScroll: true }); }
      else if (focoPrevio && focoPrevio.focus && document.contains(focoPrevio)) { focoPrevio.focus({ preventScroll: true }); focoPrevio = null; }
      abierto = nombre;
      if (!nombre) {   // al salir hacia una sección (Servicios, Contacto), que quede bien acomodada
        var sec = location.hash && document.getElementById(location.hash.slice(1));
        // ya acomodada cuando se abren las puertas
        if (sec && sec.tagName === 'SECTION') setTimeout(function () { sec.scrollIntoView({ block: sec.offsetHeight < innerHeight * .85 ? 'center' : 'start', behavior: 'instant' }); }, 30);
      }
    };
    if (!conPuertas || suave) { cambiar(); return; }
    if (moviendo) return; moviendo = true;
    body.classList.add('cerrando'); S.play('arrastre');
    setTimeout(function () {                       // las puertas chocan
      S.play('golpe'); reiniciar(body, 'impacto');
      for (var y = .15; y <= .95; y += .1) C.polvo(innerWidth / 2, innerHeight * y, 18);   // polvo a lo largo de la junta
    }, 560);
    setTimeout(function () { cambiar(); body.classList.add('abriendo'); body.classList.remove('cerrando'); S.play('arrastre'); }, 1050);
    setTimeout(function () { body.classList.remove('abriendo', 'impacto'); moviendo = false; }, 2250);
  }
  function rutear(conPuertas) {
    var h = location.hash.replace('#', '');
    if (Object.prototype.hasOwnProperty.call(templos, h)) { if (abierto !== h) mostrarTemplo(h, conPuertas); }
    else if (abierto) mostrarTemplo(null, conPuertas);
  }
  addEventListener('hashchange', function () { rutear(true); });
  document.querySelectorAll('.salir').forEach(function (b) { b.onclick = function () { location.hash = '#servicios'; }; });
  $('#irInicio').onclick = function (e) {
    e.preventDefault();
    if (abierto) { history.pushState(null, '', location.pathname + location.search); mostrarTemplo(null, true); }
    scrollTo({ top: 0, behavior: suave ? 'auto' : 'smooth' });
  };
  // Al recargar, como en un videojuego: de vuelta al inicio
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var nav0 = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (nav0 && nav0.type === 'reload') { history.replaceState(null, '', location.pathname + location.search); scrollTo(0, 0); }
  rutear(false);
  $('#reiniciarAventura').onclick = function () {
    hallados = {}; body.classList.remove('conquistado');
    document.querySelectorAll('.secreto.hallado').forEach(function (b) { b.classList.remove('hallado'); });
    pintarCodice(); cerrarCodice(); decir(T('🔄 Los dioses volvieron a esconderse… ¡a buscarlos otra vez!', '🔄 The gods went back into hiding… time to find them again!'));
  };

  // ---------- Ayudantes de efectos ----------
  function volador(txt, x, y, extra) {
    var el = document.createElement('div'); el.textContent = txt;
    el.style.cssText = 'position:fixed;z-index:56;pointer-events:none;left:' + x + 'px;top:' + y + 'px;font-size:2.2rem;' + (extra || '');
    body.appendChild(el); return el;
  }
  function rayoVisual() {
    var W = innerWidth, H = innerHeight, svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'rayo-svg'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    function camino(x, y, pasos, dx) {
      var pts = [[x, y]];
      for (var i = 0; i < pasos; i++) { x += (Math.random() - .5) * dx; y += H * .7 / 12; pts.push([x, y]); }
      return pts;
    }
    var principal = camino(W * (.3 + Math.random() * .4), 0, 12, 90);
    var rama = camino(principal[5][0], principal[5][1], 5, 70).map(function (p, i) { return [p[0] + i * 18, p[1]]; });
    [principal, rama].forEach(function (pts, i) {
      var pl = document.createElementNS(NS, 'polyline');
      pl.setAttribute('points', pts.map(function (p) { return p.join(','); }).join(' '));
      pl.setAttribute('fill', 'none'); pl.setAttribute('stroke', '#ffffff'); pl.setAttribute('stroke-width', i ? 2 : 4); pl.setAttribute('stroke-linejoin', 'round');
      pl.style.filter = 'drop-shadow(0 0 6px #cfe2ff) drop-shadow(0 0 18px #7fb2ff)';
      svg.appendChild(pl);
    });
    body.appendChild(svg); setTimeout(function () { svg.remove(); }, 800);
  }

  // ---------- Los secretos de cada dios ----------
  // Zeus: tres clics al rayo
  var clics = 0, tRayo;
  $('#rayo').addEventListener('click', function () {
    clics++; clearTimeout(tRayo); tRayo = setTimeout(function () { clics = 0; }, 1500);
    if (clics === 1) decir(T('⚡ Mmm… el rayo se siente cargado.', '⚡ Hmm… the bolt feels charged.'));
    if (clics === 2) decir(T('⚡⚡ Una vez más y Zeus se entera…', '⚡⚡ One more time and Zeus will notice…'));
    if (clics >= 3) {
      clics = 0; if (!suave) rayoVisual(); C.destello(true);
      reiniciar(body, 'sacudir'); quitarLuego(body, 'sacudir', 900);
      hallar('zeus', '⚡ ¡Zeus lanza su rayo y el cielo entero tiembla!');
    }
  });
  // Hera: la cola del pavo real con los cien ojos de Argos
  // El abanico del pavo real: plumas con sus "ojos" (los cien ojos de Argos), dibujadas una sola vez
  (function () {
    var s = '<svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMax meet" aria-hidden="true">';
    for (var i = 0; i < 25; i++) {
      var ang = (-84 + i * 7) * Math.PI / 180, largo = 440 - Math.abs(i - 12) * 6, x = 500 + Math.sin(ang) * largo, y = 500 - Math.cos(ang) * largo, deg = (-84 + i * 7);
      s += '<line x1="500" y1="500" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="#c9a54a" stroke-width="2" opacity=".7"/>';
      s += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + deg + ')"><ellipse rx="26" ry="42" fill="#1f7a6b" opacity=".9"/><ellipse rx="19" ry="30" fill="#d4af5a"/><ellipse rx="13" ry="21" fill="#167a8f"/><ellipse rx="8" ry="13" fill="#0b2a5a"/><ellipse cx="-2" cy="-4" rx="2.5" ry="4" fill="#ffffff" opacity=".7"/></g>';
      if (i % 2) { var x2 = 500 + Math.sin(ang) * largo * .62, y2 = 500 - Math.cos(ang) * largo * .62; s += '<g transform="translate(' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ') rotate(' + deg + ')"><ellipse rx="15" ry="24" fill="#1f7a6b" opacity=".85"/><ellipse rx="10" ry="16" fill="#d4af5a"/><ellipse rx="6" ry="10" fill="#0b2a5a"/></g>'; }
    }
    $('#pavo').innerHTML = s + '<circle cx="500" cy="500" r="46" fill="#1f5a8a"/><circle cx="500" cy="500" r="30" fill="#167a8f"/></svg>';
  })();
  $('[data-dios="hera"]').onclick = function () { reiniciar($('#pavo'), 'activo'); S.play('pavo'); hallar('hera', '🦚 Hera despliega la cola de su pavo real y sus cien ojos te miran.'); };
  // Poseidón: una ola cruza la pantalla
  $('[data-dios="poseidon"]').onclick = function () { reiniciar($('#ola'), 'activo'); S.play('ola'); hallar('poseidon', '🔱 ¡Poseidón alza su tridente y manda una ola!'); };
  // Deméter: la cosecha de la estación
  $('#chipClima').onclick = function () {
    C.lluviaDe([C.iconoEstacion, '🌾', C.iconoEstacion], 36); S.play('cosecha');
    var extra = C.saludos[C.fiesta] ? '  ' + C.saludos[C.fiesta] : '';
    hallar('demeter', C.iconoEstacion + ' Deméter trae el ' + C.nombreEstacion.toLowerCase() + ' y su cosecha. El cielo sigue el clima real de donde estás.' + extra);
  };
  // Atenea: su búho vuela y deja el CV
  $('[data-dios="atenea"]').onclick = function () {
    // el búho vuela directo al códice, como enseñando el camino
    var r = this.getBoundingClientRect(), b = crearAve('buho', r.left - 30, r.top - 40, 96), meta = $('#btnCodice').getBoundingClientRect();
    var dx = meta.left + meta.width / 2 - r.left - 18, dy = meta.top + meta.height / 2 - r.top + 8;
    S.play('buho');
    var llegar = function () { b.remove(); reiniciar($('#btnCodice'), 'guia'); };
    if (!suave && b.animate) {
      var marcos = [];   // vuelo en curva con un ligero subibaja, como un ave de verdad
      for (var i = 0; i <= 10; i++) { var p = i / 10, ease = p * p * (3 - 2 * p); marcos.push({ transform: 'translate(' + (dx * ease) + 'px,' + (dy * ease - Math.sin(p * Math.PI) * 120 + Math.sin(p * Math.PI * 5) * 10) + 'px) rotate(' + (Math.sin(p * Math.PI * 2) * 8) + 'deg) scale(' + (1 + Math.sin(p * Math.PI) * .35 - p * .55) + ')', opacity: p > .9 ? (1 - p) * 10 : 1 }); }
      b.animate(marcos, { duration: 2200, easing: 'linear' }).onfinish = llegar;
    } else llegar();
    hallar('atenea', '🦉 El búho de Atenea te deja un pergamino secreto: el CV de Isaac.');
  };
  // Helios: el sol baja despacio detrás de las dunas, con su atardecer
  var animandoCielo = false;
  $('#sol').onclick = function () {
    if (animandoCielo) return; animandoCielo = true; C.manual = true; S.play('sol');
    C.ponerModo('atardecer');
    hallar('helios', '☀️ Helios guía su carro de fuego hacia el horizonte… y se pone el sol.');
    setTimeout(function () { C.ponerModo('noche'); C.ponerClima(C.clima); }, 2700);
    setTimeout(function () { animandoCielo = false; }, 5800);
  };
  // Selene: la luna baja y llega el amanecer
  $('#luna').onclick = function () {
    if (animandoCielo) return; animandoCielo = true; C.manual = true; S.play('luna'); C.fugaz();
    hallar('selene', '🌙 Selene guarda su carro de plata… y llega el amanecer.');
    C.ponerModo('amanecer'); C.ponerClima(C.clima);
    setTimeout(function () { C.ponerModo('dia'); C.ponerClima(C.clima); }, 4800);
    setTimeout(function () { animandoCielo = false; }, 5800);
  };
  // Apolo: las columnas de la portada son cuerdas de lira
  var notas = [262, 294, 330, 392, 440], tocadas = {}, avisoLira = false;
  document.querySelectorAll('.columnas span').forEach(function (s, i) {
    s.addEventListener('click', function () {
      reiniciar(s, 'vibra');
      if (!S.nota(notas[i]) && !avisoLira) { avisoLira = true; decir(T('🎶 Algo vibra… enciende el sonido 🔇 de la barra para escucharlo.', '🎶 Something is vibrating… turn on the sound 🔇 in the top bar to hear it.')); }
      tocadas[i] = true;
      if (Object.keys(tocadas).length === 5) {
        tocadas = {}; var r = $('.columnas').getBoundingClientRect();
        setTimeout(function () { S.play('lira'); C.subir(['🎵', '🎶', '🎵'], r.left + r.width / 2, r.top, 14); }, 300);
        hallar('apolo', '🎶 ¡Apolo toca su lira! Las columnas del Olimpo cantan.');
      }
    });
  });
  // Artemisa: la flecha vuela y se pierde a lo lejos
  $('[data-dios="artemisa"]').onclick = function () {
    var r = this.getBoundingClientRect(), f = volador('➶', r.left, r.top - 10, 'color:#f1d48a;font-size:2.4rem;filter:drop-shadow(0 0 6px rgba(241,212,138,.7))');
    S.play('arco');
    hallar('artemisa', '🏹 Artemisa suelta la flecha… y se pierde a lo lejos. Nunca falla, igual que una entrega a tiempo.');
    if (suave || !f.animate) { f.remove(); return; }
    f.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + (innerWidth * .55) + 'px,-' + (r.top * .7) + 'px) scale(.15)', opacity: 0 }], { duration: 1100, easing: 'cubic-bezier(.2,.6,.3,1)' }).onfinish = function () { f.remove(); };
  };
  // Ares: dos tajos en X, el escudo y los pasos marchan
  $('[data-dios="ares"]').onclick = function () {
    reiniciar($('#tajo'), 'activo'); S.play('espada');
    setTimeout(function () { reiniciar($('#tajo2'), 'activo'); S.play('espada'); }, 160);
    setTimeout(function () { reiniciar($('#escudo'), 'activo'); S.play('tambor'); }, 480);
    reiniciar(body, 'marcha'); quitarLuego(body, 'marcha', 2200);
    body.classList.add('furia'); quitarLuego(body, 'furia', 1800);
    hallar('ares', '⚔️ ¡Ares cruza sus espadas y alza su escudo! Cada paso marcha a la batalla.');
  };
  // Afrodita: lluvia de rosas
  $('[data-dios="afrodita"]').onclick = function () { C.lluviaDe(['🌹', '💗', '🌸'], 45); S.play('arpa'); hallar('afrodita', '🌹 Afrodita bendice tu negocio con amor de clientes.'); };
  // Hefesto: tres martillazos en la forja
  $('[data-dios="hefesto"]').onclick = function (ev) {
    var r = ev.currentTarget.getBoundingClientRect(); S.play('forja');
    [0, 700, 1400].forEach(function (t) { setTimeout(function () { C.fuegos(r.left + r.width / 2, r.top, ['#ffb347', '#ff7b2e', '#ffe08a', '#ffffff']); C.brasas(r.left + r.width / 2, r.top, 10); reiniciar(ev.target.closest('.tarjeta'), 'sacude'); }, t); });
    hallar('hefesto', '🔨 Hefesto forjó Mantenimiento Integral… y ya calienta el yunque para tu página.');
  };
  // Hermes: las sandalias aladas te llevan arriba
  $('#sandalia').onclick = function () {
    var s = document.createElement('div'); s.className = 'vuela'; s.textContent = '🪽';
    var r = this.getBoundingClientRect(); s.style.left = r.left + 'px'; s.style.top = r.top + 'px';
    body.appendChild(s); setTimeout(function () { s.remove(); }, 1300); S.play('alas');
    scrollTo({ top: 0, behavior: suave ? 'auto' : 'smooth' });
    hallar('hermes', '🪽 Hermes, el mensajero, te lleva volando de regreso al inicio.');
  };
  // Dioniso: la fiesta
  $('[data-dios="dioniso"]').onclick = function () { reiniciar(body, 'ebrio'); quitarLuego(body, 'ebrio', 4200); C.lluviaDe(['🍇', '🍷', '🎭'], 30); S.play('fiesta'); hallar('dioniso', '🍇 ¡Dioniso armó la fiesta! Todo da vueltas…'); };
  // Hades: el casco de la invisibilidad
  $('#llama').onclick = function () {
    body.classList.add('invisible'); S.play('hades');
    setTimeout(function () { body.classList.remove('invisible'); }, 6000);
    hallar('hades', '💀 Hades te presta su casco: por unos segundos, eres invisible…');
  };

  // ---------- Guiños para los fans (no cuentan como dioses) ----------
  // La lanza de hielo: la lanzas, regresa, choca en su lugar y todo se congela
  $('#hacha').onclick = function () {
    var b = this, r = b.getBoundingClientRect(); b.style.visibility = 'hidden';
    var h = document.createElement('div'); h.innerHTML = '<svg width="64" height="64"><use href="#iHacha"/></svg>';
    h.style.cssText = 'position:fixed;z-index:56;pointer-events:none;left:' + (r.left - 16) + 'px;top:' + (r.top - 16) + 'px;filter:drop-shadow(0 0 12px #8fd3ff)';
    body.appendChild(h); S.play('zumbido'); setTimeout(function () { S.play('zumbido'); }, 950);
    decir(T('❄️ Lánzala sin miedo… esta lanza siempre regresa a tu mano.', '❄️ Throw it without fear… this spear always comes back to your hand.'), 3400);
    var fin = function () {
      h.remove(); b.style.visibility = ''; S.play('impacto'); setTimeout(function () { S.play('hielo'); }, 120);
      reiniciar($('#tarjetaExtras'), 'sacude');
      C.fuegos(r.left + r.width / 2, r.top + r.height / 2, ['#e9f8ff', '#8fd3ff', '#ffffff', '#5fb4f0']);
      $('#escarcha').classList.add('activo'); body.classList.add('hielo-tinte');
      setTimeout(function () { $('#escarcha').classList.remove('activo'); body.classList.remove('hielo-tinte'); }, 1700);
    };
    if (suave || !h.animate) { fin(); return; }
    var dx = innerWidth * .82 - r.left, dy = 140 - r.top;
    h.animate([
      { transform: 'translate(0,0) rotate(0)' },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(-1080deg)', offset: .45 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(-1100deg)', offset: .55 },
      { transform: 'translate(0,0) rotate(-2160deg)' }
    ], { duration: 1900, easing: 'ease-in-out' }).onfinish = fin;
  };
  // Las cadenas caen en U, sueltan chispas y se encienden en llamas
  $('#cadenas').onclick = function () {
    S.play('cadena'); decir(T('⛓️ Unas cadenas viejas caen… y empiezan a arder.', '⛓️ Some old chains fall… and start to burn.'), 3600);
    if (suave) return;
    var W = innerWidth, H = innerHeight, svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'capa-cadena'); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    function capa(color, ancho, dash, offset, filtro) {
      var p = document.createElementNS(NS, 'path'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', color);
      p.setAttribute('stroke-width', ancho); p.setAttribute('stroke-linecap', 'round');
      if (dash) { p.setAttribute('stroke-dasharray', dash); p.setAttribute('stroke-dashoffset', offset || 0); }
      if (filtro) p.style.filter = filtro; svg.appendChild(p); return p;
    }
    // Dos cadenas que caen y cuelgan en vertical; se balancean, sueltan chispas y se encienden
    body.appendChild(svg);
    var cadenas = [W * .33, W * .67].map(function (x, i) {
      var fuego = capa('#ff6a1f', 16, '', 0, 'blur(3px) drop-shadow(0 0 14px #ff3a00)');
      var a = capa('#5d5d63', 8, '14 6'), b = capa('#b9b9c2', 3, '14 6', 7), nucleo = capa('#ffd36b', 5, '', 0, 'blur(1px)');
      fuego.style.opacity = 0; nucleo.style.opacity = 0;
      return { x: x, largo: -40, vel: 0, meta: H * (.5 + i * .06), ang: 0, vang: (i ? -1 : 1) * .02, capas: [fuego, a, b, nucleo], a: a, b: b, fuego: fuego, nucleo: nucleo };
    });
    var t0 = performance.now(), chispeo = false, ardiendo = false;
    function paso(t) {
      var e = t - t0;
      cadenas.forEach(function (k) {
        k.vel += (k.meta - k.largo) * .05; k.vel *= .85; k.largo += k.vel;              // cae con peso y rebota al tensarse
        k.vang += -k.ang * .02; k.vang *= .985; k.ang += k.vang;                        // se balancea como péndulo
        var px = k.x + Math.sin(k.ang) * k.largo, py = Math.cos(k.ang) * k.largo, cx = k.x + Math.sin(k.ang) * k.largo * .5 + k.vang * 300;
        var d = 'M' + k.x + ',-10 Q' + cx + ',' + (py * .5) + ' ' + px + ',' + py;
        k.capas.forEach(function (p) { p.setAttribute('d', d); });
        k.px = px; k.py = py;
      });
      if (e > 650 && !chispeo) { chispeo = true; S.play('chispas'); }
      if (chispeo && !ardiendo) cadenas.forEach(function (k) { var q = k.a.getPointAtLength(Math.random() * k.a.getTotalLength()); C.brasas(q.x, q.y, 2, ['#ffffff', '#ffe08a']); });
      if (e > 1100 && !ardiendo) { ardiendo = true; S.play('fuego'); body.classList.add('furia'); }
      if (ardiendo) {
        var al = Math.min(1, (e - 1100) / 300);
        cadenas.forEach(function (k) {
          k.fuego.style.opacity = al * (.75 + Math.random() * .25); k.nucleo.style.opacity = al * (.6 + Math.random() * .4);
          k.fuego.setAttribute('stroke-width', 13 + Math.random() * 8);
          k.b.setAttribute('stroke', 'rgb(255,' + Math.round(200 - al * 80) + ',' + Math.round(150 - al * 120) + ')');
          var largo = k.a.getTotalLength();
          for (var j = 0; j < 3; j++) { var p = k.a.getPointAtLength(Math.random() * largo); C.brasas(p.x, p.y, 1); }
          C.brasas(k.px, k.py, 3);
        });
      }
      if (e > 3400) { cadenas.forEach(function (k) { k.meta = -200; }); svg.style.transition = 'opacity .7s'; svg.style.opacity = 0; body.classList.remove('furia'); }
      if (e < 4300) requestAnimationFrame(paso); else svg.remove();
    }
    requestAnimationFrame(paso);
  };

  // ---------- Contacto protegido (el número no está escrito en la página) ----------
  var n = ['52', '449', '125', '98', '64'].join(''), c = ['olimpo.web.ags', 'gmail.com'].join('@');
  $('#btnWhats').addEventListener('click', function () { this.href = 'https://wa.me/' + n + '?text=' + encodeURIComponent(T('Hola, Isaac. Vi tu portafolio de Olimpo y me interesa una página.', 'Hi, Isaac. I saw your Olimpo portfolio and I’m interested in a website.')); });
  $('#btnCorreo').addEventListener('click', function () {
    this.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + c + '&su=' + encodeURIComponent(T('Quiero una página web', 'I want a website'));
    try { navigator.clipboard.writeText(c); decir(T('📋 Te abrí Gmail y además copié el correo: ', '📋 I opened Gmail for you and also copied the email: ') + c); } catch (e) {}
  });

  // ---------- Aparecer al bajar ----------
  var obs = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.aparece').forEach(function (el) { obs.observe(el); });

  // ---------- Bienvenida de temporada y mensaje para curiosos del código ----------
  pintarCodice();
  if (C.halloween) setTimeout(function () { decir(T('🎃 Temporada de Halloween: calabazas y murciélagos invaden el Olimpo. Toca la calabaza del logo.', '🎃 Halloween season: pumpkins and bats take over Olympus. Tap the pumpkin on the logo.'), 4500); }, 1800);
  else if (C.saludos[C.fiesta]) setTimeout(function () { decir(T(C.saludos[C.fiesta], I.saludos[C.fiesta]), 4500); }, 1800);
  I.alCambiar.push(function () { pintarCodice(); });
  console.log('%c⚡ Olimpo', 'font: 700 22px Georgia; color: #d4af5a');
  console.log('¿Revisando el código? Ya somos dos curiosos. Escríbeme: ' + c + '\nPista: en esta página se esconden ' + N + ' dioses. 🏛️');
})();
