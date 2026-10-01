function Comments({ comments }) {
  return (
    <section>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <p key={comment.id}>
          <strong>{comment.author}:</strong> {comment.text}
        </p>
      ))}
    </section>
  );
}

export default Comments;