// Three.js is a local, pinned dependency. The SVG remains the WebGL fallback.
import * as THREE from './assets/vendor/three.module.min.js';
const panel = document.querySelector('.map-panel');
const stage = document.createElement('div');
stage.className = 'network-stage';
stage.setAttribute('aria-hidden', 'true');
panel.querySelector('svg').before(stage);
try {
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
 stage.append(renderer.domElement);
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(38, 600 / 470, .1, 100);
 camera.position.set(0, 10.8, 11.8);
 camera.lookAt(0, 0, 0);
 scene.add(new THREE.HemisphereLight(0xffffff, 0xa7a0cc, 3));
 const light = new THREE.DirectionalLight(0xffffff, 3);
 light.position.set(-3, 8, 5); scene.add(light);
 const grid = new THREE.GridHelper(17, 20, 0xd5daed, 0xe0e4f1); scene.add(grid);
 const points = [new THREE.Vector3(-4,.2,2), new THREE.Vector3(-2,.2,-.6), new THREE.Vector3(.2,.2,.5), new THREE.Vector3(1.4,.2,-2.4), new THREE.Vector3(4,.2,-1.2)];
 const path = new THREE.CurvePath();
 points.slice(1).forEach((point,i) => path.add(new THREE.LineCurve3(points[i], point)));
 const route = new THREE.Mesh(new THREE.TubeGeometry(path, 80, .045, 8, false),new THREE.MeshStandardMaterial({color:0x8c73d2})); scene.add(route);
 const material = new THREE.MeshStandardMaterial({color:0x6c71d7,roughness:.55});
 points.forEach((point,i) => {
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.1,32), new THREE.MeshStandardMaterial({color:0xffffff}));
  base.position.copy(point); scene.add(base);
  const building = new THREE.Mesh(new THREE.BoxGeometry(i ? .5 : .85,i ? .55 : .8,.6),material);
  building.position.copy(point).add(new THREE.Vector3(0,i ? .34 : .47,0)); scene.add(building);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(i ? .43 : .65,.35,4),new THREE.MeshStandardMaterial({color:0xb6a0e3}));
  roof.rotation.y=Math.PI/4; roof.position.copy(point).add(new THREE.Vector3(0,i ? .78 : 1.03,0));scene.add(roof);
 });
 const traveler = new THREE.Mesh(new THREE.SphereGeometry(.14,16,12),new THREE.MeshStandardMaterial({color:0x7953bd,emissive:0x4c2774,emissiveIntensity:.25}));scene.add(traveler);
 panel.classList.add('has-three');
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 let visible = false, frame = 0, progress = 0, previous;
 function draw(time){
  if(previous !== undefined && !motion.matches) progress=(progress+Math.min(time-previous,100)/10000)%1;
  previous=time;traveler.position.copy(path.getPoint(progress));traveler.position.y+=.18;
  renderer.render(scene,camera);
  if(visible && !motion.matches && !document.hidden) frame=requestAnimationFrame(draw);
 }
 function refresh(){cancelAnimationFrame(frame);previous=undefined;draw(performance.now());}
 new ResizeObserver(() => {renderer.setSize(stage.clientWidth,stage.clientHeight,false);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();refresh();}).observe(stage);
 new IntersectionObserver(entries => {visible=entries[0].isIntersecting;refresh();}).observe(stage);
 motion.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);
 document.querySelector('#replay').addEventListener('click',()=>{progress=0;refresh();});
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);panel.classList.remove('has-three');});
} catch {
 stage.remove(); panel.classList.remove('has-three');
}
