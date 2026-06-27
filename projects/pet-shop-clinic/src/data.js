export const BRAND = {
  name: 'PAWFECT PET',
  tagline: 'Pet Shop premium com amor.',
  purpose: 'Pet shop de excelência com tosa japonesa, spa pet e cuidados veterinários para seu melhor amigo.',
}

export const PROTOCOL_STEPS = [
  {
    number: '01',
    title: 'Avaliação do Pet',
    description: 'Análise completa do estado do pelo, pele e necessidades específicas do seu pet.',
    animation: 'helix',
  },
  {
    number: '02',
    title: 'Planejamento do Serviço',
    description: 'Escolha do estilo de tosa, tratamentos e produtos ideais para cada raça.',
    animation: 'scan',
  },
  {
    number: '03',
    title: 'Execução Impecável',
    description: 'Serviço realizado por profissionais certificados com produtos premium.',
    animation: 'ekg',
  },
]

export const PRICING_PLANS = [
  {
    name: 'Essencial',
    price: 'R$ 89',
    period: '/serviço',
    description: 'Cuidados básicos para a rotina do seu pet.',
    features: ['Banho completo', 'Secagem', 'Limpeza de orelhas', 'Corte de unhas'],
    highlighted: false,
  },
  {
    name: 'Premium',
    price: 'R$ 149',
    period: '/serviço',
    description: 'Experiência completa com tosa e tratamentos.',
    features: ['Banho premium', 'Tosa padrão', 'Hidratação', 'Limpeza de ouvidos', 'Corte de unhas', 'Perfume'],
    highlighted: true,
  },
  {
    name: 'VIP',
    price: 'R$ 249',
    period: '/serviço',
    description: 'O máximo em cuidados para pets exigentes.',
    features: ['Spa completo', 'Tosa japonesa', 'Tratamento capilar', 'Hidratação profunda', 'Acessórios exclusivos', 'Garantia premium'],
    highlighted: false,
  },
]

export const NAV_LINKS = [
  { label: 'Início', path: '/' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Protocolo', path: '/protocolo' },
  { label: 'Contato', path: '/contato' },
]