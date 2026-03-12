import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center">

      <Link href="/">
        <span className="text-xl font-bold tracking-wide">
          AItrendcart
        </span>
      </Link>

      <div className="flex gap-6 text-sm">
        <Link href="/products">Products</Link>
        <Link href="/trending">Trending</Link>
        <Link href="/cart">Cart</Link>
      </div>

    </nav>
  );
}