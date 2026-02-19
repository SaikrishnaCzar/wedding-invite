(async function init(){
    const res = await fetch("config/details.json", { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to load config/details.json");
      return;
    }
    const data = await res.json();
  
    // Hero text
    document.getElementById("groomName").textContent = data.couple?.groom ?? "Groom";
    document.getElementById("brideName").textContent = data.couple?.bride ?? "Bride";
    document.getElementById("heroTopLine").textContent = data.hero?.topLine ?? "";
    document.getElementById("heroBottomLine").textContent = data.hero?.bottomLine ?? "";
    document.getElementById("heroDate").textContent = data.hero?.dateText ?? "";
  
    // Florals (optional)
    const tr = document.getElementById("floralTR");
    const bl = document.getElementById("floralBL");
    if (data.assets?.floralTopRight) tr.src = data.assets.floralTopRight;
    if (data.assets?.floralBottomLeft) bl.src = data.assets.floralBottomLeft;
  
    // Events
    const eventsTrack = document.getElementById("eventsTrack");
    (data.events ?? []).forEach(ev => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.innerHTML = `
        <article class="eventCard">
          <div class="eventImg" style="background-image:url('${ev.image || ""}')"></div>
          <div class="eventBody">
            <h3 class="eventTitle">${escapeHtml(ev.title || "")}</h3>
            <div class="meta">
              <div>🗓️ ${escapeHtml(ev.datetime || "")}</div>
              <div>📍 ${escapeHtml(ev.venue || "")}</div>
            </div>
            <div class="btnRow">
              <a class="btn" href="${ev.mapUrl || "#"}" target="_blank" rel="noopener">Map</a>
              <a class="btn btnPrimary" href="${ev.liveUrl || "#"}" target="_blank" rel="noopener">Live Stream</a>
            </div>
          </div>
        </article>
      `;
      eventsTrack.appendChild(slide);
    });
  
    // Photos
    const photosTrack = document.getElementById("photosTrack");
    (data.photos ?? []).forEach(url => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.innerHTML = `
        <div class="photoWrap">
          <img class="photo" src="${url}" alt="Photo" loading="lazy" />
        </div>
      `;
      photosTrack.appendChild(slide);
    });
  
    // Carousel controls
    document.querySelectorAll(".carousel").forEach(setupCarousel);
  })();
  
  function setupCarousel(root){
    const track = root.querySelector(".track");
    const prev = root.querySelector(".navPrev");
    const next = root.querySelector(".navNext");
  
    function scrollBySlide(dir){
      const firstSlide = track.querySelector(".slide");
      if(!firstSlide) return;
      const slideWidth = firstSlide.getBoundingClientRect().width;
      const gap = 16;
      track.scrollBy({ left: (slideWidth + gap) * dir, behavior: "smooth" });
    }
  
    prev?.addEventListener("click", () => scrollBySlide(-1));
    next?.addEventListener("click", () => scrollBySlide(1));
  }
  
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",
      '"':"&quot;","'":"&#039;"
    }[s]));
  }
  