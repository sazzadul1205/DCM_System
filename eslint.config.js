import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";

export default [
    {
        ignores: [
            "node_modules/**",
            "public/build/**",
            "vendor/**",
            "storage/**",
            "bootstrap/cache/**",
        ],
    },
    {
        files: ["resources/js/**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                route: "readonly",
            },
        },
        settings: {
            react: { version: "detect" },
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooks,
            "unused-imports": unusedImports,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            // practical warnings
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "warn",

            // React modern setup
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/prop-types": "off",

            // react security
            "react/no-unescaped-entities": ["warn", { forbid: [">", '"'] }],

            // clean unused stuff
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
];
