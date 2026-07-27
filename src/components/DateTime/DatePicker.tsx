import { Alert } from '../Alert';
import { CalendarGrid, CalendarSelection } from './calendar';
import './DateTime.css';

export { WEEKDAY_LABELS, MONTH_LABELS } from './calendar';

export interface DatePickerProps {
  /** 顯示中的西元年。 */
  year: number;
  /** 顯示中的月份，1–12。 */
  month: number;
  /** 已選取的日期。 */
  value?: Date | null;
  /** 點選某一天。 */
  onSelect?: (date: Date) => void;
  /** 切換月份，會帶入切換後的年月。 */
  onMonthChange?: (year: number, month: number) => void;
  /**
   * 版型。
   * overlay：浮層，Primary/100 底、圓角 16、Elevation/High，下方有取消／確認。
   * mobile：整頁式，白底無圓角，月份切換移到日曆下方，且沒有動作列。
   */
  variant?: 'overlay' | 'mobile';
  /** 錯誤訊息。設計稿文案為「尚未選擇日期」。 */
  error?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  className?: string;
}

/**
 * 日期選擇器 —— Figma「Date Picker」（node 1433:24853）
 *
 * Type=Overlay, Error=Default   node 1190:30223
 * Type=Overlay, Error=Error     node 2074:24770
 * Type=Mobile Screen            node 1433:24854
 *
 * 星期標頭與日期格都是同一個 Button / Date 元件；
 * 非當月的日期沿用設計稿做法，整格套 33% 不透明度。
 */
export function DatePicker({
  year,
  month,
  value = null,
  onSelect,
  onMonthChange,
  variant = 'overlay',
  error,
  onCancel,
  onConfirm,
  className = '',
}: DatePickerProps) {
  const selection = <CalendarSelection year={year} month={month} onMonthChange={onMonthChange} />;
  const grid = <CalendarGrid year={year} month={month} value={value} onSelect={onSelect} />;

  return (
    <div className={`lds-datepicker lds-datepicker--${variant}${className ? ` ${className}` : ''}`}>
      {variant === 'overlay' ? (
        <>
          {selection}
          {grid}
          {error && <Alert className="lds-datepicker__alert">{error}</Alert>}
          <div className="lds-datepicker__actions">
            <button type="button" className="lds-textbtn" onClick={onCancel}>
              取消
            </button>
            <button type="button" className="lds-textbtn" onClick={onConfirm}>
              確認
            </button>
          </div>
        </>
      ) : (
        <>
          {grid}
          {selection}
          {error && <Alert className="lds-datepicker__alert">{error}</Alert>}
        </>
      )}
    </div>
  );
}
