if (window.supabase) {
const supabaseUrl = 'https://xbrahrggojoqtmxogsbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicmFocmdnb2pvcXRteG9nc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTQ3NjIsImV4cCI6MjA2MjkzMDc2Mn0.VrBq_UNDTiUd8et6M60Wqy6E52iVuXrqaFEojzPZUB0';
window.supabase = window.supabase || window.Supabase?.createClient?.(supabaseUrl, supabaseKey) || window.supabase.createClient(supabaseUrl, supabaseKey);
}



// ===== HERO CONFIG DYNAMIC LOAD =====
document.addEventListener('DOMContentLoaded', async () => {
  // window.supabase já está inicializado globalmente!
  const { data, error } = await window.supabase
    .from('cont_index')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  document.querySelector(".ud-hero-title").innerText = data.Title_Index;
  document.querySelector(".ud-hero-desc").innerHTML = data.Sub_title_index;

  const botao = document.getElementById("toggleTourBtn");
  botao.innerText = data.Button_Name;
  botao.onclick = () => {
    const container = document.getElementById("tour360");
    container.style.display = container.style.display === "none" ? "block" : "none";
    container.querySelector("iframe").src = data.Button_Iframe;
  };
});

