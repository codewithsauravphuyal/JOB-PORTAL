import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ResumeAI() {
  return (
    <>
    <Navbar />
      <style>
        {`
          .box {
            --border-angle: 0turn;
            --main-bg: conic-gradient(
              from var(--border-angle),
              #213,
              #112 5%,
              #112 60%,
              #213 95%
            );

            --gradient-border: conic-gradient(from var(--border-angle), transparent 25%, #08f, #f03 99%, transparent);

            background: 
              var(--main-bg) padding-box,
              var(--gradient-border) border-box,
              var(--main-bg) border-box;

            background-position: center center;

            animation: bg-spin 3s linear infinite;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3); /* Increased shadow for depth */
            transition: transform 0.3s ease-in-out; /* Smooth hover effect */
          }

          @keyframes bg-spin {
            to {
              --border-angle: 1turn;
            }
          }

          .box:hover {
            animation-play-state: paused;
            transform: scale(1.05); /* Slight zoom on hover */
          }

          @property --border-angle {
            syntax: "<angle>";
            inherits: true;
            initial-value: 0turn;
          }

          /* Add responsiveness for smaller screens */
          @media (max-width: 768px) {
            .box {
              max-width: 80vmin;
              max-height: 60vmin;
              padding: 3rem;
            }

            .content h2 {
              font-size: 2.5rem;
            }

            .content p {
              font-size: 1rem;
            }

            /* Ensure text is vertically aligned */
            .content {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
            }
          }

          @media (max-width: 480px) {
            .box {
              max-width: 90vmin;
              max-height: 70vmin;
              padding: 2rem;
            }

            .content h2 {
              font-size: 2rem;
            }

            .content p {
              font-size: 0.9rem;
            }
          }
        `}
      </style>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-800 to-purple-950 p-4">
        <div className="box w-[90%] max-w-[60vmin] h-[auto] max-h-[50vmin] aspect-square grid place-content-center text-white text-shadow-[0_1px_0_#000] p-6 border-[5px] border-solid border-transparent rounded-[2em]">
          <div className="content text-center">
            <h2 className="text-4xl mb-2">🚀 Resume AI</h2>
            <p className="text-lg mb-4">
              An intelligent way to build your perfect resume.
            </p>
            <p className="text-base text-[#bbb] font-medium">
              Coming Soon... Stay Tuned! 🔥
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResumeAI;
