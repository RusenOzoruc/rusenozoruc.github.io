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



  /* ---------- MANUAL SUBPAGE TRANSLATIONS ---------- */
  const subpageTextTranslations={
  "tr": {
    "Fantasy — Book Reviews — Ruşen M. Özoruç": "Fantastik — Kitap İncelemeleri — Ruşen M. Özoruç",
    "Science Fiction — Book Reviews — Ruşen M. Özoruç": "Bilimkurgu — Kitap İncelemeleri — Ruşen M. Özoruç",
    "Non-Fiction — Book Reviews — Ruşen M. Özoruç": "Kurgu Dışı — Kitap İncelemeleri — Ruşen M. Özoruç",
    "Other — Book Reviews — Ruşen M. Özoruç": "Diğer — Kitap İncelemeleri — Ruşen M. Özoruç",
    "Fantasy — Original Stories — Ruşen M. Özoruç": "Fantastik — Özgün Hikâyelerim — Ruşen M. Özoruç",
    "Science Fiction — Original Stories — Ruşen M. Özoruç": "Bilimkurgu — Özgün Hikâyelerim — Ruşen M. Özoruç",
    "Other — Original Stories — Ruşen M. Özoruç": "Diğer — Özgün Hikâyelerim — Ruşen M. Özoruç",
    "Fantasy Worlds — Worldbuilding — Ruşen M. Özoruç": "Fantastik Dünyalar — Dünya İnşası — Ruşen M. Özoruç",
    "Science Fiction Worlds — Worldbuilding — Ruşen M. Özoruç": "Bilimkurgu Dünyaları — Dünya İnşası — Ruşen M. Özoruç",
    "Alternate History — Worldbuilding — Ruşen M. Özoruç": "Alternatif Tarih — Dünya İnşası — Ruşen M. Özoruç",
    "Painted Miniatures — Ruşen M. Özoruç": "Minyatürler — Ruşen M. Özoruç",
    "Miniature Preview — Painted Miniatures — Ruşen M. Özoruç": "Minyatür Önizlemesi — Ruşen M. Özoruç",
    "IRL — Blog Posts — Ruşen M. Özoruç": "Günlük — Blog Yazıları — Ruşen M. Özoruç",
    "Back from Hiatus — Ruşen M. Özoruç": "Uzun Bir Aradan Sonra — Ruşen M. Özoruç",
    "Home": "Ana Sayfa",
    "By": "Yazan",
    "Back to Reviews": "İncelemelere Dön",
    "← All Reviews": "← Tüm İncelemeler",
    "← All Stories": "← Tüm Hikâyeler",
    "← All Worlds": "← Tüm Dünyalar",
    "← All Posts": "← Tüm Yazılar",
    "← Home": "← Ana Sayfa",
    "Subscribe for updates": "Yeni içeriklerden haberdar ol",
    "Reviews Home": "İncelemeler Ana Sayfası",
    "Fantasy reviews will return here as the bilingual review library is rebuilt.": "Fantastik kitap incelemeleri, iki dilli arşiv yeniden hazırlandıkça burada yayımlanacak.",
    "Science-fiction reviews will return here as the bilingual review library is rebuilt.": "Bilimkurgu kitap incelemeleri, iki dilli arşiv yeniden hazırlandıkça burada yayımlanacak.",
    "Non-fiction reviews will return here as the bilingual review library is rebuilt.": "Kurgu dışı kitap incelemeleri, iki dilli arşiv yeniden hazırlandıkça burada yayımlanacak.",
    "This shelf is being rebuilt in English and Turkish. New reviews will appear here as they are updated.": "Bu bölüm İngilizce ve Türkçe olarak yeniden hazırlanıyor. Güncellenen incelemeler burada yayımlanacak.",
    "0 reviews": "0 inceleme",
    "History and other reviews that do not fit neatly into the main shelves will live here.": "Tarih kitapları ve ana kategorilere tam olarak uymayan diğer incelemeler burada yer alacak.",
    "History & other books.": "Tarih ve diğer kitaplar.",
    "History is now a dedicated subgenre on this shelf, alongside other books that do not fit neatly into Fantasy, Science Fiction, or Non-Fiction.": "Tarih artık bu bölümde ayrı bir alt tür. Fantastik, Bilimkurgu veya Kurgu Dışı kategorilerine tam olarak uymayan diğer kitaplar da burada yer alacak.",
    "Stories": "Hikâyeler",
    "✦ Fantasy": "✦ Fantastik",
    "◈ Sci-Fi": "◈ Bilimkurgu",
    "⬡ Other": "⬡ Diğer",
    "Epic fantasy, grimdark, dark fantasy, mythpunk, romantasy, dark academia and all things fantasy.": "Epik fantastik, grimdark, karanlık fantastik, mitpunk, romantasy, dark academia ve fantastiğin diğer tüm biçimleri.",
    "Cyberpunk, space opera, military sci-fi, cosmic horror, dystopian, time travel and more.": "Cyberpunk, uzay operası, askerî bilimkurgu, kozmik korku, distopya, zaman yolculuğu ve daha fazlası.",
    "Alternate history, weird fiction and everything that refuses to fit neatly into a single genre.": "Alternatif tarih, weird fiction ve tek bir türe sığmayı reddeden diğer hikâyeler.",
    "0 stories": "0 hikâye",
    "Nothing here yet. Check back soon.": "Henüz burada bir şey yok. Yakında tekrar uğrayın.",
    "Worlds": "Dünyalar",
    "Secondary worlds, strange geographies and histories built for worlds that live only on the page.": "Yalnızca sayfalarda yaşayan dünyalar için oluşturulmuş ikincil dünyalar, alışılmadık coğrafyalar ve hayal edilmiş tarihler.",
    "Future civilisations, interstellar systems and speculative societies built from the ground up.": "Sıfırdan inşa edilmiş gelecek medeniyetleri, yıldızlararası sistemler ve spekülatif toplumlar.",
    "◈ Alt-History": "◈ Alternatif Tarih",
    "Alternate": "Alternatif",
    "History": "Tarih",
    "Worlds built on different pasts — civilisations that took another road and never looked back.": "Farklı geçmişler üzerine kurulmuş dünyalar; başka bir yola sapmış ve bir daha geriye bakmamış medeniyetler.",
    "0 worlds": "0 dünya",
    "Original": "Özgün",
    "Painted": "Boyanmış",
    "Miniatures": "Minyatürler",
    "Painted Miniatures": "Minyatürler",
    "The Painting Desk": "Boyama Masası",
    "A visual archive of the miniatures I paint. Each finished entry can hold multiple photos, the date I finished painting it, its game and faction, and notes about the paint job in my own words.": "Boyadığım minyatürlerin görsel arşivi. Tamamlanan her kayıt birden fazla fotoğrafı, boyamayı bitirdiğim tarihi, ait olduğu oyun ve fraksiyonu ve boyama sürecine dair kendi notlarımı içerebilir.",
    "Painted entries": "Boyanmış kayıtlar",
    "Photos published": "Yayımlanan fotoğraflar",
    "Collection groups": "Koleksiyon grupları",
    "Latest paint date": "Son boyama tarihi",
    "The Armies": "Ordular",
    "0 painted entries": "0 boyanmış kayıt",
    "0 published": "0 yayımlanmış",
    "The Koprulu Sector": "Koprulu Sektörü",
    "Preview cards — placeholder images only": "Önizleme kartları — yalnızca geçici görseller",
    "Preview": "Önizleme",
    "3 photos": "3 fotoğraf",
    "4 photos": "4 fotoğraf",
    "2 photos": "2 fotoğraf",
    "Miniature Name": "Minyatür Adı",
    "Your painting note will appear here. You can write about the scheme, techniques, mistakes, favourite details, or anything else you want to remember.": "Boyama notunuz burada görünecek. Renk şeması, kullandığınız teknikler, yaptığınız hatalar, sevdiğiniz ayrıntılar veya hatırlamak istediğiniz başka herhangi bir şey hakkında yazabilirsiniz.",
    "Painted · DD MMM YYYY": "Boyandı · GG AAA YYYY",
    "This is where your own note goes. Longer notes can wrap naturally without making the image area smaller.": "Kendi notunuz burada yer alacak. Uzun notlar, görsel alanını küçültmeden doğal biçimde devam edebilir.",
    "The same card design works for StarCraft, including several angles and a note written by you.": "Aynı kart tasarımı StarCraft için de çalışır; farklı açılardan fotoğraflar ve sizin yazdığınız bir not içerebilir.",
    "No preview card matches this filter.": "Bu filtreyle eşleşen bir önizleme kartı yok.",
    "These are temporary layout examples only. Your real painted miniatures will replace them later.": "Bunlar yalnızca geçici yerleşim örnekleri. Daha sonra gerçek boyanmış minyatürleriniz bunların yerini alacak.",
    "What each miniature entry can contain": "Her minyatür kaydında neler bulunabilir",
    "One hero photo plus additional angles/detail photos, miniature name, game, faction, date painted, your personal painting note, and optional details such as model type, unit, paint scheme, basing, or status.": "Bir ana fotoğraf ve ek açı/detay fotoğrafları, minyatür adı, oyun, fraksiyon, boyanma tarihi, kişisel boyama notunuz ve isteğe bağlı olarak model türü, birlik, renk şeması, base çalışması veya durum gibi ayrıntılar.",
    "← Back to miniature gallery": "← Minyatür galerisine dön",
    "Preview entry": "Önizleme kaydı",
    "Individual miniature page preview": "Tekil minyatür sayfası önizlemesi",
    "Faction": "Fraksiyon",
    "Game": "Oyun",
    "Photos": "Fotoğraflar",
    "PLACEHOLDER DATA — this page is only showing how a real miniature entry will look.": "GEÇİCİ VERİ — bu sayfa yalnızca gerçek bir minyatür kaydının nasıl görüneceğini gösteriyor.",
    "From the painting desk": "Boyama masasından",
    "Painting Notes": "Boyama Notları",
    "This is where your own note about the miniature will live. It can be short, or it can become a full painting journal entry when a model deserves more space.": "Minyatür hakkındaki kendi notunuz burada yer alacak. Kısa olabilir ya da bir model daha fazla alanı hak ediyorsa tam bir boyama günlüğü yazısına dönüşebilir.",
    "You can write about the colour scheme, techniques you tried, mistakes you made, details you are proud of, what you would change next time, basing choices, or simply what the model was like to paint.": "Renk şeması, denediğiniz teknikler, yaptığınız hatalar, gurur duyduğunuz ayrıntılar, bir dahaki sefere değiştireceğiniz şeyler, base tercihleri veya yalnızca modeli boyamanın nasıl bir deneyim olduğu hakkında yazabilirsiniz.",
    "When this becomes a real miniature page, this entire area is yours. There is no fixed template forcing you to fill in technical fields you do not care about.": "Bu gerçek bir minyatür sayfasına dönüştüğünde bu alan tamamen size ait olacak. İlgilenmediğiniz teknik alanları doldurmanızı zorlayan sabit bir şablon yok.",
    "◎ IRL": "◎ Günlük",
    "IRL —": "Günlük —",
    "Blog Posts": "Blog Yazıları",
    "Blog posts, essays, process notes and everything that does not fit anywhere else.": "Blog yazıları, denemeler, süreç notları ve başka hiçbir yere tam olarak sığmayan her şey.",
    "1 post": "1 yazı",
    "All IRL Posts": "Tüm Günlük Yazıları",
    "Back from Hiatus": "Uzun Bir Aradan Sonra",
    "Update · June 2026": "Güncelleme · Haziran 2026",
    "June 2026": "Haziran 2026",
    "Read →": "Oku →",
    "Boy oh boy, it has been a while. A long while since I've written an IRL post, almost two years before I launched this website. Back then I was on an old WordPress free trial site....": "Vay be, epey zaman geçmiş. Bir günlük yazısı yazmayalı gerçekten uzun zaman oldu; hatta bu siteyi açmamdan neredeyse iki yıl öncesine dayanıyor. O zamanlar ücretsiz deneme sürümündeki eski bir WordPress sitesindeydim....",
    "Update": "Güncelleme",
    "Boy oh boy, it has been a while. A long while since I've written an IRL post, almost two years before I launched this website. Back then I was on an old WordPress free trial site. Now I have a better one, thanks to Claude! Anyway, I would like to use this blog post to tell you what has been going on, what I have been doing, why I haven't been uploading any videos, and what my future plans are. So here we go.": "Vay be, epey zaman geçmiş. Bir günlük yazısı yazmayalı gerçekten uzun zaman oldu; hatta bu siteyi açmamdan neredeyse iki yıl öncesine dayanıyor. O zamanlar ücretsiz deneme sürümündeki eski bir WordPress sitesindeydim. Şimdi Claude sayesinde çok daha iyi bir sitem var! Her neyse, bu yazıda neler olup bittiğini, neler yaptığımı, neden video yüklemediğimi ve gelecek planlarımın neler olduğunu anlatmak istiyorum. Başlayalım.",
    "First: Burnout.": "Birincisi: Tükenmişlik.",
    "Second: Financial roadblocks.": "İkincisi: Maddi engeller.",
    "Building a PC in Türkiye during a period of both global supply chain disruption and a weakening lira is not for the faint of heart. Every month I delayed a component purchase, the price had moved. The PC is built now and I am happy with it, but the financial stress of the whole process bled into everything else, including this channel.": "Küresel tedarik zincirinin aksadığı ve liranın değer kaybettiği bir dönemde Türkiye'de bilgisayar toplamak kolay iş değil. Bir parçayı almayı her ertelediğim ay fiyatı değişmişti. Bilgisayar artık hazır ve sonuçtan memnunum, fakat bütün sürecin yarattığı maddi stres kanal dâhil hayatımın diğer alanlarına da yansıdı.",
    "Third: Space Marine 2.": "Üçüncüsü: Space Marine 2.",
    "I got caught up in Space Marine 2. About 200 hours across two months, so yes, I was kind of addicted. I can see some of you rolling your eyes at that, but hear me out, because this one actually has a silver lining.": "Space Marine 2'ye fazlasıyla kapıldım. İki ayda yaklaşık 200 saat oynadım; yani evet, biraz bağımlısı oldum. Bazılarınızın bunu okuyup göz devirdiğini tahmin edebiliyorum ama beni dinleyin, çünkü bunun aslında iyi bir tarafı da oldu.",
    "I will keep making worldbuilding and book review videos, that will not change. What will change is that I am going to diversify my scope. Getting deep into Space Marine 2 pulled me into Warhammer 40K lore, then into the wider Warhammer fandom, then into the broader world of grimdark tabletop games. Some of you may already know where this is going: I also got into the lore of Trench Crusade.": "Dünya inşası ve kitap inceleme videoları yapmaya devam edeceğim; bu değişmeyecek. Değişecek olan şey, ele aldığım konuları çeşitlendirmem. Space Marine 2'ye derinlemesine dalmak beni önce Warhammer 40K evrenine, ardından daha geniş Warhammer topluluğuna ve sonrasında grimdark masaüstü oyunlarının daha geniş dünyasına çekti. Bazılarınız bunun nereye gittiğini şimdiden anlamış olabilir: Trench Crusade evrenine de sardım.",
    "So what does this mean for the channel?": "Peki bu kanal için ne anlama geliyor?",
    "It means expansion. I will be making Warhammer 40K and Trench Crusade lore videos alongside the content I was already producing. Based on how those land with you, I want to keep going further. I am already thinking seriously about the world of Cyberpunk 2077 as another direction to explore down the line.": "Bu, kapsamın genişlemesi demek. Zaten ürettiğim içeriklerin yanında Warhammer 40K ve Trench Crusade lore videoları da yapacağım. Bunların sizde nasıl karşılık bulduğuna göre daha da ileri gitmek istiyorum. İleride keşfedebileceğim başka bir yön olarak Cyberpunk 2077 dünyasını da şimdiden ciddi biçimde düşünüyorum.",
    "What comes next.": "Sırada ne var?",
    "The first new video is already in the scripting phase. It will be a Warhammer 40K lore piece, and I want it to set the tone for this new direction properly. After that, I plan to get back into a more consistent rhythm, though I am going to be realistic about the schedule this time. One video a week rather than two. Sustainable over burnout, every time.": "İlk yeni videonun senaryosu şimdiden hazırlanıyor. Warhammer 40K lore üzerine olacak ve bu yeni yönün tonunu doğru biçimde belirlemesini istiyorum. Sonrasında daha düzenli bir ritme dönmeyi planlıyorum, fakat bu kez takvim konusunda daha gerçekçi olacağım. Haftada iki video yerine bir video. Her zaman tükenmişlik yerine sürdürülebilirlik.",
    "The blog will also be more active going forward. IRL posts like this one, plus written versions of some of the video topics for people who prefer to read. The website has come a long way and it feels like a waste not to use it properly.": "Bundan sonra blog da daha aktif olacak. Bunun gibi günlük yazılarının yanında, okumayı tercih edenler için bazı video konularının yazılı sürümleri de gelecek. Site çok yol katetti ve onu gerektiği gibi kullanmamak artık israf gibi geliyor.",
    "Thank you for sticking around during the silence. It genuinely means a lot. See you at the next one.": "Bu sessizlik boyunca burada kaldığınız için teşekkür ederim. Gerçekten benim için çok şey ifade ediyor. Bir sonrakinde görüşürüz."
  }
};
  const subpageTitleTranslations={
  "tr": {
    "Fantasy — Book Reviews — Ruşen M. Özoruç": "Fantastik — Kitap İncelemeleri — Ruşen M. Özoruç",
    "Science Fiction — Book Reviews — Ruşen M. Özoruç": "Bilimkurgu — Kitap İncelemeleri — Ruşen M. Özoruç",
    "Non-Fiction — Book Reviews — Ruşen M. Özoruç": "Kurgu Dışı — Kitap İncelemeleri — Ruşen M. Özoruç",
    "Other — Book Reviews — Ruşen M. Özoruç": "Diğer — Kitap İncelemeleri — Ruşen M. Özoruç",
    "Fantasy — Original Stories — Ruşen M. Özoruç": "Fantastik — Özgün Hikâyelerim — Ruşen M. Özoruç",
    "Science Fiction — Original Stories — Ruşen M. Özoruç": "Bilimkurgu — Özgün Hikâyelerim — Ruşen M. Özoruç",
    "Other — Original Stories — Ruşen M. Özoruç": "Diğer — Özgün Hikâyelerim — Ruşen M. Özoruç",
    "Fantasy Worlds — Worldbuilding — Ruşen M. Özoruç": "Fantastik Dünyalar — Dünya İnşası — Ruşen M. Özoruç",
    "Science Fiction Worlds — Worldbuilding — Ruşen M. Özoruç": "Bilimkurgu Dünyaları — Dünya İnşası — Ruşen M. Özoruç",
    "Alternate History — Worldbuilding — Ruşen M. Özoruç": "Alternatif Tarih — Dünya İnşası — Ruşen M. Özoruç",
    "Painted Miniatures — Ruşen M. Özoruç": "Minyatürler — Ruşen M. Özoruç",
    "Miniature Preview — Painted Miniatures — Ruşen M. Özoruç": "Minyatür Önizlemesi — Ruşen M. Özoruç",
    "IRL — Blog Posts — Ruşen M. Özoruç": "Günlük — Blog Yazıları — Ruşen M. Özoruç",
    "Back from Hiatus — Ruşen M. Özoruç": "Uzun Bir Aradan Sonra — Ruşen M. Özoruç"
  }
};
  const subpageOriginalText=new WeakMap();
  let subpageOriginalTitle=null;

  function applySubpageTranslations(lang){
    const path=window.location.pathname.replace(/\/+$/,'/');
    const isHome=path==='/' || /\/index\.html$/i.test(path) && !/\/(irl|miniatures)\/index\.html$/i.test(path);
    if(isHome) return;

    const map=subpageTextTranslations[lang]||{};
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
      acceptNode(node){
        const parent=node.parentElement;
        if(!parent || ['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
      }
    });
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node=>{
      if(!subpageOriginalText.has(node)) subpageOriginalText.set(node,node.nodeValue);
      const original=subpageOriginalText.get(node);
      const trimmed=original.trim();
      if(lang==='en'){
        node.nodeValue=original;
        return;
      }
      const mapped=map[trimmed];
      if(mapped!==undefined){
        const before=(original.match(/^\s*/)||[''])[0];
        const after=(original.match(/\s*$/)||[''])[0];
        node.nodeValue=before+mapped+after;
      }
    });

    if(subpageOriginalTitle===null) subpageOriginalTitle=document.title;
    if(lang==='en'){
      document.title=subpageOriginalTitle;
    }else{
      document.title=subpageTitleTranslations[lang]?.[subpageOriginalTitle]||subpageOriginalTitle;
    }
  }

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
    applySubpageTranslations(lang);
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
