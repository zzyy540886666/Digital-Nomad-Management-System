# 数字游民旅居生态平台 - 快速上手指南

## 项目概述

数字游民旅居生态平台是一个为数字游民和旅居人群提供一站式服务的平台，包括：
- 微信小程序端
- Web管理后台 (Vue3 + Element Plus)
- Node.js后端服务 (Express)
- MySQL数据库

## 目录结构

```
数字游民旅居生态小程序 - cn/
├── miniprogram/                              # 微信小程序
│   ├── pages/                                # 页面
│   ├── components/                           # 组件
│   ├── api/                                  # API封装
│   └── assets/                               # 静态资源
├── admin/                                    # Web管理后台
│   └── src/
│       ├── views/                            # 页面视图
│       ├── layouts/                          # 布局组件
│       ├── router/                           # 路由配置
│       ├── stores/                           # 状态管理
│       └── config/                           # 配置文件
├── Digital-Nomad-Management-System-UI/       # 备用UI项目
├── Digital-Nomad-Management-System-server/   # 后端服务
│   ├── src/
│   │   ├── controllers/                      # 控制器
│   │   ├── routes/                           # 路由
│   │   ├── models/                           # 数据模型
│   │   ├── middleware/                       # 中间件
│   │   ├── db/                               # 数据库连接
│   │   └── database/data/                    # 数据库脚本
│   └── .env                                  # 环境变量
├── scripts/                                  # 启动脚本
│   ├── dev-db.ps1                            # 数据库初始化
│   ├── dev-backend.ps1                       # 启动后端服务
│   ├── dev-frontend.ps1                      # 启动前端
│   └── start-all.ps1                         # 一键启动所有服务
└── docs/                                     # 文档
```

## 环境要求

| 软件 | 版本要求 |
|------|----------|
| Node.js | >= 18.0 |
| MySQL / MariaDB | >= 5.7 或 MariaDB >= 10.3 |
| PowerShell | >= 5.0 (Windows) |
| 微信开发者工具 | 最新版 (小程序开发) |

> **注意**: 项目已在 `.runtime` 目录下内嵌了 MariaDB 10.11.7，无需单独安装 MySQL。脚本会自动检测并使用内嵌的数据库。

## 快速开始

### 方式一：一键启动 (Windows)

```powershell
# 在项目根目录执行
.\scripts\start-all.ps1
```

这将在独立的PowerShell窗口中启动：
1. 数据库初始化
2. 后端API服务 (端口 8080)
3. Web管理前端 (端口 3000)

### 方式二：分步启动

#### 1. 初始化数据库

```powershell
# 使用默认配置 (localhost:3306, root/root)
# 脚本会自动从 .env 文件读取数据库密码
.\scripts\dev-db.ps1

# 或自定义数据库配置 (注意: 环境变量 DN_PSWD 会覆盖 .env 中的配置)
$env:DN_HOST = "your_host"
$env:DN_PORT = "3306"
$env:DN_USER = "your_user"
$env:DN_PSWD = "your_password"  # 设置此变量会覆盖 .env 中的 DB_PASSWORD
$env:DN_DB = "digital_nomad"
.\scripts\dev-db.ps1
```

> **提示**: 脚本会自动启动内嵌的 MariaDB 服务，无需手动启动数据库。

或手动执行SQL：
```bash
mysql -u root -p < Digital-Nomad-Management-System-server/src/database/data/init.sql
```

#### 2. 启动后端服务

```powershell
.\scripts\dev-backend.ps1
```

后端服务将运行在 http://localhost:8080

#### 3. 启动管理后台

```powershell
.\scripts\dev-frontend.ps1
```

管理后台将运行在 http://localhost:3000

### 方式三：手动启动

```bash
# 1. 初始化数据库
mysql -u root -p < Digital-Nomad-Management-System-server/src/database/data/init.sql

# 2. 启动后端
cd Digital-Nomad-Management-System-server
npm install
npm run dev

# 3. 启动前端 (新终端)
cd admin
npm install
npm run dev
```

## 环境变量配置

### 后端服务环境变量

编辑 `Digital-Nomad-Management-System-server/.env`：

```env
# 服务配置
PORT=8080

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=digital_nomad

# 安全配置
JWT_SECRET=your_jwt_secret_key

# 微信小程序配置
WX_APPID=your_wx_appid
WX_SECRET=your_wx_secret
```

### 环境变量说明

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| PORT | 8080 | 后端服务端口 |
| DB_HOST | localhost | 数据库主机 |
| DB_PORT | 3306 | 数据库端口 |
| DB_USER | root | 数据库用户名 |
| DB_PASSWORD | root | 数据库密码 |
| DB_NAME | digital_nomad | 数据库名称 |
| JWT_SECRET | - | JWT密钥 |
| WX_APPID | - | 微信小程序 AppID |
| WX_SECRET | - | 微信小程序 Secret |

> **注意**: 启动脚本 `dev-db.ps1` 会从 `.env` 文件读取 `DB_PASSWORD` 配置。如果设置了环境变量 `DN_PSWD`，则会覆盖 `.env` 中的配置。

### 前端配置

编辑 `admin/src/config/index.ts`：
```typescript
export const config = {
  baseUrl: 'http://127.0.0.1:8080',  // 后端API地址
  apiPrefix: '/api',
  adminPrefix: '/admin',
  timeout: 30000,
  tokenKey: 'admin_token',
  userKey: 'admin_user'
}
```

## 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 管理后台 | http://localhost:3000 | 管理员登录界面 |
| 后端API | http://localhost:8080 | RESTful API |
| 健康检查 | http://localhost:8080/health | 服务状态检查 |
| API文档 | http://localhost:8080/api-docs | Swagger文档 (如已配置) |

## 默认账号

### 管理后台
- 用户名: `admin`
- 密码: `admin123`

### 数据库管理员
- 用户名: `root`
- 密码: 根据你的MySQL配置

## 小程序开发

### 1. 导入项目

1. 打开微信开发者工具
2. 选择「导入项目」
3. 选择 `miniprogram` 目录
4. 填入你的 AppID

### 2. 配置API地址

编辑 `miniprogram/api/index.js`：
```javascript
const BASE_URL = 'http://your-server-ip:8080'
```

### 3. 项目配置

编辑 `miniprogram/project.config.json`：
```json
{
  "appid": "your_appid_here",
  "projectname": "digital-nomad-miniprogram"
}
```

## 生产部署

### 后端部署

```bash
cd Digital-Nomad-Management-System-server
npm install --production

# 使用PM2管理进程
npm install -g pm2
pm2 start src/index.js --name digital-nomad-api
pm2 save
pm2 startup
```

### 前端部署

```bash
cd admin
npm install
npm run build
```

将 `dist` 目录部署到 Nginx 或其他静态服务器。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/digital-nomad/admin/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /admin {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker 部署 (可选)

创建 `docker-compose.yml`：
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: digital_nomad
    volumes:
      - ./Digital-Nomad-Management-System-server/src/database/data/init.sql:/docker-entrypoint-initdb.d/init.sql
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./Digital-Nomad-Management-System-server
    environment:
      DN_HOST: mysql
      DN_PORT: 3306
      DN_USER: root
      DN_PSWD: root
      DN_DB: digital_nomad
    ports:
      - "8080:8080"
    depends_on:
      - mysql

  frontend:
    image: nginx:alpine
    volumes:
      - ./admin/dist:/usr/share/nginx/html
    ports:
      - "80:80"

volumes:
  mysql_data:
```

## 常见问题

### 1. 数据库连接失败

**症状**: `数据库连接失败！！！！`

**解决方案**:
1. 确认 MySQL 服务已启动
2. 检查用户名密码是否正确
3. 确认数据库 `digital_nomad` 已创建
4. 检查防火墙是否开放3306端口

```powershell
# 测试数据库连接
mysql -h 127.0.0.1 -u root -p
```

### 2. 端口被占用

**症状**: `Error: listen EADDRINUSE: address already in use :::8080`

**解决方案**:
```powershell
# 查看端口占用
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# 结束占用进程
taskkill /PID <进程ID> /F
```

### 3. 依赖安装失败

**解决方案**:
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 4. 脚本执行权限问题

**症状**: `无法加载文件，因为在此系统上禁止运行脚本`

**解决方案**:
```powershell
# 临时允许脚本执行
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 或在执行时添加 -ExecutionPolicy Bypass
powershell -ExecutionPolicy Bypass -File .\scripts\start-all.ps1
```

### 5. MySQL客户端未找到

**症状**: `mysql : 无法将"mysql"项识别为 cmdlet`

**解决方案**:
1. 项目已内嵌 MariaDB，脚本会自动使用 `.runtime/mariadb-10.11.7-winx64/bin/mysql.exe`
2. 如需手动执行 SQL，可使用完整路径:
```powershell
& ".\.runtime\mariadb-10.11.7-winx64\bin\mysql.exe" -u root -proot < init.sql
```

### 6. 数据库密码错误

**症状**: `Access denied for user 'root'@'127.0.0.1'`

**解决方案**:
1. 检查 `.env` 文件中的 `DB_PASSWORD` 配置是否正确
2. 如需重置密码，运行密码重置脚本:
```powershell
.\scripts\reset-db-password.ps1
```
3. 确保没有设置环境变量 `DN_PSWD`（它会覆盖 `.env` 中的配置）:
```powershell
# 清除环境变量
$env:DN_PSWD = $null
.\scripts\dev-db.ps1
```

### 7. MariaDB 服务启动失败

**症状**: `Failed to start MariaDB server after 30 seconds`

**解决方案**:
1. 检查端口 3306 是否被占用:
```powershell
netstat -ano | findstr :3306
```
2. 结束占用进程或修改 `.runtime/mariadb-3306.ini` 中的端口配置
3. 查看错误日志:
```powershell
Get-Content .runtime\mariadb-3306.err.log -Tail 30
```

## API接口说明

### 用户认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息

### 产品包
- `GET /api/packages` - 获取产品包列表
- `GET /api/packages/:id` - 获取产品包详情
- `POST /api/packages/:id/lead` - 提交意向

### 活动
- `GET /api/events` - 获取活动列表
- `GET /api/events/:id` - 获取活动详情
- `POST /api/events/:id/signup` - 活动报名

### 技能交换
- `GET /api/posts` - 获取帖子列表
- `POST /api/posts` - 发布帖子
- `POST /api/posts/:id/match` - 发起对接

### 管理后台
- `POST /admin/auth/login` - 管理员登录
- `GET /admin/dashboard` - 仪表盘数据
- `GET /admin/packages` - 产品包管理
- `GET /admin/events` - 活动管理
- `GET /admin/leads` - 线索管理

## 技术栈

| 层级 | 技术 |
|------|------|
| 小程序 | 微信小程序原生框架 |
| 前端 | Vue 3 + Element Plus + Vite + TypeScript |
| 后端 | Node.js + Express |
| 数据库 | MySQL / MariaDB |
| 认证 | JWT |
| 图标 | SVG (极简风格) |

## 项目特色

1. **极简设计风格** - 统一的SVG图标，无emoji
2. **渐变配色** - 主色调蓝色(#4A90D9)
3. **卡片式布局** - 圆角卡片、阴影效果
4. **响应式设计** - 适配不同屏幕尺寸
5. **模块化架构** - 清晰的目录结构

## 开发团队

数字游民旅居生态平台开发组

## 许可证

MIT License
