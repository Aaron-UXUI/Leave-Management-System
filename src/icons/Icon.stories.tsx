import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, iconNames, icons } from './Icon';

const meta = {
  title: 'Foundations/Icons',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          '圖示取自 Lucide，經設計稿調整後由 Figma 匯出（icon section，node 1804:12591）。' +
          '描邊固定 1.1（viewBox 單位），顏色以 currentColor 繼承外層文字色。',
      },
    },
  },
  argTypes: {
    name: { control: 'select', options: iconNames },
    rotate: { control: 'inline-radio', options: [0, 90, 180, 270] },
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { name: 'calendar', size: 24, rotate: 0, label: '日曆' },
};

/** 全部圖示，含對應的 Figma 元件名稱與 node ID。 */
export const AllIcons: Story = {
  args: { name: 'calendar' },
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      className="lds-root"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 'var(--lds-spacing-l)',
      }}
    >
      {iconNames.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--lds-spacing-s)',
            padding: 'var(--lds-spacing-l)',
            border: `1px solid var(--lds-color-grey-100)`,
            borderRadius: 'var(--lds-radius-s)',
            color: 'var(--lds-color-grey-900)',
          }}
        >
          <Icon name={name} />
          <code style={{ fontFamily: 'var(--lds-font-family-mono)', fontSize: 12 }}>{name}</code>
          <span
            style={{
              fontSize: 11,
              color: 'var(--lds-color-grey-700)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            {icons[name].figma.name}
            <br />
            {icons[name].figma.nodeId}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** chevron 在設計稿中只有朝下一種，其餘方向以 rotate 取得。 */
export const ChevronDirections: Story = {
  args: { name: 'chevron-down' },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--lds-spacing-xl)', color: 'var(--lds-color-grey-900)' }}>
      {([0, 90, 180, 270] as const).map((deg) => (
        <div key={deg} style={{ textAlign: 'center' }}>
          <Icon name="chevron-down" rotate={deg} />
          <div style={{ fontSize: 12, color: 'var(--lds-color-grey-700)' }}>{deg}°</div>
        </div>
      ))}
    </div>
  ),
};
