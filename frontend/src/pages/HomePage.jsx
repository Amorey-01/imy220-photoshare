import Header from '../components/Header';
import Feed from '../components/Feed';
import SearchInput from '../components/SearchInput';

const dummyPosts = [
  {
    id: 1,
    imageUrl: 'https://via.placeholder.com/300',
    description: 'A quick sketch from today',
    hashtags: ['#sketch', '#art'],
    author: 'keisha_art',
  },
  {
    id: 2,
    imageUrl: 'https://via.placeholder.com/300',
    description: 'Watercolour study',
    hashtags: ['#watercolour', '#painting'],
    author: 'another_artist',
  },
];

function HomePage() {
  return (
    <div>
      <Header />
      <SearchInput />
      <Feed posts={dummyPosts} />
    </div>
  );
}

export default HomePage;