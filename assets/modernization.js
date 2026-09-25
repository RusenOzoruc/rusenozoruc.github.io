document.addEventListener('DOMContentLoaded',()=> {
  // Replace legacy text logo everywhere while keeping the home link intact.
  document.querySelectorAll('.nav-logo').forEach(link=>{
    if(!link.querySelector('img')){
      link.innerHTML='<img src="assets/logo-rmo.svg" alt="Ruşen M. Özoruç logo">';
      link.setAttribute('aria-label','Ruşen M. Özoruç — Home');
    }
  });

  // Search + sort for review archives.
  const grid=document.querySelector('.entries-grid');
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
