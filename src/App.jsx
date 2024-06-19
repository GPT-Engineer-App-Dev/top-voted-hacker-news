import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames';

const App = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const { data: topStoryIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const top5StoryIds = topStoryIds.slice(0, 5);
        const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const stories = await Promise.all(storyPromises);
        setStories(stories.map(story => story.data));
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className={classNames('min-h-screen p-4', { 'bg-gray-900 text-white': darkMode, 'bg-white text-black': !darkMode })}>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hacker News Top Stories</h1>
        <button
          className="px-4 py-2 border rounded"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle Dark Mode
        </button>
      </header>
      <input
        type="text"
        placeholder="Search stories..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredStories.map(story => (
          <li key={story.id} className="mb-4">
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold">
              {story.title}
            </a>
            <p>{story.score} upvotes</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;