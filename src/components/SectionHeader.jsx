import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function SectionHeader({ title, subtitle, link }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {link && (
        <Link to={link} className="view-all">
          View All
          <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;
