import { useEffect, useState, useRef } from "react";
import "./App.css";
import Card from "./components/Card";

const images = [
  "/img1.svg",
  "/img2.svg",
  "/img3.svg",
  "/img4.svg",
  "/img5.svg",
  "/img6.svg",
  "/img7.svg",
  "/img8.svg",
];

const generateCards = (mode) => {
  const totalImages = mode / 2; 
  const selectedImages = images.slice(0, totalImages);
  const doubleImages = selectedImages.concat(selectedImages); 
  const shuffledImages = doubleImages.sort(() => Math.random() - 0.5); 
  return shuffledImages.map((image, index) => ({
    id: index,
    image,
    matched: false,
  }));
};

function App() {
  const [cards, setCards] = useState([]);
  const [filppedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameMode, setGameMode] = useState(16);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);
  const totalPairs = gameMode / 2;

  useEffect(() => {
    const generatedCards = generateCards(gameMode);
    setCards(generatedCards);
  }, [gameMode]);

  const handleClick = (clickedCard) => {
    if (
      isChecking ||
      filppedCards.some((card) => card.id === clickedCard.id) ||
      clickedCard.matched
    ) {
      return;
    }

    setMoves((prevMoves) => prevMoves + 1);

    const newFillpedCards = [...filppedCards, clickedCard];
    setFlippedCards(newFillpedCards);

    if (newFillpedCards.length === 2) {
      setIsChecking(true);
      if (newFillpedCards[0].image === newFillpedCards[1].image) {
        setMatchedPairs((prevMatchedPairs) => prevMatchedPairs + 1);
        setCards((prevCards) =>
          prevCards.map((card) =>
            newFillpedCards.some((flippedCard) => flippedCard.id === card.id)
              ? { ...card, matched: true }
              : card
          )
        );
      }
      setTimeout(() => {
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  return (
    <div className="bg-[url('/bg.gif')] bg-center bg-no-repeat bg-cover">
      <div className="container m-auto h-screen flex flex-col items-center relative">
        
        {/* Audio Element */}
        <audio 
          ref={audioRef} 
          loop 
          src="/background-music.mp3"
        />

        {/* Music Toggle Button */}
        <button 
          onClick={toggleMusic}
          className="absolute top-4 right-4 px-4 py-2 bg-[#9E4B3F] text-white rounded-lg shadow hover:bg-[#F77662]"
          style={{
            fontFamily: "'Tiny5', sans-serif"
          }}
        >
          {isMusicPlaying ? 'Pause Music' : 'Play Music'}
        </button>
        
        {/* Title */}
        <div className="absolute top-4 w-full text-center">
          <h1
            style={{
              fontFamily: "'Tiny5', sans-serif",
              fontSize: "2rem",
              color: "yellow",
              textShadow: "4px 4px 8px rgba(0, 0, 0, 0.7)",
            }}
          >
            Dungeon Memory Quest
          </h1>
        </div>
        
        {/* Rest of the existing code remains the same */}
        <div className="menu-container">
          <h2 className="menu-title">Settings</h2>
          <div className="mt-4 flex flex-col gap-2">
            <button
              className="menu-button"
              onClick={() => setGameMode(4)}
            >
              4 Cards
            </button>
            <button
              className="menu-button"
              onClick={() => setGameMode(8)}
            >
              8 Cards
            </button>
            <button
              className="menu-button"
              onClick={() => setGameMode(12)}
            >
              12 Cards
            </button>
            <button
              className="menu-button"
              onClick={() => setGameMode(16)}
            >
              16 Cards
            </button>
            <button
              className="mt-6 px-4 py-2 bg-[#9E4B3F] text-white rounded-lg shadow hover:bg-[#F77662]"
              style={{
                fontFamily: "'Tiny5', sans-serif"
              }}
              onClick={() => {
                setMatchedPairs(0);
                setMoves(0);
                setCards(generateCards(gameMode));
              }}
            >
              Restart
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div className="game-bord grid grid-cols-3 md:grid-cols-4 gap-4 p-4 mt-12">
          {cards.map((card) => (
            <Card
              key={card.id}
              onClick={handleClick}
              card={card}
              isFillped={
                filppedCards.some(
                  (flippedCard) => flippedCard.id === card.id
                ) || card.matched
              }
            />
          ))}

          {matchedPairs === totalPairs && (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white bg-opacity-75">
              <h1 className="text-4xl font-bold text-[#9E4B3F]"
              style={{
                fontFamily: "'Tiny5', sans-serif"
              }}
                >You won your freedom!</h1>
              <p className="text-xl mt-4" style={{fontFamily: "'Tiny5', sans-serif"}}>Score: {matchedPairs}</p>
              <p className="text-xl mt-2" style={{fontFamily: "'Tiny5', sans-serif"}}>Moves: {moves}</p>
              <button
                className="mt-6 px-4 py-2 bg-[#9E4B3F] text-white rounded-lg shadow hover:bg-[#F77662]"
                style={{
                  fontFamily: "'Tiny5', sans-serif"
                }}
                onClick={() => {
                  setMatchedPairs(0);
                  setMoves(0);
                  setCards(generateCards(gameMode));
                }}
              >
                Play Again ?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;