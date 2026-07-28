import type { Meta, StoryObj } from '@storybook/react-vite';
import { rawToken } from './tokens';
import tokens from './tokens.json';

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          '所有 token 均由 src/tokens/tokens.json 產生，而該檔是 Figma Variables 的鏡像。' +
          '本頁直接讀取產出的值，因此永遠與程式碼一致。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 取出某個前綴下的所有 token。 */
const group = (prefix: string) =>
  Object.entries(rawToken).filter(([name]) => name.startsWith(prefix));

/** 從 tokens.json 找回該 token 對應的 Figma 變數名稱。 */
const figmaNameOf = (cssVar: string): string => {
  const path = cssVar.replace('--lds-', '');
  let found = '';
  const walk = (node: Record<string, unknown>, trail: string[]) => {
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$') || key.startsWith('_')) continue;
      if (child === null || typeof child !== 'object') continue;
      const record = child as Record<string, unknown>;
      const next = [...trail, key];
      if ('$value' in record) {
        const slug = next
          .map((p) => p.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
          .join('-');
        if (slug === path || path.startsWith(`${slug}-`)) {
          const ext = record.$extensions as { figma?: string } | undefined;
          found = ext?.figma ?? '';
        }
        continue;
      }
      walk(record, next);
    }
  };
  walk(tokens as unknown as Record<string, unknown>, []);
  return found;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 'var(--lds-spacing-4xl)' }}>
    <h2 className="lds-headline-2" style={{ marginBottom: 'var(--lds-spacing-l)' }}>
      {title}
    </h2>
    {children}
  </section>
);

const Meta_ = ({ cssVar, value }: { cssVar: string; value: string }) => (
  <div style={{ fontSize: 12, lineHeight: 1.6 }}>
    <code style={{ fontFamily: 'var(--lds-font-family-mono)' }}>{cssVar}</code>
    <div style={{ color: 'var(--lds-color-grey-700)' }}>{value}</div>
    <div style={{ color: 'var(--lds-color-grey-700)' }}>Figma：{figmaNameOf(cssVar) || '—'}</div>
  </div>
);

export const Colors: Story = {
  render: () => (
    <div className="lds-root">
      <Section title="色彩">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 'var(--lds-spacing-l)',
          }}
        >
          {group('--lds-color-').map(([name, value]) => (
            <div
              key={name}
              style={{
                border: '1px solid var(--lds-color-grey-100)',
                borderRadius: 'var(--lds-radius-s)',
                overflow: 'hidden',
              }}
            >
              <div style={{ background: value, blockSize: 64 }} />
              <div style={{ padding: 'var(--lds-spacing-s)' }}>
                <Meta_ cssVar={name} value={value} />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="lds-root">
      <Section title="文字樣式">
        {(
          [
            ['headline-1', '標題一'],
            ['headline-2', '標題二'],
            ['headline-3', '標題三'],
            ['headline-4', '標題四'],
            ['body-l', '內文大'],
            ['body-m', '內文中'],
          ] as const
        ).map(([key, zh]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 'var(--lds-spacing-xl)',
              padding: 'var(--lds-spacing-m) 0',
              borderBottom: '1px solid var(--lds-color-grey-100)',
            }}
          >
            <div style={{ font: `var(--lds-typography-${key})`, flex: 1 }}>
              {zh}　請假申請 Leave Application
            </div>
            <Meta_
              cssVar={`--lds-typography-${key}`}
              value={rawToken[`--lds-typography-${key}` as keyof typeof rawToken]}
            />
          </div>
        ))}
      </Section>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="lds-root">
      <Section title="間距">
        {group('--lds-spacing-').map(([name, value]) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--lds-spacing-l)',
              marginBottom: 'var(--lds-spacing-s)',
            }}
          >
            <div
              style={{
                inlineSize: value,
                blockSize: 24,
                background: 'var(--lds-color-primary-400)',
                flex: 'none',
              }}
            />
            <Meta_ cssVar={name} value={value} />
          </div>
        ))}
      </Section>
    </div>
  ),
};

export const RadiusAndElevation: Story = {
  render: () => (
    <div className="lds-root">
      <Section title="圓角">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lds-spacing-xl)' }}>
          {group('--lds-radius-').map(([name, value]) => (
            <div key={name}>
              <div
                style={{
                  inlineSize: 96,
                  blockSize: 64,
                  borderRadius: value,
                  background: 'var(--lds-color-primary-200)',
                  marginBottom: 'var(--lds-spacing-s)',
                }}
              />
              <Meta_ cssVar={name} value={value} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="陰影">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--lds-spacing-3xl)' }}>
          {group('--lds-elevation-').map(([name, value]) => (
            <div key={name}>
              <div
                style={{
                  inlineSize: 140,
                  blockSize: 80,
                  borderRadius: 'var(--lds-radius-s)',
                  background: 'var(--lds-color-grey-white)',
                  boxShadow: value,
                  marginBottom: 'var(--lds-spacing-l)',
                }}
              />
              <Meta_ cssVar={name} value={value} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};
