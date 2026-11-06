# 日常優先序

以 Vue 3、Bootstrap 5 與 Firebase 建置的事件期限及聯絡人管理工具。介面以繁體中文呈現，並針對手機與桌面調整版面。

## 本機開發

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

尚未設定 Firebase 時，應用程式以瀏覽器本機儲存提供預覽。切換瀏覽器或裝置不會共享預覽資料。

## Firebase 設定

在 Firebase Console 建立專案及 Web App，啟用 Authentication 的 Email/Password 登入，建立 Cloud Firestore。將 Web App 設定填入根目錄 `.env`（可複製 `.env.example`）：

```dotenv
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_APP_ID=...
```

部署時，於 GitHub Repository Settings → Secrets and variables → Actions 新增同名 Secrets：`VITE_FIREBASE_API_KEY`、`VITE_FIREBASE_AUTH_DOMAIN`、`VITE_FIREBASE_PROJECT_ID`、`VITE_FIREBASE_APP_ID`。Firebase Web App 設定值會被編入前端；資料保護必須依賴 Firestore Security Rules，不能把 API key 當作資料存取權限。

## GitHub Pages 自動部署

`.github/workflows/deploy.yml` 會在推送至 `main` 後自動建置並部署。於 Repository Settings → Pages 將 Build and deployment 的 Source 設為 **GitHub Actions**。Vite 的公開路徑目前設定為 `/Insurance-event-manager/`。

每位使用者的事件與聯絡人文件都帶有 `ownerId`。設定 Firestore Rules，僅允許已登入且 `request.auth.uid == resource.data.ownerId` 的使用者讀取、更新或刪除自己的文件；新增時也須驗證 `request.auth.uid == request.resource.data.ownerId`。

## 指令

- `npm run dev`：啟動本機開發伺服器。
- `npm run build`：建置部署用靜態檔案至 `dist/`。
- `npm run preview`：本機預覽建置結果。
