document.addEventListener('DOMContentLoaded',()=>{
  const main=document.querySelector('#mini-detail-main-image');
  const thumbs=[...document.querySelectorAll('.mini-detail-thumb')];
  thumbs.forEach(btn=>btn.addEventListener('click',()=>{
    const src=btn.dataset.src;
    if(!main||!src)return;
    main.style.opacity='0';
    setTimeout(()=>{main.src=src;main.style.opacity='1';},120);
    thumbs.forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
  }));

  const canvas=document.getElementById('mini-detail-bg');
  if(canvas&&window.THREE){
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
    camera.position.z=10;
    const group=new THREE.Group();scene.add(group);
    const colors=[0xD94444,0x7B6FE8,0x3BBFB0];
    for(let i=0;i<8;i++){
      const geo=i%2?new THREE.DodecahedronGeometry(.62,0):new THREE.IcosahedronGeometry(.7,0);
      const mat=new THREE.MeshBasicMaterial({color:colors[i%3],wireframe:true,transparent:true,opacity:.06});
      const m=new THREE.Mesh(geo,mat);
      m.position.set((Math.random()-.5)*13,(Math.random()-.5)*9,-Math.random()*5);
      m.userData.s=.0015+Math.random()*.0025;group.add(m);
    }
    function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
    addEventListener('resize',resize);resize();
    (function animate(){group.children.forEach((m,i)=>{m.rotation.x+=m.userData.s;m.rotation.y+=m.userData.s*1.25;m.position.y+=Math.sin(Date.now()*.0002+i)*.0007});renderer.render(scene,camera);requestAnimationFrame(animate)})();
  }
});
