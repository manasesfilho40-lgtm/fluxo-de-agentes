import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export default function Contato() {
  const ref = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '', consent: false })
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-item', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.3 })
    }, ref)
    return () => ctx.revert()
  }, [])
  const handleSubmit = (e) => { e.preventDefault(); if (!form.consent) { alert('Você precisa concordar com a Política de Privacidade para enviar a mensagem.'); return }; alert('Mensagem enviada! Entraremos em contato em breve.'); setForm({ name: '', email: '', phone: '', service: '', message: '', consent: false }) }

  return (
    <section ref={ref} className="pt-32 pb-24 md:pt-40 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">Fale Conosco</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark mb-4">Agende sua Consulta</h2>
          <p className="font-heading text-dark/60 text-lg max-w-2xl mx-auto">Estamos prontos para cuidar do seu pet. Preencha o formulário ou entre em contato diretamente.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="contact-item bg-background border border-dark/10 rounded-[2rem] p-8 shadow-lg">
              <h3 className="font-heading font-bold text-xl text-dark mb-6">Informações de Contato</h3>
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: 'Endereço', text: 'Av. Paulista, 1000 - Sala 301\nSão Paulo, SP - 01310-100' },
                  { icon: Phone, title: 'Telefone', text: '(11) 99999-9999' },
                  { icon: Mail, title: 'E-mail', text: 'contato@pawfectpet.com.br' },
                  { icon: Clock, title: 'Horário', text: 'Seg - Sex: 08:00 - 18:00\nSábado: 08:00 - 12:00' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0"><item.icon className="text-accent" size={20} /></div>
                    <div><p className="font-heading font-semibold text-dark">{item.title}</p><p className="font-heading text-dark/60 text-sm whitespace-pre-line">{item.text}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="contact-item bg-primary rounded-[2rem] p-8 shadow-lg">
              <h3 className="font-heading font-bold text-xl text-white mb-4">Emergência 24h</h3>
              <p className="font-heading text-white/60 text-sm mb-4">Para urgências fora do horário comercial, ligue para nossa linha de emergência.</p>
              <a href="tel:+5511988888888" className="btn-magnetic inline-flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-full font-heading font-semibold text-sm"><Phone size={16} />(11) 98888-8888</a>
            </div>
          </div>
          <div className="contact-item bg-background border border-dark/10 rounded-[2rem] p-8 shadow-lg">
            <h3 className="font-heading font-bold text-xl text-dark mb-6">Envie uma Mensagem</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="font-heading text-sm font-medium text-dark block mb-2">Nome Completo</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-ivory font-heading text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="Seu nome" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="font-heading text-sm font-medium text-dark block mb-2">E-mail</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-ivory font-heading text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="email@exemplo.com" required /></div>
                <div><label className="font-heading text-sm font-medium text-dark block mb-2">Telefone</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-ivory font-heading text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" placeholder="(11) 99999-9999" /></div>
              </div>
              <div><label className="font-heading text-sm font-medium text-dark block mb-2">Tipo de Serviço</label><select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-ivory font-heading text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" required><option value="">Selecione...</option><option value="tosa">Tosa Japonesa</option><option value="spa">Spa Pet</option><option value="veterinaria">Cuidados Veterinários</option><option value="banho">Banho Completo</option><option value="outro">Outro</option></select></div>
              <div><label className="font-heading text-sm font-medium text-dark block mb-2">Mensagem</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-ivory font-heading text-dark text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none" placeholder="Descreva como podemos ajudar..." /></div>
              <div className="flex items-start gap-3"><input type="checkbox" id="consent" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-1 w-4 h-4 rounded border-dark/20 text-accent focus:ring-accent/50" required /><label htmlFor="consent" className="font-heading text-dark/50 text-xs">Concordo com a <Link to="/privacidade" className="text-accent underline">Política de Privacidade</Link> e autorizo o tratamento dos meus dados pessoais conforme a LGPD.</label></div>
              <button type="submit" className="btn-magnetic w-full bg-accent text-primary py-4 rounded-xl font-heading font-semibold text-sm flex items-center justify-center gap-2">Enviar Mensagem <Send size={16} /></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
