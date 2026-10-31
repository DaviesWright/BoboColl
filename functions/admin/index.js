// GET /admin: the shop editor and image library. Protected by _middleware.js.

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
  h2 { font-size: 1.05rem; margin: 2.5rem 0 .75rem; display: flex; justify-content: space-between; align-items: baseline; }
  h2 .count { font-size: .8rem; font-weight: 400; color: var(--muted); }
  a.logout { font-size: .85rem; color: var(--muted); text-decoration: none; }
  a.logout:hover { color: var(--danger); }
  .bar { display: flex; gap: .5rem; flex-wrap: wrap; align-items: center; margin-bottom: 1rem; }
  button { font: inherit; cursor: pointer; border: none; border-radius: 999px; padding: .55rem 1.1rem; background: var(--accent); color: #fff; }
  button:hover { background: #333; }
  button.secondary { background: #fff; color: var(--text); border: 1px solid var(--border); }
  button.secondary:hover { background: #f4f4f5; }
  button.danger { background: #fff; color: var(--danger); border: 1px solid #fecaca; }
  button.danger:hover { background: #fef2f2; }
  button:disabled { opacity: .5; cursor: default; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 1rem; margin-bottom: 1rem; display: grid; gap: 1rem; grid-template-columns: 130px 1fr; }
  @media (max-width: 640px) { .card { grid-template-columns: 1fr; } }
  .thumb { width: 130px; height: 130px; border-radius: 10px; background: #fafafa; border: 1px dashed var(--border); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: .75rem; color: var(--muted); }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .thumb-actions { margin-top: .4rem; font-size: .8rem; text-align: center; }
  .thumb-actions a { color: var(--gold); text-decoration: none; }
  .fields { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem .8rem; }
  @media (max-width: 640px) { .fields { grid-template-columns: 1fr; } }
  label { display: flex; flex-direction: column; font-size: .75rem; color: var(--muted); gap: .25rem; }
  label.full { grid-column: 1 / -1; }
  input, select, textarea { font: inherit; font-size: .9rem; color: var(--text); padding: .5rem .65rem; border: 1px solid var(--border); border-radius: 8px; background: #fff; }
  textarea { resize: vertical; min-height: 60px; }
  .checks { display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap; font-size: .85rem; }
  .checks label { flex-direction: row; align-items: center; gap: .4rem; color: var(--text); font-size: .85rem; }
  .row-actions { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; }
  .status { font-size: .85rem; color: var(--muted); }
  .status.ok { color: #15803d; }
  .status.err { color: var(--danger); }
  .dropzone { border: 2px dashed var(--border); border-radius: 12px; padding: 1.25rem; text-align: center; background: var(--card); color: var(--muted); font-size: .9rem; cursor: pointer; }
  .dropzone.dragover { border-color: var(--accent); }
  .hidden { display: none; }
  .empty { color: var(--muted); padding: 1.5rem; text-align: center; }
  .pill { display: inline-block; font-size: .7rem; padding: .15rem .5rem; border-radius: 999px; background: #f4f4f5; color: var(--muted); }
  .pill.off { background: #fee2e2; color: #991b1b; }
  .pill.feat { background: #fde7e8; color: var(--gold); }
  .lib-list { display: grid; gap: .6rem; }
  .lib-row { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: .6rem; display: grid; grid-template-columns: 72px 1fr auto; gap: .8rem; align-items: center; }
  @media (max-width: 640px) { .lib-row { grid-template-columns: 56px 1fr; } .lib-actions { grid-column: 1 / -1; } }
  .lib-row img { width: 72px; height: 72px; object-fit: cover; border-radius: 8px; background: #fafafa; }
  @media (max-width: 640px) { .lib-row img { width: 56px; height: 56px; } }
  .lib-info { min-width: 0; display: grid; gap: .25rem; }
  .lib-name { font-size: .85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .lib-actions { display: flex; gap: .4rem; flex-wrap: wrap; }
  .lib-actions button { font-size: .8rem; padding: .4rem .75rem; }
  .toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--text); color: #fff; padding: .6rem 1.2rem; border-radius: 8px; font-size: .85rem; opacity: 0; transition: opacity .3s; pointer-events: none; max-width: 90vw; text-align: center; }
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

  <h2>Image library <span class="count" id="libCount"></span></h2>
  <p class="status" style="margin:-.4rem 0 .9rem">Upload photos here, then attach them to a piece above. Photos in use by a piece cannot be deleted. Save your changes first so the list is accurate.</p>
  <div class="dropzone" id="dropzone">Click to upload photos, or drag them here</div>
  <input type="file" id="fileInput" accept="image/*" multiple class="hidden">
  <div class="lib-list" id="library" style="margin-top:1rem"></div>
</div>

<div class="toast" id="toast"></div>

<script>
var CATS = ['Shoes', 'Bags', 'Accessories'];
var products = [];
var library = [];
var photoTarget = null;

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(function () { t.classList.remove('show'); }, 2600);
}
function setStatus(msg, cls) {
  var s = document.getElementById('status');
  s.textContent = msg;
  s.className = 'status ' + (cls || '');
}
function newId() {
  return 'item-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
function kb(bytes) {
  if (!bytes) return '0 KB';
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return Math.round(bytes / 1024) + ' KB';
}
function fmtDate(s) {
  var d = new Date(s);
  return isNaN(d) ? '' : d.toLocaleDateString();
}

/* ---------------- Shop editor ---------------- */

async function load() {
  try {
    var r = await fetch('/admin/products');
    var data = await r.json();
    products = data.products || [];
  } catch (e) {
    setStatus('Could not load the product list.', 'err');
  }
  render();
  refreshLibrary();
}

function render() {
  document.getElementById('empty').classList.toggle('hidden', products.length > 0);
  document.getElementById('list').innerHTML = products.map(function (p, i) {
    var img = p.image ? '<img src="' + esc(p.image) + '" alt="">' : 'No photo';
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
  renderLibrary();
}

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
  if (f === 'image') renderLibrary();
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
    render();
    setStatus('Unsaved changes', '');
  }
  if (act === 'nophoto') {
    products[i].image = '';
    render();
    setStatus('Unsaved changes', '');
  }
  if (act === 'pickphoto') {
    photoTarget = i;
    toast('Now click a photo in the image library below to attach it.');
    document.getElementById('library').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

document.getElementById('addBtn').addEventListener('click', function () {
  products.unshift({
    id: newId(), name: 'New piece', category: 'Shoes', description: '',
    price: 'On request', image: '', position: 999, featured: false, visible: true
  });
  render();
  setStatus('Unsaved changes', '');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('saveBtn').addEventListener('click', save);

async function save() {
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
  btn.disabled = true;
  setStatus('Saving…', '');
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

/* ---------------- Image library ---------------- */

var dz = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
dz.addEventListener('click', function () { fileInput.click(); });
['dragover', 'dragenter'].forEach(function (ev) {
  dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('dragover'); });
});
['dragleave', 'drop'].forEach(function (ev) {
  dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('dragover'); });
});
dz.addEventListener('drop', function (e) { uploadPhotos(e.dataTransfer.files); });
fileInput.addEventListener('change', function () { uploadPhotos(fileInput.files); fileInput.value = ''; });

async function uploadPhotos(files) {
  var attached = false;
  for (var i = 0; i < files.length; i++) {
    var fd = new FormData();
    fd.append('file', files[i]);
    try {
      var r = await fetch('/admin/upload', { method: 'POST', body: fd });
      var d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Upload failed');
      if (photoTarget !== null && products[photoTarget] && !attached) {
        products[photoTarget].image = d.url;
        photoTarget = null;
        attached = true;
        render();
        setStatus('Photo attached. Save to publish.', '');
      }
    } catch (e) {
      toast('Failed: ' + e.message);
    }
  }
  refreshLibrary();
  toast('Upload complete.');
}

async function refreshLibrary() {
  var list = document.getElementById('library');
  try {
    var r = await fetch('/admin/images');
    if (!r.ok) throw new Error('Could not load photos');
    library = await r.json();
    renderLibrary();
  } catch (e) {
    list.innerHTML = '<p class="empty">' + esc(e.message) + '</p>';
  }
}

function usageMap() {
  var map = {};
  products.forEach(function (p) {
    if (!p.image) return;
    (map[p.image] = map[p.image] || []).push(p.name);
  });
  return map;
}

function renderLibrary() {
  var list = document.getElementById('library');
  document.getElementById('libCount').textContent = library.length ? library.length + ' photos' : '';
  if (!library.length) {
    list.innerHTML = '<p class="empty">No photos uploaded yet.</p>';
    return;
  }
  var map = usageMap();
  list.innerHTML = library.map(function (img, i) {
    var used = map[img.url];
    var status = used
      ? '<span class="pill feat">In use: ' + esc(used.join(', ')) + '</span>'
      : '<span class="pill">Not in use</span>';
    return (
      '<div class="lib-row">' +
        '<img src="' + esc(img.url) + '" alt="">' +
        '<div class="lib-info">' +
          '<div class="lib-name" title="' + esc(img.name) + '">' + esc(img.name) + '</div>' +
          '<div class="status">' + kb(img.size) + ' · ' + esc(fmtDate(img.uploaded)) + '</div>' +
          '<div>' + status + '</div>' +
        '</div>' +
        '<div class="lib-actions">' +
          (photoTarget !== null ? '<button class="secondary" data-lib="attach" data-i="' + i + '">Attach</button>' : '') +
          '<button class="secondary" data-lib="copy" data-i="' + i + '">Copy path</button>' +
          (used ? '' : '<button class="danger" data-lib="delete" data-i="' + i + '">Delete</button>') +
        '</div>' +
      '</div>'
    );
  }).join('');
}

document.getElementById('library').addEventListener('click', function (e) {
  var b = e.target.closest('[data-lib]');
  if (!b) return;
  var img = library[Number(b.dataset.i)];
  if (!img) return;
  if (b.dataset.lib === 'copy') {
    navigator.clipboard.writeText(img.url);
    toast('Path copied: ' + img.url);
  }
  if (b.dataset.lib === 'attach' && photoTarget !== null && products[photoTarget]) {
    products[photoTarget].image = img.url;
    photoTarget = null;
    render();
    setStatus('Photo attached. Save to publish.', '');
    toast('Attached.');
  }
  if (b.dataset.lib === 'delete') deleteImage(img);
});

async function deleteImage(img) {
  var inUse = usageMap()[img.url];
  if (inUse) {
    toast('This photo is in use by ' + inUse.join(', ') + '. Remove it from that piece first.');
    return;
  }
  if (!confirm('Delete ' + img.name + ' permanently?')) return;
  try {
    var r = await fetch('/admin/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: img.key })
    });
    var d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Delete failed');
    toast('Deleted.');
    refreshLibrary();
  } catch (e) {
    toast('Delete failed: ' + e.message);
  }
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