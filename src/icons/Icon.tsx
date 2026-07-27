import type { SVGProps } from 'react';
import { icons, type IconName } from './icons.generated';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> {
  /** Figma icon section（node 1804:12591）中的圖示名稱 */
  name: IconName;
  /**
   * 顯示尺寸（px）。未指定時採用 Figma 中的原生尺寸：
   * 24 系列為 24、16 系列為 16。描邊寬度會隨之等比縮放。
   */
  size?: number;
  /**
   * 旋轉角度。Figma 只提供朝下的 chevron，
   * 其餘方向沿用設計稿做法，以旋轉取得。
   */
  rotate?: 0 | 90 | 180 | 270;
  /**
   * 圖示的替代文字。
   * 有語意的圖示（例如單獨的圖示按鈕）必須提供；
   * 純裝飾用途請留空，元件會自動加上 aria-hidden。
   */
  label?: string;
}

/**
 * 設計系統圖示。
 *
 * 幾何完全來自 Figma 匯出的向量，顏色以 currentColor 繼承，
 * 因此在任何元件中都會自動跟隨文字色 token。
 */
export function Icon({ name, size, rotate = 0, label, style, ...rest }: IconProps) {
  const def = icons[name];
  const px = size ?? def.size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={def.viewBox}
      width={px}
      height={px}
      fill={def.mode === 'fill' ? 'currentColor' : 'none'}
      stroke={def.mode === 'fill' ? 'none' : 'currentColor'}
      strokeWidth={def.mode === 'fill' ? undefined : def.strokeWidth}
      strokeLinecap={def.mode === 'fill' ? undefined : 'round'}
      strokeLinejoin={def.mode === 'fill' ? undefined : 'round'}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      style={rotate ? { ...style, transform: `rotate(${rotate}deg)` } : style}
      // 內容由 scripts/build-icons.mjs 於建置時產生，非執行期輸入
      dangerouslySetInnerHTML={{ __html: def.body }}
      {...rest}
    />
  );
}

export { icons, iconNames, type IconName } from './icons.generated';
