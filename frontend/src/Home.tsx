import React from 'react';
import { useNavigate } from 'react-router-dom';

// Home Component
function HomeComponent() {
  const navigate = useNavigate();

  const navigateTo = (pageName: string) => {
    if (pageName === 'clients') {
      navigate('/clients');
    }
    else if(pageName === 'collaborators') {
      navigate('/freelancers');
    }
    else if(pageName === 'mentors') {
      navigate('/mentors');
    }
  };

  

  

  // NavigationPanel
  const NavigationPanel = () => {
    const NavButton = ({ id, children }: { id: string; children: React.ReactNode }) => (
      <button
        onClick={() => navigateTo(id)}
        className="w-full text-center py-3 px-4 font-semibold text-sm rounded-lg transition-all duration-300 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105"
      >
        {children}
      </button>
    );

    return (
      <div className="w-full md:w-2/5 h-full bg-gray-900/80 backdrop-blur-2xl border-l border-white/10 flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
        <div>
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1 mb-4 shadow-lg ">
              <img
                src="https://placehold.co/200x200/111827/FFFFFF?text=YOU"
                alt="User Logo"
                className="w-full h-full rounded-full object-cover border-4 border-gray-900"
              />
            </div>
            <h2 className="text-white text-2xl font-bold">Your Workspace</h2>
            <p className="text-gray-400 text-sm">Welcome back!</p>
          </div>
          <div className="w-full max-w-sm flex flex-col space-y-3">
            <NavButton id="mentors">Mentors</NavButton>
            <NavButton id="collaborators">Collaborators</NavButton>
            <NavButton id="clients">Clients</NavButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4 md:p-8 animated-gradient">
      <main className="w-full max-w-7xl h-full max-h-[850px] flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="w-full md:w-3/5 h-1/3 md:h-full flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tighter animate-fade-in">
              Where Ideas <br /> Find Talent.
            </h1>
            <p className="max-w-md mx-auto text-lg text-white/80 animate-fade-in-delay">
              The next generation of creative collaboration. Find mentors, build teams, and deliver for clients—all in one place.
            </p>
          </div>
        </div>
        <NavigationPanel />
      </main>
    </div>
  );
}

export default HomeComponent;
