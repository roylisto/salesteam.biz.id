import * as THREE from './assets/vendor/three.module.min.js';

let industryInfo={colors:[0x9982cf,0xe5b584,0x8fb9bb],shapes:['bottle','box','can']};
let updateIndustry=()=>{};
window.addEventListener('industrychange',event=>{industryInfo=event.detail;updateIndustry();});

function createScene(demo){
 const stage=demo.querySelector('.commerce-canvas');
 let renderer;
 try {
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  stage.append(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-6.7,6.7,5,-5,.1,60);
  camera.position.set(7,9,12);camera.lookAt(0,.5,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0xb6aecb,2.6));
  const sun=new THREE.DirectionalLight(0xffffff,2.4);sun.position.set(-4,8,6);scene.add(sun);
  const geometries=new Map(),materials=new Map();
  function material(color){if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.7}));return materials.get(color);}
  function mesh(parent,geometry,color,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material(color));m.position.set(x,y,z);parent.add(m);return m;}
  function box(parent,x,y,z,w,h,d,color){const key=`${w},${h},${d}`;if(!geometries.has(key))geometries.set(key,new THREE.BoxGeometry(w,h,d));return mesh(parent,geometries.get(key),color,x,y,z);}
  function cylinder(parent,x,y,z,r,h,color){const key=`c${r},${h}`;if(!geometries.has(key))geometries.set(key,new THREE.CylinderGeometry(r,r,h,20));return mesh(parent,geometries.get(key),color,x,y,z);}
  function shop(parent,x,z,color=0xded7ed){
   const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
   box(g,0,.6,0,1.5,1.2,1.1,color);box(g,0,1.24,0,1.65,.12,1.25,0x9380be);
   box(g,0,.5,.56,1.12,.65,.025,0xb3d2de);
   for(let i=0;i<6;i++)box(g,-.625+i*.25,.99,.7,.25,.16,.6,i%2?0xfff9ed:0xa38bd0);
   return g;
  }
  function parcel(parent,x,y,z,color=0xd6b28b){
   const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);box(g,0,0,0,.48,.48,.48,color);box(g,0,.245,0,.09,.012,.49,0xf3dfb9);return g;
  }
  let renderState=()=>{};
  let reset=()=>{};
  if(demo.dataset.commerce==='transaction'){
   box(scene,0,-.12,0,10,.18,5.5,0xe3e7ee);
   box(scene,0,.005,1.5,10,.04,1.2,0xb2bbce);
   for(let i=-4;i<=4;i++)box(scene,i,.03,1.5,.45,.01,.04,0xffffff);
   // Warehouse at the start of the route and a shop at the destination.
   box(scene,-3.7,.75,-1.1,1.6,1.5,1.35,0xd9dbee);box(scene,-3.7,1.55,-1.1,1.8,.12,1.5,0x8b8ab8);
   box(scene,-3.7,.55,-.41,1.1,1.1,.03,0xa5b1c7);parcel(scene,-2.7,.25,-.8);
   shop(scene,3,-.45);
   const van=new THREE.Group();scene.add(van);
   box(van,-.3,.65,0,1.65,1.05,.95,0xfcfaff);box(van,.8,.47,0,.65,.7,.95,0x8e7bca);box(van,.86,.72,0,.48,.3,.97,0xb7d6e3);
   box(van,-.3,.67,.49,1.2,.7,.025,0xdbd1ed);box(van,0,.2,0,2.6,.16,.85,0x626c8b);
   for(const x of [-.85,.85])for(const z of [-.52,.52]){const wheel=cylinder(van,x,.23,z,.23,.13,0x555e79);wheel.rotation.x=Math.PI/2;}
   const cargo=[];for(let i=0;i<4;i++){const p=parcel(van,-.78+(i%2)*.53,.51+Math.floor(i/2)*.48,.67,0xc8acd9);p.scale.setScalar(.85);cargo.push(p);}
   const product=parcel(scene,0,.5,.6);product.visible=false;
   // Salesperson beside the stock-carrying vehicle.
   const person=new THREE.Group();person.position.set(1.3,0,1);scene.add(person);
   cylinder(person,0,.65,0,.19,.65,0x8a76c6);mesh(person,new THREE.SphereGeometry(.2,12,10),0xe2bda5,0,1.14,0);
   box(person,-.11,.19,0,.13,.4,.16,0x5b6885);box(person,.11,.19,0,.13,.4,.16,0x5b6885);
   const receipt=new THREE.Group();receipt.position.set(2.5,1.75,.2);scene.add(receipt);
   box(receipt,0,0,0,.95,1.2,.09,0xfffefa);
   for(let i=0;i<3;i++)box(receipt,0,.25-i*.17,.055,.58,.04,.02,0xbab0d4);
   const check=new THREE.Group();receipt.add(check);box(check,-.1,-.3,.06,.12,.28,.03,0x78b399).rotation.z=.65;box(check,.08,-.23,.06,.12,.5,.03,0x78b399).rotation.z=-.65;
   const stock=demo.querySelector('[data-stock]'),sold=demo.querySelector('[data-sold]'),revenue=demo.querySelector('[data-revenue]'),status=demo.querySelector('[data-scene-status]');
   let last=-1;
   renderState=time=>{
    const t=time%12,phase=Math.floor(t/3);van.position.set(THREE.MathUtils.lerp(-1.6,-.5,Math.min(t/3,1)),.04,.25);
    cargo[3].visible=t<6;product.visible=t>=3&&t<6;
    const f=THREE.MathUtils.clamp((t-3)/3,0,1);product.position.set(THREE.MathUtils.lerp(.3,3,f),.55+Math.sin(f*Math.PI)*.6,THREE.MathUtils.lerp(.9,.2,f));
    receipt.visible=t>=6;receipt.position.y=1.85+Math.sin(time*1.5)*.05;
    if(phase!==last){last=phase;const done=t>=6;stock.innerHTML=`${done?18:24} <span>unit</span>`;sold.innerHTML=`${done?6:0} <span>unit</span>`;revenue.textContent=done?'Rp150.000':'Rp0';status.textContent=['Stok dibawa menuju toko','Barang diserahkan ke toko','Transaksi dicatat · stok berkurang','Sisa stok siap untuk toko berikutnya'][phase];}
   };
   reset=()=>{last=-1;};
  }else{
   cylinder(scene,0,-.1,0,4.8,.18,0xe4e2f2);
   const hub=new THREE.Group();scene.add(hub);
   box(hub,0,.52,0,1.5,1.05,1.3,0xd5d4eb);box(hub,0,1.1,0,1.7,.14,1.5,0x9282be);box(hub,0,.45,.66,.85,.8,.03,0xb4c0d5);
   const curves=[];
   for(let i=0;i<3;i++){
    const a=i*Math.PI*2/3+.2;const x=Math.cos(a)*3.6,z=Math.sin(a)*3.6;
    shop(scene,x,z,[0xe8d7db,0xe8dfc8,0xd5e3df][i]);
    const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,1.35,0),new THREE.Vector3(x*.5,2.8,z*.5),new THREE.Vector3(x,1.5,z));curves.push(curve);
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)),new THREE.LineBasicMaterial({color:0xbaa9db,transparent:true,opacity:.7})));
   }
   const products=[];
   for(let i=0;i<3;i++){const g=new THREE.Group();scene.add(g);products.push(g);}
   function rebuild(){
    const info=industryInfo;
    products.forEach((g,i)=>{
     // Dispose category-specific geometry before replacing product shapes.
     g.children.forEach(child=>{if(![...geometries.values()].includes(child.geometry))child.geometry?.dispose();});g.clear();
     if(info.shapes[i]==='bottle'){cylinder(g,0,0,0,.22,.7,info.colors[i]);cylinder(g,0,.46,0,.11,.22,info.colors[i]);cylinder(g,0,.6,0,.12,.08,0xf5eee5);box(g,0,0,.225,.26,.3,.02,0xfffaf2);}
     else if(info.shapes[i]==='can'){cylinder(g,0,0,0,.25,.65,info.colors[i]);cylinder(g,0,.34,0,.25,.035,0xdce0e9);}
     else if(info.shapes[i]==='gear'){const ring=mesh(g,new THREE.TorusGeometry(.29,.12,8,16),info.colors[i]);for(let j=0;j<8;j++){const a=j*Math.PI/4;const tooth=box(g,Math.cos(a)*.4,Math.sin(a)*.4,0,.17,.17,.16,info.colors[i]);tooth.rotation.z=a;}}
     else {box(g,0,0,0,.6,.7,.48,info.colors[i]);box(g,0,.08,.25,.38,.32,.02,0xfffaf0);}
    });
   }
   updateIndustry=()=>{rebuild();refresh();};rebuild();
   renderState=time=>{products.forEach((p,i)=>{const f=(time*.09+i*.28)%1;p.position.copy(curves[i].getPoint(f));p.rotation.y=time*.5+i;});};
   reset=()=>{};
  }
  demo.classList.add('is-rendered');
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width:760px)');
  let visible=false,frame=0,elapsed=0,previous,lastDraw=-Infinity,lost=false;
  function draw(now){
   if(lost)return;
   if(previous!==undefined&&!motion.matches)elapsed+=Math.min(now-previous,100)/1000;previous=now;
   if(now-lastDraw>=(compact.matches?32:15)||motion.matches){lastDraw=now;renderState(elapsed);renderer.render(scene,camera);}
   if(visible&&!motion.matches&&!document.hidden)frame=requestAnimationFrame(draw);
  }
  function refresh(){cancelAnimationFrame(frame);previous=undefined;lastDraw=-Infinity;draw(performance.now());}
  new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.top=6.7*h/w;camera.bottom=-6.7*h/w;camera.updateProjectionMatrix();refresh();}).observe(stage);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();}).observe(stage);
  motion.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);
  demo.querySelector('.commerce-replay')?.addEventListener('click',()=>{elapsed=0;reset();refresh();});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;cancelAnimationFrame(frame);demo.classList.remove('is-rendered');renderer.domElement.remove();});
 }catch{renderer?.dispose();stage.querySelector('canvas')?.remove();demo.classList.remove('is-rendered');}
}
// Allocate WebGL contexts only as each explanation comes into view.
const pending=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){pending.unobserve(entry.target);createScene(entry.target);}}),{rootMargin:'150px'});
document.querySelectorAll('[data-commerce]').forEach(demo=>pending.observe(demo));
