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
    name: "Sorrir Bem",
    tagline: "Agendamento simples para sua consulta",
    description: "Agende sua consulta odontológica de forma rápida e prática. Escolha o tratamento, o dentista e o melhor horário para você.",
    heroImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    heroOverlayText: "Seu sorriso merece o melhor cuidado.",
    heroCtaText: "Agendar consulta",
  },
  accentColor: "#0a6e6a",
  stats: [
    { value: "2 min", label: "para agendar" },
    { value: "+1.200", label: "pacientes atendidos" },
    { value: "4,9/5", label: "avaliação média" },
    { value: "+8 anos", label: "de experiência" },
  ],
  benefits: [
    "Escolha tratamento, dentista e horário em poucos toques",
    "Confirmação imediata com resumo completo da consulta",
    "Ambiente acolhedor e estrutura moderna para seu conforto",
    "Lembretes automáticos via WhatsApp para não esquecer",
  ],
  services: [
    {
      id: "clean",
      name: "Limpeza Dental",
      duration: "40 min",
      price: "R$ 120",
      description: "Remoção de tártaro, placa bacteriana e profilaxia completa.",
    },
    {
      id: "whitening",
      name: "Clareamento",
      duration: "60 min",
      price: "R$ 350",
      description: "Clareamento dental a laser com resultado imediato e duradouro.",
    },
    {
      id: "implant",
      name: "Implante Dentário",
      duration: "90 min",
      price: "R$ 2.500",
      description: "Implante de titânio com coroa protética — aparência e função naturais.",
    },
    {
      id: "ortho",
      name: "Aparelho Ortodôntico",
      duration: "50 min",
      price: "R$ 180",
      description: "Avaliação e instalação de aparelho fixo ou invisível (Invisalign).",
    },
    {
      id: "restore",
      name: "Restauração",
      duration: "40 min",
      price: "R$ 150",
      description: "Restauração em resina composta na cor do dente.",
    },
    {
      id: "extraction",
      name: "Extração",
      duration: "30 min",
      price: "R$ 200",
      description: "Extração simples ou de siso com acompanhamento pós-operatório.",
    },
  ],
  professionals: [
    {
      id: "ana",
      name: "Dra. Ana Beatriz",
      role: "Dentista sênior",
      specialty: "Clínica geral, estética e implantes",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "carlos",
      name: "Dr. Carlos Mendes",
      role: "Ortodontista",
      specialty: "Aparelhos fixos, Invisalign e ortopedia facial",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "julia",
      name: "Dra. Júlia Costa",
      role: "Periodontista",
      specialty: "Gengiva, implantes e cirurgia oral menor",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    },
  ],
  timeSlots: ["08:00", "08:40", "09:20", "10:00", "10:40", "11:20", "13:00", "13:40", "14:20", "15:00", "15:40", "16:20", "17:00", "17:40"],
  introTitle: "Agendamento odontológico simples e rápido",
  servicesTitle: "Tratamentos que oferecemos",
  professionalsTitle: "Nossa equipe",
};