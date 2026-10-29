import { Link } from 'react-router-dom';

function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album._id}`} className="group block overflow-hidden rounded-2xl border border-sandDark/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[4/3] bg-sand">
        {album.cover
          ? <img src={album.cover} alt={album.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          : <div className="flex h-full items-center justify-center text-sm text-muted">Empty album</div>}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="text-lg font-semibold">{album.name}</h3>
        <p className="line-clamp-2 text-sm text-muted">{album.description}</p>
        <p className="text-xs text-muted">{album.postIds.length} {album.postIds.length === 1 ? 'post' : 'posts'}</p>
      </div>
    </Link>
  );
}

export default AlbumCard;
