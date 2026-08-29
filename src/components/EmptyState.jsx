export default function EmptyState({
  text = "Nothing here yet.",
}) {
  return (
    <div className="state-box">
      <p>{text}</p>
    </div>
  );
}
