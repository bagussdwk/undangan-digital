const WEDDING = {
  bride: "Mega",
  groom: "Bagus",
  brideFull: "Mega Ayu Lestari",
  groomFull: "Bagus Dwi Kurniawan",
  brideParents: "Putri dari Bapak Samsul Sholeh & Ibu Ririn Udiarti Rohmatin",
  groomParents: "Putra dari Bapak Ahmad Jali & Ibu Siti Latifah",
  dateText: "Rabu, 6 Januari 2027",
  eventDate: "2027-01-06T08:00:00+08:00",
  akadTime: "08.00 WITA – Selesai",
  receptionTime: "11.00 – 17.00 WITA",
  place: "Gedung Busak Malur, Berau",
  mapsUrl: "https://maps.app.goo.gl/WvFfPRP9JhYmwGhY6",
  whatsapp: "6281234567890",
  bankName: "BANK MANDIRI",
  accountNumber: "0000 0000 0000",
  accountOwner: "Mega Ayu Lestari",
};
const $ = (id) => document.getElementById(id);
function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}
function initInvitation() {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");
  const guestName = guest ? guest.replace(/\+/g, " ") : "Tamu Undangan";
  setText("guestName", guestName);
  setText("brideName", WEDDING.brideFull);
  setText("groomName", WEDDING.groomFull);
  setText("brideParents", WEDDING.brideParents);
  setText("groomParents", WEDDING.groomParents);
  setText("akadDate", WEDDING.dateText);
  setText("receptionDate", WEDDING.dateText);
  setText("akadTime", WEDDING.akadTime);
  setText("receptionTime", WEDDING.receptionTime);
  setText("akadPlace", WEDDING.place);
  setText("receptionPlace", WEDDING.place);
  setText("accountNumber", WEDDING.accountNumber);
  setText("accountOwner", "a.n. " + WEDDING.accountOwner);
  const bank = document.querySelector(".gift-bank");
  if (bank) bank.textContent = WEDDING.bankName;
  $("mapsLink")?.setAttribute("href", WEDDING.mapsUrl);
  if (guest) $("senderName").value = guestName;
  $("openInvitation").addEventListener("click", async () => {
    // Gunakan satu pemutar musik yang sama untuk seluruh undangan
    const audio = $("weddingAudio");
    const musicButton = $("musicToggle");

    if (audio) {
      audio.volume = 0.4;
      try {
        await audio.play();
        if (musicButton) {
          musicButton.textContent = "♫ Musik ON";
          musicButton.classList.add("is-playing");
        }
      } catch (error) {
        console.log("Musik belum tersedia atau gagal diputar:", error);
      }
    }

    // Transisi pembuka sinematik: taman bunga bergerak sebelum cover menghilang
    $("cover").classList.add("cover-opening");
    $("mainContent").classList.remove("locked");
    $("mainContent").classList.add("unlocked");

    setTimeout(() => $("cover").classList.add("is-hidden"), 650);
    setTimeout(() => ($("cover").style.display = "none"), 1550);
  });
  $("menuToggle").addEventListener("click", () =>
    $("navLinks").classList.toggle("show"),
  );
  document
    .querySelectorAll(".nav-links a")
    .forEach((link) =>
      link.addEventListener("click", () =>
        $("navLinks").classList.remove("show"),
      ),
    );
  const audio = $("weddingAudio"),
    musicButton = $("musicToggle");
  musicButton.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        musicButton.textContent = "♫ Musik ON";
        musicButton.classList.add("is-playing");
      } else {
        audio.pause();
        musicButton.textContent = "♫ Musik";
        musicButton.classList.remove("is-playing");
      }
    } catch (error) {
      alert(
        "Musik belum tersedia. Tambahkan file assets/audio/music.mp3 terlebih dahulu.",
      );
    }
  });
  $("copyAccount").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(WEDDING.accountNumber);
      $("copyAccount").textContent = "Nomor Berhasil Disalin ✓";
    } catch (error) {
      alert("Nomor rekening: " + WEDDING.accountNumber);
    }
  });
  $("rsvpForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("senderName").value.trim(),
      attendance = $("attendance").value,
      message = $("message").value.trim();
    if (!name) return;
    const textMessage = `Assalamu'alaikum, saya ${name}.\n\nKonfirmasi kehadiran: ${attendance}.\nUcapan & doa: ${message || "-"}\n\nUntuk undangan ${WEDDING.brideFull} & ${WEDDING.groomFull}.`;
    window.open(
      `https://wa.me/${WEDDING.whatsapp}?text=${encodeURIComponent(textMessage)}`,
      "_blank",
      "noopener",
    );
  });
  initScrollAnimations();
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function initScrollAnimations() {
  const sections = document.querySelectorAll("main section");
  sections.forEach((section, sectionIndex) => {
    const items = [...section.children].filter((el) => !el.classList.contains("inside-garden"));
    items.forEach((el, index) => {
      const direction = (index + sectionIndex) % 3;
      el.classList.add(direction === 0 ? "reveal-left" : direction === 1 ? "reveal-right" : "reveal-up");
      el.style.setProperty("--reveal-delay", `${Math.min(index * 110, 440)}ms`);
    });
  });

  document.querySelectorAll(".person, .event-card, .timeline article, .gallery-photo, .gift-card, .rsvp-form").forEach((el, index) => {
    el.classList.add(index % 2 === 0 ? "reveal-up" : "reveal-up");
    el.style.setProperty("--reveal-delay", `${(index % 4) * 100}ms`);
  });

  const revealItems = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });
  revealItems.forEach((el) => observer.observe(el));
}

function updateCountdown() {
  const distance = new Date(WEDDING.eventDate).getTime() - Date.now();
  if (distance <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach((id) => setText(id, "00"));
    return;
  }
  setText("days", String(Math.floor(distance / 86400000)).padStart(2, "0"));
  setText(
    "hours",
    String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0"),
  );
  setText(
    "minutes",
    String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0"),
  );
  setText(
    "seconds",
    String(Math.floor((distance % 60000) / 1000)).padStart(2, "0"),
  );
}
document.addEventListener("DOMContentLoaded", initInvitation);
