import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../../icons';
import './Button.css';

/** 對應 Figma 的 State 屬性。Hovered 由 CSS :hover 處理，不列為狀態值。 */
export type SecondaryButtonState = 'upload' | 'uploading' | 'success' | 'reupload' | 'disabled';

/**
 * 對應 Figma 的 Type 屬性。
 * 注意：目前設計稿中 select 與 upload 的視覺完全相同，差別僅在語意用途
 * （選檔 vs. 送出上傳）。若要在視覺上區分，需先在 Figma 調整。
 */
export type SecondaryButtonType = 'select' | 'upload';

/** 各狀態在設計稿中的預設文案。文案本身也是設計系統的一部分。 */
const DEFAULT_LABEL: Record<SecondaryButtonState, string> = {
  upload: '選取證明文件',
  uploading: '正在上傳中...',
  success: '上傳成功！',
  reupload: '重新上傳',
  disabled: '選取證明文件',
};

/** 依設計稿，只有這些狀態會顯示 24px 上傳圖示。 */
const STATES_WITH_ICON: SecondaryButtonState[] = ['upload', 'uploading', 'disabled'];

export interface SecondaryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  /** 上傳流程狀態。 */
  state?: SecondaryButtonState;
  /** 語意用途，對應 Figma 的 Type 屬性。 */
  variant?: SecondaryButtonType;
  /** 覆寫文案；未指定時使用該狀態在設計稿中的預設文案。 */
  children?: ReactNode;
  /**
   * 上傳進度，0–1。對應 Figma 的 Uploading motion 變數與 Filler 圖層，
   * 僅在 state="uploading" 時生效。
   */
  progress?: number;
  /** 覆寫圖示，預設為 icon 24/ upload。 */
  icon?: IconName;
  /** HTML button 的 type 屬性。 */
  htmlType?: 'button' | 'submit' | 'reset';
  /** 僅供 Storybook 展示用：強制呈現 hover 外觀。 */
  previewState?: 'default' | 'hovered';
}

/**
 * 次要按鈕 —— Figma「Secondary Button」（node 1433:31886）
 *
 * 請假單的證明文件上傳按鈕，含完整上傳流程狀態：
 * 選取 → 上傳中（掃描條）→ 上傳成功 → 重新上傳。
 */
export function SecondaryButton({
  state = 'upload',
  variant = 'select',
  children,
  progress = 0,
  icon = 'upload',
  htmlType = 'button',
  previewState,
  className = '',
  disabled,
  ...rest
}: SecondaryButtonProps) {
  const isDisabled = disabled ?? state === 'disabled';
  const showIcon = STATES_WITH_ICON.includes(state);
  const fill = state === 'uploading' ? Math.min(Math.max(progress, 0), 1) : 0;

  return (
    <button
      type={htmlType}
      className={`lds-btn lds-btn--secondary${className ? ` ${className}` : ''}`}
      data-state={state}
      data-variant={variant}
      data-preview-state={previewState === 'hovered' ? 'hovered' : undefined}
      disabled={isDisabled}
      aria-busy={state === 'uploading' || undefined}
      {...rest}
    >
      <span className="lds-btn__label">{children ?? DEFAULT_LABEL[state]}</span>
      {showIcon && <Icon name={icon} />}
      {state === 'uploading' && (
        <span
          className="lds-btn__filler"
          style={{ inlineSize: `calc(${fill * 100}% + 2px)` }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
