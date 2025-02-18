// var pagination = require('hexo-pagination');

// hexo.extend.generator.register('leetcode', function(locals){
//     const perPage = hexo.config.category_generator.per_page || 15;
//     const filteredPosts = locals.posts.filter(post => {
//       return !post.categories.some(cat => ['Gallery', 'ACM'].includes(cat.name));
//     });
  
//     // 在生成分页时，确保只使用过滤后的文章
//     return pagination('leetcode', filteredPosts, {
//       perPage: perPage,
//       layout: ['index'],
//       data: {}
//   });
// });

// This is file is currently useless, but could be use as method to implement later
// from this https://wormtooth.com/20170511-hexo-plugins/