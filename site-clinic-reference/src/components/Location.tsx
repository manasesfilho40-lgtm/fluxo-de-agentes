import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function Location() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormState({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <section id="location" className="bg-cream px-6 py-32 lg:px-10" ref={ref}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-stone">
              Localização
            </span>
            <h2 className="font-serif text-4xl font-normal leading-trim text-ink md:text-5xl">
              Venha nos <span className="italic text-sage">conhecer</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-light">
              Estamos no bairro dos Jardins, em São Paulo, em um espaço pensado para 
              oferecer conforto, privacidade e uma experiência acolhedora desde a chegada.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border-dark bg-white">
                  <MapPin className="h-4 w-4 text-terracotta" />
                </div>
                <div>
                  <p className="font-medium text-ink">Endereço</p>
                  <p className="mt-1 text-ink-light">
                    Rua Oscar Freire, 1234, sala 82<br />
                    Jardins, São Paulo — SP
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border-dark bg-white">
                  <Phone className="h-4 w-4 text-terracotta" />
                </div>
                <div>
                  <p className="font-medium text-ink">Telefone</p>
                  <p className="mt-1 text-ink-light">(11) 3088-1234</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border-dark bg-white">
                  <Mail className="h-4 w-4 text-terracotta" />
                </div>
                <div>
                  <p className="font-medium text-ink">E-mail</p>
                  <p className="mt-1 text-ink-light">contato@clinicavilela.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border-dark bg-white">
                  <Clock className="h-4 w-4 text-terracotta" />
                </div>
                <div>
                  <p className="font-medium text-ink">Horário de atendimento</p>
                  <p className="mt-1 text-ink-light">
                    Segunda a sexta: 8h às 20h<br />
                    Sábado: 9h às 14h
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 lg:col-start-7"
          >
            <div className="rounded-2xl border border-border bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] md:p-10">
              <h3 className="font-serif text-2xl text-ink">Solicite um agendamento</h3>
              <p className="mt-2 text-ink-light">
                Preencha o formulário abaixo. Nossa equipe entrará em contato em até 24h.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
                      Nome completo
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full rounded-lg border border-border-dark bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-sage focus:ring-1 focus:ring-sage"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">
                      Telefone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full rounded-lg border border-border-dark bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-sage focus:ring-1 focus:ring-sage"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full rounded-lg border border-border-dark bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-sage focus:ring-1 focus:ring-sage"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">
                    Como podemos ajudar?
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full resize-none rounded-lg border border-border-dark bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-sage focus:ring-1 focus:ring-sage"
                    placeholder="Conte um pouco sobre sua queixa principal"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-ink py-4 text-sm font-medium text-white transition-all hover:bg-sage-dark"
                >
                  {submitted ? 'Mensagem enviada!' : 'Solicitar agendamento'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
