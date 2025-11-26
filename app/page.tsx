import CountdownTimer from "./components/CountdownTimer";
import ScrollAnimations from "./components/ScrollAnimations";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <ScrollAnimations />

      {/* BARRA SUPERIOR */}
      <div className="top-bar">
        <div className="top-info">
          <span>
            <i className="fas fa-calendar-alt"></i> 30 Dic - 03 Ene
          </span>
          <span>
            <i className="fas fa-map-marker-alt"></i> Campel, Arequipa
          </span>
          <span>
            <i className="fab fa-whatsapp"></i> +51 999 888 777
          </span>
        </div>
        <div className="top-social">
          <a href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#">
            <i className="fab fa-tiktok"></i>
          </a>
          <a href="#">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>

      {/* HEADER / NAV */}
      <header>
        <div className="navbar">
          <a href="#" className="logo">
            <Image
              src="/RADICAL-logotipo.png"
              alt="Radical Logo"
              width={150}
              height={50}
              className="h-10 w-auto object-contain"
            />
          </a>

          <nav className="nav-links">
            <a href="#" className="active">
              Inicio
            </a>
            <a href="#info-general">Información</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#speakers">Invitados</a>
          </nav>

          <a href="#" className="btn-register">
            Inscribirme <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            ¡Es tiempo <br /> <span>De volver!</span>
          </h1>

          <p className="verse">
            &quot;Deje el impío su camino, y el hombre inicuo sus pensamientos,
            y vuélvase a Jehová, el cual tendrá de él misericordia, y al Dios
            nuestro, el cual será amplio en perdonar.&quot; <br /> - Isaías 55:2
          </p>

          {/* CUENTA REGRESIVA */}
          <div className="countdown-container" id="countdown">
            <CountdownTimer />
          </div>

          <div className="cta-group">
            <a href="#info-general" className="btn-main btn-white">
              Ver Detalles
            </a>
            <a href="#" className="btn-main btn-outline">
              <i className="fas fa-play"></i> Ver Video
            </a>
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: INFORMACIÓN (OVERLAY ESTILO DASHBOARD) */}
      <div className="info-section-wrapper" id="info-general">
        <div className="info-grid reveal">
          {/* Fechas */}
          <div className="info-card">
            <div className="info-icon">
              <i className="far fa-calendar-check"></i>
            </div>
            <div className="info-label">Fechas</div>
            <div className="info-value">30 Dic - 03 Ene</div>
            <div
              style={{ fontSize: "0.8rem", color: "#777", marginTop: "5px" }}
            >
              4 Días inolvidables
            </div>
          </div>

          {/* Ubicación */}
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <div className="info-label">Ubicación</div>
            <div className="info-value">Campel</div>
            <div
              style={{ fontSize: "0.8rem", color: "#777", marginTop: "5px" }}
            >
              Arequipa, Perú
            </div>
          </div>

          {/* Edades */}
          <div className="info-card">
            <div className="info-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <div className="info-label">Edades</div>
            <div className="info-value">17 Años +</div>
            <div
              style={{ fontSize: "0.8rem", color: "#777", marginTop: "5px" }}
            >
              Cupos limitados
            </div>
          </div>

          {/* Costo (MODIFICADO CON PROMOCIÓN) */}
          <div
            className="info-card"
            style={{ position: "relative", overflow: "visible" }}
          >
            <div
              style={{
                position: "absolute",
                top: "-15px",
                right: "10px",
                background: "var(--accent)",
                color: "white",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.7rem",
                fontWeight: 700,
                boxShadow: "0 4px 10px rgba(255, 0, 85, 0.5)",
              }}
            >
              PROMO FLASH
            </div>
            <div className="info-icon" style={{ color: "var(--accent)" }}>
              <i className="fas fa-ticket-alt"></i>
            </div>
            <div className="info-label">Inversión</div>
            <div className="info-value price">S/ 150.00</div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#bbb",
                marginTop: "5px",
                lineHeight: 1.4,
              }}
            >
              Separa con S/ 50 antes del 15 Dic
              <br />
              <span
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.5,
                  textDecoration: "line-through",
                }}
              >
                Regular: S/ 190
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN EXPERIENCIA */}
      <section className="section reveal" id="experiencia">
        <h2 className="section-title">
          La Experiencia <span>Radical</span>
        </h2>

        <div className="cards-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-guitar"></i>
            </div>
            <h3>Worship Night</h3>
            <p>
              Noches inolvidables de adoración bajo las estrellas. Bandas
              invitadas y momentos profundos de conexión vertical.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-book-open"></i>
            </div>
            <h3>Plenarias</h3>
            <p>
              Mensajes poderosos de oradores internacionales que desafiarán tu
              fe y te impulsarán a vivir por Cristo.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-fire-alt"></i>
            </div>
            <h3>Fogatas</h3>
            <p>
              Momentos acústicos y testimonios alrededor del fuego, creando
              memorias que durarán toda la vida.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-running"></i>
            </div>
            <h3>Extreme Games</h3>
            <p>
              Dinámicas de equipo, competencias extremas en el lodo y deportes
              para liberar energía.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN SPEAKERS */}
      <section
        className="section reveal"
        id="speakers"
        style={{ background: "#0f0f0f" }}
      >
        <h2 className="section-title">
          Nuestros <span>Invitados</span>
        </h2>

        <div className="speakers-grid">
          {/* Speaker 1 */}
          <div className="speaker-card">
            <Image
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Speaker 1"
              className="speaker-img"
              width={800}
              height={1067}
            />
            <div className="speaker-overlay">
              <div className="speaker-name">David Torres</div>
              <div className="speaker-role">Predicador Principal</div>
            </div>
          </div>
          {/* Speaker 2 */}
          <div className="speaker-card">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Speaker 2"
              className="speaker-img"
              width={800}
              height={1067}
            />
            <div className="speaker-overlay">
              <div className="speaker-name">Sarah Méndez</div>
              <div className="speaker-role">Banda Radical Worship</div>
            </div>
          </div>
          {/* Speaker 3 */}
          <div className="speaker-card">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Speaker 3"
              className="speaker-img"
              width={800}
              height={1067}
            />
            <div className="speaker-overlay">
              <div className="speaker-name">Juan Pérez</div>
              <div className="speaker-role">Pastor de Jóvenes</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <div className="flex justify-between items-center w-full mb-6">
              <Image
                src="/RADICAL-logotipo.png"
                alt="Radical"
                width={140}
                height={50}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
              <Image
                src="/IELP-logo.png"
                alt="IELP"
                width={60}
                height={60}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="footer-desc">
              Un movimiento de jóvenes apasionados por Jesús, dispuestos a
              transformar su entorno y vivir una vida sin límites.
            </p>
            <div className="top-social" style={{ marginLeft: "-15px" }}>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li>
                <a href="#">Inicio</a>
              </li>
              <li>
                <a href="#">Sobre Nosotros</a>
              </li>
              <li>
                <a href="#">Testimonios</a>
              </li>
              <li>
                <a href="#">Preguntas Frecuentes</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href="#">
                  <i className="fas fa-envelope"></i> info@radicalcamp.com
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-whatsapp"></i> +51 987 654 321
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-map-marker-alt"></i> Arequipa, Perú
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          &copy; 2026 Campamento Radical. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}
