import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import './Button.css';

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** 文字後方的 24px 圖示。對應 Figma 的 showIcon24 屬性。 */
  icon?: IconName;
  /** 撐滿容器寬度，取代 Figma 的固定 240px。 */
  block?: boolean;
  /**
   * 僅供 Storybook 展示用：強制呈現 hover 外觀。
   * 產品程式碼請勿使用，實際 hover 由 CSS :hover 處理。
   */
  previewState?: 'default' | 'hovered';
}

/**
 * 主要按鈕 —— Figma「Primary Button」（node 1433:32129）
 *
 * 狀態：Default（Primary/800）、Hovered（Primary/700）、Disable（Grey Scale/100）。
 */
export function PrimaryButton({
  children,
  icon,
  block = false,
  previewState,
  className = '',
  type = 'button',
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`lds-btn lds-btn--primary${block ? ' lds-btn--block' : ''}${
        className ? ` ${className}` : ''
      }`}
      data-preview-state={previewState === 'hovered' ? 'hovered' : undefined}
      {...rest}
    >
      <span className="lds-btn__label">{children}</span>
      {icon && <Icon name={icon} />}
    </button>
  );
}
