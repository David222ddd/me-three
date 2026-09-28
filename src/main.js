import * as THREE from 'three';
import './styles.css';

const stories = [
  { year: '2003', title: '序章 · 初见世界', note: '一切故事的起点', color: 0xb47455, side: -1 },
  { year: '2012', title: '窗外的夏天', note: '关于蝉鸣与第一台电脑', color: 0x647467, side: 1 },
  { year: '2018', title: '无名的远方', note: '第一次离开熟悉的城市', color: 0x8f604a, side: -1 },
  { year: '2022', title: '创造者手记', note: '把热爱写进代码里', color: 0x6e6977, side: 1 },
  { year: 'NOW', title: '此刻，仍在发生', note: '下一页由时间书写', color: 0x9b8260, side: -1 },
];

document.querySelector('#root').innerHTML = `
  <header><a class="brand" href="#">D<span>·</span>03</a><nav><a href="https://david03.top">博客</a><a href="#archive">档案</a><a href="/admin.html">管理</a><button class="menu">☰</button></nav></header>
  <section class="intro"><div class="grain"></div><p class="eyebrow"><span></span> DAVID'S ARCHIVE · 2026</p><h1>未完<br><em>待续</em></h1><p class="intro-copy">一座关于时间、记忆与创造的<br>私人数字传记馆</p><button class="enter">进入展馆 <b>→</b></button><div class="scroll-hint"><span>SCROLL TO EXPLORE</span><b>⌄</b></div><div class="intro-number">001 <i></i> ∞</div></section>
  <main><div class="gallery-title"><p>THE LIVING ARCHIVE</p><h2>沿时间而行</h2><span>滚动以漫游 · 点击藏品阅读故事</span></div><canvas id="scene"></canvas><aside class="chapter"><span>CHAPTER</span><b>01</b><i></i><small>05</small></aside><button class="sound">♩ <span>环境声</span></button><div class="compass">⌖ <span>N</span></div></main>
  <div class="modal" hidden><button class="close">×</button><div class="modal-art"><span></span></div><div class="modal-copy"><p class="eyebrow">CHAPTER</p><h2></h2><p class="story-text"></p><button>阅读完整故事　→</button></div></div>`;

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .8;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x17130f);
scene.fog = new THREE.Fog(0x17130f, 8, 42);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, .1, 100);
camera.position.set(0, 1.65, 8);
scene.add(new THREE.HemisphereLight(0xad8d69, 0x17130f, 1.2));

const mat = (color, roughness = .9) => new THREE.MeshStandardMaterial({ color, roughness });
const box = (geo, material, pos) => { const m = new THREE.Mesh(geo, material); m.position.set(...pos); m.receiveShadow = true; scene.add(m); return m; };
box(new THREE.BoxGeometry(8, .1, 84), mat(0x28231d), [0, -.06, -34]);
box(new THREE.BoxGeometry(8, .1, 84), mat(0x1d1915), [0, 5, -34]);
box(new THREE.BoxGeometry(.1, 5, 84), mat(0x362f27), [-4, 2.5, -34]);
box(new THREE.BoxGeometry(.1, 5, 84), mat(0x302a24), [4, 2.5, -34]);
for (let i = 0; i < 13; i++) {
  const light = new THREE.PointLight(0xe5ba78, 21, 7); light.position.set(0, 4.55, -i * 7 - 2); scene.add(light);
  box(new THREE.CylinderGeometry(.13, .13, .03, 24), new THREE.MeshBasicMaterial({color:0xffdfa4}), [0, 4.88, -i * 7 - 2]).rotation.x = Math.PI / 2;
}
const artworks = [];
stories.forEach((story, index) => {
  const group = new THREE.Group();
  group.position.set(story.side * 3.85, 2.3, -index * 7 - 3);
  group.rotation.y = story.side === -1 ? Math.PI / 2 : -Math.PI / 2;
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.05, .14), mat(0xaa8a58, .5));
  const picture = new THREE.Mesh(new THREE.PlaneGeometry(2.48, 1.73), mat(story.color)); picture.position.z = .076;
  const shape = new THREE.Mesh(new THREE.CircleGeometry(.58, index % 2 ? 32 : 5), mat(0xcfb38e)); shape.position.set(-.42,.12,.081);
  const orb = new THREE.Mesh(new THREE.CircleGeometry(.44, 32), mat(0x473c34)); orb.position.set(.55,-.2,.083);
  group.add(frame, picture, shape, orb); group.userData.story = story; scene.add(group); artworks.push(group);
});

let entered = false, targetZ = 8;
document.querySelector('.enter').onclick = () => { entered = true; document.body.classList.add('entered'); document.querySelector('main').classList.add('visible'); scrollTo(0,0); };
const modal = document.querySelector('.modal');
const openStory = story => { modal.hidden = false; modal.querySelector('.modal-art').style.setProperty('--art', `#${story.color.toString(16)}`); modal.querySelector('.modal-art span').textContent = story.year; modal.querySelector('.modal-copy .eyebrow').textContent = `CHAPTER · ${story.year}`; modal.querySelector('h2').textContent = story.title; modal.querySelector('.story-text').textContent = `${story.note}。记忆不是一条笔直的线，它在一次次回望中获得新的形状。这一章收藏着一些微小却明亮的瞬间。`; };
document.querySelector('.close').onclick = () => modal.hidden = true;
const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
canvas.addEventListener('pointermove', e => { pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); raycaster.setFromCamera(pointer,camera); canvas.style.cursor = raycaster.intersectObjects(artworks,true).length ? 'pointer' : 'default'; });
canvas.addEventListener('click', () => { raycaster.setFromCamera(pointer,camera); const hit = raycaster.intersectObjects(artworks,true)[0]; if(hit){let o=hit.object;while(o&&!o.userData.story)o=o.parent;if(o)openStory(o.userData.story)}});
addEventListener('scroll', () => { if (entered) targetZ = 8 - (scrollY / (document.body.scrollHeight - innerHeight)) * 36; });
addEventListener('resize', () => { camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight); });
const clock = new THREE.Clock();
function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();camera.position.z += (targetZ-camera.position.z)*.045;camera.position.x=Math.sin((8-camera.position.z)*.12)*.25;camera.lookAt(0,1.55,camera.position.z-6);artworks.forEach((a,i)=>a.position.y=2.3+Math.sin(t+i)*.018);renderer.render(scene,camera)}animate();
