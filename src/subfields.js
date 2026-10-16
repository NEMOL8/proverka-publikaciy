/* ===== Разделы науки OpenAlex (subfield) по-русски =====
   У каждой темы OpenAlex (их около 4500) есть раздел науки — subfield, их около 250.
   Сами темы не переводятся: названия узкие и длинные, перевод ненадёжен; переводится только раздел.
   Справочник составлен один раз вручную, ИИ на странице не используется — его можно проверить и поправить.
   Раздела нет в справочнике — показывается английское название как есть. */
const SUBFIELD_RU = {
  /* Сельское хозяйство и биология */
  'Agronomy and Crop Science': 'Агрономия и растениеводство', 'Animal Science and Zoology': 'Зоотехния и зоология', 'Aquatic Science': 'Гидробиология',
  'Ecology, Evolution, Behavior and Systematics': 'Экология, эволюция и систематика', 'Food Science': 'Пищевая наука', 'Forestry': 'Лесное хозяйство',
  'Horticulture': 'Садоводство', 'Insect Science': 'Энтомология', 'Plant Science': 'Физиология и биология растений', 'Soil Science': 'Почвоведение',
  'Agricultural and Biological Sciences (miscellaneous)': 'Сельское хозяйство и биология (прочее)',
  /* Искусство и гуманитарные науки */
  'Archeology': 'Археология', 'Classics': 'Классическая филология', 'Conservation': 'Сохранение наследия', 'History': 'История',
  'Language and Linguistics': 'Языкознание', 'Literature and Literary Theory': 'Литературоведение', 'Music': 'Музыковедение', 'Philosophy': 'Философия',
  'Religious Studies': 'Религиоведение', 'Visual Arts and Performing Arts': 'Изобразительное и исполнительское искусство',
  'History and Philosophy of Science': 'История и философия науки', 'Arts and Humanities (miscellaneous)': 'Искусство и гуманитарные науки (прочее)',
  /* Биохимия, генетика и молекулярная биология */
  'Aging': 'Геронтология', 'Biochemistry': 'Биохимия', 'Biophysics': 'Биофизика', 'Biotechnology': 'Биотехнология', 'Cancer Research': 'Онкологические исследования',
  'Cell Biology': 'Клеточная биология', 'Clinical Biochemistry': 'Клиническая биохимия', 'Developmental Biology': 'Биология развития', 'Endocrinology': 'Эндокринология',
  'Genetics': 'Генетика', 'Molecular Biology': 'Молекулярная биология', 'Molecular Medicine': 'Молекулярная медицина', 'Physiology': 'Физиология',
  'Structural Biology': 'Структурная биология', 'Biochemistry, Genetics and Molecular Biology (miscellaneous)': 'Биохимия и молекулярная биология (прочее)',
  /* Экономика предприятия и управление */
  'Accounting': 'Бухгалтерский учёт', 'Business and International Management': 'Бизнес и международный менеджмент', 'Industrial Relations': 'Трудовые отношения',
  'Management Information Systems': 'Информационные системы управления', 'Management of Technology and Innovation': 'Управление технологиями и инновациями',
  'Marketing': 'Маркетинг', 'Organizational Behavior and Human Resource Management': 'Организационное поведение и управление персоналом',
  'Strategy and Management': 'Стратегия и управление', 'Tourism, Leisure and Hospitality Management': 'Туризм и гостеприимство',
  'Business, Management and Accounting (miscellaneous)': 'Менеджмент и учёт (прочее)',
  /* Химическая технология */
  'Bioengineering': 'Биоинженерия', 'Catalysis': 'Катализ', 'Chemical Health and Safety': 'Химическая безопасность',
  'Colloid and Surface Chemistry': 'Коллоидная химия и химия поверхности', 'Filtration and Separation': 'Фильтрация и разделение',
  'Fluid Flow and Transfer Processes': 'Гидродинамика и процессы переноса', 'Process Chemistry and Technology': 'Химическая технология процессов',
  'Chemical Engineering (miscellaneous)': 'Химическая технология (прочее)',
  /* Химия */
  'Analytical Chemistry': 'Аналитическая химия', 'Electrochemistry': 'Электрохимия', 'Inorganic Chemistry': 'Неорганическая химия',
  'Organic Chemistry': 'Органическая химия', 'Physical and Theoretical Chemistry': 'Физическая и теоретическая химия', 'Spectroscopy': 'Спектроскопия',
  'Chemistry (miscellaneous)': 'Химия (прочее)',
  /* Информатика */
  'Artificial Intelligence': 'Искусственный интеллект', 'Computational Theory and Mathematics': 'Теория вычислений',
  'Computer Graphics and Computer-Aided Design': 'Компьютерная графика и САПР', 'Computer Networks and Communications': 'Компьютерные сети и связь',
  'Computer Science Applications': 'Прикладная информатика', 'Computer Vision and Pattern Recognition': 'Компьютерное зрение и распознавание образов',
  'Hardware and Architecture': 'Архитектура вычислительных систем', 'Human-Computer Interaction': 'Человеко-машинное взаимодействие',
  'Information Systems': 'Информационные системы', 'Signal Processing': 'Обработка сигналов', 'Software': 'Программная инженерия',
  'Computer Science (miscellaneous)': 'Информатика (прочее)',
  /* Теория принятия решений */
  'Information Systems and Management': 'Информационные системы и управление', 'Management Science and Operations Research': 'Исследование операций',
  'Statistics, Probability and Uncertainty': 'Статистика и теория вероятностей', 'Decision Sciences (miscellaneous)': 'Теория принятия решений (прочее)',
  /* Стоматология */
  'Dental Assisting': 'Ассистирование в стоматологии', 'Dental Hygiene': 'Гигиена полости рта', 'Oral Surgery': 'Челюстно-лицевая хирургия',
  'Orthodontics': 'Ортодонтия', 'Periodontics': 'Пародонтология', 'Dentistry (miscellaneous)': 'Стоматология (прочее)',
  /* Науки о Земле */
  'Atmospheric Science': 'Физика атмосферы', 'Computers in Earth Sciences': 'Вычислительные методы в науках о Земле', 'Earth-Surface Processes': 'Процессы на поверхности Земли',
  'Economic Geology': 'Геология месторождений', 'Geochemistry and Petrology': 'Геохимия и петрология', 'Geology': 'Геология', 'Geophysics': 'Геофизика',
  'Geotechnical Engineering and Engineering Geology': 'Геотехника и инженерная геология', 'Oceanography': 'Океанология', 'Paleontology': 'Палеонтология',
  'Space and Planetary Science': 'Планетология и космические исследования', 'Stratigraphy': 'Стратиграфия',
  'Earth and Planetary Sciences (miscellaneous)': 'Науки о Земле (прочее)',
  /* Экономика и финансы */
  'Economics and Econometrics': 'Экономика и эконометрика', 'Finance': 'Финансы', 'Economics, Econometrics and Finance (miscellaneous)': 'Экономика и финансы (прочее)',
  /* Энергетика */
  'Energy Engineering and Power Technology': 'Энергетика и энергетические технологии', 'Fuel Technology': 'Технология топлива',
  'Nuclear Energy and Engineering': 'Ядерная энергетика', 'Renewable Energy, Sustainability and the Environment': 'Возобновляемая энергетика и устойчивое развитие',
  'Energy (miscellaneous)': 'Энергетика (прочее)',
  /* Техника и технологии */
  'Aerospace Engineering': 'Авиационная и ракетно-космическая техника', 'Architecture': 'Архитектура', 'Automotive Engineering': 'Автомобильная техника',
  'Biomedical Engineering': 'Биомедицинская инженерия', 'Building and Construction': 'Строительство', 'Civil and Structural Engineering': 'Строительные конструкции',
  'Computational Mechanics': 'Вычислительная механика', 'Control and Systems Engineering': 'Управление и системная инженерия',
  'Electrical and Electronic Engineering': 'Электротехника и электроника', 'Industrial and Manufacturing Engineering': 'Технология машиностроения',
  'Mechanical Engineering': 'Машиностроение', 'Mechanics of Materials': 'Механика материалов', 'Media Technology': 'Медиатехнологии',
  'Ocean Engineering': 'Морская техника', 'Safety, Risk, Reliability and Quality': 'Надёжность, риски и качество', 'Engineering (miscellaneous)': 'Техника и технологии (прочее)',
  /* Экология и охрана окружающей среды */
  'Ecological Modeling': 'Экологическое моделирование', 'Ecology': 'Экология', 'Environmental Chemistry': 'Химия окружающей среды',
  'Environmental Engineering': 'Инженерная экология', 'Global and Planetary Change': 'Глобальные изменения', 'Health, Toxicology and Mutagenesis': 'Токсикология и мутагенез',
  'Management, Monitoring, Policy and Law': 'Экологический мониторинг, политика и право', 'Nature and Landscape Conservation': 'Охрана природы и ландшафтов',
  'Pollution': 'Загрязнение окружающей среды', 'Waste Management and Disposal': 'Обращение с отходами', 'Water Science and Technology': 'Водные технологии',
  'Environmental Science (miscellaneous)': 'Науки об окружающей среде (прочее)',
  /* Иммунология и микробиология */
  'Applied Microbiology and Biotechnology': 'Прикладная микробиология и биотехнология', 'Immunology': 'Иммунология', 'Microbiology': 'Микробиология',
  'Parasitology': 'Паразитология', 'Virology': 'Вирусология', 'Immunology and Microbiology (miscellaneous)': 'Иммунология и микробиология (прочее)',
  /* Материаловедение */
  'Biomaterials': 'Биоматериалы', 'Ceramics and Composites': 'Керамика и композиты', 'Electronic, Optical and Magnetic Materials': 'Электронные, оптические и магнитные материалы',
  'Materials Chemistry': 'Химия материалов', 'Metals and Alloys': 'Металлы и сплавы', 'Polymers and Plastics': 'Полимеры и пластмассы',
  'Surfaces, Coatings and Films': 'Поверхности, покрытия и плёнки', 'Nanoscience and Nanotechnology': 'Нанонаука и нанотехнологии',
  'Materials Science (miscellaneous)': 'Материаловедение (прочее)',
  /* Математика */
  'Algebra and Number Theory': 'Алгебра и теория чисел', 'Analysis': 'Математический анализ', 'Applied Mathematics': 'Прикладная математика',
  'Computational Mathematics': 'Вычислительная математика', 'Control and Optimization': 'Управление и оптимизация',
  'Discrete Mathematics and Combinatorics': 'Дискретная математика и комбинаторика', 'Geometry and Topology': 'Геометрия и топология', 'Logic': 'Математическая логика',
  'Mathematical Physics': 'Математическая физика', 'Modeling and Simulation': 'Моделирование', 'Numerical Analysis': 'Численные методы',
  'Statistics and Probability': 'Статистика и теория вероятностей', 'Theoretical Computer Science': 'Теоретическая информатика', 'Mathematics (miscellaneous)': 'Математика (прочее)',
  /* Медицина */
  'Anatomy': 'Анатомия', 'Anesthesiology and Pain Medicine': 'Анестезиология и лечение боли', 'Cardiology and Cardiovascular Medicine': 'Кардиология',
  'Complementary and Alternative Medicine': 'Комплементарная медицина', 'Critical Care and Intensive Care Medicine': 'Интенсивная терапия', 'Dermatology': 'Дерматология',
  'Drug Guides': 'Справочники лекарственных средств', 'Embryology': 'Эмбриология', 'Emergency Medicine': 'Неотложная медицина',
  'Endocrinology, Diabetes and Metabolism': 'Эндокринология и диабетология', 'Epidemiology': 'Эпидемиология', 'Family Practice': 'Общая врачебная практика',
  'Gastroenterology': 'Гастроэнтерология', 'Genetics (clinical)': 'Клиническая генетика', 'Geriatrics and Gerontology': 'Гериатрия и геронтология',
  'Health Informatics': 'Медицинская информатика', 'Health Policy': 'Политика здравоохранения', 'Hematology': 'Гематология', 'Hepatology': 'Гепатология',
  'Histology': 'Гистология', 'Immunology and Allergy': 'Иммунология и аллергология', 'Infectious Diseases': 'Инфекционные болезни', 'Internal Medicine': 'Терапия',
  'Microbiology (medical)': 'Медицинская микробиология', 'Nephrology': 'Нефрология', 'Neurology (clinical)': 'Клиническая неврология',
  'Obstetrics and Gynecology': 'Акушерство и гинекология', 'Oncology': 'Онкология', 'Ophthalmology': 'Офтальмология',
  'Orthopedics and Sports Medicine': 'Ортопедия и спортивная медицина', 'Otorhinolaryngology': 'Оториноларингология',
  'Pathology and Forensic Medicine': 'Патология и судебная медицина', 'Pediatrics, Perinatology and Child Health': 'Педиатрия и неонатология',
  'Pharmacology (medical)': 'Клиническая фармакология', 'Physiology (medical)': 'Клиническая физиология', 'Psychiatry and Mental Health': 'Психиатрия и психическое здоровье',
  'Public Health, Environmental and Occupational Health': 'Общественное здоровье и гигиена труда', 'Pulmonary and Respiratory Medicine': 'Пульмонология',
  'Radiology, Nuclear Medicine and Imaging': 'Лучевая диагностика и ядерная медицина', 'Rehabilitation': 'Реабилитация', 'Reproductive Medicine': 'Репродуктивная медицина',
  'Rheumatology': 'Ревматология', 'Surgery': 'Хирургия', 'Transplantation': 'Трансплантология', 'Urology': 'Урология', 'Medicine (miscellaneous)': 'Медицина (прочее)',
  /* Нейронауки */
  'Behavioral Neuroscience': 'Поведенческая нейробиология', 'Biological Psychiatry': 'Биологическая психиатрия',
  'Cellular and Molecular Neuroscience': 'Клеточная и молекулярная нейробиология', 'Cognitive Neuroscience': 'Когнитивная нейробиология',
  'Developmental Neuroscience': 'Нейробиология развития', 'Endocrine and Autonomic Systems': 'Эндокринная и вегетативная системы', 'Neurology': 'Неврология',
  'Sensory Systems': 'Сенсорные системы', 'Neuroscience (miscellaneous)': 'Нейронауки (прочее)',
  /* Сестринское дело и здравоохранение */
  'Advanced and Specialized Nursing': 'Специализированный сестринский уход', 'Assessment and Diagnosis': 'Оценка состояния и диагностика',
  'Care Planning': 'Планирование ухода', 'Community and Home Care': 'Патронажный уход', 'Critical Care Nursing': 'Сестринское дело в интенсивной терапии',
  'Emergency Nursing': 'Сестринское дело в неотложной помощи', 'Fundamentals and Skills': 'Основы и навыки ухода', 'Gerontology': 'Геронтологический уход',
  'Issues, Ethics and Legal Aspects': 'Этика и правовые вопросы', 'Leadership and Management': 'Руководство и управление',
  'LPN and LVN': 'Младший сестринский персонал', 'Maternity and Midwifery': 'Акушерское дело', 'Nurse Assisting': 'Помощь медсестре',
  'Nutrition and Dietetics': 'Диетология', 'Oncology (nursing)': 'Сестринское дело в онкологии', 'Pediatrics': 'Педиатрический уход',
  'Pharmacology (nursing)': 'Фармакология в сестринском деле', 'Psychiatric Mental Health': 'Психиатрический уход',
  'Research and Theory': 'Исследования и теория сестринского дела', 'Review and Exam Preparation': 'Подготовка к аттестации',
  'Nursing (miscellaneous)': 'Сестринское дело (прочее)',
  /* Фармакология и фармацевтика */
  'Drug Discovery': 'Разработка лекарств', 'Pharmaceutical Science': 'Фармацевтические науки', 'Pharmacology': 'Фармакология', 'Toxicology': 'Токсикология',
  'Pharmacology, Toxicology and Pharmaceutics (miscellaneous)': 'Фармакология и фармацевтика (прочее)',
  /* Физика и астрономия */
  'Acoustics and Ultrasonics': 'Акустика и ультразвук', 'Astronomy and Astrophysics': 'Астрономия и астрофизика',
  'Atomic and Molecular Physics, and Optics': 'Атомная и молекулярная физика, оптика', 'Condensed Matter Physics': 'Физика конденсированного состояния',
  'Instrumentation': 'Приборостроение и измерения', 'Nuclear and High Energy Physics': 'Ядерная физика и физика высоких энергий', 'Radiation': 'Радиационная физика',
  'Statistical and Nonlinear Physics': 'Статистическая и нелинейная физика', 'Surfaces and Interfaces': 'Физика поверхностей и границ раздела',
  'Physics and Astronomy (miscellaneous)': 'Физика и астрономия (прочее)',
  /* Психология */
  'Applied Psychology': 'Прикладная психология', 'Clinical Psychology': 'Клиническая психология',
  'Developmental and Educational Psychology': 'Возрастная и педагогическая психология', 'Experimental and Cognitive Psychology': 'Экспериментальная и когнитивная психология',
  'Neuropsychology and Physiological Psychology': 'Нейропсихология и психофизиология', 'Social Psychology': 'Социальная психология',
  'Psychology (miscellaneous)': 'Психология (прочее)',
  /* Социальные науки */
  'Anthropology': 'Антропология', 'Communication': 'Коммуникация и медиа', 'Cultural Studies': 'Культурология', 'Demography': 'Демография',
  'Development': 'Исследования развития', 'Education': 'Образование и педагогика', 'Gender Studies': 'Гендерные исследования',
  'Geography, Planning and Development': 'География и территориальное развитие', 'Health (social science)': 'Социология здоровья',
  'Human Factors and Ergonomics': 'Эргономика и человеческий фактор', 'Law': 'Право', 'Library and Information Sciences': 'Библиотековедение и информационные науки',
  'Life-span and Life-course Studies': 'Исследования жизненного пути', 'Linguistics and Language': 'Лингвистика', 'Political Science and International Relations': 'Политология и международные отношения',
  'Public Administration': 'Государственное управление', 'Safety Research': 'Исследования безопасности', 'Sociology and Political Science': 'Социология и политические науки',
  'Transportation': 'Транспорт', 'Urban Studies': 'Городские исследования', 'Social Sciences (miscellaneous)': 'Социальные науки (прочее)',
  /* Ветеринария */
  'Equine': 'Болезни лошадей', 'Food Animals': 'Сельскохозяйственные животные', 'Small Animals': 'Мелкие домашние животные', 'Veterinary (miscellaneous)': 'Ветеринария (прочее)',
  /* Медицинские профессии */
  'Chiropractics': 'Мануальная терапия', 'Complementary and Manual Therapy': 'Мануальная и комплементарная терапия', 'Emergency Medical Services': 'Скорая медицинская помощь',
  'Health Information Management': 'Управление медицинской информацией', 'Medical Assisting and Transcription': 'Медицинское делопроизводство',
  'Medical Laboratory Technology': 'Лабораторная диагностика', 'Medical Terminology': 'Медицинская терминология', 'Occupational Therapy': 'Эрготерапия',
  'Optometry': 'Оптометрия', 'Pharmacy': 'Фармация', 'Physical Therapy, Sports Therapy and Rehabilitation': 'Физиотерапия и спортивная реабилитация',
  'Podiatry': 'Подиатрия', 'Radiological and Ultrasound Technology': 'Лучевая и ультразвуковая техника', 'Respiratory Care': 'Респираторная помощь',
  'Speech and Hearing': 'Логопедия и сурдология', 'Health Professions (miscellaneous)': 'Медицинские профессии (прочее)',
};
/* Раздел по-русски; если его нет в справочнике — английское название как есть */
function subRu(name) { const n = String(name || '').trim(); return SUBFIELD_RU[n] || n; }
if (typeof module !== 'undefined') module.exports = { SUBFIELD_RU, subRu };
