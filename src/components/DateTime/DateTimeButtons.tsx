import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../../icons';
import './DateTime.css';

/* ------------------------------ Button / Date ----------------------------- */

export interface DateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 日期數字，或星期標頭的單字（設計稿以 "S" 為例）。 */
  children: ReactNode;
  /**
   * 是否為選取中的日期。對應 Figma 的 State=Pressed，
   * 設計稿註記為「Selected date」。
   */
  selected?: boolean;
  /**
   * 是否為相鄰月份的日期。設計稿的做法是整格套 33% 不透明度，
   * 而非換一個顏色 token。
   */
  outside?: boolean;
}

/**
 * 日曆格子按鈕 —— Figma「Button / Date」（node 1125:22146）
 *
 * 48×48 點擊區。選取時中央疊上 40×40 的 Primary/800 實心圓、文字轉白。
 */
export function DateButton({
  children,
  selected = false,
  outside = false,
  className = '',
  type = 'button',
  ...rest
}: DateButtonProps) {
  return (
    <button
      type={type}
      className={`lds-datebtn${className ? ` ${className}` : ''}`}
      data-selected={selected || undefined}
      data-outside={outside || undefined}
      aria-pressed={selected}
      {...rest}
    >
      <span className="lds-datebtn__text">{children}</span>
    </button>
  );
}

/* --------------------------- Button / Pre&Next ---------------------------- */

export interface PrevNextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 方向。對應 Figma 的 Type=Previous / Next。 */
  direction: 'previous' | 'next';
  /** 無障礙名稱。未指定時依方向給預設值。 */
  label?: string;
}

/**
 * 上一頁／下一頁按鈕 —— Figma「Button / Pre&Next」（node 1125:22353）
 *
 * 內距 12、24px chevron。設計稿以朝下的 chevron 旋轉取得左右方向。
 */
export function PrevNextButton({
  direction,
  label,
  className = '',
  type = 'button',
  ...rest
}: PrevNextButtonProps) {
  return (
    <button
      type={type}
      className={`lds-prevnext${className ? ` ${className}` : ''}`}
      aria-label={label ?? (direction === 'previous' ? '上一頁' : '下一頁')}
      {...rest}
    >
      <Icon name="chevron-down" rotate={direction === 'previous' ? 90 : 270} />
    </button>
  );
}

/* ------------------------ Button / Hour&Minute ---------------------------- */

export interface HourMinuteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 時或分的數字，設計稿以兩位數呈現（例如 "00"）。 */
  children: ReactNode;
  /** 是否為選取中。對應 Figma 的 State=Pressed。 */
  selected?: boolean;
}

/**
 * 時間格按鈕 —— Figma「Button / Hour&Minute」（node 1190:30037）
 *
 * 60×48，數字使用 SF Mono 等寬字，讓時間欄位在捲動時不會左右跳動。
 * 選取時底色為 Primary/200、文字轉 Grey Scale/900。
 */
export function HourMinuteButton({
  children,
  selected = false,
  className = '',
  type = 'button',
  ...rest
}: HourMinuteButtonProps) {
  return (
    <button
      type={type}
      className={`lds-hmbtn${className ? ` ${className}` : ''}`}
      data-selected={selected || undefined}
      aria-pressed={selected}
      {...rest}
    >
      {children}
    </button>
  );
}
