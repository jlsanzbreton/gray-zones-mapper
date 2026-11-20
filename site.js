// Comportamiento común: registro del service worker y email protegido frente a robots de spam.
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
  // El email no aparece entero en el HTML: se compone aquí al cargar la página.
  document.querySelectorAll('.js-mail').forEach(function (a) {
    var addr = a.getAttribute('data-u') + '@' + a.getAttribute('data-d');
    var subject = a.getAttribute('data-s');
    a.href = 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
    if (!a.classList.contains('btn')) a.textContent = addr;
  });
})();
