const sizes = [
  { size: "S", chest: "36-38", length: "28", fit: "Regular" },
  { size: "M", chest: "38-40", length: "29", fit: "Regular" },
  { size: "L", chest: "40-42", length: "30", fit: "Relajado" },
  { size: "XL", chest: "42-44", length: "31", fit: "Oversize" },
  { size: "2XL", chest: "44-46", length: "32", fit: "Oversize+" },
];

export default function SizeGuide() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-smoke font-medium mb-3">Guía de Fit</p>
        <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tight">Guía de Tallas</h2>
        <p className="mt-4 text-sm text-smoke max-w-md leading-relaxed">
          Para un fit oversize, recomendamos subir una talla desde tu medida habitual.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-dark">
              <th className="py-4 pr-6 text-xs font-bold uppercase tracking-widest text-dark">Talla</th>
              <th className="py-4 pr-6 text-xs font-bold uppercase tracking-widest text-dark">Pecho (in)</th>
              <th className="py-4 pr-6 text-xs font-bold uppercase tracking-widest text-dark">Largo (in)</th>
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-dark">Fit</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.size} className="border-b border-dark/10">
                <td className="py-4 pr-6 text-sm font-semibold text-dark">{s.size}</td>
                <td className="py-4 pr-6 text-sm text-smoke">{s.chest}</td>
                <td className="py-4 pr-6 text-sm text-smoke">{s.length}</td>
                <td className="py-4 text-sm text-dark font-medium">{s.fit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 p-6 border border-dark/10 bg-dark/5">
        <p className="text-xs font-bold uppercase tracking-widest text-dark">Recomendación Oversize</p>
        <p className="mt-2 text-sm text-smoke leading-relaxed">
          Para nuestro look oversize característico, elige <strong className="text-dark">XL o 2XL</strong> si usualmente usas M o L. El fit debe sentirse relajado en hombros y cuerpo.
        </p>
      </div>
    </section>
  );
}
