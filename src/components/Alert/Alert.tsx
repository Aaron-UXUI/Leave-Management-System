import type { HTMLAttributes, ReactNode } from 'react';
import './Alert.css';

export interface AlertProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

/**
 * 表單錯誤訊息 —— Figma「Alert」（node 2074:11301）
 *
 * 設計稿中的文案範例：「尚未選擇日期、時間」「請選擇假別」。
 * 以 role="alert" 輸出，讓螢幕閱讀器在錯誤出現時即時朗讀。
 */
export function Alert({ children, className = '', ...rest }: AlertProps) {
  return (
    <p role="alert" className={`lds-alert${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </p>
  );
}
