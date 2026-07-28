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

## 色彩的兩層結構

Figma 的色彩變數分成兩層（2026-07-28 起）：

```
Primitive/…              ← 原始色票，只有色彩本身的名字
      ↑ 被引用
Semantic/Primary/800     ← 元件實際引用的這一層
Semantic/Grey Scale/0
Semantic/Semantic Color/Destruct-text
```

**程式端鏡像的是 Semantic 層**，因為那是元件實際綁定的層級。
`--lds-color-primary-800` 對應 `Semantic/Primary/800`。

Primitive 層沒有進到程式碼，原因有二：

1. **技術上取不到。** `get_variable_defs` 只會回傳「被元件實際引用」的變數。
   元件綁的是 Semantic，所以 Primitive 的名稱與值不會出現在同步結果裡。
2. **也沒有必要。** 程式端引用 Primitive 等於繞過 Semantic 層，
   那正是這個分層要防止的事。

若日後需要在程式端也暴露 Primitive（例如要做主題切換），
得由設計端提供該層的完整清單，不能靠同步工具自動抓。

⚠ 目前 Semantic 層的命名仍是階數制（`Semantic/Primary/800`），
不是角色制（例如 `text-primary`、`surface-default`）。
這代表分層目前帶來的主要好處是「換色票不用改元件」，
還沒有到「看名字就知道用途」。若之後要往角色制走，程式端的
CSS 變數名要一起改，屬於破壞性變更。

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

## Code Connect：評估過，決定不採用

Code Connect 可以讓設計師在 Figma 裡選中一個元件時，右側面板直接顯示對應的
程式碼用法（例如選中「Primary Button / State=Disable」就顯示
`<PrimaryButton disabled>提交請假單</PrimaryButton>`）。

實測後確認它需要 **Organization 或 Enterprise 方案**加上 Dev/Full 座位：

> You need a Dev or Full seat on an Organization or Enterprise plan to use Code Connect.

本專案的 Figma 是 Professional 方案。**2026-07-28 決定不為此升級方案，
這件事就此結案**，不是待辦事項。

### 那對照關係靠什麼維持

[component-map.md](./component-map.md)。它記錄了每個 Figma 節點對應哪支程式碼、
以及 variant 怎麼對應到 props，涵蓋範圍與 Code Connect 相同。

差別只在使用方式：Code Connect 是在 Figma 介面裡直接看到，
對照表則需要人工查。對目前的團隊規模（設計與工程各一到數人）來說，
查表的成本遠低於升級方案的成本。

**因此 component-map.md 必須跟著元件一起維護** —— 它現在是這份對照關係的
唯一載體，過期了就沒有第二個地方可以對。

---

## Figma 端待處理事項

同步過程中發現設計檔本身有幾處命名衝突與未定義狀態，
整理在 [figma-gaps.md](./figma-gaps.md)。這些需要在 Figma 修，不是在程式碼修。
