// ----- Sample Data -----
const cafes = [
  {
    id: 1,
    name: "Bean & Byte",
    location: "Tirupati",
    rating: 4.5,
    price: 2, // 1=₹, 2=₹₹, 3=₹₹₹
    amenities: ["wifi", "power", "ac", "quiet"],
    hours: "8:00 AM – 9:00 PM",
    notes: "Reliable WiFi, calm music"
  },
  {
    id: 2,
    name: "Roast & Relax",
    location: "Bengaluru",
    rating: 4.2,
    price: 3,
    amenities: ["wifi", "power", "ac", "outdoor"],
    hours: "9:00 AM – 11:00 PM",
    notes: "Great coffee; outdoor seating"
  },
  {
    id: 3,
    name: "Campus Brews",
    location: "Chennai",
    rating: 3.8,
    price: 1,
    amenities: ["wifi", "quiet"],
    hours: "7:30 AM – 8:30 PM",
    notes: "Budget friendly"
  },
  {
    id: 4,
    name: "Pixel Perk Café",
    location: "Hyderabad",
    rating: 4.7,
    price: 2,
    amenities: ["wifi", "power", "ac", "outdoor", "quiet"],
    hours: "10:00 AM – 10:00 PM",
    notes: "Popular with students"
  },
  {
    id: 5,
    name: "Mocha Works",
    location: "Mumbai",
    rating: 4.0,
    price: 2,
    amenities: ["wifi", "power"],
    hours: "8:30 AM – 10:00 PM",
    notes: "Lots of plugs"
  }
];

// ----- DOM -----
const cardsEl = document.getElementById("cards");
const searchEl = document.getElementById("search");
const minRatingEl = document.getElementById("minRating");
const sortByEl = document.getElementById("sortBy");
const amenityChecks = Array.from(document.querySelectorAll(".amenities input[type=checkbox]"));
const resultsCountEl = document.getElementById("resultsCount");
const emptyEl = document.getElementById("emptyState");
const clearFiltersBtn = document.getElementById("clearFilters");

// ----- Helpers -----
const priceToRupees = (p) => "₹".repeat(p);

function renderCards(list) {
  cardsEl.innerHTML = "";
  list.forEach(c => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("div");
    title.className = "title";
    title.innerHTML = `
      <h3>☕ ${c.name}</h3>
      <span class="price">${priceToRupees(c.price)}</span>
    `;

    const loc = document.createElement("p");
    loc.className = "loc";
    loc.textContent = `📍 ${c.location} • ⭐ ${c.rating.toFixed(1)} • 🕒 ${c.hours}`;

    const badges = document.createElement("div");
    badges.className = "badges";
    c.amenities.forEach(a => {
      const chip = document.createElement("span");
      chip.className = "badge";
      chip.textContent = amenityLabel(a);
      badges.appendChild(chip);
    });

    const note = document.createElement("p");
    note.className = "loc";
    note.textContent = c.notes;

    card.appendChild(title);
    card.appendChild(loc);
    card.appendChild(badges);
    card.appendChild(note);

    cardsEl.appendChild(card);
  });
}

function amenityLabel(key){
  const map = { wifi: "WiFi", power: "Power", ac: "AC", outdoor: "Outdoor", quiet: "Quiet" };
  return map[key] || key;
}

function getActiveAmenities() {
  return amenityChecks.filter(cb => cb.checked).map(cb => cb.value);
}

function filterData() {
  const q = searchEl.value.trim().toLowerCase();
  const minRating = parseFloat(minRatingEl.value || "0");
  const requiredAmenities = getActiveAmenities();

  let list = cafes.filter(c => {
    const matchesQuery =
      c.name.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q);

    const hasAllAmenities = requiredAmenities.every(a => c.amenities.includes(a));
    const meetsRating = c.rating >= minRating;

    return matchesQuery && hasAllAmenities && meetsRating;
  });

  // sort
  const sort = sortByEl.value;
  if (sort === "ratingDesc") list.sort((a,b)=>b.rating-a.rating);
  if (sort === "ratingAsc")  list.sort((a,b)=>a.rating-b.rating);
  if (sort === "priceAsc")   list.sort((a,b)=>a.price-b.price);
  if (sort === "priceDesc")  list.sort((a,b)=>b.price-a.price);

  // render + state
  resultsCountEl.textContent = `${list.length} result${list.length !== 1 ? "s" : ""}`;
  emptyEl.hidden = list.length !== 0;
  renderCards(list);
}

function clearFilters(){
  searchEl.value = "";
  minRatingEl.value = "0";
  sortByEl.value = "relevance";
  amenityChecks.forEach(cb => cb.checked = false);
  // default: keep WiFi checked
  const wifi = amenityChecks.find(cb => cb.value === "wifi");
  if (wifi) wifi.checked = true;
  filterData();
}

// ----- Events -----
[searchEl, minRatingEl, sortByEl].forEach(el => el.addEventListener("input", filterData));
amenityChecks.forEach(cb => cb.addEventListener("change", filterData));
clearFiltersBtn.addEventListener("click", clearFilters);

// ----- Init -----
filterData();
