/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 */

import 'zone.js';  // Included with Angular CLI.

(window as any).global = window;
(window as any).process = {
    env: { DEBUG: undefined },
    browser: true
};
