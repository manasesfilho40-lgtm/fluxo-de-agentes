import { useMemo, useState } from "react";
import { config, type Service, type Professional } from "./config";

function getUpcomingDates() {
  const formatterWeek = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
  const formatterDay = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    const weekday = formatterWeek.format(date).replace(".", "");
    const full = formatterDay.format(date);
    const iso = date.toISOString().split("T")[0];

    return {
      id: iso,
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      full,
      label: `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} · ${full}`,
    };
  });
}

function ScissorsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ui-icon" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.2 7.8 20 2" strokeLinecap="round" />
      <path d="M8.2 16.2 20 22" strokeLinecap="round" />
      <path d="M14 12 8.2 8" strokeLinecap="round" />
      <path d="M14 12 8.2 16" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ui-icon" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ui-icon" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4" strokeLinecap="round" />
      <path d="M16 3v4" strokeLinecap="round" />
      <path d="M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ui-icon" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ui-icon" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const dates = useMemo(() => getUpcomingDates(), []);

  const [selectedServiceId, setSelectedServiceId] = useState(config.services[2].id);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(config.professionals[0].id);
  const [selectedDateId, setSelectedDateId] = useState(dates[0].id);
  const [selectedTime, setSelectedTime] = useState(config.timeSlots[3]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedService = config.services.find((s) => s.id === selectedServiceId) ?? config.services[0];
  const selectedProfessional = config.professionals.find((p) => p.id === selectedProfessionalId) ?? config.professionals[0];
  const selectedDate = dates.find((d) => d.id === selectedDateId) ?? dates[0];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="booking-app">
      <section className="hero-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-badge">
              <ScissorsIcon />
            </span>
            <div>
              <strong>{config.business.name}</strong>
              <p>{config.business.tagline}</p>
            </div>
          </div>

          <a className="topbar-button" href="#agendar">
            Agendar agora
          </a>
        </header>

        <div className="hero-grid">
          <section className="hero-copy">
            <span className="eyebrow">Rápido de reservar</span>
            <h1>Seu horário marcado sem enrolação.</h1>
            <p>{config.business.description}</p>

            <div className="hero-actions">
              <a className="primary-action" href="#agendar">
                <span>{config.business.heroCtaText}</span>
                <ArrowRightIcon />
              </a>
              <div className="hero-note">
                <CalendarIcon />
                <span>Atendimento com confirmação imediata</span>
              </div>
            </div>

            <div className="stats-row">
              {config.stats.map((item) => (
                <div className="stat-card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="hero-visual">
            <div className="visual-card main">
              <img src={config.business.heroImage} alt={config.business.name} />
              <div className="visual-overlay" />
              <div className="visual-copy">
                <span>Ambiente premium</span>
                <strong>{config.business.heroOverlayText}</strong>
              </div>
            </div>
            <div className="floating-card">
              <ClockIcon />
              <div>
                <strong>Hoje às 11:15</strong>
                <p>3 horários livres no período da manhã</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="content-grid">
        <section className="content-column">
          <div className="section-card intro-card">
            <div className="section-heading">
              <span className="section-tag">Como funciona</span>
              <h2>{config.introTitle}</h2>
            </div>
            <div className="benefit-list">
              {config.benefits.map((benefit) => (
                <div className="benefit-item" key={benefit}>
                  <span className="benefit-icon">
                    <CheckIcon />
                  </span>
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-heading">
              <span className="section-tag">Serviços</span>
              <h2>{config.servicesTitle}</h2>
            </div>
            <div className="service-grid">
              {config.services.map((service) => (
                <button
                  key={service.id}
                  className={`service-card ${selectedServiceId === service.id ? "active" : ""}`}
                  onClick={() => setSelectedServiceId(service.id)}
                  type="button"
                >
                  <div className="service-top">
                    <h3>{service.name}</h3>
                    <strong>{service.price}</strong>
                  </div>
                  <p>{service.description}</p>
                  <span>{service.duration}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-heading">
              <span className="section-tag">Profissionais</span>
              <h2>{config.professionalsTitle}</h2>
            </div>
            <div className="professional-grid">
              {config.professionals.map((professional) => (
                <button
                  key={professional.id}
                  className={`professional-card ${selectedProfessionalId === professional.id ? "active" : ""}`}
                  onClick={() => setSelectedProfessionalId(professional.id)}
                  type="button"
                >
                  <img src={professional.image} alt={professional.name} />
                  <div className="professional-info">
                    <div>
                      <h3>{professional.name}</h3>
                      <span>{professional.role}</span>
                    </div>
                    <p>{professional.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="booking-column" id="agendar">
          <form className="booking-card" onSubmit={handleSubmit}>
            <div className="booking-header">
              <span className="section-tag dark">Agendar</span>
              <h2>Reserve seu horário</h2>
              <p>Preencha o básico e finalize em menos de 1 minuto.</p>
            </div>

            <div className="field-group">
              <label htmlFor="name">Seu nome</label>
              <input
                id="name"
                type="text"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="phone">WhatsApp</label>
              <input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>

            <div className="picker-group">
              <div className="picker-label">
                <CalendarIcon />
                <span>Data</span>
              </div>
              <div className="chip-grid two-columns">
                {dates.map((date) => (
                  <button
                    key={date.id}
                    className={`picker-chip ${selectedDateId === date.id ? "active" : ""}`}
                    onClick={() => setSelectedDateId(date.id)}
                    type="button"
                  >
                    <strong>{date.weekday}</strong>
                    <span>{date.full}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="picker-group">
              <div className="picker-label">
                <ClockIcon />
                <span>Horário</span>
              </div>
              <div className="chip-grid times-grid">
                {config.timeSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`time-chip ${selectedTime === slot ? "active" : ""}`}
                    onClick={() => setSelectedTime(slot)}
                    type="button"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-row">
                <span>Serviço</span>
                <strong>{selectedService.name}</strong>
              </div>
              <div className="summary-row">
                <span>Profissional</span>
                <strong>{selectedProfessional.name}</strong>
              </div>
              <div className="summary-row">
                <span>Quando</span>
                <strong>
                  {selectedDate.label} • {selectedTime}
                </strong>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <strong>{selectedService.price}</strong>
              </div>
            </div>

            <button className="submit-button" type="submit">
              Confirmar agendamento
            </button>

            {submitted && (
              <div className="success-card" role="status" aria-live="polite">
                <span className="success-icon">
                  <CheckIcon />
                </span>
                <div>
                  <strong>Horário reservado com sucesso</strong>
                  <p>
                    {name || "Cliente"}, seu atendimento de {selectedService.name.toLowerCase()} com {selectedProfessional.name} ficou para {selectedDate.label} às {selectedTime}.
                  </p>
                </div>
              </div>
            )}
          </form>
        </aside>
      </section>
    </main>
  );
}