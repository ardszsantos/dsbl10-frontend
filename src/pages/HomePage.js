import React from 'react';
import NavBar from '../components/navbar';
import PostRender from '../components/Postloader';  // Updated component

function HomePage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-300">
        <h1 className="text-3xl font-bold mb-4 mt-20">Latest Posts:</h1>
        <div className="posts-area bg-white shadow-md rounded-lg w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">#</th>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Author</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <PostRender /> {/* Injecting PostRender directly into the table */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
