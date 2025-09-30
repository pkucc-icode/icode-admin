## native-admin 二次开发版

### 原版简介

`Naive Ui Admin` 是一款 完全免费 且可商用的中后台解决方案，基于 🌟 `Vue3.0` 🌟、🚀 `Vite` 🚀、✨ [Naive UI](https://www.naiveui.com/) ✨ 和 🎉 `TypeScript` 🎉。
它融合了最新的前端技术栈，提炼了典型的业务模型和页面，包括二次封装组件、动态菜单、权限校验等功能，助力快速搭建企业级中后台项目

颜色主题可以在styles/tailwind.css和src\store\modules\designSetting.ts中配置，后者只要改一个appTheme

src\styles\index.less可以自定义全局外观class

顶部页签src\layout\components\TagsView，有些颜色是独立配置，不与全局通用

菜单src\layout\components\Menu，颜色需要进入组件遵从官方方式修改

### 自封装组件
components里有二次封装的组件，后续的自封装组件都放这里，优先用native-ui，功能全。有样式要求可以单独把shadcn-cn的源码拿过来改（它本身就是对reka-ui的二次封装）。这两个基本够用。
以下组件可优先使用：
- Modal（native-ui）,
- ScrollArea, 滚动条（shadcn）
- Card, 易于扩展的卡片（shadcn）
- Search, 一个html原生封装的搜索框，易于定制外观
- SvgIcon, 方便直接使用svg图标，但是目前不支持三方封装好的图标组件
- Table, 数据表格，集成分页功能，已覆盖大部分样式（native-ui）
- Tooltip, 悬浮文本，自动根据文本省略情况显示，也可指定强制显示（native-ui）
- Button, 按钮，预设颜色+自定义颜色+暗主题适应+自动字体颜色（native-ui）
- Tag, 标签，预设颜色+自定义颜色+暗主题适应+自动字体颜色（native-ui）
- Form， 表单，封印的是native原生的表单组件，必要时可以替换为自己的组件（但是目前只做了Input,Select没做好不要用）

其余时候直接用native-ui的组件即可，因为作者一直在维护更新。
不在列表的组件暂时不推荐使用（如果你添加了新的组件并测试可用，记得更新上述文档）
