import React, { useState, useEffect } from "react";
// const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

// Fungsi helper untuk memformat angka menjadi mata uang (USD)
const formatCurrency = (number) => {
  if (!number) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // Menghilangkan sen
    maximumFractionDigits: 0, // Menghilangkan sen
  }).format(number);
};

// Ubah { isVisible } menjadi { children }
const BentoBox = ({ children }) => {
  // 1. Siapkan state untuk menyimpan data API (INI TIDAK BERUBAH)
  const [globalData, setGlobalData] = useState(null);
  const [trendingData, setTrendingData] = useState([]);
  // const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Gunakan useEffect untuk mengambil data (INI TIDAK BERUBAH)
  useEffect(() => {
    const fetchData = async () => {
      // if (!NEWS_API_KEY) {
      //   console.error("NEWS_API_KEY tidak ditemukan tes restart server coba");
      //   setError("API Key Berita tidak ter konfugurasi.");
      // }
      try {
        setLoading(true);

        // const newsApiUrl = NEWS_API_KEY
        //   ? fetch(
        //       `https://newsapi.org/v2/everything?q=crypto&pageSize=5&sortBy=publishedAt&apiKey=15c8aa5b805448c2b07622de984c9d4f`
        //     )
        //   : Promise.resolve(null);

        const [globalRes, trendingRes] = await Promise.all([
          fetch("https://api.coingecko.com/api/v3/global"),
          fetch("https://api.coingecko.com/api/v3/search/trending"),
        ]);

        if (!globalRes.ok || !trendingRes.ok) {
          throw new Error("Gagal mengambil data dari API CoinGecko");
        }

        const globalJson = await globalRes.json();
        const trendingJson = await trendingRes.json();

        setGlobalData(globalJson.data);
        setTrendingData(trendingJson.coins);

        // if (newsRes && newsRes.ok) {
        //   const newsJson = await newsRes.json();
        //   setNewsData(newsJson.articles);
        // } else if (newsRes) {
        //   console.error("Gagal mengambil data dari NewsAPI");
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
