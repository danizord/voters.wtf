import { createMultiStyleConfigHelpers, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      // Hide scrollbar on the house selector
      ".react-horizontal-scrolling-menu--scroll-container::-webkit-scrollbar": {
        display: "none" /* chrome and chromium based */,
      },
      ".react-horizontal-scrolling-menu--scroll-container": {
        scrollbarWidth: "none" /* Firefox */,
      },
    },
  },
  colors: {
    purple: {
      100: "#d1adee",
      200: "#d1adee",
      300: "#d1adee",
      400: "#d1adee",
      500: "#8a2be2",
      600: "#8a2be2",
      700: "#8a2be2",
      800: "#8a2be2",
      900: "#8a2be2",
    },
    pink: {
      100: "#e02ecf",
      200: "#e02ecf",
      300: "#e02ecf",
      400: "#e02ecf",
      500: "#e02ecf",
      600: "#e02ecf",
      700: "#e02ecf",
      800: "#e02ecf",
      900: "#e02ecf",
    },
  },
  semanticTokens: {
    colors: {
      text: {
        default: "#16161D",
        _dark: "#ade3b8",
      },
      "chakra-body-bg": { _light: "gray.50", _dark: "gray.900" },
    },
    radii: {
      button: "12px",
    },
  },
  components: {
    Tabs: {
      variants: {
        enclosed: createMultiStyleConfigHelpers(["tab"]).definePartsStyle((props) => ({
          tab: {
            _selected: { borderBottomColor: mode(`gray.50`, `gray.900`)(props) },
          },
        })),
        // "solid-rounded": createMultiStyleConfigHelpers(["tab"]).definePartsStyle((props) => ({
        //   tab: {
        //     _selected: { color: "white" },
        //   },
        // })),
      },
    },
    // Button: {
    //   variants: {
    //     solid: {
    //       color: "white",
    //     },
    //   },
    // },
  },
});

export default theme;
