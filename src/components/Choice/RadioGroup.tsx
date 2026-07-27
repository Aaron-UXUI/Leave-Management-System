import type { ReactNode } from 'react';
import { Alert } from '../Alert';
import './Choice.css';

export interface RadioGroupProps {
  /** 群組標題，會輸出為 fieldset 的 legend。 */
  legend: string;
  /** 隱藏可見的 legend，但保留給螢幕閱讀器。 */
  hideLegend?: boolean;
  /** Radio 項目。 */
  children: ReactNode;
  /** 錯誤訊息。對應 Figma 的 showAlert 屬性，設計稿文案為「請選擇假別」。 */
  error?: string;
  className?: string;
}

/**
 * 單選群組 —— Figma「Radio Button Group」（node 1125:8733）
 *
 * 設計稿中的假別清單為：公假、事假、病假、生理假、喪假、
 * 原住民族歲時祭儀放假日、婚假。
 */
export function RadioGroup({
  legend,
  hideLegend = false,
  children,
  error,
  className = '',
}: RadioGroupProps) {
  return (
    <fieldset className={`lds-choice-group${className ? ` ${className}` : ''}`}>
      <legend className={`lds-choice-group__legend${hideLegend ? ' lds-visually-hidden' : ''}`}>
        {legend}
      </legend>
      {children}
      {error && <Alert>{error}</Alert>}
    </fieldset>
  );
}

/** 設計稿中列出的假別選項，可直接套用以確保與 Figma 一致。 */
export const LEAVE_TYPES = [
  '公假',
  '事假',
  '病假',
  '生理假',
  '喪假',
  '原住民族歲時祭儀放假日',
  '婚假',
] as const;
