# Figma 待處理事項

同步過程中發現的設計檔問題，以及程式端因此做出的暫定處理。
**這些應該在 Figma 修正，然後重新同步**，不要只改程式碼 —— 那會讓兩邊繼續分岔。

---

## A. 需要在 Figma 修正

### A1. 兩套間距命名並存，且 `m` 的定義衝突

| 主要那套 | 值 | 括號那套 | 值 |
| --- | --- | --- | --- |
| `Spacing/s` | 8 | `Spacing/s(8)` | 8 |
| `Spacing/m` | **12** | `Spacing/sm(12)` | 12 |
| `Spacing/l` | 16 | `Spacing/m(16)` | **16** |

**`m` 在兩套裡分別是 12 和 16**，這是真的衝突，不只是重複命名。
取錯的話會差 4px，而且不會有任何工具報錯。

目前狀況：Search Bar（`2484:4001`）已改綁主要那套（2026-07-28），
但 **Bar 區塊（`1804:13177`）仍在使用 `Spacing/sm(12)` 與 `Spacing/m(16)`**。

程式端一律映射到主要命名（`--lds-spacing-s/m/l`）。
Figma 端的修法：把 Bar 區塊剩下的引用改綁過去，再刪掉括號命名的那三個變數。

> 更正紀錄：本節一度被改寫成「`Spacing/m(16)` 不存在，是外推的誤判」。
> **那個收回本身才是錯的** —— 當時查的節點剛好都沒引用到它。
> 後來掃描 Bar 區塊時確認 `Spacing/m(16)` 確實存在且值為 16，
> 因此恢復為原本的描述。教訓：`get_variable_defs` 只回傳「被引用」的變數，
> 沒查到不等於不存在。

### A2. `Type Scale/body/L` 與 `body/L` 衝突

`Type Scale/body/L` = 14，`body/L` = 20。舊的 `Type Scale` 群組應移除。

### A3. 變數群組名拼字錯誤

`coner radius` 應為 `corner radius`。程式端已正規化為 `--lds-radius-*`。

### A4. Dropdown 的錯誤狀態命名為 `State5`

`2074:11240` 的 variant 值是 `State5`，沒有語意。建議改名為 `Error`。
程式端已用 `state="error"`。

### ~~A5. 色階有缺口~~（已釐清，不是問題）

原本以為 `Primary/500`、`600` 與 `Grey Scale/500`、`600`、`800`、`Black`
是漏定義。經設計者確認（2026-07-28），**色階沒有缺口** ——
目前這些階就是實際需要的量，刻意不多做。

`Spacing/2xl` 與 `coner radius/m` 同理，沒有被使用就沒有定義的必要。

要新增色階或級距前，請先在 Figma 討論，不要因為「看起來少一階」就補。

### ~~A6. Primary Button 的 Disable 狀態對比度不足~~（判斷錯誤，不是問題）

原本記載為 WCAG 違規，這是**錯的**。

WCAG 2.1 的 1.4.3 Contrast (Minimum) 在 Incidental 例外中明確寫著：
停用中（inactive）的使用者介面元件，其文字**沒有對比度要求**。
Primary Button 的 Disable 態（`1433:32130`，`Grey Scale/White` 白字配
`Grey Scale/100` 底）雖然對比只有約 1.35:1，但完全符合規範。

同樣的豁免也適用於 Secondary Button 的 Disabled 態（`Primary/400` 文字）。

**不需要改。** 設計上刻意讓停用態「看起來就是不能按」是正確的做法，
把它調到 4.5:1 反而會讓使用者以為按鈕可用。

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

### A10. Pagination 使用了非 token 的間距

`1286:6127` 的頁碼之間是 `10px`、頁碼按鈕左右內距是 `11px`，
兩者都不在 spacing 級距上（最接近的是 `s`=8 與 `m`=12）。
程式端照設計稿寫死並加了註解，建議在 Figma 收斂到 token。

### A11. 「Overlay」其實是 tooltip

`1270:8106` 命名為 Overlay，但它是白底、圓角 8、Elevation/Medium 的
說明浮層，內容是預錄課程的時間規則 —— 是 tooltip，不是遮罩層。
和 `1433:27259` 的「Overlay / Success」不是同一類東西，放在同一個命名空間下
容易誤導工程端。程式端命名為 `Tooltip`，建議 Figma 一併改名。

### A12. Dropdown / Date Selection 的 Selecting 少了間距

`1141:23860` 的四個 state 中，Default / Selected / Error 的標題與欄位之間
是 `Spacing/s`（8），只有 `State=Selecting`（`1141:23861`）是 0。
看起來是漏設，程式端四個狀態一律用 8。

### A13. 日曆的相鄰月份日期以 33% 不透明度呈現

`1125:22255` 等格子不是換色 token，而是整個 Button / Date 實例套 33% 不透明度。
在 Primary/100 底上，Grey Scale/700 降到 33% 後對比度約 1.4:1。
這些日期不可點選，屬於裝飾性資訊，因此不算違反 WCAG 的文字對比要求，
程式端也一併設為 `disabled`。但若之後要讓使用者能點相鄰月份的日期，
這個對比度就必須調整。

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
| Button / Date | hover / disabled | `Primary/100` 底 ／ `Grey Scale/300` 文字 |
| Button / Pre&Next | hover / disabled | `Primary/100` 底 ／ `Grey Scale/300` 文字 |
| Button / Hour&Minute | hover / disabled | `Primary/100` 底 ／ `Grey Scale/300` 文字 |
| Button / text（取消、確認） | hover | `Primary/100` 底 |
| Pagination 頁碼 | hover | `Primary/100` 底 |

聚焦樣式之所以直接補上而非留空，是因為研究頁明確要求 WCAG AA；
沒有可見的鍵盤聚焦指示會直接違反 2.4.7。

---

## B2. 設計稿無法表達、由程式端決定的行為

這些不是「Figma 漏畫」，而是靜態設計稿本來就表達不了的動態行為。
列出來是為了讓設計端知道程式做了什麼決定。

| 位置 | 行為 | 說明 |
| --- | --- | --- |
| TimePicker 時／分欄 | 開啟時自動捲到已選的值 | 時有 24 項、分有 60 項，可視高度只有 336（7 格）。不捲動的話使用者看不到目前選的值。 |
| Overlay / Success 的成功圖示 | 縮放淡入 400ms | Figma 的 Motion 元件（`1433:27237`）有 Board 0→2 三個關鍵影格，但沒有標註時長與 easing。程式端採 400ms、`cubic-bezier(0.34, 1.4, 0.64, 1)`，並在 `prefers-reduced-motion` 下停用。實際數值待設計確認。 |
| Secondary Button 上傳掃描條 | 200ms linear | 同樣沒有動態標註，見 A7。 |

另外，`Overlay / Success` 的成功圖示原始資產帶有一個 2px 的細微投影
（`feDropShadow`，25% 黑）。圖示管線只保留路徑，這個投影已略去；
在白底上肉眼幾乎看不出差異。

---

## C. 尚未移植的 Figma 元件

| Figma 元件 | 節點 | 為什麼沒做 |
| --- | --- | --- |
| Status bar | `1607:7869` | iOS 系統元件，由作業系統繪製，不需自行實作 |
| Home Indicator | `1607:8181` | 同上 |
| Keyboard | `2297:9899` | 同上 |
| Motion | `1433:27237` | 原型用的動態畫板，不是 UI 元件；其內容已併入 `SuccessOverlay` 的成功圖示 |

除上述之外，元件頁（`1795:12587`）上的元件都已移植完成。
