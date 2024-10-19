import { resolve as _resolve, join } from 'path';

export const entry = './src/index.js';
export const output = {
    filename: 'bundle.js', // 번들 파일 이름
    path: _resolve(__dirname, 'dist'), // 번들이 저장될 디렉토리
};
export const module = {
    rules: [
        {
            test: /\.(js|jsx)$/, // .js와 .jsx 파일을 처리
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader', // Babel을 사용하여 ES6+와 JSX를 변환
            },
        },
        {
            test: /\.css$/, // CSS 파일을 처리
            use: ['style-loader', 'css-loader', 'sass-loader'], // CSS를 JS로 불러와 HTML에 주입
        },
        {
            test: /\.(png|jpg|gif|svg)$/, // 이미지 파일을 처리
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]', // 파일 이름 유지
                        outputPath: 'images/', // 이미지를 저장할 경로
                    },
                },
            ],
        },
    ],
};
export const resolve = {
    extensions: ['.js', '.jsx'], // .js와 .jsx 파일을 자동 인식
    fallback: {
        net: false, // 'net' 모듈을 브라우저에서 무시
        tls: false, // 'tls' 모듈을 무시
        fs: false, // 'fs' 모듈을 무시
    },
};
export const devServer = {
    static: {
        directory: join(__dirname, 'dist'), // 정적 파일을 제공할 디렉토리
    },
    compress: true,
    port: 3000, // 개발 서버 포트 설정
    historyApiFallback: true, // React Router를 사용할 경우 필요
};
