# Flipbook 書架

一個類似 issuu 的靜態網站：把 PDF 放進 `pdfs/` 資料夾，瀏覽者點連結就能像翻書一樣閱讀。
全部是靜態檔案，可直接放在 GitHub Pages，不需要伺服器或資料庫。

## 架設步驟（約 5 分鐘）

1. 在 GitHub 建立新 repo，例如 `flipbook`（設為 Public）。
2. 把這個資料夾內的**所有檔案**上傳到 repo 根目錄（包含 `lib/`、`pdfs/`、`.nojekyll`）。
   - 網頁上傳：repo 頁面 → **Add file → Upload files** → 拖進整個資料夾內容。
3. repo → **Settings → Pages** → Source 選 **Deploy from a branch**，Branch 選 `main` / `(root)` → Save。
4. 約 1 分鐘後網站上線：`https://<你的帳號>.github.io/flipbook/`

## 新增一本書

1. 把 PDF 上傳到 `pdfs/` 資料夾（檔名建議用英文、數字、`-`，例如 `portfolio-2026.pdf`）。
2. 完成。書架會**自動**偵測 `pdfs/` 裡的新檔案並顯示在最前面。
3. 分享連結：`https://<你的帳號>.github.io/flipbook/viewer.html?book=portfolio-2026.pdf`
   - 加上 `&page=12` 可直接打開第 12 頁（閱讀時網址會自動更新，直接複製即可）。

## 自訂標題與說明（選用）

編輯 `books.json`：

```json
{
  "site": { "title": "我的作品集", "subtitle": "點選封面即可翻閱" },
  "books": [
    { "file": "portfolio-2026.pdf", "title": "作品集 2026", "subtitle": "Studio IV", "date": "2026" },
    { "file": "old-work.pdf", "title": "舊作", "hidden": true },
    { "file": "report.pdf", "title": "報告", "download": false, "cover": "pdfs/report-cover.jpg" }
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

`books.json` 裡的順序就是書架上的順序；沒寫進 `books.json` 的新檔案會排在最前面。

## 檔案大小

- GitHub 網頁上傳單檔上限 **25 MB**；用 git 上傳上限 **100 MB**。
- 作品集建議先壓縮到 20 MB 以下（Acrobat「減少檔案大小」或 PDF 匯出時圖片設 150–200 dpi），閱讀速度會快很多。
- 閱讀器只會下載目前翻到的頁面附近的資料，大檔案也能較快開始閱讀。

## 閱讀器功能

- 拖曳頁角或點擊翻頁，鍵盤 ← → 翻頁、Home / End 跳到首尾
- 翻頁音效（右上角可關閉，會記住設定）
- 放大檢視（Z）：滑鼠滾輪或雙指縮放、拖曳平移、雙擊切換放大
- 全螢幕（F）、複製連結、下載 PDF
- 手機自動切換成單頁模式

## 使用自訂網域時

書架自動偵測新檔案是透過 GitHub API，網址要是 `xxx.github.io` 才能自動判斷 repo。
若使用自訂網域，請在 `books.json` 填入：

```json
"site": { "github": { "owner": "你的帳號", "repo": "flipbook", "branch": "main" } }
```

## 本機預覽

```
py -m http.server 8000
```
然後打開 http://localhost:8000 。（本機預覽只會顯示 `books.json` 裡列出的書。）

## 使用的開源套件

- [PDF.js](https://mozilla.github.io/pdf.js/) 3.11 — Apache-2.0
- [StPageFlip](https://github.com/Nodlik/StPageFlip) 2.0.7 — MIT
