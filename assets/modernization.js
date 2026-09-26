document.addEventListener('DOMContentLoaded',()=> {
  // Replace legacy text logo everywhere while keeping the home link intact.
  document.querySelectorAll('.nav-logo').forEach(link=>{
    if(!link.querySelector('img')){
      link.innerHTML='<img src="assets/logo-rmo.svg" alt="Ruşen M. Özoruç logo">';
      link.setAttribute('aria-label','Ruşen M. Özoruç — Home');
    }
  });

  // Search + sort for review archives.
  const isReviewArchive=/\/reviews\/(fantasy|scifi|nonfiction|other)\.html$/i.test(window.location.pathname);
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
      'About':'Hakkımda',
      'Original Stories':'Özgün Hikâyelerim',
      'Worldbuilding':'Dünya İnşası',
      'Reviews':'İncelemeler',
      'Book Reviews':'Kitap İncelemeleri',
      'Painted Miniatures':'Minyatürler',
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
      'Painted Miniatures':'Minyatürler',
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

  /* ---------- MANUAL HOMEPAGE TRANSLATIONS ---------- */
  const homepageTranslations={
    tr:{
      '#hero .hero-eyebrow':'Fantastik · Bilimkurgu · Dünya İnşası',
      '#hero .hero-sub':'Özgün hikâyeler yazıyorum, sıfırdan dünyalar inşa ediyorum ve beni geceleri ayakta tutan kitapları inceliyorum. Geri kalanı blog yazılarına, denemelere ve YouTube videolarına taşıyorum. Siz de okumak uğruna gereğinden fazla geç saatlere kadar ayakta kalanlardansanız, doğru yerdesiniz.',
      '#hero .hero-cta .btn-red':'Hikâyelerimi Oku',
      '#hero .hero-cta .btn-ghost':'Dünyaları Keşfet',
      '#hero .scroll-cue span':'Kaydır',

      '#about .section-tag':'Yazar',
      '#about .section-title':'Hakkımda',
      '#about .about-text > p:nth-of-type(1)':'Ben Ruşen Mustafa Özoruç. Dünya inşasına tutkuyla bağlı, hevesli bir kurgu okuru ve bu konular üzerine düşündüklerimi paylaşmayı seven biriyim.',
      '#about .about-text > p:nth-of-type(2)':'Burası kurgunun her hâline açık bir alan: fantastik, bilimkurgu, korku ve türlerin arasında kalan her şey. İster bir yıldız denizi, ister Orta Çağ sınırı, ister hiç var olmamış bir dünyanın kıyısı olsun; bilinen ufkun ötesinde ne olduğunu merak eden hikâyeler için.',
      '#about .about-text > p:nth-of-type(3)':'Burada fantastikten bilimkurguya ve ikisinin arasındaki her şeye uzanan özgün kısa hikâyelerimi bulacaksınız. Bunların yanında dünya inşası projeleri yer alıyor: yeni medeniyetler, alışılmadık coğrafyalar ve yalnızca sayfalarda yaşayan dünyalar için yazılmış tarihler. Ayrıca okuduğum ve önemsediğim eserler üzerine dürüst, ayrıntılı incelemeler paylaşıyorum. Söyleyecek daha fazla şeyim olduğunda ise bunlar blog yazılarına, denemelere ve beni en çok heyecanlandıran konulara daha derinlemesine girdiğim YouTube videolarına dönüşüyor.',
      '#about .about-text [style*="margin-top:40px"] .section-tag':'Beni İnternette Bul',
      '#about .meta-card:nth-child(1) .meta-label':'Kısa Hikâyeler',
      '#about .meta-card:nth-child(2) .meta-label':'Dünya Projeleri',
      '#about .meta-card:nth-child(3) .meta-label':'İncelemeler',
      '#about .meta-card:nth-child(4) .meta-label':'Yazılmamış Dünyalar',

      '#fiction .section-tag':'Yazı Odası',
      '#fiction .section-title':'Özgün Hikâyelerim',
      '#fiction .section-desc':'Fantastik, bilimkurgu ve türlerin arasında kalan her şeyden kısa hikâyeler.',
      '#fiction [data-panel="latest-stories"]':'En Yeniler',
      '#fiction [data-panel="fantasy-stories"]':'Fantastik',
      '#fiction [data-panel="scifi-stories"]':'Bilimkurgu',
      '#fiction [data-panel="other-stories"]':'Diğer',
      '#panel-latest-stories .fiction-coming-label':'✦ Tüm Türler',
      '#panel-latest-stories .fiction-coming-text':'Henüz yayımlanmış bir hikâye yok. Yakında burada olacaklar.',
      '#panel-latest-stories .fiction-archive-link:nth-of-type(1)':'Fantastiğe Göz At →',
      '#panel-latest-stories .fiction-archive-link:nth-of-type(2)':'Bilimkurguya Göz At →',
      '#panel-fantasy-stories .fiction-coming-label':'✦ Fantastik',
      '#panel-fantasy-stories .fiction-coming-text':'Henüz yayımlanmış fantastik bir hikâye yok. Yakında burada olacaklar.',
      '#panel-fantasy-stories .fiction-archive-link':'Arşivi Gör →',
      '#panel-scifi-stories .fiction-coming-label':'◈ Bilimkurgu',
      '#panel-scifi-stories .fiction-coming-text':'Henüz yayımlanmış bir bilimkurgu hikâyesi yok. Yakında burada olacaklar.',
      '#panel-scifi-stories .fiction-archive-link':'Arşivi Gör →',
      '#panel-other-stories .fiction-coming-label':'⬡ Diğer',
      '#panel-other-stories .fiction-coming-text':'Henüz bu kategoride yayımlanmış bir hikâye yok. Yakında burada olacaklar.',
      '#panel-other-stories .fiction-archive-link':'Arşivi Gör →',
      '#mobile-fiction-grid .mobile-genre-section-label':'✦ Türlere Göre Göz At',

      '#worlds .section-tag':'Atlas',
      '#worlds .section-title':'Özgün Dünya İnşası',
      '#worlds .section-desc':'Yalnızca sayfalarda yaşayan dünyalar için yeni medeniyetler, alışılmadık coğrafyalar ve hayal edilmiş tarihler.',
      '#worlds [data-worldpanel="world-latest"]':'En Yeniler',
      '#worlds [data-worldpanel="world-fantasy"]':'Fantastik',
      '#worlds [data-worldpanel="world-althistory"]':'Alternatif Tarih',
      '#worlds [data-worldpanel="world-scifi"]':'Bilimkurgu',
      '#panel-world-latest .fiction-coming-label':'⬡ En Yeniler',
      '#panel-world-latest .fiction-coming-text':'Henüz yayımlanmış bir dünya yok. Atlas hâlâ çiziliyor.',
      '#panel-world-fantasy .fiction-coming-label':'✦ Fantastik Dünyalar',
      '#panel-world-fantasy .fiction-coming-text':'Henüz yayımlanmış fantastik bir dünya yok. Atlas hâlâ çiziliyor.',
      '#panel-world-fantasy .fiction-archive-link':'Arşivi Gör →',
      '#panel-world-althistory .fiction-coming-label':'◈ Alternatif Tarih',
      '#panel-world-althistory .fiction-coming-text':'Henüz yayımlanmış bir alternatif tarih dünyası yok. Atlas hâlâ çiziliyor.',
      '#panel-world-althistory .fiction-archive-link':'Arşivi Gör →',
      '#panel-world-scifi .fiction-coming-label':'◈ Bilimkurgu',
      '#panel-world-scifi .fiction-coming-text':'Henüz yayımlanmış bir bilimkurgu dünyası yok. Atlas hâlâ çiziliyor.',
      '#panel-world-scifi .fiction-archive-link':'Arşivi Gör →',
      '#mobile-worlds-grid .mobile-genre-section-label':'Dünya İnşası Arşivine Göz At',

      '#reviews .section-tag':'Kütüphane',
      '#reviews .section-title':'Kitap İncelemeleri',
      '#reviews .section-desc':'Kitap incelemeleri arşivimi İngilizce ve Türkçe olarak yeniden hazırlıyorum.',
      '#reviews .rv-coming-genre':'English + Türkçe',
      '#reviews .rv-coming-text':'Eski incelemeleri kaldırdım. İncelemeleri İngilizce ve Türkçe olarak yeniden hazırladıkça burada tekrar yayımlayacağım.',
      '#reviews .mobile-genre-section-label':'Kitap İncelemelerine Göz At',

      '#miniatures .section-tag':'Boyama Masası',
      '#miniatures .section-title':'Minyatürler',
      '#miniatures .section-desc':'Boyadığım Warhammer ve StarCraft minyatürlerini fotoğraflayıp burada arşivliyorum.',
      '#miniatures .mini-home-preview-image span':'Önizleme görseli',
      '#miniatures .mini-home-kicker':'En Son Boyadıklarım',
      '#miniatures .mini-home-preview-copy h3 a':'Minyatür Adı',
      '#miniatures .mini-home-preview-copy p':'En son boyadığım minyatür; fotoğrafları, boyanma tarihi, fraksiyon bilgileri ve kendi boyama notlarımla birlikte burada yer alacak.',
      '#miniatures .mini-home-preview-copy .btn':'Minyatür Galerisine Git',
      '#miniatures .mini-home-group.warhammer strong':'7 koleksiyon',
      '#miniatures .mini-home-group.starcraft strong':'4 koleksiyon',

      '#irl .irl-aside-tag':'Günlük',
      '#irl .irl-aside-title':'Sayfanın Ötesinde',
      '#irl .irl-aside-desc':'Hikâyelerin dışında kalan her şey için bir alan: yazmak üzerine düşünceler, okuma hayatı, yaratıcı süreç ve o sıralar kafamı meşgul eden ne varsa.',
      '#irl .irl-aside-note':'Söylemek istediğim her şey bir incelemeye ya da hikâyeye sığmıyor. Geri kalanına burada yer veriyorum.',
      '#irl .irl-post-cat':'Güncelleme',
      '#irl .irl-post-title a':'Uzun Bir Aradan Sonra',
      '#irl .irl-post-body':'Vay be, epey zaman geçmiş. Bir günlük yazısı yazmayalı gerçekten uzun zaman oldu; hatta bu siteyi açmamdan neredeyse iki yıl öncesine dayanıyor. O zamanlar ücretsiz bir WordPress sitesindeydim....',
      '#irl .irl-post-link':'Yazıyı Oku →',

      '#manifesto .manifesto-text':'Hikâyeler, başka türlü açıklayamadığımız şeyleri anlamlandırmanın en eski yollarından biri. Kurgu yalnızca bugünden kaçmak değildir; bundan daha tuhaf ve daha işe yarar bir şeydir. Kuralları biraz farklı bir alan kurar ve bu sayede kendi dünyamızı daha açık, kendimizi ise daha dürüst görebiliriz. Gerçek dünya üzerimize fazla ağır geldiğinde de bize başka bir yerde durma şansı verir; oradan dönüp her şeye taze gözlerle bakabiliriz.',

      '#subscribe .subscribe-tag':'Yeni Yazılardan Haberdar Ol',
      '#subscribe .subscribe-title':'Arşive Katıl',
      '#subscribe .subscribe-desc':'Yeni bir hikâye, inceleme, dünya inşası yazısı ya da blog gönderisi yayımladığımda doğrudan gelen kutunuza gelsin. Gereksiz e-posta yok; yalnızca yeni içerikler.',
      '#subscribe .subscribe-btn':'Abone Ol',
      '#subscribe .subscribe-success':'✦ Arşive katıldın. Hoş geldin.',
      '#subscribe .subscribe-note':'Spam yok. Sabit bir gönderim takvimi yok. İstediğin zaman abonelikten çıkabilirsin.',

      'footer .footer-desc':'Fantastik, bilimkurgu ve spekülatif kurgu üzerine özgün hikâyeler, dünya inşası projeleri ve kitap incelemeleri.',
      'footer .footer-col-title:nth-of-type(1)':'Gezin',
      'footer .footer-copy':'© 2025 Ruşen M. Özoruç — Tüm hakları saklıdır',
      'footer .footer-creed':'Her harita aynı zamanda bir hikâye anlatır'
    }
  };

  const homepageOriginal=new Map();

  function applyHomepageTranslations(lang){
    const map=homepageTranslations[lang]||{};
    Object.keys(map).forEach(selector=>{
      document.querySelectorAll(selector).forEach((el,index)=>{
        const key=selector+'::'+index;
        if(!homepageOriginal.has(key)){
          homepageOriginal.set(key,{
            html:el.innerHTML,
            text:el.textContent
          });
        }
        const value=map[selector];
        if(lang==='tr'){
          el.textContent=value;
        }
      });
    });

    if(lang==='en'){
      homepageOriginal.forEach((original,key)=>{
        const split=key.lastIndexOf('::');
        const selector=key.slice(0,split);
        const index=Number(key.slice(split+2));
        const el=document.querySelectorAll(selector)[index];
        if(el) el.innerHTML=original.html;
      });
    }

    // Rich text where emphasis is part of the design.
    const rich={
      '#about .section-title':lang==='tr'?'Hakkımda':null,
      '#fiction .section-title':lang==='tr'?'Özgün <em>Hikâyelerim</em>':null,
      '#worlds .section-title':lang==='tr'?'Özgün <em>Dünya İnşası</em>':null,
      '#reviews .section-title':lang==='tr'?'Kitap <em>İncelemeleri</em>':null,
      '#miniatures .section-title':lang==='tr'?'<em>Minyatürler</em>':null,
      '#irl .irl-aside-title':lang==='tr'?'Sayfanın <em>Ötesinde</em>':null,
      '#subscribe .subscribe-title':lang==='tr'?'Arşive <em>Katıl</em>':null,
      '#manifesto .manifesto-text':lang==='tr'
        ?'Hikâyeler, başka türlü açıklayamadığımız şeyleri anlamlandırmanın her zaman bir yolu oldu. Kurgu, bugünden kaçıştan ibaret değildir. Bundan <strong>daha tuhaf ve daha kullanışlı</strong> bir şeydir. Kuralların yeterince farklı olduğu bir alan kurar; böylece kendi dünyamızı daha net, kendimizi ise daha dürüst görebiliriz. Gerçek dünya omuzlarımıza fazla ağır çöktüğünde de bize durabileceğimiz başka bir yer verir; oradan dönüp ona <strong>taze gözlerle</strong> bakabiliriz.'
        :null
    };
    Object.entries(rich).forEach(([selector,value])=>{
      const el=document.querySelector(selector);
      if(!el) return;
      const key='rich:'+selector;
      if(!homepageOriginal.has(key)) homepageOriginal.set(key,{html:el.innerHTML,text:el.textContent});
      if(lang==='tr' && value!==null) el.innerHTML=value;
      if(lang==='en') el.innerHTML=homepageOriginal.get(key).html;
    });

    // Repeated labels/cards that are easier to handle by exact English copy.
    const exactTr={
      'Fantasy':'Fantastik',
      'Science Fiction':'Bilimkurgu',
      'Non-Fiction':'Kurgu Dışı',
      'Other':'Diğer',
      'Other · History':'Diğer · Tarih',
      'Fantasy Worlds':'Fantastik Dünyalar',
      'Alternate History':'Alternatif Tarih',
      'Browse →':'Göz At →',
      'Latest':'En Yeniler',
      'Reviews':'İncelemeler',
      'Original Stories':'Özgün Hikâyelerim',
      'Worldbuilding':'Dünya İnşası',
      'Book Reviews':'Kitap İncelemeleri',
      'Navigate':'Gezin',
      'Terrain':'Arazi'
    };
    document.querySelectorAll(
      '#fiction .mobile-genre-card-name,#fiction .mobile-genre-card-arrow,'+
      '#worlds .mobile-genre-card-name,#worlds .mobile-genre-card-arrow,'+
      '#reviews .mobile-genre-card-name,#reviews .mobile-genre-card-arrow,'+
      'footer .footer-col-title,footer .footer-links a'
    ).forEach(el=>{
      const key='exact:'+Array.from(document.querySelectorAll(
        '#fiction .mobile-genre-card-name,#fiction .mobile-genre-card-arrow,'+
        '#worlds .mobile-genre-card-name,#worlds .mobile-genre-card-arrow,'+
        '#reviews .mobile-genre-card-name,#reviews .mobile-genre-card-arrow,'+
        'footer .footer-col-title,footer .footer-links a'
      )).indexOf(el);
      if(!homepageOriginal.has(key)) homepageOriginal.set(key,{html:el.innerHTML,text:el.textContent});
      const original=homepageOriginal.get(key).text.trim();
      if(lang==='tr' && exactTr[original]) el.textContent=exactTr[original];
      if(lang==='en') el.innerHTML=homepageOriginal.get(key).html;
    });
  }


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

    applyHomepageTranslations(lang);
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
