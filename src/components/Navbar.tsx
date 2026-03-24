'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ 
    siteName = 'Benim Köşem', 
    links = [] 
}: { 
    siteName?: string, 
    links?: { id: number, title: string, url: string }[] 
}) {
  const pathname = usePathname();

  return (
    <header className="header">
        <div className="container header-inner">
            <Link href="/" className="logo">{siteName}</Link>
            <nav className="nav">
                <ul className="nav-links">
                    {links.map((link) => (
                        <li key={link.id}>
                            <Link href={link.url} className={pathname === link.url ? 'active' : ''}>
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ThemeToggle />
            </nav>
        </div>
    </header>
  );
}
