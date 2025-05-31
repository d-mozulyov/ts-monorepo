import eslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        // Global ignores
        ignores: ['dist/**', 'node_modules/**'],
    },
    {
        // TypeScript files configuration
        files: ['src/**/*.ts', '__tests__/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': eslint,
        },
        rules: {
            // TypeScript specific rules
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

            // ECMAScript rules
            'no-unused-vars': 'off', // Turned off in favor of TypeScript's version
            'no-undef': 'off', // TypeScript handles this

            // Strict mode
            'strict': ['error', 'never'], // Not needed in ESM

            // Import/Export rules
            'no-duplicate-imports': 'error',
        },
    },
];