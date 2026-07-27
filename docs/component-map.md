# Figma ↔ 程式碼對照表

改 Figma 之後要動哪支檔案，看這張表。
所有節點都在元件頁 `1795:12587`（🔶 Component）底下。

---

## 已移植

| Figma 元件 | 節點 | 程式碼 | Figma variant → props |
| --- | --- | --- | --- |
| Primary Button | `1433:32129` | [`PrimaryButton`](../src/components/Button/PrimaryButton.tsx) | `State=Default/Hovered/Disable` → CSS `:hover` ／ `disabled` |
| Secondary Button | `1433:31886` | [`SecondaryButton`](../src/components/Button/SecondaryButton.tsx) | `State=Upload/Uploading_1/Uploading_2/Success/Reupload?/Disabled` → `state`；`Type=Select/Upload` → `variant`；`Uploading motion` → `progress` |
| Tertiary Button | `1286:5917` | [`TertiaryButton`](../src/components/Button/TertiaryButton.tsx) | `showIcon` → `icon` |
| Icon Button | `2525:8786` | [`IconButton`](../src/components/Button/IconButton.tsx) | `instance` → `icon` |
| Label | `2488:3961` | [`Label`](../src/components/Label/Label.tsx) | `Type=Leave/出席/Pending/Pass/Reject` → `type="leave/attend/pending/pass/reject"` |
| Text Field | `1433:25197` | [`TextField`](../src/components/TextField/TextField.tsx) | `Device=Desktop/Mobile` → `device` |
| Dropdown | `1190:29779` | [`Dropdown`](../src/components/Dropdown/Dropdown.tsx) | `State=Default/Date Selecting/Selected/Disable/State5` → `state="default/selecting/selected/disabled/error"` |
| Alert | `2074:11301` | [`Alert`](../src/components/Alert/Alert.tsx) | — |
| CheckBox | `1190:29732` | [`Checkbox`](../src/components/Choice/Checkbox.tsx) | `Checked?=Yes/No` → 原生 `checked` |
| Radio | `1125:8695` | [`Radio`](../src/components/Choice/Radio.tsx) | `State=On/Off` → 原生 `checked` |
| Radio Button / Leave_Selection | `1125:8706` | 同上 | `label` → `children` |
| Radio Button Group | `1125:8733` | [`RadioGroup`](../src/components/Choice/RadioGroup.tsx) | `showAlert` → `error` |
| Search Bar | `2484:4001` | [`SearchBar`](../src/components/SearchBar/SearchBar.tsx) | — |
| App Bar / Desktop | `1201:31471` | [`AppBar`](../src/components/Navigation/AppBar.tsx) | `device="desktop"` |
| App Bar / Mobile | `1392:23656` | 同上 | `device="mobile"`；`showButtonPre` → `onBack` |
| nav_bar / teacher | `1190:30940` | [`NavBar`](../src/components/Navigation/NavBar.tsx) | `TEACHER_NAV_ITEMS` + `device="desktop"` |
| nav_bar / school | `1286:16990` | 同上 | `SCHOOL_NAV_ITEMS` + `device="desktop"` |
| nav_bar / teacher_mobile | `1392:23584` | 同上 | `TEACHER_NAV_ITEMS` + `device="mobile"` |
| nav_bar / school_mobile | `1661:9028` | 同上 | `SCHOOL_NAV_ITEMS` + `device="mobile"` |

Nav Bar 的 `Type=Leave/Record/Regulation/School/Teacher` 在 Figma 是各自的 variant，
程式端改用 `activeIndex` 表示，避免每加一個分頁就要多一個 variant。

---

## 圖示

Figma icon section `1804:12591`，全部由 [`<Icon>`](../src/icons/Icon.tsx) 提供。
設計註記標明來源為 **Lucide**，描邊寬度 1.1。

| `<Icon name>` | Figma 元件 | 節點 |
| --- | --- | --- |
| `user` | icon 24 / user | `1286:16953` |
| `chevron-down` | icon 24 / chevron | `1125:9160` |
| `calendar` | icon 24 / calendar | `1141:24277` |
| `info` | icon 24 / info | `1433:33207` |
| `upload` | icon 24/ upload | `1190:30684` |
| `upload-16` | icon 16 / upload | `1286:5890` |
| `sort-16` | icon 16/ sort | `1975:7312` |
| `filter-16` | icon 16/ filter | `1975:8179` |
| `check-20` | CheckBox 內嵌的勾號 | `1190:29728` |
| `search-20` | Search Bar 內嵌的放大鏡 | `2484:3995` |

最後兩個沒有收錄在 icon section，是內嵌在元件裡的向量，
為了走同一套管線而抽出來。

幾何上的注意事項：

- `chevron-down` 在設計稿中被放大到 16×8（Lucide 原生是 12×6），
  程式端保留放大後的幾何。方向以 `rotate` prop 取得。
- `info` 的內部「i」符號經過客製，與 Lucide 原生不同。
- `calendar` 對應的是 Lucide 的 `calendar-days`（含 6 個日期點）。

---

## 尚未移植

見 [figma-gaps.md 的 C 節](./figma-gaps.md#c-尚未移植的-figma-元件)。
