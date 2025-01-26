import { useRef } from "react";

const Card = ({ card, onClick, isFillped }) => {
  const audioRef = useRef(null); 

  const handleCardClick = () => {
    if (audioRef.current) {
      audioRef.current.play(); 
    }
    onClick(card);
  };

  return (
    <div
      className={`card ${isFillped ? "flipped" : ""} w-24 h-32 lg:w-36 lg:h-44 m-2`}
      onClick={handleCardClick}
    >
      <div
        className={`w-full h-full flex items-center justify-center border-gray-300 rounded-xl ${
          card.matched ? "matched" : ""
        }`}
      >
        {isFillped || card.matched ? (
          <img
            src={card.image}
            alt="card"
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <div
            className="rounded-xl w-full h-full flex items-center justify-center text-2xl text-white bg-cover bg-center transition-transform duration-300 ease-in-out"
            style={{
              backgroundImage: "url('/public/TreasureChest.svg')",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        )}
      </div>
      {/* Audio */}
      <audio ref={audioRef} src="/button-202966.mp3" />
    </div>
  );
};

export default Card;
