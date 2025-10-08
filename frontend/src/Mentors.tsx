import React from 'react';

interface Mentor {
  id: number;
  name: string;
  domain: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  image: string;
}

const mentors: Mentor[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    domain: 'Web Development',
    rating: 4.9,
    reviews: 127,
    hourlyRate: 50,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Bob Smith',
    domain: 'Graphic Design',
    rating: 4.8,
    reviews: 89,
    hourlyRate: 40,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Carol Davis',
    domain: 'Content Writing',
    rating: 4.7,
    reviews: 156,
    hourlyRate: 30,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: 'David Wilson',
    domain: 'Digital Marketing',
    rating: 4.9,
    reviews: 203,
    hourlyRate: 45,
    image: 'https://via.placeholder.com/150',
  },
];

const Mentors: React.FC = () => {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src={mentor.image} alt={mentor.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{mentor.name}</h3>
                <p className="text-gray-300 mb-2">{mentor.domain}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-semibold text-white">{mentor.rating}</span>
                  <span className="text-gray-400 ml-1">({mentor.reviews} reviews)</span>
                </div>
                <p className="text-green-400 font-semibold">${mentor.hourlyRate}/hr</p>
                <button className="mt-4 w-full bg-green-400 text-gray-900 py-2 rounded hover:bg-green-500">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mentors;
