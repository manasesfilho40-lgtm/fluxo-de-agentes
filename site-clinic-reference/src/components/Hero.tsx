import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-cream px-6 pt-32 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Texto */}
        <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-stone">
              Dermatologia Integrativa
            </span>
            <h1 className="font-serif text-5xl font-normal leading-trim text-ink md:text-6xl lg:text-7xl">
              Pele em equilíbrio,<br />
              <span className="italic text-sage">vida em harmonia</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-md text-lg leading-relaxed text-ink-light"
          >
            Na Clínica Vilela, cuidamos da pele como parte integrante da sua saúde. 
            Unimos ciência dermatológica, estética consciente e uma escuta atenta para 
            construir tratamentos que fazem sentido para você.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#location"
              className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-4 text-sm font-medium text-white transition-all hover:bg-sage-dark"
            >
              Agendar uma consulta
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-border-dark bg-white px-8 py-4 text-sm font-medium text-ink transition-all hover:border-ink"
            >
              Conhecer tratamentos
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 hidden items-center gap-4 text-sm text-stone lg:flex"
          >
            <span className="h-px w-12 bg-border-dark" />
            <span>Atendimento em São Paulo desde 2014</span>
          </motion.div>
        </div>

        {/* Imagem */}
        <div className="relative order-1 lg:order-2 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:aspect-[16/12] lg:aspect-[4/3]"
          >
            <img
              src="https://images.pexels.com/photos/38055771/pexels-photo-38055771.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600"
              alt="Consultório moderno e luminoso da Clínica Vilela"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-8 -left-6 z-10 hidden max-w-xs rounded-xl bg-white p-6 shadow-xl lg:block"
          >
            <p className="font-serif text-lg italic text-ink">
              "A pele conta histórias. Nosso trabalho é ajudá-la a se expressar com saúde."
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone">
              Dra. Marina Vilela
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-8 right-8 hidden lg:block"
          >
            <a
              href="#about"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-ink"
            >
              <ArrowDown className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
