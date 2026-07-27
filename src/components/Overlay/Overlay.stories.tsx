import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip, TooltipEmphasis } from './Tooltip';
import { SuccessOverlay } from './SuccessOverlay';
import { BottomBar } from './BottomBar';
import { Pagination } from '../Pagination';
import { PrimaryButton } from '../Button';

const meta = {
  title: 'Components/Overlay',
  component: SuccessOverlay,
  parameters: {
    docs: {
      description: {
        component:
          'Overlay（node 1270:8106，說明浮層）、Overlay / Success（node 1433:27259）、' +
          'Bottom Bar（node 2469:8462）與 Pagination（node 1286:6127）。',
      },
    },
  },
} satisfies Meta<typeof SuccessOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

const Caption = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 12, color: 'var(--lds-color-grey-400)', marginBottom: 8 }}>{children}</div>
);

/** 說明浮層，內容為預錄課程的時間規則。 */
export const InfoTooltip: Story = {
  render: () => (
    <div className="lds-root">
      <Caption>Figma「Overlay」（實為 tooltip）</Caption>
      <Tooltip>
        <ul>
          <li>
            營運中心可協助預錄的時間為
            <TooltipEmphasis>週一至週五 08:00 - 16:00</TooltipEmphasis>
          </li>
          <li>例如：3/6 請假，須在 3/4 中午 12:00 前完成預錄</li>
        </ul>
      </Tooltip>
    </div>
  ),
};

/** 送出成功畫面。 */
export const Success: Story = {
  args: { email: 'chen.wei@gmail.com' },
  render: () => (
    <div className="lds-root">
      <SuccessOverlay email="chen.wei@gmail.com" />
    </div>
  ),
};

/** 行動版底部操作列。 */
export const Bottom: Story = {
  render: () => (
    <div className="lds-root">
      <Caption>Bottom Bar</Caption>
      <BottomBar>
        <PrimaryButton block>提交請假單</PrimaryButton>
      </BottomBar>
    </div>
  ),
};

/** 表格分頁。 */
export const Pages: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    return (
      <div className="lds-root">
        <Caption>Pagination（目前第 {page} 頁）</Caption>
        <Pagination total={3} current={page} onChange={setPage} />
      </div>
    );
  },
};
