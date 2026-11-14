# CFworks-Mojang-Proxy

一个通过 Cloudflare Worker 将 Minecraft API 请求按路径前缀转发至对应源站的轻量代理。Worker 入口文件为 [worker.js](./worker.js)。

[![部署到 Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/LorienYang/CFworks-Mojang-Proxy)

## 路由

| 路径前缀 | 源站 | 说明 |
| --- | --- | --- |
| `/auth` | `authserver.mojang.com` | 旧版登录；客户端从 1.20.2 起不再使用，源站已下线。 |
| `/account` | `api.mojang.com` | 玩家名称查询 UUID；从 1.20.3 起不再使用。 |
| `/session` | `sessionserver.mojang.com` | 入服校验（`join` / `hasJoined`）及皮肤服务。 |
| `/services` | `api.minecraftservices.com` | 档案、属性及聊天举报服务。 |
| `/profiles` | `api.mojang.com` | 玩家档案服务；从 1.20.9 起使用。 |

Worker 会移除匹配的路径前缀，再将请求转发到源站。例如：

```text
https://mcs.example.com/session/session/minecraft/hasJoined?username=...
→ https://sessionserver.mojang.com/session/minecraft/hasJoined?username=...
```

请求方法、请求体和查询参数会原样转发。`Host` 请求头会设置为对应的源站域名，其余请求头会保留。未匹配的路径返回 `404`。

## 部署与配置

点击上方按钮并登录 Cloudflare，即可从此仓库创建 Worker。部署完成后，在 Worker 设置中绑定自己的域名（例如 `mcs.example.com`），然后将 Minecraft 对应的主机覆盖参数设置为以下地址：

| 覆盖参数 | 地址 |
| --- | --- |
| `minecraft.api.auth.host` | `https://mcs.example.com/auth` |
| `minecraft.api.account.host` | `https://mcs.example.com/account` |
| `minecraft.api.session.host` | `https://mcs.example.com/session` |
| `minecraft.api.services.host` | `https://mcs.example.com/services` |
| `minecraft.api.profiles.host` | `https://mcs.example.com/profiles` |

`auth` 路由只能转发请求，无法恢复已经下线的 Mojang 身份验证服务。

## 项目声明

本项目是社区提供的代理脚本，与 Mojang Studios、Microsoft 及其关联公司无隶属或官方关系。Minecraft、Mojang 等名称及商标归其各自权利人所有。

## 许可证

本项目采用 [MIT 许可证](./LICENSE)。
