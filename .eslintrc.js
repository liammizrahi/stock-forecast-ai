module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier', 'node'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier', // Use this instead of 'plugin:prettier/recommended'
        'plugin:node/recommended',
    ],
    rules: {
        // Add or modify rules as needed
    },
};
