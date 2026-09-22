# Flipbook 書架

一個類似 issuu 的靜態網站：把 PDF 放進 `pdfs/` 資料夾，瀏覽者點連結就能像翻書一樣閱讀。
全部是靜態檔案，架在 GitHub Pages 上，不需要伺服器或資料庫。

- Repo：https://github.com/e74134079-hub/Portfolio_Hsieh-Tsai-En
- 網站：https://e74134079-hub.github.io/Portfolio_Hsieh-Tsai-En/
- 本機資料夾：`C:\Users\user\Desktop\flipbook`

---

## 常用指令小抄

每次要改東西之前，先在 `flipbook` 資料夾的終端機裡打這行，把遠端的最新狀態拉下來，**可以避免推送被拒絕**：

```bash
git pull origin main --no-edit
```

**新增一本 PDF**

1. 把 PDF 複製到 `pdfs\` 資料夾。
2.（選用）打開 `books.json` 幫它加標題，見下方〈自訂標題與說明〉。
3. 推上去：

```bash
git pull origin main --no-edit
git add .
git commit -m "新增 檔名.pdf"
git push
```

**移除一本 PDF**

1. 如果 `books.json` 裡有寫到它，先刪掉那一段。
2. 推上去：

```bash
git pull origin main --no-edit
git rm "pdfs/檔名.pdf"
git add books.json
git commit -m "移除 檔名.pdf"
git push
```

**改網頁本身（index.html / viewer.html / books.json 等）**

在 VS Code 編輯、存檔後：

```bash
git pull origin main --no-edit
git add .
git commit -m "說明這次改了什麼"
git push
```

推送完約 1 分鐘後，網站就會更新（強制重新整理 Ctrl+F5 才看得到最新版）。

---

## 如果 `git push` 被拒絕（rejected）

代表 GitHub 上有本機沒有的新變動（例如曾經用網頁上傳過檔案）。解法：

```bash
git pull origin main --no-edit
git push
```

**如果 `git pull` 顯示 `error: The following untracked working tree files would be overwritten`**
（通常是本機有個檔案還沒 commit，剛好跟遠端衝到）：

```bash
git add .
git commit -m "先存起來"
git pull origin main --no-edit
git push
```

**如果出現 `CONFLICT`**（多半發生在 PDF 這種二進位檔，沒辦法自動合併）：
確定要保留「本機這份」的話：

```bash
git checkout --ours "pdfs/檔名.pdf"
git add "pdfs/檔名.pdf"
git commit --no-edit
git push
```

若是要保留「遠端那份」，把 `--ours` 改成 `--theirs`。

---

## 自訂標題與說明

編輯 `books.json`：

```json
{
  "site": { "title": "我的作品集", "subtitle": "點選封面即可翻閱" },
  "books": [
    { "file": "portfolio-2026.pdf", "title": "作品集 2026", "subtitle": "Studio IV", "date": "2026" },
    { "file": "old-work.pdf", "title": "舊作", "hidden": true },
    { "file": "report.pdf", "title": "報告", "download": false, "cover": "pdfs/report-cover.jpg" },
    { "file": "wide-slides.pdf", "title": "橫式簡報", "layout": "single" },
    { "file": "storybook.pdf", "title": "繪本", "layout": "double" }
  ]
}
```

| 欄位 | 說明 |
|---|---|
| `file` | `pdfs/` 裡的檔名（必填） |
| `title` / `subtitle` / `date` | 顯示在書架上的文字；沒填就用檔名 |
| `hidden: true` | 不顯示在書架上（連結仍可開啟） |
| `download: false` | 隱藏閱讀器上的下載按鈕 |
| `cover` | 用指定圖片當封面，不填則自動用 PDF 第一頁 |
| `layout` | 這本 PDF 預設用單頁還是雙頁閱讀，見下方說明 |

`books.json` 裡的順序就是書架上的順序；沒寫進 `books.json` 的新檔案會排在最前面。

### 單頁 / 雙頁模式（`layout`）

| 值 | 效果 |
|---|---|
| 不填（預設） | 自動：畫面夠寬就顯示跨頁，太窄就單頁；手機轉成橫向時會自動切成雙頁 |
| `"double"` | 一律用雙頁（跨頁）顯示，不論螢幕大小 — 適合直式的書、繪本、作品集 |
| `"single"` | 一律用單頁顯示，就算螢幕很寬也不跳成雙頁 — 適合橫式投影片、單張海報這類「每頁各自獨立」的內容 |

不管哪種模式，第一頁一律當作封面單獨顯示（之後才開始配對成跨頁），符合書本的翻閱習慣。

---

## 檔案大小

- 用 git push 上傳單檔上限 **100 MB**；GitHub 網頁上傳單檔上限 **25 MB**。
- 作品集建議先壓縮到 20 MB 以下（Acrobat「減少檔案大小」或 PDF 匯出時圖片設 150–200 dpi），閱讀速度會快很多。
- 閱讀器只會下載目前翻到的頁面附近的資料，大檔案也能較快開始閱讀。

## 分享連結

```
https://e74134079-hub.github.io/Portfolio_Hsieh-Tsai-En/viewer.html?book=檔名.pdf
```

加上 `&page=12` 可直接打開第 12 頁（閱讀時網址會自動更新，直接複製當下網址即可分享目前頁面）。

## 閱讀器功能

- 拖曳頁角或點擊翻頁，鍵盤 ← → 翻頁、Home / End 跳到首尾
- 翻頁音效（右上角可關閉，會記住設定）
- 放大檢視（Z）：滑鼠滾輪或雙指縮放、拖曳平移、雙擊切換放大
- 全螢幕（F）、複製連結、下載 PDF
- 手機直向自動用單頁、橫向自動切成雙頁（可用 `layout` 針對個別 PDF 覆寫，見上）
- 標題字型：Noto Sans TC

## 本機預覽

```
py -m http.server 8000
```
然後打開 http://localhost:8000 。（本機預覽只會顯示 `books.json` 裡列出的書。）

## 使用的開源套件

- [PDF.js](https://mozilla.github.io/pdf.js/) 3.11 — Apache-2.0
- [StPageFlip](https://github.com/Nodlik/StPageFlip) 2.0.7 — MIT
