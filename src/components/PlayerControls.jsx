import { SkipBack, SkipForward, Volume2, Maximize } from "lucide-react";

export default function PlayerControls() {
  return (
    <div className="player-controls">
      <button><SkipBack size={18} /></button>
      <button><Volume2 size={18} /></button>
      <div className="progress">
        <span />
      </div>
      <button><SkipForward size={18} /></button>
      <button><Maximize size={18} /></button>
    </div>
  );
}
