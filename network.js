import * as THREE from './assets/vendor/three.module.min.js';

// The original SVG is retained when WebGL is unavailable.
const panel = document.querySelector('.map-panel');
const stage = document.createElement('div');
stage.className = 'network-stage';
stage.setAttribute('role', 'img');
stage.setAttribute('aria-label', 'Ilustrasi peta lingkungan dengan truk logistik yang mengantar barang dari gudang ke empat toko melalui jalan, di antara rumah dan gedung.');
panel.querySelector('svg').before(stage);
try {
 const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
 stage.append(renderer.domElement);
 const scene = new THREE.Scene();
 const camera = new THREE.OrthographicCamera(-8.8,8.8,8.8,-8.8,.1,80);
 camera.position.set(9,18,14);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xffffff,0xb4b3c9,2.5));
 const sun = new THREE.DirectionalLight(0xffffff,2.5);sun.position.set(-4,12,8);scene.add(sun);
 const materials = new Map();
 function mat(color){if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.8}));return materials.get(color);}
 function box(parent,x,y,z,w,h,d,color){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 function sphere(parent,x,y,z,r,color){const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),mat(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 box(scene,0,-.2,0,13.6,.35,10.8,0xe1eadf);
 // Sidewalks, roads, lane markings and pedestrian crossings.
 for(const x of [-4,0,4]){
  box(scene,x,.005,0,1.22,.08,10.5,0xf9f5ed);box(scene,x,.055,0,.9,.025,10.5,0xa8b1c2);
  for(let z=-4.8;z<5;z+=.65)if(Math.abs(z%3)>.7)box(scene,x,.075,z,.035,.01,.28,0xf6f5ed);
 }
 for(const z of [-3,0,3]){
  box(scene,0,.01,z,13.4,.08,1.22,0xf9f5ed);box(scene,0,.06,z,13.4,.025,.9,0xa8b1c2);
  for(let x=-6.3;x<6.4;x+=.65)if(Math.abs(x%4)>.7)box(scene,x,.08,z,.28,.01,.035,0xf6f5ed);
 }
 for(const [x,z] of [[-4,0],[0,3],[4,-3]])for(let i=0;i<5;i++)box(scene,x-.3+i*.15,.083,z+.65,.075,.01,.35,0xffffff);
 function label(text,x,y,z,color='#56617f'){
  const canvas=document.createElement('canvas');canvas.width=384;canvas.height=96;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.beginPath();ctx.roundRect(4,8,376,80,20);ctx.fill();
  ctx.font='600 32px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,192,50);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false}));sprite.position.set(x,y,z);sprite.scale.set(2.3,.575,1);sprite.renderOrder=5;scene.add(sprite);return sprite;
 }
 function building(x,z,w,h,d,color,kind){
  const group=new THREE.Group();group.position.set(x,0,z);scene.add(group);
  box(group,0,.1,0,w+.2,.15,d+.2,0xf2efe9);box(group,0,h/2+.15,0,w,h,d,color);
  if(kind==='house'){
   const roof=new THREE.Mesh(new THREE.ConeGeometry(w*.8,.65,4),mat(0xb18da8));roof.rotation.y=Math.PI/4;roof.position.y=h+.45;group.add(roof);
  }else{box(group,0,h+.2,0,w+.12,.16,d+.12,kind==='warehouse'?0x777db3:0x9c98c8);}
  box(group,0,.45,d/2+.02,.28,.6,.035,0x697c9c);
  if(kind==='shop'){
   for(let i=0;i<6;i++)box(group,-w/2+(i+.5)*w/6,1.06,d/2+.18,w/6,.14,.48,i%2?0xfffaf0:0x8f80ce);
   box(group,0,.65,d/2+.025,w*.7,.5,.04,0xb6d5df);
  }else if(kind==='warehouse'){
   box(group,0,.65,d/2+.025,w*.7,.9,.04,0x9aa7bf);
   for(let y=.3;y<1.1;y+=.16)box(group,0,y,d/2+.055,w*.68,.025,.02,0xdce1ec);
   box(group,-.65,.35,d/2+.4,.32,.35,.32,0xcba47e);
  }else{
   for(let y=.65;y<h;y+=.55)for(const x of [-w*.24,w*.24])box(group,x,y,d/2+.025,.24,.28,.04,0xc4deea);
  }
  return group;
 }
 building(-5.55,3.85,1.65,1.55,1.25,0xdadcf0,'warehouse');label('GUDANG',-5.2,2.65,3.8);
 const shops=[[-5.35,-.85],[-1.3,.95],[1.35,-3.85],[5.35,.85]];
 const markers=[];
 shops.forEach(([x,z],i)=>{
  building(x,z,1.15,.95,.9,[0xe3d5ee,0xf2dcc1,0xd4dfea,0xf0d3d5][i],'shop');
  label(`TOKO ${i+1}`,x,2.05,z);
  const pin=sphere(scene,x,1.6,z,.12,0x9274cf);markers.push(pin);
 });
 [[-2,-4.1,1,1.1,.85,0xf0e2cd,'house'],[-2,-1.65,1.1,1.35,.9,0xd8dcef,'house'],[2,-1.55,1.1,2.4,.9,0xd5d9ed,'office'],[2,1.6,1.15,1.15,.9,0xf0dfce,'house'],[-1.9,4.35,1.05,1.3,.85,0xd4deda,'house'],[1.7,4.25,1,2,.9,0xdad6eb,'office'],[5.55,-3.9,.9,1.1,.8,0xe8decb,'house'],[-5.5,-3.65,.9,1.9,.8,0xd8deec,'office']].forEach(args=>building(...args));
 for(const [x,z] of [[-3,1.5],[-3,4.2],[3,4.4],[3,-4.3],[6,-1.6],[-6,1.6],[1,-1.5]]){
  box(scene,x,.37,z,.1,.6,.1,0xb49b89);sphere(scene,x,.91,z,.35,0x9cbda5);sphere(scene,x-.15,.82,z,.22,0xaec9ad);
 }
 const coords=[[-4,3],[-4,0],[0,0],[0,-3],[4,-3],[4,0],[4,3],[-4,3]];
 const points=coords.map(([x,z])=>new THREE.Vector3(x,.105,z));
 const route=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineDashedMaterial({color:0x7464c4,dashSize:.2,gapSize:.15}));route.computeLineDistances();scene.add(route);
 // Truck faces +X. Cargo box, cab, windshield, lamps and four rolling wheels.
 const truck=new THREE.Group();scene.add(truck);
 box(truck,-.15,.47,0,.88,.63,.57,0xfdfaff);box(truck,-.15,.8,0,.93,.05,.61,0xd4c8ee);
 box(truck,.51,.37,0,.42,.48,.55,0x8071cc);box(truck,.53,.57,0,.27,.17,.57,0xb7dce5);
 box(truck,0,.17,0,1.45,.12,.52,0x53617d);box(truck,.74,.27,0,.05,.12,.55,0xcfd6e5);
 for(const z of [-.18,.18])box(truck,.77,.35,z,.025,.09,.1,0xffecc1);
 box(truck,-.15,.49,.29,.4,.22,.02,0xa996de);box(truck,-.15,.49,-.29,.4,.22,.02,0xa996de);
 const wheels=[];
 for(const x of [-.43,.47])for(const z of [-.32,.32]){
  const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.12,12),mat(0x4e5870));wheel.rotation.x=Math.PI/2;wheel.position.set(x,.2,z);truck.add(wheel);wheels.push(wheel);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.13,12),mat(0xd5dcea));hub.rotation.x=Math.PI/2;hub.position.copy(wheel.position);truck.add(hub);
 }
 const parcel=box(scene,0,.3,0,.28,.28,.28,0xcaa17c);parcel.visible=false;
 const progress=document.createElement('div');progress.className='delivery-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<span></span>'.repeat(4);panel.querySelector('.route-card p').after(progress);
 const title=panel.querySelector('.route-card strong');const caption=panel.querySelector('.route-card p');
 panel.classList.add('has-three');
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const compact=matchMedia('(max-width:760px)');
 const stopShop=new Map([[1,0],[2,1],[3,2],[5,3]]);
 const segments=points.slice(1).map((p,i)=>({from:points[i],to:p,duration:points[i].distanceTo(p)/1.2,shop:stopShop.get(i+1)}));
 const pause=2.4;const cycle=segments.reduce((sum,s)=>sum+s.duration+(s.shop===undefined?0:pause),0)+1.5;
 let elapsed=0,previous,frame=0,lastDraw=-Infinity,visible=false,lost=false,lastStatus='';
 function pose(time){
  let remaining=time%cycle;const delivered=[];let stopped=-1,fraction=0,active=segments[0];
  for(const segment of segments){
   active=segment;
   if(remaining<segment.duration){fraction=remaining/segment.duration;break;}
   remaining-=segment.duration;fraction=1;
   if(segment.shop!==undefined){
    if(remaining<pause){stopped=segment.shop;break;}
    remaining-=pause;delivered.push(segment.shop);
   }
  }
  truck.position.lerpVectors(active.from,active.to,fraction);truck.position.y=.08;
  truck.rotation.y=-Math.atan2(active.to.z-active.from.z,active.to.x-active.from.x);
  wheels.forEach(w=>w.rotation.y=stopped<0?time*5:0);
  parcel.visible=stopped>=0;
  if(stopped>=0){const [x,z]=shops[stopped];const f=Math.min(remaining/(pause*.65),1);parcel.position.set(THREE.MathUtils.lerp(active.to.x,x,f),.35+Math.sin(f*Math.PI)*.35,THREE.MathUtils.lerp(active.to.z,z,f));}
  markers.forEach((pin,i)=>{pin.material=mat(delivered.includes(i)?0x63a88b:0x9274cf);pin.scale.setScalar(i===stopped?1.3:1);});
  const status=stopped>=0?`stop-${stopped}`:`drive-${delivered.length}`;
  if(status!==lastStatus){lastStatus=status;title.textContent=stopped>=0?`Mengantar barang · Toko ${stopped+1}`:delivered.length===4?'Kembali ke gudang':'Truk dalam perjalanan';caption.textContent=`${delivered.length} dari 4 toko selesai · Simulasi pengiriman`;[...progress.children].forEach((el,i)=>el.classList.toggle('delivered',delivered.includes(i)));}
 }
 function draw(now){
  if(lost)return;
  if(previous!==undefined&&!motion.matches)elapsed+=Math.min(now-previous,100)/1000;previous=now;
  if(now-lastDraw>=(compact.matches?32:15)||motion.matches){lastDraw=now;pose(elapsed);renderer.render(scene,camera);}
  if(visible&&!motion.matches&&!document.hidden)frame=requestAnimationFrame(draw);
 }
 function refresh(){cancelAnimationFrame(frame);previous=undefined;lastDraw=-Infinity;draw(performance.now());}
 new ResizeObserver(()=>{const width=stage.clientWidth,height=stage.clientHeight;if(!width||!height)return;renderer.setSize(width,height,false);camera.top=8.8*height/width;camera.bottom=-8.8*height/width;camera.updateProjectionMatrix();refresh();}).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();}).observe(stage);
 motion.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);
 document.querySelector('#replay').addEventListener('click',()=>{elapsed=0;refresh();});
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);panel.classList.remove('has-three');stage.remove();progress.remove();title.textContent='Pengiriman dari gudang';caption.textContent='Truk logistik → 4 toko tujuan';});
} catch {
 stage.remove();panel.classList.remove('has-three');
}
