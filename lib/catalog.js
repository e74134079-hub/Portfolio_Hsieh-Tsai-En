/* 書目載入：books.json（標題、說明、排序）＋ GitHub API（自動偵測 pdfs/ 內的新檔案） */
(function () {
  const PDF_DIR = 'pdfs/';

  function safeName(name) {
    if (!name || typeof name !== 'string') return null;
    if (name.includes('..') || name.includes(':') || name.startsWith('/') || name.includes('\\')) return null;
    if (!/\.pdf$/i.test(name)) return null;
    return name;
  }

  function prettyTitle(file) {
    return file.replace(/\.pdf$/i, '').split('/').pop().replace(/[_-]+/g, ' ').trim();
  }

  // 從網址推測 GitHub 帳號與 repo（例：ann.github.io/flipbook/ → ann / flipbook）
  function guessRepo(cfg) {
    const g = (cfg && cfg.github) || {};
    if (g.owner && g.repo) return { owner: g.owner, repo: g.repo, branch: g.branch || 'main' };
    const host = location.hostname;
    const m = host.match(/^([^.]+)\.github\.io$/i);
    if (!m) return null;
    const seg = location.pathname.split('/').filter(Boolean)[0];
    const repo = seg && !seg.includes('.') ? seg : `${m[1]}.github.io`;
    return { owner: m[1], repo, branch: g.branch || 'main' };
  }

  async function listFromGitHub(repoInfo) {
    const url = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/pdfs?ref=${encodeURIComponent(repoInfo.branch)}`;
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error('GitHub API ' + res.status);
    const items = await res.json();
    return items.filter(i => i.type === 'file' && /\.pdf$/i.test(i.name)).map(i => ({ file: i.name, size: i.size }));
  }

  async function loadCatalog() {
    let cfg = { site: {}, books: [] };
    try {
      const r = await fetch('books.json', { cache: 'no-cache' });
      if (r.ok) cfg = await r.json();
    } catch (e) { /* 沒有 books.json 也能運作 */ }
    const site = cfg.site || {};
    const listed = (cfg.books || []).filter(b => safeName(b.file));
    const byFile = new Map(listed.map(b => [b.file, b]));

    let books = listed.slice();
    const repoInfo = guessRepo(site);
    if (repoInfo) {
      try {
        const found = await listFromGitHub(repoInfo);
        const present = new Set(found.map(f => f.file));
        // 已列在 books.json 的照原順序；新上傳的放最前面
        const extra = found.filter(f => !byFile.has(f.file)).map(f => ({ file: f.file }));
        books = extra.concat(listed.filter(b => present.has(b.file)));
      } catch (e) { console.warn('GitHub 自動偵測失敗，改用 books.json：', e); }
    }
    books = books.filter(b => !b.hidden).map(b => ({
      ...b,
      title: b.title || prettyTitle(b.file),
      url: PDF_DIR + b.file.split('/').map(encodeURIComponent).join('/')
    }));
    return { site, books };
  }

  window.Catalog = { loadCatalog, safeName, prettyTitle, PDF_DIR };

  window.PDF_OPTS = {
    cMapUrl: 'lib/pdfjs/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'lib/pdfjs/standard_fonts/',
    disableAutoFetch: true,
    disableStream: true
  };
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdfjs/pdf.worker.min.js';
})();
