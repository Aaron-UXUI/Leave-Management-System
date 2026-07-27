import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { TextField } from '../TextField';
import { SearchBar } from '../SearchBar';
import { Alert } from '../Alert';
import { Label } from '../Label';

const meta = {
  title: 'Components/Form/Fields',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component:
          'Dropdown（node 1190:29779）、Text Field（node 1433:25197）、' +
          'Search Bar（node 2484:4001）、Alert（node 2074:11301）、Label（node 2488:3961）。',
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div
    className="lds-root"
    style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lds-spacing-xl)' }}
  >
    {children}
  </div>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 12, color: 'var(--lds-color-grey-400)', marginBottom: 4 }}>{children}</div>
);

/** Dropdown 的五個 Figma 狀態。 */
export const DropdownStates: Story = {
  args: { label: '請假開始時間' },
  render: () => (
    <Grid>
      <div>
        <Caption>Default</Caption>
        <Dropdown label="請假開始時間" state="default" />
      </div>
      <div>
        <Caption>Date Selecting</Caption>
        <Dropdown label="請假開始時間" state="selecting" />
      </div>
      <div>
        <Caption>Selected</Caption>
        <Dropdown label="請假開始時間" state="selected" value="2025/08/04 13:20" />
      </div>
      <div>
        <Caption>Disable</Caption>
        <Dropdown label="請假開始時間" state="disabled" />
      </div>
      <div>
        <Caption>Error（Figma 中命名為 State5）</Caption>
        <Dropdown label="請假開始時間" state="error" />
      </div>
    </Grid>
  ),
};

/** Text Field 的桌機與行動版。 */
export const TextFieldDevices: Story = {
  args: { label: '事由' },
  render: function Render() {
    const [desktop, setDesktop] = useState('');
    const [mobile, setMobile] = useState('');
    return (
      <Grid>
        <div>
          <Caption>Device=Desktop</Caption>
          <TextField
            label="事由"
            device="desktop"
            supportingText="請勿超過 30 個字"
            maxLength={30}
            value={desktop}
            onChange={(e) => setDesktop(e.target.value)}
          />
        </div>
        <div>
          <Caption>Device=Mobile</Caption>
          <TextField
            label="事由"
            device="mobile"
            supportingText="請勿超過 30 個字"
            maxLength={30}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
      </Grid>
    );
  },
};

export const Search: Story = {
  args: { label: '搜尋' },
  render: () => (
    <Grid>
      <SearchBar />
    </Grid>
  ),
};

export const AlertMessages: Story = {
  args: { label: '錯誤訊息' },
  render: () => (
    <div className="lds-root" style={{ display: 'grid', gap: 'var(--lds-spacing-s)' }}>
      <Alert>尚未選擇日期、時間</Alert>
      <Alert>請選擇假別</Alert>
    </div>
  ),
};

/** Label 的五個類型。 */
export const Labels: Story = {
  args: { label: '狀態標籤' },
  render: () => (
    <Grid>
      <Label type="leave" />
      <Label type="attend" />
      <Label type="pending" />
      <Label type="pass" />
      <Label type="reject" />
    </Grid>
  ),
};
