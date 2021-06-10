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
          50: "#DBFFDB",
          DEFAULT: "#883BE6",
          400: "#b78af0",
          900: "#5a3b82",
        },
        grey: {
          DEFAULT: "#404450",
        },
      },
      screens: {
        lg: "1024px",
      },
      backgroundImage: (theme) => ({
        "box-grad-tl":
          "linear-gradient(73.14deg, #3D264C -35.57%, rgba(61, 38, 76, 0) 25.95%);",
        "box-grad-v":
          "linear-gradient(180deg, rgba(216, 185, 255, 0) 0%, rgba(216, 185, 255, 0.1) 100%);",
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
          "primary-content": "#ffffff",
          secondary: "#883BE6",
          "secondary-focus": "#A76BF0",
          "secondary-content": "#ffffff",
          accent: "#37cdbe",
          "accent-focus": "#2aa79b",
          "accent-content": "#ffffff",
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
        },
      },
    ],
  },
};
