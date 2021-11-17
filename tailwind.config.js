module.exports = {
  purge: {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [/data-theme$/],
    },
  },
  darkMode: "media", // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["SegoeUI", "sans-serif"],
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        green: {
          50: "#DBFFDB",
          DEFAULT: "#66ce67",
          400: "#8BD18B",
          900: "#33AB34",
        },
        red: {
          DEFAULT: "#D82F28",
          900: "#D82F28",
        },
        purple: {
          50: "#D9BAFF",
          DEFAULT: "#883BE6",
          400: "#A76BF0",
          900: "#6927B9",
        },
        teal: {
          50: "#DEF7FF",
          DEFAULT: "#29B7E4",
          400: "#70CEEC",
          900: "#0883AA",
        },
        grey: {
          // DEFAULT: "#404450",
          DEFAULT: "#3E4051",
        },
        pink: {
          50: "#FFB0DB",
          DEFAULT: "#E83D99",
          400: "#F364B2",
          900: "#C52A7D",
        },
        type: {
          DEFAULT: "#E2EBF2",
          secondary: "#ADBECB",
          tertiary: "#767C87",
          quaternary: "#2D3845",
          dark: "#0E0E1D",
        },
      },
      screens: {
        lg: "1024px",
      },
      backgroundImage: (theme) => ({
        "box-grad-tl":
          "linear-gradient(73.14deg, #3D264C -35.57%, rgba(61, 38, 76, 0) 25.95%);",
        "box-grad-v":
          "linear-gradient(0deg, rgba(216, 185, 255, 0) 0%, rgba(216, 185, 255, 0.1) 100%);",
        "repo-grad-v":
          // "linear-gradient(180deg, rgba(153, 45, 129, 0.1) 0%, rgba(136, 59, 230, 0) 30%);",
          "linear-gradient(180deg, rgba(96,41,219, 0.1) 0em, rgba(96,41,219, 0) 15em);",
        "footer-grad":
          // "linear-gradient(36.49deg, #144763 -23.54%, rgba(61, 38, 76, 0) 29.37%), linear-gradient(36.49deg, #3D264C -23.54%, rgba(61, 38, 76, 0) 29.37%)",
          "linear-gradient(20deg, rgba(20,71,99,0.5) -25%, rgba(19, 24, 30, 0) 30%), linear-gradient(340deg, rgba(61,38,76,0.5) -25%, rgba(19, 24, 30, 0) 30%)",
      }),
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#33AB34",
          "primary-focus": "#66CE67",
          "primary-content": "#FFFFFF",
          secondary: "#883BE6",
          "secondary-focus": "#A76BF0",
          "secondary-content": "#FFFFFF",
          accent: "#C52A7D",
          "accent-focus": "#E83D99",
          "accent-content": "#FFFFFF",
          neutral: "#3d4451",
          "neutral-focus": "#2a2e37",
          "neutral-content": "#ffffff",
          "base-100": "#13181E",
          "base-200": "#1A2028",
          "base-300": "#28313C",
          "base-content": "#E2EBF2",
          info: "#2094f3",
          success: "#009485",
          warning: "#ff9900",
          error: "#E83D99",
          "--btn-text-case": "none" /* default text case for buttons */,
        },
      },
    ],
  },
};
