export default function VideoPlayer({ title }) {
  return (
    <div className="video-player">
      <div className="video-placeholder">
        <div className="big-play">▶</div>
        <h2>{title}</h2>
        <p>Authorized video source will appear here.</p>
      </div>
    </div>
  );
}
