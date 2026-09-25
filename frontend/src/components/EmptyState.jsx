export default function EmptyState({ title = "Nothing here yet", body, icon = "🏟️" }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="empty-state__title">{title}</p>
      {body && <p className="empty-state__body">{body}</p>}
    </div>
  );
}
