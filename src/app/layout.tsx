import './globals.css';

export const metadata = {
  title: 'ระบบ E-Commerce',
  description: 'ระบบจัดการร้านค้าออนไลน์',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
