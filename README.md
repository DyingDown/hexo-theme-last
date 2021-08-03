# 预览

[https://dyingdown.github.io](https://dyingdown.github.io])

> #### Notes
>
> **This theme is not done yet. Most functions and pictures functions are not complete.** And it's not flexible yet.
>
> However, if you want to use it, you can download and install it.

# 主题介绍

该主题是一款集成了很多我个人喜欢的元素并且搭配组合出来的，其中有一部分来自别的博客的创意，当然有一部分是我自己的创意。

改主题既可以简洁也可以多彩，有丰富的配置选项来自定义博客。

# 主题配置 

## 基本配置

### 顶部菜单栏内容设置

```yml
menu:
  XXX:
    path: /
    ico: ico-name
  XXX:
    path: /
    ico: ico-name
```

`ico-name`是图标在**Font Awesome**里面的图标的名称， path是你想让图标链接到的地址

### 关于博主

#### 头像

```yml
avatar: https://
```

写出头像在云端存储的连接

#### 个人简短介绍

```YML
aboutme: XXX
```

简短的个人介绍，在文章页面的侧边栏里展示

#### 成立日期

```yml
since: 2019
```

### 博客结构，样式

#### 首页的大图展示

```yml
homeCover:
  fixed: true
  url: https://
```

首页的图是否是固定的，不随着滑动而向上移动

#### 首页的轮播图

```yml
carousel:
  on: true # false
  prevNext: true
  indicators: # the indicator dots under the pictures 图片下面的点指示器
    on: true #是否开启
    position: center # left, center, right 指示器的位置
    style: line # dot, line
    currentColor:
      color: "#222" # Hex or color name 16进制的颜色或者颜色名字
      opacity: 0.9 # float number 0 - 1 eg. 0.55
    otherColor:
      color: "white" # Hex or color name 16进制的颜色或者颜色名字
      opacity: 1 # float number 0 - 1 eg. 0.55
  mask:
    on: true
    color: "#000" # Hex or color name 16进制的颜色或者颜色名字
    opacity: 0.5 # float number 0 - 1 eg. 0.55
  blur:
    on: true
    px: 5 # 模糊的程度
  textColor: "#fff" # Hex or color name 16进制的颜色或者颜色名字
```

#### 首页文章列表的样式

```yml
# Home page
# the number of lines show of each post's description
clampLines: 8 # any number
```

`clampLines` 是首页每篇文章的描述内容展示多少行

#### 分页的样式

多个文章页面的分页的样式

```yml
# patination style: true with background, false not
paginationNumberBackground: true # false
```

post文章页面的下一个文章，上一个文章的样式

```yml
# style of post page pagination 
postPagePaginationStyle: card # normal  picture  card
```

#### 文章页面的样式

```yml
postStyle:
  # also the catalog's positon 同样也是目录的位置
  authorInfoPosition: right # right, left
  contentStyle: github # music microsoft github
  color: "default" # "default" or "#xxxxxx" or "color name"
  # Hex or color name 16进制的颜色或者颜色名字
```

#### 档案archive页面样式

```yml
archiveStyle:
  style: normal # comment-shape, normal
  type: center # basic, split, center
  color: pink
```

#### 文章内容过期提醒

```yml
# Content may be out of date reminder 文章内容可能过期提醒
# Or you can use it in your md file 
# Warning: true  # write this in your md file
Warning:
  on: true # if is true, every article have this note 如果选择true，所有的文章都带有提示信息
  Days: 5 # Day,  after these days, your post will show out of date content
  Content: "This article was written {} days ago. The content of the article may be out of date."
```

#### 联系作者按钮

```yml
######### footer social icons
# we use font awesome to display the fonts 我们用的是font awesome来展示图标
# XXX: "url_for(XXX)||icon name of XXX"
# befor || is your site's url ||前面的是你的url
# after || is your icons name in font awesome ||后面的是font awesome上面对应的图标的名字
# add any other icons using the format 用这种格式可以添加别的图标
contacts:
  E-mail: " mailto:o_oyao@outlook.com || fas fa-fw fa-envelope"
  # Tencent-Weibo: " || fab fa-fw fa-tencent-weibo"
  # 知乎: " || fab fa-fw fa-zhihu"
  # 微博: " ||fab fa-fw fa-weibo"
  Wechat: " ||fab fa-fw fa-weixin"
  Twitter: " ||fab fa-fw fa-twitter"
  Telegram: " ||fab fa-fw fa-telegram-plane"
  # Stack-overflow: " ||fab fa-fw fa-stack-overflow"
  # Skype: " ||fab fa-fw fa-skype"
  QQ: " ||fab fa-fw fa-qq"
  # Pinterest: " ||fab fa-fw fa-pinterest-p"
  Linkedin: " ||fab fa-fw fa-linkedin-in"
  GitHub: " https://github.com/DyingDown ||fab fa-fw fa-github"
  Facebook: " ||fab fa-fw fa-facebook-f"
  # Codepen: " ||fab fa-fw fa-codepen"
  # Google: "  ||fab fa-fw fa-google"
  # Alipay: " ||fab fa-fw fa-alipay"  
  Instagram: " ||fab fa-fw fa-instagram"
  Quora: " ||fab fa-fw fa-quora"
  # Spotify: " ||fab fa-fw fa-spotify"
  # YouTube: " ||fab fa-fw fa-youtube"
  # Discord: " ||fab fa-fw fa-discord"
  # 人人: " ||fab fa-fw fa-renren"
  # Reddit: " ||fab fa-fw fa-reddit"
  # Snapchat: " ||fa fa-fw fa-snapchat-ghost"
```

### 附加功能

#### 目录

```yml
toc:
  on: true
```

#### 搜搜功能(目前还没实现)

```yml
# Search Function
search:
  on: true
```

#### 分享功能

```yml
# https://github.com/overtrue/share.js
Share:
  on: true # if this is false, the flowing are useless 如果这个选为false,则下面的都没用了
  datasites: "facebook,twitter,qq,wechat,qzone,weibo" # You can combine these arbitrarily 你可以任意的组合这些
  # there are facebook,linkedin, twitter, qq, douban, wechat, qzone, weibo
  wechatQrcodeTitle: "微信扫一扫：Share"
```

#### 打赏功能

```yml
donate:
  on: true # false
  wechat: true # false
  alipay: true # false
  description: Like my post? # 描述
```

#### 评论功能(没完成，只完成了valine)

```yml
valine:
  on: true
  appId:  # App ID
  appKey: # App Key
  verify: true # 验证码
  notify: true # 评论回复邮箱提醒
  avatar: mp # 匿名者头像选项
  placeholder: Leave your email address so you can get reply from me!
  lang: zh-cn
  guest_info: nick,mail,link
  pageSize: 10
```

#### 数学公式

```yml
# Latex 
# MathJax Support
mathjax:
  enable: true
  per_page: true
  cdn: https://cdn.jsdelivr.net/npm/mathjax/MathJax.js?config=TeX-AMS-MML_HTMLorMML
```

需要hexo插件`hexo-math` 和 `hexo-renderer-kramed ` 的支持