hexo.extend.filter.register('before_generate', function() {
    let filteredPosts = hexo.locals.get('posts').filter(post => post.layout !== 'gallery');
    // console.log(filteredPosts);  // 确保 filtered_posts 被正确初始化并且不为空/
    hexo.locals.set('filtered_posts', filteredPosts);
    // console.log(site.filtered_posts); 
  });