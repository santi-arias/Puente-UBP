// Configuración general y catálogos del prototipo.

const FEATURES = {
  // Desestimado temporalmente. Poner en true para reactivar el panel de estadísticas del Centro de Graduados.
  centroGraduados: false,
};

const STORAGE_KEY = 'puente-ubp:state';

const CAREERS = ['Abogacía', 'Arquitectura', 'Comunicación Audiovisual', 'Contador Público', 'Diseño Gráfico', 'Diseño y Animación Digital', 'Gestión Ambiental', 'Gestión Empresarial', 'Ingeniería Informática', 'Licenciatura en Administración', 'Marketing', 'Publicidad', 'Relaciones Internacionales', 'Turismo', 'Ingeniería en Telecomunicaciones'];

// Necesidades del estudiante y, a la vez, tipos de mentoría que ofrece el egresado (se usan para el matching).
const NEEDS = ['Orientación de carrera', 'Revisar mi CV', 'Simular una entrevista', 'Conocer el rubro', 'Buscar una práctica', 'Armar mi portfolio', 'Networking', 'Emprender un proyecto'];

const PERIODS = ['1 semana', '2 semanas', '3 semanas', '4 semanas'];
const FORMATS = ['Videollamada de 30 min', 'Consulta escrita', 'Encuentro presencial'];
const STUDENT_YEARS = ['1.º año', '2.º año', '3.º año', '4.º año', '5.º año'];

// Frecuencia de sesiones del egresado: de 1 a 5 veces por día, semana o mes.
const SESSION_COUNTS = [1, 2, 3, 4, 5];
const SESSION_UNITS = [
  { k: 'dia', l: 'por día', perMonth: 20 },
  { k: 'semana', l: 'por semana', perMonth: 4 },
  { k: 'mes', l: 'por mes', perMonth: 1 },
];

// Franjas horarias preferenciales (Lunes = 0).
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAYS_LONG = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const TIME_BANDS = [
  { k: 'man', l: 'Mañana', h: '08 a 12 h', start: '09:00' },
  { k: 'med', l: 'Mediodía', h: '12 a 14 h', start: '12:30' },
  { k: 'tar', l: 'Tarde', h: '14 a 18 h', start: '15:00' },
  { k: 'noc', l: 'Noche', h: '18 a 22 h', start: '19:00' },
];

const AFFINITY = { 'Publicidad': 'c', 'Comunicación Audiovisual': 'c', 'Marketing': 'c', 'Diseño Gráfico': 'c', 'Diseño y Animación Digital': 'c', 'Contador Público': 'n', 'Gestión Empresarial': 'n', 'Licenciatura en Administración': 'n', 'Ingeniería Informática': 't', 'Turismo': 't', 'Gestión Ambiental': 'a', 'Arquitectura': 'a', 'Abogacía': 'j', 'Relaciones Internacionales': 'j' };

const FILE_RULES = {
  types: ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'],
  accept: '.pdf,.png,.jpg,.jpeg,.webp',
  maxMB: 10,
  persistMaxBytes: 1024 * 1024, // Archivos más chicos se guardan en el navegador para conservar la vista previa.
};

// Canal de soporte. Datos de ejemplo: reemplazar por los canales reales del Centro de Graduados.
const SUPPORT = {
  team: 'Equipo Puente UBP',
  sla: 'Respondemos en menos de 24 h hábiles',
  email: 'puente@ubp.example',
  whatsapp: '+54 9 351 000-0000',
  hours: 'Lunes a viernes · 9 a 18 h',
  topics: ['Problema técnico', 'Mi mentoría', 'Mi cuenta y perfil', 'Otro'],
  replies: [
    'Gracias por avisarnos. Ya derivamos tu consulta al área técnica y te escribimos por acá apenas tengamos novedades.',
    'Recibimos tu consulta sobre la mentoría. Un integrante del Centro de Graduados la revisa y te responde en este canal.',
    'Gracias. Revisamos los datos de tu cuenta y te confirmamos por acá los cambios.',
    '¡Gracias por escribirnos! Te respondemos por este canal a la brevedad.',
  ],
};
