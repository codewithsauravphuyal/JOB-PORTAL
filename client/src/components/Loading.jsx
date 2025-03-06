import React from 'react';

const Loading = () => {
  return (
    <div className="relative flex justify-center items-center min-h-screen"> 
      <div className="absolute animate-spin rounded-full h-30 w-30 border-t-4 border-b-4 border-red-300"></div>
      <img
        src="https://cdn.dribbble.com/users/2395865/screenshots/6289270/man_3.gif"
        className="rounded-full h-26 w-26"
        alt="Thinking Avatar" 
      />
    </div>
  );
};

export default Loading;