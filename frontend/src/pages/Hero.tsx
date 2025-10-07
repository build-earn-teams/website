import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Find the Perfect Freelancer for Your Project
        </h1>
        <p className="text-xl mb-8">
          Connect with skilled professionals and get your work done efficiently.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-gray-900 text-green-400 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
            Post a Job
          </button>
          <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600">
            Find Work
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
