import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Profile from '../components/Profile';
import EditProfile from '../components/EditProfile';
import CreatePost from '../components/CreatePost';

const dummyUser = {
  id: 1,
  name: 'Keisha',
  username: 'keisha_art',
  bio: 'Illustrator sharing sketches and studies.',
  profilePic: 'https://via.placeholder.com/100',
};

const dummyPosts = [
  {
    id: 1,
    imageUrl: 'https://via.placeholder.com/300',
    description: 'A quick sketch from today',
    hashtags: ['#sketch', '#art'],
    author: 'keisha_art',
  },
];

const dummyFriends = [
  { id: 2, username: 'another_artist', profilePic: 'https://via.placeholder.com/50' },
  { id: 3, username: 'sketchbook_sam', profilePic: 'https://via.placeholder.com/50' },
];

function ProfilePage() {
  const { id } = useParams();
  // id available here for later — same dummy data rendered regardless for now


  return (
    <div>
      <Header />
      <Profile user={dummyUser} posts={dummyPosts} friends={dummyFriends} />
      <EditProfile user={dummyUser} />
      <CreatePost />
    </div>
  );
}

export default ProfilePage;