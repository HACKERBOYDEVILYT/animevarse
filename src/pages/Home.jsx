import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import Hero from "../components/Hero";
import AnimeGrid from "../components/AnimeGrid";
import SectionHeader from "../components/SectionHeader";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

import {
  getTrendingAnime,
  getPopularAnime,
  getSeasonalAnime,
} from "../services/api";

function Home() {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [seasonal, setSeasonal] = useState([]);

  useEffect(() => {
    async function loadHome() {
      try {
        const [trendingData, popularData, seasonalData] =
          await Promise.all([
            getTrendingAnime(),
            getPopularAnime(),
            getSeasonalAnime(),
          ]);

        setTrending(trendingData);
        setPopular(popularData);
        setSeasonal(seasonalData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const heroAnime = trending[0];

  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero anime={heroAnime} />

        <section className="content-section">
          <SectionHeader
            title="Trending Now"
            subtitle="What everyone is watching"
            link="/trending"
          />
          <AnimeGrid anime={trending} />
        </section>

        <section className="content-section">
          <SectionHeader
            title="Popular Anime"
            subtitle="Fan favorites"
            link="/popular"
          />
          <AnimeGrid anime={popular} />
        </section>

        <section className="content-section">
          <SectionHeader
            title="This Season"
            subtitle="Latest releases"
            link="/seasonal"
          />
          <AnimeGrid anime={seasonal} />
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default Home;
