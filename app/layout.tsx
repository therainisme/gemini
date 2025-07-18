import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gemini API Proxy",
  description: "https://github.com/therainisme/gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
