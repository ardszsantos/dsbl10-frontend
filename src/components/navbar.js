import { useNavigate } from 'react-router-dom';
import CreatePost from './createPost';

const NavBar = () => {

  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo or Brand Name */}
                <div className="text-white text-lg font-bold">
                    Simple Blog
                </div>

                <div className="flex space-x-4">
                    {/* Create Post Button (imported from CreatePost component) */}
                    <CreatePost />

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );

}
 
export default NavBar;