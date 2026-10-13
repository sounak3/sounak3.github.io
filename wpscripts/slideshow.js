/* Screenshot slideshow popup for sounaks.com (no dependencies).
   Links: <a class="ss-thumb" href="full.png" data-gallery="name" data-caption="text"><img ...></a>
   Without JavaScript the links simply open the image. */
(function () {
  'use strict';

  var CSS =
    '.ss-overlay{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;' +
    'background:rgba(0,0,0,.85);font-family:Arial,sans-serif;}' +
    '.ss-overlay.ss-open{display:flex;}' +
    '.ss-frame{position:relative;max-width:92vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;}' +
    '.ss-img{max-width:92vw;max-height:78vh;background:#fff;border:6px solid #fff;border-radius:4px;' +
    'box-shadow:0 8px 30px rgba(0,0,0,.6);transition:opacity .25s ease;}' +
    '.ss-caption{margin-top:10px;color:#fff;font-size:15px;text-align:center;max-width:80vw;}' +
    '.ss-count{color:#bbb;font-size:13px;margin-left:8px;}' +
    '.ss-btn{position:fixed;border:0;background:rgba(255,255,255,.15);color:#fff;cursor:pointer;' +
    'border-radius:50%;width:48px;height:48px;font-size:26px;line-height:48px;text-align:center;padding:0;' +
    'transition:background-color .15s ease,transform .15s ease;}' +
    '.ss-btn:hover,.ss-btn:focus{background:rgba(255,255,255,.35);transform:scale(1.08);outline:none;}' +
    '.ss-prev{left:18px;top:50%;margin-top:-24px;}' +
    '.ss-next{right:18px;top:50%;margin-top:-24px;}' +
    '.ss-close{right:18px;top:18px;font-size:30px;}' +
    '.ss-play{right:78px;top:18px;font-size:18px;}' +
    '.ss-single .ss-prev,.ss-single .ss-next,.ss-single .ss-play{display:none;}';

  var PLAY_MS = 4000;
  var overlay, img, caption, count, playBtn, items = [], index = 0, timer = null, touchX = null, lastFocus = null;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function build() {
    var style = el('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    overlay = el('div', 'ss-overlay');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Screenshots');
    var frame = el('div', 'ss-frame');
    img = el('img', 'ss-img');
    img.alt = '';
    caption = el('div', 'ss-caption');
    frame.appendChild(img);
    frame.appendChild(caption);

    var prev = el('button', 'ss-btn ss-prev', '‹');
    var next = el('button', 'ss-btn ss-next', '›');
    var close = el('button', 'ss-btn ss-close', '×');
    playBtn = el('button', 'ss-btn ss-play', '▶');
    prev.title = 'Previous (←)';
    next.title = 'Next (→)';
    close.title = 'Close (Esc)';
    playBtn.title = 'Play / pause slideshow (Space)';
    prev.type = next.type = close.type = playBtn.type = 'button';

    overlay.appendChild(frame);
    overlay.appendChild(prev);
    overlay.appendChild(next);
    overlay.appendChild(playBtn);
    overlay.appendChild(close);
    document.body.appendChild(overlay);

    prev.addEventListener('click', function (e) { e.stopPropagation(); stop(); go(index - 1); });
    next.addEventListener('click', function (e) { e.stopPropagation(); stop(); go(index + 1); });
    close.addEventListener('click', function (e) { e.stopPropagation(); hide(); });
    playBtn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    img.addEventListener('click', function (e) { e.stopPropagation(); stop(); go(index + 1); });
    overlay.addEventListener('click', hide);   // click on the dark backdrop closes

    overlay.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 40) { stop(); go(index + (dx < 0 ? 1 : -1)); }
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('ss-open')) return;
      if (e.key === 'ArrowLeft') { stop(); go(index - 1); }
      else if (e.key === 'ArrowRight') { stop(); go(index + 1); }
      else if (e.key === 'Escape') { hide(); }
      else if (e.key === ' ' || e.key === 'Spacebar') { toggle(); }
      else return;
      e.preventDefault();
    });
  }

  function go(i) {
    index = (i + items.length) % items.length;
    var a = items[index];
    img.style.opacity = '0';
    var src = a.getAttribute('href');
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      img.src = src;
      img.alt = a.getAttribute('data-caption') || '';
      img.style.opacity = '1';
    };
    pre.src = src;
    caption.textContent = a.getAttribute('data-caption') || '';
    if (items.length > 1) {
      count = el('span', 'ss-count', (index + 1) + ' / ' + items.length);
      caption.appendChild(count);
      new Image().src = items[(index + 1) % items.length].getAttribute('href');   // preload next
    }
  }

  function show(group, start) {
    items = group;
    overlay.classList.toggle('ss-single', items.length < 2);
    lastFocus = document.activeElement;
    overlay.classList.add('ss-open');
    go(start);
    overlay.querySelector('.ss-close').focus();
  }

  function hide() {
    stop();
    overlay.classList.remove('ss-open');
    img.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    playBtn.textContent = '▶';
  }

  function toggle() {
    if (timer) { stop(); return; }
    timer = setInterval(function () { go(index + 1); }, PLAY_MS);
    playBtn.textContent = '❚❚';
  }

  function init() {
    var links = document.querySelectorAll('a.ss-thumb');
    if (!links.length) return;
    build();
    var groups = {};
    Array.prototype.forEach.call(links, function (a) {
      var g = a.getAttribute('data-gallery') || 'default';
      (groups[g] = groups[g] || []).push(a);
    });
    Array.prototype.forEach.call(links, function (a) {
      a.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;   // allow "open in new tab"
        e.preventDefault();
        var group = groups[a.getAttribute('data-gallery') || 'default'];
        show(group, group.indexOf(a));
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
