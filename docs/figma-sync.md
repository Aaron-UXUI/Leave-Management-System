# Figma 同步流程

這份設計系統的**唯一真實來源是 Figma**，不是這個 repo。
程式碼永遠是 Figma 的下游產物；任何視覺上的改動，都必須先改 Figma。

- 檔案：[【設計】請假系統＿本土語文直播共學](https://www.figma.com/design/uTkRlCM3V9ZlH6GFowHy33/)
- `fileKey`：`uTkRlCM3V9ZlH6GFowHy33`
- 元件頁：`1795:12587`（🔶 Component）

---

## 資料流

```
Figma Variables ──┐
                  ├─→ src/tokens/tokens.json ──→ tokens.css（CSS 變數）
Figma 元件 ────────┘        （唯一可手改的鏡像）  └→ tokens.ts （JS 參照）
                                    │
Figma 向量資產 ──→ src/icons/svg/*.svg ──→ icons.generated.ts ──→ <Icon>
                                    │
                                    └─→ src/components/**（只能引用 token，不得寫死數值）
```

**只有 `tokens.json` 可以手改**，而且改動必須先在 Figma 發生。
`tokens.css`、`tokens.ts`、`icons.generated.ts`、`src/icons/svg/*` 都是產生物，
檔頭都標了「請勿手動編輯」。

---

## 情境一：Figma 改了顏色、間距、字級等變數

1. 在 Figma 用 MCP 取出該節點的變數：

   ```
   get_variable_defs(fileKey: "uTkRlCM3V9ZlH6GFowHy33", nodeId: "<改動的節點>")
   ```

   注意：`get_variable_defs` 只會回傳**該節點實際用到**的變數。
   要拿到完整清單，需要對數個代表性節點分別呼叫再合併
   （目前的做法是取四個 section：`1125:8260`、`1804:13177`、`1804:13178`、`1804:13180`）。

2. 更新 `src/tokens/tokens.json`。每個 token 都帶 `$extensions.figma`，
   記錄它對應的 Figma 變數名，改的時候照著對就好。

3. 重新產生衍生檔並稽核：

   ```bash
   npm run tokens:build && npm run tokens:check
   ```

4. 開 Storybook 的 `Foundations/Tokens` 目視確認。

---

## 情境二：Figma 改了元件外觀

1. 取出該元件的 design context：

   ```
   get_design_context(fileKey: "uTkRlCM3V9ZlH6GFowHy33", nodeId: "<元件節點>")
   ```

   節點對照請見 [component-map.md](./component-map.md)。

2. 回傳的是 React + Tailwind 的**參考碼**，不是可直接貼上的成品。
   要做的是把它翻譯成本專案的寫法：

   | 回傳內容 | 本專案對應寫法 |
   | --- | --- |
   | `var(--primary\/800,#355a85)` | `var(--lds-color-primary-800)` |
   | `var(--coner-radius\/s,8px)` | `var(--lds-radius-s)` |
   | `var(--spacing\/l,16px)` | `var(--lds-spacing-l)` |
   | `text-[length:var(--font-size\/h4)]` + `leading-[var(--line-height\/h4)]` | `font: var(--lds-typography-headline-4)` |
   | `drop-shadow-[0px_4px_8px_…]` | `box-shadow: var(--lds-elevation-medium)` |

   ⚠ **陰影要換算**：Figma 的效果 radius 轉成 CSS `drop-shadow()` 時會除以 2，
   換成 `box-shadow` 則相等。例如 Elevation/Medium 在 `drop-shadow` 裡是
   `0px 4px 8px`，在 `box-shadow` 裡是 `0 4px 16px`。本專案一律用 `box-shadow`。

3. Figma 的 variant 屬性請對應成 props，命名沿用設計稿的說法
   （例如 Secondary Button 的 `State=Uploading_1` → `state="uploading"`）。

4. 跑稽核與型別檢查：

   ```bash
   npm run tokens:check && npm run typecheck
   ```

---

## 情境三：Figma 新增或修改圖示

Figma 匯出圖示時，會把每一筆 stroke 各自輸出成獨立 SVG，
且各自使用自己的區域座標系，必須平移回圖示座標系才能合成。
`scripts/build-icons.mjs` 就是在做這件事。

1. 對圖示節點呼叫 `get_design_context`，記下每個 `imgVector` 的 URL
   與該圖層的 `inset` 百分比。

2. 把百分比換算成圖示座標系中的 bbox 原點，再減去 `0.55`
   （Figma 為容納 1.1 描邊而外擴的半個描邊寬），得到 `tx` / `ty`。

   例：`inset-[62.5%_20.83%_12.5%_20.83%]` 在 24×24 圖示中
   → 左 `0.2083 × 24 = 5`、上 `0.625 × 24 = 15`
   → `tx = 5 − 0.55 = 4.45`、`ty = 15 − 0.55 = 14.45`

3. 更新 `scripts/build-icons.mjs` 的 `ICONS` 清單，然後：

   ```bash
   node scripts/build-icons.mjs        # 需連網，會下載 Figma 資產
   node scripts/build-icon-components.mjs   # 離線即可
   ```

⚠ **Figma 資產 URL 只有 7 天效期**。產出的 SVG 會 commit 進 repo，
平常不需要重跑；只有圖示改版時才需要重新取得 URL。

---

## 防線：token 稽核

`npm run tokens:check` 會掃過 `src/components` 與 `src/styles` 下所有 CSS，
在兩種情況失敗：

1. **出現寫死的視覺數值** —— 色碼、`font-size`、`border-radius`、`box-shadow`
   只要沒有走 `var(--lds-*)` 就會被擋下。
2. **引用了不存在的 token** —— 抓變數名拼錯。這種錯在瀏覽器裡是靜默失效的，
   靠肉眼很難發現。

建議接到 CI 或 pre-commit，這是「Figma 是唯一真實來源」在工程上唯一有強制力的環節。

---

## Code Connect：目前受方案限制，做不了

Code Connect 可以讓設計師在 Figma 裡選中一個元件時，右側面板直接顯示對應的
程式碼用法（例如選中「Primary Button / State=Disable」就顯示
`<PrimaryButton disabled>提交請假單</PrimaryButton>`），把 Figma ↔ 程式碼的
回路接成雙向。

**但目前無法啟用。** 實測結果：

> You need a Dev or Full seat on an Organization or Enterprise plan to use Code Connect.

本專案的 Figma 帳號是 **Professional** 方案，Code Connect 需要
**Organization 或 Enterprise** 方案。這是方案層級的限制，沒有繞道方式。

若日後升級了方案，要做的事：

1. 元件必須先發布到團隊 library（目前元件頁尚未發布為 library）。
2. `npm i -D @figma/code-connect`，並在 `tsconfig.json` 的 `types` 加入
   `@figma/code-connect/figma-types`。
3. 為每個元件建立 `ComponentName.figma.ts` 模板（注意是 `.ts` 不是 `.tsx`，
   且用 `figma.code` 標籤模板，不是 `figma.connect()`）。
4. [component-map.md](./component-map.md) 已經有完整的 Figma node ↔ 程式碼對照，
   可以直接拿來當作建立模板的依據，不用重新盤點。

在那之前，[component-map.md](./component-map.md) 就是這份對照關係的載體 ——
只是需要人工查表，不會出現在 Figma 介面裡。

---

## Figma 端待處理事項

同步過程中發現設計檔本身有幾處命名衝突與未定義狀態，
整理在 [figma-gaps.md](./figma-gaps.md)。這些需要在 Figma 修，不是在程式碼修。
