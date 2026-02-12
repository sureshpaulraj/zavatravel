import { createLightTheme, type BrandVariants } from '@fluentui/react-components'

const zavaBrand: BrandVariants = {
  10: '#061D25',
  20: '#0A2F3D',
  30: '#0D4155',
  40: '#10536D',
  50: '#136585',
  60: '#16779D',
  70: '#0891B2', // Primary teal
  80: '#22A3C4',
  90: '#3DB5D4',
  100: '#58C7E4',
  110: '#73D9F4',
  120: '#8EE5F8',
  130: '#A9F0FC',
  140: '#C4F5FE',
  150: '#DFFAFF',
  160: '#F0FDFF',
}

export const zavaTheme = {
  ...createLightTheme(zavaBrand),
  colorBrandBackground: '#0891B2',
  colorBrandBackgroundHover: '#0E7490',
  colorBrandBackgroundPressed: '#155E75',
  colorNeutralBackground1: '#FFF7ED',
  colorNeutralForeground1: '#1E3A5F',
}
