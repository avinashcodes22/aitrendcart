import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/">
          <span className="text-xl font-semibold text-white">
            AItrendcart
          </span>
        </Link>

        <div className="flex gap-8 text-white/80 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/trending">Trending</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/visual-search">Visual Search</Link>
        </div>

      </div>

    </nav>
  );
}