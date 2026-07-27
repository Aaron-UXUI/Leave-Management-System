import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { TertiaryButton } from './TertiaryButton';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/Button',
  component: PrimaryButton,
  parameters: {
    docs: {
      description: {
        component:
          'Figma「Button」section（node 1125:8260）。Primary / Secondary / Tertiary / Icon Button ' +
          '四個元件的樣式全部取自 Figma Variables，不含任何寫死的數值。',
      },
    },
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    className="lds-root"
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--lds-spacing-l)',
    }}
  >
    {children}
  </div>
);

const Caption = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 12, color: 'var(--lds-color-grey-400)', marginBottom: 4 }}>{children}</div>
);

/** Primary Button 的三個 Figma 狀態。 */
export const Primary: Story = {
  args: { children: '提交請假單' },
  render: () => (
    <Row>
      <div>
        <Caption>Default</Caption>
        <PrimaryButton>提交請假單</PrimaryButton>
      </div>
      <div>
        <Caption>Hovered</Caption>
        <PrimaryButton previewState="hovered">提交請假單</PrimaryButton>
      </div>
      <div>
        <Caption>Disable</Caption>
        <PrimaryButton disabled>提交請假單</PrimaryButton>
      </div>
      <div>
        <Caption>含圖示</Caption>
        <PrimaryButton icon="upload">提交請假單</PrimaryButton>
      </div>
    </Row>
  ),
};

/** Secondary Button 的完整上傳流程狀態。 */
export const Secondary: Story = {
  args: { children: '選取證明文件' },
  render: () => (
    <Row>
      <div>
        <Caption>Upload（預設）</Caption>
        <SecondaryButton state="upload" />
      </div>
      <div>
        <Caption>Hovered</Caption>
        <SecondaryButton state="upload" previewState="hovered" />
      </div>
      <div>
        <Caption>Disabled</Caption>
        <SecondaryButton state="disabled" />
      </div>
      <div>
        <Caption>Uploading（進度 45%）</Caption>
        <SecondaryButton state="uploading" progress={0.45} />
      </div>
      <div>
        <Caption>Success</Caption>
        <SecondaryButton state="success" />
      </div>
      <div>
        <Caption>Reupload?</Caption>
        <SecondaryButton state="reupload" />
      </div>
    </Row>
  ),
};

/**
 * 上傳流程的實際運作：掃描條由左往右覆蓋，完成後切換為 Success。
 * 對應 Figma 中的 Uploading_1 / Uploading_2 兩個關鍵影格。
 */
export const SecondaryUploadFlow: Story = {
  args: { children: '選取證明文件' },
  render: function Render() {
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
      if (done) return;
      const id = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            setDone(true);
            return 1;
          }
          return p + 0.1;
        });
      }, 300);
      return () => clearInterval(id);
    }, [done]);

    return (
      <Row>
        <SecondaryButton state={done ? 'success' : 'uploading'} progress={progress} />
        <TertiaryButton
          icon={undefined}
          onClick={() => {
            setProgress(0);
            setDone(false);
          }}
        >
          重新播放
        </TertiaryButton>
      </Row>
    );
  },
};

/** Tertiary Button：無底色的輔助操作。 */
export const Tertiary: Story = {
  args: { children: '上傳證明文件' },
  render: () => (
    <Row>
      <div>
        <Caption>Default</Caption>
        <TertiaryButton>上傳證明文件</TertiaryButton>
      </div>
      <div>
        <Caption>Hovered（Figma 未定義，程式端暫定）</Caption>
        <TertiaryButton previewState="hovered">上傳證明文件</TertiaryButton>
      </div>
      <div>
        <Caption>無圖示</Caption>
        <TertiaryButton icon={undefined}>上傳證明文件</TertiaryButton>
      </div>
    </Row>
  ),
};

/** Icon Button：48×48，用於表格上方的排序與篩選。 */
export const IconOnly: Story = {
  args: { children: '' },
  render: () => (
    <Row>
      <div>
        <Caption>排序</Caption>
        <IconButton icon="sort-16" label="排序" />
      </div>
      <div>
        <Caption>篩選</Caption>
        <IconButton icon="filter-16" label="篩選" />
      </div>
      <div>
        <Caption>Hovered（Figma 未定義，程式端暫定）</Caption>
        <IconButton icon="sort-16" label="排序" previewState="hovered" />
      </div>
    </Row>
  ),
};
