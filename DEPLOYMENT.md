# Railway 部署指南

## 📦 部署步骤

### 1. 连接 GitHub 仓库

1. 访问 [Railway](https://railway.app/)
2. 使用 GitHub 账号登录
3. 点击 **"New Project"**
4. 选择 **"Deploy from GitHub repo"**
5. 授权并选择 `Digital-Nomad-Management-System` 仓库

### 2. 配置服务

#### 方式 A：单体部署（推荐）

1. 在 Railway 项目页面，点击 **"Add Service"**
2. 选择 **"GitHub Repo"**
3. 选择 `Digital-Nomad-Management-System` 仓库
4. Railway 会自动检测 Node.js 项目

#### 方式 B：分离部署

**后端服务：**
- Root Directory: `Digital-Nomad-Management-System-server`
- Start Command: `npm start`

**数据库：**
1. 点击 **"Add Service"**
2. 选择 **"Database"** → **"MySQL"**
3. Railway 会自动创建 MySQL 数据库

### 3. 配置环境变量

在 Railway 控制台的 **"Variables"** 标签页添加以下变量：

```bash
# 数据库配置（如果使用 Railway MySQL）
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=railway

# JWT 配置
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# 服务器配置
NODE_ENV=production
PORT=3000

# 可选：CORS 配置
FRONTEND_URL=https://your-frontend-domain.com
```

### 4. 数据库初始化

 Railway MySQL 会自动创建名为 `railway` 的数据库。

**方式 A：使用 Railway 的 SQL 编辑器**
1. 在 Railway 控制台点击 MySQL 服务
2. 进入 **"SQL"** 标签页
3. 复制粘贴 `Digital-Nomad-Management-System-server/src/database/data/init.sql` 的内容
4. 点击 **"Run"** 执行

**方式 B：本地连接初始化**
```bash
# 获取数据库连接信息
# 在 Railway MySQL 服务的 "Connect" 标签页可以找到连接信息

# 使用 MySQL 客户端连接
mysql -h <host> -u <user> -p<password> railway

# 执行初始化脚本
source /path/to/init.sql
```

### 5. 查看部署状态

1. 在 Railway 控制台查看 **"Deployments"** 标签页
2. 点击最新的部署查看日志
3. 等待构建完成（通常需要 2-5 分钟）

### 6. 获取访问地址

部署成功后，Railway 会提供：
- **Public URL**: `https://your-project.up.railway.app`
- 可以在 **"Settings"** → **"Domains"** 中配置自定义域名

## 🔍 健康检查

访问以下地址验证部署是否成功：

```
https://your-project.up.railway.app/health
```

成功响应示例：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🛠️ 故障排查

### 构建失败

1. 检查 Railway 日志中的错误信息
2. 确认 `package.json` 中的依赖项正确
3. 查看是否缺少必要的环境变量

### 数据库连接失败

1. 确认已添加 MySQL 服务
2. 检查环境变量是否正确配置
3. 确认数据库已初始化（表已创建）

### 应用启动失败

1. 检查端口配置（Railway 使用 `PORT` 环境变量）
2. 查看启动日志中的错误信息
3. 确认所有依赖项已正确安装

## 📊 监控

在 Railway 控制台可以查看：
- **Metrics**: CPU、内存使用情况
- **Logs**: 实时日志
- **Deployments**: 部署历史

## 🔄 自动部署

每次推送到 GitHub 仓库后，Railway 会自动：
1. 拉取最新代码
2. 重新构建
3. 部署新版本

可以在 **"Settings"** → **"GitHub"** 中配置自动部署选项。

## 💰 费用

Railway 提供：
- **免费额度**: $5/月（开发者计划）
- **付费计划**: $20/月起

查看使用情况和计费信息在 **"Billing"** 标签页。

## 📝 注意事项

1. **数据库持久化**: Railway 的 MySQL 是托管服务，数据会自动备份
2. **环境变量**: 不要将敏感信息提交到代码仓库
3. **端口配置**: 使用 `PORT` 环境变量，不要硬编码端口
4. **健康检查**: 配置健康检查路径 `/health` 以确保服务正常运行

## 🆘 获取帮助

- [Railway 文档](https://docs.railway.app/)
- [Railway Discord 社区](https://discord.gg/railway)
- [项目 GitHub Issues](https://github.com/zzyy540886666/Digital-Nomad-Management-System/issues)
