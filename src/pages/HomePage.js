import React from 'react';
import NavBar from '../components/navbar';
import PostRender from '../components/Postloader';  // Updated component

function HomePage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        {/* Título da página */}
        <h1 className="text-3xl font-bold mb-6 mt-12 text-gray-800">Latest Posts</h1>

        {/* Área de posts, com largura ajustável conforme o tamanho da tela */}
        <div className="posts-area bg-white shadow-lg rounded-lg w-full max-w-screen-lg p-6">
          {/* Título da seção de posts */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Posts</h2>

          {/* Container responsivo que renderiza os posts */}
          <div className="flex flex-col space-y-4">
            <PostRender /> {/* Renderiza os posts diretamente aqui */}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
