module.exports = {
  '**/**.ts': () => [
    "npm run lint:fix",
    "npm run check-types",
    "npm run build",
  ]
}