---
title: "MacBook 前端开发环境搭建指南（macOS 新机配置教程）"
published: 2026-09-01
updated: 2026-09-01
description: "MacBook 新机开箱的前端环境搭建教程：Homebrew、iTerm2 + Oh My Zsh、fnm 管理 Node.js、pnpm 镜像源、Git 与 SSH 配置，附懒人版一键命令，M 系列与 Intel 芯片通用。"
tags: [macOS, 前端, 环境搭建, 教程]
category: Mac系统
draft: false
---

> 本文只面向 macOS，按「系统设置 → 命令行工具 → 终端 → Node → Git → 软件」的顺序组织，从上到下执行一遍即可。赶时间的话直接看下面懒人版。文中路径以 Apple 芯片（M 系列）为准，Intel 机型仅 Homebrew 前缀不同。

## 懒人版-速通流程

不想逐节看的话，按下面顺序把命令跑完即可开工。每一步的原理和注意事项都在后文对应章节。

**第一步：先单独装 Command Line Tools**（会弹图形窗口，点「安装」并等待装完，再跑后面）：

```bash
xcode-select --install
```

**第二步：按顺序执行核心配置**（git 用户名、邮箱记得换成自己的）：

```bash
# 1. Homebrew（装完自动加入 PATH，自动兼容 Apple / Intel 芯片）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"

# 2. 必装软件与命令行工具
brew install --cask visual-studio-code google-chrome iterm2 rectangle
brew install git fnm

# 3. Oh My Zsh 与插件（会重写 ~/.zshrc，必须放在 fnm 配置之前）
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
sed -i '' 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc

# 4. Node：fnm + LTS + pnpm + 镜像源
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc
fnm install --lts && fnm default --lts
corepack enable && corepack prepare pnpm@latest --activate
npm config set registry https://registry.npmmirror.com
pnpm config set registry https://registry.npmmirror.com

# 5. Git 基础配置
git config --global user.name "你的名字"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global credential.helper osxkeychain   # macOS 钥匙串保存账号

# 6. 全局忽略 .DS_Store
echo ".DS_Store" >> ~/.gitignore_global
echo "**/.DS_Store" >> ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global

# 7. 验证（code 命令需先在 VS Code 命令面板里装一次，见第六节）
node -v && npm -v && pnpm -v && git --version && code .
```

::::tip
终端美化（Powerlevel10k 主题与字体）需要跑交互向导，照第三章第 3 节手动做一次即可；系统初始化（触控板、Finder、Dock 等）照第一节图形路径花五分钟点一遍；SSH 接入 GitHub 看第五节；其余按需选装看第六节。
::::

## 一、系统初始化设置

以下都是 macOS 独有的设置项，建议开箱先调。

### 1. 系统更新与账号

1. 系统设置 → 通用 → 软件更新，先把系统升到最新；
2. 顶部登录 Apple ID，开启「系统设置 → [你的名字] → iCloud」中的钥匙串、文稿同步（按需）；
3. 系统设置 → 通用 → 共享，把「电脑名称」改成好认的名字（比如 `MacBook-Pro-Dev`），终端提示符和局域网共享都用它。

### 2. 触控板与键盘

| 设置项 | 路径 |
| --- | --- |
| 轻点代替点按 | 系统设置 → 触控板 → 光标与点按 |
| 三指拖移窗口 | 系统设置 → 辅助功能 → 指针控制 → 触控板拖移样式 |
| 触发角（快速息屏/调度中心） | 系统设置 → 桌面与程序坞 → 触发角 |
| F1–F12 作为标准功能键 | 系统设置 → 键盘 → 键盘快捷键 → 功能键 |

::::tip[三指拖移]
macOS 默认没有开启三指拖移，需要在辅助功能里手动打开。开启后拖拽窗口、拖选文本都不用按住触控板，效率提升明显。
::::

### 3. Finder 与 Dock

Finder 默认隐藏了很多开发常用的信息，按下面路径一次性配好（图形操作即时生效）：

| 设置项 | 图形操作路径 | 快捷键 |
| --- | --- | --- |
| 显示路径栏 | Finder 菜单栏 → 显示 → 显示路径栏 | <kbd>Cmd</kbd> + <kbd>Option</kbd> + <kbd>P</kbd> |
| 显示状态栏 | Finder 菜单栏 → 显示 → 显示状态栏 | <kbd>Cmd</kbd> + <kbd>/</kbd> |
| 搜索当前文件夹 | Finder → 设置 → 高级 → 执行搜索时：搜索当前文件夹 | <kbd>Cmd</kbd> + <kbd>,</kbd> |
| 显示所有文件扩展名 | Finder → 设置 → 高级 → 勾选「显示所有文件扩展名」 | <kbd>Cmd</kbd> + <kbd>,</kbd> |
| Dock 自动隐藏 | 系统设置 → 桌面与程序坞 → 勾选「自动显示和隐藏 Dock」 | — |
| Dock 图标大小 | 系统设置 → 桌面与程序坞 → 拖动「大小」滑条 | — |

另外两个高频操作：

- 显示/隐藏隐藏文件（`.git`、`.zshrc` 等）：Finder 中按 <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd>；
- 进入任意文件夹的绝对路径：<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>，例如输入 `~/Library`。


### 4. 截图与录屏

<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>5</kbd> 打开截图工具条（区域截图、窗口截图、录屏都在这里）。默认截图会堆在桌面，建议改一下保存位置：

在工具条上点「选项」→「存储到」→ 其他位置 → 选择或新建 `~/Pictures/Screenshots`。同一面板里还可以关掉 5 秒计时器（改为「无」）、取消勾选「显示鼠标指针」，截图更干净。

常用截图快捷键：

| 快捷键 | 作用 |
| --- | --- |
| <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>3</kbd> | 全屏截图 |
| <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>4</kbd> | 区域截图 |
| <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>5</kbd> | 打开截图/录屏工具条 |


## 二、命令行工具与 Homebrew

### 1. 安装 Xcode Command Line Tools

`git`、`ssh`、`make` 等工具都由它提供，且后面 Homebrew、Rosetta 都依赖它：

```bash
xcode-select --install
```

安装完成后验证：`xcode-select -p`，输出 `/Library/Developer/CommandLineTools` 即为成功。

::::note
`xcode-select --install` 只是命令行工具包（约 1–2 GB），不要去 App Store 装完整版 Xcode（几十 GB），除非你要做 iOS 开发。
::::

### 2. 安装 Homebrew

官方安装脚本（需要网络通畅）：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

网络不佳时，先设置国内镜像再执行上面同一条命令：

```bash
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
```

安装结束后，**按终端末尾的提示**把 `brew` 加入 PATH，按机型二选一（Apple 芯片路径为 `/opt/homebrew`，Intel 为 `/usr/local`）：

```bash
# Apple 芯片（M 系列）
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Intel 芯片（/usr/local/bin 通常已在默认 PATH，但显式写入可保证 brew 的优先级稳定）
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"

# 验证
brew --version
```

::::important[.zshrc 还是 .zprofile]
`.zprofile` 只在**登录 Shell** 加载一次，`.zshrc` 在**每个交互 Shell** 都加载。`brew shellenv` 这类一次性的 PATH 注入放 `.zprofile`；别名、函数、工具初始化（如 `fnm env`）放 `.zshrc`。
::::

### 3. brew 常用命令

| 命令 | 作用 |
| --- | --- |
| `brew install <name>` | 安装命令行工具 |
| `brew install --cask <name>` | 安装 GUI 应用 |
| `brew update && brew upgrade` | 更新 brew 自身与已装软件 |
| `brew cleanup` | 清理旧版本缓存 |
| `brew list` / `brew list --cask` | 查看已安装列表 |
| `brew services start <name>` | 后台启动服务（如 nginx、mysql） |
| `brew doctor` | 环境问题自检 |

## 三、终端与 Shell：iTerm2 + Oh My Zsh

macOS 默认 Shell 就是 `zsh`，无需切换。终端推荐「iTerm2 + Oh My Zsh」组合：iTerm2 负责窗口体验，Oh My Zsh 负责主题与插件。

### 1. 安装 iTerm2

```bash
brew install --cask iterm2
```

装完后设为默认终端：iTerm2 菜单栏 → Make iTerm2 Default Term。

### 2. 安装 Oh My Zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

::::important[会重写 ~/.zshrc]
安装脚本会把现有的 `~/.zshrc` 备份为 `~/.zshrc.pre-oh-my-zsh` 再覆盖。如果先跑了懒人版（里面往 `.zshrc` 写过 `fnm env`），装完 Oh My Zsh 后把这行从备份文件拷回新的 `~/.zshrc` 即可。因此推荐顺序：**先装 Oh My Zsh，再加 fnm 等工具配置**。
::::

### 3. 安装 Powerlevel10k 主题

好看好用的提示符，能显示 git 分支、执行耗时、返回码等：

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
```

编辑 `~/.zshrc` 改主题行：

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```

然后 `source ~/.zshrc`，会自动进入 `p10k configure` 配置向导，一路按喜好选择即可。向导会提示安装 **MesloLGS NF** 字体（向导里有下载链接，四个字体文件都装上），装完在 iTerm2 里启用：iTerm2 → Settings → Profiles → Text → Font → 选择 `MesloLGS NF`。

::::tip
不想折腾主题的话，跳过本小节，把 `~/.zshrc` 里的 `ZSH_THEME` 改成内置的 `agnoster` 或保持默认的 `robbyrussell` 也够用。
::::

### 4. 安装两个必装插件

```bash
# 命令自动补全建议（灰色提示历史命令，按 → 采纳）
git clone https://github.com/zsh-users/zsh-autosuggestions \
  "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"

# 命令语法高亮（正确的命令绿色、错误的红色）
git clone https://github.com/zsh-users/zsh-syntax-highlighting \
  "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"
```

编辑 `~/.zshrc` 启用插件（`git` 插件内置，提供 `gst`、`gco` 等大量 git 别名）：

```bash
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

### 5. 常用别名

追加到 `~/.zshrc` 末尾：

```bash
alias ll="ls -alh"
alias ..="cd .."
alias ip="ipconfig getifaddr en0"          # 查看本机局域网 IP（macOS 独有命令）
alias ports="lsof -i -P -n | grep LISTEN"  # 查看端口占用
alias cleands="find . -name '.DS_Store' -delete"  # 清理 .DS_Store
```

最后 `source ~/.zshrc` 生效。

::::warning[PATH 被 path_helper 打乱]
macOS 会在 `/etc/zshrc` 中通过 `path_helper` 重新排列 PATH，把 `/usr/bin`、`/usr/sbin` 等系统路径**前置**，可能让你自己装的 node/python 被系统自带版本顶掉。解决：把自定义 PATH 写在 `~/.zshrc` 的**最后一行**。
::::

## 四、Node.js 环境

不建议直接官网下载 pkg 安装（后续版本管理、权限都很麻烦）。推荐用版本管理器。

### 1. 安装 fnm（首选）

`fnm` 基于 Rust，启动快，且能识别项目下的 `.node-version` / `.nvmrc` 自动切版本：

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc

fnm install --lts      # 安装最新 LTS
fnm default --lts      # 设为默认版本
node -v && npm -v
```

如果更习惯 `nvm`：

```bash
brew install nvm
mkdir -p ~/.nvm
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$(brew --prefix nvm)/nvm.sh" ] && . "$(brew --prefix nvm)/nvm.sh"' >> ~/.zshrc
source ~/.zshrc
nvm install --lts && nvm alias default --lts
```

::::tip[项目级 Node 版本]
公司项目通常锁定了 Node 版本，在仓库根目录建一个 `.node-version` 文件写入版本号（如 `20.18.0`），配合 fnm 的 `--use-on-cd` 进入目录即自动切换。
::::

### 2. 安装 pnpm 与镜像源

安装、换源、验证一条命令流走完：

```bash
# 1. 安装 pnpm：Node 16+ 自带 corepack，直接启用
corepack enable
corepack prepare pnpm@latest --activate   # 也可以 npm i -g pnpm

# 2. 配置国内镜像源，npm 与 pnpm 各配一次
npm config set registry https://registry.npmmirror.com
pnpm config set registry https://registry.npmmirror.com

# 3. 验证
node -v && npm -v && pnpm -v
npm config get registry && pnpm config get registry
```

相关配置命令：

| 命令 | 作用 |
| --- | --- |
| `npm config list` | 查看全部生效配置及其来源 |
| `npm config get registry` | 查看当前源 |
| `npm config set registry https://registry.npmjs.org` | 恢复 npm 官方源 |
| `pnpm config set registry https://registry.npmjs.org` | 恢复 pnpm 官方源 |
| `npm config delete registry` | 删除该配置 |

配置会持久化到 `~/.npmrc`，换机时把这个文件一起带走即可。

::::tip[项目配置优先]
项目根目录若带了 `.npmrc` 且指定了 `registry`，会以项目配置优先，覆盖这里的全局配置。
::::

## 五、Git 与 SSH

### 1. 安装与基础配置

macOS 自带 git 但版本较旧，用 brew 覆盖后统一管理升级：

```bash
brew install git
git --version
```

然后做全局配置：

```bash
git config --global user.name "你的名字"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global credential.helper osxkeychain   # 用 macOS 钥匙串保存账号密码
```

其中 `credential.helper osxkeychain` 是 macOS 独有的凭证存储方式，装过 Command Line Tools 就能用，HTTPS 拉取只需输一次密码。

### 2. 生成 SSH Key 并接入 GitHub

```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub | pbcopy   # pbcopy 是 macOS 独有命令，直接复制到剪贴板
```

然后到 GitHub → Settings → SSH and GPG keys 粘贴。为避免每次重启后重新输密码，配置 `~/.ssh/config`：

```bash
Host *
  AddKeysToAgent yes
  UseKeychain yes          # macOS 独有，把密钥口令存进钥匙串
  IdentityFile ~/.ssh/id_ed25519
```

首次添加：`ssh-add --apple-use-keychain ~/.ssh/id_ed25519`，验证：`ssh -T git@github.com`。

### 3. 忽略 .DS_Store

macOS 每个文件夹都会生成 `.DS_Store`，提交上去会污染仓库，做一次全局忽略：

```bash
echo ".DS_Store" >> ~/.gitignore_global
echo "**/.DS_Store" >> ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```

## 六、常用软件

安装方式二选一，按习惯来：

- **图形方式**：App Store 搜索安装，或官网下载 `.dmg` 后把 `.app` 拖进「应用程序」文件夹，适合只装一两个软件；
- **命令行方式（推荐）**：`brew install --cask xxx`，一条命令装完，后续 `brew upgrade` 统一升级，适合批量装机，也是下面表格采用的方式。

软件按「必装 → 推荐 → 按需」分级，装到哪一级看个人需求。

### 必装（前端开工就靠这几样）

| 软件 | 用途 | 命令 |
| --- | --- | --- |
| Visual Studio Code | 主力编辑器 | `brew install --cask visual-studio-code` |
| Google Chrome | 开发调试主浏览器 | `brew install --cask google-chrome` |
| iTerm2 | 终端 | `brew install --cask iterm2` |


### 推荐（装上幸福感明显提升）

| 软件 | 用途 | 命令 |
| --- | --- | --- |
| Raycast | 启动器 / 剪贴板历史 / 窗口管理（mac 独有） | `brew install --cask raycast` |
| Apifox | 接口调试 | `brew install --cask apifox` |
| IINA | 视频播放器 | `brew install --cask iina` |
| The Unarchiver | 解压（能处理 GBK 压缩包，中文不乱码） | `brew install --cask the-unarchiver` |

### 按需（项目或场景需要再装）

| 软件 | 用途 | 命令 |
| --- | --- | --- |
| Firefox Developer Edition | 浏览器兼容性调试 | `brew install --cask firefox@developer-edition` |
| Figma | 查看设计稿 | `brew install --cask figma` |
| Postman | 接口调试（Apifox 的替代品） | `brew install --cask postman` |

VS Code 装完后，打开命令面板（<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>）执行 `Shell Command: Install 'code' command in PATH`，之后终端里 `code .` 直接打开当前目录。

::::tip[设置同步]
VS Code 左下角齿轮 → 开启「设置同步」，用 GitHub 登录即可在新机器上拉取插件与配置，不用重新配一遍。
::::

## 七、完成自检

```bash
xcode-select -p               # CommandLineTools 路径
brew --version                # Homebrew
node -v && npm -v && pnpm -v  # Node 与包管理器
npm config get registry       # 镜像源是否生效
git --version                 # Git
git config --global --list    # 用户名、邮箱、excludesfile 是否生效
ssh -T git@github.com         # SSH 是否连通
code .                        # VS Code 命令行是否可用
```

全部正常，就可以 `pnpm install` 开工了。
