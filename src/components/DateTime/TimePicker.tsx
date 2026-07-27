import { useEffect, useRef } from 'react';
import { Alert } from '../Alert';
import { HourMinuteButton } from './DateTimeButtons';
import { CalendarGrid, CalendarSelection, pad2 } from './calendar';
import './DateTime.css';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

/** Button / Hour&Minute 的高度，用來換算捲動位置。 */
const CELL_HEIGHT = 48;

/**
 * 把選取中的時／分捲到欄位頂端。
 *
 * 設計稿無法表達捲動行為，但時與分各有 24 / 60 個選項、
 * 可視高度只有 336（7 格），不捲動的話使用者看不到目前選的值。
 */
function useScrollToSelected(value: number | null) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && value != null) {
      ref.current.scrollTop = value * CELL_HEIGHT;
    }
  }, [value]);

  return ref;
}

export interface TimePickerProps {
  /** 顯示中的西元年。 */
  year: number;
  /** 顯示中的月份，1–12。 */
  month: number;
  /** 已選取的日期。 */
  value?: Date | null;
  /** 已選取的時，0–23。 */
  hour?: number | null;
  /** 已選取的分，0–59。 */
  minute?: number | null;
  onSelect?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
  onHourChange?: (hour: number) => void;
  onMinuteChange?: (minute: number) => void;
  /**
   * 版型。
   * overlay：桌機浮層，日曆與時間欄左右並排（Figma Type=Teacher）。
   * mobile：行動版，改為上下堆疊並以 Primary/300 分隔線區隔（Type=Teacher_Mobile）。
   */
  variant?: 'overlay' | 'mobile';
  /** 錯誤訊息。 */
  error?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  /** 「不預錄課程」。教師若不補錄課程，走這個出口。 */
  onSkipRecording?: () => void;
  className?: string;
}

/**
 * 日期時間選擇器 —— Figma「TimePicker」（node 1286:17966）
 *
 * Type=Teacher, Error=Default   node 1190:30224
 * Type=Teacher, Error=Error     node 2074:24893
 * Type=Teacher_Mobile           node 1433:28451
 *
 * 在 Date Picker 的日曆右側加上時與分兩個捲動欄。
 * 時間數字使用 SF Mono 等寬字，捲動時才不會左右跳動。
 */
export function TimePicker({
  year,
  month,
  value = null,
  hour = null,
  minute = null,
  onSelect,
  onMonthChange,
  onHourChange,
  onMinuteChange,
  variant = 'overlay',
  error,
  onCancel,
  onConfirm,
  onSkipRecording,
  className = '',
}: TimePickerProps) {
  const timeLabel = `${pad2(hour ?? 0)}:${pad2(minute ?? 0)}`;
  const hourRef = useScrollToSelected(hour);
  const minuteRef = useScrollToSelected(minute);

  const timeColumns = (
    <div className="lds-timepicker__columns">
      <div className="lds-timepicker__column" ref={hourRef} role="listbox" aria-label="時">
        {HOURS.map((h) => (
          <HourMinuteButton
            key={h}
            role="option"
            aria-selected={h === hour}
            selected={h === hour}
            onClick={() => onHourChange?.(h)}
          >
            {pad2(h)}
          </HourMinuteButton>
        ))}
      </div>
      <div className="lds-timepicker__column" ref={minuteRef} role="listbox" aria-label="分">
        {MINUTES.map((m) => (
          <HourMinuteButton
            key={m}
            role="option"
            aria-selected={m === minute}
            selected={m === minute}
            onClick={() => onMinuteChange?.(m)}
          >
            {pad2(m)}
          </HourMinuteButton>
        ))}
      </div>
    </div>
  );

  const actions = (
    <div className="lds-datepicker__actions">
      <button type="button" className="lds-textbtn" onClick={onCancel}>
        取消
      </button>
      <button type="button" className="lds-textbtn" onClick={onSkipRecording}>
        不預錄課程
      </button>
      <button type="button" className="lds-textbtn" onClick={onConfirm}>
        確認
      </button>
    </div>
  );

  return (
    <div className={`lds-timepicker lds-timepicker--${variant}${className ? ` ${className}` : ''}`}>
      {variant === 'overlay' ? (
        <>
          <div className="lds-timepicker__body">
            <div className="lds-timepicker__calendar">
              <CalendarSelection year={year} month={month} onMonthChange={onMonthChange} />
              <CalendarGrid year={year} month={month} value={value} onSelect={onSelect} />
            </div>
            <div className="lds-timepicker__time">
              <div className="lds-timepicker__display" aria-live="polite">
                {timeLabel}
              </div>
              {timeColumns}
            </div>
          </div>
          {error && <Alert className="lds-datepicker__alert">{error}</Alert>}
          {actions}
        </>
      ) : (
        <>
          <CalendarSelection year={year} month={month} onMonthChange={onMonthChange} />
          <CalendarGrid year={year} month={month} value={value} onSelect={onSelect} />
          <div className="lds-timepicker__divider" />
          <div className="lds-timepicker__display" aria-live="polite">
            {timeLabel}
          </div>
          {timeColumns}
          <div className="lds-timepicker__divider" />
          {error && <Alert className="lds-datepicker__alert">{error}</Alert>}
          {actions}
        </>
      )}
    </div>
  );
}
