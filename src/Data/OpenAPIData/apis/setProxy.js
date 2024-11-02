// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // 클라이언트에서 요청할 경로
    createProxyMiddleware({
      target: 'https://apis.data.go.kr', // 공공 데이터 API의 base URL
      changeOrigin: true,
      pathRewrite: { '^/api': '' }, // '/api'를 제거하여 원본 경로를 사용
    }),
  );
};
