/*
 GG Mouse Pro — Shared Theme Controller
 The same theme stylesheet is used on every page. Dark and light
 states are switched through the gm-dark / gm-light classes.
*/

(function () {
    "use strict";

    var STORAGE_KEY = "ggmouse-theme";
    var LINK_ID = "ggmouse-theme-css";
    var BUTTON_ID = "ggmouse-theme-toggle";
    var META_ID = "ggmouse-theme-color";

    function getDarkCssPath() {
        var script = document.currentScript;
        if (script && script.dataset && script.dataset.darkCss) {
            return script.dataset.darkCss;
        }
        return "ggmouse-theme.css";
    }

    function ensureThemeCss() {
        if (document.getElementById(LINK_ID)) return;

        var existing = document.querySelector(
            'link[rel="stylesheet"][href*="ggmouse-theme.css"]'
        );

        if (existing) {
            existing.id = LINK_ID;
            return;
        }

        var link = document.createElement("link");
        link.id = LINK_ID;
        link.rel = "stylesheet";
        link.href = getDarkCssPath();
        document.head.appendChild(link);
    }

    function syncThemeState(dark) {
        var root = document.documentElement;
        var body = document.body;

        if (root) {
            root.setAttribute("data-theme", dark ? "dark" : "light");
            root.classList.toggle("gm-dark", dark);
            root.classList.toggle("gm-light", !dark);
        }

        if (body) {
            body.classList.toggle("gm-dark", dark);
            body.classList.toggle("gm-light", !dark);
        }
    }

    function updateButton() {
        var button = document.getElementById(BUTTON_ID);
        var dark = document.documentElement.getAttribute("data-theme") === "dark";

        var meta = document.getElementById(META_ID);
        if (!meta) {
            meta = document.createElement("meta");
            meta.id = META_ID;
            meta.name = "theme-color";
            document.head.appendChild(meta);
        }

        meta.content = dark ? "#080b10" : "#f7f8fb";

        if (!button) return;

        var icon = button.querySelector(".gm-theme-icon");

        if (icon) {
            icon.textContent = dark ? "☀" : "☾";
        } else {
            button.textContent = dark ? "☀" : "☾";
        }

        button.title = dark
            ? "Switch to light mode"
            : "Switch to dark mode";

        button.setAttribute(
            "aria-label",
            dark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        button.setAttribute(
            "aria-pressed",
            String(dark)
        );
    }

    function setTheme(theme) {
        var dark = theme === "dark";

        ensureThemeCss();
        syncThemeState(dark);

        try {
            localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
        } catch (e) {}

        updateButton();
    }

    function toggleTheme() {
        var current =
            document.documentElement.getAttribute("data-theme");

        setTheme(current === "dark" ? "light" : "dark");
    }

    window.ggMouseToggleTheme = toggleTheme;

    function initialise() {
        ensureThemeCss();

        var saved = null;

        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (e) {}

        /* Preserve the existing behaviour: dark is the default. */
        setTheme(saved === "light" ? "light" : "dark");

        var button =
            document.getElementById(BUTTON_ID);

        if (button) {
            button.addEventListener("click", toggleTheme);
        }

        updateButton();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialise);
    } else {
        initialise();
    }
})();

/* =========================================================
   GG MOUSE PRO HEADER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuButton =
        document.getElementById("gmMenuToggle");

    const mobileNav =
        document.getElementById("gmMobileNav");


    if (!menuButton || !mobileNav) {
        return;
    }


    menuButton.addEventListener("click", () => {

        const isOpen =
            mobileNav.classList.toggle("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation"
                : "Open navigation"
        );

    });


    /* Close menu after selecting a link */

    mobileNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener("click", () => {

                mobileNav.classList.remove(
                    "is-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

            });

        });

});