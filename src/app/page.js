'use client';

import { useEffect, useState, useRef } from 'react';

function PostsTable({ posts }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Body</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{post.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{post.userId}</td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{post.title}</td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{post.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Home() {
  const [allPosts, setAllPosts] = useState([]); // Store all posts
  const [displayedPosts, setDisplayedPosts] = useState([]); // Posts currently shown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postsPerPage] = useState(10);
  const bottomRef = useRef(null); // Add ref for bottom of content
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setAllPosts(data);
        setDisplayedPosts(data.slice(0, postsPerPage)); // Show first 10 posts
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [postsPerPage]);

  const loadMore = () => {
    const currentLength = displayedPosts.length;
    const nextPosts = allPosts.slice(currentLength, currentLength + postsPerPage);
    setDisplayedPosts([...displayedPosts, ...nextPosts]);
    
    // Scroll to bottom after state update
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const remainingPosts = allPosts.length - displayedPosts.length;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Posts</h1>
      
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center">
          Error: {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
          <PostsTable posts={displayedPosts} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Showing {displayedPosts.length} of {allPosts.length} posts
            </p>
            
            {remainingPosts > 0 && (
              <button
                onClick={loadMore}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Load More ({remainingPosts} remaining)
              </button>
            )}
            <div ref={bottomRef} />
          </div>
        </>
      )}
    </div>
  );
}
