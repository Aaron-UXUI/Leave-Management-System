import type { ReactNode } from 'react';
import { Icon } from '../../icons';
import { PrimaryButton } from '../Button';
import './Overlay.css';

export interface SuccessOverlayProps {
  /** 主標題。設計稿為「成功遞交請假單！」。 */
  title?: ReactNode;
  /** 說明文字。設計稿為「已經同步寄送一份至您的信箱」。 */
  description?: ReactNode;
  /** 收件信箱，顯示在說明文字下方。 */
  email?: string;
  /** 主要動作的文字。設計稿為「查看請假紀錄」。 */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * 送出成功畫面 —— Figma「Overlay / Success」（node 1433:27259）
 *
 * 480×480，白底、圓角 16、Elevation/High。
 * 成功圖示對應 Figma 的 Motion 元件（Board 0→2 的揭露動畫），
 * 這裡以 CSS 動畫呈現同樣的縮放揭露，並尊重 prefers-reduced-motion。
 */
export function SuccessOverlay({
  title = '成功遞交請假單！',
  description = '已經同步寄送一份至您的信箱',
  email,
  actionLabel = '查看請假紀錄',
  onAction,
  className = '',
}: SuccessOverlayProps) {
  return (
    <div className={`lds-success${className ? ` ${className}` : ''}`} role="status">
      <div className="lds-success__content">
        <div className="lds-success__motion">
          <Icon name="success-check" size={148} className="lds-success__mark" />
        </div>

        <div className="lds-success__info">
          <h2 className="lds-success__title">{title}</h2>
          <div className="lds-success__desc">
            <p>{description}</p>
            {email && <p>{email}</p>}
          </div>
          <PrimaryButton block onClick={onAction}>
            {actionLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
