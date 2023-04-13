import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  useSystemColorMode: true,
  initialColorMode: "system",
} satisfies ThemeConfig);

export default theme;
