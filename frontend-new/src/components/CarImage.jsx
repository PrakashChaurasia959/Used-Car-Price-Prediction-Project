// Car images mapped to brand + fallback
const BRAND_IMAGES = {
  Maruti:      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&q=70&auto=format&fit=crop",
  Hyundai:     "https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=400&q=70&auto=format&fit=crop",
  Honda:       "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=70&auto=format&fit=crop",
  Toyota:      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&q=70&auto=format&fit=crop",
  Ford:        "https://images.unsplash.com/photo-1551830820-330a71b99659?w=400&q=70&auto=format&fit=crop",
  Tata:        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=70&auto=format&fit=crop",
  Mahindra:    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=70&auto=format&fit=crop",
  Volkswagen:  "https://images.unsplash.com/photo-1619976215249-4a1c8f3ad4c1?w=400&q=70&auto=format&fit=crop",
  BMW:         "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=70&auto=format&fit=crop",
  Mercedes:    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=70&auto=format&fit=crop",
};

const FALLBACK = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=70&auto=format&fit=crop";

export function getCarImage(brand) {
  return BRAND_IMAGES[brand] || FALLBACK;
}

export default function CarImage({ brand, className = "", style = {}, alt = "" }) {
  return (
    <img
      src={getCarImage(brand)}
      alt={alt || `${brand} car`}
      className={className}
      style={style}
      loading="lazy"
      onError={e => { e.target.src = FALLBACK; }}
    />
  );
}
