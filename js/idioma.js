/* Olimpo · español e inglés.
   El HTML lleva el texto en inglés en data-en (y data-en-aria / data-en-title para atributos).
   Lo que escribe JavaScript usa Idioma.t('español', 'english').
   Idioma inicial: ?lang=en|es, luego la elección guardada, luego el idioma del navegador. */
(function () {
  var I = window.Idioma = { alCambiar: [] };
  var q = new URLSearchParams(location.search), guardado = null;
  try { guardado = localStorage.getItem('olimpo-idioma'); } catch (e) {}
  var nav = (navigator.language || 'es').toLowerCase();
  I.lang = q.get('lang') || guardado || (nav.indexOf('es') === 0 ? 'es' : 'en');
  if (I.lang !== 'en') I.lang = 'es';
  I.t = function (es, en) { return I.lang === 'en' ? en : es; };

  I.dioses = {
    zeus: { n: 'Zeus', d: 'King of the gods · sky and thunder', m: 'He defeated his father Cronus and the Titans, then split the world with his brothers: he took the sky.', f: 'His sacred tree was the oak. At the oracle of Dodona, priests listened to the rustling of its leaves as if it were the voice of Zeus.', p: 'The king keeps his thunderbolt up high… and he doesn’t like being touched just once.' },
    hera: { n: 'Hera', d: 'Queen of Olympus · marriage and family', m: 'Her bird is the peacock: legend says she placed the hundred eyes of the giant Argus, her loyal guard, on its tail.', f: 'According to one myth, the Milky Way was born from Hera’s milk, spilled across the sky when she pushed baby Heracles away.', p: 'A queen shows off her colors where the services are offered.' },
    poseidon: { n: 'Poseidon', d: 'Lord of the seas · earthquakes and horses', m: 'He competed with Athena for the city of Athens. He offered a saltwater spring; she offered the olive tree, and won.', f: 'In one version of the myth, he created the first horse by striking a rock with his trident. That’s why he was also the god of horses.', p: 'Inside the temple of work, the lord of the seas keeps watch.' },
    demeter: { n: 'Demeter', d: 'Harvests and seasons', m: 'When Hades took her daughter Persephone, the earth withered with sorrow. Every time Persephone returns, spring comes back.', f: 'She taught farming to prince Triptolemus, who traveled the world in a chariot pulled by winged serpents, handing out seeds.', p: 'The goddess of the seasons lives next to the weather.' },
    atenea: { n: 'Athena', d: 'Wisdom and strategy', m: 'She was born fully grown and armed, straight from the head of Zeus. Her owl stands for seeing clearly, even in the dark.', f: 'The city of Athens bears her name, and the Parthenon, atop the Acropolis, was built in her honor.', p: 'Where Isaac introduces himself, wisdom is watching.' },
    apolo: { n: 'Apollo', d: 'Light, music and prophecy', m: 'He played the lyre Hermes gave him, and his oracle at Delphi was the most famous in the world. Over the centuries, many confused him with Helios.', f: 'The Pythian Games at Delphi were held in his honor and included music and poetry contests, not just sports.', p: 'The columns on the home page sound like strings… play them all.' },
    artemisa: { n: 'Artemis', d: 'The hunt and the forests', m: 'Apollo’s twin and protector of animals; she never missed a shot with her bow. Over time she was also seen as the moon, just like Selene.', f: 'Her temple at Ephesus was so impressive that it became one of the Seven Wonders of the Ancient World.', p: 'The one who never misses makes sure the delivery arrives on time.' },
    ares: { n: 'Ares', d: 'War and courage', m: 'The god of battle, feared even on Olympus. Curiously, his sister Athena almost always beat him with strategy.', f: 'The Romans called him Mars. That’s why the red planet and the month of March carry his name.', p: 'Even the best way of working has its weapons.' },
    afrodita: { n: 'Aphrodite', d: 'Love and beauty', m: 'She was born from the sea foam and reached the shore on a shell. Flowers grew wherever she stepped.', f: 'The Romans called her Venus, the name of the brightest planet in the sky after the Moon.', p: 'Love blooms right where you’re invited to talk.' },
    hefesto: { n: 'Hephaestus', d: 'Fire, forge and craftsmen', m: 'The blacksmith of the gods: he forged Zeus’s thunderbolt, armor and even golden automatons that helped him in his workshop.', f: 'He was married to Aphrodite, and to catch her with Ares he forged an invisible net that no one could break.', p: 'Every website is forged in some workshop… look for the spot that’s still free.' },
    hermes: { n: 'Hermes', d: 'Messenger · travelers and trade', m: 'As a newborn he slipped out of his cradle, stole Apollo’s cattle and, to make peace, gave him the lyre he had invented.', f: 'His staff with two intertwined serpents is called the caduceus, and he was the patron of travelers, merchants… and thieves.', p: 'The messenger waits at the end of the road.' },
    dioniso: { n: 'Dionysus', d: 'Feasts, wine and theater', m: 'Greek theater was born from the worship of Dionysus: tragedies and comedies were performed at his festivals.', f: 'It is said he was born twice: Zeus saved him and finished carrying him sewn into his own thigh.', p: 'The party hides next to the signature.' },
    hades: { n: 'Hades', d: 'Lord of the underworld', m: 'He wasn’t evil: he was the fair guardian of the dead. The Cyclopes forged him a helmet that made him invisible, and his three-headed dog, Cerberus, guarded the gate.', f: 'He was the richest of the gods, because all the gold and gems underground belonged to him. The Romans called him Pluto.', p: 'Below everything, in the abyss, a small flame burns.' },
    helios: { n: 'Helios', d: 'Titan of the sun', m: 'Every day he crossed the sky in a fiery chariot pulled by horses, and since he saw everything, he was the great witness of the gods.', f: 'The Colossus of Rhodes, another of the Seven Wonders, was a giant statue of Helios at the entrance of a harbor.', p: 'By day, someone shines brighter than everyone. Touch it.' },
    selene: { n: 'Selene', d: 'Titaness of the moon', m: 'Sister of Helios and of Eos, the dawn: every night she crossed the sky in her silver chariot. She fell in love with the shepherd Endymion, and Zeus put him into an eternal sleep so she could visit him every night.', f: 'The Romans called her Luna, and the Spanish word for Monday, lunes, comes from her.', p: 'At night, the sun’s sister watches over the sky.' }
  };

  I.frases = {
    zeus: '⚡ Zeus hurls his thunderbolt and the whole sky trembles!',
    hera: '🦚 Hera spreads her peacock’s tail and its hundred eyes gaze at you.',
    poseidon: '🔱 Poseidon raises his trident and sends a wave!',
    atenea: '🦉 Athena’s owl leaves you a secret scroll: Isaac’s résumé.',
    helios: '☀️ Helios guides his chariot of fire toward the horizon… and the sun sets.',
    selene: '🌙 Selene puts away her silver chariot… and dawn arrives.',
    apolo: '🎶 Apollo plays his lyre! The columns of Olympus sing.',
    artemisa: '🏹 Artemis lets the arrow fly… and it vanishes into the distance. She never misses, just like an on-time delivery.',
    ares: '⚔️ Ares crosses his swords and raises his shield! Every step marches into battle.',
    afrodita: '🌹 Aphrodite blesses your business with the love of your customers.',
    hefesto: '🔨 Hephaestus forged Mantenimiento Integral… and he’s already heating the anvil for your website.',
    hermes: '🪽 Hermes, the messenger, flies you back to the top.',
    dioniso: '🍇 Dionysus started the party! Everything is spinning…',
    hades: '💀 Hades lends you his helmet: for a few seconds, you’re invisible…'
  };

  I.saludos = {
    muertos: '🌼 Day of the Dead: Olympus also remembers those who are gone.',
    navidad: '🎄 Merry Christmas from Olympus!',
    anonuevo: '🎆 Happy New Year! May this be the year your business becomes a legend.',
    reyes: '👑 The Three Kings are on their way, following their star…',
    sanvalentin: '💘 Aphrodite is on the loose: happy Valentine’s Day.',
    feria: '🎡 It’s San Marcos National Fair season in Aguascalientes!',
    patrias: '🇲🇽 ¡Viva México! Independence Day on Olympus.'
  };
  I.estaciones = { primavera: 'spring', verano: 'summer', otono: 'autumn', invierno: 'winter' };

  function aplicar() {
    var en = I.lang === 'en';
    document.documentElement.lang = I.lang;
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
      el.innerHTML = en ? el.dataset.en : el.dataset.es;
    });
    [['data-en-aria', 'aria-label'], ['data-en-title', 'title']].forEach(function (par) {
      document.querySelectorAll('[' + par[0] + ']').forEach(function (el) {
        var guarda = 'data-es-' + par[1];
        if (!el.hasAttribute(guarda)) el.setAttribute(guarda, el.getAttribute(par[1]) || '');
        el.setAttribute(par[1], en ? el.getAttribute(par[0]) : el.getAttribute(guarda));
      });
    });
    document.title = I.t('Olimpo · Diseño web en Aguascalientes', 'Olimpo · Web design from Aguascalientes, Mexico');
    var b = document.getElementById('btnIdioma');
    if (b) { b.textContent = en ? 'ES' : 'EN'; b.setAttribute('aria-label', en ? 'Leer en español' : 'Read in English'); b.title = b.getAttribute('aria-label'); }
  }
  I.aplicar = aplicar;
  aplicar();

  var btn = document.getElementById('btnIdioma');
  if (btn) btn.addEventListener('click', function () {
    I.lang = I.lang === 'en' ? 'es' : 'en';
    try { localStorage.setItem('olimpo-idioma', I.lang); } catch (e) {}
    aplicar();
    I.alCambiar.forEach(function (fn) { try { fn(); } catch (e) {} });
  });
})();
