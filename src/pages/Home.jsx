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
  getSeasonalAnime,
} from "../services/api";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [seasonal, setSeasonal] = useState([]);

  useEffect(() => {
    Promise.all([
      getTrendingAnime(),
      getPopularAnime(),
      getSeasonalAnime(),
    ])
      .then(([t, p, s]) => {
        setTrending(t);
        setPopular(p);
        setSeasonal(s);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero anime={trending[0]} />

        <section className="content-section">
          <SectionHeader
            title="Trending Now"
            subtitle="What everyone is watching"
            link="/trending"
          />
          <AnimeRow anime={trending} />
        </section>

        <section className="content-section">
          <SectionHeader
            title="Popular Anime"
            subtitle="Fan favorites"
            link="/popular"
          />
          <AnimeRow anime={popular} />
        </section>

        <section className="content-section">
          <SectionHeader
            title="This Season"
            subtitle="Latest releases"
            link="/seasonal"
          />
          <AnimeRow anime={seasonal} />
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
