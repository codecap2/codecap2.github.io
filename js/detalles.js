/* Olimpo · "Detalles que puedes pedir": cada botón deja probar en vivo algo que también puede ir en la página del cliente. */
(function () {
  var C = window.Cielo, S = window.Sonido, $ = function (s) { return document.querySelector(s); };
  var acciones = {
    codice: function () { var b = $('#abrirReto'); if (b) b.click(); },
    trueno: function () {
      if (S && !S.on) { var bs = $('#btnSonido'); if (bs) bs.click(); }   // si el sonido estaba apagado, lo enciende para que se escuche
      if (C && C.destello) C.destello();
    },
    idioma: function () { var b = $('#btnIdioma'); if (b) b.click(); },
    ola: function () {
      var o = $('#ola'); if (!o) return;
      o.classList.remove('activo'); void o.offsetWidth; o.classList.add('activo');
      if (S && S.play) S.play('ola');
    }
  };
  document.querySelectorAll('#detalles [data-probar]').forEach(function (b) {
    b.addEventListener('click', function () { var a = acciones[b.getAttribute('data-probar')]; if (a) a(); });
  });
})();
