import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageLayout } from './PageLayout';
import { AppBar, NavBar, TEACHER_NAV_ITEMS } from '../Navigation';
import { BottomBar } from '../Overlay';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '../Button';
import { TextField } from '../TextField';
import { Dropdown } from '../Dropdown';
import { RadioGroup, Radio, LEAVE_TYPES } from '../Choice';
import { Label } from '../Label';

const meta = {
  title: 'Components/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '把各畫面共用的版面決策收在一處：內容欄寬度、左右留白、頂部與底部列的堆疊。' +
          '實際畫面應該在應用程式的 repo 裡組，設計系統只提供這層骨架。',
      },
    },
  },
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 示範用的請假表單內容，不屬於設計系統。 */
function LeaveFormDemo() {
  const [type, setType] = useState<string>('事假');
  const [reason, setReason] = useState('');

  return (
    <div style={{ display: 'grid', gap: 'var(--lds-spacing-xl)' }}>
      <h1 className="lds-headline-2">請假申請</h1>

      <RadioGroup legend="假別">
        {LEAVE_TYPES.slice(0, 4).map((t) => (
          <Radio
            key={t}
            name="demo-leave-type"
            value={t}
            checked={type === t}
            onChange={() => setType(t)}
          >
            {t}
          </Radio>
        ))}
      </RadioGroup>

      <div style={{ display: 'flex', gap: 'var(--lds-spacing-l)', flexWrap: 'wrap' }}>
        <Dropdown label="請假開始時間" state="selected" value="2025/08/04 13:20" />
        <Dropdown label="請假結束時間" state="default" />
      </div>

      <TextField
        label="事由"
        supportingText="請勿超過 30 個字"
        maxLength={30}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--lds-spacing-l)',
        }}
      >
        <SecondaryButton state="upload" />
        <TertiaryButton>上傳證明文件</TertiaryButton>
        <Label type="pending" />
      </div>
    </div>
  );
}

/** 桌機版：內容欄最大寬 1280、左右留白 64，與 App Bar／Nav Bar 對齊。 */
export const Desktop: Story = {
  args: { children: null },
  render: function Render() {
    const [active, setActive] = useState(0);
    return (
      <PageLayout
        device="desktop"
        appBar={<AppBar device="desktop" />}
        navBar={
          <NavBar
            device="desktop"
            items={TEACHER_NAV_ITEMS.map((label, i) => ({ label, onClick: () => setActive(i) }))}
            activeIndex={active}
          />
        }
      >
        <LeaveFormDemo />
        <div style={{ marginBlockStart: 'var(--lds-spacing-3xl)' }}>
          <PrimaryButton>提交請假單</PrimaryButton>
        </div>
      </PageLayout>
    );
  },
};

/** 行動版：隨裝置寬度伸縮，主要動作固定在底部。 */
export const Mobile: Story = {
  args: { children: null },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: function Render() {
    const [active, setActive] = useState(0);
    return (
      <div style={{ inlineSize: 375, blockSize: 812, overflow: 'auto', border: '1px solid #eee' }}>
        <PageLayout
          device="mobile"
          appBar={<AppBar device="mobile" onBack={() => undefined} />}
          navBar={
            <NavBar
              device="mobile"
              items={TEACHER_NAV_ITEMS.map((label, i) => ({ label, onClick: () => setActive(i) }))}
              activeIndex={active}
            />
          }
          bottomBar={
            <BottomBar>
              <PrimaryButton block>提交請假單</PrimaryButton>
            </BottomBar>
          }
        >
          <LeaveFormDemo />
        </PageLayout>
      </div>
    );
  },
};
