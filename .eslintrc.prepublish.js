module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['n8n-nodes-base', '@typescript-eslint'],
	extends: ['plugin:n8n-nodes-base/nodes'],
	rules: {
		// Stricter rules for publishing
		'no-console': 'error',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
	},
};

