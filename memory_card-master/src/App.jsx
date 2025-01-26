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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const totalPairs = gameMode / 2;

  useEffect(() => {
    const generatedCards = generateCards(gameMode);
    setCards(generatedCards);
  }, [gameMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

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
      } else {
  
        if (wrongSoundRef.current) {
          wrongSoundRef.current.play();
        }
      }
      setTimeout(() => {
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    setIsMuted(false);
  };

  return (
    <div className="bg-[url('/bg.gif')] bg-center bg-no-repeat bg-cover">
      <div className="container m-auto h-screen flex flex-col items-center relative">
        
        {/* Wrong Sound Audio */}
        <audio ref={wrongSoundRef} src="/unmatch-sound.mp3" />

        {/* Background Music */}
        <audio
          ref={audioRef}
          src="/background-music.mp3"
          autoPlay
          loop
          muted={isMuted}
        />

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

        {/* Settings Menu */}
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
                fontFamily: "'Tiny5', sans-serif",
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

        {/* Mute/Volume Controls */}
        <div className="absolute bottom-10 left-10 flex flex-col gap-2 bg-black/50 p-3 rounded-lg">
          <button
            className="bg-[#9E4B3F] text-white rounded-lg p-2"
            style={{
              fontFamily: "'Tiny5', sans-serif",
            }}
            onClick={handleMuteToggle}
          >
            {isMuted ? "🔊 Unmute" : "🔇 Mute"}
          </button>
          {!isMuted && (
            <div className="flex items-center gap-2">
              <span className="text-white">🎵</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
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
              >
                You won your freedom!
              </h1>
              <p className="text-xl mt-4" style={{ fontFamily: "'Tiny5', sans-serif" }}>Score: {matchedPairs}</p>
              <p className="text-xl mt-2" style={{ fontFamily: "'Tiny5', sans-serif" }}>Moves: {moves}</p>
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
