import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { RadioGroup, LEAVE_TYPES } from './RadioGroup';

const meta = {
  title: 'Components/Form/Choice',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component:
          'Radio（node 1125:8706）與 CheckBox（node 1190:29732）。' +
          '兩者皆以原生 input 承載狀態與鍵盤行為，外觀另以 span 繪製。',
      },
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 假別單選群組，選項與設計稿一致。 */
export const LeaveTypeGroup: Story = {
  args: { children: '事假' },
  render: function Render() {
    const [selected, setSelected] = useState<string>('事假');
    return (
      <div className="lds-root">
        <RadioGroup legend="假別">
          {LEAVE_TYPES.map((type) => (
            <Radio
              key={type}
              name="leave-type"
              value={type}
              checked={selected === type}
              onChange={() => setSelected(type)}
            >
              {type}
            </Radio>
          ))}
        </RadioGroup>
      </div>
    );
  },
};

/** 未選取時的錯誤提示，對應 Figma 的 showAlert 屬性。 */
export const LeaveTypeGroupWithError: Story = {
  args: { children: '事假' },
  render: () => (
    <div className="lds-root">
      <RadioGroup legend="假別" error="請選擇假別">
        {LEAVE_TYPES.slice(0, 3).map((type) => (
          <Radio key={type} name="leave-type-error" value={type}>
            {type}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  ),
};

/** Radio 的 On / Off / 停用。 */
export const RadioStates: Story = {
  args: { children: '事假' },
  render: () => (
    <div className="lds-root" style={{ display: 'flex', gap: 'var(--lds-spacing-xl)' }}>
      <Radio name="radio-demo-a" defaultChecked>
        State=On
      </Radio>
      <Radio name="radio-demo-b">State=Off</Radio>
      <Radio name="radio-demo-c" disabled>
        停用（Figma 未定義）
      </Radio>
    </div>
  ),
};

/** CheckBox 的 Yes / No / 停用。 */
export const CheckboxStates: Story = {
  args: { children: '' },
  render: () => (
    <div className="lds-root" style={{ display: 'flex', gap: 'var(--lds-spacing-xl)' }}>
      <Checkbox defaultChecked>Checked?=Yes</Checkbox>
      <Checkbox>Checked?=No</Checkbox>
      <Checkbox disabled>停用（Figma 未定義）</Checkbox>
    </div>
  ),
};
