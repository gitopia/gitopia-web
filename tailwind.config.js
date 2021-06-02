module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
      },
      screens: {
        lg: "1024px",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
