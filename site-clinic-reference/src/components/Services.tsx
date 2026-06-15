import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const services = [
  {
    id: 'clinical',
    title: 'Dermatologia Clínica',
    description:
      'Diagnóstico e tratamento de acne, rosácea, dermatite atópica, psoríase, queda de cabelo, manchas e outras condições de pele, couro cabeludo e unhas.',
    items: ['Acne e sequelas', 'Rosácea', 'Dermatites', 'Queda capilar', 'Oncodermatologia'],
  },
  {
    id: 'aesthetic',
    title: 'Dermatologia Estética',
    description:
      'Procedimentos minimamente invasivos para rejuvenescimento, melhora da qualidade da pele e harmonização facial, sempre com naturalidade como princípio.',
    items: ['Toxina botulínica', 'Preenchimento', 'Bioestimuladores', 'Laser e luz pulsada', 'Peelings'],
  },
  {
    id: 'integrative',
    title: 'Dermatologia Integrativa',
    description:
      'Abordagem que investiga a relação entre pele, intestino, sono, hormônios e emoções. Indicada para casos crônicos ou de difícil controle.',
    items: ['Avaliação hormonal', 'Nutrição funcional', 'Manejo do estresse', 'Saúde intestinal', 'Rotina de cuidados'],
  },
  {
    id: 'surgery',
    title: 'Cirurgia Dermatológica',
    description:
      'Procedimentos cirúrgicos para remoção de lesões benignas e malignas, com técnicas que priorizam a estética e a preservação tecidual.',
    items: ['Remoção de sinais', 'Cirurgia de Mohs', 'Cauterização', 'Crioterapia', 'Biópsias'],
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openId, setOpenId] = useState<string | null>('clinical');

  return (
    <section id="services" className="bg-cream-dark px-6 py-32 lg:px-10" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-stone">
              Tratamentos
            </span>
            <h2 className="font-serif text-4xl font-normal leading-trim text-ink md:text-5xl">
              Cuidados para cada <span className="italic text-sage">etapa</span> da pele
            </h2>
            <p className="mt-6 text-ink-light">
              Oferecemos tratamentos personalizados, desde a resolução de condições clínicas 
              até procedimentos estéticos com resultados naturais.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 lg:col-start-6"
          >
            <div className="divide-y divide-border">
              {services.map((service) => {
                const isOpen = openId === service.id;
                return (
                  <div key={service.id} className="py-6 first:pt-0">
                    <button
                      onClick={() => setOpenId(isOpen ? null : service.id)}
                      className="group flex w-full items-center justify-between text-left"
                    >
                      <h3 className="font-serif text-2xl text-ink transition-colors group-hover:text-sage">
                        {service.title}
                      </h3>
                      <span className="ml-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border-dark bg-white transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? 'auto' : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 max-w-xl text-ink-light">{service.description}</p>
                      <ul className="mt-6 flex flex-wrap gap-3">
                        {service.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-border-dark bg-white px-4 py-1.5 text-sm text-ink-light"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
