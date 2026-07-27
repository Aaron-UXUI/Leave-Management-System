# Figma 待處理事項

同步過程中發現的設計檔問題，以及程式端因此做出的暫定處理。
**這些應該在 Figma 修正，然後重新同步**，不要只改程式碼 —— 那會讓兩邊繼續分岔。

---

## A. 需要在 Figma 修正

### A1. 兩套間距命名並存，且定義衝突

Figma 中同時存在：

| 群組一 | 值 | 群組二 | 值 |
| --- | --- | --- | --- |
| `Spacing/s` | 8 | `Spacing/s(8)` | 8 |
| `Spacing/m` | **12** | `Spacing/sm(12)` | 12 |
| `Spacing/l` | 16 | `Spacing/m(16)` | **16** |

`m` 在兩套裡分別是 12 和 16。Search Bar（`2484:4001`）用的是舊那套，
其餘元件用新那套。程式端一律映射到新命名（`--lds-spacing-s/m/l`），
但 Figma 應該把舊群組刪掉。

### A2. `Type Scale/body/L` 與 `body/L` 衝突

`Type Scale/body/L` = 14，`body/L` = 20。舊的 `Type Scale` 群組應移除。

### A3. 變數群組名拼字錯誤

`coner radius` 應為 `corner radius`。程式端已正規化為 `--lds-radius-*`。

### A4. Dropdown 的錯誤狀態命名為 `State5`

`2074:11240` 的 variant 值是 `State5`，沒有語意。建議改名為 `Error`。
程式端已用 `state="error"`。

### A5. 色階有缺口

以下色階未被任何元件引用，因此無法從 MCP 取得。
若 Figma 中確實有定義，請補進 `tokens.json`：

- `Primary/500`、`Primary/600`
- `Grey Scale/500`、`600`、`800`、`Black`
- `Spacing/2xl`（依 24 → 48 的級距推測應為 32，但未確認，故未寫入）
- `coner radius/m`

### A6. Primary Button 的 Disable 狀態對比度不足

`1433:32130`：底色 `Grey Scale/100 #dcdcdc`、文字 `Grey Scale/White #fafafa`，
對比度約 **1.35:1**。研究頁明訂系統須達 WCAG AA（一般文字需 4.5:1），
且使用者年齡跨 20–60 歲以上。

程式端目前**照設計稿實作**，未擅自更動。建議在 Figma 把停用態文字改為
`Grey Scale/700`（對 `#dcdcdc` 約 7.4:1）或更深的灰。

### A7. Secondary Button 上傳中，掃描條會蓋住文字

`1433:31961` / `1433:31969` 的 `Filler` 圖層位於文字之上。
在 Figma 的靜態畫格中 `Uploading motion` = 0，所以看不出問題；
一旦進度大於 0，「正在上傳中...」就會被主色蓋掉。

程式端維持設計稿的圖層順序。若本意是進度條而非轉場遮罩，
需要在 Figma 把 `Filler` 移到文字下層。

### A8. Search Bar 的放大鏡與其他圖示風格不一致

其餘圖示都是 Lucide 描邊風格（stroke 1.1），
但 `2484:3995` 的放大鏡是**填色**圖示，且來自另一個元件庫。
建議換成 Lucide 的 `search` 以維持一致。

### A9. Radio 列使用了非 token 的圓角

`1125:8706` 的圓角是 `5px`，不是任何一個 corner radius token。
程式端正規化為 `radius/xs`（4px）。該圓角沒有可見背景，
僅影響鍵盤聚焦框的形狀。

---

## B. Figma 未定義，程式端補上的狀態

這些狀態在設計稿中不存在，但產品要能用就必須有。
程式碼中都以 `⚠ Figma 未定義` 註記，**等設計確認後再回填 Figma**。

| 元件 | 補上的狀態 | 採用的值 |
| --- | --- | --- |
| 全部可聚焦元件 | `:focus-visible` | 3px `Primary/700` 外框、offset 2px |
| Tertiary Button | hover / disabled | `Primary/900` + 底線 ／ `Grey Scale/300` |
| Icon Button | hover / disabled | 沿用 Secondary 的 hover 語彙（`Primary/100` 底 + `Primary/800` 邊框） |
| Text Field | focus / disabled | `Primary/800` 邊框 ／ `Grey Scale/100` 底、`Grey Scale/400` 文字 |
| Radio / Checkbox | disabled | `Grey Scale/300` 邊框與圓點 |
| Nav Bar | hover | 文字轉 `Primary/800` |

聚焦樣式之所以直接補上而非留空，是因為研究頁明確要求 WCAG AA；
沒有可見的鍵盤聚焦指示會直接違反 2.4.7。

---

## C. 尚未移植的 Figma 元件

以下元件存在於 Figma，但這一輪還沒做成程式碼。
節點 ID 都在，之後可以直接接著做：

| Figma 元件 | 節點 | 備註 |
| --- | --- | --- |
| Date Picker | `1433:24853` | 3 個 variant（Overlay / Overlay+Error / Mobile Screen） |
| TimePicker | `1286:17966` | 3 個 variant |
| Dropdown / Date Selection | `1141:23860` | 4 個 state，日期選擇器內部使用 |
| Button / Date | `1125:22146` | 日曆格子按鈕，Pressed / Default |
| Button / Pre&Next | `1125:22353` | 月份切換，Previous / Next |
| Button / Hour&Minute | `1190:30037` | 時間選擇，Default / Pressed |
| Pagination | `1286:6127` | 表格分頁 |
| Overlay | `1270:8106` | 遮罩底層 |
| Overlay / Success | `1433:27259` | 送出成功畫面 |
| Bottom Bar | `2469:8462` | 行動版底部操作列 |
| Status bar / Home Indicator / Keyboard | `1607:7869`、`1607:8181`、`2297:9899` | iOS 系統元件，通常不需要自己實作 |
| Motion | `1433:27237` | 原型用的動態畫板，非 UI 元件 |

日期與時間選擇器是這批裡最大的一塊，且彼此相依
（Date Picker 會用到 Button/Date 與 Button/Pre&Next），建議一起做。
