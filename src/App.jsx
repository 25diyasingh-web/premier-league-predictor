import { useState, useEffect } from "react";
import "./App.css";

// IMPORT FOOTBALL ONLY
import football from "./assets/football.png";

const TEAMS = [
  "Arsenal",
  "Aston Villa",
  "Bournemouth",
  "Brentford",
  "Brighton",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Ipswich",
  "Leicester",
  "Liverpool",
  "Man City",
  "Man United",
  "Newcastle",
  "Nottingham Forest",
  "Southampton",
  "Spurs",
  "West Ham",
  "Wolves",
];

const TEAM_LOGOS = {
  Arsenal: "https://resources.premierleague.com/premierleague/badges/t3.svg",
  "Aston Villa": "https://resources.premierleague.com/premierleague/badges/t7.svg",
  Bournemouth: "https://resources.premierleague.com/premierleague/badges/t91.svg",
  Brentford: "https://resources.premierleague.com/premierleague/badges/t94.svg",
  Brighton: "https://resources.premierleague.com/premierleague/badges/t36.svg",
  Chelsea: "https://resources.premierleague.com/premierleague/badges/t8.svg",
  "Crystal Palace": "https://resources.premierleague.com/premierleague/badges/t31.svg",
  Everton: "https://resources.premierleague.com/premierleague/badges/t11.svg",
  Fulham: "https://resources.premierleague.com/premierleague/badges/t54.svg",
  Ipswich: "https://resources.premierleague.com/premierleague/badges/t40.svg",
  Leicester: "https://resources.premierleague.com/premierleague/badges/t13.svg",
  Liverpool: "https://resources.premierleague.com/premierleague/badges/t14.svg",
  "Man City": "https://resources.premierleague.com/premierleague/badges/t43.svg",
  "Man United": "https://resources.premierleague.com/premierleague/badges/t1.svg",
  Newcastle: "https://resources.premierleague.com/premierleague/badges/t4.svg",
  "Nottingham Forest": "https://resources.premierleague.com/premierleague/badges/t17.svg",
  Southampton: "https://resources.premierleague.com/premierleague/badges/t20.svg",
  Spurs: "https://resources.premierleague.com/premierleague/badges/t6.svg",
  "West Ham": "https://resources.premierleague.com/premierleague/badges/t21.svg",
  Wolves: "https://resources.premierleague.com/premierleague/badges/t38.svg",
};

function App() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ball = document.getElementById("football");
    if (!ball) return;
    ball.classList.add("football", "ball-animation");
  }, []);

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) {
      alert("Please select both teams");
      return;
    }

    if (homeTeam === awayTeam) {
      alert("Home and Away teams cannot be the same");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_team: homeTeam,
          away_team: awayTeam,
        }),
      });

      const data = await response.json();
      setResult(data.prediction || "No prediction returned");
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Could not connect to backend. Is FastAPI running?");
    }

    setLoading(false);
  };

  return (
    <div id="app-container">
      <h1 className="text-3xl font-bold text-center mb-6 text-black underline">
        Premier League Predictor
      </h1>

      <div className="flex items-center justify-center gap-8 mb-6 relative">
        <div className="ball-wrap">
          <img src={football} id="football" alt="ball" />
        </div>


        <div className="w-28 h-28 flex items-center justify-center">
          {homeTeam && (
            <img src={TEAM_LOGOS[homeTeam]} className="w-full h-full object-contain" />
          )}
        </div>

        {/* ⚡ NEW LIGHTNING ICON */}
        <div className="lightning-glow">⚡</div>

        <div className="w-28 h-28 flex items-center justify-center">
          {awayTeam && (
            <img src={TEAM_LOGOS[awayTeam]} className="w-full h-full object-contain" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <select
          className="w-full p-3 bg-white text-black rounded"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
        >
          <option value="">Home Team</option>
          {TEAMS.map((team) => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>

        <select
          className="w-full p-3 bg-white text-black rounded"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
        >
          <option value="">Away Team</option>
          {TEAMS.map((team) => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg mt-6 font-semibold text-white"
        onClick={handlePredict}
      >
        {loading ? "Predicting..." : "Predict Result"}
      </button>

      {result && (
        <div className="mt-6 text-center text-xl text-green-700 font-bold">
          Prediction: {result}
        </div>
      )}
    </div>
  );
}

export default App;
