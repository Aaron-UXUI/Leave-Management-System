import type { ReactNode } from 'react';
import './Navigation.css';

export interface NavBarItem {
  /** 分頁文字。 */
  label: ReactNode;
  /** 連結網址。省略時輸出為 button。 */
  href?: string;
  onClick?: () => void;
}

export interface NavBarProps {
  /** 分頁項目。 */
  items: NavBarItem[];
  /** 目前選取的索引。 */
  activeIndex: number;
  /** 版型。desktop 為 1280 寬、64 高分頁；mobile 為 375 寬、48 高等寬分頁。 */
  device?: 'desktop' | 'mobile';
  /** 無障礙名稱。 */
  label?: string;
  className?: string;
}

/**
 * 主導覽列 —— Figma「nav_bar / teacher」（node 1190:30940）、
 * 「nav_bar / school」（node 1286:16990）與其行動版
 * （node 1392:23584、1661:9028）
 *
 * 選取中的分頁為 Headline（Medium、Primary/800），未選取為 body（Regular、Grey/700），
 * 底部有 2px 的 Primary/800 指示條。
 */
export function NavBar({
  items,
  activeIndex,
  device = 'desktop',
  label = '主導覽',
  className = '',
}: NavBarProps) {
  return (
    <nav
      aria-label={label}
      className={`lds-navbar lds-navbar--${device}${className ? ` ${className}` : ''}`}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const content = (
          <>
            <span className="lds-navbar__text">{item.label}</span>
            {isActive && <span className="lds-navbar__indicator" aria-hidden="true" />}
          </>
        );

        return item.href ? (
          <a
            key={index}
            href={item.href}
            className="lds-navbar__tab"
            aria-current={isActive ? 'page' : undefined}
            onClick={item.onClick}
          >
            {content}
          </a>
        ) : (
          <button
            key={index}
            type="button"
            className="lds-navbar__tab"
            aria-current={isActive ? 'page' : undefined}
            onClick={item.onClick}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}

/** 教師端分頁，與 Figma nav_bar / teacher 一致。 */
export const TEACHER_NAV_ITEMS = ['請假申請', '請假紀錄', '請假規範', '學校請假'] as const;

/** 學校端分頁，與 Figma nav_bar / school 一致。 */
export const SCHOOL_NAV_ITEMS = ['請假申請', '請假紀錄', '教師請假'] as const;
