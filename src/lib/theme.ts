// Preferencia de tema del visitante. Sin valor guardado, el sitio sigue al sistema
// (prefers-color-scheme); con valor, se fuerza con data-theme en <html> (ver globals.css).
export const THEME_STORAGE_KEY = "rc-theme";

// Se ejecuta en <head> antes de pintar la página para evitar el parpadeo de tema.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
