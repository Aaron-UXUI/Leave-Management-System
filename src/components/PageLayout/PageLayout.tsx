import type { ReactNode } from 'react';
import './PageLayout.css';

export interface PageLayoutProps {
  /**
   * 版型。
   * desktop：內容欄最大寬 1280、左右留白 64，超過時置中。
   * mobile：隨裝置寬度伸縮，內容左右留白 24。
   */
  device?: 'desktop' | 'mobile';
  /** 頂部應用列，通常是 `<AppBar>`。 */
  appBar?: ReactNode;
  /** 主導覽列，通常是 `<NavBar>`。 */
  navBar?: ReactNode;
  /** 底部固定操作列，通常是 `<BottomBar>`。僅行動版使用。 */
  bottomBar?: ReactNode;
  /** 頂部列是否隨捲動固定。預設固定。 */
  stickyBars?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * 頁面骨架。
 *
 * 把 Figma 各個畫面共用的版面決策收在一處：內容欄寬度、左右留白、
 * 頂部列與底部列的堆疊順序。沒有這一層的話，每個畫面都會各自刻一次，
 * 留白遲早會走鐘 —— 而且 token 稽核抓不到，因為那些畫面「有用 token，
 * 只是用錯了」。
 *
 * 版面依據：
 * - 桌機：App Bar / Desktop（node 1201:31471）與 nav_bar / teacher
 *   （node 1190:30940）都是寬 1280、左右留白 64（Spacing/4xl）。
 * - 行動版：畫面 375×812，TopBar 140 = 狀態列 44 + App Bar 48 + Nav Bar 48，
 *   Content 內距 24（Spacing/xl）。例：School Leave Record / Mobile
 *   （node 1661:8841）。
 *
 * Figma 中 375 與 812 是設計參考視窗，不是版面上限，因此行動版隨裝置伸縮。
 * iOS 狀態列（node 1607:7869）由作業系統繪製，這裡改以
 * `env(safe-area-inset-*)` 保留安全區，不自己畫一條。
 */
export function PageLayout({
  device = 'desktop',
  appBar,
  navBar,
  bottomBar,
  stickyBars = true,
  children,
  className = '',
}: PageLayoutProps) {
  return (
    <div
      className={`lds-page lds-page--${device}${className ? ` ${className}` : ''}`}
      data-sticky={stickyBars || undefined}
    >
      {(appBar || navBar) && (
        <div className="lds-page__bars">
          {appBar}
          {navBar}
        </div>
      )}

      <main className="lds-page__content">
        <div className="lds-page__container">{children}</div>
      </main>

      {bottomBar && <div className="lds-page__bottom">{bottomBar}</div>}
    </div>
  );
}
