/* Solara v3 — optional lightweight Three.js illustration. No geometry-heavy effects. */
(() => {
  'use strict';
  const root = document.getElementById('solar-three');
  const hour = document.getElementById('solar-hour');
  const weather = document.getElementById('scene-weather');
  const playButton = document.getElementById('solar-play');
  const status = document.getElementById('scene-status');
  const put = (id, text) => { document.getElementById(id).textContent = window.tDynamic?.(text) || text; };
  const RAD = Math.PI / 180;
  let data = null, pvKW = 0, loss = 0, scene, camera, renderer, sun, glow, rays = [], panelGroup, beamMaterial;
  let playing = false, visible = false, drag = false, px = 0, py = 0, az = 0.8, polar = 1.06, radius = 10, raf = 0, previous = 0, playAccum = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function angles(time) {
    const lat = data.latitude * RAD, decl = data.solar_declination_deg * RAD;
    const h = (time - 12) * 15 * RAD;
    const east = -Math.cos(decl) * Math.sin(h);
    const up = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(h);
    const north = Math.cos(lat) * Math.sin(decl) - Math.sin(lat) * Math.cos(decl) * Math.cos(h);
    const tilt = data.selected_tilt_deg * RAD;
    // South-facing panel normal, coordinate frame: +x east, +y up, +z north.
    const incidence = Math.max(0, up * Math.cos(tilt) - north * Math.sin(tilt));
    return { east, up, north, incidence, elevation: Math.asin(clamp(up, -1, 1)) / RAD };
  }
  function makeLine(points, color, opacity=1) {
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({color, transparent: opacity < 1, opacity}));
  }
  function initialize() {
    if (typeof THREE === 'undefined') { status.textContent = window.t?.('3D library unavailable') || '3D library unavailable'; return false; }
    try {
      renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, powerPreference: 'low-power'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(root.clientWidth, root.clientHeight, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      root.querySelector('.scene-fallback').hidden = true;
      root.insertBefore(renderer.domElement, root.firstChild);
    } catch (_) { status.textContent = window.t?.('WebGL unavailable · numeric results still work') || 'WebGL unavailable · numeric results still work'; return false; }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, root.clientWidth / root.clientHeight, .1, 100);
    scene.add(new THREE.HemisphereLight(0xe9f5ff, 0x73988b, 2.1));
    const directional = new THREE.DirectionalLight(0xffedbf, 1.45); directional.position.set(-3, 8, 4); scene.add(directional);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(5.5, 56), new THREE.MeshLambertMaterial({color: 0xc5dfca, transparent:true, opacity:.88}));
    ground.rotation.x = -Math.PI/2; ground.position.y = -.085; scene.add(ground);
    const grid = new THREE.GridHelper(10, 10, 0x97bcb2, 0xaac9bf); grid.position.y=-.075; scene.add(grid);
    const metal = new THREE.MeshStandardMaterial({color:0x728996, metalness:.42, roughness:.46});
    const blue = new THREE.MeshStandardMaterial({color:0x164c73, metalness:.25, roughness:.32});
    const lines = new THREE.LineBasicMaterial({color:0x91c5dd});
    panelGroup = new THREE.Group(); panelGroup.position.y=1.45; scene.add(panelGroup);
    const pv = new THREE.Mesh(new THREE.BoxGeometry(3.5,.09,2.24),blue); panelGroup.add(pv);
    for(let i=1;i<6;i++) panelGroup.add(makeLine([new THREE.Vector3(-1.75+i*3.5/6,.052,-1.12),new THREE.Vector3(-1.75+i*3.5/6,.052,1.12)], 0x92cde2));
    for(let i=1;i<4;i++) panelGroup.add(makeLine([new THREE.Vector3(-1.75,.052,-1.12+i*2.24/4),new THREE.Vector3(1.75,.052,-1.12+i*2.24/4)], 0x92cde2));
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.54,.12,2.28)),new THREE.LineBasicMaterial({color:0xd4e5e7})); panelGroup.add(frame);
    for(const x of [-1.35,1.35]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,1.37,8),metal); leg.position.set(x,.66,0); scene.add(leg);
    }
    const sunMat = new THREE.MeshBasicMaterial({color:0xffc44b});
    sun = new THREE.Mesh(new THREE.SphereGeometry(.3,16,12),sunMat); scene.add(sun);
    glow = new THREE.Mesh(new THREE.SphereGeometry(.47,12,10), new THREE.MeshBasicMaterial({color:0xffe69e,transparent:true,opacity:.25,depthWrite:false})); scene.add(glow);
    beamMaterial = new THREE.LineBasicMaterial({color:0xf9af36, transparent:true,opacity:.85});
    for(let i=0;i<6;i++){ const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),beamMaterial); scene.add(line); rays.push(line); }
    // Direction reference: north arrow and an arc tracing apparent position over the selected day.
    scene.add(makeLine([new THREE.Vector3(0,.02,0),new THREE.Vector3(0,.02,3.3)],0x246d76));
    const orbit=[];
    for(let h=5;h<=19;h+=.15){const a=angles(h);if(a.up>0) orbit.push(new THREE.Vector3(a.east*5, Math.max(.06,a.up*5)+1.5,a.north*5));}
    if(orbit.length>1) scene.add(makeLine(orbit,0xe4a95c,.75));
    resize(); status.textContent = window.t?.('3D ready · drag to rotate') || '3D ready · drag to rotate';
    root.addEventListener('pointerdown', e => {if(e.button!==0)return;drag=true;px=e.clientX;py=e.clientY;root.setPointerCapture(e.pointerId);});
    root.addEventListener('pointermove',e=>{if(!drag)return;az+=(e.clientX-px)*.008;polar=clamp(polar+(e.clientY-py)*.008,.32,1.47);px=e.clientX;py=e.clientY;draw();});
    root.addEventListener('pointerup',()=>{drag=false;});root.addEventListener('pointercancel',()=>{drag=false;});
    root.addEventListener('wheel',e=>{e.preventDefault();radius=clamp(radius+e.deltaY*.012,6,16);draw();},{passive:false});
    if('ResizeObserver' in window) new ResizeObserver(resize).observe(root); else window.addEventListener('resize',resize);
    if('IntersectionObserver' in window) new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;startOrStop();},{threshold:.03}).observe(root);
    else visible=true;
    return true;
  }
  function resize(){if(!renderer)return;const w=Math.max(1,root.clientWidth),h=Math.max(1,root.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);draw();}
  function draw(){if(!renderer||!data)return;
    const a=angles(Number(hour.value)), tilt=data.selected_tilt_deg*RAD, clouds=weather.value==='cloudy';
    panelGroup.rotation.x=-tilt;
    const sunDir=new THREE.Vector3(a.east,a.up,a.north);
    sun.position.copy(sunDir).multiplyScalar(5).add(new THREE.Vector3(0,1.45,0));glow.position.copy(sun.position);
    sun.visible=glow.visible=a.up>0;
    const intensity=clouds ? data.cloud_transmission_percent/100 : 1;
    beamMaterial.opacity=(a.up>0 ? .75*intensity+.08 : 0);
    for(let i=0;i<rays.length;i++){
      const x=(i%3-1)*1.05, z=(Math.floor(i/3)-.5)*1.1;
      const target=new THREE.Vector3(x,.04,z).applyEuler(panelGroup.rotation).add(panelGroup.position);
      const origin=target.clone().addScaledVector(sunDir,3.2);
      rays[i].geometry.dispose();rays[i].geometry=new THREE.BufferGeometry().setFromPoints([origin,target]);rays[i].visible=a.up>0&&a.incidence>0;
    }
    const noon=angles(12), altitudeFactor=noon.up>0?clamp(a.up/noon.up,0,1):0;
    const power = pvKW*(1-loss/100)*a.incidence*altitudeFactor*intensity;
    const elev=Math.max(0,a.elevation);
    put('hour-value',`${String(Math.floor(Number(hour.value))).padStart(2,'0')}:${String(Math.round(Number(hour.value)%1*60)).padStart(2,'0')}`);
    put('scene-sun-label',`Solar time ${document.getElementById('hour-value').textContent}`);
    put('scene-elevation',`${elev.toFixed(1)}°`);put('scene-incidence',`${(a.incidence*100).toFixed(0)}%`);
    put('scene-power',`${power.toFixed(2)} kW`);put('scene-tilt',`${data.selected_tilt_deg.toFixed(0)}°`);
    camera.position.set(Math.sin(az)*Math.sin(polar)*radius,Math.cos(polar)*radius+1.1,Math.cos(az)*Math.sin(polar)*radius);
    camera.lookAt(0,1.1,0);renderer.render(scene,camera);
  }
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;previous=0;}
  function startOrStop(){if(playing&&visible&&!reduce.matches&&renderer&&!document.hidden){if(!raf)raf=requestAnimationFrame(tick);}else stop();}
  function tick(now){raf=0;if(!playing||!visible||reduce.matches||document.hidden)return;const dt=previous?Math.min(.08,(now-previous)/1000):0;previous=now;playAccum+=dt;
    // 12 seconds for a 12-hour solar-day walk-through; render at 30 fps maximum.
    if(playAccum>=.25){hour.value=Number(hour.value)>=18?6:Math.min(18,Number(hour.value)+.25);playAccum=0;draw();}
    raf=requestAnimationFrame(tick);
  }
  function toggle(){playing=!playing;playButton.textContent=window.t?.(playing?'Ⅱ Pause sun path':'▶ Play sun path') || (playing?'Ⅱ Pause sun path':'▶ Play sun path');playButton.setAttribute('aria-pressed',String(playing));startOrStop();}
  hour.addEventListener('input',draw);weather.addEventListener('change',draw);playButton.addEventListener('click',toggle);
  document.addEventListener('visibilitychange',startOrStop);
  reduce.addEventListener?.('change',()=>{if(reduce.matches&&playing)toggle();startOrStop();});
  let ok=false;
  window.Solara3D={setData(solar, installedKW, lossPercent){data=solar;pvKW=Number(installedKW);loss=Number(lossPercent);if(!ok)ok=initialize();if(ok){draw();startOrStop();}else{const a=angles(Number(hour.value));put('scene-elevation',`${Math.max(0,a.elevation).toFixed(1)}°`);put('scene-tilt',`${solar.selected_tilt_deg}°`);}}};
})();
