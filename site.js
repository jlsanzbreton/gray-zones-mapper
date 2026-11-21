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
  // Botón «volver arriba»: aparece al bajar más de tres cuartos de pantalla.
  var topBtn = document.querySelector('.back-to-top');
  if (topBtn) {
    var frame = 0;
    var update = function () {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        var visible = window.scrollY > Math.max(480, window.innerHeight * 0.75);
        topBtn.classList.toggle('visible', visible);
        topBtn.setAttribute('aria-hidden', visible ? 'false' : 'true');
        topBtn.tabIndex = visible ? 0 : -1;
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    topBtn.addEventListener('click', function () {
      topBtn.blur();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // Marca en la barra la sección que se está leyendo.
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var a = byId[e.target.id];
        if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
