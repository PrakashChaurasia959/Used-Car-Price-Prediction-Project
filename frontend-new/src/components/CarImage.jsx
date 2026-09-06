// Reliable Unsplash car images per brand + inline SVG fallback (no broken images ever)

const BRAND_IMAGES = {
  Maruti:     "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=75&auto=format&fit=crop&crop=center",
  Hyundai:    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=75&auto=format&fit=crop&crop=center",
  Honda:      "https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?w=600&q=75&auto=format&fit=crop&crop=center",
  Toyota:     "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&q=75&auto=format&fit=crop&crop=center",
  Ford:       "https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&q=75&auto=format&fit=crop&crop=center",
  Tata:       "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=75&auto=format&fit=crop&crop=center",
  Mahindra:   "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=75&auto=format&fit=crop&crop=center",
  Volkswagen: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=75&auto=format&fit=crop&crop=center",
  BMW:        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=75&auto=format&fit=crop&crop=center",
  Mercedes:   "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=75&auto=format&fit=crop&crop=center",
};

// Generic car fallback — always works (inline SVG data URI)
const SVG_FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='300' viewBox='0 0 600 300'%3E%3Crect width='600' height='300' fill='%23f1f5f9'/%3E%3Cg transform='translate(300,150)' fill='%2394a3b8'%3E%3Cpath d='M-120-20 Q-80-60 -20-60 L80-60 Q120-60 140-20 L160-20 A10 10 0 0 1 160 0 L-160 0 A10 10 0 0 1 -160-20Z'/%3E%3Crect x='-160' y='0' width='320' height='30' rx='4'/%3E%3Ccircle cx='-100' cy='40' r='28' fill='%2364748b'/%3E%3Ccircle cx='-100' cy='40' r='14' fill='%23f1f5f9'/%3E%3Ccircle cx='100' cy='40' r='28' fill='%2364748b'/%3E%3Ccircle cx='100' cy='40' r='14' fill='%23f1f5f9'/%3E%3C/g%3E%3C/svg%3E`;

const UNSPLASH_FALLBACK = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=75&auto=format&fit=crop&crop=center";

export function getCarImage(brand) {
  return BRAND_IMAGES[brand] || UNSPLASH_FALLBACK;
}

export default function CarImage({ brand, className = "", style = {}, alt = "" }) {
  return (
    <img
      src={getCarImage(brand)}
      alt={alt || `${brand || "Car"} image`}
      className={className}
      style={style}
      loading="lazy"
      onError={e => {
        // First fallback: generic Unsplash car
        if (!e.target.dataset.fallback1) {
          e.target.dataset.fallback1 = "1";
          e.target.src = UNSPLASH_FALLBACK;
        } else {
          // Final fallback: inline SVG — never fails
          e.target.src = SVG_FALLBACK;
        }
      }}
    />
  );
}
