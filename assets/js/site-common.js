document.addEventListener('DOMContentLoaded',()=>{
  // Loading screen (solo si existe)
  const loadingScreen=document.getElementById('loading-screen');
  const hasVisited=sessionStorage.getItem('hasVisitedSite');
  if(loadingScreen){
    if(!hasVisited){
      sessionStorage.setItem('hasVisitedSite','true');
      setTimeout(()=>{
        loadingScreen.style.opacity='0';
        setTimeout(()=>loadingScreen.style.display='none',500);
      },1200);
    }else{
      loadingScreen.style.display='none';
    }
  }
  // Hamburger & sidebar
  let sidebarOpen=false;
  const hamburger=document.getElementById('hamburger');
  const sidebar=document.getElementById('sidebar');
  const overlay=document.getElementById('overlay');
  const closeBtn=document.getElementById('close-btn');
  function toggleSidebar(){
    sidebarOpen=!sidebarOpen;
    if(sidebar){
      sidebar.classList.toggle('translate-x-full',!sidebarOpen);
      sidebar.classList.toggle('translate-x-0',sidebarOpen);
    }
    if(overlay){
      overlay.classList.toggle('invisible',!sidebarOpen);
      overlay.classList.toggle('opacity-0',!sidebarOpen);
      overlay.classList.toggle('opacity-100',sidebarOpen);
    }
    document.body.style.overflow= sidebarOpen?'hidden':'';
    if(hamburger){
      const bars=hamburger.querySelectorAll('.bar');
      if(bars.length>=3){
        if(sidebarOpen){
          bars[0].style.transform='rotate(45deg) translate(5px,5px)';
          bars[1].style.opacity='0';
          bars[2].style.transform='rotate(-45deg) translate(5px,-5px)';
        }else{
          bars.forEach(b=>{b.style.transform='';b.style.opacity='1';});
        }
        hamburger.setAttribute('aria-expanded',sidebarOpen?'true':'false');
      }
    }
  }
  hamburger && hamburger.addEventListener('click',e=>{e.preventDefault();toggleSidebar();});
  closeBtn && closeBtn.addEventListener('click',e=>{e.preventDefault();sidebarOpen&&toggleSidebar();});
  overlay && overlay.addEventListener('click',()=>{sidebarOpen&&toggleSidebar();});
});
