import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import Hero from "../components/Hero";
import AnimeRow from "../components/AnimeRow";
import SectionHeader from "../components/SectionHeader";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

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
  const [apiErrors, setApiErrors] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadHome() {
      setLoading(true);
      setApiErrors([]);

      const results = await Promise.allSettled([
        getTrendingAnime(),
        getPopularAnime(),
        getSeasonalAnime()
      ]);

      if (!mounted) return;

      const errors = [];

      if (results[0].status === "fulfilled") {
        setTrending(results[0].value?.items || []);
      } else {
        console.error(
          "Trending API error:",
          results[0].reason
        );

        errors.push("Trending");
        setTrending([]);
      }

      if (results[1].status === "fulfilled") {
        setPopular(results[1].value?.items || []);
      } else {
        console.error(
          "Popular API error:",
          results[1].reason
        );

        errors.push("Popular");
        setPopular([]);
      }

      if (results[2].status === "fulfilled") {
        setSeasonal(results[2].value?.items || []);
      } else {
        console.error(
          "Seasonal API error:",
          results[2].reason
        );

        errors.push("Seasonal");
        setSeasonal([]);
      }

      setApiErrors(errors);
      setLoading(false);
    }

    loadHome();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <Loading text="Loading AnimeVerse..." />;
  }

  const heroAnime =
    trending[0] ||
    popular[0] ||
    seasonal[0];

  return (
    <div className="app">
      <Navbar />

      <main>
        {heroAnime && (
          <Hero anime={heroAnime} />
        )}

        {apiErrors.length > 0 && (
          <div className="api-warning">
            Some anime data is temporarily unavailable.
            Please try again later.
          </div>
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

        {!heroAnime && (
          <section className="page">
            <div className="state-box">
              <h2>Anime data temporarily unavailable</h2>
              <p>
                Jikan/MyAnimeList is currently not
                responding. Please refresh the page
                after a little while.
              </p>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
