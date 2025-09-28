import { addDynamicIconSelectors } from "@iconify/tailwind";

export default {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {},
  },
  plugins: [addDynamicIconSelectors()],
};