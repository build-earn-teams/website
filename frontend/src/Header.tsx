import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-400">
          WorkFlix
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-300 hover:text-green-400">Home</a>
          <a href="#" className="text-gray-300 hover:text-green-400">Find Work</a>
          <a href="#" className="text-gray-300 hover:text-green-400">Post a Job</a>
          <a href="#" className="text-gray-300 hover:text-green-400">How it Works</a>
        </nav>
        <div className="flex space-x-4">
          <button className="text-gray-300 hover:text-green-400">Log In</button>
          <button className="bg-green-400 text-gray-900 px-4 py-2 rounded hover:bg-green-500">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
