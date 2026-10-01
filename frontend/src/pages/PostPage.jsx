import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Post from '../components/Post';
import EditPost from '../components/EditPost';

const dummyPost = {
  id: 1,
  imageUrl: 'https://via.placeholder.com/400',
  description: 'A quick sketch from today',
  hashtags: ['#sketch', '#art'],
  author: 'keisha_art',
  albums: ['Sketchbook 2026'],
  comments: [
    { id: 1, author: 'another_artist', text: 'Love this!' },
    { id: 2, author: 'sketchbook_sam', text: 'Great linework' },
  ],
};

function PostPage() {
  const { id } = useParams();

  return (
    <div>
      <Header />
      <Post post={dummyPost} />
      <EditPost post={dummyPost} />
    </div>
  );
}

export default PostPage;