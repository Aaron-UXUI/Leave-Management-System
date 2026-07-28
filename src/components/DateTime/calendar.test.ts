import { describe, it, expect } from 'vitest';
import { buildGrid, isSameDay, pad2, MONTH_LABELS, WEEKDAY_LABELS } from './calendar';

/**
 * 日曆格子的計算邏輯。
 *
 * 這裡的錯誤在畫面上很難看出來 —— 日期照樣排得整整齊齊，
 * 只是排錯了。視覺回歸也抓不到，因為它比對的是「跟上次一不一樣」，
 * 不是「對不對」。
 */
describe('buildGrid', () => {
  it('固定產生 6 週 × 7 天', () => {
    for (let month = 1; month <= 12; month++) {
      expect(buildGrid(2025, month)).toHaveLength(42);
    }
  });

  it('第一格永遠是星期日', () => {
    for (let month = 1; month <= 12; month++) {
      expect(buildGrid(2025, month)[0].date.getDay()).toBe(0);
    }
  });

  it('日期連續遞增，不跳號也不重複', () => {
    const cells = buildGrid(2025, 8);
    for (let i = 1; i < cells.length; i++) {
      const prev = cells[i - 1].date;
      const curr = cells[i].date;
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);
      expect(diffDays).toBe(1);
    }
  });

  it('2025 年 8 月：1 號是週五，格子從 7/27 開始', () => {
    const cells = buildGrid(2025, 8);
    expect(cells[0].date.getMonth()).toBe(6); // 七月
    expect(cells[0].date.getDate()).toBe(27);
    expect(cells[0].inMonth).toBe(false);

    const first = cells.find((c) => c.inMonth)!;
    expect(first.date.getDate()).toBe(1);
    expect(first.date.getDay()).toBe(5); // 週五
  });

  it('當月天數正確 —— 含閏年二月', () => {
    const count = (y: number, m: number) => buildGrid(y, m).filter((c) => c.inMonth).length;

    expect(count(2024, 2)).toBe(29); // 閏年
    expect(count(2025, 2)).toBe(28);
    expect(count(2100, 2)).toBe(28); // 百年不閏
    expect(count(2000, 2)).toBe(29); // 四百年閏
    expect(count(2025, 1)).toBe(31);
    expect(count(2025, 4)).toBe(30);
  });

  it('月初剛好是週日時，不會多補一整週在前面', () => {
    // 2025 年 6 月 1 日是週日
    const cells = buildGrid(2025, 6);
    expect(cells[0].date.getMonth()).toBe(5);
    expect(cells[0].date.getDate()).toBe(1);
    expect(cells[0].inMonth).toBe(true);
  });

  it('跨年時年份正確 —— 一月往前補到去年十二月', () => {
    const cells = buildGrid(2025, 1);
    expect(cells[0].date.getFullYear()).toBe(2024);
    expect(cells[0].date.getMonth()).toBe(11);
  });

  it('跨年時年份正確 —— 十二月往後補到明年一月', () => {
    const cells = buildGrid(2025, 12);
    const last = cells[cells.length - 1].date;
    expect(last.getFullYear()).toBe(2026);
    expect(last.getMonth()).toBe(0);
  });

  it('當月的日期全部標記為 inMonth，其餘為 false', () => {
    const cells = buildGrid(2025, 8);
    for (const { date, inMonth } of cells) {
      expect(inMonth).toBe(date.getMonth() === 7);
    }
  });

  it('不受夏令時間影響 —— 每一格都是當地時間的午夜', () => {
    // 3 月與 11 月是多數時區切換夏令時間的月份
    for (const month of [3, 11]) {
      for (const { date } of buildGrid(2025, month)) {
        expect(date.getHours()).toBe(0);
        expect(date.getMinutes()).toBe(0);
      }
    }
  });
});

describe('isSameDay', () => {
  it('同一天但不同時刻，視為同一天', () => {
    expect(isSameDay(new Date(2025, 7, 4, 0, 0), new Date(2025, 7, 4, 23, 59))).toBe(true);
  });

  it('不同日、不同月、不同年都要區分得出來', () => {
    expect(isSameDay(new Date(2025, 7, 4), new Date(2025, 7, 5))).toBe(false);
    expect(isSameDay(new Date(2025, 7, 4), new Date(2025, 8, 4))).toBe(false);
    expect(isSameDay(new Date(2025, 7, 4), new Date(2024, 7, 4))).toBe(false);
  });
});

describe('pad2', () => {
  it('個位數補零，兩位數不變', () => {
    expect(pad2(0)).toBe('00');
    expect(pad2(9)).toBe('09');
    expect(pad2(23)).toBe('23');
    expect(pad2(59)).toBe('59');
  });
});

describe('設計稿文案', () => {
  it('星期標頭為七個，以日為週首', () => {
    expect(WEEKDAY_LABELS).toEqual(['日', '一', '二', '三', '四', '五', '六']);
  });

  it('月份為十二個中文寫法', () => {
    expect(MONTH_LABELS).toHaveLength(12);
    expect(MONTH_LABELS[0]).toBe('一月');
    expect(MONTH_LABELS[7]).toBe('八月');
    expect(MONTH_LABELS[11]).toBe('十二月');
  });
});
