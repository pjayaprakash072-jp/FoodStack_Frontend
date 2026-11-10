const EmptyState = ({
  title = "Nothing here yet",
  text = "create your first record to get started",
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">+</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
};

export default EmptyState;
