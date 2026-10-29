function Avatar({ user, size = 'md' }) {
  const dims = { sm: 'h-8 w-8 text-xs', md: 'h-11 w-11 text-sm', xl: 'h-28 w-28 text-3xl' }[size];
  if (user?.profilePic) {
    return <img src={user.profilePic} alt={user.username} className={`${dims} shrink-0 rounded-full object-cover ring-2 ring-sand`} />;
  }
  return (
    <span className={`${dims} flex shrink-0 items-center justify-center rounded-full bg-sage font-display font-semibold text-cream ring-2 ring-sand`}>
      {user?.username?.[0]?.toUpperCase() || '?'}
    </span>
  );
}

export default Avatar;
