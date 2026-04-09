import "./globals.css";
import React from 'react';

export const metadata = {
  title: "Mendeleev AI — Умная таблица Менделеева",
  description: "Интерактивная таблица Менделеева с ИИ-репетитором по химии. Адаптивное обучение, квизы, достижения и персональные подсказки.",
  keywords: "таблица Менделеева, химия, ИИ, образование, периодическая система, элементы",
  authors: [{ name: "Mendeleev AI" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0984e3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#0984e3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script src="https://js.puter.com/v2/"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
