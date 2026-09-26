document.addEventListener('DOMContentLoaded',()=> {
  // Replace legacy text logo everywhere while keeping the home link intact.
  document.querySelectorAll('.nav-logo').forEach(link=>{
    if(!link.querySelector('img')){
      link.innerHTML='<img src="assets/logo-rmo.svg" alt="Ruşen M. Özoruç logo">';
      link.setAttribute('aria-label','Ruşen M. Özoruç — Home');
    }
  });

  // Search + sort for review archives.
  const isReviewArchive=/\/archive-rv-[^/]+\.html$/i.test(window.location.pathname) || /^archive-rv-[^/]+\.html$/i.test(window.location.pathname.replace(/^\//,''));
  const grid=isReviewArchive ? document.querySelector('.entries-grid') : null;
  const cards=grid ? [...grid.querySelectorAll('.entry-card')] : [];
  if(grid && cards.length){
    const tools=document.createElement('div');
    tools.className='review-tools';
    tools.innerHTML=
      '<input class="review-search" type="search" aria-label="Search reviews" placeholder="Search by title, author, or keyword…">'+
      '<select class="review-sort" aria-label="Sort reviews">'+
        '<option value="original">Original order</option>'+
        '<option value="title">Title A–Z</option>'+
        '<option value="author">Author A–Z</option>'+
      '</select>'+
      '<div class="review-result-count" aria-live="polite"></div>';
    grid.parentNode.insertBefore(tools,grid);

    const empty=document.createElement('div');
    empty.className='review-empty';
    empty.textContent='No reviews match that search yet.';
    grid.parentNode.insertBefore(empty,grid.nextSibling);

    const search=tools.querySelector('.review-search');
    const sort=tools.querySelector('.review-sort');
    const count=tools.querySelector('.review-result-count');
    const original=[...cards];

    const textFor=(card,selector)=>(card.querySelector(selector)?.textContent||'').trim();
    function update(){
      const q=search.value.trim().toLocaleLowerCase();
      const visible=cards.filter(card=>{
        const hay=(textFor(card,'.entry-card-title')+' '+textFor(card,'.entry-card-author')+' '+textFor(card,'.entry-card-excerpt')).toLocaleLowerCase();
        const show=!q || hay.includes(q);
        card.hidden=!show;
        return show;
      });

      let ordered=[...visible];
      if(sort.value==='title') ordered.sort((a,b)=>textFor(a,'.entry-card-title').localeCompare(textFor(b,'.entry-card-title')));
      if(sort.value==='author') ordered.sort((a,b)=>textFor(a,'.entry-card-author').localeCompare(textFor(b,'.entry-card-author')));
      if(sort.value==='original') ordered=original.filter(card=>!card.hidden);
      ordered.forEach(card=>grid.appendChild(card));

      count.textContent=visible.length+' review'+(visible.length===1?'':'s')+' shown';
      empty.classList.toggle('show',visible.length===0);
    }
    search.addEventListener('input',update);
    sort.addEventListener('change',update);
    update();
  }

  // Avoid wasting resources when the tab is in the background.
  document.addEventListener('visibilitychange',()=>{
    document.documentElement.classList.toggle('page-hidden',document.hidden);
  });
});


/* ---------- GLOBAL THEME + LANGUAGE CONTROLS ---------- */
(() => {
  const ROOT=document.documentElement;
  const THEME_KEY='rmo-theme';
  const LANG_KEY='rmo-lang';

  const translations={
    tr:{
      'About':'Hakkında',
      'Original Stories':'Özgün Hikâyeler',
      'Worldbuilding':'Dünya Kurma',
      'Reviews':'İncelemeler',
      'Book Reviews':'Kitap İncelemeleri',
      'Painted Miniatures':'Boyanmış Minyatürler',
      'IRL':'Günlük',
      'Subscribe':'Abone Ol',
      'Fantasy':'Fantastik',
      'Science Fiction':'Bilimkurgu',
      'Other':'Diğer',
      'History':'Tarih',
      'Other · History':'Diğer · Tarih',
      'Fantasy Worlds':'Fantastik Dünyalar',
      'Alternate History':'Alternatif Tarih',
      'Non-Fiction':'Kurgu Dışı',
      'World Eaters':'World Eaters',
      "Emperor's Children":"Emperor's Children",
      'Adeptus Astartes':'Adeptus Astartes',
      'Orks':'Orklar',
      'Death Guard':'Death Guard',
      'Thousand Sons':'Thousand Sons',
      'Terrain':'Arazi',
      'Warhammer':'Warhammer',
      'StarCraft':'StarCraft',
      'Terran':'Terran',
      'Zerg':'Zerg',
      'Protoss':'Protoss',
      'Painted Miniatures':'Boyanmış Minyatürler',
      'The Painting Desk':'Boyama Masası',
      'Most Recent Miniatures':'En Son Boyanan Minyatürler',
      'Open Miniature Gallery':'Minyatür Galerisini Aç',
      'Photography in progress':'Fotoğraf çekimleri hazırlanıyor',
      'Painting Notes':'Boyama Notları',
      'From the painting desk':'Boyama masasından',
      'Painted':'Boyanma Tarihi',
      'Faction':'Fraksiyon',
      'Game':'Oyun',
      'Photos':'Fotoğraflar',
      'Back to miniature gallery':'Minyatür galerisine dön',
      'Search reviews':'İncelemelerde ara',
      'Search by title, author, or keyword…':'Başlık, yazar veya anahtar kelime ile ara…',
      'Sort reviews':'İncelemeleri sırala',
      'Original order':'Varsayılan sıra',
      'Title A–Z':'Başlık A–Z',
      'Author A–Z':'Yazar A–Z',
      'No reviews match that search yet.':'Bu aramayla eşleşen inceleme yok.',
      'review shown':'inceleme gösteriliyor',
      'reviews shown':'inceleme gösteriliyor'
    }
  };

  const originalText=new WeakMap();

  function rememberAndTranslate(el,lang){
    if(!el || el.children.length) return;
    const raw=(el.textContent||'').trim();
    if(!raw) return;
    if(!originalText.has(el)) originalText.set(el,el.textContent);
    const original=(originalText.get(el)||'').trim();
    if(lang==='en'){
      el.textContent=originalText.get(el);
      return;
    }
    const mapped=translations[lang]?.[original];
    if(mapped){
      const before=(originalText.get(el).match(/^\s*/)||[''])[0];
      const after=(originalText.get(el).match(/\s*$/)||[''])[0];
      el.textContent=before+mapped+after;
    }
  }

  function translateUI(lang){
    ROOT.lang=lang;
    document.querySelectorAll(
      '.nav-links a,.dropdown-col-title,.dropdown-link,.mobile-menu-links a,'+
      '.section-tag,.mini-home-kicker,.mini-home-group-label,.mini-detail-kicker,'+
      '.mini-detail-fact-label,.mini-detail-notes-label,.mini-detail-back,'+
      '.review-result-count,.review-search option,.review-sort option'
    ).forEach(el=>rememberAndTranslate(el,lang));

    const search=document.querySelector('.review-search');
    if(search){
      if(!search.dataset.enPlaceholder) search.dataset.enPlaceholder=search.placeholder;
      search.placeholder=lang==='tr'
        ? translations.tr['Search by title, author, or keyword…']
        : search.dataset.enPlaceholder;
      search.setAttribute('aria-label',lang==='tr'?'İncelemelerde ara':'Search reviews');
    }
    const sort=document.querySelector('.review-sort');
    if(sort) sort.setAttribute('aria-label',lang==='tr'?'İncelemeleri sırala':'Sort reviews');

    document.dispatchEvent(new CustomEvent('rmo:languagechange',{detail:{lang}}));
  }

  function setTheme(theme,persist=true){
    const value=theme==='light'?'light':'dark';
    ROOT.dataset.theme=value;
    if(persist) localStorage.setItem(THEME_KEY,value);
    const btn=document.querySelector('[data-rmo-theme-toggle]');
    if(btn){
      btn.setAttribute('aria-pressed',String(value==='light'));
      btn.setAttribute('aria-label',value==='dark'?'Switch to light mode':'Switch to dark mode');
      btn.querySelector('.rmo-toggle-value').textContent=value==='dark'?'Dark':'Light';
    }
  }

  function setLanguage(lang,persist=true){
    const value=lang==='tr'?'tr':'en';
    ROOT.dataset.lang=value;
    if(persist) localStorage.setItem(LANG_KEY,value);
    const btn=document.querySelector('[data-rmo-lang-toggle]');
    if(btn){
      btn.setAttribute('aria-pressed',String(value==='tr'));
      btn.setAttribute('aria-label',value==='en'?'Türkçeye geç':'Switch to English');
      btn.querySelector('.rmo-toggle-value').textContent=value==='en'?'EN':'TR';
    }
    translateUI(value);
  }

  function mountControls(){
    if(document.querySelector('.rmo-site-controls')) return;
    const wrap=document.createElement('div');
    wrap.className='rmo-site-controls';
    wrap.innerHTML=
      '<button type="button" class="rmo-site-toggle" data-rmo-theme-toggle>'+
        '<span class="rmo-toggle-icon" aria-hidden="true">◐</span>'+
        '<span class="rmo-toggle-value">Dark</span>'+
      '</button>'+
      '<button type="button" class="rmo-site-toggle" data-rmo-lang-toggle>'+
        '<span class="rmo-toggle-icon" aria-hidden="true">文</span>'+
        '<span class="rmo-toggle-value">EN</span>'+
      '</button>';

    const hamburger=document.querySelector('.hamburger');
    if(hamburger?.parentElement){
      hamburger.parentElement.insertBefore(wrap,hamburger);
    }else{
      document.body.appendChild(wrap);
      wrap.classList.add('rmo-site-controls-floating');
    }

    wrap.querySelector('[data-rmo-theme-toggle]').addEventListener('click',()=>{
      setTheme(ROOT.dataset.theme==='light'?'dark':'light');
    });
    wrap.querySelector('[data-rmo-lang-toggle]').addEventListener('click',()=>{
      setLanguage(ROOT.dataset.lang==='tr'?'en':'tr');
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    mountControls();
    setTheme(localStorage.getItem(THEME_KEY)||'dark',false);
    setLanguage(localStorage.getItem(LANG_KEY)||'en',false);
  });
})();
