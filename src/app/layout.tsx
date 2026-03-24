import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import { PrismaClient } from '@prisma/client';

const outfit = Outfit({ subsets: ['latin'] });
const prisma = new PrismaClient();

export async function generateMetadata(): Promise<Metadata> {
  const siteNameSetting = await prisma.setting.findUnique({ where: { key: 'siteName' } });
  const siteName = siteNameSetting?.value || 'Benim Köşem';
  return {
    title: siteName,
    description: 'Kişisel blog ve fikir platformum',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteNameSetting = await prisma.setting.findUnique({ where: { key: 'siteName' } });
  const siteName = siteNameSetting?.value || 'Benim Köşem';

  let navLinks = await prisma.navLink.findMany({ orderBy: { order: 'asc' } });
  if (navLinks.length === 0) {
    await prisma.navLink.createMany({
      data: [
        { title: 'Ana Sayfa', url: '/', order: 1 },
        { title: 'Fikirler (Twitter)', url: '/fikirler', order: 2 },
        { title: 'Listeler', url: '/listelerim', order: 3 },
        { title: 'Yönetim Paneli', url: '/admin', order: 4 },
      ]
    });
    navLinks = await prisma.navLink.findMany({ orderBy: { order: 'asc' } });
  }

  return (
    <html lang="tr" data-theme="dark">
      <body className={outfit.className}>
        <ThemeProvider>
          <Navbar siteName={siteName} links={navLinks} />
          <main className="container main-content">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
