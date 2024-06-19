import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(data => {
        const top5Ids = data.slice(0, 5);
        return Promise.all(top5Ids.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json())
        ));
      })
      .then(stories => setStories(stories));
  }, []);

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <Input 
            type="text" 
            placeholder="Search stories..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
          <div className="flex items-center">
            <span className="mr-2">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </div>
        {filteredStories.map(story => (
          <Card key={story.id} className="mb-4">
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upvotes: {story.score}</p>
              <a href={story.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;