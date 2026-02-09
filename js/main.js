import { initTheme } from './modules/theme.js';
import { initScrollEffect } from './modules/scroll.js';
import { initAuth } from './modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollEffect();
    initAuth();
});
