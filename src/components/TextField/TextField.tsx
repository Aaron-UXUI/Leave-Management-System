import { useId, type TextareaHTMLAttributes } from 'react';
import './TextField.css';

export interface TextFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /** 欄位標題。對應 Figma 的 title 屬性，預設文案為「事由」。 */
  label: string;
  /**
   * 版型。desktop 的標題為 body/M、與內容間距 8；
   * mobile 的標題為 body/L、間距 4。
   */
  device?: 'desktop' | 'mobile';
  /** 標題下方的輔助說明，對應 Figma 的 supportingText。 */
  supportingText?: string;
  /** 顯示字數計數（右下角）。需搭配 maxLength 才會顯示上限。 */
  showCounter?: boolean;
  /** 目前字數。受控使用時請一併提供，元件不會自行推算未受控的值。 */
  value?: string;
  /** 隱藏可見標題，但仍保留給螢幕閱讀器。 */
  hideLabel?: boolean;
}

/**
 * 多行文字輸入 —— Figma「Text Field」（node 1433:25197）
 *
 * 高度 64px（兩行），右下角保留原生縮放握把，與設計稿的 Drag 圖層一致。
 * 設計稿僅定義 Default 狀態，聚焦與錯誤樣式見 docs/figma-gaps.md。
 */
export function TextField({
  label,
  device = 'desktop',
  supportingText,
  showCounter = true,
  value,
  maxLength,
  hideLabel = false,
  className = '',
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const describedBy = supportingText ? `${fieldId}-support` : undefined;
  const count = value?.length ?? 0;

  return (
    <div className={`lds-textfield lds-textfield--${device}${className ? ` ${className}` : ''}`}>
      <label
        htmlFor={fieldId}
        className={`lds-textfield__label${hideLabel ? ' lds-visually-hidden' : ''}`}
      >
        {label}
      </label>

      <div className="lds-textfield__content">
        <textarea
          id={fieldId}
          className="lds-textfield__input"
          value={value}
          maxLength={maxLength}
          aria-describedby={describedBy}
          {...rest}
        />

        {(supportingText || showCounter) && (
          <div className="lds-textfield__support">
            <span id={describedBy}>{supportingText}</span>
            {showCounter && maxLength != null && (
              <span className="lds-textfield__counter">
                {count}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
