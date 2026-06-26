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
    title: 'Planejamento do Servicio',
    description: 'Escolha do estilo de tosa, tratamentos e produtos ideais para cada raça.',
    animation: 'scan',
  },
  {
    number: '03',
    title: 'Execucao Impecavel',
    description: 'Serviço realizado por profissionais certificados com produtos premium.',
    animation: 'ekg',
  },
]

export const PRICING_PLANS = [
  {
    name: 'Essencial',
    price: 'R$ 89',
    period: '/servico',
    description: 'Cuidados basicos para a rotina do seu pet.',
    features: ['Banho completo', 'Secagem', 'Limpeza de orelhas', 'Corte de unhas'],
    highlighted: false,
  },
  {
    name: 'Premium',
    price: 'R$ 149',
    period: '/servico',
    description: 'Experiencia completa com tosa e tratamentos.',
    features: ['Banho premium', 'Tosa padrao', 'Hidrataçao', 'Limpeza de ouvidos', 'Corte de unhas', ' perfume'],
    highlighted: true,
  },
  {
    name: 'VIP',
    price: 'R$ 249',
    period: '/servico',
    description: 'O maximo em cuidados para pets exigentes.',
    features: ['Spa completo', 'Tosa japonesa', 'Tratamento capilar', 'Hidrataçao profunda', 'Acessorios exclusivos', '保証 premium'],
    highlighted: false,
  },
]

export const NAV_LINKS = [
  { label: 'Inicio', path: '/' },
  { label: 'Servicos', path: '/servicos' },
  { label: 'Protocolo', path: '/protocolo' },
  { label: 'Contato', path: '/contato' },
]