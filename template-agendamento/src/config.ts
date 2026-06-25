export type Service = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
};

export type Professional = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
};

export type Config = {
  business: {
    name: string;
    tagline: string;
    description: string;
    heroImage: string;
    heroOverlayText: string;
    heroCtaText: string;
  };
  accentColor: string;
  stats: { value: string; label: string }[];
  benefits: string[];
  services: Service[];
  professionals: Professional[];
  timeSlots: string[];
  introTitle: string;
  servicesTitle: string;
  professionalsTitle: string;
};

export const config: Config = {
  business: {
    name: "Corte Nobre",
    tagline: "Agendamento simples para barbearia",
    description: "Escolha serviço, barbeiro e melhor horário em uma experiência moderna, arredondada e direta ao ponto.",
    heroImage: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80",
    heroOverlayText: "Estilo, precisão e pontualidade.",
    heroCtaText: "Quero reservar",
  },
  accentColor: "#181411",
  stats: [
    { value: "5 min", label: "para reservar" },
    { value: "+320", label: "clientes este mês" },
    { value: "4,9/5", label: "avaliação média" },
  ],
  benefits: [
    "Escolha serviço, barbeiro e horário em poucos toques",
    "Confirmação visual imediata com resumo do agendamento",
    "Design elegante, limpo e pensado para conversão rápida",
  ],
  services: [
    {
      id: "classic",
      name: "Corte Clássico",
      duration: "35 min",
      price: "R$ 55",
      description: "Acabamento limpo, laterais precisas e estilo sob medida.",
    },
    {
      id: "beard",
      name: "Barba Premium",
      duration: "30 min",
      price: "R$ 45",
      description: "Desenho, toalha quente e finalização com balm.",
    },
    {
      id: "combo",
      name: "Corte + Barba",
      duration: "60 min",
      price: "R$ 90",
      description: "O combo ideal para resolver tudo em uma única visita.",
    },
    {
      id: "express",
      name: "Pezinho Express",
      duration: "15 min",
      price: "R$ 25",
      description: "Rápido, prático e perfeito para manter o visual em dia.",
    },
  ],
  professionals: [
    {
      id: "enzo",
      name: "Enzo Martins",
      role: "Barbeiro sênior",
      specialty: "Fade, navalhado e acabamento premium",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "leo",
      name: "Léo Costa",
      role: "Especialista em cortes modernos",
      specialty: "Crop, mid fade e visuais urbanos",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "rafa",
      name: "Rafa Nunes",
      role: "Barba e visagismo",
      specialty: "Design de barba e atendimento consultivo",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    },
  ],
  timeSlots: ["09:00", "09:45", "10:30", "11:15", "13:30", "14:15", "15:00", "16:00", "17:00", "18:15"],
  introTitle: "Agendamento elegante e objetivo",
  servicesTitle: "Escolha o que você precisa",
  professionalsTitle: "Profissionais da casa",
};