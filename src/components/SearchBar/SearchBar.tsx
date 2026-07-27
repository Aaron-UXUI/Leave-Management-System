import { useId, type InputHTMLAttributes } from 'react';
import { Icon } from '../../icons';
import './SearchBar.css';

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 無障礙名稱。 */
  label?: string;
}

/**
 * 搜尋列 —— Figma「Search Bar」（node 2484:4001）
 *
 * 設計稿的提示文字為「搜尋日期、代碼、教師」。
 * 放大鏡圖示為填色風格，與其餘 Lucide 描邊圖示不同，見 docs/figma-gaps.md。
 */
export function SearchBar({
  label = '搜尋',
  placeholder = '搜尋日期、代碼、教師',
  className = '',
  id,
  ...rest
}: SearchBarProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={`lds-searchbar${className ? ` ${className}` : ''}`}>
      <Icon name="search-20" className="lds-searchbar__icon" />
      <input
        id={fieldId}
        type="search"
        className="lds-searchbar__input"
        placeholder={placeholder}
        aria-label={label}
        {...rest}
      />
    </div>
  );
}
