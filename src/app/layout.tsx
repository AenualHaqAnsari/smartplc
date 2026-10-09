import type { Metadata } from "next";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import FloatingSupportChat from "@/components/support/FloatingSupportChat";
import Script from "next/script";
const sans=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const mono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata:Metadata={
 verification: { google: "JXOBfqE_AHPcuOz2x785h5_r0rNUH2b8D_-l87grxKI" },
 metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||"https://smartplcsolutions.com"),
 title:{default:"Industrial Automation Products & Services | Smart PLC Solutions",template:"%s | Smart PLC Solutions"},
 description:"Industrial automation products and engineering services for PLC, HMI, SCADA, VFD, servo, sensors, industrial communication and control panels.",
 applicationName:"Smart PLC Solutions",generator:"Next.js",referrer:"origin-when-cross-origin",
 keywords:["industrial automation","PLC automation","PLC programming","PLC HMI","SCADA automation","VFD programming","servo automation","industrial control panel","machine automation","new machines"],
 openGraph:{type:"website",siteName:"Smart PLC Solutions",title:"Industrial Automation Products & Services | Smart PLC Solutions",description:"Products and engineering services for PLC, HMI, SCADA, drives, sensors and control panels.",images:[{url:"/og-smart-plc.png",width:1200,height:630,alt:"Smart PLC Solutions — industrial automation products and services"}]},
 twitter:{card:"summary_large_image",title:"Industrial Automation Products & Services | Smart PLC Solutions",description:"Industrial controls products and engineering services.",images:["/og-smart-plc.png"]},
 robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`}><body><Script src="https://www.googletagmanager.com/gtag/js?id=AW-17697827176" strategy="afterInteractive"/><Script id="google-ads-tag" strategy="afterInteractive">{'window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments)}gtag("js",new Date());gtag("config","AW-17697827176")'}</Script><SiteJsonLd siteUrl={process.env.NEXT_PUBLIC_SITE_URL}/><CartProvider><CurrencyProvider><AnalyticsTracker/>{children}<FloatingSupportChat/></CurrencyProvider></CartProvider></body></html>}

