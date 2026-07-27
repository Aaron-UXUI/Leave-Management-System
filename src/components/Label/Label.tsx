import type { HTMLAttributes, ReactNode } from 'react';
import './Label.css';

/** 對應 Figma Label 元件的 Type 屬性。 */
export type LabelType = 'leave' | 'attend' | 'pending' | 'pass' | 'reject';

/** 各類型在設計稿中的文案。 */
const DEFAULT_TEXT: Record<LabelType, string> = {
  leave: '請假',
  attend: '出席',
  pending: '待審',
  pass: '通過',
  reject: '拒絕',
};

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  /** 標籤類型。attend 對應 Figma 的「出席」variant。 */
  type: LabelType;
  /** 覆寫文案；未指定時使用設計稿文案。 */
  children?: ReactNode;
}

/**
 * 狀態標籤 —— Figma「Label」（node 2488:3961）
 *
 * 用於請假紀錄表格，標示課程出缺席與審核狀態。
 */
export function Label({ type, children, className = '', ...rest }: LabelProps) {
  return (
    <span className={`lds-label lds-label--${type}${className ? ` ${className}` : ''}`} {...rest}>
      {children ?? DEFAULT_TEXT[type]}
    </span>
  );
}
