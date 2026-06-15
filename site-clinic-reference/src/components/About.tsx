import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="bg-cream px-6 py-32 lg:px-10" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-stone">
              A clínica
            </span>
            <h2 className="font-serif text-4xl font-normal leading-trim text-ink md:text-5xl">
              Ciência, cuidado e <span className="italic text-sage">atenção genuína</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 lg:col-start-7"
          >
            <p className="text-lg leading-relaxed text-ink-light">
              A Clínica Vilela nasceu do desejo de oferecer uma dermatologia que olhasse para 
              além dos sintomas. Fundada pela Dra. Marina Vilela, médica dermatologista formada 
              pela USP com especialização em dermatologia integrativa, a clínica reúne uma equipe 
              multidisciplinar dedicada a entender cada paciente de forma individual.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink-light">
              Acreditamos que a pele reflete o estado emocional, hormonal e nutricional do corpo. 
              Por isso, nossos protocolos combinam tratamentos clínicos e estéticos de evidência 
              com uma investigação cuidadosa das causas subjacentes — sempre com diagnóstico 
              preciso e comunicação clara.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border pt-10">
              <div>
                <span className="font-serif text-3xl text-terracotta">+10</span>
                <p className="mt-2 text-sm text-stone">anos de experiência</p>
              </div>
              <div>
                <span className="font-serif text-3xl text-terracotta">3.500</span>
                <p className="mt-2 text-sm text-stone">pacientes atendidos</p>
              </div>
              <div>
                <span className="font-serif text-3xl text-terracotta">4</span>
                <p className="mt-2 text-sm text-stone">especialistas na equipe</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-24 grid gap-6 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl">
              <img
                src="https://images.pexels.com/photos/30815320/pexels-photo-30815320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200"
                alt="Dra. Marina Vilela em atendimento"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="font-serif text-2xl italic leading-relaxed text-ink">
              "Cada paciente chega com uma história. Nosso primeiro compromisso é ouvi-la com 
              atenção e respeito."
            </p>
            <div className="mt-6">
              <p className="font-medium text-ink">Dra. Marina Vilela</p>
              <p className="text-sm text-stone">CRM-SP 123456 | Dermatologista</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
