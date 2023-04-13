import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  useSystemColorMode: true,
  initialColorMode: "dark",
} satisfies ThemeConfig);

export default theme;
