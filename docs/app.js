const ORCID_BUILTIN = "", OA_BUILTIN = "SUElqXUhQuvtt1VFt7031j";
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

/* ===== Проверка публикаций: правила (без сети, без ИИ) ===== */
const VERSION = '0.7.11', VERSION_DATE = '19.10.2026';
/* Что нового — показывается на странице */
const CHANGES = [
  ['0.7.11', '19.10.2026', ['Организация автора — открытое поле рядом с ФИО: по ней выбирается нужный человек среди однофамильцев (совпала у одного с полным именем — выбран сам; у кандидатов пометка «организация совпала»). Сверка организации по каждой статье и фильтр «Организация» убраны; организация в статье показывается просто как факт.',
    'Индекс Хирша — заметной плашкой рядом с именем автора: крупно значение OpenAlex, рядом ссылки Scopus · WoS · РИНЦ.',
    'Снимки eLibrary: перед распознаванием снимок обрабатывается (синий и фиолетовый текст на сером становится чёрным, контраст, резкость), каждая строка читается русской и английской моделью; разбор списка eLibrary по настоящему виду страницы; «В сборнике: …» не попадает в поиск статьи; патенты помечаются «патент — не ищется». Плохо распознанный снимок не вставляется молча — крупное предупреждение и кнопка «Всё равно вставить».',
    'Шапка по брендбуку: графит с сетчатой сферой и красными орбитами, тонкая красная линия снизу; ссылки — бордовые.',
    'Удобство: прошлая проверка сохраняется в браузере («Продолжить прошлую проверку»); кеш ответов Crossref и OpenAlex на 14 дней; «Повторить ненайденные»; прогресс и «Остановить»; «Скачать Excel» и CSV; «Печать / PDF»; Ctrl+V и перетаскивание снимка в любое место; Ctrl+Enter; сортировка кликом по заголовку; отметка «проверено» в строке; причина пометки — короткой фразой.']],
  ['0.7.10', '16.10.2026', ['После «Найти публикации», «Найти автора» и выбора варианта страница сама переходит к результату; под шапкой — строка переходов со счётчиками, внизу справа — кнопка «К вводу».',
    'Основные темы автора показываются по-русски (раздел науки OpenAlex); точное английское название — в подсказке при наведении.',
    'Кнопка «Найти другого автора»: очищает поле и прежний результат, не трогая список публикаций.',
    'Раздел «Несколько авторов» убран — остались список публикаций и автор.',
    'Меньше текста и рамок: короткие подсказки, «Организация для сверки» — в «Дополнительно», индекс Хирша — одной строкой, сводка по квартилям — плашками.',
    'Снимок страницы с сайта (ORCID, Google Scholar, Scopus, eLibrary, Web of Science и других): элементы интерфейса — пагинация, кнопки, «Cited by», баннеры — больше не попадают в текст записи и не портят поиск.',
    'Оформление приведено к брендбуку: шрифт Verdana (замена Circe), прямые углы без скруглений, красный — только в крупных заголовках.']],
  ['0.7.9', '15.10.2026', ['Справочник SCImago — за 2006–2025 годы (был 2021–2025): квартиль и показатель на год публикации и для старых статей. Белого списка до 2023 года не было — у таких статей уровень 2023 года показан справочно.',
    'Поиск статей по списку: лучший вариант выбирается по названию, году, изданию и первому автору (из 10 вариантов вместо 4); если Crossref не нашёл — запасной поиск в OpenAlex; DOI узнаётся и с ошибками распознавания («1O.1016», пробелы); если DOI из списка не найден — поиск по тексту. Для спорных и ненайденных статей — до 3 ближайших вариантов с кнопкой «Это она» и ссылки на поиск в Google Scholar и eLibrary.',
    'Колонка «Показатель» переименована в «Импакт-фактор» (это по-прежнему «цитирований на документ за 2 года» SCImago — подпись под заголовком).',
    'Колонка «Авторы»: сверху крупная пометка «Corresponding — да / нет / в базе не указан».',
    'Если издания нет в SCImago — ссылки, где посмотреть квартиль самому: Scopus Sources (CiteScore), список WoS, JCR. У изданий из SCImago — ссылка на страницу издания в Scopus.',
    'Индекс Хирша Scopus, WoS, РИНЦ и квартиль WoS больше не вписываются вручную: где значение утилита не получает — ссылка на профиль или поиск и пометка «посмотрите сами».',
    'Выбор автора из найденных по ФИО: ФИО кириллицей (если оно есть в OpenAlex), организация на английском и русском, основные темы, ссылки ORCID · Scopus · OpenAlex.',
    'Фильтры — кнопками в два ряда; меньше пояснений и рамок; справка, «Что нового», «Что уходит в интернет» и настройки — одной строкой сверху; ключ OpenAlex спрятан в «Дополнительно».',
    'Сводка по нескольким авторам по умолчанию — за все годы. Из кода удалены остатки старого блока итоговых выводов.']],
  ['0.7.8', '14.10.2026', ['Убраны фирменный шрифт и логотип: страница использует системные шрифты, оформление (цвета, шапка) прежнее.']],
  ['0.7.7', '14.10.2026', ['Квартили не только SCImago: у издания показана индексация по Белому списку (WoS CC, Scopus, RSCI) — если издания нет в SCImago, сразу видно, в какой базе может быть квартиль. Для квартиля WoS (JCR) — ссылки для проверки и поле, чтобы вписать значение (открытого источника нет); вписанное попадает в «Скопировать таблицу».', 'Сайт: кнопки работают сразу, ход загрузки справочников виден в процентах, при сбое — понятное сообщение и кнопка «Повторить»; ошибки страницы показываются наверху.']],
  ['0.7.6', '14.10.2026', ['Подписи сделаны общими, без привязки к конкретным документам: у идентификаторов источник «введено», поле «Организация для сверки».']],
  ['0.7.5', '14.10.2026', ['В блоке «Профили автора» — индекс Хирша по базам: Scopus, Web of Science, РИНЦ — ссылка на профиль, где его видно, и поле, чтобы вписать значение (открытого доступа к этим значениям нет); OpenAlex — свой расчёт, справочно. Вписанные значения попадают в «Скопировать ссылки».']],
  ['0.7.4', '14.10.2026', ['«Проверить связь» опрашивает все базы одновременно и показывает ответы по мере поступления; база, не ответившая за 12 секунд, помечается «не отвечает». Любой запрос к базе теперь ждёт ответа не дольше 20 секунд (раньше зависший сервер мог задерживать работу на минуты).']],
  ['0.7.3', '14.10.2026', ['Встроен ключ OpenAlex: дневной лимит поиска авторов в 10 раз больше (около 1000 поисков по ФИО в день вместо 100). Поле «Ключ OpenAlex» в настройках можно не заполнять; своё значение заменит встроенное только в этом браузере.', 'Убран скрытый блок итоговых выводов: утилита показывает только факты о публикациях и авторах.']],
  ['0.7.2', '14.10.2026', ['Оформление по брендбуку Инконсалт: бордовая шапка с логотипом и сетчатым узором, заголовки заглавными буквами (Circe ExtraBold), тёмные шапки таблиц. Фирменный красный — только тонкой линией под шапкой; цвета пометок не меняются.']],
  ['0.7.1', '14.10.2026', ['Оформление по брендбуку Инконсалт: шрифт Circe, фирменные серый, тёмно-коричневый и бежевый цвета. Логотипа, названия компании и красного нет (правило проекта).']],
  ['0.7', '13.10.2026', ['Блок «Профили автора»: все ссылки на найденного автора (ORCID, Scopus, Web of Science, eLibrary, OpenAlex) с пометкой, откуда взят идентификатор, и ссылки-поиски по ФИО (Google Scholar, ResearchGate, Semantic Scholar и др.); предупреждение, если идентификаторы из разных источников расходятся; «Скопировать ссылки».',
    'Corresponding author у каждой статьи: «да» / «нет» (и кто) / «в базе не указан» — отдельной колонкой в публикациях автора и пометкой в списке.',
    'Фильтры: corresponding author и показатель «от …» (цитирований на документ SCImago на год публикации).',
    'Организация автора в каждой статье и сверка с указанной организацией.',
    'Возможные дубли в списке: одинаковый DOI, одинаковое название, препринт и журнальная версия, тезисы и статья.',
    'Несколько авторов сразу (раздел 3): сводная таблица по исполнителям и публикации каждого.',
    'Сайт: справочники и распознавание загружаются отдельно и кешируются браузером; короткая инструкция; «Что нового»; страница закрыта от поисковиков.']],
  ['0.6', '12.10.2026', ['Поиск автора по всем идентификаторам (ORCID, Scopus ID, ResearcherID через реестр ORCID) и по ФИО кириллицей и латиницей; похожие профили того же автора.']],
  ['0.5', '12.10.2026', ['Два режима: список публикаций и автор. Фильтры по квартилю, Белому списку и годам. Квартиль и уровень — на год публикации и сейчас.']],
];

const ST = { ok: 'ok', check: 'check', no: 'no', unk: 'unk' };
const ST_NAME = { ok: 'подтверждено', check: 'проверьте', no: 'не подтверждено', unk: 'не удалось проверить' };

/* ---------- текст ---------- */
const norm = s => String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ё/g, 'е').replace(/&amp;/g, ' ').replace(/[^a-z0-9а-я]+/g, ' ').trim();
const normIssn = s => String(s || '').toUpperCase().replace(/[^0-9X]/g, '');
const fmtIssn = s => s.length === 8 ? s.slice(0, 4) + '-' + s.slice(4) : s;
const fmtNum = v => v == null ? '' : String(Math.round(v * 100) / 100).replace('.', ',');
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let p = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const c = [i]; let mn = i;
    for (let j = 1; j <= b.length; j++) { c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (c[j] < mn) mn = c[j]; }
    if (mn > max) return max + 1; p = c;
  }
  return p[b.length];
}

/* ---------- справочники ---------- */
let REF = null;
function loadRef(data) {
  const R = { sjYears: data.sjYears, sjYear: data.sjYears[data.sjYears.length - 1], wlDate: data.wlDate, sj: data.sj, wl: data.wl, notes: data.wlNotes, sjIssn: new Map(), wlIssn: new Map(), sjTitle: new Map(), wlTitle: new Map() };
  const put = (m, k, i) => { if (!k) return; const a = m.get(k); if (a) { if (a.indexOf(i) < 0) a.push(i); } else m.set(k, [i]); };
  data.sj.forEach((r, i) => { r[1].split(' ').forEach(x => put(R.sjIssn, x, i)); put(R.sjTitle, norm(r[0]), i); });
  data.wl.forEach((r, i) => { r[1].split(' ').forEach(x => put(R.wlIssn, x, i)); r[0].split(' | ').forEach(t => put(R.wlTitle, norm(t), i)); });
  REF = R; return R;
}
const SJ_TYPE = ['журнал', 'книжная серия', 'труды конференций', 'отраслевой журнал'];
function sjRec(i) {
  const r = REF.sj[i], hist = {}; let last = null;
  REF.sjYears.forEach((y, k) => { const q = r[5 + 2 * k], c = r[6 + 2 * k]; if (q != null || c != null) { hist[y] = { q: q || 0, cpd: c }; last = y; } });
  return { title: r[0], issns: r[1].split(' ').filter(Boolean), type: r[2], cats: r[3], sid: r[4], hist, last, q: hist[last].q, cpd: hist[last].cpd };
}
/* Данные SCImago на год публикации. Если года нет в выгрузках или издания в нём нет — ближайший год, с пометкой. */
function sjAt(sj, year) {
  const ys = Object.keys(sj.hist).map(Number); if (!year) return { y: sj.last, exact: false, why: 'год публикации неизвестен' };
  if (sj.hist[year]) return { y: year, exact: true };
  const y = ys.slice().sort((a, b) => Math.abs(a - year) - Math.abs(b - year) || b - a)[0];
  return { y, exact: false, why: year > REF.sjYear ? `данных SCImago за ${year} год ещё нет` : (year < REF.sjYears[0] ? `выгрузки SCImago за ${year} год нет в справочнике` : `в SCImago за ${year} год издания нет`) };
}
function wlRec(i) {
  const r = REF.wl[i]; const lv = { 2023: r[2], 2025: r[3], 2026: r[4] };
  return { title: r[0], issns: r[1].split(' ').filter(Boolean), levels: lv, state: r[5], notice: r[6] ? REF.notes[r[6] - 1] : '', disc: r[7], wos: !!(r[8] & 1), scopus: !!(r[8] & 2), rsci: !!(r[8] & 4) };
}
/* Поиск издания: сначала по ISSN, затем по точному названию. how: 'issn' | 'title' | 'ambiguous' | null */
function findJournal(issns, title) {
  const out = { sj: null, wl: null, sjHow: null, wlHow: null };
  const by = (mI, mT, rec) => {
    const hit = new Set(); (issns || []).map(normIssn).forEach(x => (mI.get(x) || []).forEach(i => hit.add(i)));
    if (hit.size === 1) return [rec([...hit][0]), 'issn'];
    if (hit.size > 1) return [rec([...hit][0]), 'ambiguous'];
    const t = norm(title); if (!t) return [null, null];
    let a = mT.get(t) || mT.get(t.replace(/^the /, '')) || mT.get(t.replace(/ and /g, ' '));
    if (!a) return [null, null];
    return [rec(a[0]), a.length === 1 ? 'title' : 'ambiguous'];
  };
  [out.sj, out.sjHow] = by(REF.sjIssn, REF.sjTitle, sjRec);
  [out.wl, out.wlHow] = by(REF.wlIssn, REF.wlTitle, wlRec);
  return out;
}

/* ---------- разбор списка из заявки ---------- */
const DOI_RE = /\b10\.\d{4,9}\/[^\s"<>]+/i;
function cleanDoi(d) { return d.replace(/[.,;)\]]+$/, '').toLowerCase(); }

/* ---------- снимок страницы сайта: отделяем текст публикаций от элементов интерфейса ----------
   Снимок списка публикаций с любого сайта даёт вперемешку с текстом статей пагинацию, кнопки, счётчики и баннеры.
   Правила — только регулярные выражения (ИИ не используется): непонятное не выбрасывается, а остаётся в записи. */
const UI_RE = [
  /^(page|страница)\s*\d+\s*(of|из)\s*\d+$/i, /^\d+\s*[-–—]\s*\d+\s+of\s+[\d\s,]+$/i, /^\d+\s+of\s+[\d\s,]+$/i,
  /^(items|rows|results|documents)\s+per\s+page\b/i, /^показывать\s+по\b/i, /^(next|previous|prev|first|last|назад|далее|вперёд|вперед|ещё|еще)$/i,
  /^[‹›«»<>→←⟩⟨|·•]+$/, /^\.{3}$/, /^…$/,
  /^(sort\s+by|sorted\s+by|сортировать\s+по|сортировка|date\s+range|диапазон\s+дат|results\s+per\s+page|refine\s+by)\b/i, /^(sort|filter|filters|фильтр|фильтры|уточнить)\s*:?$/i,
  /^(show\s+more(\s+detail)?|read\s+more|view\s+all|view\s+abstract|load\s+more|export(\s+all)?|download|share|print|copy|save|add\s+to\s+(library|list)|select\s+all|create\s+citation\s+report|analyze\s+results)\b[.:\s]*$/i,
  /^(подробнее|показать\s+ещё|показать\s+еще|скачать|поделиться|экспорт|печать|выбрать\s+все|сохранить|добавить\s+в\s+список|в\s+избранное)\b[.:\s]*$/i,
  /^(cited\s+by|times\s+cited|цитировано|цитируется|цитирований|число\s+цитирований)\s*[:\s]*[\d\s,]*$/i,
  /^(цитировать|похожие\s+статьи|все\s+версии\s+статьи(\s*\(\d+\))?|related\s+articles|all\s+\d+\s+versions|cite)$/i,
  /^(похожие\s+запросы|related\s+searches)$/i,
  /^(source|источник)\s*:/i, /^preferred\s+source(\s*\(of\s*\d+\))?/i,
  /^(cookie|cookies|accept(\s+all)?|sign\s+in|log\s+in|войти|регистрация|подписаться|принять)\b/i,
  /^(общее\s+число\s+публикаций|число\s+публикаций|индекс\s+хирша)\s*[:\s]*[\d\s,]*$/i,
  /^(название|соавторы|журнал|год|тип\s+публикации|документы|documents|authors|title|year|source\s+title)$/i,
];
/* Связка кнопок в одной строке («Export all Download Select all», «☆ Сохранить 99 Цитировать Цитировано: 12 Похожие статьи»):
   если после удаления кнопочных слов, чисел и значков почти ничего не осталось — это элемент интерфейса, а не текст статьи */
const BTN_WORDS = /(show\s+more(\s+detail)?|read\s+more|view\s+all|view\s+abstract|load\s+more|export(\s+all)?|download|share|print|copy|save|add\s+to\s+(library|list)|select\s+all|full\s+text|get\s+pdf|pdf|html|cited\s+by|times\s+cited|cite|related\s+articles|all\s+versions|versions?\s+of\s+this\s+article|подробнее|показать\s+(ещё|еще)|скачать|поделиться|экспорт|печать|выбрать\s+все|сохранить|цитировать|цитировано|цитирований|похожие\s+статьи|все\s+версии\s+статьи|похожие\s+запросы|полный\s+текст|назад|далее)/gi;
function isBtnRow(t) {
  const rest = String(t).replace(BTN_WORDS, ' ').replace(/[\d\s:;()\[\]☆★✓·•|,.\-–—]+/g, ' ').trim();
  return rest.length <= 3;
}
/* Строка «интерфейсная», если совпала с правилом или если она короткая, без признаков названия статьи и повторяется в тексте */
function isUiLine(l, repeats) {
  const t = String(l || '').trim(); if (!t) return false;
  if (DOI_RE.test(t) || findDoi(t)) return false;
  if (UI_RE.some(re => re.test(t))) return true;
  if (BTN_WORDS.test(t.toLowerCase()) && isBtnRow(t)) { BTN_WORDS.lastIndex = 0; return true; }
  BTN_WORDS.lastIndex = 0;
  const words = t.split(/\s+/);
  if (words.length <= 3 && !/\b(19[5-9]\d|20[0-4]\d)\b/.test(t)) {
    const long = words.filter(w => w.replace(/[^A-Za-zА-Яа-яЁё]/g, '').length >= 4).length;
    if (!long) return true;                                          // «‹ 2 ›», «PDF», «1 of 5»
    if (repeats && repeats.get(t.toLowerCase()) >= 3) return true;   // один и тот же текст в нескольких местах — кнопка, а не статья
  }
  return false;
}
/* ---------- eLibrary (РИНЦ), список публикаций — по настоящему виду страницы (правка 4, 0.7.11) ----------
   Карточка: номер, флажок, НАЗВАНИЕ ЗАГЛАВНЫМИ (ссылка), ниже курсивом авторы, ниже источник:
   «В сборнике: … Москва, 2025. С. 26.» или «Materials Letters. 2025. Т. 382. С. 137913.»; справа отдельной колонкой — число цитирований. */
const ELIB_SRC = /^(В\s+сборнике|В\s+книге|В\s+журнале|В\s+монографии)\s*:|\b(19|20)\d{2}\.\s*(Т\.|№|С\.)\s*\d|Патент\s+на\s+(изобретение|полезную\s+модель)/i;
/* Строка заглавными: не меньше трёх слов из букв и почти все буквы — прописные */
function isCapsLine(l) {
  const t = String(l || '').replace(/^\d{1,3}\s*[.)]?\s*/, ''); const letters = t.replace(/[^A-Za-zА-Яа-яЁё]/g, '');
  if (letters.length < 12 || t.split(/\s+/).filter(w => /[A-Za-zА-Яа-яЁё]{2}/.test(w)).length < 3) return false;
  return letters.replace(/[^A-ZА-ЯЁ]/g, '').length / letters.length >= 0.85;
}
function isElibList(text) {
  const L = String(text || '').split('\n').map(l => l.trim()).filter(Boolean);
  const src = L.filter(l => ELIB_SRC.test(l)).length, caps = L.filter(isCapsLine).length;
  return src >= 2 && caps >= Math.max(1, Math.ceil(src * 0.5));
}
function splitElib(L) {
  const blocks = []; let cur = null, num = null;
  const push = () => { if (cur && cur.length) blocks.push((num != null ? num + '. ' : '') + cur.join('\n')); cur = null; num = null; };
  for (let i = 0; i < L.length; i++) {
    let l = L[i];
    if (isCapsLine(l) && !(cur && cur.length && isCapsLine(cur[cur.length - 1]) && !ELIB_SRC.test(cur.join(' ')) && !/^\d{1,3}\s*[.)]?\s/.test(l))) {
      push();
      const m = l.match(/^(\d{1,3})\s*[.)]?\s+/); if (m) { num = +m[1]; l = l.slice(m[0].length); }
      l = l.replace(/^[☐□■▢☑✓|\[\]!]{1,3}\s*(?=[A-ZА-ЯЁ])/, '');  // флажок слева от названия (распознаётся как «|!», «[]»)
      l = l.replace(/\s+\d{1,4}$/, '');                       // число цитирований из правой колонки
      cur = [l]; continue;
    }
    if (!cur) continue;                                      // до первой карточки — шапка страницы
    if (/^\d{1,4}$/.test(l)) continue;                       // число цитирований отдельной строкой
    // продолжение названия на следующей строке — тоже заглавными
    cur.push(isCapsLine(l) ? l.replace(/\s+\d{1,4}$/, '') : l);
  }
  push();
  return blocks.map(b => [b]).filter(b => b[0].length >= 25);
}
/* Признаки конкретных сайтов. Список расширяемый: если признаков нет, работает общая разбивка. */
function detectSite(text) {
  const t = String(text || '');
  if (/CONTRIBUTORS\s*:/i.test(t) && /(Source\s*:|Preferred\s+source)/i.test(t)) return 'orcid';
  if (/(Цитировать|Все\s+версии\s+статьи|versions\s+of\s+this\s+article|Cited\s+by\s+\d+)/i.test(t) && /^.+\s[—–-]\s.*(19|20)\d{2}\s*[—–-]\s*\S+/m.test(t)) return 'scholar';
  if (/(Общее\s+число\s+публикаций|Число\s+цитирований|elibrary|РИНЦ)/i.test(t) && /(Соавторы|Журнал)/i.test(t)) return 'elibrary';
  if (isElibList(t)) return 'elibrary';
  if (/^By\s*:/im.test(t) && /(Times\s+Cited|Create\s+Citation\s+Report)/i.test(t)) return 'wos';
  if (/(View\s+abstract|Cited\s+by|Documents)/i.test(t) && /\d+\s*[-–—]\s*\d+\s+of\s+[\d\s,]+/i.test(t)) return 'scopus';
  return null;
}
/* Разбивка по карточкам конкретного сайта. Возвращает массив блоков строк или null, если признаки не подтвердились. */
function splitBySite(lines, site) {
  const L = lines.filter(Boolean), blocks = []; let cur = null;
  const push = () => { if (cur && cur.length) blocks.push(cur); cur = null; };
  if (site === 'orcid') {
    // карточка ORCID «Works»: заголовок, под ним «ГГГГ[-ММ] | Тип» или «Журнал / ГГГГ[-ММ] | Тип»
    const meta = /^(?:.+\/\s*)?(19|20)\d{2}(-\d{2})?\s*\|\s*\S+/;
    for (let i = 0; i < L.length; i++) {
      if (meta.test(L[i]) && i > 0) { const head = cur && cur.length ? cur.pop() : L[i - 1]; push(); cur = [head, L[i]]; continue; }
      if (!cur) cur = []; cur.push(L[i]);
    }
    push();
    return blocks.filter(b => b.length >= 2);
  }
  if (site === 'scholar') {
    // карточка Google Scholar: заголовок, строка «Авторы — Журнал, год — сайт», сниппет (с «…»), подвал
    const auth = /^.+\s[—–-]\s.*(19|20)\d{2}/;
    for (let i = 0; i < L.length; i++) {
      if (auth.test(L[i]) && i > 0) { const head = cur && cur.length ? cur.pop() : L[i - 1]; push(); cur = [head, L[i]]; continue; }
      if (!cur) continue;                                       // до первой карточки — шапка страницы
      if (/^[….]/.test(L[i])) continue;                         // сниппет в запись не входит
      cur.push(L[i]);
    }
    push();
    return blocks.filter(b => b.length >= 2);
  }
  if (site === 'elibrary' && isElibList(L.join('\n'))) return splitElib(L);
  if (site === 'scopus' || site === 'wos' || site === 'elibrary') {
    // карточка: заголовок, затем авторы и издание; строка с годом закрывает карточку
    const yr = /\b(19[5-9]\d|20[0-4]\d)\b/;
    for (let i = 0; i < L.length; i++) {
      if (!cur) { cur = [L[i]]; if (yr.test(L[i]) && L[i].split(/\s+/).length > 6) push(); continue; }
      cur.push(L[i]);
      if (yr.test(L[i])) push();
    }
    push();
    return blocks.filter(b => b.join(' ').length >= 25);
  }
  return null;
}
/* Текст снимка с известного сайта → записи. null, если сайт не узнан. */
function splitSiteEntries(text) {
  let lines = String(text || '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+/g, ' ').trim());
  const site = detectSite(lines.join('\n'));
  if (!site) return null;
  const rel = lines.findIndex(l => /^(похожие\s+запросы|related\s+searches)$/i.test(l));
  if (rel >= 0) lines = lines.slice(0, rel);                    // блок подсказок в конце страницы — целиком
  const repeats = new Map(); lines.forEach(l => { const k = l.toLowerCase(); if (k) repeats.set(k, (repeats.get(k) || 0) + 1); });
  lines = lines.filter(l => !isUiLine(l, repeats));
  const blocks = splitBySite(lines, site);
  if (!blocks || !blocks.length) return null;
  const out = blocks.map(b => parseEntry(b.join('\n'))).filter(e => e.query.length >= 12);
  if (!out.length) return null;
  out.forEach(e => { e.site = site; });
  return out;
}
/* Делит вставленный или распознанный текст на отдельные публикации */
function splitEntries(text) {
  const site = splitSiteEntries(text); if (site) return site;
  const lines = String(text || '').replace(/\r/g, '').split('\n').map(l => l.replace(/[ \t ]+/g, ' ').trim());
  const numRe = /^(\d{1,2})\s*[.)]\s*(?=\S)/;
  const nums = lines.map(l => { const m = l.match(numRe); return m ? +m[1] : null; });
  // нумерованный список: начинаться может с любого номера, номера растут; пропуск одного-двух номеров допустим
  const seq = []; let last = null;
  nums.forEach((n, i) => { if (n == null) return; if (last == null || (n > last && n <= last + 3)) { seq.push(i); last = n; } });
  const hasYear = b => /\b(19[5-9]\d|20[0-4]\d)\b/.test(b.join(' ')) || DOI_RE.test(b.join(' '));
  let blocks = [];
  if (seq.length >= 2) {
    // текст до первого номера — заголовок таблицы, если в нём нет года
    const head = lines.slice(0, seq[0]).filter(Boolean); if (head.length && hasYear(head) && head.join(' ').length >= 40) blocks.push(head);
    seq.forEach((st, k) => blocks.push(lines.slice(st, k + 1 < seq.length ? seq[k + 1] : lines.length)));
    // строка без номера внутри записи, но похожая на отдельную запись (свой год), если номер потерялся: оставить внутри, так надёжнее
  } else {
    let cur = []; lines.forEach(l => { if (!l) { if (cur.length) blocks.push(cur); cur = []; } else cur.push(l); }); if (cur.length) blocks.push(cur);
    if (blocks.length <= 1) blocks = lines.filter(Boolean).map(l => [l]);
    // кусок без года и без DOI — продолжение предыдущей записи (перенос строки или лишняя пустая строка)
    const merged = []; blocks.forEach(b => { if (merged.length && !hasYear(b)) merged[merged.length - 1] = merged[merged.length - 1].concat(b); else merged.push(b); }); blocks = merged;
  }
  const out = blocks.map(b => parseEntry(b.filter(Boolean).join('\n'))).filter(e => e.query.length >= 12);
  // пропущенный номер: запись перед пропуском могла слиться с потерянной
  out.forEach((e, i) => { const nx = out[i + 1]; if (e.num != null && nx && nx.num != null && nx.num > e.num + 1) e.warn = `после № ${e.num} в списке нет № ${e.num + 1} — проверьте, не слились ли две записи в одну`; });
  return out;
}
const PATENT_RE = /Патент\s+на\s+(изобретение|полезную\s+модель)|(^|[\s(])RU\s?\d{6,7}\s?[CU]\d\b|Заявка\s*№\s*\d{6,}/i;
function parseEntry(raw) {
  let t = raw.replace(/([a-zа-яё])-\n(?=[a-zа-яё])/gi, '$1').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  const e = { raw: t, num: null, doi: null, years: [], declIF: null, query: '' };
  let m = t.match(/^(\d{1,2})\s*[.)]\s*/); if (m) { e.num = +m[1]; t = t.slice(m[0].length); }
  const dd = findDoi(t); if (dd) { e.doi = dd.doi; t = t.replace(dd.raw, ' '); }
  let q = t.replace(/https?:\/\/\S+/g, ' ').replace(DOI_RE, ' ').replace(/\bdoi\s*:\s*/gi, ' ');
  // заявленный импакт-фактор: число с дробной частью в конце записи или после «IF / импакт-фактор»
  m = q.match(/(?:\bIF\b|импакт[\s-]*фактор)\s*[:=–—-]?\s*(\d{1,3}(?:[.,]\d{1,3})?)/i);
  if (m) { e.declIF = parseFloat(m[1].replace(',', '.')); q = q.replace(m[0], ' '); }
  else { m = q.match(/[\s|;,(]\(?(\d{1,3}[.,]\d{1,3})\)?\s*[|.]?\s*$/); if (m) { e.declIF = parseFloat(m[1].replace(',', '.')); q = q.slice(0, m.index); } }
  const now = new Date().getFullYear();
  e.years = [...new Set((q.match(/\b(?:19[5-9]\d|20[0-4]\d)\b/g) || []).map(Number).filter(y => y <= now + 1))];
  // патент или заявка на патент — не статья: в Crossref и OpenAlex не ищется (правка 4)
  m = t.match(PATENT_RE); if (m) { e.patent = true; const n = t.match(/(?:\bRU|ВО|BO|РУ|В\/О)\s?(\d{6,7})\s?([CUСИ]\d)\b/i); if (n) e.patentNo = 'RU' + n[1] + n[2].toUpperCase().replace('С', 'C').replace('И', 'U'); }
  // «В сборнике: …», «В книге: …», «В журнале: …» — дальше издание, а не название: в запрос идёт название (и год),
  // иначе Crossref находит сам сборник, а не статью
  m = q.match(/(^|\s)В\s+(сборнике|книге|журнале|монографии)\s*:/i);
  if (m && m.index > 15) { e.container = q.slice(m.index + m[0].length).replace(/\s+/g, ' ').trim(); q = q.slice(0, m.index) + (e.years.length ? ' ' + e.years.join(' ') : ''); }
  e.query = q.replace(/[|]/g, ' ').replace(/\s+/g, ' ').trim();
  return e;
}

/* ---------- сопоставление найденной статьи с записью ---------- */
/* Доля слов названия найденной статьи, которые есть в записи из заявки (с допуском на опечатку распознавания) */
function titleScore(foundTitle, entryText) {
  const ft = norm(foundTitle).split(' ').filter(w => w.length >= 3);
  if (ft.length < 2) return 0;
  const et = norm(entryText).split(' '); const set = new Set(et);
  let hit = 0;
  for (const w of ft) { if (set.has(w)) hit++; else if (w.length >= 6 && et.some(x => Math.abs(x.length - w.length) <= 1 && lev(x, w, 1) <= 1)) hit += 0.9; }
  return hit / ft.length;
}

/* DOI в тексте записи, в том числе с ошибками распознавания: «1O.1016», «10. 1016 / j.x», «doi: 10.1016/ j.x», «https://doi.org/10…».
   Возвращает {doi, raw} — найденный DOI и кусок текста, который он занимал, или null */
function findDoi(t) {
  t = String(t || '');
  const m = t.match(/(?:https?:\/\/(?:dx\.)?doi\.org\/\s*|\bdoi\s*[:.]?\s*)?\b1[0Oo]\s?\.\s?(\d[\dOoIl]{3,8})\s?\/\s?([^\s"<>]+)/i);
  if (!m) return null;
  const pre = m[1].replace(/[Oo]/g, '0').replace(/[Il]/g, '1');
  return { doi: cleanDoi('10.' + pre + '/' + m[2]), raw: m[0] };
}
/* Насколько найденная статья подходит к записи списка: название (главное) + год, первый автор, издание.
   Год рядом (±1) — без штрафа, другой год — штраф; совпали фамилия первого автора или издание — небольшая прибавка. От 0 до 1. */
function matchScore(w, entry) {
  const t = titleScore(w.title, entry.query); let s = t;
  if (w.year && entry.years && entry.years.length) { if (entry.years.indexOf(w.year) >= 0) s += 0.06; else if (!entry.years.some(y => Math.abs(y - w.year) === 1)) s -= 0.2; }
  const fam = w.authors && w.authors[0] ? (w.authors[0].family || String(w.authors[0].name || '').trim().split(/\s+/).pop()) : '';
  if (fam && fam.length >= 3) { const et = norm(entry.query).split(' '); const c = canonName(fam); if (c && et.some(x => x.length >= 3 && canonName(x) === c)) s += 0.04; }
  if (w.journal) { const jw = norm(w.journal).split(' ').filter(x => x.length >= 4); if (jw.length && jw.every(x => norm(entry.query).split(' ').indexOf(x) >= 0)) s += 0.04; }
  return { score: Math.max(0, Math.min(1, s)), title: t };
}

/* ---------- фамилия руководителя ---------- */
const TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
const translit = s => String(s).toLowerCase().split('').map(c => TR[c] != null ? TR[c] : c).join('');
/* Приводит разные способы записи одной фамилии латиницей к одному виду */
function canonName(s) {
  let t = String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (/[а-яё]/.test(t)) t = translit(t);
  return t.replace(/[^a-z]/g, '').replace(/iy(?=[aeuo])/g, 'i').replace(/shch|sch/g, 'S').replace(/tch|ch/g, 'C').replace(/sh/g, 'X').replace(/zh/g, 'Z').replace(/kh/g, 'h').replace(/ts|tz|cz/g, 'c').replace(/ks/g, 'x')
    .replace(/[jy]u|iu/g, 'u').replace(/[jy]a|ia/g, 'a').replace(/[jy]o|io/g, 'o').replace(/[jy]e|ie/g, 'e').replace(/[jy]/g, 'i').replace(/ii+/g, 'i').replace(/w/g, 'v').replace(/ff$/, 'v').replace(/(.)\1+/g, '$1');
}
function leaderVariants(input) { return String(input || '').split(/[,;\/]+/).map(s => s.trim().split(/\s+/)[0]).filter(s => s && s.length >= 2).map(canonName).filter(Boolean); }
function sameSurname(family, variants) {
  const c = canonName(family); if (!c) return false;
  return variants.some(v => v === c || (Math.min(v.length, c.length) >= 5 && lev(v, c, 1) <= 1));
}
/* Позиция руководителя среди авторов: first | last | middle | none | unknown */
function authorPosition(authors, variants) {
  if (!variants.length) return { pos: 'unknown', why: 'фамилия руководителя не указана' };
  if (!authors || !authors.length) return { pos: 'unknown', why: 'в базе нет списка авторов' };
  const idx = authors.map((a, i) => sameSurname(a.family || a.name || '', variants) ? i : -1).filter(i => i >= 0);
  if (!idx.length) return { pos: 'none', n: authors.length };
  const i = idx[0];
  return { pos: i === 0 ? 'first' : (i === authors.length - 1 ? 'last' : 'middle'), index: i + 1, n: authors.length, name: [authors[i].given, authors[i].family].filter(Boolean).join(' ') };
}

/* ---------- Белый список на год публикации ----------
   Уровни заданы на отдельные годы (2023, 2025, 2026); на год публикации берётся последний уровень, заданный не позже этого года.
   cur — текущий уровень (последний заданный), с учётом исключения. */
function wlAt(wl, year) {
  const ys = Object.keys(wl.levels).map(Number).filter(y => wl.levels[y]).sort((a, b) => a - b);
  const last = ys.length ? wl.levels[ys[ys.length - 1]] : 0;
  const o = { lv: 0, y: null, exact: true, excluded: false, ambiguous: false, cur: wl.state === 2 ? 0 : last, curExcl: wl.state === 2 };
  if (!ys.length) { o.exact = false; return o; }
  const y = year || ys[ys.length - 1]; let pick = ys.filter(v => v <= y).pop();
  if (pick == null) { pick = ys[0]; o.exact = false; }
  o.lv = wl.levels[pick]; o.y = pick;
  if (wl.state === 2) { const dy = +(String(wl.disc).match(/(\d{4})$/) || [])[1]; if (dy && year) { if (year > dy) { o.excluded = true; } else if (year === dy) o.ambiguous = true; } else if (!year) o.excluded = true; }
  return o;
}
/* Фильтр строк таблицы. r: {qY — квартиль на год публикации (0 — нет), wl — уровень БС на год (0/null — нет), excl, y — год,
   corr — 'yes'|'no'|'unk'|null (автор corresponding), cpd — показатель SCImago на год публикации, org — 'yes'|'check'|'no'|'unk'|null}.
   flt: {q: ['1'..'4','none'], wl: ['1'..'4','none','excl'], yFrom, yTo, corr: ['yes','no','unk'], ifFrom, org: [...]}.
   Квартиль и Белый список — «или» между собой; годы, corresponding, показатель и организация — дополнительные условия «и». */
function passFilter(r, flt) {
  if (flt.yFrom && !(r.y >= flt.yFrom)) return false;
  if (flt.yTo && !(r.y <= flt.yTo)) return false;
  if (flt.corr && flt.corr.length && flt.corr.indexOf(r.corr || 'unk') < 0) return false;
  if (flt.ifFrom && !(r.cpd != null && r.cpd >= flt.ifFrom)) return false;
  if (flt.org && flt.org.length && flt.org.indexOf(r.org || 'unk') < 0) return false;
  const q = flt.q || [], w = flt.wl || [];
  // статья не найдена — под условия о квартиле, уровне, corresponding и организации не подходит
  if (r.qY === undefined && r.wl === undefined && (q.length || w.length || (flt.corr && flt.corr.length) || (flt.org && flt.org.length))) return false;
  if (!q.length && !w.length) return true;
  const qOk = q.some(v => v === 'none' ? !r.qY : r.qY === +v);
  const wOk = w.some(v => v === 'excl' ? !!r.excl : (r.excl ? false : (v === 'none' ? !r.wl : r.wl === +v)));
  return qOk || wOk;
}
/* Автор — corresponding? authors: [{id, corr}] из OpenAlex; ids — профили автора.
   'yes' — отмечен он; 'no' — отмечен другой; 'unk' — в базе никто не отмечен; null — данных об авторах нет */
function corrOf(authors, ids) {
  if (!authors || !ids || !ids.length) return null;
  const c = authors.filter(a => a.corr); if (!c.length) return 'unk';
  return c.some(a => ids.indexOf(a.id) >= 0) ? 'yes' : 'no';
}

/* ---------- организация ----------
   Сверка организации автора в статье (OpenAlex: institutions, raw_affiliation_strings) с организацией из заявки.
   Слова приводятся к одному виду: кириллица — в латиницу, общие слова («университет», «государственный», «federal») отбрасываются,
   частые переводные слова («московский» — «moscow», «технологический» — «technological») сводятся к одному понятию. */
const ORG_STOP = new Set('university universitet universiteta institute institut instituta federal federalnoe federalnyi federalnogo state gosudarstvennyi gosudarstvennogo gosudarstvennoe national natsionalnyi natsionalnogo research issledovatelskii issledovatelskogo nauchno nauchnyi nauchnogo scientific science of the and for in at on named imeni im after center centre tsentr school shkola higher vysshaia vysshego autonomous avtonomnoe budgetary biudzhetnoe biudzhetnoi educational obrazovatelnoe obrazovatelnoi obrazovaniia uchrezhdenie uchrezhdeniia institution organization organizatsiia faculty fakultet department kafedra otdel branch filial ltd llc fgaou fgbou fgbun fgbu fgau ano ooo ao pao vo dpo nitu niu'.split(' '));
const ORG_CONCEPT = [['moskov', 'moscow', 'moskva', 'moskvy'], ['peterburg', 'petersburg', 'spb'], ['ross', 'russia'], ['sibir', 'siberia'], ['akadem', 'academ'], ['tekhnolog', 'technolog'], ['tekhnich', 'technical', 'techni'], ['politekhn', 'polytechn'], ['meditsin', 'medic'], ['pedagog', 'pedagog'], ['fiz', 'physic', 'physical'], ['khim', 'chemi', 'chemical'], ['matemat', 'mathemat'], ['biolog', 'biolog'], ['ekonom', 'econom'], ['agrar', 'agricult'], ['gorn', 'mining'], ['iadern', 'nuclear'], ['aviats', 'aviation'], ['aerokosm', 'aerospace'], ['kosm', 'space'], ['inzhener', 'engineer'], ['priborostr', 'instrument'], ['energet', 'energ'], ['neft', 'petrol', 'oil'], ['lesn', 'forest'], ['morsk', 'marine', 'maritime'], ['veterinar', 'veterinar'], ['iuzhn', 'southern', 'south'], ['severn', 'northern', 'north'], ['dalnevostoch', 'far eastern', 'far east'], ['ural', 'ural'], ['volg', 'volga'], ['kavkaz', 'caucas'], ['sirius', 'sirius']];
function orgTokens(s) {
  let t = String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ё/g, 'е');
  t = t.split('').map(c => TR[c] != null ? TR[c] : c).join('').replace(/[^a-z0-9]+/g, ' ');
  t = t.replace(/far eastern|far east/g, 'dalnevostoch');
  const out = [];
  for (let w of t.split(' ')) {
    if (!w || w.length < 3 || ORG_STOP.has(w) || /^\d+$/.test(w)) continue;
    const c = ORG_CONCEPT.find(g => g.some(p => w.startsWith(p)));
    out.push(c ? '#' + c[0] : w);
  }
  return [...new Set(out)];
}
const orgTokEq = (a, b) => { if (a === b) return true; if (a[0] === '#' || b[0] === '#') return false; const n = Math.min(a.length, b.length); if (n < 4) return false; let k = 0; while (k < n && a[k] === b[k]) k++; return k >= Math.max(4, n - 1) || (n >= 7 && lev(a, b, 1) <= 1); };
/* Результат: {st:'yes'|'check'|'no'|'unk', name} — st 'unk', если в статье организация не указана */
function orgMatch(insts, input) {
  const names = (insts || []).filter(Boolean); if (!names.length) return { st: 'unk' };
  const it = orgTokens(input); if (!it.length) return { st: null };
  let best = null;
  for (const n of names) {
    const nt = orgTokens(n); if (!nt.length) continue;
    const a = it.filter(x => nt.some(y => orgTokEq(x, y))).length, b = nt.filter(y => it.some(x => orgTokEq(x, y))).length;
    const st = a === it.length && b === nt.length ? 'yes' : (a || b ? 'check' : 'no');
    const rank = { yes: 3, check: 2, no: 1 }[st]; if (!best || rank > best.rank) best = { st, name: n, rank };
  }
  if (!best) return { st: 'check', name: names[0] };
  // нет общих слов, но названия на разных языках — перевод мог не распознаться: «проверьте», а не «другая»
  if (best.st === 'no' && isCyr(input) !== isCyr(best.name)) best.st = 'check';
  return { st: best.st, name: best.name };
}

/* Совпадение организации кандидата с введённой — для выбора автора среди однофамильцев (правка 1, 0.7.11).
   'yes' — названия совпали; 'part' — есть общие значимые слова; 'no' — общих слов нет; 'unk' — у кандидата организация не указана; null — организация не введена */
function orgHit(names, input) {
  if (!orgTokens(input).length) return null;
  names = (names || []).map(x => String(x || '').trim()).filter(Boolean); if (!names.length) return 'unk';
  const it = orgTokens(input); let best = 'no';
  for (const n of names) {
    const nt = orgTokens(n); if (!nt.length) continue;
    const a = it.filter(x => nt.some(y => orgTokEq(x, y))).length, b = nt.filter(y => it.some(x => orgTokEq(x, y))).length;
    if (a === it.length && b === nt.length) return 'yes';
    // аббревиатура и полное название («МИСИС» и «National University of Science and Technology MISIS»): все слова введённого есть в названии
    if (a === it.length && it.some(x => x[0] !== '#')) return 'yes';
    if (a || b) best = 'part';
  }
  return best;
}
/* Авторы статей из списка с нужной фамилией (detectLeader): если указана организация, оставить тех, у кого она совпала хотя бы в одной статье.
   Если не совпала ни у кого — не отбрасывать никого. Возвращает {list, hit}. */
function leaderByOrg(works, cands, input) {
  if (!orgTokens(input).length || !cands.length) return { list: cands, hit: null };
  const names = id => { const out = []; (works || []).forEach(w => (w && w.oaAuthors || []).forEach(a => { if (a.id === id) out.push(...instNames(a)); })); return out; };
  const r = cands.map(c => ({ c, st: orgHit(names(c.id), input) }));
  const yes = r.filter(x => x.st === 'yes'), part = r.filter(x => x.st === 'part');
  if (yes.length) return { list: yes.map(x => x.c), hit: 'yes' };
  if (part.length) return { list: part.map(x => x.c), hit: 'part' };
  return { list: cands, hit: 'none' };
}
/* Качество распознанного снимка: доля читаемых слов (из 4+ букв одного алфавита). Мусор вроде «О*® ОУ © ОЕ5ТСМ» — низкая доля. */
function ocrQuality(text) {
  const toks = String(text || '').split(/\s+/).map(t => t.replace(/^[«"“(\[]+|[»"”)\].,;:!?]+$/g, '')).filter(Boolean);
  if (!toks.length) return { words: 0, ratio: 0 };
  const ok = toks.filter(t => /^([A-Za-z][A-Za-z'’-]{3,}|[А-Яа-яЁё][А-Яа-яЁё-]{3,})$/.test(t)).length;
  return { words: toks.length, good: ok, ratio: Math.round(ok / toks.length * 100) / 100 };
}

/* ---------- возможные дубли в списке ----------
   pubs — результаты judgePub. Возвращает [{a, b, why}] — индексы записей и причина. Сама утилита ничего не исключает. */
const PREPRINT_RE = /arxiv|biorxiv|medrxiv|chemrxiv|research square|ssrn|preprints|techrxiv|engrxiv|psyarxiv|osf preprints/i;
function isPreprint(w) { return !!w && (w.type === 'posted-content' || w.type === 'preprint' || PREPRINT_RE.test(w.journal || '') || /^10\.48550\/arxiv/.test(w.doi || '') || /^10\.1101\//.test(w.doi || '') && /rxiv/i.test(w.journal || '')); }
const isProc = w => !!w && (w.type === 'proceedings-article' || /proceedings|conference|symposium|congress|abstracts|тезис|конференц|материалы/i.test(w.journal || ''));
function findDuplicates(pubs) {
  const out = [], txt = p => p.work ? p.work.title : p.entry.query, doi = p => (p.work && p.work.doi) || p.entry.doi || '';
  const sim = (x, y) => { const a = txt(x), b = txt(y); if (!a || !b) return 0; return Math.min(titleScore(a, b), titleScore(b, a)); };
  // для пары «препринт или доклад — статья»: название одной почти целиком входит в название другой (полная статья часто называется длиннее)
  const words = t => norm(t).split(' ').filter(w => w.length >= 3).length;
  const cont = (x, y) => { const a = txt(x), b = txt(y); if (!a || !b) return 0; const [sh, lo] = words(a) <= words(b) ? [a, b] : [b, a]; return words(sh) >= 4 ? titleScore(sh, lo) : sim(x, y); };
  for (let i = 0; i < pubs.length; i++) for (let j = i + 1; j < pubs.length; j++) {
    const a = pubs[i], b = pubs[j];
    if (doi(a) && doi(a) === doi(b)) { out.push({ a: i, b: j, why: 'одинаковый DOI' }); continue; }
    if (!a.work || !b.work) { if (!a.work && !b.work && sim(a, b) >= 0.9 && norm(a.entry.query).length > 30) out.push({ a: i, b: j, why: 'записи почти совпадают' }); continue; }
    const s = sim(a, b);
    if (isPreprint(a.work) !== isPreprint(b.work) && (s >= 0.75 || cont(a, b) >= 0.85)) { out.push({ a: i, b: j, why: 'препринт и журнальная версия одной работы' }); continue; }
    if (isProc(a.work) !== isProc(b.work) && (s >= 0.75 || cont(a, b) >= 0.85)) { out.push({ a: i, b: j, why: 'доклад (тезисы) и статья с почти тем же названием' }); continue; }
    if (s >= 0.9) out.push({ a: i, b: j, why: 'одинаковое название при разных DOI' });
  }
  return out;
}

/* ---------- данные издания на год публикации ----------
   Только факты: квартиль и показатель SCImago на год публикации и последний год, уровень Белого списка, расхождения со сайтом.
   year — год публикации; live — ответ сайта Белого списка {found, levels, state, disc} или null; oaCpd — показатель OpenAlex или null */
function journalVerdict(j, year, live, oaCpd) {
  const o = { notes: [] };
  const sj = j.sj, wl = j.wl;
  if (j.sjHow === 'ambiguous') o.notes.push('в SCImago несколько изданий с таким ISSN или названием — взято первое, проверьте');
  if (j.wlHow === 'ambiguous') o.notes.push('в Белом списке несколько изданий с таким ISSN или названием — взято первое, проверьте');
  if (j.sjHow === 'title' || j.wlHow === 'title') o.notes.push('издание найдено по названию, а не по ISSN');
  if (sj) {
    const at = sjAt(sj, year), hy = sj.hist[at.y], hl = sj.hist[sj.last];
    o.sjYear = at.y; o.sjExact = at.exact; o.qY = hy.q; o.qL = hl.q; o.yL = sj.last;
    o.hist = Object.keys(sj.hist).map(y => `${y}: ${sj.hist[y].q ? 'Q' + sj.hist[y].q : '—'}`).join(', ');
    if (!at.exact) o.notes.push(`${at.why} — взят ${at.y} год`);
    if (sj.last < REF.sjYear) o.notes.push(`в SCImago издание есть только до ${sj.last} года`);
    if (sj.type) o.notes.push(`в SCImago тип издания — ${SJ_TYPE[sj.type]}`);
    o.cpd = hy.cpd != null ? hy.cpd : hl.cpd; o.cpdLast = hl.cpd;
  }
  const lvStr = lv => { const e = Object.entries(lv).filter(([, v]) => v); return e.length ? e.map(([y, v]) => `уровень ${v} (${y})`).join(', ') : 'уровень не указан'; };
  if (wl) {
    if (wl.state === 2) o.notes.push('издание исключено из Белого списка ' + wl.disc + ' — учитывается ли статья, зависит от даты публикации');
    if (wl.state === 1 && wl.notice) o.notes.push('примечание Белого списка: ' + wl.notice);
  }
  if (live) {
    o.wlLive = true;
    const a = wl ? JSON.stringify([wl.levels[2023] || 0, wl.levels[2025] || 0, wl.levels[2026] || 0, wl.state === 2]) : 'нет';
    const b = live.found ? JSON.stringify([live.levels[2023] || 0, live.levels[2025] || 0, live.levels[2026] || 0, live.state === 2]) : 'нет';
    if (a !== b) { o.wlDiff = true; o.notes.push(`сайт Белого списка отвечает иначе, чем справочник от ${REF.wlDate}: на сайте — ` + (live.found ? lvStr(live.levels) + (live.state === 2 ? `, исключён ${live.disc || ''}` : '') : 'издания нет') + '; проверьте'); }
  }
  if (oaCpd != null) o.oaCpd = oaCpd;
  return o;
}

/* ---------- одна публикация из списка ----------
   entry — запись из списка; work — найденная статья {doi,title,authors[],journal,issns[],year,type,score,via,oaAuthors}
   opt: {leaderIds — профили найденного автора в OpenAlex} */
const TYPE_OK = { 'journal-article': 'статья', article: 'статья', review: 'обзор' };
const TYPE_RU = { 'proceedings-article': 'доклад в трудах конференции', 'book-chapter': 'глава книги', 'posted-content': 'препринт', preprint: 'препринт', book: 'книга', dataset: 'набор данных', editorial: 'редакционная статья', letter: 'письмо', erratum: 'исправление', 'peer-review': 'рецензия', dissertation: 'диссертация', monograph: 'монография', 'report': 'отчёт', paratext: 'служебная страница журнала' };
/* Пороги совпадения найденной статьи с записью: от FOUND_OK — найдена, от FOUND_NEAR — похожая (проверьте), ниже — не найдена */
const FOUND_OK = 0.85, FOUND_NEAR = 0.6;
function judgePub(entry, work, opt) {
  opt = opt || {};
  const r = { entry, work, found: ST.unk, notes: entry.warn ? [entry.warn] : [], j: null, jv: null };
  if (entry.patent) { r.found = 'patent'; r.work = null; r.notes.push('патент — в Crossref и OpenAlex не ищется'); return r; }
  if (!work) { r.found = work === null ? ST.no : ST.unk; r.notes.push(work === null ? 'в открытых базах (Crossref, OpenAlex) не найдено — проверьте вручную по ссылкам поиска' : 'запрос не выполнен'); return r; }
  if (work.via === 'doi' || work.via === 'manual') r.found = ST.ok;
  else { r.found = work.score >= FOUND_OK ? ST.ok : (work.score >= FOUND_NEAR ? ST.check : ST.no); if (r.found === ST.check) r.notes.push('найденная статья совпадает с записью не полностью — убедитесь, что это та же статья, или выберите из вариантов'); }
  if (work.via === 'manual') r.notes.push('статья выбрана вручную из вариантов');
  if (work.doiMiss) r.notes.push(`DOI из списка (${work.doiMiss}) в Crossref не найден — статья найдена по тексту записи; проверьте DOI`);
  if (r.found === ST.no) { r.notes.push('ближайшая найденная статья не похожа на запись — выберите из вариантов или проверьте вручную'); r.work = null; r.near = work; return r; }
  if (work.year && entry.years.length && entry.years.indexOf(work.year) < 0) {
    const near = entry.years.some(y => Math.abs(y - work.year) === 1);
    r.yearDiff = true; r.notes.push(`год в списке (${entry.years.join(', ')}) не совпадает с годом в базе (${work.year})` + (near ? ' — разница в один год бывает между выходом онлайн и в номере' : ''));
  }
  if (work.type) r.typeName = TYPE_OK[work.type] || TYPE_RU[work.type] || work.type;
  r.j = findJournal(work.issns, work.journal); r.jv = journalVerdict(r.j, work.year, work.wlLive || null, work.oaCpd != null ? work.oaCpd : null);
  r.notes.push(...r.jv.notes);
  if (entry.declIF != null) {
    r.declIF = entry.declIF;
    if (r.jv.cpd != null) { const d = Math.abs(entry.declIF - r.jv.cpd), big = d > Math.max(1.5, 0.35 * r.jv.cpd); r.ifDiff = big; if (big) r.notes.push(`в списке ${fmtNum(entry.declIF)}, а «цитирований на документ» SCImago ${fmtNum(r.jv.cpd)} — это разные показатели (в списке обычно импакт-фактор WoS), сверьте на сайте журнала`); }
  }
  // corresponding author — как размечено в OpenAlex; найденный автор узнаётся по профилю
  if (work.oaAuthors) { const ca = work.oaAuthors.filter(a => a.corr); work.corr = ca.length ? { known: true, names: ca.map(a => a.name).filter(Boolean) } : { known: false }; }
  return r;
}

/* ---------- сведения об авторе, введённые человеком ----------
   Разбирает строку вида «ResearcherID / Scopus ID / ORCID» или ФИО; значения узнаются по виду, а не по порядку. */
function orcidValid(o) { const d = String(o).replace(/-/g, ''); if (!/^\d{15}[\dX]$/.test(d)) return false; let t = 0; for (let i = 0; i < 15; i++) t = (t + +d[i]) * 2; const c = (12 - t % 11) % 11; return (c === 10 ? 'X' : String(c)) === d[15]; }
function parseAuthorInput(text) {
  let t = String(text || '').replace(/[‐-―−]/g, '-'); const o = { orcid: '', orcidBad: '', scopus: '', rid: '', spin: '', rinc: '', name: '' };
  const cut = m => { t = t.replace(m, ' '); };
  // РИНЦ AuthorID — только число сразу после подписи, иначе его не отличить от других чисел
  let m = t.match(/(?:Author\s*ID|РИНЦ)\s*[:№]?\s*(\d{3,8})(?![\d-])/i); if (m) { o.rinc = m[1]; cut(m[0]); }
  m = t.toUpperCase().match(/\d{4}-\d{4}-\d{4}-\d{3}[\dX]/); if (m) { if (orcidValid(m[0])) o.orcid = m[0]; else o.orcidBad = m[0]; t = t.replace(new RegExp(m[0], 'i'), ' '); }
  t = t.replace(/Web\s*of\s*Science|Researcher\s*ID|WoS/gi, ' ');  // подпись бывает приклеена к значению: «ResearcherIDF-1234-2016»
  m = t.match(/(?<![A-Za-z])[A-Z]{1,3}-\d{4}-\d{4}(?![\d-])/); if (m) { o.rid = m[0]; cut(m[0]); }
  m = t.match(/(?<![\d-])\d{4}-\d{4}(?![\d-])/); if (m) { o.spin = m[0]; cut(m[0]); }   // SPIN-код РИНЦ
  m = t.match(/(?<!\d)\d{10,11}(?!\d)/); if (m) { o.scopus = m[0]; cut(m[0]); }
  t = t.replace(/https?:\/\/\S+/g, ' ').replace(/Scopus\s*ID|Scopus|SPIN-код\s*автора|SPIN-код|SPIN|Author\s*ID|ORCID|РИНЦ|AuthorID|при наличии/gi, ' ').replace(/(?<![A-Za-z])ID(?![A-Za-z])/g, ' ').replace(/(^|\s)в(?=\s|$)/g, ' ')
    .replace(/[0-9\/\\:;|()\[\]«»"]+/g, ' ').replace(/\s+/g, ' ').replace(/^[\s,.-]+|[\s,-]+$/g, '');
  if (/[a-zа-яё]{2}/i.test(t)) o.name = t;
  return o;
}

/* ---------- ФИО ----------
   Возвращает варианты прочтения: {sur, given, patr, ini}. Кириллица — «Фамилия Имя Отчество» (или «Имя Отчество Фамилия»);
   латиница из двух-трёх слов — оба порядка, первым — более длинное слово как фамилия. */
const isCyr = s => /[а-яё]/i.test(s);
function parseFIO(name) {
  const raw = String(name || '').replace(/,/g, ' ').trim(); if (!raw) return [];
  const toks = raw.split(/\s+/), full = [], ini = [];
  toks.forEach(tk => { if (/^([A-Za-zА-Яа-яЁё]\.?){1,3}$/.test(tk) && (tk.indexOf('.') >= 0 || tk.length <= 2) && !(tk.length >= 2 && !tk.includes('.') && /[a-zа-яё]/.test(tk.slice(1)))) tk.replace(/\./g, '').split('').forEach(c => ini.push(c)); else full.push(tk.replace(/\.$/, '')); });
  if (!full.length) return [];
  if (ini.length) { const sur = full.slice().sort((a, b) => b.length - a.length)[0], given = full.filter(x => x !== sur)[0] || ''; return [{ sur, given, patr: given ? ini[0] : (ini[1] || ''), ini: given ? given[0] : ini[0] }]; }
  const patrLike = w => /(вич|вна|ична|чна|ич|ovich|evich|ovna|evna|ichna)$/i.test(w);
  const mk = (sur, rest) => ({ sur, given: rest[0] || '', patr: rest[1] || '', ini: rest[0] ? rest[0][0] : '' });
  if (full.length === 1) return [mk(full[0], [])];
  if (isCyr(raw)) {
    if (full.length >= 3 && patrLike(full[1]) && !patrLike(full[2])) return [mk(full[2], [full[0], full[1]])];
    if (full.length >= 3) return [mk(full[0], full.slice(1))];
    return [mk(full[0], [full[1]]), mk(full[1], [full[0]])];
  }
  const a = mk(full[full.length - 1], full.slice(0, -1)), b = mk(full[0], full.slice(1));
  return a.sur.length >= b.sur.length ? [a, b] : [b, a];
}
/* Совпадает ли имя кандидата (как в базе: «Anna V. Sokolova») с прочтением ФИО.
   Фамилия — строго (с учётом разных транслитераций); имя — полностью, если оно есть с обеих сторон, иначе по первой букве. */
function nameMatch(candName, f) {
  const tk = String(candName || '').replace(/[.,]/g, ' ').split(/\s+/).filter(Boolean); if (!tk.length || !f || !f.sur) return false;
  const cs = canonName(f.sur); if (!cs) return false;
  for (const si of [tk.length - 1, 0]) {
    if (canonName(tk[si]) !== cs) continue;
    const rest = tk.filter((_, i) => i !== si); if (!rest.length) return true;
    const g = rest[0], gc = canonName(g);
    if (f.given && g.length >= 2) { const fc = canonName(f.given); if (gc === fc) return true; continue; }
    const fi = f.given ? canonName(f.given)[0] : (f.ini ? canonName(f.ini)[0] : ''); if (!fi) return true;
    if (gc[0] === fi) return true;
  }
  return false;
}
/* Варианты написания кириллического слова латиницей — для поиска в базах */
function translitVariants(w) {
  if (!isCyr(w)) return [w];
  const base = translit(w.toLowerCase()), cap = s => s.charAt(0).toUpperCase() + s.slice(1), out = new Set([base]);
  const alts = [[/kh/g, 'h'], [/yu/g, 'iu'], [/ya/g, 'ia'], [/shch/g, 'sch'], [/ts/g, 'tc'], [/iy$|yy$/g, 'y'], [/iy$/g, 'ii'], [/zh/g, 'j'], [/(^|[aeiou])e/g, '$1ye']];
  alts.forEach(([re, to]) => { const v = base.replace(re, to); if (v !== base) out.add(v); });
  return [...out].map(cap);
}

/* ---------- профиль автора ----------
   Кто из авторов найденных статей — руководитель. pubs — результаты judgePub (нужны work.oaAuthors).
   Если фамилия задана — все профили OpenAlex с этой фамилией; если нет — автор, общий для большинства статей. */
function detectLeader(works, variants) {
  const tally = new Map(); let n = 0;
  for (const w of works) { if (!w || !w.oaAuthors) continue; n++; const seen = new Set(); for (const a of w.oaAuthors) { if (!a.id || seen.has(a.id)) continue; seen.add(a.id); const t = tally.get(a.id) || { id: a.id, name: a.name, orcid: a.orcid || '', count: 0 }; t.count++; if (a.orcid) t.orcid = a.orcid; tally.set(a.id, t); } }
  const all = [...tally.values()].sort((a, b) => b.count - a.count);
  const sur = a => String(a.name || '').trim().split(/\s+/).pop();
  if (variants.length) { const c = all.filter(a => sameSurname(sur(a), variants)); return { works: n, cands: c, chosen: c, how: 'surname' }; }
  if (!all.length) return { works: n, cands: [], chosen: [], how: 'none' };
  const top = all[0], tie = all.filter(a => a.count === top.count);
  if (n >= 2 && top.count >= Math.max(2, Math.ceil(n * 0.6))) {
    // один и тот же человек может быть разбит в базе на несколько профилей — берём все профили с той же фамилией
    const same = tie.filter(a => sameSurname(sur(a), [canonName(sur(top))]));
    if (same.length === tie.length) { const v = [canonName(sur(top))]; return { works: n, cands: all.slice(0, 6), chosen: all.filter(a => sameSurname(sur(a), v)), how: 'auto', surname: sur(top) }; }
  }
  return { works: n, cands: all.slice(0, 6), chosen: [], how: 'unclear' };
}
/* Оценка статьи из профиля автора. ids — профили руководителя в OpenAlex (для места среди авторов) */
function judgeProfileWork(w, ids) { const r = judgeProfileWork0(w);
  if (w.authors && w.authors.length && ids && ids.length) { const i = w.authors.findIndex(a => ids.indexOf(a.id) >= 0); r.first = i === 0; r.corr = w.authors.some(a => a.corr && ids.indexOf(a.id) >= 0); r.corrKnown = w.authors.some(a => a.corr); r.pos = i < 0 ? '' : (i === 0 ? 'первый' : (i === w.authors.length - 1 ? 'последний' : (i + 1) + '-й') + ' из ' + w.authors.length);
    r.corrSt = corrOf(w.authors, ids); r.corrNames = w.authors.filter(a => a.corr && ids.indexOf(a.id) < 0).map(a => a.name).filter(Boolean); r.me = i >= 0 ? w.authors[i] : null; }
  return r; }
/* Организации автора в статье: названия, распознанные базой, иначе строки из статьи */
const instNames = me => !me ? [] : ((me.inst && me.inst.length) ? me.inst.map(x => x.name) : (me.raw || []));
function judgeProfileWork0(w) { const j = findJournal(w.issns, w.journal); const jv = journalVerdict(j, w.year, null, null); return { w, j, jv }; }

if (typeof module !== 'undefined') module.exports = { orgHit, leaderByOrg, ocrQuality, isElibList, isCapsLine, splitSiteEntries, detectSite, isUiLine, instNames, CHANGES, corrOf, orgMatch, orgTokens, findDuplicates, isPreprint, VERSION, ST, ST_NAME, norm, normIssn, lev, loadRef, findJournal, splitEntries, parseEntry, titleScore, canonName, leaderVariants, sameSurname, authorPosition, journalVerdict, sjAt, detectLeader, parseAuthorInput, orcidValid, wlAt, passFilter, parseFIO, nameMatch, translitVariants, judgePub, judgeProfileWork, matchScore, findDoi, FOUND_OK, FOUND_NEAR, cleanDoi, fmtNum, fmtIssn };

/* ===== Запросы в открытые базы (Crossref, OpenAlex) ===== */
const NET = { orcid: 'https://pub.orcid.org', orcidToken: '', useORCID: true, crossref: 'https://api.crossref.org', openalex: 'https://api.openalex.org', wl: 'https://journalrank.rcsi.science/api', oaKey: '', useOA: true, useWL: true, wlCache: new Map(), srcCache: new Map(), log: [], fetch: null, pause: 120, timeout: 20000 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* Запрос с ограничением времени: если база не ответила за ms, запрос обрывается и считается «нет связи» (раньше браузер мог ждать минутами) */
async function tfetch(url, opts, ms) {
  const f = NET.fetch || fetch; ms = ms || NET.timeout;
  const ac = typeof AbortController !== 'undefined' ? new AbortController() : null; let timer;
  const to = new Promise((_, bad) => { timer = setTimeout(() => { if (ac) ac.abort(); const e = new Error('нет ответа за ' + Math.round(ms / 1000) + ' с'); e.timeout = true; bad(e); }, ms); });
  try { return await Promise.race([f(url, Object.assign({}, opts || {}, ac ? { signal: ac.signal } : {})), to]); } finally { clearTimeout(timer); }
}
/* ----- Кеш ответов Crossref и OpenAlex в браузере (IndexedDB), с датой (удобство 2, 0.7.11).
   Повторная проверка того же списка — мгновенная, дневной лимит OpenAlex не тратится. Ключ — адрес запроса без ключа OpenAlex. ----- */
const CACHE = { on: false, days: 14, db: null, hits: 0, miss: 0, oldest: 0 };
const cacheKey = url => String(url).replace(/[&?]api_key=[^&]*/, '');
const cacheable = url => !NET.noCache && CACHE.on && (url.startsWith(NET.crossref) || url.startsWith(NET.openalex));
function cacheDb() {
  if (CACHE.db) return CACHE.db;
  CACHE.db = new Promise(ok => { try { const r = indexedDB.open('pc_cache', 1); r.onupgradeneeded = () => r.result.createObjectStore('r'); r.onsuccess = () => ok(r.result); r.onerror = () => ok(null); } catch (e) { ok(null); } });
  return CACHE.db;
}
async function cacheGet(url) {
  const db = await cacheDb(); if (!db) return null;
  return new Promise(ok => { try { const q = db.transaction('r').objectStore('r').get(cacheKey(url)); q.onsuccess = () => { const v = q.result; ok(v && Date.now() - v.t < CACHE.days * 864e5 ? v : null); }; q.onerror = () => ok(null); } catch (e) { ok(null); } });
}
async function cachePut(url, v) { const db = await cacheDb(); if (!db) return; try { db.transaction('r', 'readwrite').objectStore('r').put({ t: Date.now(), v }, cacheKey(url)); } catch (e) { } }
async function cacheClear() { const db = await cacheDb(); if (!db) return; await new Promise(ok => { try { const tx = db.transaction('r', 'readwrite'); tx.objectStore('r').clear(); tx.oncomplete = ok; tx.onerror = ok; } catch (e) { ok(); } }); }
async function cacheCount() { const db = await cacheDb(); if (!db) return 0; return new Promise(ok => { try { const q = db.transaction('r').objectStore('r').count(); q.onsuccess = () => ok(q.result); q.onerror = () => ok(0); } catch (e) { ok(0); } }); }
async function getJson(url, tries, ms) {
  if (cacheable(url)) { const c = await cacheGet(url); if (c) { CACHE.hits++; if (!CACHE.oldest || c.t < CACHE.oldest) CACHE.oldest = c.t; NET.log.push({ url, cache: c.t }); return c.v; } CACHE.miss++; }
  const v = await getJson0(url, tries, ms);
  if (cacheable(url)) cachePut(url, v);
  return v;
}
async function getJson0(url, tries, ms) {
  tries = tries || 2;
  for (let k = 0; k < tries; k++) {
    let res;
    try { res = await tfetch(url, { headers: { Accept: 'application/json' } }, ms); }
    catch (e) { NET.log.push({ url, err: String(e.message || e) }); if (k + 1 < tries) { await sleep(800); continue; } const er = new Error(e.timeout ? e.message : 'нет связи'); er.kind = 'net'; throw er; }
    NET.log.push({ url, status: res.status });
    if (res.status === 404) return null;
    if (res.status === 429 || res.status >= 500) { if (k + 1 < tries) { await sleep(2500); continue; } const er = new Error(res.status === 429 ? 'база ограничила число запросов' : 'база временно недоступна (' + res.status + ')'); er.kind = 'limit'; throw er; }
    if (!res.ok) { const er = new Error('ответ базы ' + res.status); er.kind = res.status === 401 || res.status === 403 ? 'auth' : 'http'; throw er; }
    return res.json();
  }
}
const crYear = m => { for (const k of ['issued', 'published', 'published-print', 'published-online']) { const y = m[k] && m[k]['date-parts'] && m[k]['date-parts'][0] && m[k]['date-parts'][0][0]; if (y) return y; } return null; };
function crWork(m, via) {
  return { via, source: 'Crossref', doi: (m.DOI || '').toLowerCase(), title: (m.title || [])[0] || '', journal: (m['container-title'] || [])[0] || '', issns: m.ISSN || [], year: crYear(m), type: m.type || '',
    authors: (m.author || []).map(a => ({ given: a.given || '', family: a.family || '', name: a.name || '', orcid: (a.ORCID || '').replace(/^https?:\/\/orcid\.org\//, '') })) };
}
const CR_SELECT = 'DOI,title,author,container-title,ISSN,issued,type';
/* Поиск статьи: по DOI, если он есть в записи; иначе (или если DOI в базе не найден) — по тексту записи в Crossref (10 вариантов),
   при слабом совпадении — ещё и в OpenAlex. Лучший вариант — по названию, году, изданию и первому автору (matchScore).
   Возвращает найденную статью с полем alts (до 3 следующих вариантов) или null. */
async function findWork(entry) {
  let doiMiss = '';
  if (entry.doi) { const j = await getJson(`${NET.crossref}/works/${encodeURIComponent(entry.doi)}`); if (j && j.message) return crWork(j.message, 'doi'); doiMiss = entry.doi; }
  const j = await getJson(`${NET.crossref}/works?rows=10&select=${CR_SELECT}&query.bibliographic=${encodeURIComponent(entry.query.slice(0, 400))}`);
  let cands = ((j && j.message && j.message.items) || []).map(m => crWork(m, 'search')).filter(w => w.title);
  const rank = list => { list.forEach(w => { const m = matchScore(w, entry); w.score = m.score; w.tScore = m.title; }); return list.sort((a, b) => b.score - a.score); };
  rank(cands);
  if ((!cands.length || cands[0].score < FOUND_OK) && NET.useOA) {
    const oa = await oaSearchWorks(entry.query); if (oa.length) {
      rank(oa); const seen = new Set(cands.map(w => w.doi).filter(Boolean));
      cands = rank(cands.concat(oa.filter(w => !w.doi || !seen.has(w.doi))));
    }
  }
  if (!cands.length) return null;
  const best = cands[0]; best.alts = cands.slice(1).filter(w => w.score >= 0.3).slice(0, 3); if (doiMiss) best.doiMiss = doiMiss;
  return best;
}
/* Запасной поиск статьи в OpenAlex по тексту записи (без номеров, инициалов и чисел). Ошибки не мешают: пустой список. */
async function oaSearchWorks(query) {
  const q = String(query || '').replace(/\b\d+\b/g, ' ').replace(/\b[A-ZА-ЯЁ]\.\s?/g, ' ').replace(/[|/\\()\[\]«»"“”:;,.]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 250);
  if (q.length < 12) return [];
  try {
    const j = await getJson(`${NET.openalex}/works?search=${encodeURIComponent(q)}&per-page=5&select=id,doi,title,publication_year,type,primary_location,authorships${oaParam()}`, 1);
    return ((j && j.results) || []).map(oaWork).filter(w => w.title);
  } catch (e) { if (e.kind === 'auth' || e.kind === 'limit') { NET.useOA = false; NET.oaOff = e.message; } return []; }
}
/* Статья из ответа OpenAlex в том же виде, что из Crossref */
const OA_TYPE = { article: 'journal-article', review: 'review', preprint: 'posted-content', 'book-chapter': 'book-chapter', book: 'book', dataset: 'dataset', editorial: 'editorial', letter: 'letter', erratum: 'erratum', paratext: 'paratext' };
function oaWork(w) {
  const s = w.primary_location && w.primary_location.source, au = (w.authorships || []).map(oaShip);
  const src = s ? s.type : '', ty = w.type === 'article' && src === 'conference' ? 'proceedings-article' : (OA_TYPE[w.type] || w.type || '');
  const ca = au.filter(a => a.corr);
  return { via: 'search', source: 'OpenAlex', oaId: w.id ? String(w.id).split('/').pop() : '', doi: (w.doi || '').replace(/^https?:\/\/doi\.org\//, '').toLowerCase(), title: w.title || '', journal: s ? s.display_name || '' : '', issns: s && s.issn ? s.issn : [], year: w.publication_year || null, type: ty,
    authors: au.map(a => ({ given: '', family: '', name: a.name })), oaAuthors: au, oa: true, corr: ca.length ? { known: true, names: ca.map(a => a.name).filter(Boolean) } : { known: false } };
}
const oaParam = () => NET.oaKey ? '&api_key=' + encodeURIComponent(NET.oaKey) : '';
/* Дополнение из OpenAlex: тип (article / review) и corresponding author. Ошибки не мешают основной проверке. */
async function enrichOA(work, leaderVars) {
  if (!NET.useOA || !work || !work.doi) return;
  let j; try { j = await getJson(`${NET.openalex}/works/https://doi.org/${work.doi}?select=id,type,authorships,primary_location${oaParam()}`, 1); } catch (e) { work.oaErr = e.message; if (e.kind === 'auth' || e.kind === 'limit' || e.kind === 'net') NET.useOA = false, NET.oaOff = e.message; return; }
  if (!j) return;
  work.oa = true;
  if (j.type === 'review' && work.type === 'journal-article') work.type = 'review';
  const au = j.authorships || [], corr = au.filter(a => a.is_corresponding);
  work.oaAuthors = au.map(oaShip);
  if (corr.length) work.corr = { known: true, names: corr.map(a => a.author && a.author.display_name).filter(Boolean) };
  else work.corr = { known: false };
  const src = j.primary_location && j.primary_location.source;
  if (src && src.issn && !work.issns.length) work.issns = src.issn;
  // показатель издания из OpenAlex — второй источник рядом с SCImago
  if (src && src.id) {
    const sid = String(src.id).split('/').pop();
    if (!NET.srcCache.has(sid)) { try { const sj = await getJson(`${NET.openalex}/sources/${sid}?select=id,summary_stats${oaParam()}`, 1); NET.srcCache.set(sid, sj && sj.summary_stats && typeof sj.summary_stats['2yr_mean_citedness'] === 'number' ? sj.summary_stats['2yr_mean_citedness'] : null); } catch (e) { NET.srcCache.set(sid, null); } }
    work.oaCpd = NET.srcCache.get(sid);
  }
}
/* Сайт Белого списка: уровень по ISSN. Если сайт не отвечает странице — отключается до конца проверки, остаётся справочник. */
async function enrichWL(work) {
  if (!NET.useWL || !work || !work.issns || !work.issns.length) return;
  const key = work.issns.map(normIssn).sort().join(' ');
  if (!NET.wlCache.has(key)) {
    let rec = { found: false };
    try {
      for (const x of work.issns) { const j = await getJson(`${NET.wl}/record-sources/${fmtIssn(normIssn(x))}/level`, 1); if (j && (j.id != null || j.title)) { rec = { found: true, levels: { 2023: j.level_2023 || 0, 2025: j.level_2025 || 0, 2026: j.level_2026 || 0 }, state: j.state === 'discontinued' ? 2 : (j.state === 'warning' ? 1 : 0), disc: j.datediscontinued || j.date_discontinued || '', notice: j.notice || '' }; break; } }
    } catch (e) { NET.useWL = false; NET.wlOff = e.message; return; }
    NET.wlCache.set(key, rec);
  }
  work.wlLive = NET.wlCache.get(key);
}
/* Автор статьи из OpenAlex: профиль, имя, ORCID, corresponding, организации (как распознаны базой; если не распознаны — как указаны в статье) */
const oaShip = a => ({ id: a.author && a.author.id ? String(a.author.id).split('/').pop() : '', name: (a.author && a.author.display_name) || a.raw_author_name || '', orcid: a.author && a.author.orcid ? String(a.author.orcid).replace(/^https?:\/\/orcid\.org\//, '') : '', corr: !!a.is_corresponding,
  inst: (a.institutions || []).map(x => ({ name: x.display_name || '', id: x.id ? String(x.id).split('/').pop() : '', ror: x.ror || '', cc: x.country_code || '' })).filter(x => x.name), raw: (a.raw_affiliation_strings || []).filter(Boolean) });
const cleanOrcid = s => { const m = String(s || '').toUpperCase().match(/\d{4}-?\d{4}-?\d{4}-?\d{3}[\dX]/); if (!m) return ''; const d = m[0].replace(/-/g, ''); return d.replace(/(.{4})(?=.)/g, '$1-'); };
/* Профили авторов в OpenAlex */
const OA_AUTHOR = 'id,ids,display_name,display_name_alternatives,orcid,works_count,cited_by_count,summary_stats,last_known_institutions';
const oaAuthor = a => ({ id: String(a.id).split('/').pop(), name: a.display_name || '', orcid: a.orcid ? String(a.orcid).replace(/^https?:\/\/orcid\.org\//, '') : '', works: a.works_count, cited: a.cited_by_count, h: a.summary_stats && a.summary_stats.h_index != null ? a.summary_stats.h_index : null, inst: (a.last_known_institutions || []).map(x => x.display_name).filter(Boolean).join('; '), instIds: (a.last_known_institutions || []).map(x => x.id ? String(x.id).split('/').pop() : '').filter(Boolean), topics: (a.topics || []).slice(0, 6).map(t => ({ name: t.display_name || '', sub: (t.subfield && t.subfield.display_name) || '' })).filter(t => t.name || t.sub), country: (a.last_known_institutions || []).map(x => x.country_code).filter(Boolean).join(' '), alt: a.display_name_alternatives || [], scopus: a.ids && a.ids.scopus ? (String(a.ids.scopus).match(/(\d{6,})(?!.*\d{6,})/) || [])[1] || '' : '' });
async function authorInfo(ids) {
  const out = [];
  for (const id of ids.slice(0, 8)) { try { const j = await getJson(`${NET.openalex}/authors/${id}?select=${OA_AUTHOR}${oaParam()}`, 1); if (j) out.push(oaAuthor(j)); } catch (e) { } }
  return out;
}
/* Поиск автора по имени */
/* Поиск автора по имени. Для выбора из найденных берутся и основные темы автора; если база не примет поле topics — без него. */
async function searchAuthors(name) {
  const url = sel => `${NET.openalex}/authors?search=${encodeURIComponent(name)}&per-page=10&select=${sel}${oaParam()}`;
  let j; try { j = await getJson(url(OA_AUTHOR + ',topics'), 1); } catch (e) { if (e.kind !== 'http') throw e; j = await getJson(url(OA_AUTHOR), 1); }
  return ((j && j.results) || []).map(oaAuthor);
}
/* Русские названия организаций из OpenAlex (один запрос на все). ids — I…; возвращает {id: название по-русски}. Ошибки — пустой ответ. */
async function instRu(ids) {
  ids = [...new Set(ids)].slice(0, 50); if (!ids.length || !NET.useOA) return {};
  try {
    const j = await getJson(`${NET.openalex}/institutions?filter=openalex:${ids.join('|')}&per-page=50&select=id,display_name,international${oaParam()}`, 1);
    const out = {}; ((j && j.results) || []).forEach(x => { const ru = x.international && x.international.display_name && x.international.display_name.ru; if (ru) out[String(x.id).split('/').pop()] = ru; }); return out;
  } catch (e) { return {}; }
}
/* Точный поиск автора по ORCID. null — в базе нет. */
async function authorByOrcid(orcid) {
  const j = await getJson(`${NET.openalex}/authors/https://orcid.org/${orcid}?select=${OA_AUTHOR}${oaParam()}`, 1);
  return j && j.id ? oaAuthor(j) : null;
}
/* Реестр ORCID: поиск ORCID по внешнему идентификатору (Scopus ID, ResearcherID) или по имени.
   Возвращает {list:[{orcid,name,inst}], err}. Если реестр не отвечает странице — отключается до конца сеанса, поиск идёт дальше. */
async function orcidSearch(q, ms) {
  if (!NET.useORCID) return { list: [], err: NET.orcidOff || 'реестр ORCID отключён' };
  const url = `${NET.orcid}/v3.0/expanded-search/?q=${encodeURIComponent(q)}&rows=10`, h = { Accept: 'application/json' };
  if (NET.orcidToken) h.Authorization = 'Bearer ' + NET.orcidToken;
  let res; try { res = await tfetch(url, { headers: h }, ms); } catch (e) { NET.log.push({ url, err: String(e.message || e) }); NET.useORCID = false; NET.orcidOff = 'реестр ORCID не отвечает этой странице (' + (e.timeout ? e.message : 'нет связи или запрет запросов с чужих страниц') + ')'; return { list: [], err: NET.orcidOff }; }
  NET.log.push({ url, status: res.status });
  if (res.status === 401 || res.status === 403) { NET.useORCID = false; NET.orcidOff = 'реестр ORCID требует токен (поле «Токен ORCID» в настройках)'; return { list: [], err: NET.orcidOff }; }
  if (!res.ok) return { list: [], err: 'реестр ORCID ответил ' + res.status };
  const j = await res.json(), r = (j && j['expanded-result']) || [];
  return { list: r.map(x => ({ orcid: x['orcid-id'], name: [x['given-names'], x['family-names']].filter(Boolean).join(' '), inst: (x['institution-name'] || []).slice(0, 3).join('; ') })) };
}
/* Идентификаторы, привязанные к записи ORCID (Scopus Author ID, ResearcherID и др.). Реестр официально требует токен /read-public;
   без него пробуем так же. Возвращает {list:[{type, value, url}], err}. */
async function orcidExternalIds(orcid) {
  if (!NET.useORCID) return { list: [], err: NET.orcidOff || 'реестр ORCID отключён' };
  const url = `${NET.orcid}/v3.0/${orcid}/external-identifiers`, h = { Accept: 'application/json' };
  if (NET.orcidToken) h.Authorization = 'Bearer ' + NET.orcidToken;
  let res; try { res = await tfetch(url, { headers: h }); } catch (e) { NET.log.push({ url, err: String(e.message || e) }); return { list: [], err: 'реестр ORCID не отвечает этой странице' + (e.timeout ? ' (' + e.message + ')' : '') }; }
  NET.log.push({ url, status: res.status });
  if (res.status === 401 || res.status === 403) return { list: [], err: 'реестр ORCID требует токен (поле «Токен ORCID» в настройках)' };
  if (res.status === 404) return { list: [], err: 'запись ORCID не найдена' };
  if (!res.ok) return { list: [], err: 'реестр ORCID ответил ' + res.status };
  const j = await res.json(), r = (j && j['external-identifier']) || [];
  return { list: r.map(x => ({ type: x['external-id-type'] || '', value: String(x['external-id-value'] || '').trim(), url: x['external-id-url'] && x['external-id-url'].value || '' })).filter(x => x.value) };
}
/* Поиск автора по Scopus ID. База может такой поиск не поддерживать — тогда {err}. */
async function authorByScopus(sid) {
  try { const j = await getJson(`${NET.openalex}/authors?filter=scopus:${sid}&per-page=5&select=${OA_AUTHOR}${oaParam()}`, 1); return { list: ((j && j.results) || []).map(oaAuthor) }; }
  catch (e) { return { list: [], err: e.message }; }
}
/* Все статьи и обзоры автора (за все годы). who: {ids:[профили OpenAlex]} или {orcid}. Сначала OpenAlex, по ORCID запасной путь — Crossref. */
async function authorWorks(who, yearFrom) {
  if (typeof who === 'string') who = { orcid: who };
  const orcid = who.orcid || '';
  const out = { works: [], source: '', partial: false, err: '', capped: false };
  if (NET.useOA) {
    try {
      let cursor = '*', n = 0;
      while (cursor && n < 10) {
        const f = who.ids && who.ids.length ? 'author.id:' + who.ids.join('|') : 'author.orcid:' + orcid;
        const j = await getJson(`${NET.openalex}/works?filter=${f},type:article|review&sort=publication_year:desc&per-page=200&cursor=${encodeURIComponent(cursor)}&select=id,doi,title,publication_year,type,primary_location,authorships${oaParam()}`, 1);
        if (!j) break;
        for (const w of j.results || []) { const s = w.primary_location && w.primary_location.source; out.works.push({ oaId: w.id ? String(w.id).split('/').pop() : '', doi: (w.doi || '').replace(/^https?:\/\/doi\.org\//, '').toLowerCase(), title: w.title || '', year: w.publication_year, type: w.type, journal: s ? s.display_name : '', issns: s && s.issn ? s.issn : [], srcType: s ? s.type : '', authors: (w.authorships || []).map(oaShip) }); }
        cursor = j.meta && j.meta.next_cursor && (j.results || []).length ? j.meta.next_cursor : null; n++;
      }
      out.capped = !!cursor; out.source = 'OpenAlex'; return out;
    } catch (e) { out.err = 'OpenAlex: ' + e.message; out.works = []; }
  }
  if (!orcid) { const er = new Error(out.err || 'OpenAlex выключен, а без ORCID профиль взять негде'); throw er; }
  const j = await getJson(`${NET.crossref}/works?filter=orcid:${orcid},type:journal-article&rows=1000&select=${CR_SELECT}`);
  const items = (j && j.message && j.message.items) || [];
  out.works = items.map(m => { const w = crWork(m, 'orcid'); return { doi: w.doi, title: w.title, year: w.year, type: w.type, journal: w.journal, issns: w.issns }; });
  out.source = 'Crossref'; out.partial = true; return out;
}
/* Проверка связи: по одному короткому запросу в каждую базу, все одновременно, не дольше 12 с каждая.
   onEach(i, результат) вызывается по мере ответов; итог — в прежнем порядке: Crossref, Белый список, ORCID, OpenAlex */
const PING_MS = 12000;
async function pingAll(onEach) {
  const res = [];
  const one = async (i, name, url, ok) => { const t = Date.now(); let r; try { const j = await getJson(url, 1, PING_MS); r = { name, ok: !!(j && ok(j)), ms: Date.now() - t, msg: j && ok(j) ? 'отвечает' : 'ответ не того вида' }; } catch (e) { r = { name, ok: false, ms: Date.now() - t, msg: e.message }; } res[i] = r; if (onEach) onEach(i, r); };
  const orc = async () => { const t = Date.now(); const r = await orcidSearch('orcid:0000-0002-1825-0097', PING_MS); res[2] = { name: 'Реестр ORCID (поиск автора по Scopus ID, ResearcherID и имени)', ok: !r.err && r.list.length > 0, ms: Date.now() - t, msg: r.err || (r.list.length ? 'отвечает' : 'ответ не того вида') }; NET.useORCID = true; NET.orcidOff = ''; if (onEach) onEach(2, res[2]); };
  await Promise.all([
    one(0, 'Crossref (поиск статей)', `${NET.crossref}/works?rows=1&select=DOI,title&query.bibliographic=nature`, j => j.message && Array.isArray(j.message.items)),
    one(1, 'Сайт Белого списка (свежие уровни изданий)', `${NET.wl}/record-sources/0028-0836/level`, j => j.id != null || !!j.title),
    orc(),
    one(3, 'OpenAlex (тип статьи, corresponding author, профиль автора)', `${NET.openalex}/works?per-page=1&select=id${oaParam()}`, j => Array.isArray(j.results)),
  ]);
  return res;
}
/* ---------- Самопроверка: известные публикации с заранее записанными ответами ---------- */
const SELF = [
  { how: 'doi', q: '10.1126/science.1102896', doi: '10.1126/science.1102896', year: 2004, first: 'Novoselov', journal: 'Science' },
  { how: 'doi', q: '10.1038/s41586-021-03819-2', doi: '10.1038/s41586-021-03819-2', year: 2021, first: 'Jumper', journal: 'Nature', corr: 'Jumper' },
  { how: 'doi', q: '10.1103/PhysRevLett.116.061102', doi: '10.1103/physrevlett.116.061102', year: 2016, first: 'Abbott', journal: 'Physical Review Letters' },
  { how: 'doi', q: '10.1038/nmat1849', doi: '10.1038/nmat1849', year: 2007, first: 'Geim', journal: 'Nature Materials' },
  { how: 'doi', q: '10.1038/nature14539', doi: '10.1038/nature14539', year: 2015, first: 'LeCun', journal: 'Nature' },
  { how: 'doi', q: '10.1103/PhysRevB.54.11169', doi: '10.1103/physrevb.54.11169', year: 1996, first: 'Kresse', journal: 'Physical Review B' },
  { how: 'doi', q: '10.1103/PhysRevLett.77.3865', doi: '10.1103/physrevlett.77.3865', year: 1996, first: 'Perdew', journal: 'Physical Review Letters' },
  { how: 'doi', q: '10.1056/NEJMoa2034577', doi: '10.1056/nejmoa2034577', year: 2020, first: 'Polack', journal: 'New England Journal of Medicine' },
  { how: 'текст', q: 'Jumper J., Evans R., Pritzel A. et al. Highly accurate protein structure prediction with AlphaFold. Nature. 2021', doi: '10.1038/s41586-021-03819-2', year: 2021, first: 'Jumper', journal: 'Nature' },
  { how: 'текст', q: 'Novoselov K.S., Geim A.K., Morozov S.V. Electric field effect in atomically thin carbon films. Science. 2004', doi: '10.1126/science.1102896', year: 2004, first: 'Novoselov', journal: 'Science' },
  { how: 'текст', q: 'LeCun Y., Bengio Y., Hinton G. Deep learning. Nature. 2015', doi: '10.1038/nature14539', year: 2015, first: 'LeCun', journal: 'Nature' },
  { how: 'текст', q: 'Perdew J.P., Burke K., Ernzerhof M. Generalized gradient approximation made simple. Physical Review Letters. 1996', doi: '10.1103/physrevlett.77.3865', year: 1996, first: 'Perdew', journal: 'Physical Review Letters' },
];
async function runSelfCheck(onStep) {
  const out = [];
  for (let i = 0; i < SELF.length; i++) {
    const c = SELF[i]; if (onStep) onStep(i, SELF.length); const r = { c, checks: [], ok: false, err: '' };
    try {
      const e = parseEntry(c.q); if (c.how === 'doi') e.doi = c.doi; else e.doi = null;
      const w = await findWork(e);
      if (!w) r.err = 'не найдена';
      else {
        const j = findJournal(w.issns, w.journal); const jt = j.sj ? j.sj.title : w.journal;
        r.got = { doi: w.doi, year: w.year, first: w.authors[0] ? w.authors[0].family : '', journal: jt };
        r.checks = [['DOI', w.doi === c.doi], ['год', w.year === c.year], ['первый автор', sameSurname(r.got.first, [canonName(c.first)])], ['издание', norm(jt) === norm(c.journal)], ['издание найдено в SCImago по ISSN', j.sjHow === 'issn']];
        r.ok = r.checks.every(x => x[1]);
        // corresponding author — справочно, в итог не входит: зависит от того, разметила ли его база
        if (c.corr) { await enrichOA(w, []); const names = (w.oaAuthors || []).filter(x => x.corr).map(x => x.name); r.soft = ['corresponding (справочно)', names.some(n => sameSurname(n.trim().split(/\s+/).pop(), [canonName(c.corr)])), names.join(', ') || 'в базе не указан']; }
      }
    } catch (er) { r.err = er.message; }
    out.push(r); await sleep(NET.pause);
  }
  return out;
}
if (typeof module !== 'undefined') module.exports = { CACHE, cacheKey, instRu, oaWork, oaSearchWorks, tfetch, PING_MS, oaShip, orcidExternalIds, NET, getJson, crWork, findWork, enrichOA, enrichWL, authorInfo, searchAuthors, authorByOrcid, authorByScopus, orcidSearch, runSelfCheck, SELF, authorWorks, cleanOrcid, pingAll };

/* ===== Распознавание снимка списка (Tesseract внутри страницы, сеть не используется) ===== */
let _ocr = null;
function embedded(id) { const el = document.getElementById(id); if (!el) return null; const bin = atob(el.textContent.trim()); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
/* Две сборки: одна страница со всем внутри (распознавание встроено) и сайт (файлы распознавания в папке ocr/, загружаются при первом снимке и кешируются браузером) */
const SITE_OCR = () => typeof window !== 'undefined' && window.PC_SITE === true;
const ocrAvailable = () => SITE_OCR() || (typeof Tesseract !== 'undefined' && !!document.getElementById('ocr-core'));
function loadScript(src) { return new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => bad(new Error('не загрузился ' + src)); document.head.appendChild(s); }); }
/* Два распознавателя — русский и английский. Смешанная модель путает латиницу с кириллицей («Nature» → «Машге»),
   поэтому каждый фрагмент читается обоими и берётся более уверенный результат. */
async function getOcr() {
  if (_ocr) return _ocr;
  if (SITE_OCR()) {
    const base = new URL('ocr/', location.href).href;
    if (typeof Tesseract === 'undefined') await loadScript(base + 'tesseract.min.js?v=' + VERSION);
    const mk = l => Tesseract.createWorker(l, 1, { workerPath: base + 'worker.min.js', corePath: base, langPath: base.replace(/\/$/, ''), gzip: true, errorHandler: e => console.warn('OCR:', e) });
    _ocr = { eng: await mk('eng'), rus: await mk('rus') };
    return _ocr;
  }
  const dec = new TextDecoder();
  const pre = 'const __L = {rus: "' + document.getElementById('ocr-rus').textContent.trim() + '", eng: "' + document.getElementById('ocr-eng').textContent.trim() + '"};\n' +
    'self.fetch = function (u, o) { const m = String(u && u.url || u).match(/(rus|eng)\\.traineddata/); if (m) { const bin = atob(__L[m[1]]); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return Promise.resolve(new Response(a, { status: 200 })); } return Promise.reject(new Error("offline")); };\n';
  const src = pre + dec.decode(embedded('ocr-core')) + '\n;self.TesseractCore = (typeof TesseractCoreWASM !== "undefined") ? TesseractCoreWASM : TesseractCore;\n' + dec.decode(embedded('ocr-worker'));
  const url = URL.createObjectURL(new Blob([src], { type: 'application/javascript' }));
  const mk = l => Tesseract.createWorker(l, 1, { workerPath: url, workerBlobURL: false, langPath: 'https://offline.invalid', cacheMethod: 'none', gzip: true, errorHandler: e => console.warn('OCR:', e) });
  _ocr = { eng: await mk('eng'), rus: await mk('rus') };
  return _ocr;
}
async function readBoth(w, cv, psm) {
  const out = [];
  for (const l of ['eng', 'rus']) { await w[l].setParameters({ tessedit_pageseg_mode: psm }); const { data } = await w[l].recognize(cv); out.push({ text: data.text, conf: data.confidence }); }
  return out[1].conf > out[0].conf + 2 ? out[1] : out[0];
}
/* Страница целиком: каждая строка читается обеими моделями и берётся лучшая — на одной странице бывают
   и русские, и английские записи (eLibrary), а модель для всей страницы одна портила половину строк (0.7.11).
   Абзацы — по английскому прочтению: пустая строка между ними сохраняется (по ней делится список без номеров). */
async function readLines(w, cv, psm) {
  const res = {};
  for (const l of ['eng', 'rus']) { await w[l].setParameters({ tessedit_pageseg_mode: psm }); const { data } = await w[l].recognize(cv, {}, { text: true, blocks: true }); res[l] = data; }
  const paras = d => (d.blocks || []).flatMap(b => b.paragraphs || []);
  const E = paras(res.eng), R = (res.rus.lines || []);
  if (!E.length || !R.length) return res.rus.confidence > res.eng.confidence + 2 ? { text: res.rus.text, conf: res.rus.confidence } : { text: res.eng.text, conf: res.eng.confidence };
  const ov = (a, b) => Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)) / Math.max(1, Math.min(a.y1 - a.y0, b.y1 - b.y0));
  const val = ln => (ln.confidence || 0) * (0.5 + 0.5 * ocrQuality(ln.text).ratio);
  const used = new Set(), out = []; let cs = 0, cn = 0;
  for (const p of E) {
    const lines = [];
    for (const le of p.lines || []) {
      let best = null, bo = 0.5; R.forEach((lr, k) => { const o = ov(le.bbox, lr.bbox); if (o > bo && !used.has(k)) { bo = o; best = k; } });
      let pick = le; if (best != null) { used.add(best); if (val(R[best]) > val(le)) pick = R[best]; }
      const t = pick.text.replace(/\s+$/, ''); if (t.trim()) { lines.push(t); cs += pick.confidence || 0; cn++; }
    }
    if (lines.length) out.push(lines.join('\n'));
  }
  return { text: out.join('\n\n'), conf: cn ? cs / cn : 0 };
}
/* Снимок увеличивается до ширины не меньше 2400 точек: мелкий текст иначе не читается.
   Затем предобработка (правка 4, 0.7.11): серый по минимуму каналов, растяжение контраста, повышение резкости, чёрно-белое по Otsu. */
async function toCanvas(blob, raw) {
  const bmp = await createImageBitmap(blob); const k = Math.min(4, Math.max(1, 2400 / bmp.width));
  const cv = document.createElement('canvas'); cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
  const cx = cv.getContext('2d', { willReadFrequently: true }); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); cx.imageSmoothingQuality = 'high'; cx.drawImage(bmp, 0, 0, cv.width, cv.height);
  if (!raw) preprocess(cx, cv.width, cv.height);
  return { cv, cx, small: bmp.width < 1200, width: bmp.width };
}
/* Синий и фиолетовый текст ссылок на светло-сером фоне (eLibrary) по яркости получается серым и тонет в фоне;
   по минимуму каналов (min(R,G,B)) он становится почти чёрным, а светлый фон остаётся светлым. */
function preprocess(cx, W, H) {
  const img = cx.getImageData(0, 0, W, H), d = img.data, n = W * H, g = new Float32Array(n);
  for (let i = 0, j = 0; i < n; i++, j += 4) g[i] = Math.min(d[j], d[j + 1], d[j + 2]);
  // растяжение контраста: 1 % самых тёмных — чёрное, 1 % самых светлых — белое
  const hist = new Uint32Array(256); for (let i = 0; i < n; i++) hist[g[i] | 0]++;
  let lo = 0, hi = 255, acc = 0; for (; lo < 255; lo++) { acc += hist[lo]; if (acc > n * 0.01) break; } acc = 0; for (; hi > 0; hi--) { acc += hist[hi]; if (acc > n * 0.01) break; }
  if (hi - lo > 20) { const s = 255 / (hi - lo); for (let i = 0; i < n; i++) g[i] = Math.max(0, Math.min(255, (g[i] - lo) * s)); }
  // резкость: изображение + 0,8 × (изображение − размытое 5×5)
  const b = boxBlur(g, W, H, 2), out = new Uint8ClampedArray(n); for (let i = 0; i < n; i++) out[i] = g[i] + 0.8 * (g[i] - b[i]);
  // порог Otsu
  hist.fill(0); for (let i = 0; i < n; i++) hist[out[i]]++;
  let sum = 0; for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sB = 0, wB = 0, best = 0, th = 128; for (let t = 0; t < 256; t++) { wB += hist[t]; if (!wB) continue; const wF = n - wB; if (!wF) break; sB += t * hist[t]; const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) * (mB - mF); if (v > best) { best = v; th = t; } }
  // светлый текст на тёмном фоне — инвертировать: распознавателю нужен тёмный текст на светлом
  let dark = 0; for (let i = 0; i < n; i++) if (out[i] <= th) dark++; const inv = dark > n * 0.5;
  for (let i = 0, j = 0; i < n; i++, j += 4) { let v = out[i] <= th ? 0 : 255; if (inv) v = 255 - v; d[j] = d[j + 1] = d[j + 2] = v; d[j + 3] = 255; }
  cx.putImageData(img, 0, 0);
}
function boxBlur(src, W, H, r) {
  const tmp = new Float32Array(W * H), out = new Float32Array(W * H), k = 2 * r + 1;
  for (let y = 0; y < H; y++) { let s = 0; const o = y * W; for (let x = -r; x <= r; x++) s += src[o + Math.min(W - 1, Math.max(0, x))]; for (let x = 0; x < W; x++) { tmp[o + x] = s / k; s += src[o + Math.min(W - 1, x + r + 1)] - src[o + Math.max(0, x - r)]; } }
  for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[Math.min(H - 1, Math.max(0, y)) * W + x]; for (let y = 0; y < H; y++) { out[y * W + x] = s / k; s += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x]; } }
  return out;
}
/* Ищет линии таблицы: длинные непрерывные тёмные отрезки. Возвращает границы строк и столбцов или null. */
function findGrid(cx, W, H) {
  const d = cx.getImageData(0, 0, W, H).data; let T = 205; const dark = (x, y) => { const i = (y * W + x) * 4; return d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11 < T; };
  const group = a => { const g = []; a.forEach(v => { const l = g[g.length - 1]; if (l && v - l[1] <= 3) l[1] = v; else g.push([v, v]); }); return g; };
  const hs = []; for (let y = 0; y < H; y++) { let run = 0, best = 0, gap = 0; for (let x = 0; x < W; x++) { if (dark(x, y)) { run += gap + 1; gap = 0; if (run > best) best = run; } else if (run && gap < 2) gap++; else { run = 0; gap = 0; } } if (best >= W * 0.5) hs.push(y); }
  const hl = group(hs); if (hl.length < 3) return null;
  const top = hl[0][0], bot = hl[hl.length - 1][1], vs = [];
  for (let x = 0; x < W; x++) { let run = 0, best = 0, gap = 0; for (let y = top; y <= bot; y++) { if (dark(x, y)) { run += gap + 1; gap = 0; if (run > best) best = run; } else if (run && gap < 2) gap++; else { run = 0; gap = 0; } } if (best >= (bot - top) * 0.6) vs.push(x); }
  const vl = group(vs); if (vl.length < 2) return null;
  const spans = l => l.slice(0, -1).map((a, i) => [a[1] + 1, l[i + 1][0] - 1]).filter(s => s[1] - s[0] > 12);
  T = 150; return { rows: spans(hl), cols: spans(vl), dark };
}
async function ocrImage(blob, raw) {
  const { cv, cx, small } = await toCanvas(blob, raw); const w = await getOcr(); const g = findGrid(cx, cv.width, cv.height);
  if (g && g.rows.length >= 1 && g.cols.length >= 3) {
    // таблица: каждая ячейка читается отдельно, строка таблицы становится одной строкой текста
    const lines = []; let conf = 0, nc = 0, seq = 0;
    for (const [y0, y1] of g.rows) {
      const cells = [];
      for (const [x0, x1] of g.cols) {
        const m = 4, cw = x1 - x0 - 2 * m, ch = y1 - y0 - 2 * m; if (cw < 6 || ch < 6) { cells.push(''); continue; }
        let ink = 0; for (let y = y0 + m; y < y1 - m; y += 2) for (let x = x0 + m; x < x1 - m; x += 2) if (g.dark(x, y)) ink++;
        if (ink < 8) { cells.push(''); continue; }
        const c = document.createElement('canvas'), pad = 14; c.width = cw + 2 * pad; c.height = ch + 2 * pad; const c2 = c.getContext('2d'); c2.fillStyle = '#fff'; c2.fillRect(0, 0, c.width, c.height); c2.drawImage(cv, x0 + m, y0 + m, cw, ch, pad, pad, cw, ch);
        const data = await readBoth(w, c, '6'); const t = data.text.replace(/-\n(?=[a-zа-яё])/gi, '').replace(/\s+/g, ' ').trim(); cells.push(t); if (t) { conf += data.conf; nc++; }
      }
      const rest = cells.slice(1).filter(Boolean).join(' | '); if (!rest) continue;
      let first = cells[0]; const narrow = g.cols[0][1] - g.cols[0][0] < cv.width * 0.08;
      if (/^\d{1,2}\s*[.)]?$/.test(first)) { seq = parseInt(first); first = seq + '.'; }
      else if (narrow && seq > 0 && !/[a-zа-яё]{2}/i.test(first)) { seq++; first = seq + '.'; } // номер не прочитан — продолжаем нумерацию
      else if (narrow && seq === 0 && lines.length && !/[a-zа-яё]{2}/i.test(first)) { seq = 1; first = '1.'; }
      lines.push((first ? first + ' ' : '') + rest);
    }
    if (lines.length) { const text = lines.join('\n'); return { text, conf: nc ? Math.round(conf / nc) : 0, small, table: true, q: ocrQuality(text) }; }
  }
  const data = await readLines(w, cv, '3');
  return { text: data.text, conf: Math.round(data.conf), small, table: false, q: ocrQuality(data.text) };
}

/* Снимок с идентификаторами автора: нужны только латиница и цифры, поэтому читается английской моделью, ячейки таблицы — по отдельности */
async function ocrIds(blob) {
  const { cv, cx } = await toCanvas(blob); const w = await getOcr(); const g = findGrid(cx, cv.width, cv.height); const parts = [];
  const read = async (c, psm) => { await w.eng.setParameters({ tessedit_pageseg_mode: psm }); const { data } = await w.eng.recognize(c); return data.text; };
  if (g && g.rows.length && g.cols.length >= 2) {
    for (const [y0, y1] of g.rows) for (const [x0, x1] of g.cols) {
      const m = 4, cw = x1 - x0 - 2 * m, ch = y1 - y0 - 2 * m; if (cw < 6 || ch < 6) continue;
      const c = document.createElement('canvas'), pad = 14; c.width = cw + 2 * pad; c.height = ch + 2 * pad; const c2 = c.getContext('2d'); c2.fillStyle = '#fff'; c2.fillRect(0, 0, c.width, c.height); c2.drawImage(cv, x0 + m, y0 + m, cw, ch, pad, pad, cw, ch);
      parts.push(await read(c, '6'));
    }
  }
  parts.push(await read(cv, '6')); parts.push(await read(cv, '11'));
  return parts.join('\n');
}

/* ===== Удобство (0.7.11): прошлая проверка в браузере, отметки «проверено», сортировка, выгрузка файлом, печать =====
   Всё хранится только в этом браузере (localStorage); в интернет ничего не уходит. */
const LS = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } },
};

/* ----- 1. Не терять работу: состояние сохраняется после каждого действия ----- */
function stateNow(withProfile) {
  const au = Object.assign({}, AU);
  if (au.prof && !au.prof.err) au.prof = withProfile ? { aw: au.prof.aw, ids: au.prof.ids, how: au.prof.how, info: au.prof.info } : null;
  return { v: 1, t: Date.now(), list: $('list').value, author: $('author').value, org: $('org').value,
    W: W.entries ? { entries: W.entries, works: W.works.map(w => w === undefined ? '__u' : w), netDown: W.netDown, auto: W.auto, numbered: W.numbered, stopped: !!W.stopped } : null,
    AU: au.prof || au.cands || au.orcCands || au.parsed ? au : null, FLT, SORT };
}
let _saveT = null;
function saveState(soon) {
  if (soon) { clearTimeout(_saveT); _saveT = setTimeout(() => saveState(), 800); return; }
  if (RESTORE_PENDING) return;  // пока человек не решил, продолжать ли прошлую — не затирать её
  if (!LS.set('pc_state', stateNow(true))) LS.set('pc_state', Object.assign(stateNow(false), { profDropped: true }));
}
let RESTORE_PENDING = false;
function offerRestore() {
  const st = LS.get('pc_state'); if (!st || (!st.W && !st.AU)) return;
  const d = new Date(st.t), when = d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const what = [st.W ? 'публикаций в списке: ' + st.W.entries.length : '', st.AU && st.AU.prof && st.AU.prof.info ? 'автор ' + ((st.AU.prof.info[0] || {}).name || '') : (st.author ? 'автор «' + st.author + '»' : '')].filter(Boolean).join(', ');
  RESTORE_PENDING = true;
  const b = $('resume'); b.style.display = 'flex';
  b.innerHTML = `<b>Прошлая проверка от ${esc(when)}</b><span class="dim">${esc(what)}</span><button id="resYes">Продолжить прошлую проверку</button><button id="resNo" class="sec">Начать заново</button>`;
  $('resYes').onclick = () => { RESTORE_PENDING = false; b.style.display = 'none'; restoreState(st); };
  $('resNo').onclick = () => { RESTORE_PENDING = false; b.style.display = 'none'; LS.del('pc_state'); };
}
function restoreState(st) {
  $('list').value = st.list || ''; $('author').value = st.author || ''; if (st.org != null) $('org').value = st.org; countEntries(); showParsed();
  if (st.FLT) { FLT.list = Object.assign(FLT0(), st.FLT.list); FLT.au = Object.assign(FLT0(), st.FLT.au); }
  if (st.SORT) Object.assign(SORT, st.SORT);
  AU = newS();
  if (st.AU) { AU = Object.assign(newS(), st.AU); if (AU.prof && !AU.prof.err && AU.prof.aw) AU.prof.js = AU.prof.aw.works.map(w => judgeProfileWork(w, AU.prof.ids)); }
  if (st.profDropped && $('author').value.trim()) AU.msgs = (AU.msgs || []).concat(['публикации автора не поместились в память браузера — нажмите «Найти автора» (ответы баз возьмутся из кеша)']);
  if (st.W) { W.entries = st.W.entries; W.works = st.W.works.map(w => w === '__u' ? undefined : w); W.netDown = st.W.netDown; W.auto = st.W.auto; W.numbered = st.W.numbered; W.stopped = st.W.stopped; rejudge(); }
  renderAll(); retryVis(); goTo(W.entries ? 'outList' : 'outAuthor');
}

/* ----- 10. Отметка «проверено» по строке ----- */
let MARKS = LS.get('pc_marks') || {};
const markKeyL = p => 'L:' + ((p.work && p.work.doi) || norm(p.entry.raw).slice(0, 90));
const markKeyA = x => 'A:' + (x.w.doi || x.w.oaId || norm(x.w.title).slice(0, 90));
function setMark(k, on) { if (on) MARKS[k] = Date.now(); else delete MARKS[k]; LS.set('pc_marks', MARKS); renderAll(); }
const markBox = k => `<label class="mk noprint" title="отметка для себя — сохраняется в этом браузере"><input type="checkbox" ${MARKS[k] ? 'checked' : ''} onchange="setMark('${esc(k).replace(/'/g, '&#39;')}',this.checked)">проверено</label>`;

/* ----- 9. Сортировка кликом по заголовку ----- */
const SORT = { list: { k: '', dir: 0 }, au: { k: '', dir: 0 } };
const SORT_FIRST = { year: -1, q: 1, wl: 1, if: -1 };  // первый клик: годы и импакт-фактор — по убыванию, квартиль и уровень — Q1 и 1 сверху
function setSort(id, k) { const s = SORT[id]; if (s.k !== k) { s.k = k; s.dir = SORT_FIRST[k]; } else if (s.dir === SORT_FIRST[k]) s.dir = -s.dir; else { s.k = ''; s.dir = 0; } id === 'list' ? renderList() : renderAuthor(); saveState(true); }
function sortTh(id, k, html, style) { const s = SORT[id], on = s.k === k; return `<th class="sort"${style ? ` style="${style}"` : ''} onclick="setSort('${id}','${k}')" title="сортировать — клик; ещё клик — обратно; третий — как было">${html}${on ? ` <span class="arr">${s.dir > 0 ? '▲' : '▼'}</span>` : ''}</th>`; }
/* значения для сортировки; пустое — всегда в конце */
function sortRows(rows, id, keyOf) {
  const s = SORT[id]; if (!s.k) return rows;
  const val = r => { const k = keyOf(r); const v = { year: k.y, q: k.qY || null, wl: k.excl ? null : (k.wl || null), if: k.cpd }[s.k]; return v == null || v === 0 ? null : v; };
  return rows.map((r, i) => ({ r, i, v: val(r) })).sort((a, b) => a.v == null && b.v == null ? a.i - b.i : a.v == null ? 1 : b.v == null ? -1 : (a.v - b.v) * s.dir || a.i - b.i).map(x => x.r);
}

/* ----- 5. Выгрузка файлом: Excel (.xlsx без сторонних библиотек) и CSV для русского Excel ----- */
function download(name, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }
const today = () => new Date().toISOString().slice(0, 10);
const cellTxt = v => v == null ? '' : (typeof v === 'number' && !Number.isInteger(v) ? fmtNum(v) : String(v));
function csvBlob(rows) {
  const q = v => { const t = cellTxt(v).replace(/\r?\n/g, ' '); return /[";\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
  return new Blob(['﻿' + rows.map(r => r.map(q).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
}
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = u => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
/* zip без сжатия: несколько файлов XML — этого достаточно для .xlsx */
function zipStore(files) {
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  const u16 = v => [v & 255, (v >>> 8) & 255], u32 = v => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
  for (const [name, text] of files) {
    const nm = enc.encode(name), data = enc.encode(text), crc = crc32(data);
    const head = [...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nm.length), ...u16(0)];
    parts.push(new Uint8Array([...u32(0x04034b50), ...head]), nm, data);
    cen.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...head, ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), nm);
    off += 30 + nm.length + data.length;
  }
  const cs = cen.reduce((s, x) => s + x.length, 0);
  return new Blob(parts.concat(cen, [new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(cs), ...u32(off), ...u16(0)])]), { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
function xlsxBlob(sheet, rows) {
  const x = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const col = i => { let s = ''; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = (i - m - 1) / 26; } return s; };
  const ncol = Math.max(1, ...rows.map(r => r.length));
  const width = i => Math.min(60, Math.max(8, ...rows.slice(0, 200).map(r => cellTxt(r[i]).length * 0.9)));
  const body = rows.map((r, ri) => `<row r="${ri + 1}">` + r.map((v, ci) => { const ref = col(ci) + (ri + 1), st = ri === 0 ? ' s="1"' : '';
    if (typeof v === 'number' && isFinite(v)) return `<c r="${ref}"${st}><v>${v}</v></c>`;
    const t = cellTxt(v); return t ? `<c r="${ref}" t="inlineStr"${st}><is><t xml:space="preserve">${x(t)}</t></is></c>` : ''; }).join('') + '</row>').join('');
  const ws = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${Array.from({ length: ncol }, (_, i) => `<col min="${i + 1}" max="${i + 1}" width="${Math.round(width(i))}" customWidth="1"/>`).join('')}</cols><sheetData>${body}</sheetData><autoFilter ref="A1:${col(ncol - 1)}${Math.max(1, rows.length)}"/></worksheet>`;
  return zipStore([
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${x(sheet.slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">'${x(sheet.slice(0, 31))}'!$A$1:$${col(ncol - 1)}$${Math.max(1, rows.length)}</definedName></definedNames></workbook>`],
    ['xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ['xl/worksheets/sheet1.xml', ws],
    ['xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>'],
  ]);
}

/* ----- 6. Печать / PDF: свёрнутое разворачивается, кнопки и фильтры скрыты (стили @media print) ----- */
let _printOpened = [];
function beforePrint() { _printOpened = [...document.querySelectorAll('#outList details:not([open]), #outAuthor details:not([open])')].filter(d => !d.classList.contains('fhelp')); _printOpened.forEach(d => { d.open = true; }); }
function afterPrint() { _printOpened.forEach(d => { d.open = false; }); _printOpened = []; }
function printPage() { beforePrint(); window.print(); }
window.addEventListener('beforeprint', () => { if (!_printOpened.length) beforePrint(); });
window.addEventListener('afterprint', afterPrint);

/* ===== Экран ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const chip = (st, text) => `<span class="chip ${st}">${esc(text || ST_NAME[st])}</span>`;
let LAST = null, BUSY = false;

/* Ошибки на странице показываются наверху — по снимку экрана видно, что сломалось */
window.addEventListener('error', e => showErr((e.message || 'ошибка') + (e.filename ? ' (' + String(e.filename).split('/').pop() + ':' + e.lineno + ')' : '')));
window.addEventListener('unhandledrejection', e => showErr('ошибка: ' + ((e.reason && e.reason.message) || e.reason)));
function showErr(t) { const b = document.getElementById('pgerr'); if (!b) return; b.style.display = ''; b.textContent = 'Ошибка на странице — пришлите снимок этой строки: ' + t; }
async function init() {
  $('ver').textContent = `версия ${VERSION} от ${VERSION_DATE}`;
  $('changes').innerHTML = CHANGES.map(c => `<p><b>${c[0]}</b> <span class="dim">${c[1]}</span></p><ul>${c[2].map(x => '<li>' + esc(x) + '</li>').join('')}</ul>`).join('');
  // кнопки и поля работают сразу; поиск включается, когда загружены справочники
  $('file').addEventListener('change', e => addImages([...e.target.files]));
  $('stop').addEventListener('click', () => { STOP = true; $('stop').disabled = true; $('status').textContent = 'Останавливаю после текущей публикации…'; });
  $('retry').addEventListener('click', retryMissing); $('xlsx').addEventListener('click', () => exportList('xlsx')); $('csv').addEventListener('click', () => exportList('csv'));
  $('axlsx').addEventListener('click', () => exportAuthor('xlsx')); $('acsv').addEventListener('click', () => exportAuthor('csv'));
  $('cacheClear').addEventListener('click', async () => { await cacheClear(); cacheInfo(); }); $('useCache').addEventListener('change', () => { LS.set('pc_useCache', $('useCache').checked); cacheInfo(); });
  // Ctrl+Enter в поле списка — найти публикации (удобство 8)
  $('list').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runList(); } });
  $('afile').addEventListener('change', e => authorImage([...e.target.files]));
  document.addEventListener('paste', e => { const im = [...(e.clipboardData ? e.clipboardData.items : [])].filter(i => i.type.startsWith('image/')).map(i => i.getAsFile()); if (!im.length) return; e.preventDefault(); if (document.activeElement === $('author')) authorImage(im); else addImages(im); });
  // снимок можно перетащить в любое место страницы (удобство 7); на поле автора — снимок с идентификаторами
  const hasFiles = e => e.dataTransfer && [...(e.dataTransfer.types || [])].indexOf('Files') >= 0; let dragN = 0;
  document.addEventListener('dragenter', e => { if (!hasFiles(e)) return; e.preventDefault(); dragN++; document.body.classList.add('dragging'); });
  document.addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
  document.addEventListener('dragleave', e => { if (!hasFiles(e)) return; if (--dragN <= 0) { dragN = 0; document.body.classList.remove('dragging'); } });
  document.addEventListener('drop', e => { if (!hasFiles(e)) return; e.preventDefault(); dragN = 0; document.body.classList.remove('dragging'); const im = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/')); if (!im.length) return; if (e.target && e.target.closest && e.target.closest('#author')) authorImage(im); else addImages(im); });
  $('go').addEventListener('click', runList); $('ago').addEventListener('click', runAuthor); $('anew').addEventListener('click', resetAuthor); $('ping').addEventListener('click', ping); $('self').addEventListener('click', selfCheck); $('copy').addEventListener('click', copyList); $('acopy').addEventListener('click', copyAuthor);
  $('list').addEventListener('input', () => { countEntries(); saveState(true); }); $('author').addEventListener('input', () => { showParsed(); saveState(true); });
  $('author').addEventListener('keydown', e => { if (e.key === 'Enter') runAuthor(); });
  // организация помогает выбрать автора: если кандидаты уже показаны — пересортировать их
  $('org').addEventListener('change', () => { if (AU.cands && !(AU.prof && !AU.prof.err)) { rankCands(AU); renderAuthor(); } saveState(true); });
  window.addEventListener('scroll', navScroll, { passive: true });
  try { $('oaKey').value = localStorage.getItem('pc_oaKey') || ''; $('orcidToken').value = localStorage.getItem('pc_orcidToken') || ''; $('org').value = localStorage.getItem('pc_org') || ''; } catch (e) { }
  if (OA_BUILTIN) { $('oaKey').placeholder = 'встроенный ключ уже подключён — поле можно не заполнять'; }
  if (ORCID_BUILTIN) { $('orcidToken').placeholder = 'встроенный токен уже подключён — поле можно не заполнять'; $('orcidNote').textContent = 'В эту сборку встроен токен ORCID. Своё значение в поле заменит его только в этом браузере.'; }
  $('org').addEventListener('input', () => { try { localStorage.setItem('pc_org', $('org').value); } catch (e) { } });
  if (!ocrAvailable()) { $('drop').innerHTML = 'Распознавание снимков в эту сборку не включено — вставьте список текстом.'; $('afile').style.display = 'none'; }
  try { const uc = LS.get('pc_useCache'); if (uc === false) $('useCache').checked = false; } catch (e) { }
  updateNav(); navScroll();
  await loadData();
  if (REF) offerRestore();
  cacheInfo();
}
async function cacheInfo() { CACHE.on = $('useCache').checked && typeof indexedDB !== 'undefined'; const n = CACHE.on ? await cacheCount() : 0; $('cacheInfo').textContent = CACHE.on ? (n ? `в кеше ответов: ${n}` : 'кеш пуст') : 'кеш не используется'; }
/* Справочники: в одной странице — внутри, на сайте — файл data/ref.json (около 8 МБ) с показом хода загрузки и ограничением по времени */
async function loadData() {
  const btns = ['go', 'ago'];
  try {
    const el = $('ref-data'); let data;
    if (el) data = JSON.parse(el.textContent);
    else {
      btns.forEach(b => $(b).disabled = true);
      const info = t => { $('refinfo').textContent = t; };
      info('Загружаю справочники SCImago и Белого списка (около 4 МБ, один раз — дальше из кеша браузера)…');
      const r = await tfetch('data/ref.json?v=' + VERSION, {}, 120000); if (!r.ok) throw new Error('сайт ответил ' + r.status);
      const total = r.headers.get('content-encoding') ? 0 : (+r.headers.get('content-length') || 0);  // сжатый ответ: длина дана в сжатом виде — итог не показываем
      if (r.body && r.body.getReader) {
        const rd = r.body.getReader(), parts = []; let got = 0;
        for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; info(`Загружаю справочники: ${Math.round(got / 1e6 * 10) / 10} МБ${total ? ' из ' + Math.round(total / 1e6 * 10) / 10 : ''}…`); }
        const all = new Uint8Array(got); let o = 0; parts.forEach(p => { all.set(p, o); o += p.length; }); data = JSON.parse(new TextDecoder().decode(all));
      } else data = await r.json();
    }
    loadRef(data);
  } catch (e) { $('refinfo').innerHTML = chip('unk', 'справочники не загружены') + ' ' + esc(e.message || e) + '. Поиск статей не работает, «Проверить связь» работает. <button class="sec small" onclick="loadData()">Повторить</button>'; return; }
  btns.forEach(b => $(b).disabled = false);
  $('refinfo').textContent = `Справочники: SCImago за ${REF.sjYears[0]}–${REF.sjYear} годы (${REF.sj.length} изданий), Белый список на ${REF.wlDate} (${REF.wl.length} изданий).`;
}
const W = { entries: null, works: [], pubs: [], netDown: '', auto: null, dups: [] };
const newS = () => ({ prof: null, cands: null, orcCands: null, similar: null, msgs: [], parsed: null, orcIds: null });
let AU = newS();
const stOf = () => AU;
function showParsed() {
  const p = parseAuthorInput($('author').value), c = [];
  if (p.name) c.push('имя: <b>' + esc(p.name) + '</b>'); if (p.orcid) c.push('ORCID: <b>' + p.orcid + '</b>'); if (p.orcidBad) c.push(chip('check', 'ORCID с ошибкой') + ' ' + p.orcidBad + ' — контрольная цифра не сходится, сверьте с источником');
  if (p.scopus) c.push('Scopus ID: <b>' + p.scopus + '</b>'); if (p.rid) c.push('WoS ResearcherID: <b>' + p.rid + '</b>'); if (p.spin) c.push('SPIN-код РИНЦ: <b>' + p.spin + '</b>'); if (p.rinc) c.push('РИНЦ AuthorID: <b>' + p.rinc + '</b>');
  if (p.name) { const f = parseFIO(p.name)[0]; if (f) c.push('фамилия: <b>' + esc(f.sur) + '</b>' + (isCyr(f.sur) ? ' (латиницей: ' + esc(translitVariants(f.sur).slice(0, 3).join(', ')) + '…)' : '')); }
  $('aparsed').innerHTML = c.length ? 'Распознано — ' + c.join('; ') + '.' : '';
}
async function authorImage(files) {
  if (!files.length || BUSY) return; BUSY = true;
  try {
    $('aparsed').textContent = 'Распознаю снимок…'; const text = await ocrIds(files[0]);
    // из снимка берутся только идентификаторы; имя остаётся тем, что введено в поле
    const best = { orcid: '', orcidBad: '', scopus: '', rid: '' };
    for (const part of text.split('\n')) { const q = parseAuthorInput(part.replace(/\s+/g, '')); for (const k of ['orcid', 'scopus', 'rid']) if (!best[k] && q[k]) best[k] = q[k]; if (!best.orcidBad && q.orcidBad) best.orcidBad = q.orcidBad; }
    const name = parseAuthorInput($('author').value).name, ids = [best.rid, best.scopus, best.orcid || best.orcidBad].filter(Boolean);
    if (!ids.length) $('aparsed').textContent = 'На снимке идентификаторы не распознаны — введите их вручную.';
    else { $('author').value = (name ? name + ' ' : '') + ids.join('/'); showParsed(); $('aparsed').innerHTML += ' <b>Сверьте цифры со снимком</b> — распознавание путает похожие знаки.'; }
  } catch (e) { $('aparsed').textContent = 'Снимок не распознан: ' + (e.message || e); }
  BUSY = false;
}
function countEntries() { const n = splitEntries($('list').value).length; $('cnt').textContent = n ? `Публикаций в списке: ${n}. Каждая должна начинаться с номера («1.») или отделяться пустой строкой.` : ''; }
/* Плохо распознанный снимок не вставляется молча: показывается крупная пометка, текст можно вставить кнопкой (правка 4, 0.7.11) */
const OCR_MIN_CONF = 60, OCR_MIN_RATIO = 0.35;
const ocrBad = r => r.conf < OCR_MIN_CONF || (r.q && r.q.words >= 8 && r.q.ratio < OCR_MIN_RATIO);
let PENDING_OCR = '';
function addText(t) { $('list').value = ($('list').value.trim() ? $('list').value.trim() + '\n' : '') + String(t).trim() + '\n'; countEntries(); saveState(true); }
function insertPending() { if (PENDING_OCR) addText(PENDING_OCR); PENDING_OCR = ''; $('ocrwarn').innerHTML = ''; $('ocrmsg').innerHTML += ' <b>Плохо распознанный текст вставлен — исправьте его по снимку.</b>'; }
async function addImages(files) {
  if (!files.length || BUSY) return; BUSY = true; $('ocrwarn').innerHTML = ''; PENDING_OCR = '';
  try {
    for (let i = 0; i < files.length; i++) {
      $('ocrmsg').textContent = `Распознаю снимок ${i + 1} из ${files.length}… (первый раз — до минуты)`;
      const r = await ocrImage(files[i]);
      if (ocrBad(r)) {
        PENDING_OCR += (PENDING_OCR ? '\n' : '') + r.text.trim();
        $('ocrmsg').textContent = '';
        $('ocrwarn').innerHTML = `<div class="ocrwarn"><b>Снимок распознан плохо (уверенность ${r.conf} %${r.q && r.q.words ? ', читаемых слов ' + Math.round(r.q.ratio * 100) + ' %' : ''})</b> — текст в список не вставлен, чтобы не искать мусор. Увеличьте снимок (страницу в браузере — Ctrl и «+») или скопируйте текст со страницы${r.small ? '; снимок мелкий — нужна ширина от 1200 точек' : ''}. <button class="sec small" onclick="insertPending()">Всё равно вставить распознанный текст</button></div>`;
        continue;
      }
      addText(r.text);
      $('ocrmsg').innerHTML = `Снимок распознан${r.table ? ' как таблица' : ''} (уверенность ${r.conf} %). <b>Сверьте текст со снимком и поправьте ошибки</b> — особенно названия статей, годы и DOI.` + (r.small ? ' Снимок мелкий (уже 1200 точек): лучше сделать его крупнее или вставить текст.' : '');
    }
  } catch (e) { $('ocrmsg').textContent = 'Снимок не распознан: ' + (e.message || e) + '. Вставьте список текстом.'; }
  BUSY = false; countEntries();
}
const PING_NAMES = ['Crossref (поиск статей)', 'Сайт Белого списка (свежие уровни изданий)', 'Реестр ORCID (поиск автора по Scopus ID, ResearcherID и имени)', 'OpenAlex (тип статьи, corresponding author, профиль автора)'];
async function ping() {
  if ($('ping').disabled) return; $('ping').disabled = true; applyNet();
  const rows = PING_NAMES.map(n => ({ name: n, wait: true }));
  const draw = () => { $('pingres').innerHTML = rows.map(x => x.wait ? `${chip('n', 'проверяю…')} ${esc(x.name)}` : `${chip(x.ok ? 'ok' : 'unk', x.ok ? 'отвечает' : 'не отвечает')} ${esc(x.name)}${x.ok ? `, ${x.ms} мс` : ' — ' + esc(x.msg)}`).join('<br>'); };
  draw();
  const r = await pingAll((i, x) => { rows[i] = x; draw(); });
  draw(); $('ping').disabled = false;
  $('pingres').innerHTML += (r[0].ok ? '' : '<br>Без Crossref проверка статей невозможна. Проверьте интернет, VPN или прокси; если сайт закрыт в вашей сети — сообщите об этом.') + (r[0].ok && !r[3].ok ? '<br>Без OpenAlex утилита работает, но не знает corresponding author и организации, не отличает обзор от статьи; профиль автора берётся из Crossref (неполный).' : '') + (!r[1].ok ? '<br>Сайт Белого списка не отвечает — уровни берутся из справочника внутри страницы.' : '');
}
function applyNet() { NET.useORCID = $('useORCID').checked; NET.orcidOff = ''; NET.orcidToken = $('orcidToken').value.trim() || ORCID_BUILTIN; try { localStorage.setItem('pc_orcidToken', $('orcidToken').value.trim()); } catch (e) { } NET.useOA = $('useOA').checked; NET.oaOff = ''; NET.useWL = $('useWL').checked; NET.wlOff = ''; NET.wlCache.clear(); NET.oaKey = $('oaKey').value.trim() || OA_BUILTIN; try { localStorage.setItem('pc_oaKey', $('oaKey').value.trim()); } catch (e) { } }

const auIds = () => AU.prof && !AU.prof.err ? AU.prof.ids : [];
function curOpt() { return { leaderIds: auIds() }; }
function rejudge() { const opt = curOpt(); W.opt = opt; W.pubs = W.entries.map((e, i) => { const p = judgePub(e, W.works[i], opt); if (W.works[i] === undefined && !e.patent) p.notes = [W.netDown ? 'запрос не выполнен: ' + W.netDown : (W.stopped ? 'не проверена — поиск остановлен; нажмите «Повторить ненайденные»' : 'не проверена')]; return p; }); W.dups = findDuplicates(W.pubs); }
function renderAll() { renderList(); renderAuthor(); updateNav(); if (W.entries) retryVis(); }

/* Правка 2: раздел науки по-русски (справочник subfields.js); точная тема OpenAlex — в подсказке */
function topicsHtml(a) {
  const ts = a.topics || []; if (!ts.length) return '<span class="dim">нет данных</span>';
  const by = new Map();
  ts.forEach(t => { const sub = (t && (t.sub || t.name)) || String(t || ''); if (!sub) return; const o = by.get(sub) || []; const nm = t && t.name ? t.name : String(t || ''); if (nm && nm !== sub) o.push(nm); by.set(sub, o); });
  const out = [...by.entries()].slice(0, 3);
  if (!out.length) return '<span class="dim">нет данных</span>';
  return out.map(([sub, names]) => `<span class="topic" title="${esc('OpenAlex: ' + (names.length ? names.join('; ') : sub))}">${esc(subRu(sub))}</span>`).join('');
}
/* Правка 5: длинное примечание — коротким словом с подсказкой, полный текст под «подробнее» */
const NOTE_SHORT = [[/^возможный дубль/, 'возможный дубль'], [/не совпадает с годом в базе/, 'год не совпадает'], [/совпадает с записью не полностью/, 'совпадение неполное'],
  [/DOI из списка/, 'DOI не найден'], [/несколько изданий с таким ISSN/, 'издание неоднозначно'], [/издание найдено по названию/, 'найдено по названию'],
  [/исключено из Белого списка/, 'исключено из Белого списка'], [/сайт Белого списка отвечает иначе/, 'сайт БС отвечает иначе'], [/это разные показатели/, 'импакт-фактор расходится'],
  [/не найдено — проверьте вручную/, 'не найдена'], [/ближайшая найденная статья не похожа/, 'варианты не подошли'], [/в SCImago издание есть только до/, 'в SCImago данных за год нет'],
  [/взят \d{4} год/, 'взят ближайший год'], [/в списке нет №/, 'пропущен номер в списке'], [/поиск остановлен/, 'не проверена — остановлено'], [/^патент/, 'патент — не ищется'],
  [/в SCImago тип издания/, 'в SCImago не журнал'], [/статья выбрана вручную/, 'выбрана вручную'], [/примечание Белого списка/, 'примечание Белого списка']];
/* Удобство 11: причина пометки — короткой фразой прямо в строке; полный текст — в подсказке и под «подробнее» */
function notesHtml(notes) {
  if (!notes.length) return '';
  const shorts = [], longs = [];
  notes.forEach(n => {
    const m = NOTE_SHORT.find(x => x[0].test(n)), dub = /^возможный дубль/.test(n);
    if (!m || n.length <= 60) { if (!m && n.length > 60) { shorts.push(`<span title="${esc(n)}">${esc(n.slice(0, 50))}…</span>`); longs.push(n); return; } shorts.push(dub ? chip('check', 'дубль?') + ' ' + esc(n) : esc(n)); return; }
    shorts.push(`<span title="${esc(n)}">${dub ? chip('check', 'дубль?') + ' ' : ''}${esc(m ? m[1] : n.slice(0, 50) + '…')}</span>`); longs.push(n);
  });
  return shorts.join('<br>') + (longs.length ? `<details class="mini"><summary>подробнее</summary><span class="dim">${longs.map(esc).join('<br>')}</span></details>` : '');
}

/* ----- Правка 1: переход к результату и строка быстрых переходов ----- */
/* После действия страница сама показывает свой результат: искать его прокруткой не нужно */
function goTo(id) {
  const el = $(id); if (!el) return;
  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { el.scrollIntoView(); }
}
/* Пункты строки переходов появляются, когда есть что показать; рядом — счётчики */
function navItems() {
  const out = [{ id: 'inp', t: 'Ввод' }];
  if (W.entries) out.push({ id: 'outList', t: 'Публикации из списка', n: W.pubs.length });
  if (AU.prof || AU.cands || AU.orcCands || (AU.msgs && AU.msgs.length)) {
    out.push({ id: 'outAuthor', t: 'Автор' });
    if (AU.prof && !AU.prof.err) out.push({ id: 'auWorks', t: 'Публикации автора', n: AU.prof.js.length });
  }
  return out;
}
function updateNav() {
  const b = $('nav'); if (!b) return; const it = navItems();
  if (it.length <= 1) { b.style.display = 'none'; b.innerHTML = ''; return; }
  b.style.display = 'flex'; b.innerHTML = it.map(x => `<a href="javascript:goTo('${x.id}')">${esc(x.t)}${x.n != null ? ' <b>' + x.n + '</b>' : ''}</a>`).join('<span class="nsep">·</span>');
}
/* Кнопка «К вводу» — когда пользователь ушёл вниз */
function navScroll() { const b = $('toinp'); if (b) b.style.display = window.scrollY > 500 ? '' : 'none'; }

/* ----- Режим 1: список публикаций ----- */
/* Удобство 4: прогресс «обработано 12 из 30» и «Остановить»; удобство 2: ответы из кеша браузера; патенты не ищутся */
let STOP = false;
const progHtml = (i, n, what) => `${what} ${i} из ${n} <span class="prog"><span style="width:${n ? Math.round(i / n * 100) : 0}%"></span></span>`;
async function findOne(entry) {
  const work = await findWork(entry);
  if (work && (work.via === 'doi' || work.score >= FOUND_NEAR)) { if (work.doi) await enrichOA(work, []); await enrichWL(work); }
  return work;
}
const cacheNote = () => CACHE.hits ? ` Из кеша браузера: ${CACHE.hits} ответ${CACHE.hits % 10 === 1 && CACHE.hits % 100 !== 11 ? '' : (CACHE.hits % 10 >= 2 && CACHE.hits % 10 <= 4 && (CACHE.hits % 100 < 10 || CACHE.hits % 100 >= 20) ? 'а' : 'ов')} баз (сохранены с ${new Date(CACHE.oldest).toLocaleDateString('ru-RU')}; свежие — «Связь и настройки» → «Очистить кеш»).` : '';
async function runList() {
  if (BUSY || !REF) return;
  const entries = splitEntries($('list').value);
  if (!entries.length) { $('status').textContent = 'Список пуст: вставьте текст или снимок.'; return; }
  BUSY = true; STOP = false; $('go').disabled = true; $('stop').style.display = ''; $('stop').disabled = false; $('retry').style.display = 'none'; applyNet(); NET.log = []; CACHE.hits = 0; CACHE.oldest = 0; goTo('status');
  const works = []; let netDown = '', done = 0;
  for (let i = 0; i < entries.length; i++) {
    $('status').innerHTML = progHtml(i, entries.length, 'Обработано');
    let work; const m0 = CACHE.miss;
    if (netDown || STOP || entries[i].patent) work = undefined;
    else { try { work = await findOne(entries[i]); done++; } catch (e) { work = undefined; netDown = e.message; } }
    works.push(work); if (work !== undefined && (!CACHE.on || CACHE.miss > m0)) await sleep(NET.pause);
  }
  W.entries = entries; W.works = works; W.netDown = netDown; W.stopped = STOP; W.auto = null; W.numbered = entries.some(e => e.num != null);
  // если автор ещё не выбран, а у статей списка есть общий автор — показать его публикации сразу
  if (!netDown && !STOP && !AU.prof && !$('author').value.trim()) await autoLeader(works);
  rejudge(); renderAll(); BUSY = false; $('go').disabled = false; $('stop').style.display = 'none'; goTo('outList');
  $('status').textContent = (netDown ? 'Поиск неполный: ' + netDown + '. Нажмите «Проверить связь».' : (STOP ? `Остановлено: проверено ${done} из ${entries.length}. «Повторить ненайденные» доищет остальные.` : 'Готово.')) + cacheNote();
  retryVis(); saveState();
}
/* Общий автор статей списка. Если явного нет, а указана организация — автор, у которого она совпала (правка 1) */
async function autoLeader(works) {
  const det = detectLeader(works, []); let chosen = det.how === 'auto' ? det.chosen : null, how = 'общий автор статей из списка — проверьте, что это нужный человек';
  const org = $('org').value.trim();
  if (!chosen && org && det.works >= 2) { const big = det.cands.filter(a => a.count >= Math.max(2, Math.ceil(det.works * 0.6))); const r = leaderByOrg(works, big, org); if (r.hit === 'yes' && r.list.length === 1) { chosen = r.list; how = 'общий автор статей из списка, у которого совпала организация — проверьте, что это нужный человек'; } }
  if (!chosen) return;
  W.auto = chosen[0].name; AU = newS(); await loadProfile(AU, chosen.map(a => a.id), how); await fetchOrcidIds(AU);
}
/* Удобство 3: повторить поиск только для ненайденных (и не проверенных), без кеша — свежим запросом */
const missIdx = () => W.entries && W.pubs ? W.pubs.map((p, i) => i).filter(i => !W.entries[i].patent && (W.works[i] === undefined || W.works[i] === null || W.pubs[i].found === 'no')) : [];
function retryVis() { const n = missIdx().length; $('retry').style.display = n && !BUSY ? '' : 'none'; $('retry').textContent = `Повторить ненайденные (${n})`; }
async function retryMissing() {
  if (BUSY) return; const idx = missIdx(); if (!idx.length) return;
  BUSY = true; STOP = false; $('go').disabled = true; $('retry').style.display = 'none'; $('stop').style.display = ''; $('stop').disabled = false; applyNet(); NET.noCache = true; let netDown = '', k = 0;
  for (const i of idx) {
    $('status').innerHTML = progHtml(k++, idx.length, 'Повторно обработано');
    if (STOP || netDown) break;
    try { const w = await findOne(W.entries[i]); if (w !== undefined) W.works[i] = w; } catch (e) { netDown = e.message; }
    await sleep(NET.pause);
  }
  NET.noCache = false; W.netDown = netDown; W.stopped = STOP;
  rejudge(); renderAll(); BUSY = false; $('go').disabled = false; $('stop').style.display = 'none';
  const left = missIdx().length; $('status').textContent = netDown ? 'Повтор неполный: ' + netDown + '.' : `Повтор готов: найдено ${idx.length - left} из ${idx.length}.`;
  retryVis(); saveState(); goTo('outList');
}
const nchip = t => `<span class="chip n">${esc(t)}</span>`;
const qChip = (q, big) => q ? `<span class="chip n${big ? ' cbig' : ''}">Q${q}</span>` : chip('unk', 'нет квартиля');
const lnk = (u, t) => `<a target="_blank" rel="noopener" href="${esc(u)}">${esc(t || u)}</a>`;
/* Номер записи: из списка; если список нумерованный, а у записи номера нет — прочерк */
const numOf = (e, i) => e.num != null ? e.num : (W.numbered ? '—' : i + 1);

/* ----- Квартиль и Белый список на год публикации, рядом текущее ----- */
/* Индексация издания по данным Белого списка (WoS Core Collection, Scopus, RSCI) */
function idxText(wl) {
  if (!wl) return '<span class="dim">индексация: нет данных (издания нет в Белом списке)</span>';
  const f = (n, v) => `${n} ${v ? '✓' : '—'}`;
  return `<span class="dim" title="по данным Белого списка">индексация: ${f('WoS CC', wl.wos)} · ${f('Scopus', wl.scopus)} · ${f('RSCI', wl.rsci)}</span>`;
}
/* Где посмотреть квартиль самому: открытого источника квартиля WoS (JCR) и CiteScore нет */
const firstIssn = issns => { const x = (issns || []).map(normIssn).filter(Boolean)[0]; return x ? fmtIssn(x) : ''; };
const scopusSource = sid => 'https://www.scopus.com/sourceid/' + sid;
function extLinks(issns) {
  const is = firstIssn(issns);
  return [is ? lnk('https://mjl.clarivate.com/search-results?issn=' + is, 'есть ли в WoS') : '', lnk('https://jcr.clarivate.com/', 'JCR'), lnk('https://www.scopus.com/sources.uri', 'Scopus Sources')].filter(Boolean).join(' · ') + (is ? ` (ISSN ${is})` : '');
}
function quartText(jv, sj, short, wl, issns) {
  if (!sj) return chip('unk', 'нет в SCImago') + (short ? '' : `<div class="dim">квартиль WoS и CiteScore утилита не получает — посмотрите сами: ${extLinks(issns)}</div>`);
  let h = `${qChip(jv.qY, !short)} <span class="dim">${jv.sjYear}${jv.sjExact ? '' : ' — за год публикации данных нет'}</span>`;
  if (jv.yL !== jv.sjYear && jv.qL !== jv.qY) h += `<br>${chip('check', 'сейчас ' + (jv.qL ? 'Q' + jv.qL : 'без квартиля'))} <span class="dim">${jv.yL}</span>`;
  if (!short) h += `<details class="mini"><summary>по годам</summary><span class="dim">${esc(jv.hist)}</span></details>`;
  return h + `<div class="dim">${lnk(`https://www.scimagojr.com/journalsearch.php?q=${sj.sid}&tip=sid`, 'SCImago')} · ${lnk(scopusSource(sj.sid), 'Scopus')}${short ? '' : ' · ' + extLinks(issns).split(' · ')[0]}</div>`;
}
function wlText(wl, year, short) {
  if (!wl) return nchip('нет в списке');
  const a = wlAt(wl, year), before = year && year < 2023; let h;
  if (a.excluded) h = chip('check', 'исключён ' + wl.disc);
  else if (a.ambiguous) h = chip('check', (a.lv ? 'уровень ' + a.lv : 'без уровня') + ', исключён в год публикации');
  else h = nchip(a.lv ? 'уровень ' + a.lv : 'без уровня') + (a.y ? ` <span class="dim">${a.y}${a.exact || before ? '' : ' (более ранних данных нет)'}</span>` : '');
  if (before && !a.excluded) h += `<div class="dim">Белого списка до 2023 г. не было; уровень ${a.y || 2023} г. — справочно</div>`;
  if (!a.excluded && (a.curExcl || a.cur !== a.lv)) h += `<br>${chip('check', a.curExcl ? 'сейчас исключён ' + wl.disc : 'сейчас ' + (a.cur ? 'уровень ' + a.cur : 'без уровня'))}`;
  const lv = Object.entries(wl.levels).filter(x => x[1]);
  if (!short && new Set(lv.map(x => x[1])).size > 1) h += '<div class="dim">по годам: ' + lv.map(x => `${x[0]} — ${x[1]}`).join(', ') + '</div>';
  return h + (short ? `<div class="dim">${wlLink(wl)}</div>` : '');
}
const wlLink = wl => lnk(`https://journalrank.rcsi.science/api/record-sources/${fmtIssn(wl.issns[0] || '')}/level`, 'запись');
function wlCell(p) { const wl = p.j.wl; return wlText(wl, p.work.year) + (wl ? `<div class="dim" title="справочник от ${REF.wlDate}">${wlLink(wl)}${p.jv.wlLive ? ' · ' + (p.jv.wlDiff ? 'сайт отвечает иначе — см. примечания' : 'сайт ✓') : ''}</div>` : (p.jv.wlLive && p.jv.wlDiff ? '<div class="dim">сайт отвечает иначе — см. примечания</div>' : '')); }
/* «Импакт-фактор» — это «цитирований на документ за 2 года» SCImago на год публикации; рядом текущий, OpenAlex и значение из списка */
function ifCell(p) {
  const jv = p.jv; let h = jv.cpd != null ? `<span class="big">${fmtNum(jv.cpd)}</span> <span class="dim">${jv.sjYear}</span>` + (jv.yL !== jv.sjYear && jv.cpdLast != null ? `<div class="dim">сейчас ${fmtNum(jv.cpdLast)} (${jv.yL})</div>` : '') : chip('unk', 'нет в SCImago');
  if (jv.oaCpd != null) h += `<div class="dim">OpenAlex, сейчас: ${fmtNum(jv.oaCpd)}</div>`;
  if (p.declIF != null) h += `<div class="dim">в списке: ${fmtNum(p.declIF)}</div>`;
  return h;
}
/* Corresponding — как отмечено в базе; если не отмечен, никого не подставляем */
const aName = a => a ? ([a.given, a.family].filter(Boolean).join(' ') || a.name || '') : '';
function corrArticle(w) {
  const c = w.corr;
  if (!w.oa) return chip('unk', 'corresponding: нет данных') + ' <span class="dim">(OpenAlex не ответил по этой статье)</span>';
  if (!c || !c.known) return chip('unk cbig', 'Corresponding: в базе не указан');
  return '<span class="dim">Corresponding:</span> <b>' + esc(c.names.join(', ') || 'отмечен, имя не указано') + '</b> <span class="dim">(OpenAlex)</span>';
}
/* Найденный автор в статье: corresponding ли он и от какой организации */
const CORR_T = { yes: 'да', no: 'нет', unk: 'в базе не указан' };
const CORR_C = { yes: 'ok', no: 'no', unk: 'unk' };
const corrBig = st => chip((CORR_C[st] || 'unk') + ' cbig', 'Corresponding — ' + (CORR_T[st] || 'нет данных'));
const corrChip = (st, others) => st === 'yes' ? chip('ok', 'да') : (st === 'no' ? chip('no', 'нет') + (others && others.length ? ` <span class="dim">— ${esc(others.join(', '))}</span>` : '') : (st === 'unk' ? chip('unk', 'в базе не указан') : chip('unk', 'нет данных')));
/* Организация автора в статье — только как факт; сверка по каждой статье убрана (правка 3, 0.7.11) */
const orgNames = me => instNames(me).slice(0, 3);
function listMe(w) { const ids = auIds(); if (!ids.length || !w.oaAuthors) return null; return { me: w.oaAuthors.find(a => ids.indexOf(a.id) >= 0) || null, corr: corrOf(w.oaAuthors, ids), others: w.oaAuthors.filter(a => a.corr && ids.indexOf(a.id) < 0).map(a => a.name) }; }
function authorsCell(p) {
  const w = p.work, a = w.authors || [], f = aName(a[0]), l = a.length > 1 ? aName(a[a.length - 1]) : '';
  const m = listMe(w), nm = AU.prof && !AU.prof.err ? ((AU.prof.info[0] || {}).name || 'найденный автор') : ''; let h = '';
  if (m && m.me) {
    h += corrBig(m.corr) + `<div><b>${esc(nm)}</b></div>`;
    const on = orgNames(m.me); h += `<div class="dim">${on.length ? esc(on.join('; ')) : 'организация в базе не указана'}</div>`;
    if (m.corr === 'no' && m.others.length) h += `<div class="dim">corresponding: ${esc(m.others.join(', '))}</div>`;
  } else if (m) h += chip('check', 'автора нет среди авторов статьи в OpenAlex') + `<div class="dim">${esc(nm)}</div><div>${corrArticle(w)}</div>`;
  else if (nm && w.oa === undefined) h += chip('unk cbig', 'Corresponding — нет данных') + `<div class="dim">${esc(nm)}: OpenAlex не ответил по этой статье</div>`;
  else h += corrArticle(w);
  return h + `<div class="dim">первый: ${f ? esc(f) : 'нет данных'}${l ? ' · последний: ' + esc(l) : ''} · всего: ${a.length || '?'}</div>`;
}

/* ----- Фильтры ----- */
const FLT0 = () => ({ q: [], wl: [], yFrom: 0, yTo: 0, corr: [], ifFrom: 0, org: [] });
const FLT = { list: FLT0(), au: FLT0() };
function rowKey(year, j, jv) { if (!j) return { y: year }; const a = j.wl ? wlAt(j.wl, year) : null; return { y: year, qY: j.sj ? (jv.qY || 0) : 0, wl: a ? (a.excluded ? 0 : a.lv) : null, excl: !!(a && a.excluded), cpd: jv && jv.cpd != null ? jv.cpd : null }; }
const profKey = x => Object.assign(rowKey(x.w.year, x.j, x.jv), { corr: x.corrSt || 'unk' });
function listKey(p) { if (!p.work) return {}; const k = rowKey(p.work.year, p.j, p.jv), m = listMe(p.work); k.corr = m && m.me ? m.corr : 'unk'; return k; }
const reFlt = id => id === 'list' ? renderList() : renderAuthor();
function filterBar(id, shown, total, noCpd) {
  const f = FLT[id], corrOff = id === 'list' && !auIds().length;
  const pill = (grp, v, t, dis) => `<label class="pill${f[grp].indexOf(v) >= 0 ? ' on' : ''}${dis ? ' off' : ''}"${dis ? ' title="заработает, когда найден автор (раздел 2)"' : ''}><input type="checkbox" ${f[grp].indexOf(v) >= 0 ? 'checked' : ''} ${dis ? 'disabled' : ''} onchange="setFlt('${id}','${grp}','${v}',this.checked)">${t}</label>`;
  const num = (k, ph, step) => `<input type="number" class="yr"${step ? ` step="${step}" min="0"` : ''} value="${f[k] || ''}" placeholder="${ph}" onchange="setFltY('${id}','${k}',this.value)">`;
  const active = f.q.length || f.wl.length || f.yFrom || f.yTo || f.corr.length || f.ifFrom;
  return `<div class="fbar noprint"><div class="fr"><span class="grp"><span class="gl">Квартиль</span>${['1', '2', '3', '4'].map(v => pill('q', v, 'Q' + v)).join('')}${pill('q', 'none', 'нет')}</span><span class="or">или</span><span class="grp"><span class="gl">Белый список</span>${['1', '2', '3', '4'].map(v => pill('wl', v, v)).join('')}${pill('wl', 'none', 'нет')}${pill('wl', 'excl', 'исключён')}</span>`
    + `<span class="fright"><span class="cnt">Показано <b>${shown}</b> из ${total}${f.ifFrom && noCpd ? ` · без импакт-фактора (нет в SCImago) скрыто ${noCpd}` : ''}</span>${active ? `<button class="linkbtn" onclick="resetFlt('${id}')">Сбросить</button>` : ''}<details class="fhelp"><summary title="Как работает фильтр">?</summary><div>Квартиль, уровень и импакт-фактор — на год публикации. Отмеченные квартили и уровни объединяются через «или» («Q1» + «1» — статьи, у которых Q1 или 1 уровень Белого списка); годы, импакт-фактор и corresponding — дополнительные условия «и». Импакт-фактор здесь — «цитирований на документ за 2 года» SCImago, это не импакт-фактор WoS.${corrOff ? ' Фильтр corresponding в этой таблице заработает, когда найден автор (раздел 2).' : ''}</div></details></span></div>`
    + `<div class="fr"><span class="grp"><span class="gl">Годы</span>${num('yFrom', 'с')} – ${num('yTo', 'по')}</span><span class="grp"><span class="gl">Импакт-фактор от</span>${num('ifFrom', 'любой', '0.1')}</span><span class="grp"><span class="gl">Corresponding</span>${pill('corr', 'yes', 'да', corrOff)}${pill('corr', 'no', 'нет', corrOff)}${pill('corr', 'unk', 'не указан', corrOff)}</span>`
    + `</div></div>`;
}
function setFlt(id, grp, v, on) { const a = FLT[id][grp], i = a.indexOf(v); if (on && i < 0) a.push(v); if (!on && i >= 0) a.splice(i, 1); reFlt(id); saveState(true); }
function setFltY(id, k, v) { FLT[id][k] = k === 'ifFrom' ? (parseFloat(String(v).replace(',', '.')) || 0) : (+v || 0); reFlt(id); saveState(true); }
function resetFlt(id) { FLT[id] = FLT0(); reFlt(id); saveState(true); }
const listFlt = () => auIds().length ? FLT.list : Object.assign({}, FLT.list, { corr: [] });
const listRows = () => sortRows(W.pubs.map((p, i) => ({ p, i })).filter(({ p }) => passFilter(listKey(p), listFlt())), 'list', r => listKey(r.p));
const noCpdHidden = (keys, f) => f.ifFrom ? keys.filter(k => k.cpd == null && passFilter(k, Object.assign({}, f, { ifFrom: 0 }))).length : 0;

/* ----- Варианты для спорных и ненайденных статей: выбирает человек ----- */
function altList(i) { const w0 = W.works[i], p = W.pubs[i]; if (!w0 || !p) return []; if (!p.work) return [w0].concat(w0.alts || []); return p.found === 'check' || w0.via === 'manual' ? (w0.alts || []) : []; }
function altsHtml(i) {
  const L = altList(i); if (!L.length) return '';
  return `<div class="alts"><span class="dim">${W.pubs[i].work ? 'другие варианты' : 'ближайшие варианты'} — если это она, нажмите:</span>` + L.map((w, k) => `<div><button class="sec small" onclick="pickAlt(${i},${k})">Это она</button> ${w.doi ? lnk('https://doi.org/' + w.doi, w.title) : esc(w.title)} <span class="dim">${[w.year, w.journal, w.source === 'OpenAlex' ? 'OpenAlex' : ''].filter(Boolean).map(esc).join(' · ')}</span></div>`).join('') + '</div>';
}
async function pickAlt(i, k) {
  if (BUSY) return; const L = altList(i), c = L[k]; if (!c) return; BUSY = true; applyNet();
  const w0 = W.works[i], rest = [w0].concat(w0.alts || []).filter(x => x !== c);
  const nw = Object.assign({}, c, { via: 'manual', alts: rest.slice(0, 3) }); delete nw.doiMiss;
  try { if (nw.doi) await enrichOA(nw, []); await enrichWL(nw); } catch (e) { }
  W.works[i] = nw; rejudge(); BUSY = false; renderAll(); retryVis(); saveState();
}
/* Поискать статью самому: Google Scholar — с текстом записи, eLibrary — форма поиска */
function searchLinks(e) {
  const q = e.query.replace(/\s+/g, ' ').slice(0, 250);
  return `<div class="dim">поискать самому: ${lnk('https://scholar.google.com/scholar?q=' + encodeURIComponent(q), 'Google Scholar')} · ${lnk('https://elibrary.ru/querybox.asp', 'eLibrary')} (форма поиска — вставьте название)</div>`;
}
const recordHtml = e => `<details class="mini"><summary>запись из списка</summary><span class="dim">${esc(e.raw)}</span></details>`;

function dupNotes(i) { return (W.dups || []).filter(d => d.a === i || d.b === i).map(d => { const o = d.a === i ? d.b : d.a; return `возможный дубль записи № ${numOf(W.pubs[o].entry, o)}: ${d.why}`; }); }
const TH_Q = 'Квартиль SCImago<div class="sub">на год публикации</div>', TH_WL = 'Белый список<div class="sub">на год публикации</div>', TH_IF = 'Импакт-фактор<div class="sub">SCImago, цит. на документ за 2 года</div>';
const patentLink = e => e.patentNo ? lnk('https://patents.google.com/patent/' + e.patentNo, 'патент ' + e.patentNo.replace(/^RU(\d+)/, 'RU $1 ')) : '';
const doneCnt = (keys) => keys.filter(k => MARKS[k]).length;
function renderList() {
  if (!W.entries) { $('outList').innerHTML = ''; $('listOut').style.display = 'none'; return; }
  const pubs = W.pubs, rows = listRows(), dn = doneCnt(pubs.map(markKeyL)); let h = `<h2>Публикации из списка (${pubs.length})${dn ? ` <span class="sub">· проверено ${dn}</span>` : ''}</h2>`;
  if (W.dups.length) h += `<p>${chip('check', 'проверьте')} Возможных дублей в списке: <b>${W.dups.length}</b> — ${W.dups.map(d => `№ ${numOf(pubs[d.a].entry, d.a)} и № ${numOf(pubs[d.b].entry, d.b)} (${esc(d.why)})`).join('; ')}. Утилита ничего не исключает — решите сами.</p>`;
  h += filterBar('list', rows.length, pubs.length, noCpdHidden(pubs.map(listKey), listFlt()));
  h += `<table class="t pubs"><tr><th style="width:6%">№</th>${sortTh('list', 'year', 'Публикация<div class="sub">сортировка по году</div>', 'width:23%')}<th style="width:13%">Издание</th>${sortTh('list', 'q', TH_Q, 'width:11%')}${sortTh('list', 'wl', TH_WL, 'width:11%')}${sortTh('list', 'if', TH_IF, 'width:10%')}<th style="width:14%">Авторы</th><th>Примечания</th></tr>`;
  rows.forEach(({ p, i }) => {
    const w = p.work, e = p.entry, notes = p.notes.concat(dupNotes(i)), mk = markKeyL(p), tr = MARKS[mk] ? '<tr class="done">' : '<tr>';
    const nh = notesHtml(notes), num = `<td>${numOf(e, i)}${markBox(mk)}</td>`;
    if (p.found === 'patent') { h += `${tr}${num}<td><span class="dim">${esc(e.raw.length > 220 ? e.raw.slice(0, 220) + '…' : e.raw)}</span><br>${nchip('патент')}${recordHtml(e)}</td><td colspan="5" class="dim">Патент — в Crossref и OpenAlex не ищется, квартиля и импакт-фактора у него нет.${e.patentNo ? ' Посмотреть: ' + patentLink(e) + '.' : ''}</td><td class="notes">${nh}</td></tr>`; return; }
    if (!w) { h += `${tr}${num}<td><span class="dim">${esc(e.raw.length > 220 ? e.raw.slice(0, 220) + '…' : e.raw)}</span><br>${chip('unk', p.found === 'no' ? 'не найдена' : 'не проверена')}${altsHtml(i)}${p.found === 'no' ? searchLinks(e) : ''}</td><td colspan="5" class="dim">${p.found === 'no' ? 'Статья не найдена в открытых базах — квартиль и остальное по ней не определены. Это не значит, что её нет.' : 'Поиск по этой записи не выполнялся.'}</td><td class="notes">${nh}</td></tr>`; return; }
    const url = w.doi ? 'https://doi.org/' + w.doi : (w.oaId ? 'https://openalex.org/' + w.oaId : '');
    let c1 = (url ? lnk(url, w.title) : esc(w.title)).replace('<a ', '<a class="ttl" ') + `<div class="dim">${[w.year || 'год ?', p.typeName, w.doi ? 'DOI ' + lnk(url, w.doi) : 'DOI нет', w.source === 'OpenAlex' ? 'найдена в OpenAlex' : ''].filter(Boolean).join(' · ')}</div>`;
    // удобство 11: причина «проверьте» прямо в пометке
    if (p.found === 'check') c1 += chip('check', `похожая (совпадение ${Math.round((w.score || 0) * 100)} %) — проверьте`);
    c1 += altsHtml(i) + recordHtml(e);
    const jc = `<b>${esc(w.journal || 'издание не указано')}</b>` + (w.issns.length ? '<div class="dim">ISSN ' + w.issns.map(x => esc(fmtIssn(normIssn(x)))).join(', ') + '</div>' : '') + '<div>' + idxText(p.j.wl) + '</div>';
    h += `${tr}${num}<td>${c1}</td><td>${jc}</td><td>${quartText(p.jv, p.j.sj, false, p.j.wl, w.issns)}</td><td>${wlCell(p)}</td><td>${ifCell(p)}</td><td>${authorsCell(p)}</td><td class="notes">${nh}</td></tr>`;
  });
  if (!rows.length) h += `<tr><td colspan="8" class="dim">Под фильтр не подходит ни одна статья.</td></tr>`;
  h += '</table>';
  const probs = [NET.oaOff ? 'OpenAlex отключился: ' + esc(NET.oaOff) + ' — corresponding и организации не определены' : '', NET.wlOff ? 'сайт Белого списка не ответил (' + esc(NET.wlOff) + ') — уровни взяты из справочника от ' + REF.wlDate : ''].filter(Boolean);
  if (probs.length) h += `<p class="dim">${probs.join('. ')}.</p>`;
  $('outList').innerHTML = h; $('listOut').style.display = '';
}

/* ----- Режим 2: автор. S — состояние поиска одного автора (раздел 2 или строка группы) ----- */
async function loadProfile(S, ids, how, st) {
  if (st) st('Загружаю публикации автора…');
  try { const aw = await authorWorks({ ids }, 0); const js = aw.works.map(w => judgeProfileWork(w, ids)); const info = await authorInfo(ids); S.prof = { aw, js, ids, how, info: info.length ? info : ids.map(id => ({ id, name: id })) }; S.cands = null; }
  catch (e) { S.prof = { err: 'публикации автора не загружены: ' + e.message }; }
}
/* Идентификаторы, привязанные к записи ORCID найденного автора (Scopus ID, ResearcherID) — для блока «Профили автора» */
async function fetchOrcidIds(S) {
  const orcid = (S.parsed && S.parsed.orcid) || (S.prof && !S.prof.err ? (S.prof.info.find(a => a.orcid) || {}).orcid : '');
  if (!orcid) { S.orcIds = null; return; }
  if (S.orcIds && S.orcIds.orcid === orcid) return;
  const r = await orcidExternalIds(orcid); S.orcIds = { orcid, list: r.list, err: r.err };
}
/* ----- Поиск автора: идентификаторы → реестр ORCID → статьи списка → ФИО (латиница и кириллица) ----- */
const fioOK = (name, alt, fios) => fios.some(f => [name].concat(alt || []).some(n => nameMatch(n, f)));
async function byOrcid(S, orcid, how, st) { const a = await authorByOrcid(orcid); if (a) { await loadProfile(S, [a.id], how, st); return a; } S.msgs.push(`ORCID ${orcid} в OpenAlex не найден — у автора нет статей, известных базе, или профиль не связан с ORCID`); return null; }
async function searchAuthor(S, input, st) {
  st = st || (() => { }); const p = parseAuthorInput(input); S.parsed = p;
  const fios = parseFIO(p.name);
  if (!p.orcid && !p.scopus && !p.rid && !fios.length) { S.msgs.push(p.orcidBad ? 'ORCID записан с ошибкой, других сведений нет' : (p.spin || p.rinc ? 'по SPIN-коду и AuthorID РИНЦ в открытых базах поиска нет — добавьте ФИО (можно кириллицей)' : 'укажите ФИО, ORCID, Scopus ID или ResearcherID')); return; }
  let found = null;
  try {
    if (p.orcidBad) S.msgs.push(`ORCID ${p.orcidBad} записан с ошибкой (контрольная цифра не сходится) — по нему не искали`);
    // 1. ORCID — точно
    if (p.orcid) { st('Ищу автора по ORCID…'); found = await byOrcid(S, p.orcid, 'по ORCID ' + p.orcid, st); }
    // 2. Scopus ID в OpenAlex (известен базе лишь у немногих авторов)
    if (!found && p.scopus) { st('Ищу автора по Scopus ID в OpenAlex…'); const r = await authorByScopus(p.scopus); if (r.list.length === 1) { await loadProfile(S, [r.list[0].id], 'по Scopus ID ' + p.scopus + ' (OpenAlex)', st); found = r.list[0]; } else if (r.list.length > 1) S.msgs.push('по Scopus ID в OpenAlex несколько профилей'); }
    // 3. Scopus ID и ResearcherID в реестре ORCID: найден ORCID → точный поиск
    for (const [lab, id] of [['Scopus ID', p.scopus], ['ResearcherID', p.rid]]) {
      if (found || !id) continue; st(`Ищу ${lab} в реестре ORCID…`);
      const r = await orcidSearch(`external-id-reference:"${id}"`);
      if (r.err) { S.msgs.push(`поиск ${lab} в реестре ORCID не выполнен: ${r.err}`); continue; }
      if (r.list.length === 1) found = await byOrcid(S, r.list[0].orcid, `по ${lab} ${id}: реестр ORCID → ORCID ${r.list[0].orcid} → OpenAlex`, st);
      else if (r.list.length > 1) S.msgs.push(`${lab} ${id} привязан в реестре ORCID к нескольким записям — выберите по имени`);
      else S.msgs.push(`${lab} ${id} не привязан ни к одной записи в реестре ORCID`);
    }
    if (p.scopus && !found && !S.msgs.some(m => /Scopus ID/.test(m) && /OpenAlex/.test(m))) S.msgs.push('OpenAlex знает Scopus ID лишь у немногих авторов');
    // 4. ФИО среди авторов статей из списка — точно, если список найден
    if (!found && fios.length && W.entries) {
      const det = detectLeader(W.works, [...new Set(fios.map(f => canonName(f.sur)))]); let ch = det.chosen.filter(a => fioOK(a.name, [], fios)), how = 'по ФИО среди авторов статей из списка';
      // однофамильцы среди авторов статей: организация оставляет того, у кого она совпала (правка 1)
      const org = $('org').value.trim();
      if (ch.length && org) { const r = leaderByOrg(W.works, ch, org); if (r.hit === 'none') S.msgs.push(ORG_NONE); else if (r.list.length < ch.length) { ch = r.list; how += ', совпала организация'; } }
      if (ch.length) { await loadProfile(S, ch.map(a => a.id), how, st); found = ch[0]; }
    }
    // 5. ФИО в OpenAlex и реестре ORCID, латиницей и кириллицей
    if (!found && fios.length) { st('Ищу автора по ФИО…'); const pick = await nameSearch(S, fios); if (pick) { await loadProfile(S, [pick.id], pick.how, st); found = pick; } }
    // проверка: идентификатор и введённое ФИО указывают на одного человека
    if (found && S.prof && !S.prof.err && fios.length) { const inf = S.prof.info[0] || {}; if (!fioOK(inf.name || found.name, inf.alt || found.alt, fios)) S.msgs.push(`найден «${inf.name || found.name}», а введено «${p.name}» — проверьте, тот ли это человек`); }
    // другие профили того же человека в OpenAlex (база иногда делит автора на несколько)
    if (S.prof && !S.prof.err) await findSimilar(S);
  } catch (e) { S.msgs.push('поиск не выполнен: ' + e.message); }
  try { await fetchOrcidIds(S); } catch (e) { }
}
const ORG_NONE = 'по указанной организации совпадений нет — возможно, автор сменил место работы или база её не знает';
async function runAuthor() {
  if (BUSY || !REF) return; BUSY = true; $('ago').disabled = true; applyNet(); W.auto = null; AU = newS();
  $('outAuthor').innerHTML = ''; $('auOut').style.display = 'none'; updateNav(); goTo('astatus');  // прежний результат убирается сразу
  CACHE.hits = 0; CACHE.oldest = 0; await searchAuthor(AU, $('author').value, t => { $('astatus').textContent = t; });
  if (W.entries) rejudge();
  BUSY = false; $('ago').disabled = false; $('astatus').textContent = cacheNote().trim(); renderAll(); goTo('outAuthor'); saveState();
}
/* Правка 4: перейти к следующему автору — поле и его результаты очищаются, список публикаций не трогается */
function resetAuthor() {
  if (BUSY) return;
  AU = newS(); W.auto = null; FLT.au = FLT0();
  $('author').value = ''; $('aparsed').textContent = ''; $('astatus').textContent = '';
  $('outAuthor').innerHTML = ''; $('auOut').style.display = 'none';
  if (W.entries) { rejudge(); renderList(); }
  updateNav(); goTo('inp'); $('author').focus(); saveState();
}
/* Поиск по ФИО. Возвращает автора, если он определён однозначно, иначе заполняет S.cands для выбора. */
async function nameSearch(S, fios) {
  const qs = new Set(), oq = new Set();
  for (const f of fios.slice(0, 2)) {
    const surs = translitVariants(f.sur).slice(0, 4), g = f.given ? translitVariants(f.given)[0] : (f.ini ? (isCyr(f.ini) ? translit(f.ini.toLowerCase()).toUpperCase() : f.ini) : '');
    surs.forEach(sv => qs.add((g ? g + ' ' : '') + sv)); if (isCyr(f.sur)) qs.add([f.given, f.sur].filter(Boolean).join(' '));
    oq.add(`family-name:${surs[0]}` + (g && g.length > 1 ? ` AND given-names:${g}` : ''));
  }
  const oa = new Map();
  for (const q of [...qs].slice(0, 6)) { try { (await searchAuthors(q)).forEach(a => { if (!oa.has(a.id)) oa.set(a.id, a); }); } catch (e) { S.msgs.push('поиск в OpenAlex не выполнен: ' + e.message); break; } }
  const strict = [...oa.values()].filter(a => fioOK(a.name, a.alt, fios));
  let orc = []; for (const q of oq) { const r = await orcidSearch(q); if (r.err) { S.msgs.push('поиск по имени в реестре ORCID: ' + r.err); break; } orc = orc.concat(r.list.filter(x => fioOK(x.name, [], fios))); }
  const fullGiven = a => fios.some(f => f.given && [a.name].concat(a.alt || []).some(n => { const t = n.replace(/\./g, ' ').split(/\s+/).filter(Boolean); return t.some(x => x.length > 1 && canonName(x) === canonName(f.given)); }));
  const patr = a => fios.some(f => f.patr && [a.name].concat(a.alt || []).some(n => n.replace(/\./g, ' ').split(/\s+/).some(x => x.length === 1 && canonName(x)[0] === canonName(f.patr)[0])));
  strict.forEach(a => { a.fullGiven = fullGiven(a); a.patr = patr(a); a.inOrcid = !!(a.orcid && orc.some(o => o.orcid === a.orcid)); a.ru = /\bRU\b/.test(a.country || ''); });
  // русские названия организаций нужны до сортировки: организацию вводят по-русски (правка 1)
  if (strict.length) { const ru = await instRu([].concat(...strict.slice(0, 40).map(a => a.instIds || []))); strict.forEach(a => { a.instRu = [...new Set((a.instIds || []).map(id => ru[id]).filter(Boolean))].join('; '); }); }
  const org = $('org').value.trim(); rankList(strict, org);
  const orcOnly = orc.filter(o => !strict.some(a => a.orcid === o.orcid)).filter((o, i, arr) => arr.findIndex(x => x.orcid === o.orcid) === i);
  const orgAny = strict.some(a => a.org === 'yes' || a.org === 'part');
  if (org && strict.length && !orgAny) S.msgs.push(ORG_NONE);
  // однозначно по организации: ровно один кандидат с полным именем, у которого совпала организация
  if (org) { const oy = strict.filter(a => a.fullGiven && a.org === 'yes'); if (oy.length === 1) { oy[0].how = 'по ФИО и организации: единственный профиль с полным именем, у которого совпала организация' + (oy[0].patr ? ', совпадает инициал отчества' : ''); return oy[0]; } }
  // однозначно: ровно один кандидат с полным совпадением имени и (отчеством или подтверждением в реестре ORCID);
  // но если организация указана и у него не совпала, а у другого совпала — пусть выберет человек
  const sure = strict.filter(a => a.fullGiven && (a.patr || a.inOrcid));
  if (sure.length === 1 && strict.filter(a => a.fullGiven).length === 1 && !(org && sure[0].org !== 'yes' && orgAny)) { sure[0].how = 'по ФИО: единственный подходящий профиль' + (sure[0].patr ? ', совпадает инициал отчества' : '') + (sure[0].inOrcid ? ', подтверждён реестром ORCID' : ''); return sure[0]; }
  S.cands = strict.slice(0, 12); S.orcCands = orcOnly.slice(0, 8);
  if (!strict.length && !orcOnly.length) S.msgs.push(`по ФИО не найдено (искали: ${[...qs].slice(0, 6).join('; ')})`);
  return null;
}
/* Вес кандидата: полное имя 4, совпала организация 4 (частично 2), инициал отчества 3, запись в реестре ORCID 2, Россия 1, число работ до 2 */
const splitNames = t => String(t || '').split(/;\s*/).filter(Boolean);
function rankList(list, org) {
  list.forEach(a => { a.org = orgHit(splitNames(a.inst).concat(splitNames(a.instRu)), org); a.score = (a.fullGiven ? 4 : 0) + (a.org === 'yes' ? 4 : (a.org === 'part' ? 2 : 0)) + (a.patr ? 3 : 0) + (a.inOrcid ? 2 : 0) + (a.ru ? 1 : 0) + Math.min(2, Math.log10((a.works || 0) + 1)); });
  return list.sort((a, b) => b.score - a.score);
}
function rankCands(S) { const org = $('org').value.trim(); rankList(S.cands || [], org); S.msgs = (S.msgs || []).filter(m => m !== ORG_NONE); if (org && (S.cands || []).length && !S.cands.some(a => a.org === 'yes' || a.org === 'part')) S.msgs.push(ORG_NONE); }
async function findSimilar(S) {
  const inf = S.prof.info[0]; if (!inf) return; const fios = parseFIO(inf.name); let list = [];
  try { list = await searchAuthors(inf.name); } catch (e) { return; }
  S.similar = list.filter(a => S.prof.ids.indexOf(a.id) < 0 && fioOK(a.name, a.alt, fios) && (!a.orcid || !inf.orcid || a.orcid === inf.orcid)).slice(0, 6);
}
async function afterPick(k) { const S = stOf(k); if (S.prof && !S.prof.err) { await findSimilar(S); try { await fetchOrcidIds(S); } catch (e) { } } if (W.entries) rejudge(); BUSY = false; renderAll(); goTo('outAuthor'); saveState(); }
async function addProfile(id, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); const ids = S.prof.ids.concat([id]); await loadProfile(S, ids, S.prof.how + '; добавлен профиль ' + id); S.similar = (S.similar || []).filter(a => a.id !== id); if (W.entries) rejudge(); BUSY = false; renderAll(); goTo('outAuthor'); saveState(); }
async function pickOrcid(orcid, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); S.msgs = []; await byOrcid(S, orcid, 'выбран вручную: ORCID ' + orcid); await afterPick(k); }
async function pickAuthor(id, k) { k = k == null ? -1 : k; if (BUSY) return; BUSY = true; const S = stOf(k); await loadProfile(S, [id], 'выбран вручную из найденных по имени'); await afterPick(k); }

/* Ссылки у кандидата: ORCID и Scopus — если идентификатор известен, иначе поиск в Scopus по имени; OpenAlex — последней */
function scopusNameUrl(name) { const t = String(name || '').replace(/[.,]/g, ' ').split(/\s+/).filter(Boolean); if (!t.length) return 'https://www.scopus.com/freelookup/form/author.uri'; const last = t[t.length - 1], first = t.length > 1 ? t[0] : ''; return 'https://www.scopus.com/results/authorNamesList.uri?origin=searchauthorlookup&src=al&st1=' + encodeURIComponent(last) + (first ? '&st2=' + encodeURIComponent(first) : ''); }
function candLinks(a) { return [a.orcid ? lnk('https://orcid.org/' + a.orcid, 'ORCID') : '', a.scopus ? lnk('https://www.scopus.com/authid/detail.uri?authorId=' + a.scopus, 'Scopus') : lnk(scopusNameUrl(a.name), 'Scopus: поиск по имени'), lnk('https://openalex.org/' + a.id, 'OpenAlex')].filter(Boolean).join(' · '); }
/* ----- Профили автора: все ссылки, откуда взят идентификатор, расхождения ----- */
const BASES = {
  orcid: { name: 'ORCID', url: v => 'https://orcid.org/' + v },
  scopus: { name: 'Scopus', url: v => 'https://www.scopus.com/authid/detail.uri?authorId=' + v, note: 'открывается и без подписки (ограниченный просмотр)' },
  rid: { name: 'Web of Science (ResearcherID)', url: v => 'https://www.webofscience.com/wos/author/rid/' + v, note: 'нужен доступ к Web of Science' },
  rinc: { name: 'eLibrary (РИНЦ AuthorID)', url: v => 'https://elibrary.ru/author_profile.asp?authorid=' + v },
  spin: { name: 'eLibrary (SPIN-код)', url: () => 'https://elibrary.ru/authors.asp', note: 'прямой ссылки по SPIN-коду нет — поиск в разделе «Авторы»' },
  openalex: { name: 'OpenAlex', url: v => 'https://openalex.org/' + v },
};
function profileLinks(S) {
  const ids = [], add = (b, v, src) => { v = String(v || '').trim(); if (!v) return; if (b === 'rid' || b === 'orcid') v = v.toUpperCase(); const o = ids.find(x => x.b === b && x.v === v); if (o) { if (o.src.indexOf(src) < 0) o.src.push(src); } else ids.push({ b, v, src: [src] }); };
  const p = S.parsed || {};
  add('orcid', p.orcid, 'введено'); add('scopus', p.scopus, 'введено'); add('rid', p.rid, 'введено'); add('rinc', p.rinc, 'введено'); add('spin', p.spin, 'введено');
  const prof = S.prof && !S.prof.err ? S.prof : null;
  if (prof) prof.info.forEach(a => { add('orcid', a.orcid, 'из OpenAlex'); add('scopus', a.scopus, 'из OpenAlex'); add('openalex', a.id, 'из OpenAlex'); });
  if (S.orcIds) S.orcIds.list.forEach(x => { const t = x.type.toLowerCase(); if (/scopus/.test(t)) add('scopus', x.value, 'из ORCID'); else if (/researcher\s*id|researcherid|wos|web of science/.test(t)) add('rid', x.value, 'из ORCID'); else if (/elibrary|rinc|ринц/.test(t)) add('rinc', x.value, 'из ORCID'); });
  const order = ['orcid', 'scopus', 'rid', 'rinc', 'spin', 'openalex']; ids.sort((a, b) => order.indexOf(a.b) - order.indexOf(b.b));
  const warns = [];
  for (const b of ['orcid', 'scopus', 'rid', 'rinc']) { const vs = ids.filter(x => x.b === b); if (vs.length > 1) warns.push(`${BASES[b].name}: идентификаторы различаются — ${vs.map(x => x.v + ' (' + x.src.join(', ') + ')').join(' и ')}. У автора бывает несколько профилей, но проверьте`); }
  // ссылки-поиски по имени
  const lat = prof && prof.info[0] && prof.info[0].name && !/^A\d+$/.test(prof.info[0].name) ? prof.info[0].name : (p.name && !isCyr(p.name) ? p.name : (p.name ? (() => { const f = parseFIO(p.name)[0]; return f ? [f.given ? translitVariants(f.given)[0] : '', translitVariants(f.sur)[0]].filter(Boolean).join(' ') : ''; })() : ''));
  const cyr = p.name && isCyr(p.name) ? p.name : '';
  const e = encodeURIComponent, sr = [];
  if (lat) {
    sr.push({ b: 'Google Scholar', u: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=' + e(lat), q: lat });
    sr.push({ b: 'ResearchGate', u: 'https://www.researchgate.net/search/researcher?q=' + e(lat), q: lat });
    sr.push({ b: 'Semantic Scholar', u: 'https://www.semanticscholar.org/search?q=' + e(lat), q: lat });
    if (!ids.some(x => x.b === 'orcid')) sr.push({ b: 'ORCID', u: 'https://orcid.org/orcid-search/search?searchQuery=' + e(lat), q: lat });
    if (!ids.some(x => x.b === 'scopus')) sr.push({ b: 'Scopus', u: 'https://www.scopus.com/freelookup/form/author.uri', q: lat, manual: true });
    if (!ids.some(x => x.b === 'rid')) sr.push({ b: 'Web of Science', u: 'https://www.webofscience.com/wos/author/search', q: lat, manual: true });
  }
  if ((cyr || lat) && !ids.some(x => x.b === 'rinc')) sr.push({ b: 'eLibrary', u: 'https://elibrary.ru/authors.asp', q: cyr || lat, manual: true });
  return { ids, warns, sr, orcErr: S.orcIds && S.orcIds.err ? S.orcIds.err : '' };
}
function profileLinksHtml(S, k) {
  const L = profileLinks(S); if (!L.ids.length && !(S.prof && !S.prof.err)) return '';
  let h = `<div class="plinks"><b>Профили автора</b>`;
  if (L.warns.length) h += `<p>${chip('check', 'проверьте')} ${L.warns.map(esc).join('; ')}.</p>`;
  if (L.ids.length) h += '<table class="t"><tr><th style="width:26%">База</th><th style="width:26%">Идентификатор</th><th>Ссылка</th></tr>' + L.ids.map(x => { const B = BASES[x.b]; return `<tr><td>${esc(B.name)}</td><td title="откуда взят: ${esc(x.src.join(', '))}">${esc(x.v)}</td><td>${lnk(B.url(x.v))}${B.note ? ' <span class="dim">— ' + esc(B.note) + '</span>' : ''}</td></tr>`; }).join('') + '</table>';
  if (L.orcErr) h += `<p class="dim" style="margin-bottom:0">Идентификаторы из записи ORCID не получены: ${esc(L.orcErr)}.</p>`;
  if (!(S.prof && !S.prof.err)) h += hirschHtml(S, k, L);   // без найденного профиля — прежней строкой, с найденным — плашкой вверху
  return h + ` <p style="margin:6px 0 0"><button class="sec small" onclick="copyLinks(${k})">Скопировать ссылки</button></p></div>`;
}
/* ----- Индекс Хирша по базам. Scopus, WoS и РИНЦ открытых интерфейсов не дают — утилита значение не получает, даёт ссылку, где его посмотреть;
   OpenAlex считает свой Хирш (по своей базе, с самоцитированием) — показывается справочно. ----- */
const H_BASES = [['scopus', 'Scopus', 'scopus'], ['wos', 'Web of Science', 'rid'], ['rinc', 'РИНЦ (eLibrary)', 'rinc']];
const H_NOTE = { scopus: 'h-индекс виден в профиле и без подписки (рядом с числом документов)', wos: 'нужен доступ к Web of Science', rinc: '' };
function hirschLink(L, idb) { const x = L.ids.find(i => i.b === idb); if (x) return { u: BASES[idb].url(x.v), t: 'профиль ' + x.v }; const s = L.sr.find(i => i.b === ({ scopus: 'Scopus', rid: 'Web of Science', rinc: 'eLibrary' })[idb]); return s ? { u: s.u, t: 'поиск автора', q: s.manual ? s.q : '' } : null; }
/* Индекс Хирша — заметной плашкой рядом с именем автора (правка 2, 0.7.11): крупно OpenAlex, рядом ссылки Scopus · WoS · РИНЦ */
function hirschPlate(S, L) {
  const prof = S.prof, oa = prof.info.filter(a => a.h != null);
  const links = H_BASES.map(([key, name, idb]) => { const l = hirschLink(L, idb), nm = { scopus: 'Scopus', wos: 'WoS', rinc: 'РИНЦ' }[key]; return l ? `<a target="_blank" rel="noopener" href="${esc(l.u)}" title="${esc((l.q ? 'форма поиска автора' : l.t) + (H_NOTE[key] ? ' — ' + H_NOTE[key] : ''))}">${nm}</a>` : `<span class="dim" title="профиля нет">${nm}</span>`; });
  return `<div class="hplate" title="OpenAlex считает индекс Хирша по своей базе и с самоцитированием — со Scopus, WoS и РИНЦ не совпадает. Их значений в открытом доступе нет — откройте и посмотрите сами."><div class="hl">Индекс<br>Хирша</div>`
    + `<div><div class="hv">${oa.length ? oa.map(a => a.h).join(', ') : '—'}</div><div class="dim" style="font-size:11px">OpenAlex, свой расчёт</div></div>`
    + `<div class="hs">${links.join(' · ')} — посмотреть<div class="dim" style="font-size:11px">открытых значений нет</div></div></div>`;
}
/* Правка 5 (0.7.10): индекс Хирша одной строкой — остаётся, когда профиль не найден */
function hirschHtml(S, k, L) {
  const prof = S.prof && !S.prof.err ? S.prof : null; if (!prof && !L.ids.length) return '';
  const parts = H_BASES.map(([key, name, idb]) => {
    const l = hirschLink(L, idb);
    return `${esc(name)} — ` + (l ? lnk(l.u, l.q ? 'форма поиска' : 'посмотреть') + (H_NOTE[key] ? ` <span class="dim" title="${esc(H_NOTE[key])}">?</span>` : '') : '<span class="dim">профиля нет</span>');
  });
  const oa = prof ? prof.info.filter(a => a.h != null) : [];
  parts.push(`OpenAlex ${oa.length ? '<b>' + oa.map(a => a.h).join(', ') + '</b>' : '<span class="dim">нет данных</span>'} <span class="dim" title="считается по базе OpenAlex и с самоцитированием — с Scopus, WoS и РИНЦ не совпадает">(свой расчёт)</span>`);
  return `<div class="hline"><b>Индекс Хирша</b> <span class="dim" title="Scopus, WoS и РИНЦ открытых источников не дают — утилита значение не получает, откройте и посмотрите сами">(посмотрите сами)</span>: ${parts.join(' · ')}</div>`;
}
function copyLinks(k) {
  const S = stOf(k), L = profileLinks(S), out = [];
  L.ids.forEach(x => out.push(tsvRow([BASES[x.b].name, x.v, x.src.join(', '), BASES[x.b].url(x.v)])));
  L.sr.forEach(x => out.push(tsvRow([x.b + ' — поиск по имени', x.q, '', x.u])));
  if (L.warns.length) out.push(tsvRow(['Проверьте', L.warns.join('; ')]));
  if (S.prof && !S.prof.err) S.prof.info.filter(a => a.h != null).forEach(a => out.push(tsvRow(['Индекс Хирша OpenAlex (свой расчёт)', a.h, a.id, 'https://openalex.org/' + a.id])));
  toClip(out.join('\n'), 'astatus');
}

const wLink = w => w.doi ? 'https://doi.org/' + w.doi : (w.oaId ? 'https://openalex.org/' + w.oaId : '');
const profRows = (S, fid) => sortRows(S.prof.js.filter(x => passFilter(profKey(x), FLT[fid])), fid, profKey);
function aRows() { return profRows(AU, 'au'); }
/* Тело раздела об одном авторе: сообщения, профили, выбор кандидата, таблица публикаций */
function authorBody(S, k, fid, withFilter) {
  const prof = S.prof, kk = k < 0 ? '' : ',' + k; let h = '';
  if (prof && !prof.err) {
    // шапка автора: имя, организация, число работ — и рядом плашка индекса Хирша
    h += `<div class="auhead"><div class="auname">${prof.info.map(a => `<div class="nm">${esc(a.name)}</div><div class="dim">${[a.inst ? esc(a.inst) : '', a.works != null ? 'работ в базе: ' + a.works : ''].filter(Boolean).join(' · ')}</div>`).join('')}`
      + `<div class="dim" style="margin-top:4px" title="Профиль собран базой автоматически: возможны чужие статьи и пропуски">Как найден: ${esc(prof.how)}.${prof.info.length > 1 ? ' Профилей несколько — публикации собраны со всех, проверьте, что это один человек.' : ''}</div></div>${hirschPlate(S, profileLinks(S))}</div>`;
  }
  if (S.msgs.length) h += `<p>${chip('check', 'обратите внимание')} ${S.msgs.map(esc).join('; ')}.</p>`;
  h += profileLinksHtml(S, k);
  if (prof && prof.err) h += `<p>${chip('unk', 'не загружено')} ${esc(prof.err)}</p>`;
  else if (prof) {
    const all = prof.js, rows = profRows(S, fid), cnt = q => rows.filter(x => x.j.sj && x.jv.qY === q).length, wl1 = rows.filter(x => rowKey(x.w.year, x.j, x.jv).wl === 1).length, cy = rows.filter(x => x.corrSt === 'yes').length;
    h += `<p>Источник — ${prof.aw.source}. Статей и обзоров за все годы: <b>${all.length}</b>.` + (prof.aw.capped ? ' Показаны первые 2000 — список обрезан.' : '') + '</p>';
    if (k < 0 && W.entries) { const miss = W.pubs.filter(p => p.work && p.work.doi && TYPE_OK[p.work.type] && !all.some(x => x.w.doi === p.work.doi)); if (miss.length) h += `<p>${chip('check', 'проверьте')} В профиле автора нет ${miss.length} из найденных статей списка (№ ${miss.map(p => numOf(p.entry, W.pubs.indexOf(p))).join(', ')}): профиль в базе неполный либо это другой автор.</p>`; }
    if (withFilter) h += filterBar(fid, rows.length, all.length, noCpdHidden(all.map(profKey), FLT[fid]));
    h += `<div class="sum" title="по показанным строкам; квартиль и уровень — на год публикации">${[['Q1', cnt(1)], ['Q2', cnt(2)], ['Q3', cnt(3)], ['Q4', cnt(4)], ['без квартиля', rows.filter(x => !x.j.sj || !x.jv.qY).length], ['БС 1', wl1], ['corresponding', cy]].map(([t, n]) => `<span class="sb"><b>${n}</b> ${t}</span>`).join('')}</div>`;
    const listed = new Set(W.entries ? W.pubs.filter(p => p.work).map(p => p.work.doi) : []), dn = doneCnt(all.map(markKeyA));
    if (dn) h += `<p class="dim">Отмечено «проверено»: ${dn} из ${all.length}.</p>`;
    if (!all.length) h += '<p class="dim">Статей нет. Это не значит, что их нет вообще: профиль в базе может быть пустым.</p>';
    else if (!rows.length) h += '<p class="dim">Под фильтр не подходит ни одна статья.</p>';
    else h += `<table class="t"><tr>${sortTh(fid, 'year', 'Год', 'width:8%')}<th>Статья и ссылка</th><th style="width:16%">Издание</th>${sortTh(fid, 'q', 'Квартиль', 'width:12%')}${sortTh(fid, 'wl', 'Белый список', 'width:12%')}${sortTh(fid, 'if', 'Импакт-фактор<div class="sub">SCImago</div>', 'width:9%')}<th style="width:9%">Место автора</th><th style="width:12%">Corresponding</th></tr>` + rows.map(x => {
      const url = wLink(x.w), mk = markKeyA(x);
      return `<tr${MARKS[mk] ? ' class="done"' : ''}><td>${x.w.year || ''}${markBox(mk)}</td><td>${esc(x.w.title)}${k < 0 && listed.has(x.w.doi) && x.w.doi ? ' ' + nchip('в списке') : ''}${x.w.type === 'review' ? ' <span class="dim">обзор</span>' : ''}<br>${url ? lnk(url) : chip('unk', 'ссылки нет')}</td><td>${esc(x.w.journal)}</td><td>${quartText(x.jv, x.j.sj, true, x.j.wl)}</td><td>${wlText(x.j.wl, x.w.year, true)}</td><td>${x.jv.cpd != null ? fmtNum(x.jv.cpd) : ''}</td><td class="dim">${esc(x.pos || '')}</td><td>${corrChip(x.corrSt, x.corrNames)}</td></tr>`;
    }).join('') + '</table>';
  } else if (S.cands || S.orcCands) {
    const c = S.cands || [], o = S.orcCands || [];
    if (c.length || o.length) {
      h += `<p>${chip('check', 'выберите')} По ФИО однозначно определить автора нельзя — выберите нужного. Сверху — лучше совпавшие: имя полностью, организация, инициал отчества, запись в реестре ORCID.${$('org').value.trim() ? '' : ' Укажите организацию автора — это поможет отличить однофамильцев.'}</p>`;
      if (c.length) h += `<table class="t cands"><tr><th style="width:19%">Имя</th><th style="width:23%">Организация</th><th style="width:20%">Разделы науки<div class="sub">OpenAlex, наведите — тема</div></th><th style="width:6%">Работ</th><th style="width:6%">Хирш<div class="sub">OpenAlex</div></th><th style="width:11%">Совпадения</th><th style="width:15%"></th></tr>` + c.map(a => { const cyr = (a.alt || []).filter(isCyr).sort((x, y) => y.length - x.length)[0];
        return `<tr><td><b>${esc(a.name)}</b><div>${cyr ? esc(cyr) : '<span class="dim">имени кириллицей в базе нет</span>'}</div></td><td>${a.inst ? esc(a.inst) + '<div>' + (a.instRu ? esc(a.instRu) : '<span class="dim">русского названия в базе нет</span>') + '</div>' : '<span class="dim">не указана</span>'}</td><td>${topicsHtml(a)}</td><td>${a.works}</td><td>${a.h != null ? a.h : ''}</td><td>${[a.fullGiven && nchip('имя'), a.org === 'yes' && chip('ok', 'организация совпала'), a.org === 'part' && nchip('организация — частично'), a.patr && nchip('отчество'), a.inOrcid && nchip('в ORCID'), a.ru && nchip('Россия')].filter(Boolean).join(' ')}</td><td><button class="sec" onclick="pickAuthor('${a.id}'${kk})">Это он</button><div class="dim">${candLinks(a)}</div></td></tr>`; }).join('') + '</table>';
      if (o.length) h += `<p class="dim">Найдены в реестре ORCID (в OpenAlex по имени не нашлись):</p><table class="t"><tr><th>Имя в ORCID</th><th style="width:36%">Организации</th><th style="width:18%">ORCID</th><th style="width:15%"></th></tr>` + o.map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.inst)}</td><td>${lnk('https://orcid.org/' + a.orcid, a.orcid)}</td><td><button class="sec" onclick="pickOrcid('${a.orcid}'${kk})">Это он</button><div class="dim">${lnk(scopusNameUrl(a.name), 'Scopus: поиск по имени')}</div></td></tr>`).join('') + '</table>';
      h += '<p class="dim">Надёжнее всего — ORCID или поиск по статьям из списка: тогда автор определяется без выбора.</p>';
    } else h += `<p>${chip('unk', 'не найден')} По этим сведениям автор в открытых базах не найден. Попробуйте ORCID или сначала найдите публикации из списка.</p>`;
  }
  if (prof && !prof.err && S.similar && S.similar.length) h += `<p>${chip('check', 'проверьте')} В OpenAlex есть ещё профили с тем же именем — база иногда делит одного автора на несколько. Если это он, добавьте его публикации:</p><table class="t"><tr><th>Имя</th><th style="width:30%">Организация</th><th style="width:8%">Работ</th><th style="width:22%"></th></tr>` + S.similar.map(a => `<tr><td>${esc(a.name)}</td><td>${esc(a.inst)}</td><td>${a.works}</td><td><button class="sec" onclick="addProfile('${a.id}'${kk})">Добавить его публикации</button> ${lnk('https://openalex.org/' + a.id, 'профиль')}</td></tr>`).join('') + '</table>';
  return h;
}
function renderAuthor() {
  const S = AU;
  if (!S.prof && !S.cands && !S.orcCands && !S.msgs.length && !S.parsed) { $('outAuthor').innerHTML = ''; $('auOut').style.display = 'none'; return; }
  $('outAuthor').innerHTML = '<h2>Автор</h2>' + authorBody(S, -1, 'au', true).replace('<p>Источник —', '<h2 id="auWorks">Все публикации автора</h2><p>Источник —');
  $('auOut').style.display = S.prof && !S.prof.err ? '' : 'none';
}

/* ----- Копирование ----- */
const tsvRow = a => a.map(x => String(x == null ? '' : x).replace(/[\t\n]/g, ' ')).join('\t');
const wlS = (wl, year) => { if (!wl) return 'нет'; const a = wlAt(wl, year); return (a.excluded ? 'исключён ' + wl.disc : (a.lv ? a.lv + ' (' + a.y + ')' : 'без уровня')) + (!a.excluded && (a.curExcl || a.cur !== a.lv) ? '; сейчас ' + (a.curExcl ? 'исключён' : a.cur || 'без уровня') : ''); };
const idxS = wl => !wl ? 'нет данных' : ['WoS CC', 'Scopus', 'RSCI'].filter((n, i) => [wl.wos, wl.scopus, wl.rsci][i]).join(', ') || 'ни в одной';
const corrS = w => !w.oa ? 'нет данных' : (!w.corr || !w.corr.known ? 'в базе не указан' : w.corr.names.join(', '));
const orgS = me => orgNames(me).join('; ');
const markS = k => MARKS[k] ? 'да' : '';
/* Таблица для копирования и выгрузки файлом: числа — числами (Excel сам покажет их по-русски) */
function listTable() {
  const ids = auIds().length; const L = [['№', 'Проверено', 'Найденная статья', 'Ссылка', 'Год', 'Тип', 'Издание', 'ISSN', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Индексация (Белый список)', 'Белый список (год публикации)', 'Импакт-фактор (SCImago, цит. на документ за 2 года)', 'Импакт-фактор в списке', 'Corresponding (OpenAlex)'].concat(ids ? ['Найденный автор — corresponding', 'Организация автора'] : []).concat(['Первый автор', 'Последний автор', 'Примечания', 'Запись из списка'])];
  listRows().forEach(({ p, i }) => { const w = p.work, jv = p.jv || {}, a = w ? w.authors : [], m = w ? listMe(w) : null, num = numOf(p.entry, i);
    L.push([typeof num === 'number' ? num : String(num), markS(markKeyL(p)), w ? w.title : (p.found === 'patent' ? 'патент — не ищется' : (p.found === 'no' ? 'не найдена' : 'не проверена')), w ? wLink(w) : (p.entry.patentNo ? 'https://patents.google.com/patent/' + p.entry.patentNo : ''), w ? w.year : '', w ? p.typeName : (p.found === 'patent' ? 'патент' : ''), w ? w.journal : '', w ? w.issns.join(', ') : '', w && p.j.sj ? (jv.qY ? 'Q' + jv.qY : 'нет') + ' (' + jv.sjYear + ')' : '', w && p.j.sj && jv.qL ? 'Q' + jv.qL : '', w ? idxS(p.j.wl) : '', w ? wlS(p.j.wl, w.year) : '', w && jv.cpd != null ? Math.round(jv.cpd * 100) / 100 : '', p.declIF != null ? p.declIF : '', w ? corrS(w) : ''].concat(ids ? [m && m.me ? CORR_T[m.corr] : 'нет данных', m && m.me ? orgS(m.me) : ''] : []).concat([aName(a[0]), a.length > 1 ? aName(a[a.length - 1]) : '', p.notes.concat(dupNotes(i)).join('; '), p.entry.raw])); });
  return L;
}
function copyList() { if (!W.entries) return; toClip(listTable().map(r => tsvRow(r.map(cellTxt))).join('\n'), 'status'); }
function exportList(kind) { if (!W.entries) return; const t = listTable(), nm = 'Публикации_из_списка_' + today(); download(nm + '.' + kind, kind === 'xlsx' ? xlsxBlob('Публикации из списка', t) : csvBlob(t)); $('status').textContent = 'Файл ' + nm + '.' + kind + ' сохранён в папку загрузок.'; }
const profHead = () => ['Год', 'Проверено', 'Статья', 'Ссылка', 'Издание', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Белый список (год публикации)', 'Импакт-фактор (SCImago)', 'Место автора', 'Corresponding', 'Организация автора в статье'];
const profLine = x => [x.w.year, markS(markKeyA(x)), x.w.title, wLink(x.w), x.w.journal, x.j.sj ? (x.jv.qY ? 'Q' + x.jv.qY : 'нет') + ' (' + x.jv.sjYear + ')' : '', x.j.sj && x.jv.qL ? 'Q' + x.jv.qL : '', wlS(x.j.wl, x.w.year), x.jv.cpd != null ? Math.round(x.jv.cpd * 100) / 100 : '', x.pos || '', x.corrSt ? CORR_T[x.corrSt] + (x.corrSt === 'no' && x.corrNames.length ? ' (' + x.corrNames.join(', ') + ')' : '') : 'нет данных', orgS(x.me)];
function authorTable() { const hs = AU.prof.info.filter(a => a.h != null).map(a => a.h).join(', '); return [['Автор', AU.prof.info.map(a => a.name).join('; '), AU.prof.info.map(a => 'https://openalex.org/' + a.id).join(' '), hs ? 'Индекс Хирша OpenAlex (свой расчёт): ' + hs : ''], profHead()].concat(aRows().map(profLine)); }
function copyAuthor() { if (!AU.prof || AU.prof.err) return; toClip(authorTable().map(r => tsvRow(r.map(cellTxt))).join('\n'), 'astatus'); }
function exportAuthor(kind) { if (!AU.prof || AU.prof.err) return; const t = authorTable(), nm = 'Публикации_автора_' + today(); download(nm + '.' + kind, kind === 'xlsx' ? xlsxBlob('Публикации автора', t) : csvBlob(t)); $('astatus').textContent = 'Файл ' + nm + '.' + kind + ' сохранён в папку загрузок.'; }
function toClip(t, where) {
  const done = () => { $(where).textContent = 'Скопировано — вставьте в таблицу.'; };
  const fb = () => { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); done(); } catch (e) { } a.remove(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fb); else fb();
}
async function selfCheck() {
  if (BUSY) return; BUSY = true; applyNet(); const el = $('selfres');
  const rs = await runSelfCheck((i, n) => { el.textContent = `Проверяю ${i + 1} из ${n}…`; }); BUSY = false;
  const ok = rs.filter(r => r.ok).length;
  el.innerHTML = `<p><b>Самопроверка: верно ${ok} из ${rs.length}.</b> Это известные статьи с заранее записанными ответами; так видно, правильно ли утилита находит и разбирает публикации на этом компьютере.</p><table class="t"><tr><th style="width:8%">Поиск</th><th>Что искали</th><th style="width:12%">Итог</th><th style="width:38%">Подробности</th></tr>` +
    rs.map(r => `<tr><td>по ${r.c.how === 'doi' ? 'DOI' : 'тексту'}</td><td class="dim">${esc(r.c.q)}</td><td>${chip(r.ok ? 'ok' : (r.err ? 'unk' : 'no'), r.ok ? 'верно' : (r.err ? 'не выполнено' : 'расхождение'))}</td><td class="dim">${r.err ? esc(r.err) : r.checks.map(c => `${esc(c[0])}: ${c[1] ? 'да' : '<b>нет</b>'}`).join('; ') + (r.soft ? `; ${esc(r.soft[0])}: ${r.soft[1] ? 'да' : 'нет'} (${esc(r.soft[2])})` : '') + (r.ok ? '' : `<br>получено: ${esc(JSON.stringify(r.got))}`)}</td></tr>`).join('') + '</table>';
}
document.addEventListener('DOMContentLoaded', init);

