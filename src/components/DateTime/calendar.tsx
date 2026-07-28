import { DateButton, PrevNextButton } from './DateTimeButtons';

/** 設計稿的星期標頭，以日為一週之始。 */
export const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

/** 設計稿使用的中文月份寫法。 */
export const MONTH_LABELS = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
] as const;

export interface CalendarCell {
  date: Date;
  inMonth: boolean;
}

/** 產生 6 週 × 7 天的格子，前後補滿相鄰月份的日期。 */
export function buildGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month - 1, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return { date, inMonth: date.getMonth() === month - 1 };
  });
}

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** 兩位數補零，時間欄位一律以兩位數呈現。 */
export const pad2 = (n: number) => String(n).padStart(2, '0');

interface SelectionProps {
  year: number;
  month: number;
  onMonthChange?: (year: number, month: number) => void;
}

/**
 * 年月切換列 —— Figma「Selection」（Date Picker 內 node 1125:21835）
 */
export function CalendarSelection({ year, month, onMonthChange }: SelectionProps) {
  const shift = (delta: number) => {
    const next = new Date(year, month - 1 + delta, 1);
    onMonthChange?.(next.getFullYear(), next.getMonth() + 1);
  };

  return (
    <div className="lds-datepicker__selection">
      <PrevNextButton direction="previous" label="上個月" onClick={() => shift(-1)} />
      <div className="lds-datepicker__yearmonth" aria-live="polite">
        <span>{year}年</span>
        <span>{MONTH_LABELS[month - 1]}</span>
      </div>
      <PrevNextButton direction="next" label="下個月" onClick={() => shift(1)} />
    </div>
  );
}

interface GridProps {
  year: number;
  month: number;
  value?: Date | null;
  onSelect?: (date: Date) => void;
}

/**
 * 日期格 —— Figma「DateGrid」（node 1125:22248）
 *
 * 7 欄 × 7 列的 48px 格子：第一列是星期標頭，其餘 42 格為日期。
 */
export function CalendarGrid({ year, month, value = null, onSelect }: GridProps) {
  const cells = buildGrid(year, month);

  // ARIA 的 grid 角色要求 row → gridcell 的層級，不能把格子直接攤平在 grid 底下。
  // 拆成 6 個星期列，視覺上與設計稿的 7×7 完全相同。
  const weeks = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));

  return (
    <div
      className="lds-datepicker__grid"
      role="grid"
      aria-label={`${year}年${MONTH_LABELS[month - 1]}`}
    >
      <div className="lds-datepicker__row" role="row">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="lds-datepicker__weekday"
            role="columnheader"
            aria-label={`星期${day}`}
          >
            {day}
          </div>
        ))}
      </div>

      {weeks.map((week, w) => (
        <div key={w} className="lds-datepicker__row" role="row">
          {week.map(({ date, inMonth }) => (
            <div key={date.toISOString()} role="gridcell" className="lds-datepicker__cell">
              <DateButton
                selected={value ? isSameDay(date, value) : false}
                outside={!inMonth}
                disabled={!inMonth}
                aria-label={`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`}
                onClick={() => onSelect?.(date)}
              >
                {date.getDate()}
              </DateButton>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
