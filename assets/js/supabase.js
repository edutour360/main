const { createClient } = supabase;

const supabaseUrl = 'https://xbrahrggojoqtmxogsbz.supabase.co';
const supabaseKey = '...'; 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicmFocmdnb2pvcXRteG9nc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTQ3NjIsImV4cCI6MjA2MjkzMDc2Mn0.VrBq_UNDTiUd8et6M60Wqy6E52iVuXrqaFEojzPZUB0'

const db = createClient(supabaseUrl, supabaseKey);



// Login
document.getElementById('login-btn').onclick = async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const { error, user } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    document.getElementById('login-error').innerText = error.message;
  } else {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('panel-section').style.display = 'block';
  }
};

// Logout
document.getElementById('logout-btn').onclick = async () => {
  await supabase.auth.signOut();
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('panel-section').style.display = 'none';
};

// Configurações
document.getElementById('config-form').onsubmit = async (e) => {
  e.preventDefault();
  const primaryColor = document.getElementById('primary-color').value;
  const facebook = document.getElementById('facebook-link').value;
  const instagram = document.getElementById('instagram-link').value;
  await supabase.from('config').upsert([{ id: 1, primary_color: primaryColor, facebook, instagram }]);
  alert('Configurações salvas!');
};

// Upload de imagens
document.getElementById('upload-images-btn').onclick = async () => {
  const logoFile = document.getElementById('logo-upload').files[0];
  const faviconFile = document.getElementById('favicon-upload').files[0];
  if (logoFile) {
    await supabase.storage.from('imagens').upload('logo.svg', logoFile, { upsert: true });
  }
  if (faviconFile) {
    await supabase.storage.from('imagens').upload('favicon.ico', faviconFile, { upsert: true });
  }
  document.getElementById('upload-status').innerText = 'Imagens enviadas!';
};

// Criar post
document.getElementById('post-form').onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-content').value;
  const imageFile = document.getElementById('post-image').files[0];
  let imageUrl = '';
  if (imageFile) {
    const { data } = await supabase.storage.from('imagens').upload(`posts/${Date.now()}-${imageFile.name}`, imageFile);
    imageUrl = data?.path ? supabase.storage.from('imagens').getPublicUrl(data.path).data.publicUrl : '';
  }
  await supabase.from('posts').insert([{ title, content, image_url: imageUrl }]);
  alert('Post criado!');
  loadPosts();
};

// Listar posts
async function loadPosts() {
  const { data: posts } = await supabase.from('posts').select('*').order('id', { ascending: false });
  const list = document.getElementById('posts-list');
  list.innerHTML = '';
  posts.forEach(post => {
    list.innerHTML += `
      <div>
        <h4>${post.title}</h4>
        <img src="${post.image_url || ''}" style="max-width:100px;" />
        <p>${post.content}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Excluir</button>
      </div>
    `;
  });
}
window.onload = loadPosts;

