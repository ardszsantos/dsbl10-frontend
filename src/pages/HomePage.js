import React from 'react';
import NavBar from '../components/navbar';
import PostRender from '../components/Postloader';

function HomePage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Título da página */}
        <h1 className="text-3xl font-bold mb-6 mt-12 text-gray-800 dark:text-gray-200">
          Latest Posts
        </h1>

        {/* Área de posts, com largura ajustável conforme o tamanho da tela */}
        <div className="posts-area bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-screen-lg p-6">
          {/* Título da seção de posts */}
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Posts
          </h2>

          {/* Container responsivo que renderiza os posts */}
          <div className="flex flex-col space-y-4">
            <PostRender />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
