// timformation/app/layout.tsx

import './globals.css'; // Make sure this is imported

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply full height and minimal margin/padding to body */}
      <body style={{ margin: 0, padding: 0, height: '100vh', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}