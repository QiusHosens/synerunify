module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'import',
    'jsx-a11y',
    'react-hooks',
  ],
  rules: {
    // 自定义规则
    'react/prop-types': 'off', // TypeScript 已提供类型检查，关闭 prop-types
    'react/react-in-jsx-scope': 'off', // React 17+ 无需显式导入 React
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 允许不显式声明返回值类型
    'import/prefer-default-export': 'off', // 允许非默认导出
    'no-console': ['warn', { allow: ['error'] }], // 允许 console.error，警告其他 console
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }], // 只允许 .tsx 文件使用 JSX
    'import/extensions': 'off', // 允许不写文件扩展名
    '@typescript-eslint/no-explicit-any': 'off', // 允许any类型
    '@typescript-eslint/no-unused-vars': 'off', // 允许未使用
  },
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
    'import/resolver': {
      typescript: {}, // 支持 TypeScript 的路径解析（别名 @）
    },
  },
};