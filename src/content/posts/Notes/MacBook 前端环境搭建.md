---
title: "MacBook 前端环境搭建"
published: 2026-08-31
updated: 2026-08-31
description: 拿到一台新 Mac 后，从系统设置、Homebrew、终端、Node 到 Git 与常用软件，按本文顺序走一遍即可开工。
tags: [环境搭建, 教程]
category: Mac系统
draft: false
---

> 本文只面向 macOS，按「系统设置 → 命令行工具 → 终端 → Node → Git → 软件 → 避坑」的顺序组织，从上到下执行一遍即可。文中路径以 Apple 芯片（M 系列）为准，Intel 机型仅 Homebrew 前缀不同。

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
| Caps Lock 映射为 Control | 系统设置 → 键盘 → 键盘快捷键 → 修饰键 |

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

::::note[命令行方式]
需要写进脚本、换机批量执行时用 `defaults`，改完必须 `killall` 重启进程才生效：

```bash
defaults write com.apple.finder ShowPathbar -bool true       # 显示路径栏
defaults write com.apple.finder ShowStatusBar -bool true     # 显示状态栏
defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"  # 搜索当前文件夹
defaults write NSGlobalDomain AppleShowAllExtensions -bool true      # 显示所有文件扩展名
defaults write com.apple.dock autohide -bool true            # Dock 自动隐藏
defaults write com.apple.dock tilesize -int 48               # Dock 图标大小

killall Finder && killall Dock
```
::::

### 4. 截图与录屏

<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>5</kbd> 打开截图工具条（区域截图、窗口截图、录屏都在这里）。默认截图会堆在桌面，建议改一下保存位置：

在工具条上点「选项」→「存储到」→ 其他位置 → 选择或新建 `~/Pictures/Screenshots`。同一面板里还可以关掉 5 秒计时器（改为「无」）、取消勾选「显示鼠标指针」，截图更干净。

常用截图快捷键：

| 快捷键 | 作用 |
| --- | --- |
| <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>3</kbd> | 全屏截图 |
| <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>4</kbd> | 区域截图 |
| <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>5</kbd> | 打开截图/录屏工具条 |

::::note[命令行方式]
需要指定到任意路径（或写进配置脚本）时用命令，改完需重启 `SystemUIServer` 生效：

```bash
mkdir -p ~/Pictures/Screenshots
defaults write com.apple.screencapture location ~/Pictures/Screenshots
killall SystemUIServer
```
::::

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

安装结束后，**按终端末尾的提示**把 `brew` 加入 PATH（Apple 芯片路径为 `/opt/homebrew`，Intel 为 `/usr/local`）：

```bash
# Apple 芯片
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

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

## 三、终端与 Shell

macOS 默认 Shell 就是 `zsh`，无需额外切换。可选装一个更好用的终端：

```bash
brew install --cask iterm2        # 老牌终端，可配 Oh My Zsh
brew install --cask warp          # 现代终端，开箱即用（可选其一）
```

推荐的最小 Shell 配置（写入 `~/.zshrc`）：

```bash
# ~/.zshrc
alias ll="ls -alh"
alias ..="cd .."
alias ip="ipconfig getifaddr en0"   # 查看本机局域网 IP（macOS 独有命令）
alias ports="lsof -i -P -n | grep LISTEN"  # 查看端口占用

# 清理系统垃圾（谨慎使用）
alias cleands="find . -name '.DS_Store' -delete"
```

::::warning[PATH 被 path_helper 打乱]
macOS 会在 `/etc/zshrc` 中通过 `path_helper` 重新排列 PATH，把 `/usr/bin`、`/usr/sbin` 等系统路径**前置**，可能让你自己装的 node/python 被系统自带版本顶掉。解决：把自定义 PATH 写在 `~/.zshrc` 的**最后一行**，或改用 `~/.zshrc` 追加而非 `.zprofile`。
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

### 1. 基础配置

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

软件清单（`brew install --cask xxx`）：

| 软件 | 用途 | 命令 |
| --- | --- | --- |
| Visual Studio Code | 主力编辑器 | `brew install --cask visual-studio-code` |
| Google Chrome | 开发调试主浏览器 | `brew install --cask google-chrome` |
| Firefox Developer Edition | 兼容性调试 | `brew install --cask firefox@developer-edition` |
| iTerm2 | 终端 | `brew install --cask iterm2` |
| Raycast | 启动器 / 剪贴板 / 快捷键（mac 独有） | `brew install --cask raycast` |
| Rectangle | 窗口分屏快捷键（mac 独有） | `brew install --cask rectangle` |
| Docker Desktop | 容器环境 | `brew install --cask docker` |
| Apifox / Postman | 接口调试 | `brew install --cask apifox` |
| IINA | 视频播放器 | `brew install --cask iina` |
| The Unarchiver | 解压（处理 GBK 压缩包） | `brew install --cask the-unarchiver` |
| Figma | 设计稿 | `brew install --cask figma` |

命令行工具：

```bash
brew install git          # 系统自带的 git 版本较旧，用 brew 覆盖
brew install jq tree wget # JSON 处理 / 目录树 / 下载
brew install mas          # Mac App Store 命令行版，可装 App Store 里的应用
```

VS Code 装完后，打开命令面板（<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>）执行 `Shell Command: Install 'code' command in PATH`，之后终端里 `code .` 直接打开当前目录。

::::tip[设置同步]
VS Code 左下角齿轮 → 开启「设置同步」，用 GitHub 登录即可在新机器上拉取插件与配置，不用重新配一遍。
::::

## 七、macOS 开发避坑

### 1. 文件系统默认不区分大小写

APFS 默认大小写**不敏感**，`Foo.ts` 和 `foo.ts` 被视为同一个文件。在 Mac 上把文件从 `utils.ts` 改成 `Utils.ts`，Git 可能识别不到变更，代码推到服务器/CI 上却直接报错。

解决：重命名用 `git mv utils.ts Utils.ts` 显式告诉 Git，或提交后确认 `git status` 里确实出现了删除+新增两条记录。

::::tip[确实需要区分大小写]
用「磁盘工具」新建一个格式为 **APFS（区分大小写）** 的宗卷专门放代码即可：磁盘工具 → 右上角「宗卷」→ 添加宗卷 → 格式选 APFS（区分大小写）。系统盘不要改，部分软件在系统盘上会因大小写问题安装失败。
::::

### 2. 应用被 Gatekeeper 拦截

打开非 App Store 应用提示「无法打开，因为它来自身份不明的开发者」：

- 图形方式：系统设置 → 隐私与安全性 → 滑到底部点「仍要打开」；
- 命令行方式（去掉隔离标记）：

```bash
sudo xattr -rd com.apple.quarantine /Applications/xxx.app
```

### 3. Apple 芯片需要 Rosetta 2

部分老软件只有 x86 版本，首次打开时系统会自动弹窗提示安装 Rosetta，点「安装」即可；需要提前装或弹窗没出来时再手动装：

```bash
softwareupdate --install-rosetta --agree-to-license
```

需要在 x86 环境下安装某个包时，加 `arch -x86_64`：

```bash
arch -x86_64 brew install <name>   # 会装到 /usr/local，与 /opt/homebrew 隔离
```

### 4. GUI 应用读不到 Shell 环境变量

从 Dock 或 Launchpad 打开的应用**不会**加载 `.zshrc`，所以在终端里能用的环境变量，VS Code 里可能读不到（反之亦然，VS Code 的集成终端会继承 Shell 环境）。

需要全局生效时用：

```bash
launchctl setenv MY_ENV "value"   # 仅当前登录会话有效
```

### 5. 三个 Library 目录别搞混

| 路径 | 含义 |
| --- | --- |
| `~/Library` | 当前用户的配置与缓存，删错会影响应用配置 |
| `/Library` | 本机全体用户的共享配置 |
| `/System/Library` | 系统自带，**不要动** |

## 八、一键复现：Brewfile

把已装软件导出成 `Brewfile`，换新机时一条命令还原：

```bash
cd ~ && brew bundle dump --describe --force   # 导出到 ~/Brewfile
brew bundle --file=~/Brewfile                 # 新机器上还原
```

一份前端常用的 `Brewfile` 示例：

```bash
# ~/Brewfile
brew "git"
brew "fnm"
brew "jq"
brew "tree"
brew "wget"
brew "mas"

cask "visual-studio-code"
cask "google-chrome"
cask "iterm2"
cask "raycast"
cask "rectangle"
cask "iina"
cask "the-unarchiver"
cask "docker"
```

## 九、完成自检

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
