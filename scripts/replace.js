/**
 * Note: configs in _data/temp.yml will replace configs in hexo.theme.config.
 */
hexo.on('generateBefore', function() {
    if (hexo.locals.get) {
        var data = hexo.locals.get('data') // 获取_data文件夹下的内容
        data && data.temp && (hexo.theme.config = data.temp) // 如果temp.yml 存在，就把内容替换掉主题的config
    }
})