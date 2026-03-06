import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({
subsets: ["latin"],
display: "swap",
})

const geistMono = Geist_Mono({
subsets: ["latin"],
display: "swap",
})

export const metadata: Metadata = {
title: "Happy Birthday Dear Tuaheed",
description: "A special birthday celebration for Tuaheed with memories and wishes",
generator: "Muhammad",
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return ( <html lang="en">
<body className={`${geist.className} ${geistMono.variable} antialiased`}>
{children} <Analytics /> </body> </html>
)
}
