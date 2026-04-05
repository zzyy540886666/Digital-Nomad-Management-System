# 数字游民旅居生态平台

河源市东源县数字游民旅居生态社区建设项目 - 完整的全栈解决方案

## 项目结构

```
Digital-Nomad-Management-System-cn/
├── miniprogram/                          # 微信小程序端（用户端）
├── Digital-Nomad-Management-System-UI/   # Web管理后台（运营端）
├── Digital-Nomad-Management-System-server/  # 后端服务
└── docs/                                 # 文档
```

## 技术栈

- **小程序端**: 微信小程序原生框架
- **Web管理后台**: Vue 3 + Element Plus + Vite
- **后端服务**: Node.js + Express
- **数据库**: MariaDB 10.11.7

## 快速开始

### 后端服务

```bash
cd Digital-Nomad-Management-System-server
npm install
npm run dev
```

### Web管理后台

```bash
cd Digital-Nomad-Management-System-UI
npm install
npm run dev
```

## 部署

### Railway 部署

1. 连接 GitHub 仓库到 Railway
2. 选择 `Digital-Nomad-Management-System-server` 目录
3. 配置环境变量
4. 自动部署

## 环境变量

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
```

## License

MIT
