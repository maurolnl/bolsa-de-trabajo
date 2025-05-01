import { baseTheme } from '@/core/theme/base';
import useMediaQuery from '../useMediaQuery';

export const useResponsive = () => {
 const isMobile = useMediaQuery(`(max-width: ${baseTheme.breakpoints[0]})`);
 const isTablet = useMediaQuery(`(max-width: ${baseTheme.breakpoints[1]})`);
 const isDesktop = useMediaQuery(`(min-width: ${baseTheme.breakpoints[1]})`);

 return { isMobile, isTablet, isDesktop };
};
