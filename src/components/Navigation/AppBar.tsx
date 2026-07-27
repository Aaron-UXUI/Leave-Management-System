import { Icon } from '../../icons';
import './Navigation.css';

export interface AppBarProps {
  /** 系統名稱。設計稿為「本土語文直播共學」。 */
  title?: string;
  /** 使用者稱謂。設計稿為「您好 陳老師」。 */
  userName?: string;
  /** 行動版的返回鍵。對應 Figma 的 showButtonPre 屬性。 */
  onBack?: () => void;
  /** 版型。 */
  device?: 'desktop' | 'mobile';
  className?: string;
}

/**
 * 頂部應用列 —— Figma「App Bar / Desktop」（node 1201:31471）與
 * 「App Bar / Mobile」（node 1392:23656）
 *
 * 桌機版標題為 Headline/1；行動版縮為 Headline/3，並可顯示返回鍵。
 */
export function AppBar({
  title = '本土語文直播共學',
  userName = '您好 陳老師',
  onBack,
  device = 'desktop',
  className = '',
}: AppBarProps) {
  return (
    <header className={`lds-appbar lds-appbar--${device}${className ? ` ${className}` : ''}`}>
      {device === 'mobile' && onBack && (
        <button type="button" className="lds-appbar__back" onClick={onBack} aria-label="返回">
          {/* 設計稿以朝下的 chevron 旋轉 90° 作為返回鍵 */}
          <Icon name="chevron-down" rotate={90} />
        </button>
      )}

      <p className="lds-appbar__title">{title}</p>

      <div className="lds-appbar__user">
        <span className="lds-appbar__username">{userName}</span>
        <Icon name="user" />
      </div>
    </header>
  );
}
