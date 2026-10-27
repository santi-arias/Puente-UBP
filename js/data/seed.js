// Datos ficticios iniciales y cuentas de prueba.

const SEED_VERSION = 4;

const ROLES = {
  est: { label: 'Estudiante' },
  egr: { label: 'Egresado/a' },
  adm: { label: 'Centro de Graduados' },
};

// Cuentas iniciales (contraseña de ambas: alumno/egresado). hash = SHA-256 de `${salt}:${contraseña}`.
const SEED_USERS = [
  { user: 'alumno', role: 'est', pid: 'est-1', email: 'alumnoubp@ubp.edu.ar', salt: 'alumno', hash: '66fd2a5bfb0d16e7c746f79fa17c2964492d5f6f6b00fd0b6646424e4ca1f916' },
  { user: 'egresado', role: 'egr', pid: 6, email: 'egresado@ubp.edu.ar', salt: 'egresado', hash: '804df31803ec87049704b3166c4efe1b9dfb1a941790eefa4fd773c74f88fd9c' },
];

function student(id, nombre, email, car, anio, extra = {}) {
  return { id, nombre, email, car, anio, bio: '', intereses: [], cv: null, linkedin: { url: '', linked: false }, ...extra };
}

function mentor(id, n, car, rol, lug, t, extra = {}) {
  return {
    id, n, car, rol, lug, t,
    alcance: [], formatos: [0], bio: '', on: 1, us: 0,
    avail: { count: 1, unit: 'semana', bands: ['1-noc', '3-tar'] },
    cv: null, linkedin: { url: '', linked: false },
    ...extra,
  };
}

function welcomeMessage() {
  return { from: 'ubp', text: '¡Hola! Este es tu canal directo con el Centro de Graduados. Escribinos cualquier duda sobre la plataforma o tus mentorías.', at: '09:00' };
}

function seedState() {
  return {
    version: SEED_VERSION,
    session: null,
    view: 'home',
    draft: null,
    err: '',
    nid: 105,
    users: clone(SEED_USERS),
    students: [
      student('est-1', 'Martina Gómez', 'martina.gomez@alumnos.ubp.example', 'Publicidad', '3.º año', {
        bio: 'Me interesa la planificación estratégica y el trabajo con marcas.',
        intereses: [0, 5],
      }),
    ],
    mentors: [
      mentor(1, 'Marcos Ruiz', 'Comunicación Audiovisual', 'Director de productora', 'Córdoba', [0, 2, 3]),
      mentor(2, 'Lucía Paz', 'Contador Público', 'Auditora senior', 'Buenos Aires', [1, 2, 4], { us: 1, avail: { count: 2, unit: 'semana', bands: ['0-noc', '2-noc'] } }),
      mentor(3, 'Andrés Soto', 'Gestión Empresarial', 'Consultor', 'Mendoza', [0, 4, 3, 7]),
      mentor(4, 'Carla Medina', 'Abogacía', 'Abogada en estudio jurídico', 'Rosario', [0, 1, 2], { us: 1 }),
      mentor(5, 'Julián Vega', 'Turismo', 'Gerente de hotel', 'Salta', [3, 0], { us: 1, avail: { count: 2, unit: 'mes', bands: ['5-man'] } }),
      mentor(6, 'Sofía Ferraro', 'Publicidad', 'Planner en agencia', 'Madrid, España', [1, 3, 0, 5], {
        us: 1,
        bio: 'Me especializo en estrategia, campañas y crecimiento de marcas.',
        alcance: ['Marketing', 'Diseño Gráfico'],
        formatos: [0, 1],
        avail: { count: 2, unit: 'semana', bands: ['0-noc', '2-noc', '4-tar'] },
      }),
      mentor(7, 'Ignacio Bruno', 'Relaciones Internacionales', 'Analista de comercio exterior', 'Buenos Aires', [0, 3, 6]),
    ],
    reqs: [
      { id: 101, alId: 'est-2', al: 'Tomás Herrera', car: 'Contador Público', needs: [2], ctx: 'Tengo una entrevista para una pasantía en una consultora y quiero practicar.', disp: 'Lun a jue por la tarde', period: 1, fmt: 0, st: 'pres', m: 2, slot: null, ex: [], cv: null },
      { id: 102, alId: 'est-3', al: 'Camila Ríos', car: 'Turismo', needs: [3], ctx: 'Quiero entender cómo es el día a día en hotelería.', disp: 'Sábados por la mañana', period: 2, fmt: 0, st: 'conf', m: 5, slot: 'Sáb 24/10 · 09:00', ex: [], cv: null },
      { id: 103, alId: 'est-4', al: 'Valentina Ortiz', car: 'Publicidad', needs: [1, 5], ctx: 'Estoy armando mi portfolio para postularme a agencias y me gustaría una mirada externa.', disp: 'Lunes y miércoles a la noche', period: 2, fmt: 0, st: 'pres', m: 6, slot: null, ex: [], cv: null },
      { id: 104, alId: 'est-1', al: 'Martina Gómez', car: 'Publicidad', needs: [0, 3], ctx: 'Quiero entender qué áreas existen dentro de una agencia.', disp: 'Martes y jueves por la tarde', period: 2, fmt: 0, st: 'conf', m: 6, slot: 'Jue 29/10 · 19:00', ex: [], cv: null },
    ],
    support: {}, // Un hilo por usuario, se crea al entrar a Soporte.
    supportDraft: { topic: 0, text: '' },
  };
}
