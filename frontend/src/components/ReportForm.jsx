import { useEffect, useState } from 'react';
import { api } from '../api';

function ReportForm({ postId, onDone }) {
  const [reasons, setReasons] = useState([]);
  const [reasonId, setReasonId] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { api('/reasons').then(setReasons).catch((e) => setError(e.message)); }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      await api(`/posts/${postId}/report`, { method: 'POST', body: { reasonId, details } });
      onDone('Thanks, your report has been sent to the admins.');
    } catch (err) { setError(err.message); }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl bg-sand/60 p-4">
      <h3 className="text-lg font-semibold">Report this post</h3>
      {error && <p className="error">{error}</p>}
      <select className="input" value={reasonId} onChange={(e) => setReasonId(e.target.value)} aria-label="Reason">
        <option value="">Choose a reason…</option>
        {reasons.map((r) => <option key={r._id} value={r._id}>{r.text}</option>)}
      </select>
      <textarea className="input" rows={2} placeholder="Anything else we should know? (optional)" value={details} onChange={(e) => setDetails(e.target.value)} />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Send report</button>
        <button type="button" className="btn-ghost" onClick={() => onDone()}>Cancel</button>
      </div>
    </form>
  );
}

export default ReportForm;
