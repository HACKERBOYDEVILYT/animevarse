import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import Hero from "../components/Hero";
import AnimeRow from "../components/AnimeRow";
import SectionHeader from "../components/SectionHeader";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

import {
  getTrendingAnime,
  getPopularAnime,
  getSeasonalAnime
} from "../services/api";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [seasonal, setSeasonal] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadHome() {
      try {
        setLoading(true);
        setError("");

        const [trendingData, popularData, seasonalData] =
          await Promise.all([
            getTrendingAnime(),
            getPopularAnime(),
            getSeasonalAnime()
          ]);

        if (!mounted) return;

        setTrending(trendingData.items || []);
        setPopular(popularData.items || []);
        setSeasonal(seasonalData.items || []);
      } catch (err) {
        console.error("Home loading error:", err);

        if (mounted) {
          setError(
            err?.message ||
              "Failed to load anime. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHome();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <Loading text="Loading AnimeVerse..." />;
  }

  return (
    <div className="app">
      <Navbar />

      {error ? (
        <main className="page">
          <ErrorState message={error} />
        </main>
      ) : (
        <main>
          {trending.length > 0 && (
            <Hero anime={trending[0]} />
          )}

          {trending.length > 0 && (
            <section className="content-section">
              <SectionHeader
                title="Trending Now"
                subtitle="What everyone is watching"
                link="/trending"
              />

              <AnimeRow anime={trending} />
            </section>
          )}

          {popular.length > 0 && (
            <section className="content-section">
              <SectionHeader
                title="Popular Anime"
                subtitle="Fan favorites"
                link="/popular"
              />

              <AnimeRow anime={popular} />
            </section>
          )}

          {seasonal.length > 0 && (
            <section className="content-section">
              <SectionHeader
                title="This Season"
                subtitle="Latest releases"
                link="/seasonal"
              />

              <AnimeRow anime={seasonal} />
            </section>
          )}
        </main>
      )}

      <Footer />
      <MobileNav />
    </div>
  );
}
