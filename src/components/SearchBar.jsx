import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={20} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search anime..."
      />
    </div>
  );
}
