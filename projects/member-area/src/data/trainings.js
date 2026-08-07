export const CATEGORIES = [
  { id: 'ctb', name: 'CTB - Código de Trânsito', icon: 'Car', color: 'from-blue-500 to-indigo-500', count: 2, image: '/images/prf/ctb.jpg', file: '/pdfs/CTB Parte1 2.pdf' },
  { id: 'ctb-2', name: 'CTB - Parte 2', icon: 'Car', color: 'from-blue-400 to-indigo-400', count: 1, image: '/images/prf/ctb.jpg', file: '/pdfs/CTB parte2 2.pdf' },
  { id: 'dir-admin', name: 'Direito Administrativo', icon: 'Building', color: 'from-green-500 to-emerald-500', count: 1, image: '/images/prf/dir-admin.jpg', file: '/pdfs/Direito Administrativo_ 2.pdf' },
  { id: 'dir-const', name: 'Direito Constitucional', icon: 'Scale', color: 'from-orange-500 to-red-500', count: 1, image: '/images/prf/dir-const.jpg', file: '/pdfs/Direito Constitucional_ 2.pdf' },
  { id: 'dir-penal', name: 'Direito Penal', icon: 'Gavel', color: 'from-cyan-500 to-blue-500', count: 1, image: '/images/prf/dir-penal.jpg', file: '/pdfs/Direito Penal_ 2.pdf' },
  { id: 'dir-proc-penal', name: 'Direito Processual Penal', icon: 'FileText', color: 'from-yellow-500 to-orange-500', count: 1, image: '/images/prf/dir-proc-penal.jpg', file: '/pdfs/Direito Processual Penal_ 2.pdf' },
  { id: 'dir-humanos', name: 'Direitos Humanos', icon: 'Heart', color: 'from-red-500 to-pink-500', count: 1, image: '/images/prf/dir-humanos.jpg', file: '/pdfs/Direitos Humanos_ 2.pdf' },
  { id: 'etica', name: 'Ética e Cidadania', icon: 'Star', color: 'from-purple-500 to-violet-500', count: 1, image: '/images/prf/etica.jpg', file: '/pdfs/Ética e Cidadania_ 2.pdf' },
  { id: 'fisica', name: 'Física', icon: 'Atom', color: 'from-pink-500 to-rose-500', count: 1, image: '/images/prf/fisica.jpg', file: '/pdfs/Física_ 2.pdf' },
  { id: 'geopolitica', name: 'Geopolítica', icon: 'Globe', color: 'from-orange-500 to-amber-500', count: 1, image: '/images/prf/geopolitica.jpg', file: '/pdfs/Geopolítica_ 2.pdf' },
  { id: 'informatica', name: 'Informática', icon: 'Monitor', color: 'from-red-500 to-rose-500', count: 1, image: '/images/prf/informatica.jpg', file: '/pdfs/Informática_ 2.pdf' },
  { id: 'leg-especial', name: 'Legislação Especial', icon: 'BookOpen', color: 'from-green-500 to-teal-500', count: 1, image: '/images/prf/leg-especial.jpg', file: '/pdfs/Legislação Especial_ 2.pdf' },
  { id: 'lingua', name: 'Língua Estrangeira', icon: 'Globe', color: 'from-yellow-500 to-orange-500', count: 1, image: '/images/prf/lingua.jpg', file: '/pdfs/Língua Estrangeira_ 2.pdf' },
  { id: 'raciocinio', name: 'Raciocínio Lógico Matemático', icon: 'Brain', color: 'from-purple-500 to-pink-500', count: 1, image: '/images/prf/raciocinio.jpg', file: '/pdfs/Raciocínio Lógico Matemático_ 2 (1).pdf' },
]

export const LEVELS = [
  { id: 'basico', name: 'Básico', color: 'text-green-400', icon: 'Star' },
  { id: 'intermediario', name: 'Intermediário', color: 'text-yellow-400', icon: 'Star' },
  { id: 'avancado', name: 'Avançado', color: 'text-red-400', icon: 'Star' },
]

export const BONUS_CONTENT = [
  {
    id: 'guia-prf',
    title: 'Guia PRF',
    desc: 'Guia completo para aprovação na Polícia Rodoviária Federal',
    icon: 'FileText',
    type: 'pdf',
    pages: 20,
    file: '/pdfs/BÔNUS 1 - Guia PRF (1).pdf',
    isFile: true,
    image: '/images/prf/guia-prf.jpg',
  },
  {
    id: 'plano-estudos',
    title: 'Plano de Estudos',
    desc: 'Plano de estudos organizado para todos os conteúdos',
    icon: 'Calendar',
    type: 'pdf',
    pages: 15,
    file: '/pdfs/BÔNUS 2 - Plano de Estudos (1).pdf',
    isFile: true,
    image: '/images/prf/plano-estudos.jpg',
  },
  {
    id: 'manual-aprendizado',
    title: 'Manual do Aprendizado',
    desc: 'Técnicas comprovadas de aprendizado acelerado',
    icon: 'BookOpen',
    type: 'pdf',
    pages: 12,
    file: '/pdfs/BÔNUS 3 - Manual do Aprendizado (1).pdf',
    isFile: true,
    image: '/images/prf/manual-aprendizado.jpg',
  },
  {
    id: 'manual-memorizacao',
    title: 'Manual da Memorização',
    desc: 'Métodos para memorizar grandes quantidades de conteúdo',
    icon: 'Brain',
    type: 'pdf',
    pages: 10,
    file: '/pdfs/BÔNUS 4 - Manual da Memorização (1).pdf',
    isFile: true,
    image: '/images/prf/manual-memorizacao.jpg',
  },
  {
    id: 'guia-concurso',
    title: 'O Guia do Concurso Público',
    desc: 'Estratégias completas para aprovação em concursos',
    icon: 'Award',
    type: 'pdf',
    pages: 25,
    file: '/pdfs/BÔNUS 5 - O guia do Concurso Público (2).pdf',
    isFile: true,
    image: '/images/prf/guia-concurso.jpg',
  },
]

export const generateMaterials = () => {
  const materials = []
  let id = 1
  CATEGORIES.forEach(cat => {
    materials.push({
      id: id++,
      category: cat.id,
      categoryName: cat.name,
      title: cat.name,
      description: `Material completo de ${cat.name} para o concurso da PRF.`,
      file: cat.file,
      image: cat.image,
    })
  })
  return materials
}

export const ALL_MATERIALS = generateMaterials()

export const getMaterialsByCategory = (categoryId) =>
  ALL_MATERIALS.filter(m => m.category === categoryId)
