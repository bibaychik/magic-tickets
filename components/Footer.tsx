export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto max-w-7xl text-center text-sm text-white/40">
        © {year} MagicConcerts. Все права защищены.
      </div>
    </footer>
  );
}
