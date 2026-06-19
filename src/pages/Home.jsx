import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import BrandStory from "../components/BrandStory";
import Categories from "../components/Categories";
import SizeGuide from "../components/SizeGuide";
import Contact from "../components/Contact";
import InstagramGallery from "../components/InstagramGallery";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <BrandStory />
      <Categories />
      <SizeGuide />
      <Contact />
      <InstagramGallery />
    </main>
  );
}
