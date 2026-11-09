import * as THREE from './assets/vendor/three.module.min.js';

// A small decorative scene; the illustration and all links work without WebGL.
const hero = document.querySelector('.hero');
const art = hero.querySelector('.hero-art');
const stage = document.createElement('div');
stage.className = 'hero-particles';
stage.setAttribute('aria-hidden', 'true');
art.prepend(stage);
try {
 const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
 renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
 stage.append(renderer.domElement);
 const scene = new THREE.Scene();
 const camera = new THREE.OrthographicCamera(-5.5, 5.5, 4, -4, .1, 30);
 camera.position.z = 12;
 const group = new THREE.Group();
 scene.add(group);
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
 const compact = matchMedia('(max-width: 760px)');
 const routes = [];
 const movers = [];
 const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x8970d5 });
 const dotGeometry = new THREE.SphereGeometry(.065, 10, 8);
 for (let i = 0; i < 3; i++) {
  const curve = new THREE.EllipseCurve(0, 0, 4.55-i*.27, 2.55+i*.17, 0, Math.PI*2, false, (i-1)*.23);
  routes.push(curve);
  const positions = curve.getPoints(100).map(p=>new THREE.Vector3(p.x,p.y,(i-1)*.3));
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(positions),new THREE.LineBasicMaterial({color:i===1?0x8f91e0:0xb499d9,transparent:true,opacity:.35}));
  group.add(line);
  for(let j=0;j<3;j++){
   const dot = new THREE.Mesh(dotGeometry,dotMaterial);
   const halo = new THREE.Mesh(new THREE.RingGeometry(.11,.15,24), new THREE.MeshBasicMaterial({color:0xb7a0e7,transparent:true,opacity:.5,side:THREE.DoubleSide}));
   dot.add(halo);group.add(dot);movers.push({dot,halo,route:i,offset:j/3+i*.12});
  }
 }
 const count=compact.matches?26:52;
 const positions=new Float32Array(count*3);
 for(let i=0;i<count;i++){
  const angle=i*2.39996;
  const radius=1+((i*17)%19)/70;
  positions.set([Math.cos(angle)*4.3*radius,Math.sin(angle)*2.7*radius,Math.sin(i)*.5],i*3);
 }
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const particles=new THREE.Points(geometry,new THREE.PointsMaterial({color:0x9b7ad0,size:compact.matches?.045:.055,transparent:true,opacity:.65}));
 group.add(particles);
 let visible=false, frame=0, elapsed=0, previous, lastDraw=-Infinity, lost=false;
 const target = new THREE.Vector2();
 function draw(now){
  if(lost)return;
  if(previous!==undefined&&!reduced.matches)elapsed+=Math.min(now-previous,100)/1000;
  previous=now;
  // Cap drawing to 30fps on phones; pointer effects only run on mouse devices.
  if(now-lastDraw>=(compact.matches?32:15)||reduced.matches){
   lastDraw=now;
   const t=reduced.matches?0:elapsed;
   group.rotation.y+=(target.x*.1-group.rotation.y)*.07;
   group.rotation.x+=(-target.y*.08-group.rotation.x)*.07;
   particles.rotation.z=t*.018;
   movers.forEach(({dot,halo,route,offset})=>{
    const p=routes[route].getPoint((t*(.035+route*.007)+offset)%1);
    dot.position.set(p.x,p.y,(route-1)*.3+.1);
    halo.scale.setScalar(1+Math.sin(t*1.7+offset*6)*.2);
   });
   renderer.render(scene,camera);
  }
  if(visible&&!reduced.matches&&!document.hidden)frame=requestAnimationFrame(draw);
 }
 function refresh(){cancelAnimationFrame(frame);previous=undefined;lastDraw=-Infinity;draw(performance.now());}
 new ResizeObserver(()=>{
  const {width,height}=stage.getBoundingClientRect();
  if(!width||!height)return;
  renderer.setSize(width,height,false);
  const aspect=width/height;
  camera.left=-5.5;camera.right=5.5;camera.top=5.5/aspect;camera.bottom=-5.5/aspect;
  camera.updateProjectionMatrix();refresh();
 }).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();}).observe(hero);
 hero.addEventListener('pointermove',event=>{
  if(!finePointer.matches||reduced.matches)return;
  const rect=hero.getBoundingClientRect();
  target.set((event.clientX-rect.left)/rect.width*2-1,(event.clientY-rect.top)/rect.height*2-1);
 },{passive:true});
 hero.addEventListener('pointerleave',()=>target.set(0,0));
 reduced.addEventListener('change',()=>{target.set(0,0);group.rotation.set(0,0,0);refresh();});
 document.addEventListener('visibilitychange',refresh);
 renderer.domElement.addEventListener('webglcontextlost',event=>{
  event.preventDefault();lost=true;cancelAnimationFrame(frame);stage.remove();
 });
} catch {
 stage.remove();
}
