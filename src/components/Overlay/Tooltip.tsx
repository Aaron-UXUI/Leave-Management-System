import type { HTMLAttributes, ReactNode } from 'react';
import './Overlay.css';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * 說明浮層 —— Figma「Overlay」（node 1270:8106）
 *
 * 白底、圓角 8、Elevation/Medium 的說明框，內容為條列文字。
 * 用在請假表單旁解釋預錄課程的時間規則。
 *
 * 註：Figma 中命名為「Overlay」，但它其實是 tooltip 而非遮罩層，
 * 與「Overlay / Success」不是同一類東西。建議在 Figma 改名，
 * 見 docs/figma-gaps.md。
 */
export function Tooltip({ children, className = '', ...rest }: TooltipProps) {
  return (
    <div role="tooltip" className={`lds-tooltip${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </div>
  );
}

/** 浮層內用來強調的文字，例如可預錄的時段。 */
export function TooltipEmphasis({ children }: { children: ReactNode }) {
  return <strong className="lds-tooltip__em">{children}</strong>;
}
