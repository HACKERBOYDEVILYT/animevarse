import { ExternalLink, Play } from "lucide-react";

export default function VideoPlayer({
  title,
  trailer,
  streamingEpisodes = []
}) {
  function getYoutubeEmbed(url) {
    if (!url) return null;

    try {
      const parsed = new URL(url);

      if (
        parsed.hostname.includes(
          "youtube.com"
        )
      ) {
        const id =
          parsed.searchParams.get("v");

        if (id) {
          return `https://www.youtube.com/embed/${id}?rel=0`;
        }
      }

      if (
        parsed.hostname === "youtu.be"
      ) {
        const id =
          parsed.pathname.replace("/", "");

        if (id) {
          return `https://www.youtube.com/embed/${id}?rel=0`;
        }
      }
    } catch {}

    return null;
  }

  const trailerUrl =
    getYoutubeEmbed(trailer);

  return (
    <div className="video-player">

      {trailerUrl ? (
        <iframe
          className="video-frame"
          src={trailerUrl}
          title={title}
          allowFullScreen
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <div className="video-placeholder">
          <Play size={48} />

          <h2>{title}</h2>

          <p>
            Choose an official streaming
            source below.
          </p>
        </div>
      )}

      {streamingEpisodes.length > 0 && (
        <div className="streaming-sources">

          <h3>
            Watch this anime legally
          </h3>

          <div className="streaming-list">

            {streamingEpisodes.map(
              (source, index) => (
                <a
                  key={`${source.site}-${index}`}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="streaming-button"
                >
                  <ExternalLink
                    size={18}
                  />

                  <span>
                    {source.title ||
                      `Episode ${index + 1}`}
                  </span>

                  <small>
                    {source.site}
                  </small>
                </a>
              )
            )}

          </div>
        </div>
      )}

      {streamingEpisodes.length === 0 && (
        <div className="no-streaming">
          <p>
            No official streaming link was
            found for this anime.
          </p>
        </div>
      )}

    </div>
    );
}

    
