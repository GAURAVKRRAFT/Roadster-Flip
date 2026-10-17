const g=document.getElementById('g');
document.getElementById('fs').onclick=()=>{const f=g.parentElement;(f.requestFullscreen||f.webkitRequestFullscreen||function(){}).call(f)};
g.parentElement.addEventListener('pointerdown',()=>g.focus());
