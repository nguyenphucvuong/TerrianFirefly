module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Các plugin khác bạn sử dụng
      'react-native-reanimated/plugin', // ví dụ cho plugin reanimated
  ],
  };
};
