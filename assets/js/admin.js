// assets/js/admin.js
// Handles admin panel logic for admin.html

import { supabase, loadConfig, loadPosts, logout, createOrUpdateConfig, uploadImage, createOrUpdatePost, deletePost } from './supabase.js';

// --- Session check ---
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
  }
}

// --- Load config and posts on page load ---
async function initAdminPanel() {
  await checkSession();
  await loadConfig();
  await loadPosts();
}

document.addEventListener('DOMContentLoaded', () => {
  initAdminPanel();

  // Example: Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // TODO: Add event listeners for config form, image upload, blog CRUD, etc.
  // Example:
  // document.getElementById('config-form').addEventListener('submit', ...)
  // document.getElementById('blog-form').addEventListener('submit', ...)
});

// ===== HERO CONFIG =====
const heroForm = document.getElementById('hero-form');
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const heroBtnText = document.getElementById('hero-btn-text');
const heroBtnLink = document.getElementById('hero-btn-link');
const heroSaveStatus = document.getElementById('hero-save-status');

// Função para carregar dados do hero do Supabase
async function loadHeroConfig() {
  // Supondo tabela 'config' com chave 'hero_title', 'hero_desc', 'hero_btn_text', 'hero_btn_link'
  let { data, error } = await supabase
    .from('config')
    .select('key,value')
    .in('key', ['hero_title','hero_desc','hero_btn_text','hero_btn_link']);
  if (data) {
    data.forEach(row => {
      if (row.key === 'hero_title') heroTitle.value = row.value;
      if (row.key === 'hero_desc') heroDesc.value = row.value;
      if (row.key === 'hero_btn_text') heroBtnText.value = row.value;
      if (row.key === 'hero_btn_link') heroBtnLink.value = row.value;
    });
  }
}

// Função para salvar dados do hero no Supabase
async function saveHeroConfig(e) {
  e.preventDefault();
  heroSaveStatus.textContent = 'Salvando...';
  const updates = [
    { key: 'hero_title', value: heroTitle.value },
    { key: 'hero_desc', value: heroDesc.value },
    { key: 'hero_btn_text', value: heroBtnText.value },
    { key: 'hero_btn_link', value: heroBtnLink.value }
  ];
  // UPSERT (atualiza ou insere)
  const { error } = await supabase.from('config').upsert(updates, { onConflict: ['key'] });
  if (error) {
    heroSaveStatus.textContent = 'Erro ao salvar!';
  } else {
    heroSaveStatus.textContent = 'Salvo!';
    setTimeout(() => heroSaveStatus.textContent = '', 2000);
  }
}

if (heroForm) {
  heroForm.addEventListener('submit', saveHeroConfig);
  loadHeroConfig();
}

// Add more admin panel logic as needed
