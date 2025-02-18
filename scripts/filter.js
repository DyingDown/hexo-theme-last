const pagination = require('hexo-pagination');

// hexo.extend.filter.register('before_generate', function() {
//     let filteredPosts = hexo.locals.get('posts').filter(post => { return post.layout !== 'gallery' && !post.categories.map(cat => cat.name).includes('ACM') && !post.categories.map(cat => cat.name).includes('Essay') && !post.categories.map(cat => cat.name).includes('expn');});
//     // console.log(filteredPosts);  // 确保 filtered_posts 被正确初始化并且不为空/
//     hexo.locals.set('filtered_posts', filteredPosts);
//     // console.log(site.filtered_posts); 

//     var pageSize = hexo.config.index_generator.per_page || 24;
//     var homePaginator = new Paginator(hexo.config.index_generator.path, filteredPosts, {
//       perPage: pageSize
//     });
//     hexo.locals.set('paginator', homePaginator);
//     console.log(homePaginator);

//   });

hexo.extend.generator.register('index', function(locals) {
  const perPage = hexo.config.index_generator.per_page || 20;
  const filteredPosts = locals.posts.sort('date', -1).filter(post => {
    return !post.categories.some(cat => ['Gallery', 'ACM'].includes(cat.name));
  });

  // 在生成分页时，确保只使用过滤后的文章
  return pagination('', filteredPosts, { 
    perPage: perPage, 
    layout: ['index'],
    data: {
        __index: true
    }
  });

});
