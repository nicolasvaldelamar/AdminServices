import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wrench,
  Code2,
  ShieldCheck,
  Network,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Zap,
  Clock,
  Users,
  CheckCircle2
} from 'lucide-react'

export default function Landing() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden text-primary-50">
      {/* Fondo animado: grid + orbes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-primary-500/15 rounded-full blur-[120px]" style={{ animation: 'float 14s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-primary-600/10 rounded-full blur-[120px] opacity-70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-7 lg:py-10">
        {/* === Navbar === */}
        <header className="flex items-center justify-between gap-4 md:gap-8 mb-10 sm:mb-14">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo-blanco.png"
              alt="Arnol Caicedo - Soluciones en tecnología y ciberseguridad"
              className="w-28 sm:w-36 md:w-40 lg:w-48 h-auto"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden md:flex items-center gap-7 text-primary-50/90 text-sm font-medium mr-2">
              <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
              <a href="#proceso" className="hover:text-white transition-colors">Proceso</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>

            <Link
              to="/seguimiento"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 text-primary-50 text-sm hover:bg-white/10 hover:border-white/40 transition"
            >
              Seguir mi servicio
            </Link>

            <Link
              to="/login"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-white text-primary-700 text-sm font-semibold shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-transform"
            >
              Iniciar sesión
            </Link>

            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/80 text-primary-100"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Menú"
            >
              {menuAbierto ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Menú móvil */}
        {menuAbierto && (
          <div className="sm:hidden mb-8 rounded-2xl bg-slate-950/90 border border-slate-700/80 p-4 space-y-3">
            <nav className="flex flex-col gap-3 text-primary-50 text-sm">
              <a href="#servicios" onClick={() => setMenuAbierto(false)} className="hover:text-white">Servicios</a>
              <a href="#proceso" onClick={() => setMenuAbierto(false)} className="hover:text-white">Proceso</a>
              <a href="#faq" onClick={() => setMenuAbierto(false)} className="hover:text-white">FAQ</a>
            </nav>
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <Link
                to="/seguimiento"
                onClick={() => setMenuAbierto(false)}
                className="text-center px-4 py-2 rounded-xl border border-white/20 text-primary-50 text-sm hover:bg-white/10"
              >
                Seguir mi servicio
              </Link>
              <Link
                to="/login"
                onClick={() => setMenuAbierto(false)}
                className="text-center px-4 py-2.5 rounded-xl bg-white text-primary-700 text-sm font-semibold"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        )}

        {/* === Hero === */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mt-2 sm:mt-6">
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-primary-50 backdrop-blur">
              <Sparkles size={14} className="text-primary-300" />
              Soporte técnico, software y ciberseguridad
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]">
              <span className="block text-white">Tecnología que</span>
              <span className="block text-gradient-primary">trabaja por ti.</span>
            </h1>

            <p className="text-primary-100/90 text-base sm:text-lg max-w-xl leading-relaxed">
              Solicita servicios técnicos, sigue su estado en tiempo real y recibe reportes
              claros de todo lo que hacemos con tus equipos y sistemas. Una plataforma simple,
              transparente y profesional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1">
              <Link
                to="/solicitar-servicio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-primary-700 text-sm sm:text-base font-semibold shadow-xl shadow-primary-500/30 hover:-translate-y-0.5 hover:shadow-2xl transition-all"
              >
                Solicitar servicio
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/seguimiento"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/20 bg-white/5 text-white text-sm sm:text-base font-semibold backdrop-blur hover:bg-white/10 hover:border-white/40 transition-all"
              >
                Seguir mi servicio
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 text-primary-100/80 text-xs sm:text-sm">
              {[
                'Sin filas ni llamadas',
                'Reporte técnico documentado',
                'Servicio en taller o en sitio',
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-primary-300" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjetas hero */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-8 -right-6 w-40 h-40 bg-primary-500/30 rounded-3xl blur-3xl" />
            <div className="absolute bottom-0 -left-6 w-40 h-40 bg-slate-800/70 rounded-3xl blur-3xl" />

            <div className="relative space-y-4">
              <HeroCard
                tone="light"
                icon={<Wrench size={18} />}
                tag="Soporte técnico"
                text="Mantenimiento, reparaciones y diagnóstico de equipos e infraestructura de TI con reportes claros."
                offset="0"
                duration="6s"
              />
              <HeroCard
                tone="dark"
                icon={<Code2 size={18} />}
                tag="Desarrollo de software"
                text="Aplicaciones y automatizaciones para tus procesos: seguimiento, reportes y facturación."
                offset="ml-6"
                duration="7s"
              />
              <HeroCard
                tone="light"
                icon={<ShieldCheck size={18} />}
                tag="Ciberseguridad"
                text="Buenas prácticas, respaldo de información y monitoreo para proteger tu operación."
                offset="ml-12"
                duration="8s"
              />
            </div>
          </div>
        </section>

        {/* === Stats strip === */}
        <section className="mt-16 sm:mt-20 lg:mt-24">
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-sm p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Stat icon={<Zap size={18} />} valor="24/7" texto="Consulta de estado" />
            <Stat icon={<Clock size={18} />} valor="< 24h" texto="Respuesta inicial" />
            <Stat icon={<Users size={18} />} valor="100%" texto="Servicios documentados" />
            <Stat icon={<ShieldCheck size={18} />} valor="3" texto="Áreas de trabajo" />
          </div>
        </section>

        {/* === Servicios === */}
        <section id="servicios" className="mt-20 sm:mt-24 lg:mt-28">
          <SectionHeader
            tag="Nuestros servicios"
            titulo="Servicios que ofrecemos"
            descripcion="Acompañamos a empresas y emprendedores en todo el ciclo de sus sistemas: desde el soporte diario hasta el desarrollo de nuevas soluciones."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            <ServiceCard
              icon={<Wrench size={20} />}
              titulo="Soporte técnico integral"
              descripcion="Mantenimiento preventivo y correctivo de equipos, redes y sistemas. Atendemos en taller o en tus instalaciones."
              items={[
                'Diagnóstico especializado de fallas',
                'Configuración y endurecimiento de equipos',
                'Soporte remoto y en sitio',
              ]}
            />
            <ServiceCard
              icon={<Code2 size={20} />}
              titulo="Desarrollo de software"
              descripcion="Construimos soluciones a medida que se conectan con tu operación: paneles internos, automatizaciones y reportes."
              items={[
                'Aplicaciones web y paneles administrativos',
                'Integraciones con sistemas existentes',
                'Reportes técnicos y flujos personalizados',
              ]}
              destacado
            />
            <ServiceCard
              icon={<Network size={20} />}
              titulo="Ciberseguridad y redes"
              descripcion="Protegemos la infraestructura de tu negocio con buenas prácticas, segmentación y monitoreo de eventos clave."
              items={[
                'Revisión y endurecimiento de redes',
                'Políticas básicas de ciberseguridad',
                'Acompañamiento en continuidad del negocio',
              ]}
            />
          </div>
        </section>

        {/* === Proceso === */}
        <section id="proceso" className="mt-20 sm:mt-24 lg:mt-28">
          <SectionHeader
            tag="Nuestro proceso"
            titulo="Cómo trabajamos"
            descripcion="Cada servicio queda documentado y claro tanto para tu equipo interno como para el cliente final."
          />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Línea conectora horizontal en desktop */}
            <div className="hidden lg:block absolute top-9 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent" aria-hidden="true" />
            {[
              { paso: '01', titulo: 'Solicitud', texto: 'Recibimos tu requerimiento desde la web, teléfono o canales acordados.' },
              { paso: '02', titulo: 'Diagnóstico', texto: 'Un técnico evalúa el equipo o sistema y registra un diagnóstico claro.' },
              { paso: '03', titulo: 'Trabajo', texto: 'Ejecutamos el servicio acordado, documentando repuestos y actividades.' },
              { paso: '04', titulo: 'Reporte', texto: 'Entregamos un informe técnico y, si aplica, conectamos con facturación.' },
            ].map((step) => (
              <div key={step.paso} className="relative bg-slate-900/60 border border-slate-700/60 rounded-2xl p-5 sm:p-6 backdrop-blur hover:border-primary-500/50 hover:-translate-y-1 transition-all duration-300">
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary-500/40 mb-4">
                  {step.paso}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5">{step.titulo}</h3>
                <p className="text-sm text-primary-100/80 leading-relaxed">{step.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === Beneficios cliente final === */}
        <section className="mt-20 sm:mt-24 lg:mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-primary-100 backdrop-blur mb-4">
                <Users size={12} className="text-primary-300" />
                Para tus clientes
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Una experiencia clara, sin fricciones.
              </h2>
              <p className="text-primary-100/90 mb-6 text-base sm:text-lg leading-relaxed">
                Tus usuarios finales pueden solicitar servicio, consultar el estado y recibir
                información técnica sin perder tiempo en llamadas.
              </p>
              <ul className="space-y-4">
                {[
                  { titulo: 'Solicitud en línea', texto: 'Formulario público para registrar solicitudes con datos clave del equipo o proyecto.' },
                  { titulo: 'Seguimiento por código', texto: 'Con un solo código, tus clientes ven estado, avances y reportes técnicos publicados.' },
                  { titulo: 'Comunicación ordenada', texto: 'Menos llamadas perdidas y más información estructurada para tu equipo.' },
                ].map((b) => (
                  <li key={b.titulo} className="flex gap-3">
                    <span className="mt-1 w-7 h-7 rounded-xl bg-primary-500/20 ring-1 ring-primary-400/30 flex items-center justify-center text-primary-200 shrink-0">
                      <CheckCircle2 size={14} />
                    </span>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-white">{b.titulo}</p>
                      <p className="text-sm text-primary-100/80 leading-relaxed">{b.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mockup card */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/10 rounded-3xl blur-3xl" />
              <div className="relative bg-slate-950/80 border border-slate-700/80 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs text-primary-100/60 font-mono">/seguimiento</span>
                </div>

                <div className="bg-white rounded-2xl p-5 sm:p-6 text-slate-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Código de servicio</p>
                      <p className="font-mono font-bold text-sm">SRV-20260125-00284</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      🔍 En diagnóstico
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Progreso</span>
                      <span className="font-semibold text-slate-900">30%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 w-[30%]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <p className="text-slate-500">Tipo</p>
                      <p className="font-semibold">🔧 Taller</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Técnico</p>
                      <p className="font-semibold">Asignado</p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-primary-100/70 text-center">
                  Vista pública de seguimiento — sin login
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* === FAQ === */}
        <section id="faq" className="mt-20 sm:mt-24 lg:mt-28">
          <SectionHeader
            tag="Preguntas frecuentes"
            titulo="Resolvemos tus dudas"
            descripcion="Algunas respuestas rápidas que suelen tener nuestros clientes antes de solicitar un servicio técnico."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: '¿Atienden tanto empresas como personas naturales?',
                a: 'Sí. Trabajamos con empresas, pymes y usuarios individuales. Adaptamos el tipo de servicio y la formalidad del informe técnico según el contexto.',
              },
              {
                q: '¿Cómo se agenda una visita en campo?',
                a: 'Puedes usar el formulario de solicitud y elegir la opción de servicio en campo. Revisamos disponibilidad y confirmamos contigo por los canales definidos.',
              },
              {
                q: '¿Recibo siempre un informe técnico?',
                a: 'Para servicios que lo requieren, generamos un informe con diagnóstico, trabajo realizado, repuestos y recomendaciones. Todo queda documentado.',
              },
              {
                q: '¿Pueden apoyar desarrollos de software ya iniciados?',
                a: 'Podemos evaluar tu situación actual, proponer mejoras y acompañarte en la evolución de tus sistemas existentes.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-700/70 rounded-2xl p-5 sm:p-6 backdrop-blur hover:border-primary-500/40 transition-colors">
                <p className="text-sm sm:text-base font-semibold text-white mb-2">{item.q}</p>
                <p className="text-sm text-primary-100/80 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === CTA final === */}
        <section className="mt-20 sm:mt-24 lg:mt-28">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-14 border border-primary-400/30 shadow-2xl">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight leading-tight">
                  ¿Listo para reportar un problema o iniciar un proyecto?
                </h2>
                <p className="text-primary-100 text-sm sm:text-base">
                  Solicita un servicio ahora mismo o, si ya tienes un código, revisa el estado de tu servicio.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                <Link
                  to="/solicitar-servicio"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-primary-700 text-sm sm:text-base font-semibold shadow-xl hover:-translate-y-0.5 transition-transform"
                >
                  Solicitar servicio
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/seguimiento"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/30 bg-white/10 text-white text-sm sm:text-base font-semibold backdrop-blur hover:bg-white/20 transition-colors"
                >
                  Seguir mi servicio
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* === Footer === */}
        <footer className="mt-16 sm:mt-20 pt-8 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-primary-100/70">
          <p>© 2026 Arnol Caicedo · Soluciones en tecnología</p>
          <div className="flex items-center gap-5">
            <Link to="/seguimiento" className="hover:text-white transition-colors">Seguimiento</Link>
            <Link to="/solicitar-servicio" className="hover:text-white transition-colors">Solicitar servicio</Link>
            <Link to="/login" className="hover:text-white transition-colors">Iniciar sesión</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

function HeroCard({ tone = 'light', icon, tag, text, offset = '', duration = '6s' }) {
  const isDark = tone === 'dark'
  return (
    <div
      className={`card border shadow-2xl ${offset} ${
        isDark
          ? 'bg-slate-900/95 border-slate-700 text-slate-50'
          : 'bg-white/95 backdrop-blur-xl border-white/40'
      }`}
      style={{ animation: `float ${duration} ease-in-out infinite` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          isDark ? 'bg-slate-800 text-primary-300' : 'bg-primary-600/10 text-primary-500'
        }`}>
          {icon}
        </span>
        <p className={`text-xs font-semibold uppercase tracking-wider ${
          isDark ? 'text-primary-200' : 'text-slate-700'
        }`}>
          {tag}
        </p>
      </div>
      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
        {text}
      </p>
    </div>
  )
}

function Stat({ icon, valor, texto }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary-500/15 ring-1 ring-primary-400/30 text-primary-300 flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div>
        <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{valor}</p>
        <p className="text-xs sm:text-sm text-primary-100/80">{texto}</p>
      </div>
    </div>
  )
}

function SectionHeader({ tag, titulo, descripcion }) {
  return (
    <div className="max-w-2xl mb-8 sm:mb-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-primary-100 backdrop-blur mb-3">
        <Sparkles size={12} className="text-primary-300" />
        {tag}
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight leading-tight">
        {titulo}
      </h2>
      <p className="text-primary-100/90 text-sm sm:text-base leading-relaxed">{descripcion}</p>
    </div>
  )
}

function ServiceCard({ icon, titulo, descripcion, items, destacado = false }) {
  return (
    <div
      className={`relative rounded-2xl p-6 sm:p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 ${
        destacado
          ? 'bg-gradient-to-br from-primary-600/20 via-slate-900/70 to-slate-900/70 border border-primary-400/40 shadow-xl shadow-primary-500/10 hover:border-primary-400/70'
          : 'bg-slate-900/60 border border-slate-700/70 hover:border-primary-500/50'
      }`}
    >
      {destacado && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-500/20 text-primary-200 text-[10px] font-semibold ring-1 ring-primary-400/30 uppercase tracking-wider">
          Destacado
        </span>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-primary-500/15 ring-1 ring-primary-400/30 text-primary-300 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white">{titulo}</h3>
      </div>
      <p className="text-primary-100/85 text-sm leading-relaxed mb-4">{descripcion}</p>
      <ul className="space-y-2 text-xs sm:text-sm text-primary-100/80">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-primary-300 mt-0.5 shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
