const posts = [
  { image: "https://images.unsplash.com/photo-1608236415054-3d73e200bce4?w=400&q=80" },
  { image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
  { image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80" },
  { image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80" },
  { image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80" },
  { image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80" },
];

export default function InstagramGallery() {
  return (
    <section className="py-24">
      <div className="px-6 max-w-7xl mx-auto mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-smoke font-medium mb-3">Síguenos</p>
        <h2 className="text-3xl md:text-5xl font-black text-dark tracking-tight">@BRAVOSTYLE</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {posts.map((post, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <img
              src={post.image}
              alt={`BRAVOSTYLE look ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
