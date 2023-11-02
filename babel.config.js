module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.ios.ts', '.android.ts', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
          }
        }
      ]
    ],
  };
};
