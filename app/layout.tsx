import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartDU - Questões ENEM 2024 Gratuitas | Simulados Online, Gabarito e Preparação Completa",
  description: "🎓 Resolva +5000 questões do ENEM GRÁTIS! Simulados online, gabarito comentado, cronômetro e ranking. Matemática, Português, História, Geografia, Física, Química, Biologia. Sem cadastro! Acesse agora e garante sua aprovação! 📚✨",
  keywords: "ENEM 2024, questões ENEM gratis, simulado ENEM online, gabarito ENEM, preparação ENEM, vestibular, concurso público, ensino médio, exercícios ENEM, prova ENEM, matemática ENEM, português ENEM, redação ENEM, ciências natureza ENEM, ciências humanas ENEM, linguagens ENEM, fisica ENEM, quimica ENEM, biologia ENEM, historia ENEM, geografia ENEM, filosofia ENEM, sociologia ENEM, literatura ENEM, ingles ENEM, espanhol ENEM, cronometro simulado, ranking estudantes, sem cadastro, gratuito, estudar online, preparação vestibular, ProUni, SISU, FIES, universidade publica, faculdade",
  authors: [{ name: "SmartDU" }],
  creator: "SmartDU",
  publisher: "SmartDU",
  robots: "index, follow",
  openGraph: {
    title: "🎓 SmartDU - +5000 Questões ENEM 2024 GRÁTIS | Simulados Online",
    description: "Resolva questões do ENEM gratuitamente! Simulados com cronômetro, gabarito comentado e ranking. Matemática, Português, Ciências. Sem cadastro! 📚✨",
    type: "website",
    locale: "pt_BR",
    siteName: "SmartDU - Preparação ENEM Gratuita",
    images: [
      {
        url: "/image.png",
        width: 1200,
        height: 630,
        alt: "SmartDU - Questões ENEM 2024 Gratuitas - Simulados Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🎓 SmartDU - +5000 Questões ENEM 2024 GRÁTIS",
    description: "Simulados online com cronômetro e gabarito comentado! Matemática, Português, Ciências. Sem cadastro! 📚✨",
    images: ["/image.png"],
  },
  icons: {
    icon: [
      {
        url: "/image.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/image.png",
    apple: [
      {
        url: "/image.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "google-site-verification": "your-google-verification-code-here",
    "theme-color": "#0066cc",
    "msapplication-TileColor": "#0066cc",
    "msapplication-config": "/browserconfig.xml",
  },
  category: "education",
  classification: "Educational",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9307683513545162"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["WebApplication", "EducationalOrganization"],
              "name": "SmartDU - Questões ENEM Gratuitas",
              "alternateName": ["SmartDU", "Smart DU", "Questões ENEM", "Simulado ENEM"],
              "description": "Plataforma educacional gratuita com mais de 5000 questões do ENEM, simulados online com cronômetro, gabarito comentado e ranking de estudantes. Preparação completa para vestibular sem necessidade de cadastro.",
              "url": "https://smartdu.com.br",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "Mais de 5000 questões ENEM gratuitas",
                "Simulados online com cronômetro",
                "Gabarito comentado e explicado",
                "Ranking de estudantes",
                "Preparação para vestibular",
                "Todas as matérias do ENEM",
                "Sem necessidade de cadastro",
                "Acesso móvel e desktop",
                "Matemática e suas tecnologias",
                "Linguagens, códigos e suas tecnologias",
                "Ciências da natureza e suas tecnologias",
                "Ciências humanas e suas tecnologias",
                "Redação ENEM"
              ],
              "audience": {
                "@type": "EducationalAudience",
                "educationalRole": "student",
                "audienceType": "Estudantes do ensino médio e vestibulandos"
              },
              "provider": {
                "@type": "Organization",
                "name": "SmartDU",
                "url": "https://smartdu.com.br"
              },
              "educationalLevel": "Ensino Médio",
              "teaches": [
                "ENEM", "Vestibular", "Matemática", "Português", "Física", "Química", 
                "Biologia", "História", "Geografia", "Filosofia", "Sociologia", 
                "Literatura", "Inglês", "Espanhol", "Redação"
              ],
              "keywords": "ENEM, questões gratuitas, simulado online, vestibular, ensino médio, preparação, gabarito",
              "inLanguage": "pt-BR",
              "isAccessibleForFree": true
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
