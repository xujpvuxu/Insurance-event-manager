# Repository Guidelines

## 專案結構與需求來源

本專案 `Insurance-event-manager` 是以 Vue、Bootstrap 與 Firebase 建置的事件優先序應用程式。根目錄的 `userTask.md` 記載產品決策與互動規則；新增或修改功能前，先依該文件確認行為。

Vue 元件與樣式放在 `src/`；Vite 設定位於 `vite.config.js`；GitHub Pages 部署流程位於 `.github/workflows/deploy.yml`。Firebase 機密設定只放在 `.env` 或 GitHub Actions Secrets，不提交至版本庫。

## 建置、測試與本機開發

使用 Node.js 22 或相容版本。

- `npm install`：安裝相依套件。
- `npm run dev`：啟動 Vite 本機開發伺服器。
- `npm run build`：建置 GitHub Pages 靜態網站。
- `Get-Content -Encoding UTF8 userTask.md`：閱讀產品需求。
- `git status --short`：檢查新增與修改的檔案。
- `git diff --check`：檢查已追蹤檔案差異中的空白問題；新檔案仍須另行檢閱。

建立開發環境時，依 `.env.example` 設定 Firebase；尚未設定時應用程式以本機預覽資料運作。

## 撰寫風格與命名

文件使用 UTF-8 與繁體中文，保留程式識別字及指令原文。Markdown 使用清楚的標題層級、短段落及相對路徑連結；巢狀清單以兩個空白縮排。

需求沿用 `UT-01` 格式，避免任意重編既有編號。目前未指定程式語言、格式化工具或 lint 工具；引入程式碼時，應一併建立符合該語言慣例的縮排、命名與格式化設定。

## 測試與驗收

目前沒有測試框架或覆蓋率門檻。實作後，依 `userTask.md` 的驗收條件驗證，優先涵蓋必填欄位、儲存失敗、篩選、日期邊界、狀態排除及刪除取消等情境。

測試名稱應描述行為，例如「已完成事件不列入逾期提醒」。日期測試需固定時間與時區。提交時記錄實際執行的驗證方式及結果；未執行的測試須明確標示。

## Commit 與 Pull Request

目前 Git 尚無提交紀錄，因此沒有既定訊息慣例。建議使用簡短的動作描述，例如 `docs: 補充 UT-04 到期判定條件`，每次提交聚焦單一目的。

本專案提交訊息使用繁體中文。完成使用者要求的變更後，依使用者指定的 conversation commit 流程建立提交，並在提交後直接推送至遠端。

Pull Request 應說明變更目的、影響範圍、對應任務或議題及驗證結果。介面變更附截圖；需求調整同步更新文件，並明列尚未確認的假設。

## 資料與設定安全

範例及測試使用虛構資料，勿提交真實保單、身分證號或理賠文件。若新增外部服務，將憑證放在環境變數，提供不含機密的設定範例，並在 `.gitignore` 排除本機機密設定。

## Firebase 規則部署

Firestore 規則維護於根目錄 `firestore.rules`，`firebase.json` 將此檔案指定為部署來源，`.firebaserc` 預設專案為 `insurance-event-manager`。修改規則並完成檢查後，使用下列命令直接部署：

```powershell
npx --yes firebase-tools deploy --only firestore:rules --project insurance-event-manager
```

需先確認 Firebase CLI 已登入正確帳號（`npx --yes firebase-tools login:list`）。部署後確認 CLI 顯示規則編譯成功與 `Deploy complete`。本專案已授權以此流程直接發布 Firestore 規則。
