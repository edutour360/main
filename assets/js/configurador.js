if (window.supabase) {
const supabaseUrl = 'https://xbrahrggojoqtmxogsbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicmFocmdnb2pvcXRteG9nc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTQ3NjIsImV4cCI6MjA2MjkzMDc2Mn0.VrBq_UNDTiUd8et6M60Wqy6E52iVuXrqaFEojzPZUB0';
window.supabase = window.supabase || window.Supabase?.createClient?.(supabaseUrl, supabaseKey) || window.supabase.createClient(supabaseUrl, supabaseKey);

window.SITE_ID = '1'; // ou 'educacao', 'beleza', etc.

}



// ===== HERO CONFIG DYNAMIC LOAD =====
document.addEventListener('DOMContentLoaded', async () => {
  // window.supabase já está inicializado globalmente!
  const { data, error } = await supabase
    .from('config')
    .select('key, value')
    .eq('site_id', window.SITE_ID);

  if (error) {
    console.error(error);
    return;
  }

  const config = {};
  data.forEach(row => { config[row.key] = row.value; });


  // LOGO
  const logoImg = document.querySelector('.navbar-brand img');
  let logoUrl = config.logo_url;
  // Fallback para logo padrão se não for uma URL válida de imagem
  function isValidLogoUrl(url) {
    if (!url) return false;
    // Aceita caminhos relativos ou URLs http(s)
    return (
      url.match(/\.(svg|png|jpg|jpeg|webp|gif)$/i) &&
      (url.startsWith('http') || url.startsWith('assets/') || url.startsWith('/'))
    );
  }
  if (logoImg) {
    if (isValidLogoUrl(logoUrl)) {
      logoImg.src = logoUrl;
    } else {
      logoImg.src = 'assets/images/logo/logo2.svg';
    }
  }


  // HERO
  const heroTitle = document.querySelector(".ud-hero-title");
  if (heroTitle) heroTitle.innerText = config.hero_title || '';
  const heroDesc = document.querySelector(".ud-hero-desc");
  if (heroDesc) heroDesc.innerHTML = config.hero_desc || '';
  const botao = document.getElementById("toggleTourBtn");
  if (botao) {
    botao.innerText = config.hero_btn_text || 'Veja como funciona';
    botao.onclick = () => {
      const tourDiv = document.getElementById("tour360");
      const iframe = tourDiv ? tourDiv.querySelector("iframe") : null;
      const isVisible = tourDiv && tourDiv.style.display === "block";
      if (tourDiv) tourDiv.style.display = isVisible ? "none" : "block";
      botao.innerText = isVisible ? 'Veja como funciona' : 'Fechar Tour';
      if (!isVisible && iframe) {
        iframe.src = config.hero_btn_link || '';
      }
    };
  }


});

// ===== SAVE HERO CONFIGURATION =====
document.addEventListener('DOMContentLoaded', () => {
  const heroForm = document.getElementById('hero-form');
  if (!heroForm) return; // <-- Adicionado para evitar erro se o form não existir

  heroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('hero-title').value;
    const titleColor = document.getElementById('hero-title-color').value;
    const titleSize = document.getElementById('hero-title-size').value;
    const titleAlign = document.getElementById('hero-title-align').value;

    try {
      const { error } = await supabase.from('hero_config').upsert({
        site_id: window.SITE_ID,
        title,
        title_color: titleColor,
        title_size: titleSize,
        title_align: titleAlign,
      });

      const statusSpan = document.getElementById('hero-save-status');
      if (error) {
        statusSpan.textContent = 'Erro ao salvar: ' + error.message;
        statusSpan.style.color = 'red';
      } else {
        statusSpan.textContent = 'Salvo com sucesso!';
        statusSpan.style.color = 'green';
      }
    } catch (err) {
      console.error('Erro ao salvar configurações do Hero:', err);
    }
  });
});


