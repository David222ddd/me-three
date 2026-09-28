# 未完待续 · 个人传记馆

基于原生 JavaScript、Three.js 和 Vite 的沉浸式个人数字传记馆。访客沿无限走廊漫游，点击墙上的藏品进入对应故事。

## 在浏览器中查看

### 先理解“本地项目目录”是什么

Codex 现在修改的是 GitHub 仓库中的代码。这里说的“本地”，不是阿里云服务器，也不是 `me.david03.top`，而是你自己正在使用的 Windows 或 macOS 电脑。

你需要先把 GitHub 仓库下载到自己的电脑。下载完成后，包含 `package.json`、`index.html`、`src` 等文件的那个文件夹，就是“本地项目目录”。例如：

- Windows：`C:\Users\你的用户名\Desktop\me-three`
- macOS：`/Users/你的用户名/Desktop/me-three`

如果这些修改位于 Pull Request 中，请先在 GitHub 合并 Pull Request；否则下载到的主分支可能还是旧代码。

#### 方法 A：直接下载 ZIP（最适合新手）

1. 在浏览器打开这个项目的 GitHub 仓库页面。
2. 如果页面上有尚未合并的 Pull Request，先打开它并点击 **Merge pull request**；没有则跳过。
3. 回到仓库首页，点击绿色的 **Code** 按钮。
4. 点击 **Download ZIP**。
5. 下载完成后解压 ZIP。建议将解压后的文件夹移动到桌面，并命名为 `me-three`。
6. 打开该文件夹，确认能看到 `package.json`。此时这个文件夹就是本地项目目录。

#### 方法 B：使用 Git 克隆

在仓库首页点击 **Code**，复制 HTTPS 地址，然后在终端运行：

```bash
git clone 你的仓库HTTPS地址
cd me-three
```

例如仓库地址是 `https://github.com/your-name/me-three.git`，命令就是：

```bash
git clone https://github.com/your-name/me-three.git
cd me-three
```

### 1. 准备 Node.js 和终端

先安装 [Node.js](https://nodejs.org/) 20.19 或更高版本。安装时保持默认选项即可，然后打开终端：

- Windows：在刚才解压的 `me-three` 文件夹空白处单击右键，选择 **在终端中打开**。
- macOS：打开“终端”，输入 `cd `（`cd` 后面有一个空格），把 `me-three` 文件夹拖进终端窗口，再按回车。

也可以手动输入项目路径。例如：

```bash
# Windows PowerShell 示例
cd "$HOME\Desktop\me-three"

# macOS 示例
cd ~/Desktop/me-three
```

输入以下命令并按回车：

```bash
node --version
```

如果输出类似 `v20.20.0`，说明 Node.js 已经安装成功。如果提示找不到 `node`，请重新安装 Node.js，然后关闭并重新打开终端。

### 2. 安装并启动

```bash
npm install
npm run dev
```

这两条命令都要在能看到 `package.json` 的 `me-three` 文件夹中执行。可以先运行 `dir`（Windows）或 `ls`（macOS）确认文件是否存在。如果出现 `Could not read package.json` 或 `ENOENT`，说明终端打开了错误的文件夹，请重新按照上面的步骤进入 `me-three`。

终端出现 `Local` 地址后，在浏览器打开：

- 展馆首页：<http://localhost:5173/>
- 内容后台：<http://localhost:5173/admin.html>

首页点击“进入展馆”后，可以使用鼠标滚轮沿走廊前进；移动鼠标并点击墙上的藏品可查看故事。后台目前是交互原型，新建和删除的故事保存在当前浏览器的 `localStorage` 中，暂时不会同步到展馆或其他设备。

Vite 支持热更新：保持 `npm run dev` 运行，修改并保存源文件后，浏览器会自动刷新。按 `Ctrl+C` 可停止开发服务器。

### 在手机或局域网设备上查看

开发服务器已经监听所有网络接口。确保手机和电脑连接同一 Wi-Fi，然后查看终端中显示的 `Network` 地址（例如 `http://192.168.1.10:5173/`），用手机浏览器打开即可。若无法访问，请检查电脑防火墙是否允许 Node.js 或 5173 端口。

## 测试生产构建

```bash
npm run build
npm run preview
```

构建成功后，Vite 会生成 `dist/` 目录；在浏览器打开终端输出的预览地址（通常为 <http://localhost:4173/>）即可检查生产版本。不要直接双击 `dist/index.html`，因为浏览器的本地文件协议可能导致 ES 模块或资源路径加载失败。

## 部署到阿里云宝塔面板

域名已经解析到服务器后，可以直接将 Vite 的静态构建产物交给宝塔中的 Nginx 托管。项目已将展馆和后台配置为两个生产入口，因此构建后的 `dist/` 会同时包含 `index.html` 和 `admin.html`。

### 1. 在本地构建

这里的“在项目目录执行”，就是打开上面已经下载到电脑的 `me-three` 文件夹，在该文件夹的终端中执行：

```bash
npm install
npm run build
```

构建成功后会生成 `dist/`。建议先执行 `npm run preview`，确认首页和 `/admin.html` 都能正常打开，再上传服务器。

### 2. 在宝塔中创建站点

1. 登录宝塔面板，进入 **网站 → 添加站点**。
2. 域名填写 `me.david03.top`，根目录可填写 `/www/wwwroot/me.david03.top`。
3. PHP 版本选择 **纯静态**，数据库选择 **不创建**。
4. 创建站点后，进入 **文件**，删除根目录内宝塔自动生成的默认 `index.html`。
5. 上传 `dist/` **里面的全部文件**到 `/www/wwwroot/me.david03.top/`。不要把 `dist` 文件夹本身再套一层，否则访问地址会变成 `/dist/`。

上传后的目录大致如下：

```text
/www/wwwroot/me.david03.top/
├── index.html
├── admin.html
└── assets/
```

### 3. 配置 Nginx

在宝塔的 **网站 → me.david03.top → 配置文件** 中，确认站点根目录为：

```nginx
root /www/wwwroot/me.david03.top;
index index.html;
```

然后在现有的 `server { ... }` 内，用 `deploy/nginx.conf.example` 中的 `location /` 替换已有的同名块，再加入另外两个缓存用的 `location` 块。它会让前端路由回退到首页，并分别为 HTML 和带哈希的静态资源设置合适的缓存策略。不要重复保留两个 `location /`，也不要用示例文件完整覆盖宝塔生成的配置，因为宝塔还会管理 SSL、日志和安全规则。

保存配置时宝塔会先检查 Nginx 语法；保存成功后重新加载 Nginx。

### 4. 开启 HTTPS

进入 **网站 → me.david03.top → SSL**：

1. 选择 **Let's Encrypt**，勾选 `me.david03.top` 并申请证书。
2. 证书部署成功后开启 **强制 HTTPS**。
3. 确认阿里云安全组与服务器防火墙已经开放 TCP `80` 和 `443` 端口。

最后访问：

- 展馆：<https://me.david03.top/>
- 管理原型：<https://me.david03.top/admin.html>

如果看到宝塔默认页面，通常是站点根目录配置错误或默认 `index.html` 尚未删除；如果页面打开但没有样式或 3D 场景，请在浏览器开发者工具的 Network 面板检查 `/assets/` 请求，并确认上传的是 `dist/` 内部文件。

> **后台说明：** 当前 `/admin.html` 只是保存在浏览器 `localStorage` 中的界面原型，没有登录认证，也不会把修改同步到线上展馆。请勿把它当作安全的正式后台。要实现真正的内容管理，需要继续接入数据库、鉴权和服务端 API（例如 Directus、Strapi 或自建接口）；正式接入前可以在 Nginx 中限制 `/admin.html` 的访问。
