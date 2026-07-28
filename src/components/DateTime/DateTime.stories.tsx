import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import { DateButton, PrevNextButton, HourMinuteButton } from './DateTimeButtons';

const meta = {
  title: 'Components/DateTime',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          'Date Picker（node 1433:24853）與 TimePicker（node 1286:17966）。' +
          '兩者共用同一套日曆內部，並由 Button / Date、Button / Pre&Next、' +
          'Button / Hour&Minute 三個原子按鈕組成。',
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const Caption = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 12, color: 'var(--lds-color-grey-700)', marginBottom: 8 }}>{children}</div>
);

/** 組成日期時間選擇器的三個原子按鈕。 */
export const AtomicButtons: Story = {
  args: { year: 2025, month: 8 },
  render: () => (
    <div
      className="lds-root"
      style={{ display: 'flex', gap: 'var(--lds-spacing-3xl)', alignItems: 'flex-start' }}
    >
      <div>
        <Caption>Button / Date</Caption>
        <div style={{ display: 'flex', gap: 'var(--lds-spacing-s)' }}>
          <DateButton>15</DateButton>
          <DateButton selected>16</DateButton>
          <DateButton outside disabled>
            17
          </DateButton>
        </div>
      </div>
      <div>
        <Caption>Button / Pre&amp;Next</Caption>
        <div style={{ display: 'flex', gap: 'var(--lds-spacing-s)' }}>
          <PrevNextButton direction="previous" />
          <PrevNextButton direction="next" />
        </div>
      </div>
      <div>
        <Caption>Button / Hour&amp;Minute</Caption>
        <div style={{ display: 'flex', gap: 'var(--lds-spacing-s)' }}>
          <HourMinuteButton>08</HourMinuteButton>
          <HourMinuteButton selected>09</HourMinuteButton>
        </div>
      </div>
    </div>
  ),
};

/** Date Picker 浮層，含未選日期的錯誤狀態。 */
export const DatePickerOverlay: Story = {
  args: { year: 2025, month: 8 },
  render: function Render() {
    const [ym, setYm] = useState({ year: 2025, month: 8 });
    const [value, setValue] = useState<Date | null>(new Date(2025, 7, 4));
    return (
      <div className="lds-root" style={{ display: 'flex', gap: 'var(--lds-spacing-3xl)' }}>
        <div>
          <Caption>Type=Overlay, Error=Default</Caption>
          <DatePicker
            year={ym.year}
            month={ym.month}
            value={value}
            onSelect={setValue}
            onMonthChange={(year, month) => setYm({ year, month })}
          />
        </div>
        <div>
          <Caption>Type=Overlay, Error=Error</Caption>
          <DatePicker year={2025} month={8} error="尚未選擇日期" />
        </div>
      </div>
    );
  },
};

/** Date Picker 行動版：月份切換移到日曆下方，沒有動作列。 */
export const DatePickerMobile: Story = {
  args: { year: 2025, month: 8 },
  render: function Render() {
    const [value, setValue] = useState<Date | null>(new Date(2025, 7, 4));
    return (
      <div className="lds-root">
        <Caption>Type=Mobile Screen</Caption>
        <DatePicker year={2025} month={8} variant="mobile" value={value} onSelect={setValue} />
      </div>
    );
  },
};

/** TimePicker 桌機版：日曆右側加上時與分兩個捲動欄。 */
export const TimePickerOverlay: Story = {
  args: { year: 2025, month: 8 },
  render: function Render() {
    const [value, setValue] = useState<Date | null>(new Date(2025, 7, 4));
    const [hour, setHour] = useState<number | null>(9);
    const [minute, setMinute] = useState<number | null>(30);
    return (
      <div className="lds-root">
        <Caption>Type=Teacher, Error=Default</Caption>
        <TimePicker
          year={2025}
          month={8}
          value={value}
          hour={hour}
          minute={minute}
          onSelect={setValue}
          onHourChange={setHour}
          onMinuteChange={setMinute}
        />
      </div>
    );
  },
};

/** TimePicker 行動版：改為上下堆疊，以 Primary/300 分隔線區隔。 */
export const TimePickerMobile: Story = {
  args: { year: 2025, month: 8 },
  render: function Render() {
    const [hour, setHour] = useState<number | null>(0);
    const [minute, setMinute] = useState<number | null>(0);
    return (
      <div className="lds-root">
        <Caption>Type=Teacher_Mobile</Caption>
        <TimePicker
          year={2025}
          month={8}
          variant="mobile"
          value={new Date(2025, 7, 4)}
          hour={hour}
          minute={minute}
          onHourChange={setHour}
          onMinuteChange={setMinute}
        />
      </div>
    );
  },
};
