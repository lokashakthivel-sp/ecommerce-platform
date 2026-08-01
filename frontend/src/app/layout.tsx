import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import AOSProvider from '@/components/AOSProvider';

export const metadata: Metadata = {
  title: 'Shopifi — Commerce Platform',
  description: 'A next-generation microservices e-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AOSProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </AOSProvider>
      </body>
    </html>
  );
}