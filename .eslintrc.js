// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
  ],
  globals: {
    globalThis: false, // false means not writable
  },
  plugins: ['ban', 'etc', 'unused-imports'],
  reportUnusedDisableDirectives: true,
  rules: {
    'arrow-body-style': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'ban/ban': [
      'error',
      {
        name: ['*', 'forEach'],
        message: 'Use a for-of loop instead',
      },
      {
        name: ['describe', 'only'],
        message: "Don't forget to remove .only before committing",
      },
      {
        name: ['it', 'only'],
        message: "Don't forget to remove .only before committing",
      },
      {
        name: ['test', 'only'],
        message: "Don't forget to remove .only before committing",
      },
      {
        name: ['jest', 'fn'],
        message: 'Use sinon.spy(() => undefined) instead',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            importNames: ['isArray'],
            message: 'Use Array.isArray instead.',
          },
        ],
      },
    ],
    'callback-return': 'error',
    complexity: 'off',
    'constructor-super': 'error',
    curly: 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    'eol-last': 'error',
    'guard-for-in': 'error',
    'linebreak-style': 'off',
    'max-classes-per-file': 'off',
    'new-parens': 'error',
    'newline-per-chained-call': 'off',
    'no-bitwise': 'off',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'off',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'no-empty': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-eval': 'error',
    'no-extra-bind': 'error',
    'no-extra-semi': 'off',
    'no-fallthrough': 'off',
    'no-floating-decimal': 'error',
    'no-inner-declarations': 'off',
    'no-invalid-this': 'off',
    'no-irregular-whitespace': 'error',
    'no-lonely-if': 'error',
    'no-magic-numbers': 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-new-wrappers': 'error',
    'no-redeclare': 'off',
    'no-sparse-arrays': 'error',
    'no-sync': ['error', { allowAtRootLevel: true }],
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],
    'no-unsafe-finally': 'error',
    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'off', // Crashes
    'no-var': 'error',
    'no-void': 'error',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'prefer-const': ['error', { destructuring: 'all' }],
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'off',
    quotes: ['error', 'single', { avoidEscape: true }], // So that automatic fixes use the right quote style
    radix: 'error',
    'require-await': 'error',
    'spaced-comment': ['error', 'always', { line: { markers: ['/'] } }], // Don't error on TypeScript triple-slash comments
    'sort-imports': 'off', // Conflicts with TypeScript and is not fully auto-fixable.
    'use-isnan': 'error',
    'valid-typeof': 'off',
    yoda: 'error',

    // Imports
    'import/extensions': ['error', 'never'],
    'import/no-deprecated': 'warn',
    'import/no-unused-modules': 'error',
    'import/no-cycle': 'off', // Too slow
    'import/no-self-import': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-duplicates': 'error',
    'import/no-default-export': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    'etc/throw-error': 'error',
    'etc/no-deprecated': 'warn',

    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-regexp-exec': 'off',
    // These are error by default for JS too
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    // Turned off this rule since it was throwing
    // TypeError: Cannot read property 'kind' of undefined
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-namespace': 'off',

    'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true, kebabCase: true } }],
    'unicorn/no-process-exit': 'off',
    'unicorn/no-null': 'off', // DOM API often works with null
    'unicorn/no-fn-reference-in-iterator': 'off', // we use filter(isDefined) a lot
    'unicorn/no-reduce': 'off',
    'unicorn/no-useless-undefined': 'off', // conflicts with TypeScript
    'unicorn/prefer-number-properties': 'off',
    'unicorn/custom-error-definition': 'off', // false positives: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/753
    'unicorn/no-nested-ternary': 'off', // if-elseif-else ternaries are commonly needed in JSX and formatted well by Prettier
    'id-length': [
      'error',
      {
        min: 3,
        properties: 'never',
        exceptions: [
          // valid
          'to',
          'as',
          'id',
          'it', // BDD testing
          // NodeJS standard library
          'fs',
          'os',
          // conventionally used for import * as H from 'history' to not conflict with the global history
          'H',
          // allow `distinctUntilChanged((a, b) => isEqual(a, b))`,
          // which is extremely common and necessary to maintain type safety.
          'a',
          'b',
        ],
      },
    ],
    'unicorn/prevent-abbreviations': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'off',
    // New rules added to unicorn
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/number-literal-case': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-switch': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/template-indent': 'off',
    'unicorn/prefer-export-from': 'off',
    'unicorn/explicit-length-check': 'off',
    'unicorn/prefer-date-now': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/prefer-dom-node-text-content': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/no-new-array': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/prefer-dom-node-dataset': 'off',
    'unicorn/no-useless-spread': 'off',
    'unicorn/no-lonely-if': 'off',
    'unicorn/prefer-array-some': 'off',
    'unicorn/prefer-native-coercion-functions': 'off',
    'unicorn/relative-url-style': 'off',
    'unicorn/prefer-array-flat-map': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-useless-promise-resolve-reject': 'off',
    'unicorn/no-array-method-this-argument': 'off',
    'unicorn/no-array-for-each': 'off',
    'no-unsafe-optional-chaining': 'off',
    'unicorn/import-style': 'off',
    'unicorn/no-array-push-push': 'off',
    'unicorn/no-useless-switch-case': 'off',
    'unicorn/prefer-regexp-test': 'off',
    'unicorn/no-object-as-default-parameter': 'off',
    'unicorn/prefer-code-point': 'off',
    'unicorn/prefer-object-from-entries': 'off',
    'unicorn/prefer-math-trunc': 'off',
    'unicorn/text-encoding-identifier-case': 'off',
    'unicorn/no-unreadable-iife': 'off',
    'unicorn/error-message': 'off',
    'unicorn/no-thenable': 'off',
    'unicorn/prefer-array-index-of': 'off',

    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    // End

    // Previous Rules that has been causing errors after upgrading
    'unicorn/consistent-function-scoping': 'off',
    // End
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              // We have custom helpers to deal with checking properties of the `object` type.
              object: false,
              // The empty interface {} is often used for React components that accept no props,
              // which is a lot easier to understand than accepting `object` or `Record<never, never>`
              // and has no real disadvantages.
              '{}': false,
            },
          },
        ],
        '@typescript-eslint/naming-convention': [
          'off',
          {
            // Properties and destructured variables often can't be controlled by us if the API is external.
            // Event logging, `__typename` etc. don't follow conventions enforceable here.
            // We also need to allow implementing external interface methods, e.g. UNSAFE_componentWillReceiveProps().
            selector: 'default',
            format: null,
          },
          {
            // Helps e.g. Go engineers who are used to lowercase unexported types.
            selector: 'typeLike',
            format: ['PascalCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          { allowExpressions: true, allowTypedFunctionExpressions: true, allowHigherOrderFunctions: true },
        ],
        '@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'no-public' } }],
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-extraneous-class': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-misused-promises': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/no-unnecessary-condition': 'off', // False positives, re-enable when fixed
        '@typescript-eslint/consistent-type-assertions': [
          'warn',
          { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-base-to-string': 'error',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unnecessary-qualifier': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
        // Switch to error when all cases are fixed
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        // Turned off this rule since it was throwing
        // TypeError: Cannot read property 'kind' of undefined
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            varsIgnorePattern: '.*', // TS already enforces this
            args: 'after-used',
            ignoreRestSiblings: true,
          },
        ],
        // no-use-before-define goes against the top-to-bottom rule and TypeScript protects against most temporal dead-zone bugs.
        // https://dzone.com/articles/the-stepdown-rule
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
        'unicorn/no-for-loop': 'off',
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-starts-ends-with': 'off',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-includes': 'error',
        'unicorn/prefer-includes': 'off',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'off', // https://github.com/typescript-eslint/typescript-eslint/issues/1265
        '@typescript-eslint/type-annotation-spacing': 'off',
        '@typescript-eslint/triple-slash-reference': 'error',
        // This rule was causing error so turned it off
        // '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true, allowBoolean: true }],
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/return-await': 'error',
        '@typescript-eslint/unbound-method': 'error',
        '@typescript-eslint/unified-signatures': 'error',

        'import/no-unresolved': 'off',
        'import/default': 'off',
        'import/named': 'off',
        'import/namespace': 'off',
        'import/no-deprecated': 'off',

        'no-undef': 'off',
        'no-dupe-class-members': 'off',
        'require-await': 'off',
      },
    },
    {
      files: '*.d.ts',
      rules: {
        'no-var': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        'id-length': 'off',
        'import/no-default-export': 'off',
      },
    },
    {
      files: '*.@(test|story).ts?(x)',
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        'unicorn/consistent-function-scoping': 'off',
      },
    },
    {
      files: '*.test.tsx',
      rules: {
        // False positive on react-test-renderer act()
        '@typescript-eslint/no-floating-promises': 'off',
        // False positive https://github.com/sindresorhus/eslint-plugin-unicorn/issues/751
        'unicorn/prefer-flat-map': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
}
