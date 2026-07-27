import { useId, type ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../../icons';
import { Alert } from '../Alert';
import './Dropdown.css';

/**
 * 對應 Figma Dropdown 的 State 屬性。
 * 注意：Figma 中的錯誤狀態命名為「State5」，尚未正名，此處以 error 表示。
 */
export type DropdownState = 'default' | 'selecting' | 'selected' | 'disabled' | 'error';

export interface DropdownProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'type'> {
  /** 目前狀態。 */
  state?: DropdownState;
  /** 已選取的值，僅在 state="selected" 時顯示。 */
  value?: string;
  /** 未選取時的提示文字。設計稿為「請選擇日期、時間」。 */
  placeholder?: string;
  /** selecting 狀態下顯示的格式提示。設計稿為「YYYY/MM/DD 00:00」。 */
  selectingHint?: string;
  /** 錯誤訊息。設計稿文案為「尚未選擇日期、時間」。 */
  error?: string;
  /** 右側圖示，預設為 icon 24 / calendar。 */
  icon?: IconName;
  /** 無障礙名稱。 */
  label: string;
}

/**
 * 日期時間選擇觸發器 —— Figma「Dropdown」（node 1190:29779）
 *
 * 五個狀態的差異只在邊框與文字顏色：
 * Default（Grey/300 邊框、Grey/400 文字）、Date Selecting（Grey/900 文字）、
 * Selected（Grey/900 文字 + 值）、Disable（Grey/200）、
 * Error（2px Destruct-icon 邊框 + 下方 Alert）。
 */
export function Dropdown({
  state = 'default',
  value,
  placeholder = '請選擇日期、時間',
  selectingHint = 'YYYY/MM/DD 00:00',
  error = '尚未選擇日期、時間',
  icon = 'calendar',
  label,
  className = '',
  disabled,
  ...rest
}: DropdownProps) {
  const errorId = useId();
  const isError = state === 'error';

  const text =
    state === 'selected' ? (value ?? placeholder) : state === 'selecting' ? selectingHint : placeholder;

  return (
    <div className={`lds-dropdown${className ? ` ${className}` : ''}`}>
      <button
        type="button"
        className="lds-dropdown__trigger"
        data-state={state}
        disabled={disabled ?? state === 'disabled'}
        aria-label={label}
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
