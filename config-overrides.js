module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "os": require.resolve("os-browserify/browser"),
    "path": require.resolve("path-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util"),
    "buffer": require.resolve("buffer"),
    "webworker-threads": false
  };

  // Add a plugin to ignore optional dependencies of natural
  config.ignoreWarnings = [
    {
      module: /natural\/lib\/natural\/classifiers\/classifier_train_parallel/,
    }
  ];

  return config;
}; 