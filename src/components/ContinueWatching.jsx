import { Link } from "react-router-dom";

import usePlayerStore from "../store/usePlayerStore";

export default function ContinueWatching() {
  const progress = usePlayerStore(
    (state) => state.progress
  );

  const items = Object.values(progress)
    .filter(
      (item) =>
        item.seconds > 0 &&
        item.duration > 0
    )
    .sort(
      (a, b) =>
        b.updatedAt - a.updatedAt
    )
    .slice(0, 10);

  if (!items.length) {
    return null;
  }

  return (
    <section className="continue-section">
      <div className="section-header">
        <div>
          <span className="section-eyebrow">
            PICK UP WHERE YOU LEFT OFF
          </span>

          <h2>Continue Watching</h2>
        </div>
      </div>

      <div className="continue-row">
        {items.map((item) => {
          const percent = Math.min(
            100,
            Math.round(
              (item.seconds /
                item.duration) *
                100
            )
          );

          return (
            <Link
              key={`${item.animeId}-${item.episode}`}
              to={`/watch/${item.animeId}/${item.episode}`}
              className="continue-card"
            >
              <div className="continue-image">
                <img
                  src={
                    item.image ||
                    "/placeholder-anime.jpg"
                  }
                  alt={item.title}
                  loading="lazy"
                />

                <div className="continue-play">
                  ▶
                </div>
              </div>

              <div className="continue-content">
                <h3>{item.title}</h3>

                <p>
                  Episode {item.episode}
                </p>

                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${percent}%`,
                    }}
                  />
                </div>

                <span>
                  {percent}% watched
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
