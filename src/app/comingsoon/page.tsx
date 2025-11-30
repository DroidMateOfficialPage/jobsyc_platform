"use client";

export default function ComingSoonPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#B3D9FF] text-blue-900 px-6 text-center">
      <img
        src="/images/logojobsyc2png.png"
        alt="JobSyc Logo"
        className="h-28 w-auto mb-6"
      />
      <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
        🚀 Uskoro lansiramo nešto posebno
      </h1>

      <p className="text-lg md:text-xl text-blue-800 max-w-2xl leading-relaxed mb-8">
        Naša nova stranica je trenutno u izradi. Vraćamo se uskoro sa potpuno novim iskustvom,
        bržim performansama i funkcijama koje će te oduševiti.
      </p>

      <div className="animate-pulse bg-white/20 rounded-xl px-6 py-3 text-lg font-medium text-blue-900">
        Coming Soon • Stay Tuned
      </div>

        <a
          href="/home"
          className="mt-8 inline-block bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg shadow hover:bg-blue-50 transition"
        >
          ← Nazad na početnu
        </a>
      <footer className="absolute bottom-6 text-blue-900 text-sm">
        © {new Date().getFullYear()} JobSyc — All rights reserved.
      </footer>
    </div>
  );
}