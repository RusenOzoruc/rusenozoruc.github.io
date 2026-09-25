document.addEventListener('DOMContentLoaded',()=>{
  const system=document.querySelector('#mini-system-filter');
  const faction=document.querySelector('#mini-faction-filter');
  const cards=[...document.querySelectorAll('.mini-card[data-system]')];
  const empty=document.querySelector('#mini-filter-empty');

  const factionOptions={
    all:[['all','All factions']],
    warhammer:[
      ['all','All Warhammer'],
      ['world-eaters','World Eaters'],
      ['emperors-children',"Emperor's Children"],
      ['adeptus-astartes','Adeptus Astartes'],
      ['orks','Orks'],
      ['death-guard','Death Guard'],
      ['thousand-sons','Thousand Sons'],
      ['warhammer-terrain','Terrain']
    ],
    starcraft:[
      ['all','All StarCraft'],
      ['terran','Terran'],
      ['zerg','Zerg'],
      ['protoss','Protoss'],
      ['terrain','Terrain']
    ]
  };

  function rebuildFactions(){
    const value=system.value;
    const options=value==='all'
      ? [['all','All factions'],...factionOptions.warhammer.slice(1),...factionOptions.starcraft.slice(1)]
      : factionOptions[value];
    faction.innerHTML=options.map(([v,l])=>'<option value="'+v+'">'+l+'</option>').join('');
  }

  function filter(){
    const s=system.value;
    const f=faction.value;
    let shown=0;
    cards.forEach(card=>{
      const okSystem=s==='all'||card.dataset.system===s;
      const okFaction=f==='all'||card.dataset.faction===f;
      const show=okSystem&&okFaction;
      card.classList.toggle('mini-hidden',!show);
      if(show) shown++;
    });
    if(empty) empty.classList.toggle('mini-hidden',shown>0 || cards.length===0);
  }

  system?.addEventListener('change',()=>{rebuildFactions();filter();});
  faction?.addEventListener('change',filter);
  if(system&&faction){rebuildFactions();filter();}

  // Lightweight 3D background: keeps the site's floating-dice identity.
  const canvas=document.getElementById('mini-bg');
  if(canvas && window.THREE){
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
    camera.position.z=10;
    const group=new THREE.Group();
    scene.add(group);
    const mats=[
      new THREE.MeshBasicMaterial({color:0xD94444,wireframe:true,transparent:true,opacity:.08}),
      new THREE.MeshBasicMaterial({color:0x7B6FE8,wireframe:true,transparent:true,opacity:.07}),
      new THREE.MeshBasicMaterial({color:0x3BBFB0,wireframe:true,transparent:true,opacity:.07})
    ];
    const geos=[new THREE.IcosahedronGeometry(.72,0),new THREE.DodecahedronGeometry(.62,0),new THREE.OctahedronGeometry(.55,0)];
    const dice=[];
    for(let i=0;i<10;i++){
      const mesh=new THREE.Mesh(geos[i%geos.length],mats[i%mats.length]);
      mesh.position.set((Math.random()-.5)*14,(Math.random()-.5)*10,-Math.random()*5);
      mesh.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);
      mesh.userData.speed=.0015+Math.random()*.003;
      group.add(mesh);dice.push(mesh);
    }
    function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
    addEventListener('resize',resize);resize();
    function animate(){
      dice.forEach((d,i)=>{d.rotation.x+=d.userData.speed;d.rotation.y+=d.userData.speed*1.3;d.position.y+=Math.sin(Date.now()*.00025+i)*.0008;});
      renderer.render(scene,camera);requestAnimationFrame(animate);
    }
    animate();
  }
});
