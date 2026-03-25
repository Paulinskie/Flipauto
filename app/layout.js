import "./globals.css";

export const metadata = {
  title: "Flipauto - AI Car Flipping SaaS",
  description: "Analyze car deals with AI and maximize your profits",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
