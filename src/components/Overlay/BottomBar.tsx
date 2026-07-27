import type { ReactNode } from 'react';
import './Overlay.css';

export interface BottomBarProps {
  /** 列中的動作，設計稿放的是一顆撐滿寬度的 Primary Button。 */
  children: ReactNode;
  className?: string;
}

/**
 * 行動版底部操作列 —— Figma「Bottom Bar」（node 2469:8462）
 *
 * 375 寬、白底，左右內距 24、上下 8，內容置中並撐滿寬度。
 * 用來固定住「提交請假單」這類主要動作。
 */
export function BottomBar({ children, className = '' }: BottomBarProps) {
  return <div className={`lds-bottombar${className ? ` ${className}` : ''}`}>{children}</div>;
}
