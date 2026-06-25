import { Scan, Shield, Target } from 'lucide-react'

export const BRAND = {
  name: 'LÍNEA DENTAL',
  tagline: 'Odontologia de precisão e excelência.',
  purpose: 'Clínica odontológica de excelência com diagnóstico digital avançado.',
}

export const VALUE_PROPS = [
  {
    title: 'Diagnóstico Digital Avançado',
    description: 'Scanner intraoral 3D de última geração para mapeamento completo da sua saúde bucal.',
    icon: Scan,
    shufflerLabels: ['Scanner 3D Intraoral', 'Análise Automatizada', 'Relatório Instantâneo'],
  },
  {
    title: 'Tratamentos Minimamente Invasivos',
    description: 'Técnicas que preservam o máximo de estrutura saudável com resultados superiores.',
    icon: Shield,
    typewriterMessages: [
      '> Iniciando protocolo de preservação...',
      '> Mapeamento de estrutura saudável...',
      '> Selecionando técnica minimamente invasiva...',
      '> Executando com precisão milimétrica...',
      '> Verificando integridade do tratamento...',
    ],
  },
  {
    title: 'Resultados Previsíveis',
    description: 'Planejamento digital com simulação do sorriso antes mesmo de iniciar o tratamento.',
    icon: Target,
    schedulerDays: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    schedulerLabel: 'Agendar Avaliação',
  },
]

export const PROTOCOL_STEPS = [
  {
    number: '01',
    title: 'Avaliação Completa',
    description: 'Análise digital detalhada com scanner 3D e radiografia de alta resolução.',
    animation: 'helix',
  },
  {
    number: '02',
    title: 'Planejamento Digital',
    description: 'Simulação do resultado final antes do início do tratamento.',
    animation: 'scan',
  },
  {
    number: '03',
    title: 'Execução Precisa',
    description: 'Tratamento realizado com tecnologia de ponta e acompanhamento em tempo real.',
    animation: 'ekg',
  },
]

export const PRICING_PLANS = [
  {
    name: 'Essencial',
    price: 'R$ 189',
    period: '/mês',
    description: 'Cobertura completa para sua rotina de cuidados.',
    features: ['Limpeza semestral', 'Avaliação anual', 'Raio-X incluso', 'WhatsApp direto'],
    highlighted: false,
  },
  {
    name: 'Performance',
    price: 'R$ 349',
    period: '/mês',
    description: 'Experiência premium com tecnologia avançada.',
    features: ['Limpeza trimestral', 'Scanner 3D anual', 'Clareamento com desconto', 'Prioridade no agendamento', 'Acompanhamento digital'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'R$ 599',
    period: '/mês',
    description: 'Para famílias que buscam excelência completa.',
    features: ['Cobertura familiar (4)', 'Todos os benefícios Performance', 'Tratamentos ortodônticos', 'Emergência 24h', 'Convenios exclusivos'],
    highlighted: false,
  },
]

export const NAV_LINKS = [
  { label: 'Início', path: '/' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Protocolo', path: '/protocolo' },
  { label: 'Contato', path: '/contato' },
]
