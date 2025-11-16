

import './globals.css'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ margin: 0, padding: 0, height: '100vh', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}