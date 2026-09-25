export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="empty-state empty-state--error" role="alert">
      <p className="empty-state__title">Couldn't load this</p>
      <p className="empty-state__body">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
