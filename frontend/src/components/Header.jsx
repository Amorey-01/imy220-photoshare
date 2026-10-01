import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <h1>Frame</h1>
      <Link to="/home">Home</Link>
      <Link to="/profile/1">Profile</Link>
      <Link to="/post/1">Post</Link>
    </nav>
  );
}

export default Header;