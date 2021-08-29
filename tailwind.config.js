module.exports = {
  mode: 'jit',
  purge: ['./app/**/*.tsx', './app/**/*.jsx', './app/**/*.js', './app/**/*.ts'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backgroundSize: {
        'button-gradient': '200% auto',
        'nav-link': '0% 3px',
        'nav-link-hover': '100% 3px',
      },
      transitionProperty: {
        background: 'background-size',
      },
      boxShadow: {
        card: '0 -2px 10px rgba(0, 0, 0, 1)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
