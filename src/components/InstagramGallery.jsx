const posts = [
  { image: "/PRODUCTOS/_MS19093.jpg" },
  { image: "/PRODUCTOS/LOS ANGELES.jpeg" },
  { image: "/PRODUCTOS/OVERSI ROJO.jpeg" },
  { image: "/PRODUCTOS/WhatsApp Image 2026-06-18 at 2.19.08 PM.jpeg" },
  { image: "/PRODUCTOS/WhatsApp Image 2026-06-18 at 2.18.57 PM.jpeg" },
  { image: "/PRODUCTOS/WhatsApp Image 2026-06-18 at 2.18.53 PM.jpeg" },
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
