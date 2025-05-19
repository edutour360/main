(function () {
  "use strict";

  // ======= Sticky
  window.onscroll = function () {
    const ud_header = document.querySelector(".ud-header");
    const sticky = ud_header.offsetTop;
    const logo = document.querySelector(".navbar-brand img");

    if (window.pageYOffset > sticky) {
      ud_header.classList.add("sticky");
    } else {
      ud_header.classList.remove("sticky");
    }

    // === logo change
    if (ud_header.classList.contains("sticky")) {
      logo.src = "assets/images/logo/logo2.svg";
    } else {
      logo.src = "assets/images/logo/logo.svg";
    }

    // show or hide the back-top-top button
    const backToTop = document.querySelector(".back-to-top");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  };

  //===== close navbar-collapse when a  clicked
  let navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  document.querySelectorAll(".ud-menu-scroll").forEach((e) =>
    e.addEventListener("click", () => {
      navbarToggler.classList.remove("active");
      navbarCollapse.classList.remove("show");
    })
  );
  navbarToggler.addEventListener("click", function () {
    navbarToggler.classList.toggle("active");
    navbarCollapse.classList.toggle("show");
  }); // <-- FECHA AQUI!

  // ===== submenu
  const submenuButton = document.querySelectorAll(".nav-item-has-children");
  submenuButton.forEach((elem) => {
    elem.querySelector("a").addEventListener("click", () => {
      elem.querySelector(".ud-submenu").classList.toggle("show");
    });
  });

  // ===== wow js
  new WOW().init();

  // ====== scroll top js
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

  document.querySelector(".back-to-top").onclick = () => {
    scrollTo(document.documentElement);
  };

  // ===== Planos interativos: clique e hover nos cards =====

  document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".ud-single-pricing");

    cards.forEach((card) => {
      // Ao clicar no card inteiro (exceto botão), ativa visual azul
      card.addEventListener("click", function () {
        cards.forEach((c) => c.classList.remove("active-clicked"));
        card.classList.add("active-clicked");
      });

      // Evita que o botão de compra dispare o clique no card
      const btn = card.querySelector(".ud-pricing-footer a");
      if (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
        });
      }

      // Adiciona/remova a classe ao passar o mouse (hover)
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

  // ====== Header Auth Buttons ======
  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.supabase) {
      // Inicializa Supabase se não existir
      const supabaseUrl = 'https://xbrahrggojoqtmxogsbz.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhicmFocmdnb2pvcXRteG9nc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTQ3NjIsImV4cCI6MjA2MjkzMDc2Mn0.VrBq_UNDTiUd8et6M60Wqy6E52iVuXrqaFEojzPZUB0';
      window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
    }
    const { data: { session } } = await window.supabase.auth.getSession();
    const btnContainer = document.querySelector('.navbar-btn');
    if (!btnContainer) return;
    btnContainer.innerHTML = '';
    if (session) {
      // Logado: mostra Minha Conta e Sair
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
      // Não logado: mostra Entre e Cadastre-se
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
  });

  document.addEventListener('DOMContentLoaded', function() {
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
    const nav = document.getElementById('nav');
    if (!nav) return;
    const inicioLink = Array.from(nav.querySelectorAll('a')).find(a => a.textContent.trim() === 'Inicio');
    if (!inicioLink) return;
    if (!isIndex) {
      inicioLink.classList.remove('ud-menu-scroll');
      inicioLink.setAttribute('href', 'index.html');
      inicioLink.onclick = null;
    } else {
      inicioLink.classList.add('ud-menu-scroll');
      inicioLink.setAttribute('href', '#top');
    }
  });

})(); // <-- FECHA A FUNÇÃO IIFE AQUI
