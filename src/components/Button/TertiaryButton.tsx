import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import './Button.css';

export interface TertiaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** 文字後方的 16px 圖示。Figma 預設為 icon 16 / upload。 */
  icon?: IconName;
  /** 僅供 Storybook 展示用：強制呈現 hover 外觀。 */
  previewState?: 'default' | 'hovered';
}

/**
 * 次要文字按鈕 —— Figma「Tertiary Button」（node 1286:5917）
 *
 * 無底色、無邊框，左右內距為 0，用在表單內的輔助操作（例如「上傳證明文件」）。
 */
export function TertiaryButton({
  children,
  icon = 'upload-16',
  previewState,
  className = '',
  type = 'button',
  ...rest
}: TertiaryButtonProps) {
  return (
    <button
      type={type}
      className={`lds-btn lds-btn--tertiary${className ? ` ${className}` : ''}`}
      data-preview-state={previewState === 'hovered' ? 'hovered' : undefined}
      {...rest}
    >
      <span className="lds-btn__label">{children}</span>
      {icon && <Icon name={icon} />}
    </button>
  );
}
