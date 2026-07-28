# 發布流程

這份設計系統會發布到 npm，讓應用程式的 repo 用 `npm install` 就能使用，
不必手動複製檔案或從 git 安裝。

套件名稱：`@aaron-uxui/leave-management-design-system`

---

## 為什麼要發布

不發布的話，工程團隊只有三個選擇，每個都有代價：

| 做法 | 問題 |
| --- | --- |
| 複製貼上元件原始碼 | 設計改版時要人工同步，很快就會分岔 |
| 從 git 直接安裝 | 每次安裝都要在對方機器上建置，且版本只能靠 commit hash 指定 |
| 把 repo 當 monorepo 的一個 package | 只有在應用程式跟設計系統在同一個 repo 時才可行 |

發布之後，應用程式端寫 `"@aaron-uxui/leave-management-design-system": "^0.2.0"`，
版本語意清楚，升級與回退都可控。

---

## 一次性設定（只要做一次）

### 1. 建立 npm 帳號

到 <https://www.npmjs.com/signup> 註冊。**帳號名稱建議用 `aaron-uxui`**，
因為套件名稱前面的 `@aaron-uxui` 這個 scope 必須跟你的 npm 帳號或組織同名。

如果你註冊了別的名稱，記得把 `package.json` 的 `name` 一起改掉。

### 2. 產生一組自動化用的 token

登入 npm 之後：

1. 右上角頭像 → **Access Tokens**
2. **Generate New Token** → 選 **Granular Access Token**
3. Expiration 選一個你能接受的期限（例如 90 天，到期要換新的）
4. Packages and scopes → 權限選 **Read and write**
5. 產生後把那串字複製起來 —— **它只會顯示這一次**

> 為什麼不用 Classic Token？Granular token 可以限定只對特定套件有寫入權限，
> 萬一外洩，損害範圍比一把全帳號的鑰匙小得多。

### 3. 把 token 交給 GitHub

到 repo 的 **Settings → Secrets and variables → Actions → New repository secret**：

- Name：`NPM_TOKEN`
- Secret：剛才複製的那串

這樣 GitHub Actions 才有權限代你發布。token 存進 secret 之後就看不到內容了，
連你自己也看不到 —— 這是正常的。

---

## 每次發版要做的事

只有三個指令：

```bash
npm version minor
```

這個指令會做三件事：更新 `package.json` 的版號、建立一個 commit、
打上 `v0.2.0` 這樣的標籤。

```bash
git push && git push --tags
```

推送標籤會觸發「發布套件」工作流程。它會先核對標籤與 `package.json` 的版號一致，
再跑 token 稽核、型別檢查、lint、單元測試、建置，全部通過才真的發布。

**不需要手動執行 `npm publish`。** 本機發布容易漏掉檢查，
也會讓「發出去的東西」跟「repo 裡的東西」對不上。

---

## 版號怎麼選

用 `npm version <這裡>`：

| 指令 | 版號變化 | 什麼時候用 |
| --- | --- | --- |
| `npm version patch` | 0.2.0 → 0.2.1 | 修 bug、改註解、調整不影響外觀的內部實作 |
| `npm version minor` | 0.2.0 → 0.3.0 | 新增元件或 token、新增 props、視覺調整但不破壞既有用法 |
| `npm version major` | 0.2.0 → 1.0.0 | 刪除或改名 props、刪除 token、改變既有元件的預設行為 |

對設計系統來說，**「視覺變了」不一定是破壞性變更**。
判斷標準是：使用端的程式碼需不需要跟著改？
Figma 把主色調深一階 → minor（程式碼不用動）；
把 `SecondaryButton` 的 `state` prop 改名 → major（使用端要改）。

目前版號是 `0.x`，代表 API 還沒穩定。等元件介面確定不會再大改，
再發 `1.0.0` 宣告穩定。

---

## 應用程式端怎麼用

```bash
npm install @aaron-uxui/leave-management-design-system
```

```tsx
import { PrimaryButton, PageLayout } from '@aaron-uxui/leave-management-design-system';
import '@aaron-uxui/leave-management-design-system/styles.css';
```

只要 token 不要元件的話：

```css
@import '@aaron-uxui/leave-management-design-system/tokens.css';
```

`react` 與 `react-dom` 是 peer dependency，由應用程式端提供，
所以不會出現兩份 React 打架的情況。

---

## 常見狀況

**發布失敗說版本已存在** —— npm 的版本不能覆蓋也不能重發。
提一個新版號就好（`npm version patch`）。

**發布失敗說沒有權限** —— 檢查 `NPM_TOKEN` 是不是過期了。
Granular token 有期限，到期要重新產生並更新 secret。

**第一次發布 scoped 套件失敗** —— scoped 套件預設是私有的，
需要 `--access public`。這已經寫在 `package.json` 的 `publishConfig` 裡，
不用另外處理。

**想先確認會打包哪些檔案** —— 執行 `npm pack --dry-run`，
它會列出即將被打包的檔案清單，但不會真的發布。
