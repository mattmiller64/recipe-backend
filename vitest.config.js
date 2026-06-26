module.exports = {
  test: {
    globals: true,
  },
  coverage: {
    provider: "v8",
    reporter: ["text", "html"],
    reportsDirectory: "coverage",
  },
};
