(function () {
  "use strict";

  // ======= Função para inicializar tudo que depende do header =======
  async function initHeaderFeatures() {
    // ======= Sticky Header =======
    const ud_header = document.querySelector(".ud-header");
    if (ud_header) {
      function handleStickyHeader() {
        const sticky = ud_header.offsetTop;
        if (window.pageYOffset > sticky) {
          ud_header.classList.add("sticky");
          document.body.classList.add("has-sticky-header");
        } else {
          ud_header.classList.remove("sticky");
          document.body.classList.remove("has-sticky-header");
        }
      }
      window.addEventListener('scroll', handleStickyHeader);
      handleStickyHeader();
    }

    // ======= Sticky (logo) =======
    window.onscroll = function () {
      const ud_header = document.querySelector(".ud-header");
      if (!ud_header) return;
      const sticky = ud_header.offsetTop;
      const logo = document.querySelector(".navbar-brand img");
      if (!window.LOGO_URL_SUPABASE) return;
      if (window.pageYOffset > sticky) {
        ud_header.classList.add("sticky");
      } else {
        ud_header.classList.remove("sticky");
      }
      if (logo) logo.src = window.LOGO_URL_SUPABASE;
    };

    //===== close navbar-collapse when a link is clicked
    let navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarToggler && navbarCollapse) {
      document.querySelectorAll(".ud-menu-scroll").forEach((e) =>
        e.addEventListener("click", () => {
          navbarToggler.classList.remove("active");
          navbarCollapse.classList.remove("show");
        })
      );
      navbarToggler.addEventListener("click", function () {
        navbarToggler.classList.toggle("active");
        navbarCollapse.classList.toggle("show");
      });
    }

    // ===== submenu
    const submenuButton = document.querySelectorAll(".nav-item-has-children");
    submenuButton.forEach((elem) => {
      const a = elem.querySelector("a");
      if (a) {
        a.addEventListener("click", () => {
          const submenu = elem.querySelector(".ud-submenu");
          if (submenu) submenu.classList.toggle("show");
        });
      }
    });

    // ===== wow js
    if (typeof WOW !== 'undefined') new WOW().init();

    // ====== Header Auth Buttons ======
    // Inicializa Supabase se não existir
    if (!window.supabase) {
      const supabaseUrl = 'https://xbrahrggojoqtmxogsbz.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicmFocmdnb2pvcXRteG9nc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTQ3NjIsImV4cCI6MjA2MjkzMDc2Mn0.VrBq_UNDTiUd8et6M60Wqy6E52iVuXrqaFEojzPZUB0';
      window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
    }
    const btnContainer = document.querySelector('.navbar-btn');
    if (btnContainer) {
      btnContainer.innerHTML = '';
      try {
        const { data: { session } } = await window.supabase.auth.getSession();
        if (session) {
          const contaBtn = document.createElement('a');
          contaBtn.href = 'admin.html';
          contaBtn.className = 'ud-main-btn ud-login-btn';
          contaBtn.textContent = 'Minha Conta';
          btnContainer.appendChild(contaBtn);
          const sairBtn = document.createElement('a');
          sairBtn.href = '#';
          sairBtn.className = 'ud-main-btn ud-white-btn';
          sairBtn.textContent = 'Sair';
          sairBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await window.supabase.auth.signOut();
            window.location.href = 'login.html';
          });
          btnContainer.appendChild(sairBtn);
        } else {
          const entreBtn = document.createElement('a');
          entreBtn.href = 'login.html';
          entreBtn.className = 'ud-main-btn ud-login-btn';
          entreBtn.textContent = 'Entre';
          btnContainer.appendChild(entreBtn);
          const cadastreBtn = document.createElement('a');
          cadastreBtn.href = 'signup.html';
          cadastreBtn.className = 'ud-main-btn ud-white-btn';
          cadastreBtn.textContent = 'Cadastre-se';
          btnContainer.appendChild(cadastreBtn);
        }
      } catch (e) {
        const entreBtn = document.createElement('a');
        entreBtn.href = 'login.html';
        entreBtn.className = 'ud-main-btn ud-login-btn';
        entreBtn.textContent = 'Entre';
        btnContainer.appendChild(entreBtn);
        const cadastreBtn = document.createElement('a');
        cadastreBtn.href = 'signup.html';
        cadastreBtn.className = 'ud-main-btn ud-white-btn';
        cadastreBtn.textContent = 'Cadastre-se';
        btnContainer.appendChild(cadastreBtn);
      }
    }

    // ====== Ajuste do link Inicio ======
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
    const nav = document.getElementById('nav');
    if (nav) {
      const inicioLink = Array.from(nav.querySelectorAll('a')).find(a => a.textContent.trim() === 'Inicio');
      if (inicioLink) {
        if (!isIndex) {
          inicioLink.classList.remove('ud-menu-scroll');
          inicioLink.setAttribute('href', 'index.html');
          inicioLink.onclick = null;
        } else {
          inicioLink.classList.add('ud-menu-scroll');
          inicioLink.setAttribute('href', '#top');
        }
      }
    }
  }

  // ======= ADD Header e Hero DINÂMICOS =======
  document.addEventListener('DOMContentLoaded', async () => {
    // Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
      const resp = await fetch('assets/componets/header.html');
      const html = await resp.text();
      headerPlaceholder.innerHTML = html;
      await initHeaderFeatures();
    }
    // Hero
    const heroPlaceholder = document.getElementById('hero-placeholder');
    if (heroPlaceholder) {
      const resp = await fetch('assets/componets/hero.html');
      const html = await resp.text();
      heroPlaceholder.innerHTML = html;
      // Após inserir o hero, carrega textos e botão dinamicamente
      if (window.supabase && window.SITE_ID) {
        const { data, error } = await window.supabase
          .from('config')
          .select('key, value')
          .eq('site_id', window.SITE_ID);
        if (!error && data) {
          const config = {};
          data.forEach(row => { config[row.key] = row.value; });
          const heroTitle = document.querySelector('.ud-hero-title');
          if (heroTitle) heroTitle.innerText = config.hero_title || '';
          const heroDesc = document.querySelector('.ud-hero-desc');
          if (heroDesc) heroDesc.innerHTML = config.hero_desc || '';
          const botao = document.getElementById('toggleTourBtn');
          if (botao) {
            botao.innerText = config.hero_btn_text || 'Veja como funciona';
            botao.onclick = () => {
              const tourDiv = document.getElementById('tour360');
              const iframe = tourDiv ? tourDiv.querySelector('iframe') : null;
              const isVisible = tourDiv && tourDiv.style.display === 'block';
              if (tourDiv) tourDiv.style.display = isVisible ? 'none' : 'block';
              botao.innerText = isVisible ? 'Veja como funciona' : 'Fechar Tour';
              if (!isVisible && iframe) {
                iframe.src = config.hero_btn_link || '';
              }
            };
          }
        }
      }
    }
    // Features
    const featuresPlaceholder = document.getElementById('features-placeholder');
    if (featuresPlaceholder) {
      const resp = await fetch('assets/componets/features.html');
      const html = await resp.text();
      featuresPlaceholder.innerHTML = html;
      // Preenche dinamicamente os textos e ícones dos features
      if (window.supabase && window.SITE_ID) {
        const { data, error } = await window.supabase
          .from('config')
          .select('key, value')
          .eq('site_id', window.SITE_ID);
        if (!error && data) {
          const config = {};
          data.forEach(row => { config[row.key] = row.value; });
          // Título principal do bloco Features
          const sectionTitle = featuresPlaceholder.querySelector('.ud-section-title h1');
          if (sectionTitle) sectionTitle.innerText = config.features_title || 'A tecnologia do futuro, agora.';
         
         
         
         
        }
      }
    }
    // About
    const aboutPlaceholder = document.getElementById('about');
    if (aboutPlaceholder) {
      const resp = await fetch('assets/componets/about.html');
      const html = await resp.text();
      aboutPlaceholder.innerHTML = html;
      // Preenche dinamicamente os textos e imagem do bloco About
      if (window.supabase && window.SITE_ID) {
        const { data, error } = await window.supabase
          .from('config')
          .select('key, value')
          .eq('site_id', window.SITE_ID);
        if (!error && data) {
          const config = {};
          data.forEach(row => { config[row.key] = row.value; });
          // Preenche os textos
          const aboutDesc1 = aboutPlaceholder.querySelector('.ud-about-content p');
          if (aboutDesc1) aboutDesc1.innerText = config.about_desc1 || '';
          const aboutDesc2 = aboutPlaceholder.querySelectorAll('.ud-about-content p')[1];
          if (aboutDesc2) aboutDesc2.innerText = config.about_desc2 || '';
          // Preenche a imagem
          const aboutImg = aboutPlaceholder.querySelector('.ud-about-image img');
          if (aboutImg) aboutImg.src = config.about_img || 'assets/images/about/about-image.svg';
        }
      }
    }


//Pricing 
    const pricingPlaceholder = document.getElementById('pricing-placeholder');
    if (pricingPlaceholder) {
      const resp = await fetch('assets/componets/pricing.html');
      const html = await resp.text();
      pricingPlaceholder.innerHTML = html;
      // Se precisar lógica JS específica para pricing, adicionar aqui
    }


    // Faq
    const faqPlaceholder = document.getElementById('faq-placeholder');
    if (faqPlaceholder) {
      const resp = await fetch('assets/componets/faq.html');
      const html = await resp.text();
      faqPlaceholder.innerHTML = html;
      // Se precisar lógica JS específica para faq, adicionar aqui
    }


    // Testimonials
    const testimonialsPlaceholder = document.getElementById('testimonials-placeholder');
    if (testimonialsPlaceholder) {
      const resp = await fetch('assets/componets/testimonials.html');
      const html = await resp.text();
      testimonialsPlaceholder.innerHTML = html;
      // Se precisar lógica JS específica para testimonials, adicionar aqui
    }



    // Team
    const teamPlaceholder = document.getElementById('team-placeholder');
    if (teamPlaceholder) { 
      const resp = await fetch('assets/componets/team.html');
      const html = await resp.text();
      teamPlaceholder.innerHTML = html;

    }
    // Preenche dinamicamente os textos e imagem do bloco Team


    // Contact
    const contactPlaceholder = document.getElementById('contact');
    if (contactPlaceholder) {
      const resp = await fetch('assets/componets/contact.html');
      const html = await resp.text();
      contactPlaceholder.innerHTML = html;
      // Se precisar lógica JS específica para o contact, adicionar aqui
    }




    // Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      const resp = await fetch('assets/componets/footer.html');
      const html = await resp.text();
      footerPlaceholder.innerHTML = html;
      // Se precisar lógica JS específica para o footer, adicionar aqui
    }


  });





  // ====== scroll top js (não depende do header) ======
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;
    const animateScroll = () => {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };
  document.addEventListener('DOMContentLoaded', function () {
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      backToTop.onclick = () => {
        scrollTo(document.documentElement);
      };
    }
  });

  // ===== Planos interativos: clique e hover nos cards =====
  document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".ud-single-pricing");
    cards.forEach((card) => {
      card.addEventListener("click", function () {
        cards.forEach((c) => c.classList.remove("active-clicked"));
        card.classList.add("active-clicked");
      });
      const btn = card.querySelector(".ud-pricing-footer a");
      if (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
        });
      }
      card.addEventListener("mouseenter", function () {
        card.classList.add("active-hover");
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("active-hover");
      });
    });
    //Botão Veja mais//
    const toggleBtn = document.getElementById("toggleIframeBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        document.getElementById("tour360").scrollIntoView({ behavior: "smooth" });
      });
    }
  });

})(); // <-- FECHA A FUNÇÃO IIFE AQUI
