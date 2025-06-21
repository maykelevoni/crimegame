import { useState, useEffect } from "react";

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLandscape: false,
    isPortrait: false,
    screenWidth: 0,
    screenHeight: 0,
    breakpoint: "md",
  });

  useEffect(() => {
    const updateResponsive = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Breakpoints baseados no Tailwind CSS
      const breakpoint =
        width < 640
          ? "xs"
          : width < 768
          ? "sm"
          : width < 1024
          ? "md"
          : width < 1280
          ? "lg"
          : width < 1536
          ? "xl"
          : "2xl";

      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isLandscape: width > height,
        isPortrait: height > width,
        screenWidth: width,
        screenHeight: height,
        breakpoint,
      });
    };

    // Atualizar imediatamente
    updateResponsive();

    // Adicionar listener para mudanças de tamanho
    window.addEventListener("resize", updateResponsive);
    window.addEventListener("orientationchange", updateResponsive);

    return () => {
      window.removeEventListener("resize", updateResponsive);
      window.removeEventListener("orientationchange", updateResponsive);
    };
  }, []);

  return state;
};

// Hook específico para mobile
export const useMobile = (): boolean => {
  const { isMobile } = useResponsive();
  return isMobile;
};

// Hook para detectar orientação
export const useOrientation = () => {
  const { isLandscape, isPortrait } = useResponsive();
  return { isLandscape, isPortrait };
};
