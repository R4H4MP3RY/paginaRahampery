import { createCn } from "cn/config"

// cn con los tokens de marca registrados: sin esto, "text-rc-sm text-rc-text" se
// interpretaría como dos colores y se perdería el tamaño.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["rc-xs", "rc-sm", "rc-md", "rc-lg", "rc-xl", "rc-2xl", "rc-3xl"] }],
      rounded: [{ rounded: ["card", "cta"] }],
      shadow: [{ shadow: ["rc-1", "rc-2"] }],
    },
  },
})
