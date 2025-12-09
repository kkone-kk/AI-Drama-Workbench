<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/13GPguDX1CIXfCbsnWDKRXClJGiJWsqoM

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
部署vercel、Vercel- Netlify – EdgeOne这三个平台需要指明React入口代码
要对index.html进行改造
</script>
</head>
  <body class="bg-slate-50 text-slate-900">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>#增加这行指明React入口代码#<script type="module" src="/index.tsx"></script>#
  </body>
</html>



   
由于这是一个运行在浏览器端的 React 项目，Vercel 部署时通常会使用 Vite 或 Create React App 等构建工具。出于安全考虑，这些工具通常不会自动将所有的环境变量注入到前端代码中（通常只注入以 VITE_ 或 REACT_APP_ 开头的变量）。
为了确保 process.env.API_KEY 在部署后能被代码读取，您有两种常见的解决方式：
方案 A：在构建配置中暴露变量（推荐，无需改代码）
如果您使用 Vite，请在项目根目录的 vite.config.ts 中添加 define 配置，将 Vercel 的环境变量传递给前端：
code
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    // 显式定义 process.env.API_KEY
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  }
})



方案 B：修改代码（标准做法）
将 Vercel 上的变量名改为 VITE_API_KEY，并将代码中的 process.env.API_KEY 修改为 import.meta.env.VITE_API_KEY。
