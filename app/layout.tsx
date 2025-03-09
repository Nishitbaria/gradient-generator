import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter, Montserrat } from "next/font/google"
import { ThemeProvider } from "next-themes"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat',
})

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    template: "%s | Tailwind Gradient Generator",
    default: "Tailwind Gradient Generator | Create Beautiful CSS Gradients",
  },
  description: "Create, customize and export beautiful Tailwind CSS gradients with our interactive tool. Perfect for web designers and developers.",
  manifest: "/manifest.json",
  generator: 'v0.dev',
  keywords: ["tailwind", "css", "gradient", "generator", "design", "web development", "color", "tool"],
  authors: [{ name: "Nishit Baria", url: "https://gradient.nishitbaria.tech/" }],
  creator: "Nishit Baria",
  publisher: "GradientLab",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://gradient.nishitbaria.tech"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tailwind Gradient Generator | Create Beautiful CSS Gradients",
    description: "Create, customize and export beautiful Tailwind CSS gradients with our interactive tool. Perfect for web designers and developers.",
    url: "https://gradient.nishitbaria.tech",
    siteName: "GradientLab",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tailwind Gradient Generator Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tailwind Gradient Generator | Create Beautiful CSS Gradients",
    description: "Create, customize and export beautiful Tailwind CSS gradients with our interactive tool.",
    creator: "@nishitbaria",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          {children}
        </ThemeProvider>
        {/* Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}