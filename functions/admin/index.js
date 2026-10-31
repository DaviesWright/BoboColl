// GET /admin: the upload page. Lives under functions/admin/ so the login check always runs first.

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin: Image Upload</title>
<style>
  :root { --bg:#f4f4f5; --card:#fff; --border:#e4e4e7; --text:#18181b; --muted:#71717a; --accent:#18181b; --danger:#dc2626; }
  * { box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2rem 1rem; }
  .wrap { max-width: 720px; margin: 0 auto; }
  header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  h1 { font-size: 1.5rem; margin: 0; }
  .logout { font-size: .85rem; color: var(--muted); text-decoration: none; }
  .logout:hover { color: var(--danger); }
  .dropzone { border: 2px dashed var(--border); border-radius: 12px; padding: 3rem 2rem; text-align: center; cursor: pointer; background: var(--card); }
  .dropzone:hover, .dropzone.dragover { border-color: var(--accent); background: #fafafa; }
  .dropzone p { margin: .5rem 0; color: var(--muted); }
  .dz-icon { font-size: 2rem; }
  input[type=file] { display: none; }
  .progress { margin-top: 1rem; }
  .progress-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--accent); width: 0; transition: width .3s; }
  .progress-text { font-size: .8rem; color: var(--muted); margin-top: .3rem; }
  .gallery { margin-top: 2rem; }
  .gallery h2 { font-size: 1.1rem; margin: 0 0 1rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
  .item { background: var(--card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .item img { width: 100%; height: 140px; object-fit: cover; display: block; }
  .item-info { padding: .5rem .75rem; }
  .item-name { font-size: .75rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .item-actions { display: flex; justify-content: space-between; align-items: center; margin-top: .4rem; }
  .copy-btn, .del-btn { font-size: .75rem; padding: .25rem .5rem; border-radius: 6px; border: none; cursor: pointer; }
  .copy-btn { background: var(--border); color: var(--text); }
  .del-btn { background: transparent; color: var(--danger); }
  .empty { text-align: center; color: var(--muted); padding: 2rem; }
  .toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--text); color: #fff; padding: .6rem 1.2rem; border-radius: 8px; font-size: .85rem; opacity: 0; transition: opacity .3s; pointer-events: none; }
  .toast.show { opacity: 1; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>bobo-collections: Admin</h1>
    <a class="logout" href="/admin/logout">Log out</a>
  </header>

  <div class="dropzone" id="dropzone">
    <div class="dz-icon">📁</div>
    <p><strong>Click to browse</strong> or drag and drop images here</p>
    <p style="font-size:.8rem">JPG, PNG, WebP, GIF, SVG. Up to 50 MB each.</p>
    <input type="file" id="fileInput" accept="image/*" multiple>
  </div>

  <div class="progress" id="progress" style="display:none">
    <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    <div class="progress-text" id="progressText"></div>
  </div>

  <div class="gallery">
    <h2>Uploaded images</h2>
    <div class="grid" id="grid"></div>
    <div class="empty" id="empty">No images yet.</div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var progress = document.getElementById('progress');
var progressFill = document.getElementById('progressFill');
var progressText = document.getElementById('progressText');
var grid = document.getElementById('grid');
var empty = document.getElementById('empty');
var toast = document.getElementById('toast');

dropzone.addEventListener('click', function () { fileInput.click(); });
['dragover', 'dragenter'].forEach(function (ev) {
  dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('dragover'); });
});
['dragleave', 'drop'].forEach(function (ev) {
  dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('dragover'); });
});
dropzone.addEventListener('drop', function (e) { fileInput.files = e.dataTransfer.files; uploadFiles(); });
fileInput.addEventListener('change', uploadFiles);

async function uploadFiles() {
  var files = Array.prototype.slice.call(fileInput.files);
  if (!files.length) return;
  progress.style.display = 'block';
  var done = 0;
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    progressText.textContent = 'Uploading ' + file.name + ' (' + (i + 1) + ' of ' + files.length + ')';
    progressFill.style.width = ((done / files.length) * 100) + '%';
    try {
      var fd = new FormData();
      fd.append('file', file);
      var res = await fetch('/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      done++;
    } catch (err) {
      showToast('Failed: ' + err.message);
    }
  }
  progressFill.style.width = '100%';
  progressText.textContent = 'Uploaded ' + done + ' of ' + files.length + '.';
  fileInput.value = '';
  setTimeout(function () { progress.style.display = 'none'; progressFill.style.width = '0'; }, 2000);
  loadImages();
}

async function loadImages() {
  try {
    var res = await fetch('/admin/images');
    if (!res.ok) throw new Error('Failed to load');
    var images = await res.json();
    grid.innerHTML = '';
    if (!images.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    images.forEach(function (img) {
      var div = document.createElement('div');
      div.className = 'item';
      div.innerHTML =
        '<img src="' + img.url + '" loading="lazy" alt="' + img.name + '">' +
        '<div class="item-info">' +
        '<div class="item-name" title="' + img.name + '">' + img.name + '</div>' +
        '<div class="item-actions">' +
        '<button class="copy-btn" data-url="' + img.url + '">Copy URL</button>' +
        '<button class="del-btn" data-key="' + img.key + '">Delete</button>' +
        '</div></div>';
      grid.appendChild(div);
    });
    grid.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(btn.dataset.url);
        showToast('URL copied');
      });
    });
    grid.querySelectorAll('.del-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteImage(btn.dataset.key); });
    });
  } catch (err) {
    empty.textContent = 'Could not load images.';
    empty.style.display = 'block';
  }
}

async function deleteImage(key) {
  if (!confirm('Delete this image?')) return;
  try {
    var res = await fetch('/admin/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: key })
    });
    if (!res.ok) throw new Error(await res.text());
    showToast('Deleted');
    loadImages();
  } catch (err) {
    showToast('Delete failed: ' + err.message);
  }
}

var toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2500);
}

loadImages();
</script>
</body>
</html>`;

export function onRequestGet() {
  return new Response(HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}