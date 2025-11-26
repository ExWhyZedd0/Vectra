import React, { useState, useEffect } from "react";

// helper  angka jadi mata uang (USD)
const formatCurrency = (number) => {
  if (!number) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0, // ngilangin sen
  }).format(number);
};

const BentoBox = ({ children }) => {
  // state buat nyimpen data API
  const [globalData, setGlobalData] = useState(null);
  const [trendingData, setTrendingData] = useState([]);
  // const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect buat ngambil data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // const newsApiUrl =
        //   "https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss";

        const [globalRes, trendingRes] = await Promise.all([
          fetch("https://api.coingecko.com/api/v3/global"),
          fetch("https://api.coingecko.com/api/v3/search/trending"),
          // https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false
          // fetch(newsApiUrl),
        ]);

        if (!globalRes.ok || !trendingRes.ok) {
          throw new Error("Gagal mengambil data dari API CoinGecko");
        }

        const globalJson = await globalRes.json();
        const trendingJson = await trendingRes.json();

        setGlobalData(globalJson.data);
        setTrendingData(trendingJson.coins);

        // if (newsRes.ok) {
        //   const newsJson = await newsRes.json();
        //   // rss2json menyimpan artikel di dalam 'items'
        //   setNewsData(newsJson.items);
        // } else {
        //   console.error("Gagal mengambil data dari rss2json");
        // }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return children({
    loading,
    error,
    globalData,
    // newsData,
    trendingData,
    formatCurrency,
  });
};

export default BentoBox;
//   return (
//     <div
//       className={`w-full h-screen flex flex-col items-center justify-between relative z-20 px-32 py-8 transition-all duration-1000 ease-out ${
//         isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//       }`}
//     >
//       {/* Judul Section */}
//       <p
//         className={`w-fit font-['Audiowide'] text-5xl mb-8 font-medium transition-all duration-1000 ${
//           isVisible
//             ? "opacity-100 animate-[slide-in-down_1.5s_ease-in-out_forwards]"
//             : "opacity-0"
//         }`}
//       >
//         <span className="font-['Fredoka']">
//           Trade with 390 million users on{" "}
//         </span>{" "}
//         Vectra
//       </p>

//       {/* Kontainer untuk semua kartu bento */}
//       <div className="flex flex-row justify-center items-center">
//         <div className="flex flex-col">
//           <div className="flex flex-col">
//             <div
//               className={`${cardBaseClass} w-[280px] h-[180px] ${
//                 isVisible
//                   ? "animate-[slide-in-left_1.5s_ease-in-out_forwards]"
//                   : "opacity-0"
//               }`}
//             >
//               <p className="bento-box-title">24h trading volume</p>
//               <p className="bento-box-description"></p>
//             </div>
//             <div
//               className={`${cardBaseClass} w-[280px] h-[180px] ${
//                 isVisible
//                   ? "animate-[slide-in-left_1.5s_ease-in-out_0.2s_forwards]"
//                   : "opacity-0"
//               }`}
//               style={{ animationDelay: "0.2s" }} // Delay untuk animasi stagger
//             >
//               <p className="bento-box-title">Market Cap</p>
//               <p className="bento-box-description"></p>
//             </div>
//           </div>
//           <div
//             className={`${cardBaseClass} w-[584px] h-[180px] ${
//               isVisible
//                 ? "animate-[slide-in-up_1.5s_ease-in-out_0.4s_forwards]"
//                 : "opacity-0"
//             }`}
//             style={{ animationDelay: "0.4s" }}
//           >
//             <p className="bento-box-title">News</p>
//             <p className="bento-box-description"></p>
//           </div>
//         </div>
//         <div
//           className={`${cardBaseClass} w-[280px] h-[584px] ${
//             // Perhatikan tinggi disesuaikan
//             isVisible
//               ? "animate-[slide-in-right_1.5s_ease-in-out_0.2s_forwards]"
//               : "opacity-0"
//           }`}
//           style={{ animationDelay: "0.2s" }}
//         >
//           <p className="bento-box-title">Most Popular</p>
//           <p className="bento-box-description"></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BentoBox;
