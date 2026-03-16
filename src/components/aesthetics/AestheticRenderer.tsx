'use client';

import React from "react";
import { aestheticMap } from "../../aesthetics";
import { ThemeProvider } from "@mui/material/styles";

interface AestheticRendererProps {
  aesthetic: keyof typeof aestheticMap;
  children: React.ReactNode;
}

export default function AestheticRenderer({ aesthetic, children }: AestheticRendererProps) {
  const ThemeConfig = aestheticMap[aesthetic] || aestheticMap["noir"];
  const ThemeComponent = ThemeConfig.ProfileLayout || (({ children }: any) => <>{children}</>);
  
  return (
    <ThemeProvider theme={ThemeConfig.theme}>
       <ThemeComponent>{children}</ThemeComponent>
    </ThemeProvider>
  );
}