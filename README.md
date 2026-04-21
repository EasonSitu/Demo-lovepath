# anniversary-site

周年纪念网站项目草稿，已整理为可维护的静态站结构。

## 当前结构

```text
anniversary-site/
├── index.html
├── style.css
├── script.js
├── data.js
├── assets/
│   ├── images/
│   ├── videos/
│   ├── audio/
│   └── photo-drop/
└── README.md
```

## 本地预览
直接打开 `index.html` 即可。

## 当前已完成
1. 增加密码进入页，密码为 `0117`
2. 增加开场页与更像成品的首页结构
3. 增加照片/视频/票根预留位
4. 增加城市足迹区
5. 增加音乐开关占位
6. 增加彩蛋页区块
7. 页面结构保持为 HTML / CSS / JS / data 分离，方便后续维护

## 素材放置建议
- 照片：`assets/images/`
- 视频：`assets/videos/`
- 音乐：`assets/audio/`
- 您后续直接丢图的总入口：`assets/photo-drop/`

## 下一步建议
1. 先把 10 到 20 张最关键的照片放进 `assets/photo-drop/`
2. 再按主题精选到 `assets/images/`
3. 如果要接入真正音乐，提供 1 首 mp3 即可
4. 如果要上线，我可以继续帮您整理成可部署版本
