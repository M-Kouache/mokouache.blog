import Link from "next/link";
import Navigationbar from "./Navbar";

const _Header = () => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
      <Link href="/" className="hover:underline">
        Blog
      </Link>
      .
    </h2>
  );
};

const Header = () => {
  return <Navigationbar />;
};

export default Header;
