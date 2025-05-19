// assets/js/blog.js
// Fetch and render blog posts from Supabase

const supabaseUrl = 'https://xbrahrggojoqtmxogsbz.supabase.co';
const supabaseKey = '...'; // Use your public anon key here
const supabase = window.supabase || supabaseJs.createClient(supabaseUrl, supabaseKey);

async function renderBlogPosts() {
  const { data: posts, error } = await supabase.from('posts').select('*').order('id', { ascending: false });
  if (error) return;
  const container = document.querySelector('.ud-blog-grids .row');
  if (!container) return;
  container.innerHTML = '';
  posts.forEach(post => {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    col.innerHTML = `
      <div class="ud-single-blog">
        ${post.image_url ? `<div class='ud-blog-image'><img src='${post.image_url}' style='width:100%;height:auto;'/></div>` : ''}
        <div class="ud-blog-content">
          <h4>${post.title}</h4>
          <p class="ud-blog-desc">${post.content}</p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

document.addEventListener('DOMContentLoaded', renderBlogPosts);
