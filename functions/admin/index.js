// GET /admin: the product and image editor. Protected by _middleware.js.

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin: Shop editor</title>
<style>
  :root { --bg:#f4f4f5; --card:#fff; --border:#e4e4e7; --text:#18181b; --muted:#71717a; --accent:#18181b; --gold:#d7262f; --danger:#dc2626; }
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2rem 1rem; }
  .wrap { max-width: 900px; margin: 0 auto; }
  header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.5rem; }
  h1 { font-size: 1.5rem; margin: 0; }
  h2 { font-size: 1.05rem; margin: 2rem 0 .75rem; }
  a.logout { font-size: .85rem; color: var(--muted); text-decoration: none; }
  a.logout:hover { color: var(--danger); }
  .bar { display: flex; gap: .5rem; flex-wrap: wrap; align-items: center; margin-bottom: 1rem; }
  button { font: inherit; cursor: pointer; border: none; border-radius: 999px; padding: .55rem 1.1rem; background: var(--accent); color: #fff; }
  button:hover { background: #333; }
  button.secondary { background: #fff; color: var(--text); border: 1px solid var(--border); }
  button.danger { background: #fff; color: var(--danger); border: 1px solid #fecaca; }
  button:disabled { opacity: .5; cursor: default; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 1rem; margin-bottom: 1rem; display: grid; gap: 1rem; grid-template-columns: 130px 1fr; }
  @media (max-width: 640px) { .card { grid-template-columns: 1fr; } }
  .thumb { width: 130px; height: 130px; border-radius: 10px; background: #fafafa; border: 1px dashed var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: .75rem; color: var(--muted); }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .thumb-actions { margin-top: .4rem; font-size: .8rem; text-align: center; }
  .fields { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem .8rem; }
  @media (max-width: 640px) { .fields { grid-template-columns: 1fr; } }
  label { display: flex; flex-direction: column; font-size: .75rem; color: var(--muted); gap: .25rem; }
  label.full { grid-column: 1 / -1; }
  input, select, textarea { font: inherit; font-size: .9rem; color: var(--text); padding: .5rem .65rem; border: 1px solid var(--border); border-radius: 8px; background: #fff; }
  textarea { resize: vertical; min-height: 60px; }
  .checks { display: flex; gap: 1.25rem; align-items: center; font-size: .85rem; color: var(--text); flex-direction: row; }
  .checks label { flex-direction: row; align-items: center; gap: .4rem; color: var(--text); font-size: .85rem; }
  .row-actions { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; }
  .status { font-size: .85rem; color: var(--muted); }
  .status.ok { color: #15803d; }
  .status.err { color: var(--danger); }
  .uploads { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: .75rem; }
  .up { background: var(--card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; font-size: .7rem; }
  .up img { width: 100%; height: 110px; object-fit: cover; display: block; }
  .up div { padding: .4rem .5rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dropzone { border: 2px dashed var(--border); border-radius: 12px; padding: 1.5rem; text-align: center; background: var(--card); color: var(--muted); font-size: .9rem; cursor: pointer; }
  .dropzone.dragover { border-color: var(--accent); }
  .hidden { display: none; }
  .empty { color: var(--muted); padding: 1.5rem; text-align: center; }
  .pill { display: inline-block; font-size: .7rem; padding: .15rem .5rem; border-radius: 999px; background: #f4f4f5; color: var(--muted); }
  .pill.off { background: #fee2e2; color: #991b1b; }
  .pill.feat { background: #fde7e8; color: var(--gold); }
  .toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--text); color: #fff; padding: .6rem 1.2rem; border-radius: 8px; font-size: .85rem; opacity: 0; transition: opacity .3s; pointer-events: none; }
  .toast.show { opacity: 1; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Shop editor</h1>
    <a class="logout" href="/admin/logout">Log out</a>
  </header>

  <div class="bar">
    <button id="addBtn" class="secondary">+ Add a piece</button>
    <button id="saveBtn">Save all changes</button>
    <span id="status" class="status"></span>
  </div>

  <div id="list"></div>
  <p id="empty" class="empty hidden">No pieces yet. Click “Add a piece” to start.</p>

  <h2>Photos</h2>
  <div class="dropzone" id="dropzone">Click to choose photos, or drag them here. Then use “Use photo” on a piece to attach one.</div>
  <input type="file" id="fileInput" accept="image/*" multiple class="hidden">
  <div class="uploads" id="uploads" style="margin-top:1rem"></div>
</div>

<div class="toast" id="toast"></div>

<script>
var CATS = ['Shoes', 'Bags', 'Accessories'];
var products = [];
var photoTarget = null;
var saveTimer = null;

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2200);
}
function setStatus(msg, cls) {
  var s = document.getElementById('status');
  s.textContent = msg; s.className = 'status ' + (cls || '');
}
function newId() {
  return 'item-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

async function load() {
  try {
    var r = await fetch('/admin/products');
    var data = await r.json();
    products = data.products || [];
  } catch (e) {
    setStatus('Could not load the product list.', 'err');
  }
  render();
}

function render() {
  var list = document.getElementById('list');
  document.getElementById('empty').classList.toggle('hidden', products.length > 0);
  list.innerHTML = products.map(function (p, i) {
    var img = p.image
      ? '<img src="' + esc(p.image) + '" alt="">'
      : 'No photo';
    return (
      '<div class="card" data-i="' + i + '">' +
        '<div>' +
          '<div class="thumb">' + img + '</div>' +
          '<div class="thumb-actions">' +
            '<a href="#" data-act="pickphoto">Use photo</a>' +
            (p.image ? ' · <a href="#" data-act="nophoto">Remove</a>' : '') +
          '</div>' +
        '</div>' +
        '<div class="fields">' +
          '<label>Name<input data-f="name" value="' + esc(p.name) + '"></label>' +
          '<label>Category<select data-f="category">' +
            CATS.map(function (c) { return '<option' + (c === p.category ? ' selected' : '') + '>' + c + '</option>'; }).join('') +
          '</select></label>' +
          '<label>Price<input data-f="price" value="' + esc(p.price) + '" placeholder="e.g. GHS 450"></label>' +
          '<label>Position on site (lower shows first)<input data-f="position" type="number" value="' + esc(p.position) + '"></label>' +
          '<label class="full">Description<textarea data-f="description" rows="2">' + esc(p.description) + '</textarea></label>' +
          '<div class="checks full">' +
            '<label><input type="checkbox" data-f="featured"' + (p.featured ? ' checked' : '') + '> Show in top carousel</label>' +
            '<label><input type="checkbox" data-f="visible"' + (p.visible !== false ? ' checked' : '') + '> Visible on site</label>' +
            (p.featured ? '<span class="pill feat">Carousel</span>' : '') +
            (p.visible === false ? '<span class="pill off">Hidden</span>' : '') +
          '</div>' +
          '<div class="row-actions">' +
            '<span class="status">ID: ' + esc(p.id) + '</span>' +
            '<button class="danger" data-act="remove">Remove piece</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

// Field edits update the in-memory list; saving sends it to the server.
document.getElementById('list').addEventListener('input', function (e) { edit(e.target, 'input'); });
document.getElementById('list').addEventListener('change', function (e) { edit(e.target, 'change'); });

function edit(el, kind) {
  var card = el.closest('.card');
  if (!card) return;
  var p = products[Number(card.dataset.i)];
  var f = el.dataset.f;
  if (!f) return;
  if (el.type === 'checkbox') p[f] = el.checked;
  else if (f === 'position') p[f] = Number(el.value);
  else p[f] = el.value;
  if (kind === 'change' && (f === 'featured' || f === 'visible')) render();
  setStatus('Unsaved changes', '');
}

document.getElementById('list').addEventListener('click', function (e) {
  var a = e.target.closest('[data-act]');
  if (!a) return;
  e.preventDefault();
  var card = a.closest('.card');
  var i = Number(card.dataset.i);
  var act = a.dataset.act;
  if (act === 'remove') {
    if (!confirm('Remove this piece from the shop?')) return;
    products.splice(i, 1);
    render(); setStatus('Unsaved changes', '');
  }
  if (act === 'nophoto') {
    products[i].image = '';
    render(); setStatus('Unsaved changes', '');
  }
  if (act === 'pickphoto') {
    photoTarget = i;
    toast('Now click a photo below to attach it.');
  }
});

document.getElementById('addBtn').addEventListener('click', function () {
  products.unshift({
    id: newId(), name: 'New piece', category: 'Shoes', description: '',
    price: 'On request', image: '', position: 999, featured: false, visible: true
  });
  render(); setStatus('Unsaved changes', '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('saveBtn').addEventListener('click', save);

async function save() {
  // Give every piece a readable ID the first time it is saved.
  var used = {};
  products.forEach(function (p) {
    if (!p.id || !/^[a-z0-9-]+$/.test(p.id) || p.id.indexOf('item-') === 0) {
      var base = slugify(p.name) || 'piece';
      var id = base, n = 2;
      while (used[id]) { id = base + '-' + n++; }
      p.id = id;
    }
    used[p.id] = true;
  });
  var btn = document.getElementById('saveBtn');
  btn.disabled = true; setStatus('Saving…', '');
  try {
    var r = await fetch('/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: products })
    });
    var data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Save failed');
    setStatus('Saved ' + data.count + ' pieces. Live within a minute.', 'ok');
    render();
  } catch (e) {
    setStatus(e.message, 'err');
  } finally {
    btn.disabled = false;
  }
}

// Photos: upload to R2, then attach to the chosen piece.
var fileInput = document.getElementById('fileInput');
var dz = document.getElementById('dropzone');
dz.addEventListener('click', function () { fileInput.click(); });
['dragover', 'dragenter'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('dragover'); }); });
['dragleave', 'drop'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('dragover'); }); });
dz.addEventListener('drop', function (e) { uploadPhotos(e.dataTransfer.files); });
fileInput.addEventListener('change', function () { uploadPhotos(fileInput.files); fileInput.value = ''; });

async function uploadPhotos(files) {
  for (var i = 0; i < files.length; i++) {
    var fd = new FormData();
    fd.append('file', files[i]);
    try {
      var r = await fetch('/admin/upload', { method: 'POST', body: fd });
      var d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Upload failed');
      addUploadTile(d.url);
      if (photoTarget !== null && products[photoTarget]) {
        products[photoTarget].image = d.url;
        photoTarget = null;
        render(); setStatus('Photo attached. Save to publish.', '');
      }
    } catch (e) {
      toast('Failed: ' + e.message);
    }
  }
  if (photoTarget === null) toast('Photos uploaded. Use “Use photo” on a piece to attach.');
}

function addUploadTile(url) {
  var div = document.createElement('div');
  div.className = 'up';
  div.innerHTML = '<img src="' + esc(url) + '" alt=""><div>' + esc(url.split('/').pop()) + '</div>';
  document.getElementById('uploads').prepend(div);
}

load();
</script>
</body>
</html>`;

export function onRequestGet() {
  return new Response(HTML, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}