import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Escuta atenta',
    description:
      'A primeira consulta é dedicada a entender sua história, queixas, rotina e objetivos. Não tratamos apenas a pele: tratamos pessoas.',
  },
  {
    number: '02',
    title: 'Diagnóstico preciso',
    description:
      'Utilizamos exames de imagem e análise clínica detalhada para identificar as causas reais do problema, sem tratamentos genéricos.',
  },
  {
    number: '03',
    title: 'Plano personalizado',
    description:
      'Montamos um protocolo sob medida, combinando tratamentos clínicos, estéticos e, quando indicado, cuidados integrativos.',
  },
  {
    number: '04',
    title: 'Acompanhamento contínuo',
    description:
      'Avaliamos a evolução em cada retorno e ajustamos o plano conforme necessário. A relação de confiança é parte do tratamento.',
  },
];

export default function Approach() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="approach" className="bg-cream px-6 py-32 lg:px-10" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-stone">
              Nossa abordagem
            </span>
            <h2 className="font-serif text-4xl font-normal leading-trim text-ink md:text-5xl">
              Um caminho claro para a <span className="italic text-sage">sua pele</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-light">
              Não acreditamos em soluções prontas. Nosso método é construído em quatro etapas 
              que garantem segurança, personalização e resultados sustentáveis.
            </p>

            <div className="mt-10 aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-square">
              <img
                src="https://images.pexels.com/photos/16131214/pexels-photo-16131214.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900"
                alt="Procedimento dermatológico na Clínica Vilela"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center lg:col-span-6 lg:col-start-7"
          >
            <div className="space-y-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.2 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex gap-6"
                >
                  <span className="font-serif text-3xl text-terracotta transition-colors group-hover:text-sage">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl text-ink">{step.title}</h3>
                    <p className="mt-3 leading-relaxed text-ink-light">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
