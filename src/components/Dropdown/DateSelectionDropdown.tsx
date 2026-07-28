import { useId, type ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../../icons';
import { Alert } from '../Alert';
import './Dropdown.css';

/** 對應 Figma Dropdown / Date Selection 的 State 屬性。 */
export type DateSelectionState = 'default' | 'selecting' | 'selected' | 'error';

export interface DateSelectionDropdownProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'type'> {
  /** 欄位標題。設計稿為「請假日期」。 */
  label?: string;
  /** 必填標記。設計稿在標題前加一個紅色星號。 */
  required?: boolean;
  /** 目前狀態。 */
  state?: DateSelectionState;
  /** 已選取的日期字串，僅在 state="selected" 時顯示。 */
  value?: string;
  /** 未選取時的提示。設計稿為「請選擇日期」。 */
  placeholder?: string;
  /** selecting 狀態的格式提示。設計稿為「YYYY/MM/DD」。 */
  selectingHint?: string;
  /** 錯誤訊息。設計稿為「尚未選擇日期」。 */
  error?: string;
  /** 右側圖示，預設為 icon 24 / calendar。 */
  icon?: IconName;
}

/**
 * 日期選擇欄位 —— Figma「Dropdown / Date Selection」（node 1141:23860）
 *
 * 與 Dropdown 的差別在於：上方帶有欄位標題與必填星號，
 * 且只選日期不選時間，因此文字區較窄（96 而非 144）。
 *
 * State=Default   node 1141:23859
 * State=Selecting node 1141:23861
 * State=Selected  node 1190:29787
 * State=Error     node 2074:10262
 */
export function DateSelectionDropdown({
  label = '請假日期',
  required = true,
  state = 'default',
  value,
  placeholder = '請選擇日期',
  selectingHint = 'YYYY/MM/DD',
  error = '尚未選擇日期',
  icon = 'calendar',
  className = '',
  disabled,
  ...rest
}: DateSelectionDropdownProps) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const isError = state === 'error';

  const text =
    state === 'selected'
      ? (value ?? placeholder)
      : state === 'selecting'
        ? selectingHint
        : placeholder;

  return (
    <div className={`lds-dropdown lds-dropdown--dateonly${className ? ` ${className}` : ''}`}>
      <span className="lds-dropdown__label" id={fieldId}>
        {required && (
          <>
            <span className="lds-dropdown__required" aria-hidden="true">
              *{' '}
            </span>
            {/* 星號對螢幕閱讀器沒有意義，改用文字傳達必填 */}
            <span className="lds-visually-hidden">必填 </span>
          </>
        )}
        {label}
      </span>

      <button
        type="button"
        className="lds-dropdown__trigger"
        data-state={state}
        disabled={disabled}
        aria-labelledby={fieldId}
        // aria-required 不允許用在 button 上；必填改由標題中的隱藏文字傳達
        aria-invalid={isError || undefined}
        aria-describedby={isError ? errorId : undefined}
        {...rest}
      >
        <span className="lds-dropdown__text">{text}</span>
        <Icon name={icon} />
      </button>

      {isError && <Alert id={errorId}>{error}</Alert>}
    </div>
  );
}
