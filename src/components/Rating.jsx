import { Star } from "lucide-react";

export default function Rating({ value }) {
  return (
    <span className="rating">
      <Star size={15} fill="currentColor" />
      {value}
    </span>
  );
}
