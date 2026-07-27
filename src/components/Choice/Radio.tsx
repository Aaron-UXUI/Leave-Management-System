import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import './Choice.css';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 選項文字，例如假別名稱。 */
  children: ReactNode;
}

/**
 * 單選項目 —— Figma「Radio Button / Leave_Selection」（node 1125:8706）
 *
 * 24×24 點擊區內置中 18×18 圓框；選取時中央顯示 10×10 實心圓點。
 */
export function Radio({ children, className = '', id, ...rest }: RadioProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <label
      htmlFor={fieldId}
      className={`lds-choice lds-choice--radio${className ? ` ${className}` : ''}`}
    >
      <input id={fieldId} type="radio" className="lds-choice__input" {...rest} />
      <span className="lds-choice__control" aria-hidden="true">
        <span className="lds-choice__box">
          <span className="lds-choice__dot" />
        </span>
      </span>
      <span>{children}</span>
    </label>
  );
}
