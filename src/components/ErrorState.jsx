export default function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="state-box">
      <h3>Oops!</h3>
      <p>{message}</p>
    </div>
  );
}
