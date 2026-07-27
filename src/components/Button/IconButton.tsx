import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../../icons';
import './Button.css';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 要顯示的圖示。Figma 預設為 icon 16/ sort。 */
  icon: IconName;
  /**
   * 無障礙名稱。圖示按鈕沒有可見文字，因此為必填。
   */
  label: string;
  /** 僅供 Storybook 展示用：強制呈現 hover 外觀。 */
  previewState?: 'default' | 'hovered';
}

/**
 * 圖示按鈕 —— Figma「Icon Button」（node 2525:8786）
 *
 * 48×48（16px 圖示 + 16px 內距），白底、Grey Scale/200 邊框、Elevation/Low。
 * 用於表格上方的排序與篩選。
 */
export function IconButton({
  icon,
  label,
  previewState,
  className = '',
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={`lds-btn lds-btn--icon${className ? ` ${className}` : ''}`}
      aria-label={label}
      data-preview-state={previewState === 'hovered' ? 'hovered' : undefined}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  );
}
