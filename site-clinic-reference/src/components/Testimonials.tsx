import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const testimonials = [
  {
    quote:
      'Finalmente encontrei uma dermatologista que ouve de verdade. A Dra. Marina não resolveu apenas minha acne, mas entendeu o que estava por trás dela.',
    author: 'Carolina Mendes',
    detail: 'Tratamento de acne adulta',
  },
  {
    quote:
      'O resultado do preenchimento ficou extremamente natural. Ninguém percebe que fiz algo, só dizem que estou com cara de descansada.',
    author: 'Fernanda Rocha',
    detail: 'Harmonização facial',
  },
  {
    quote:
      'A abordagem integrativa fez toda a diferença na minha rosácea. Hoje minha pele está controlada e aprendi a cuidar dela no dia a dia.',
    author: 'Patrícia Lins',
    detail: 'Dermatologia integrativa',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className="bg-ink px-6 py-32 text-white lg:px-10" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-light">
            Depoimentos
          </span>
          <h2 className="font-serif text-4xl font-normal leading-trim md:text-5xl">
            O que dizem <span className="italic text-sage">nossos pacientes</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.2 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div>
                <span className="font-serif text-5xl text-terracotta-light">"</span>
                <p className="-mt-4 text-lg leading-relaxed text-white/90">{testimonial.quote}</p>
              </div>
              <div className="mt-8">
                <p className="font-medium text-white">{testimonial.author}</p>
                <p className="mt-1 text-sm text-white/50">{testimonial.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
