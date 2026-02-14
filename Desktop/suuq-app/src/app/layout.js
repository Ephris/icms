import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Suuq Soomaaliyeed — The Global Somali Business Hub',
  description:
    'Buy and sell products across the Somali world. List for free, call the seller, arrange pickup. No middleman, no fees.',
  keywords: 'Somali, marketplace, buy, sell, Somalia, Dubai, Mogadishu, Hargaysa, business',
};

export default function RootLayout({ children }) {
  return (
    <html lang="so">
      <body className="font-sans bg-gray-50 text-gray-800 antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
