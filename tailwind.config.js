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
          900: "#3A9F3B",
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
  plugins: [],
};
