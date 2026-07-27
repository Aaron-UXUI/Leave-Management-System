import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons';
import './Choice.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 選項文字。純核取方塊（表格全選）可留空。 */
  children?: ReactNode;
  /** 無可見文字時的無障礙名稱。 */
  label?: string;
}

/**
 * 核取方塊 —— Figma「CheckBox」（node 1190:29732）
 *
 * 24×24 點擊區內置中 20×20 方塊，勾號取自設計稿內嵌的向量。
 */
export function Checkbox({ children, label, className = '', id, ...rest }: CheckboxProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <label
      htmlFor={fieldId}
      className={`lds-choice lds-choice--checkbox${className ? ` ${className}` : ''}`}
    >
      <input
        id={fieldId}
        type="checkbox"
        className="lds-choice__input"
        aria-label={children ? undefined : label}
        {...rest}
      />
      <span className="lds-choice__control" aria-hidden="true">
        <span className="lds-choice__box">
          {/* 勾號僅在選取時顯示，由 CSS 控制 */}
          <Icon name="check-20" size={20} className="lds-choice__check" />
        </span>
      </span>
      {children && <span>{children}</span>}
    </label>
  );
}
