// FIFAR site interactions: mobile nav, member search, lightbox, mailto forms
(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Member search (also accepts ?q= from the home page search box)
  var search = document.getElementById('member-search');
  if (search) {
    var members = document.querySelectorAll('.member');
    var groups = document.querySelectorAll('.letter-group');
    var empty = document.querySelector('.empty');
    var filter = function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      members.forEach(function (m) {
        var hit = !q || m.dataset.name.indexOf(q) !== -1;
        m.hidden = !hit;
        if (hit) shown++;
      });
      groups.forEach(function (g) {
        g.hidden = !g.querySelector('.member:not([hidden])');
      });
      empty.hidden = shown > 0;
    };
    search.addEventListener('input', filter);
    var q = new URLSearchParams(location.search).get('q');
    if (q) { search.value = q; filter(); }
  }

  // Lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll('a.lb'));
  if (items.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lb-close" aria-label="Close">×</button>' +
      '<button class="lb-prev" aria-label="Previous">‹</button>' +
      '<button class="lb-next" aria-label="Next">›</button>';
    document.body.appendChild(box);
    var img = box.querySelector('img');
    var cap = box.querySelector('figcaption');
    var idx = 0;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      img.src = items[idx].href;
      img.alt = cap.textContent = items[idx].dataset.caption || '';
      box.classList.add('open');
    };
    var close = function () { box.classList.remove('open'); };
    items.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); show(i); });
    });
    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // Forms open the visitor's email client with the fields filled in
  document.querySelectorAll('form[data-mailto]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = [];
      new FormData(form).forEach(function (v, k) { lines.push(k + ': ' + v); });
      location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent(form.dataset.subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
    });
  });
})();
