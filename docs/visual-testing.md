# 視覺回歸測試

抓的是這一類問題：**改了共用樣式，卻沒發現它波及了別的元件。**

token 稽核只看有沒有寫死數值，型別檢查只看型別，兩者都不會告訴你按鈕變形了。
這一層是唯一會看「畫面長什麼樣」的把關。

實測過會抓到：把 Primary Button 的圓角從 `radius/s` 改成 `radius/l`，
會在 5 個 story 同時報警 —— 包含 Overlay/Success 與 PageLayout 兩個版型，
那正是改的人不會想到要去檢查的地方。

---

## 怎麼運作

```
npm run build-storybook     建置靜態 Storybook
        ↓
Playwright 逐一開啟每個 story 的 iframe
        ↓
截圖 → 與 tests/__screenshots__/linux/ 的基準比對
        ↓
有差異 → CI 失敗，並附上差異圖
```

story 清單是從 `storybook-static/index.json` 動態讀出來的，
所以**新增 story 不需要改測試程式**，寫完 story 就自動納入比對。

---

## 日常使用

### 我改了程式碼，想確認沒有弄壞別的東西

```bash
npm run build-storybook && npm run vrt
```

本機跑會用 `tests/__screenshots__/darwin/`（或你的作業系統）底下的基準。
這份基準**不進版控**，只供你自己比對用。第一次跑會先產生基準並顯示失敗，
再跑一次才會是綠的 —— 這是 Playwright 的預設行為，不是壞掉。

### 畫面本來就該改，要更新基準

不要在本機更新後 commit。到 GitHub Actions 手動觸發
**「更新視覺基準畫面」**（`visual-baselines.yml`），它會在 Linux 上重新產生
並 commit 回 main。

原因：字體渲染會因作業系統而異。用 macOS 產的基準去跟 CI 的 Linux 比對，
會得到滿江紅的假差異，然後大家就會開始忽略這個測試 —— 那比沒有還糟。

### CI 失敗了，我要看差異在哪

到失敗的 workflow run 頁面下載 `visual-diff-report` artifact，
裡面有 Playwright 的 HTML 報告，每個差異都有「基準 / 實際 / 差異」三張圖可以切換。

---

## 設定上的兩個決定

**門檻用絕對像素數（`maxDiffPixels: 50`），不用比例。**
一開始用的是 `maxDiffPixelRatio: 0.01`，實測發現形同虛設 ——
1280×800 的 1% 是一萬多個像素，而「圓角被改掉」只影響幾百個像素，
會被直接放過。基準與比對都在同一平台、同一版瀏覽器上跑，
反鋸齒雜訊趨近於零，門檻可以壓得很低。

**字體用 `@fontsource/noto-sans-tc`，不走 Google Fonts CDN。**
走 CDN 的話，網路快慢會決定截圖時字體有沒有載完，產生假差異。
順帶好處是發布出去的 Storybook 不再依賴外部服務。

---

## 哪些 story 不比對

`tests/visual.spec.ts` 的 `SKIP` 清單裡的 story 會被跳過。
目前只有一個：

| story | 原因 |
| --- | --- |
| `components-button--secondary-upload-flow` | 上傳進度用 `setInterval` 自己往前跑，截圖時機不同就會得到不同畫面。它的視覺已由 `components-button--secondary` 的靜態狀態涵蓋。 |

CSS 動畫（例如 Overlay/Success 的圖示揭露）不需要跳過 ——
Playwright 的 `animations: 'disabled'` 會把動畫直接推到結束狀態再截圖。
