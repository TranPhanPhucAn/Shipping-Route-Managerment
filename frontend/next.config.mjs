import withAntdLess from "next-plugin-antd-less";
import { fileURLToPath } from "url";
import path from "path";

// Tính toán __dirname tương đương với import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default withAntdLess({
  lessVarsFilePath: "./src/styles/variables.less",
  lessVarsFilePathAppendToEndOfContent: false,
  cssLoaderOptions: {},

  // Các tùy chọn cấu hình của Next.js
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },

  future: {
    webpack5: true, // Sử dụng Webpack 5 nếu cần
  },
});
