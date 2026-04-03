import "./globals.css";
import React from 'react';

export const metadata = {
  title: "Mendeleev AI - Умная таблица Менделеева",
  description: "Интерактивная таблица Менделеева и ИИ-репетитор по химии",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
