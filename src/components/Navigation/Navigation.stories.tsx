import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppBar } from './AppBar';
import { NavBar, TEACHER_NAV_ITEMS, SCHOOL_NAV_ITEMS } from './NavBar';

const meta = {
  title: 'Components/Navigation',
  component: NavBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Figma「Bar」section（node 1804:13177）。App Bar 與 Nav Bar 各有桌機與行動版，' +
          'Nav Bar 另分教師端與學校端兩組分頁。',
      },
    },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const toItems = (labels: readonly string[]) => labels.map((label) => ({ label }));

/** 教師端桌機：App Bar + Nav Bar 組合。 */
export const TeacherDesktop: Story = {
  args: { items: toItems(TEACHER_NAV_ITEMS), activeIndex: 0 },
  render: function Render() {
    const [active, setActive] = useState(0);
    return (
      <div className="lds-root">
        <AppBar device="desktop" />
        <NavBar
          device="desktop"
          items={TEACHER_NAV_ITEMS.map((label, i) => ({ label, onClick: () => setActive(i) }))}
          activeIndex={active}
        />
      </div>
    );
  },
};

/** 學校端桌機：分頁少一項，第三項改為「教師請假」。 */
export const SchoolDesktop: Story = {
  args: { items: toItems(SCHOOL_NAV_ITEMS), activeIndex: 0 },
  render: function Render() {
    const [active, setActive] = useState(2);
    return (
      <div className="lds-root">
        <AppBar device="desktop" />
        <NavBar
          device="desktop"
          items={SCHOOL_NAV_ITEMS.map((label, i) => ({ label, onClick: () => setActive(i) }))}
          activeIndex={active}
        />
      </div>
    );
  },
};

/** 教師端行動版：分頁等寬平分，App Bar 可顯示返回鍵。 */
export const TeacherMobile: Story = {
  args: { items: toItems(TEACHER_NAV_ITEMS), activeIndex: 0 },
  render: function Render() {
    const [active, setActive] = useState(1);
    return (
      <div className="lds-root" style={{ inlineSize: 375, border: '1px solid #eee' }}>
        <AppBar device="mobile" onBack={() => undefined} />
        <NavBar
          device="mobile"
          items={TEACHER_NAV_ITEMS.map((label, i) => ({ label, onClick: () => setActive(i) }))}
          activeIndex={active}
        />
      </div>
    );
  },
};
