# 請假系統設計系統

「本土語文直播共學」請假系統的設計系統，React + TypeScript 實作。

📖 **[線上 Storybook](https://aaron-uxui.github.io/Leave-Management-System/)** —— 所有 token 與元件都在這裡，不需要在本地安裝任何東西。

**唯一真實來源是 Figma**：[【設計】請假系統＿本土語文直播共學](https://www.figma.com/design/uTkRlCM3V9ZlH6GFowHy33/)

這個 repo 裡的每一個顏色、間距、字級、圓角、陰影，都來自 Figma Variables，
沒有任何一個是在程式碼裡自己決定的。這件事由 `npm run tokens:check` 強制把關。

---

## 開始使用

只是想看元件的話，直接開[線上 Storybook](https://aaron-uxui.github.io/Leave-Management-System/) 即可。
每次 `main` 有更新就會自動重新發布，發布前會先跑 token 稽核與型別檢查，兩者沒過就不會上線。

要在本地開發：

```bash
npm install
npm run storybook
```

Storybook 會開在 <http://localhost:6006>。

## 指令

| 指令 | 用途 |
| --- | --- |
| `npm run storybook` | 開發用的元件瀏覽器 |
| `npm run build` | 打包成可發布的套件 |
| `npm run typecheck` | TypeScript 型別檢查 |
| `npm run lint` | 程式碼檢查 |
| `npm run tokens:build` | 由 `tokens.json` 產生 `tokens.css` 與 `tokens.ts` |
| `npm run tokens:check` | 稽核：確認沒有寫死的視覺數值、沒有拼錯的 token |
| `npm test` | 單元測試（日曆與時間的計算邏輯） |
| `npm run vrt` | 視覺回歸比對（需先 `build-storybook`），見 [visual-testing.md](./docs/visual-testing.md) |
| `npm run a11y` | 無障礙檢查（需先 `build-storybook`），以 axe 檢查 WCAG 2.1 AA |

---

## 在專案中使用

```tsx
import { PrimaryButton, TextField, Label, Icon } from 'leave-management-design-system';
import 'leave-management-design-system/styles.css';

function LeaveForm() {
  return (
    <form>
      <TextField label="事由" supportingText="請勿超過 30 個字" maxLength={30} />
      <Label type="pending" />
      <PrimaryButton icon="upload">提交請假單</PrimaryButton>
    </form>
  );
}
```

只想要 token、不需要 React 元件的話：

```css
@import 'leave-management-design-system/tokens.css';

.my-card {
  padding: var(--lds-spacing-l);
  border-radius: var(--lds-radius-s);
  background: var(--lds-color-grey-white);
  box-shadow: var(--lds-elevation-low);
  font: var(--lds-typography-body-m);
}
```

---

## 目錄結構

```
src/
├── tokens/
│   ├── tokens.json          ← Figma Variables 的鏡像。唯一可手改的 token 檔
│   ├── tokens.css           ← 產生物：CSS 變數
│   └── tokens.ts            ← 產生物：JS 參照
├── icons/
│   ├── svg/                 ← 產生物：由 Figma 向量合成的 SVG
│   ├── icons.generated.ts   ← 產生物：圖示登錄表
│   └── Icon.tsx
├── styles/global.css        ← 文字樣式工具類別、無障礙輔助
└── components/              ← 元件，只能引用 token
scripts/
├── build-tokens.mjs         ← tokens.json → css / ts
├── build-icons.mjs          ← Figma 資產 → 合成 SVG（需連網）
├── build-icon-components.mjs← SVG → 登錄表（離線）
└── check-tokens.mjs         ← 稽核
docs/
├── figma-sync.md            ← Figma 改動後怎麼同步
├── component-map.md         ← Figma 節點 ↔ 程式碼對照
└── figma-gaps.md            ← 設計檔待處理事項、未移植清單
```

---

## 元件

| 分類 | 元件 |
| --- | --- |
| Button | `PrimaryButton`、`SecondaryButton`、`TertiaryButton`、`IconButton` |
| Form | `TextField`、`Dropdown`、`DateSelectionDropdown`、`Radio`、`RadioGroup`、`Checkbox`、`SearchBar` |
| DateTime | `DatePicker`、`TimePicker`、`DateButton`、`PrevNextButton`、`HourMinuteButton` |
| Feedback | `Alert`、`Label`、`Tooltip`、`SuccessOverlay` |
| Navigation | `AppBar`、`NavBar`、`Pagination`、`BottomBar` |
| Foundation | `Icon`（11 個圖示）、`token` |

元件頁上的元件已全數移植，只剩 iOS 系統元件（Status bar、Home Indicator、
Keyboard）與原型用的 Motion 畫板未做，原因見
[figma-gaps.md](./docs/figma-gaps.md#c-尚未移植的-figma-元件)。

---

## 設計原則

**字級下限 16px。** 使用者是學校教職人員，年齡跨 20 到 60 歲以上，
研究階段就定下 16px 以上與 WCAG AA 的要求。`body/M` 是 16px，
所有元件的預設文字都不小於這個值。

**不寫死任何視覺數值。** 元件 CSS 裡出現色碼、`font-size`、`border-radius`、
`box-shadow` 的字面值，稽核就會失敗。這是 Figma 作為唯一真實來源在工程上
唯一有強制力的環節，建議接到 CI。

**文案也是設計系統的一部分。** Secondary Button 的「正在上傳中...」「上傳成功！」、
Alert 的「請選擇假別」、假別清單等，都寫在元件的預設值裡，
避免各處自己編一套說法。

---

## 貢獻方式

改動一律**從 Figma 開始**。步驟見 [figma-sync.md](./docs/figma-sync.md)。

送 PR 前請確認：

```bash
npm run tokens:check && npm run typecheck
```
