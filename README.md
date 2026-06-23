# 課程筆記網站

這是網頁設計課程期末作業網站，包含：

- 個人簡介
- 本學期上課內容整理
- 期末專題：課程筆記管理系統
- 前端 React + Vite
- 後端 Node API
- JSON 檔案資料庫

## 本機執行

先啟動後端 API：

```bash
npm run api
```

另開一個終端機啟動前端：

```bash
npm run dev
```

前端預設網址是 `http://localhost:5173`，後端 API 預設網址是 `http://localhost:4174`。

## 專題功能

- 瀏覽課程筆記
- 依關鍵字搜尋
- 依分類篩選
- 新增筆記
- 後端寫入 `database/notes.json`

## 作業繳交建議

- 個人網站：可將前端部署到 GitHub Pages、Netlify 或 Vercel。
- 期末專題：首頁的「開啟期末專題」會用新分頁打開專題頁。
- 後端資料庫：可將 `server.mjs` 部署到 Render、Railway 或其他 Node 代管平台。
- YouTube 影片：錄製約 5 分鐘，內容包含網站主題、功能操作、後端資料庫說明。
- GitHub repo：上傳本專案原始碼後繳交 repo 網址。
