import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      .then(response => response.json())
      .then(ids => {
        const top5Ids = ids.slice(0, 5);
        return Promise.all(top5Ids.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        ));
      })
      .then(stories => setStories(stories));
  }, []);

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Hacker News Top Stories</h1>
            <div className="flex items-center">
              <span className="mr-2">Dark Mode</span>
              <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
            </div>
          </div>
          <Input 
            placeholder="Search stories..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="mb-4"
          />
          {filteredStories.map(story => (
            <Card key={story.id} className="mb-4">
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>{story.score} upvotes</CardDescription>
              </CardHeader>
              <CardContent>
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Read more
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;