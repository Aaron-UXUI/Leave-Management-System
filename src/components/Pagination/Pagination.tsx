import { PrevNextButton } from '../DateTime/DateTimeButtons';
import './Pagination.css';

export interface PaginationProps {
  /** 總頁數。 */
  total: number;
  /** 目前頁碼，從 1 起算。 */
  current: number;
  /** 換頁回呼。 */
  onChange?: (page: number) => void;
  /** 無障礙名稱。 */
  label?: string;
  className?: string;
}

/**
 * 分頁 —— Figma「Pagination」（node 1286:6127）
 *
 * 由 Button / Pre&Next 與頁碼按鈕組成。
 * 目前頁的底色為 Primary/900、文字轉白；其餘為無底色的 Grey Scale/900。
 */
export function Pagination({
  total,
  current,
  onChange,
  label = '分頁',
  className = '',
}: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const go = (page: number) => {
    if (page >= 1 && page <= total && page !== current) onChange?.(page);
  };

  return (
    <nav aria-label={label} className={`lds-pagination${className ? ` ${className}` : ''}`}>
      <PrevNextButton
        direction="previous"
        label="上一頁"
        disabled={current <= 1}
        onClick={() => go(current - 1)}
      />

      <div className="lds-pagination__pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className="lds-pagination__page"
            data-current={page === current || undefined}
            aria-current={page === current ? 'page' : undefined}
            aria-label={`第 ${page} 頁`}
            onClick={() => go(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <PrevNextButton
        direction="next"
        label="下一頁"
        disabled={current >= total}
        onClick={() => go(current + 1)}
      />
    </nav>
  );
}
