import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Code2, ShieldCheck, Network, ArrowRightCircle, Menu, X, Sun, Moon } from 'lucide-react'

export default function Landing() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [modoClaro, setModoClaro] = useState(false)

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Fondos y degradados decorativos */}
      <div className="pointer-events-none">
        {/* Banda superior suave para dar algo de luz sin invadir el fondo */}
        <div className="absolute -top-20 left-0 w-full h-56 bg-gradient-to-b from-slate-100/10 via-slate-900/0 to-transparent" />

        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary-500/16 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-primary-600/10 rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 md:py-12">
        {/* Navbar simple */}
        <header className="flex items-center justify-between gap-4 md:gap-8 mb-6 sm:mb-8 md:mb-10">
          {/* Logo suelto, apoyado por el degradado de fondo */}
          <div className="flex items-center">
            <img
              src="/logo-blanco.png"
              alt="Arnol Caicedo - Soluciones en tecnología y ciberseguridad"
              className="w-28 sm:w-36 md:w-44 lg:w-52 h-auto"
            />
          </div>

          {/* Navegación + CTAs */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Nav escritorio */}
            <nav className="hidden md:flex items-center gap-6 text-primary-50 text-sm font-medium">
              <a href="#servicios" className="hover:text-white transition-colors">
                Servicios
              </a>
              <a href="#proceso" className="hover:text-white transition-colors">
                Cómo trabajamos
              </a>
              <a href="#clientes" className="hover:text-white transition-colors">
                Para tus clientes
              </a>
              <Link
                to="/seguimiento"
                className="px-4 py-2 rounded-full border border-white/30 text-primary-50 text-sm hover:bg-white/10 transition"
              >
                Seguimiento de servicio
              </Link>
            </nav>

            {/* Botón iniciar sesión escritorio */}
            <Link
              to="/login"
              className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-white text-primary-700 text-sm font-semibold shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-transform"
            >
              Iniciar sesión
            </Link>

            {/* Botón menú móvil */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/80 text-primary-100 shadow-md"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Abrir menú de navegación"
            >
              {menuAbierto ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Menú móvil desplegable */}
        {menuAbierto && (
          <div className="md:hidden mb-6 rounded-2xl bg-slate-950/90 border border-slate-700/80 p-4 space-y-3">
            <nav className="flex flex-col gap-3 text-primary-50 text-sm">
              <a
                href="#servicios"
                className="hover:text-white transition-colors"
                onClick={() => setMenuAbierto(false)}
              >
                Servicios
              </a>
              <a
                href="#proceso"
                className="hover:text-white transition-colors"
                onClick={() => setMenuAbierto(false)}
              >
                Cómo trabajamos
              </a>
              <a
                href="#clientes"
                className="hover:text-white transition-colors"
                onClick={() => setMenuAbierto(false)}
              >
                Para tus clientes
              </a>
            </nav>
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800 mt-2">
              <Link
                to="/seguimiento"
                className="w-full text-center px-4 py-2 rounded-xl border border-white/20 text-primary-50 text-sm hover:bg-white/10 transition"
                onClick={() => setMenuAbierto(false)}
              >
                Seguimiento de servicio
              </Link>
              <Link
                to="/login"
                className="w-full text-center px-4 py-2.5 rounded-xl bg-white text-primary-700 text-sm font-semibold shadow-md"
                onClick={() => setMenuAbierto(false)}
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        )}

        {/* Hero */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center mt-4">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-primary-50 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
              Soporte técnico, desarrollo de software y ciberseguridad
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Soporte técnico profesional
              <span className="block text-primary-100">
                y soluciones en tecnología y ciberseguridad.
              </span>
            </h1>

            <p className="text-primary-100 text-base md:text-lg max-w-xl">
              Somos una empresa de soporte técnico, desarrollo de software y ciberseguridad.
              Esta plataforma te permite solicitar servicios, hacer seguimiento y recibir reportes
              técnicos claros de todo lo que hacemos con tus equipos y sistemas.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/solicitar-servicio"
                className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-base"
              >
                Solicitar servicio ahora
                <span className="text-lg">↗</span>
              </Link>
              <Link
                to="/seguimiento"
                className="btn-secondary inline-flex items-center gap-2 px-5 py-3 text-base border border-white/30 bg-white/5 text-white hover:bg-white/10"
              >
                Seguir mi servicio
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 text-primary-100 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-200 text-xs">
                  ✓
                </span>
                <span>Soporte técnico para equipos y redes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-100 text-xs">
                  ✓
                </span>
                <span>Desarrollo de software y soluciones a medida</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-100 text-xs">
                  ✓
                </span>
                <span>Soluciones en tecnología y ciberseguridad</span>
              </div>
            </div>
          </div>

          {/* Tarjetas animadas */}
          <div className="relative">
            <div className="absolute -top-8 -right-6 w-32 h-32 bg-primary-500/25 rounded-3xl blur-3xl" />
            <div className="absolute bottom-0 -left-6 w-32 h-32 bg-slate-800/70 rounded-3xl blur-3xl" />

            <div className="relative space-y-4">
              <div className="card bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl translate-y-0 animate-[float_6s_ease-in-out_infinite]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-400">
                    <Wrench size={18} />
                  </span>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Soporte técnico especializado
                  </p>
                </div>
                <p className="text-sm text-slate-700">
                  Mantenimiento, reparaciones y diagnóstico de equipos e infraestructura de TI,
                  con reportes técnicos claros para tu empresa.
                </p>
              </div>

              <div className="card bg-slate-900/95 border border-slate-700 text-slate-50 ml-6 animate-[float_7s_ease-in-out_infinite_reverse]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-primary-300">
                    <Code2 size={18} />
                  </span>
                  <p className="text-xs font-semibold text-primary-200 uppercase tracking-wide">
                    Desarrollo de software
                  </p>
                </div>
                <p className="text-sm text-slate-100">
                  Aplicaciones y automatizaciones que apoyan tus procesos internos:
                  seguimiento de servicios, reportes, facturación y más.
                </p>
              </div>

              <div className="card bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl ml-12 animate-[float_8s_ease-in-out_infinite]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-9 h-9 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-400">
                    <ShieldCheck size={18} />
                  </span>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Ciberseguridad y continuidad
                  </p>
                </div>
                <p className="text-sm text-slate-700">
                  Acompañamos a tu negocio en buenas prácticas de seguridad, respaldo de información
                  y monitoreo para mantener tus operaciones protegidas.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Sección: servicios principales */}
        <section
          id="servicios"
          className="mt-20 md:mt-24 text-primary-50 text-sm"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Servicios que ofrecemos
              </h2>
              <p className="text-primary-100 max-w-2xl">
                Acompañamos a empresas y emprendedores en todo el ciclo de sus sistemas:
                desde el soporte diario hasta el desarrollo de nuevas soluciones.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/70 border border-slate-700/70 rounded-2xl p-6 backdrop-blur hover:border-primary-500/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400">
                  <Wrench size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Soporte técnico integral
                </h3>
              </div>
              <p className="text-primary-100 mb-4">
                Mantenimiento preventivo y correctivo de equipos, redes y
                sistemas. Atendemos en taller o en tus instalaciones.
              </p>
              <ul className="space-y-2 text-xs text-primary-100/90">
                <li>• Diagnóstico especializado de fallas</li>
                <li>• Configuración y endurecimiento de equipos</li>
                <li>• Soporte remoto y en sitio</li>
              </ul>
            </div>

            <div className="bg-slate-900/70 border border-slate-700/70 rounded-2xl p-6 backdrop-blur hover:border-primary-500/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400">
                  <Code2 size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Desarrollo de software
                </h3>
              </div>
              <p className="text-primary-100 mb-4">
                Construimos soluciones a medida que se conectan con tu operación:
                desde paneles internos hasta automatizaciones específicas.
              </p>
              <ul className="space-y-2 text-xs text-primary-100/90">
                <li>• Aplicaciones web y paneles administrativos</li>
                <li>• Integraciones con sistemas existentes</li>
                <li>• Reportes técnicos y flujos personalizados</li>
              </ul>
            </div>

            <div className="bg-slate-900/70 border border-slate-700/70 rounded-2xl p-6 backdrop-blur hover:border-primary-500/60 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-400">
                  <Network size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Ciberseguridad y redes
                </h3>
              </div>
              <p className="text-primary-100 mb-4">
                Protegemos la infraestructura de tu negocio con buenas prácticas,
                segmentación y monitoreo de eventos clave.
              </p>
              <ul className="space-y-2 text-xs text-primary-100/90">
                <li>• Revisión y endurecimiento de redes</li>
                <li>• Políticas básicas de ciberseguridad</li>
                <li>• Acompañamiento en continuidad del negocio</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sección: cómo trabajamos */}
        <section
          id="proceso"
          className="mt-20 md:mt-24 text-primary-50 text-sm"
        >
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Cómo es nuestro proceso de trabajo
            </h2>
            <p className="text-primary-100">
              Buscamos que cada servicio quede documentado y claro tanto para tu
              equipo como para el cliente final.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                paso: '1',
                titulo: 'Solicitud',
                texto:
                  'Recibimos tu requerimiento desde la web, teléfono o canales acordados.',
              },
              {
                paso: '2',
                titulo: 'Diagnóstico',
                texto:
                  'Un técnico evalúa el equipo o sistema y registra un diagnóstico claro.',
              },
              {
                paso: '3',
                titulo: 'Trabajo',
                texto:
                  'Ejecutamos el servicio acordado, documentando repuestos y actividades.',
              },
              {
                paso: '4',
                titulo: 'Reporte técnico',
                texto:
                  'Entregamos un informe técnico y, si aplica, conectamos con facturación.',
              },
            ].map((item, idx) => (
              <div
                key={item.paso}
                className="relative bg-slate-900/70 border border-slate-700/80 rounded-2xl p-5 overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary-500/10 to-slate-900/0 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary-600/30 text-primary-200 flex items-center justify-center text-sm font-semibold mb-3">
                    {item.paso}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    {item.titulo}
                  </h3>
                  <p className="text-xs text-primary-100/90">
                    {item.texto}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: enfoque en el cliente final */}
        <section
          id="clientes"
          className="mt-20 md:mt-24 text-primary-50 text-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Una experiencia clara para tus clientes
              </h2>
              <p className="text-primary-100 mb-5">
                Tus usuarios finales pueden solicitar servicio, consultar el
                estado y recibir información técnica sin perder tiempo en llamadas.
              </p>
              <ul className="space-y-3 text-primary-100">
                <li className="flex gap-3">
                  <span className="mt-1 w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-200 text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Solicitud de servicio en línea
                    </p>
                    <p className="text-xs text-primary-100/90">
                      Formulario público para registrar solicitudes con datos
                      clave del equipo o proyecto.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-200 text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Seguimiento por código
                    </p>
                    <p className="text-xs text-primary-100/90">
                      Con un solo código, tus clientes ven el estado,
                      avances y reportes técnicos publicados.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-200 text-xs">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Comunicación ordenada
                    </p>
                    <p className="text-xs text-primary-100/90">
                      Menos llamadas perdidas y más información
                      estructurada para tu equipo técnico y administrativo.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-6 backdrop-blur animate-[float_7s_ease-in-out_infinite]">
                <p className="text-xs uppercase tracking-wide text-primary-300 mb-2">
                  Pensado para empresas de servicio
                </p>
                <p className="text-sm text-primary-50">
                  Esta plataforma la usamos para gestionar nuestros propios servicios
                  técnicos y reportes. La adaptamos para que tu experiencia como cliente
                  sea transparente y profesional.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary-300 mb-1">24/7</p>
                  <p className="text-xs text-primary-100">
                    Consulta de estado de servicios
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary-300 mb-1">+ Reportes</p>
                  <p className="text-xs text-primary-100">
                    Informes técnicos claros y trazables
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section
          id="faq"
          className="mt-20 md:mt-24 mb-16 text-primary-50 text-sm"
        >
          <div className="max-w-3xl mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Preguntas frecuentes
            </h2>
            <p className="text-primary-100">
              Algunas dudas rápidas que suelen tener nuestros clientes
              antes de solicitar un servicio técnico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-5">
              <p className="text-sm font-semibold text-white mb-1">
                ¿Atienden tanto empresas como personas naturales?
              </p>
              <p className="text-xs text-primary-100">
                Sí. Trabajamos con empresas, pymes y usuarios individuales.
                Adaptamos el tipo de servicio y la formalidad del informe técnico
                según el contexto.
              </p>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-5">
              <p className="text-sm font-semibold text-white mb-1">
                ¿Cómo se agenda una visita en campo?
              </p>
              <p className="text-xs text-primary-100">
                Puedes usar el formulario de solicitud y elegir la opción
                de servicio en campo. Revisamos disponibilidad y confirmamos
                contigo por los canales definidos.
              </p>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-5">
              <p className="text-sm font-semibold text-white mb-1">
                ¿Recibo siempre un informe técnico?
              </p>
              <p className="text-xs text-primary-100">
                Para servicios que lo requieren, generamos un informe técnico
                con diagnóstico, trabajo realizado, repuestos y recomendaciones.
                Así todo queda documentado.
              </p>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-5">
              <p className="text-sm font-semibold text-white mb-1">
                ¿Pueden apoyar desarrollos de software ya iniciados?
              </p>
              <p className="text-xs text-primary-100">
                Podemos evaluar tu situación actual, proponer mejoras y
                acompañarte en la evolución de tus sistemas existentes.
              </p>
            </div>
          </div>

          {/* CTA final */}
          <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/80 border border-slate-700/70 rounded-2xl p-6">
            <div>
              <p className="text-sm font-semibold text-white mb-1">
                ¿Listo para reportar un problema o iniciar un proyecto?
              </p>
              <p className="text-xs text-primary-100">
                Puedes solicitar un servicio ahora mismo o, si ya tienes un
                código, revisar el estado de tu servicio.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/solicitar-servicio"
                className="btn-primary inline-flex items-center gap-2 px-5 py-3 text-sm"
              >
                Solicitar servicio
                <ArrowRightCircle size={16} />
              </Link>
              <Link
                to="/seguimiento"
                className="btn-secondary inline-flex items-center gap-2 px-5 py-3 text-sm border border-slate-600/60 bg-slate-900/40 text-primary-50 hover:bg-slate-800/80"
              >
                Seguir mi servicio
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

