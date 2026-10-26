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
const VERSION = '0.9', VERSION_DATE = '26.10.2026';
/* Что нового — показывается на странице */
const CHANGES = [
  ['0.9', '26.10.2026', ['Начальный экран «Что проверяем»: три большие кнопки — Автор, Журнал, Публикации (Alt+1, Alt+2, Alt+3); под ними только выбранный раздел. При каждом открытии ни один раздел не выбран; введённое при переключении сохраняется. Снимок (Ctrl+V) или перетащенный документ сами открывают «Публикации».',
    'Результат открывается на отдельной подстранице: «← Новый поиск» (введённое в поля сохраняется), вкладки «Автор · Журналы · Публикации», кнопки «Скопировать · Excel · CSV · Печать». Кнопки «Назад» и «Вперёд» браузера работают.',
    'Подсказки при вводе журнала: под полем — подходящие журналы из справочников, по началу названия или любого слова, с ISSN и пометками SCImago, Белого списка и Scopus; выбор мышью или стрелками и Enter.',
    'Кнопки-наборы фильтра «Q1–Q2 или БС 1» и «Q1 или БС 1» — в таблице публикаций из списка и у автора.',
    'CiteScore Scopus 2025 (справочник Elsevier, 32 089 изданий): значение, квартиль по лучшей тематике, процентиль, место, SNIP — у издания в списке, у публикаций автора и в разделе «Журнал». Это отдельный показатель «сейчас», квартиль SCImago он не заменяет; в фильтр не входит. У изданий без квартиля SCImago (около 1800, в основном книжные серии и труды) теперь есть квартиль Scopus.',
    'Квартиль SCImago подписан годом: «Q1 в 2021» и «Q1 сейчас (2025)»; по годам — плашками «2021 Q1».',
    'Новое оформление «Тихий реестр»: шрифт IBM Plex, крупные числа, меньше рамок; журнал — строкой-ведомостью; автор — имя слева, индекс Хирша крупно справа, полоса итогов.']],
  ['0.8.1', '21.10.2026', ['Встроен список источников Scopus за сентябрь 2026 (49 104 издания): у издания — индексируется ли оно в Scopus и в какие годы, исключено ли (последний номер и причина), принято ли и ещё не загружено; «в Scopus есть, квартиля SCImago нет»; ссылка на страницу издания в Scopus. То же — в разделе «Журнал».']],
  ['0.8', '21.10.2026', ['Новый раздел «Журнал»: название или ISSN (по одному в строке) — квартиль SCImago, импакт-фактор, уровень Белого списка и индексация, сейчас, на указанный год и по годам. Название можно с опечатками и сокращениями.',
    'Документ PDF или Word: утилита сама находит в нём список или таблицу публикаций, показывает найденные записи (можно убрать лишние и поправить) и проверяет их. Сканы внутри PDF распознаются. Документ никуда не отправляется.',
    'Квартиль и импакт-фактор, указанные в списке или документе, показываются рядом с найденными («в списке: Q1»).',
    'Индекс Хирша: крупно — наибольшее из полученных значений с подписью базы. РИНЦ, Scopus, Web of Science, Google Scholar — «вставить страницу профиля» (текст или снимок): утилита сама находит на ней индекс. Где не получен — ссылка посмотреть; поиск в интернете.',
    'Ссылки на профили Scopus, Web of Science и eLibrary — прямые, если идентификатор есть в OpenAlex или ORCID (в том числе в ссылках профиля ORCID); расхождение — «проверьте».',
    'Организация автора больше не запоминается: «Найти другого автора» и новое открытие страницы начинают с пустого поля.']],
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
  if (data.sc && typeof loadSc === 'function') loadSc(R, data.sc);  // справочник Scopus (0.8), если собран
  if (data.cs && typeof loadCs === 'function') loadCs(R, data.cs);  // CiteScore Scopus (0.9), если собран
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
  if (typeof findSc === 'function') [out.sc, out.scHow] = findSc(issns, title);  // Scopus Source List (0.8)
  // CiteScore (0.9): по Scopus Source ID найденного издания, иначе по ISSN статьи; по одному названию — нет
  if (typeof findCs === 'function') out.cs = findCs([out.sj && out.sjHow !== 'ambiguous' ? out.sj.sid : null, out.sc && out.scHow !== 'ambiguous' ? out.sc.id : null], issns);
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
  // заявленный квартиль («Q1», «Квартиль: Q2») — показывается рядом с найденным (0.8)
  m = q.match(/(?:квартиль\s*:?\s*)?(?<![\w/.])Q\s?([1-4])(?!\w|\.\d)/i); if (m) { e.declQ = +m[1]; q = q.replace(m[0], ' '); }
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
  const csQ = j.cs && j.cs.q ? ' — есть квартиль по CiteScore ' + j.cs.year + ' (Q' + j.cs.q + ', сейчас)' : '';
  if (j.sc) { o.sc = j.sc; const a = scAt(j.sc, year); o.scIn = a.inCov; o.notes.push(...a.notes); if (!sj) o.notes.push('в Scopus есть, квартиля SCImago нет' + csQ); }
  else if (j.cs && !sj) o.notes.push('в Scopus есть, квартиля SCImago нет' + csQ);
  if (j.cs) o.cs = j.cs;  // CiteScore (0.9) — отдельный показатель, только «сейчас»: на квартиль SCImago, фильтр и сортировку не влияет
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
  if (entry.declQ != null) r.declQ = entry.declQ;
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

/* ===== 0.8: справочник Scopus, режим «Журнал», индекс Хирша из нескольких баз, идентификаторы автора, поиск публикаций в документе =====
   Только правила, без сети и без ИИ. Функции чистые — проверяются в evals/run.js. */

/* ---------- 1. Справочник Scopus (правка 3) ----------
   data.sc = { date, rows: [[название, 'ISSN EISSN', ID Scopus, статус, годы, исключён, послед. год, том, выпуск, причина, принят]] }
   статус: 1 — Active, 0 — Inactive, 2 — принят, но ещё не загружен (лист Accepted Titles). Собирается mkdata_scopus.py из публичного Scopus Source List. */
function loadSc(R, sc) {
  R.sc = sc.rows; R.scDate = sc.date || ''; R.scIssn = new Map(); R.scTitle = new Map();
  const put = (m, k, i) => { if (!k) return; const a = m.get(k); if (a) { if (a.indexOf(i) < 0) a.push(i); } else m.set(k, [i]); };
  sc.rows.forEach((r, i) => { String(r[1] || '').split(' ').forEach(x => put(R.scIssn, x, i)); put(R.scTitle, norm(r[0]), i); });
}
/* «2026; 2023-2024», «1996-ongoing» → [[2023, 2024], [2026, 2026], …] */
function parseCoverage(s) {
  const out = [];
  String(s || '').split(/[;,]/).forEach(p => { const m = p.trim().match(/^(\d{4})\s*(?:[-–—]\s*(\d{4}|ongoing|present|current|н\.?\s*в\.?))?$/i); if (!m) return; const a = +m[1], b = m[2] ? (/^\d{4}$/.test(m[2]) ? +m[2] : 9999) : a; out.push([Math.min(a, b), Math.max(a, b)]); });
  return out.sort((x, y) => x[0] - y[0]);
}
function scRec(i) {
  const r = REF.sc[i];
  return { title: r[0], issns: String(r[1] || '').split(' ').filter(Boolean), id: r[2] || null, status: r[3], cov: parseCoverage(r[4]), covText: r[4] || '', flag: !!r[5],
    disc: r[6] || r[9] ? { year: r[6] || null, vol: r[7] || '', iss: r[8] || '', reason: r[9] || '' } : null, acc: r[10] || '' };
}
const scHas = () => !!(REF && REF.sc);
/* Статус издания в Scopus на год публикации */
function scAt(sc, year) {
  const o = { inCov: null, afterDisc: false, notes: [] };
  if (!sc) return o;
  if (sc.status === 2) { o.notes.push(`журнал принят в Scopus${sc.acc ? ' ' + sc.acc : ''}, но ещё не загружен в базу — проверьте`); return o; }
  // у действующего журнала последние годы индексации — год выпуска списка: более поздняя статья ещё не могла попасть в список, это не «не индексировался»
  const listY = +(String(REF.scDate || '').match(/\d{4}/) || [])[0] || new Date().getFullYear(), lastEnd = sc.cov.length ? sc.cov[sc.cov.length - 1][1] : 0;
  if (year && sc.cov.length && sc.status === 1 && year > lastEnd && lastEnd >= listY - 1) { o.inCov = true; return o; }
  if (year && sc.cov.length) { o.inCov = sc.cov.some(([a, b]) => year >= a && year <= b); if (!o.inCov) o.notes.push(`проверьте: в ${year} году журнал в Scopus не индексировался (годы в Scopus: ${sc.covText})`); }
  if (sc.disc && sc.disc.year && year && year > sc.disc.year) { o.afterDisc = true; o.notes.push(`проверьте: статья вышла после последнего номера, проиндексированного Scopus (${scDiscText(sc.disc)})`); }
  return o;
}
const scDiscText = d => [d.year, d.vol ? 'том ' + d.vol : '', d.iss ? 'выпуск ' + d.iss : ''].filter(Boolean).join(', ');
function scStatusText(sc) {
  if (!sc) return '';
  if (sc.status === 2) return `принят в Scopus${sc.acc ? ' ' + sc.acc : ''}, ещё не загружен`;
  if (sc.disc || sc.flag) return 'исключён из Scopus' + (sc.disc && sc.disc.year ? ', последний номер — ' + scDiscText(sc.disc) : '') + (sc.disc && sc.disc.reason ? ' (' + scReason(sc.disc.reason) + ')' : '');
  return (sc.status === 1 ? 'индексируется' : 'не индексируется сейчас (Inactive)') + (sc.covText ? ', годы: ' + sc.covText : '');
}
const scReason = r => /change\s*policy/i.test(r) ? 'по смене политики журнала' : (/discontinu/i.test(r) ? 'из-за качества' : r);
const scLink = sc => sc && sc.id ? 'https://www.scopus.com/sourceid/' + sc.id : '';
function findSc(issns, title) {
  if (!scHas()) return [null, null];
  const hit = new Set(); (issns || []).map(normIssn).forEach(x => (REF.scIssn.get(x) || []).forEach(i => hit.add(i)));
  if (hit.size) return [scRec([...hit][0]), hit.size === 1 ? 'issn' : 'ambiguous'];
  const t = norm(title); if (!t) return [null, null];
  const a = REF.scTitle.get(t) || REF.scTitle.get(t.replace(/^the /, '')); if (!a) return [null, null];
  return [scRec(a[0]), a.length === 1 ? 'title' : 'ambiguous'];
}

/* ---------- 1а. CiteScore Scopus (0.9, правка 6) ----------
   data.cs = { year, subj: [тематика], rows: [[Scopus Source ID, 'ISSN EISSN', название (если нет в SCImago и списке Scopus), CiteScore, SNIP, тип, [[тематика, процентиль, квартиль, место, из скольких], …]]] }
   Тематики — наилучшая первой. Собирается mkdata_citescore.py из файла Elsevier. Это отдельный показатель: квартиль SCImago не заменяет.
   Elsevier разрешил показ в бесплатной открытой утилите при указании источника и ссылке — подпись CS_SRC и ссылка на Scopus у каждого значения. */
function loadCs(R, cs) {
  R.cs = cs.rows; R.csYear = cs.year; R.csSubj = cs.subj || []; R.csId = new Map(); R.csIssn = new Map();
  cs.rows.forEach((r, i) => { if (r[0]) R.csId.set(r[0], i); String(r[1] || '').split(' ').filter(Boolean).forEach(x => { const a = R.csIssn.get(x); if (a) a.push(i); else R.csIssn.set(x, [i]); }); });
}
const csHas = () => !!(REF && REF.cs);
const CS_TYPE = { j: 'журнал', k: 'книжная серия', p: 'труды конференций', d: 'отраслевой журнал' };
function csRec(i) {
  const r = REF.cs[i], subs = (r[6] || []).map(s => ({ name: REF.csSubj[s[0]] || '', pct: s[1], q: s[2], rank: s[3], of: s[4] }));
  return { sid: r[0], issns: String(r[1] || '').split(' ').filter(Boolean), title: r[2] || '', v: r[3], snip: r[4], type: r[5] || '', subs, best: subs[0] || null, q: subs[0] ? subs[0].q : null, year: REF.csYear };
}
/* Издание в справочнике CiteScore: по Scopus Source ID (он же Sourceid SCImago), иначе по ISSN — только если ISSN указывает на одно издание */
function findCs(sids, issns) {
  if (!csHas()) return null;
  for (const s of (sids || [])) { const i = s != null ? REF.csId.get(+s) : undefined; if (i != null) return csRec(i); }
  const hit = new Set(); (issns || []).map(normIssn).forEach(x => (REF.csIssn.get(x) || []).forEach(i => hit.add(i)));
  return hit.size === 1 ? csRec([...hit][0]) : null;
}
const csSrc = cs => `Scopus CiteScore ${cs ? cs.year : (REF && REF.csYear) || ''}, © Elsevier B.V.`;
const csLink = cs => cs && cs.sid ? 'https://www.scopus.com/sourceid/' + cs.sid : '';
/* Короткая запись для таблиц и выгрузки: «10,7 Q1» */
const csShort = cs => !cs ? '' : (cs.v != null ? fmtNum(cs.v) + ' ' : '') + (cs.q ? 'Q' + cs.q : 'без квартиля');

/* ---------- 2. Режим «Журнал» (правка 5): название или ISSN → издание по справочникам SCImago, Белого списка и Scopus ---------- */
const ISSN_Q = /\b(\d{4})\s*[-–]?\s*(\d{3}[\dXxХх])\b/g;
const ABBR = { j: 'journal', zh: 'zhurnal', 'вузов': 'высших учебных заведений', 'вуз': 'высших учебных заведений', 'ран': 'российской академии наук', 'мгу': 'московского университета', 'спбгу': 'санкт петербургского университета' };  // остальные сокращения («Phys.», «Rev.», «Compd.») узнаются как начало слова
function jqTokens(s) {
  const raw = String(s || '').replace(/[«»"“”]/g, ' ');
  return norm(isCyr(raw) ? raw : raw).split(' ').filter(t => t && !/^(the|of|and|for|in|on|и|в|по|для|на)$/.test(t)).flatMap(t => (ABBR[t] || t).split(' '));
}
/* совпадение слов: 1 — то же слово; 0,9 — сокращение (начало слова, от 3 букв) или опечатка в одну букву; 0 — нет */
const jqTokEq = (a, b) => a === b ? 1 : ((a.length >= 3 && b.startsWith(a)) || (b.length >= 3 && a.startsWith(b)) || (Math.min(a.length, b.length) >= 5 && lev(a, b, 1) <= 1) ? 0.9 : (abbrOf(a, b) || abbrOf(b, a) ? 0.85 : 0));
/* сокращение без части букв: «compd» — «compounds», «mater» — «materials» (первые три буквы совпадают, остальные идут по порядку) */
function abbrOf(a, b) { if (a.length < 4 || a.length > 6 || a.length > b.length - 2 || a.slice(0, 3) !== b.slice(0, 3)) return false; let j = 3; for (let i = 3; i < a.length; i++) { j = b.indexOf(a[i], j); if (j < 0) return false; j++; } return true; }
/* Похожесть названий: доля совпавших слов (с допуском на опечатку и сокращения), кириллица сравнивается и в латинице */
function titleSim(q, t) {
  const A = jqTokens(q), B0 = jqTokens(t); if (!A.length || !B0.length) return 0;
  const tr = x => isCyr(x) ? translit(x) : x; return tokSim(A.map(tr), B0.map(tr));
}
/* Указатель названий всех трёх справочников: слова (кириллица — в латинице) и первые три буквы слова → записи */
function jIndex() {
  if (REF._ji) return REF._ji; const list = [], pre = new Map();
  const addT = (k, i, t) => { const toks = jqTokens(t).map(x => isCyr(x) ? translit(x) : x), id = list.length; list.push({ k, i, nn: norm(t), toks }); new Set(toks.map(x => x.slice(0, 3))).forEach(p => { let a = pre.get(p); if (!a) pre.set(p, a = []); a.push(id); }); };
  REF.sj.forEach((r, i) => addT('sj', i, r[0])); REF.wl.forEach((r, i) => r[0].split(' | ').forEach(t => addT('wl', i, t))); if (scHas()) REF.sc.forEach((r, i) => addT('sc', i, r[0]));
  if (csHas()) REF.cs.forEach((r, i) => { if (r[2]) addT('cs', i, r[2]); });  // у CiteScore название хранится, только если его нет в других справочниках
  return (REF._ji = { list, pre });
}
function tokSim(A, B) { if (!A.length || !B.length) return 0; const used = new Set(), seq = []; let m = 0; A.forEach(a => { let k = B.findIndex((b, i) => !used.has(i) && a === b); if (k < 0) k = B.findIndex((b, i) => !used.has(i) && jqTokEq(a, b)); if (k >= 0) { used.add(k); seq.push(k); m += jqTokEq(a, B[k]); } }); const ordered = seq.every((k, i) => !i || k > seq[i - 1]); return 2 * m / (A.length + B.length) * (ordered ? 1 : 0.92); }
/* Издание по всем трём справочникам: собрать записи, связанные общими ISSN */
function journalEntity(issns, seed) {
  const e = { sj: null, wl: null, sc: null, cs: null, issns: new Set(), notes: [] };
  (issns || []).map(normIssn).filter(Boolean).forEach(x => e.issns.add(x));
  if (seed) e[seed.k] = seed.rec;
  for (let pass = 0; pass < 2; pass++) {
    [e.sj, e.wl, e.sc, e.cs].filter(Boolean).forEach(r => r.issns.forEach(x => e.issns.add(normIssn(x))));
    const is = [...e.issns];
    if (!e.sj) { const h = new Set(); is.forEach(x => (REF.sjIssn.get(x) || []).forEach(i => h.add(i))); if (h.size) { e.sj = sjRec([...h][0]); if (h.size > 1) e.notes.push('в SCImago несколько изданий с этим ISSN — взято первое, проверьте'); } }
    if (!e.wl) { const h = new Set(); is.forEach(x => (REF.wlIssn.get(x) || []).forEach(i => h.add(i))); if (h.size) { e.wl = wlRec([...h][0]); if (h.size > 1) e.notes.push('в Белом списке несколько изданий с этим ISSN — взято первое, проверьте'); } }
    if (!e.sc && scHas()) { const h = new Set(); is.forEach(x => (REF.scIssn.get(x) || []).forEach(i => h.add(i))); if (h.size) e.sc = scRec([...h][0]); }
    if (!e.cs) e.cs = findCs([e.sj && e.sj.sid, e.sc && e.sc.id], is);
  }
  e.issns = [...e.issns]; e.title = (e.sj && e.sj.title) || (e.wl && e.wl.title.split(' | ')[0]) || (e.sc && e.sc.title) || (e.cs && e.cs.title) || '';
  e.key = e.issns.slice().sort().join(' ') || norm(e.title);
  return e;
}
/* Одна строка запроса → {issns, hits: [{e, score, how}], sure} */
function findJournalQuery(q) {
  q = String(q || '').trim(); const out = { q, issns: [], hits: [], sure: null, notes: [] }; if (!q) return out;
  let m; ISSN_Q.lastIndex = 0; while ((m = ISSN_Q.exec(q))) out.issns.push((m[1] + m[2]).toUpperCase().replace(/[ХХх]/g, 'X'));
  const title = q.replace(ISSN_Q, ' ').replace(/\b(issn|eissn|e-issn|p-issn)\b\s*:?/gi, ' ').replace(/\s+/g, ' ').trim();
  const seen = new Map(), add = (e, score, how) => { const o = seen.get(e.key); if (!o || o.score < score) seen.set(e.key, { e, score, how }); };
  if (out.issns.length) {
    const e = journalEntity(out.issns); if (e.sj || e.wl || e.sc || e.cs) add(e, 1, 'issn');
    if (title.length >= 3 && (e.sj || e.wl || e.sc || e.cs)) { const s = Math.max(e.sj ? titleSim(title, e.sj.title) : 0, e.wl ? Math.max(...e.wl.title.split(' | ').map(t => titleSim(title, t))) : 0, e.sc ? titleSim(title, e.sc.title) : 0); if (s < 0.6) out.notes.push(`по ISSN найдено «${e.title}», а название в запросе другое — проверьте`); }
  }
  if (!seen.size && title.length >= 2) {
    const J = jIndex(), qt = jqTokens(title).map(x => isCyr(x) ? translit(x) : x), nt = norm(title), cnt = new Map();
    new Set(qt.map(x => x.slice(0, 3))).forEach(pf => (J.pre.get(pf) || []).forEach(id => cnt.set(id, (cnt.get(id) || 0) + 1)));
    const need = Math.max(1, Math.ceil(new Set(qt.map(x => x.slice(0, 3))).size * 0.5));
    cnt.forEach((c, id) => { if (c < need) return; const x = J.list[id]; const sc = x.nn === nt ? 1 : Math.min(0.99, tokSim(qt, x.toks)); if (sc < 0.6) return; const rec = { sj: sjRec, wl: wlRec, sc: scRec, cs: csRec }[x.k](x.i); add(journalEntity(rec.issns, { k: x.k, rec }), sc, sc === 1 ? 'title' : 'similar'); });
  }
  out.hits = [...seen.values()].sort((a, b) => b.score - a.score || ((b.e.sj ? 1 : 0) - (a.e.sj ? 1 : 0))).slice(0, 8);
  const top = out.hits[0];
  // уверенно: по ISSN; или лучшее совпадение названия от 0,85 и заметно лучше следующего (на 0,1)
  if (top && top.how === 'title' && out.hits.filter(h => h.how === 'title').length === 1) out.sure = top;  // название совпало точно и только у одного
  else if (top && (top.how === 'issn' || (top.score >= 0.85 && !(out.hits[1] && out.hits[1].score > top.score - 0.1)))) out.sure = top;
  if (top && top.how === 'issn' && out.hits.filter(h => h.how === 'issn').length > 1) out.sure = null;
  return out;
}
/* Сведения об издании на год (год необязателен) — для показа и выгрузки */
function journalFacts(e, year) {
  const f = { title: e.title, issns: e.issns.map(fmtIssn), notes: e.notes.slice() };
  if (e.sj) { const jv = journalVerdict({ sj: e.sj, wl: null, sjHow: 'issn', wlHow: null }, year || null, null, null); Object.assign(f, { q: jv.qY, qYear: jv.sjYear, qExact: year ? jv.sjExact : true, qNow: jv.qL, qNowYear: jv.yL, cpd: jv.cpd, cpdNow: jv.cpdLast, hist: Object.keys(e.sj.hist).map(y => [+y, e.sj.hist[y].q, e.sj.hist[y].cpd]), cats: e.sj.cats, sid: e.sj.sid, type: e.sj.type }); if (year && !jv.sjExact) f.notes.push(jv.notes.find(n => /взят/.test(n)) || ''); }
  if (e.wl) { const a = wlAt(e.wl, year || null); Object.assign(f, { wlLv: a.excluded ? 'excl' : a.lv, wlYear: a.y, wlNow: a.curExcl ? 'excl' : a.cur, wlDisc: e.wl.disc, idx: { wos: e.wl.wos, scopus: e.wl.scopus, rsci: e.wl.rsci } }); if (e.wl.state === 1 && e.wl.notice) f.notes.push('примечание Белого списка: ' + e.wl.notice); }
  if (e.sc) { f.sc = scStatusText(e.sc); f.scId = e.sc.id; if (year) f.notes.push(...scAt(e.sc, year).notes); }
  if (e.cs) f.cs = e.cs;
  if (!e.sj && (e.sc || e.cs)) f.notes.push('в Scopus есть, квартиля SCImago нет' + (e.cs && e.cs.q ? ' — есть квартиль по CiteScore ' + e.cs.year : ''));
  f.notes = f.notes.filter(Boolean);
  return f;
}

/* ---------- 3. Идентификаторы автора из записи ORCID (правка 2): тип идентификатора и ссылки профиля ---------- */
function idFromOrcidItem(x) {
  const t = String(x.type || '').toLowerCase(), v = String(x.value || '').trim(), u = String(x.url || '');
  const fromUrl = s => { let m;
    if ((m = s.match(/elibrary\.ru\/author_profile\.asp\?(?:[^#]*&)?authorid=(\d+)/i))) return { b: 'rinc', v: m[1] };
    if ((m = s.match(/scopus\.com\/(?:authid\/detail\.uri|inward\/authorDetails\.url)\?(?:[^#]*&)?author[Ii][Dd]=(\d{6,})/))) return { b: 'scopus', v: m[1] };
    if ((m = s.match(/(?:webofscience\.com\/wos\/author\/rid|publons\.com\/researcher|researcherid\.com\/rid)\/([A-Z]{1,3}-\d{4}-\d{4})/i))) return { b: 'rid', v: m[1].toUpperCase() };
    return null; };
  if (/scopus/.test(t) && /^\d{6,}$/.test(v)) return { b: 'scopus', v };
  if (/researcher\s*id|researcherid|wos|web of science|publons/.test(t) && /^[A-Z]{1,3}-\d{4}-\d{4}$/i.test(v)) return { b: 'rid', v: v.toUpperCase() };
  if (/spin/.test(t) && /^\d{4}-?\d{4}$/.test(v)) return { b: 'spin', v: v.replace(/^(\d{4})-?(\d{4})$/, '$1-$2') };
  if (/elibrary|rinc|ринц|science\s*index|author\s*id.*(рос|rus)/.test(t) && /^\d{3,9}$/.test(v)) return { b: 'rinc', v };
  return fromUrl(u) || fromUrl(v);
}
/* Все идентификаторы с источниками; расхождения — «проверьте» */
function collectAuthorIds(parsed, info, orcList) {
  const ids = [], add = (b, v, src) => { v = String(v || '').trim(); if (!v) return; if (b === 'rid' || b === 'orcid') v = v.toUpperCase(); const o = ids.find(x => x.b === b && x.v === v); if (o) { if (o.src.indexOf(src) < 0) o.src.push(src); } else ids.push({ b, v, src: [src] }); };
  const p = parsed || {};
  add('orcid', p.orcid, 'введено'); add('scopus', p.scopus, 'введено'); add('rid', p.rid, 'введено'); add('rinc', p.rinc, 'введено'); add('spin', p.spin, 'введено');
  (info || []).forEach(a => { add('orcid', a.orcid, 'из OpenAlex'); add('scopus', a.scopus, 'из OpenAlex'); if (a.id) add('openalex', a.id, 'из OpenAlex'); });
  (orcList || []).forEach(x => { const r = idFromOrcidItem(x); if (r) add(r.b, r.v, 'из ORCID'); });
  const order = ['orcid', 'scopus', 'rid', 'rinc', 'spin', 'openalex']; ids.sort((a, b) => order.indexOf(a.b) - order.indexOf(b.b));
  const NM = { orcid: 'ORCID', scopus: 'Scopus', rid: 'Web of Science (ResearcherID)', rinc: 'eLibrary (РИНЦ AuthorID)', spin: 'eLibrary (SPIN-код)' }, warns = [];
  for (const b of ['orcid', 'scopus', 'rid', 'rinc', 'spin']) { const vs = ids.filter(x => x.b === b); if (vs.length > 1) warns.push(`${NM[b]}: идентификаторы различаются — ${vs.map(x => x.v + ' (' + x.src.join(', ') + ')').join(' и ')}. У автора бывает несколько профилей, но проверьте`); }
  return { ids, warns };
}

/* ---------- 4. Индекс Хирша со страницы профиля (правка 4) ----------
   Человек копирует страницу профиля автора (eLibrary, Scopus, Web of Science, Google Scholar) и вставляет её — утилита находит на ней индекс Хирша.
   Возвращает {base, val, label, alts: [{v, label}], cands, id, nameOk, err} */
const H_BASE_NAME = { openalex: 'OpenAlex', scopus: 'Scopus', wos: 'Web of Science', rinc: 'РИНЦ', gs: 'Google Scholar' };
function detectProfileBase(t) {
  if (/elibrary|ринц|science index|spin[-\s]?код|authorid/i.test(t)) return 'rinc';
  if (/i10[-\s]?index|i10-индекс|google\s*(scholar|академия)/i.test(t)) return 'gs';
  if (/web of science|researcherid|publons|clarivate/i.test(t)) return 'wos';
  if (/scopus|documents by author|author\s*id\s*:?\s*\d{8,}|h-graph|view h-graph|elsevier/i.test(t)) return 'scopus';
  return null;
}
function parseHirschPage(text, base, fios) {
  const t = String(text || '').replace(/\r/g, '').replace(/[ \t ]+/g, ' ');
  const o = { base: base || detectProfileBase(t), val: null, label: '', alts: [], cands: [], id: '', nameOk: null, err: '' };
  const num = s => { const v = parseInt(s, 10); return v >= 0 && v <= 300 ? v : null; };
  let m;
  if (o.base === 'rinc') {
    const R = [[/индекс\s+хирша\s+по\s+публикациям\s+в\s+ринц/i, 'по публикациям в РИНЦ'], [/индекс\s+хирша\s+по\s+всем\s+публикациям(?:\s+на\s+elibrary\.ru)?/i, 'по всем публикациям на elibrary.ru'], [/индекс\s+хирша\s+по\s+ядру\s+ринц/i, 'по ядру РИНЦ'], [/индекс\s+хирша\s+без\s+(?:учета|учёта)\s+самоцитирований/i, 'без самоцитирований'], [/индекс\s+хирша/i, '']];
    const found = [];
    R.forEach(([re, lab]) => { const g = new RegExp(re.source + '[^\\n\\d]{0,40}?[:\\s]\\s*(\\d{1,3})(?!\\d)', 'gi'); let mm; while ((mm = g.exec(t))) { const v = num(mm[1]); if (v != null && !found.some(f => f.idx === mm.index)) found.push({ v, label: lab, idx: mm.index }); } });
    // самый общий шаблон «индекс Хирша» ловит и строки с уточнением — оставить уточнённые
    const spec = found.filter(f => f.label), gen = found.filter(f => !f.label && !spec.some(s => s.idx === f.idx));
    const all = spec.concat(gen);
    const main = all.find(f => f.label === 'по публикациям в РИНЦ') || all.find(f => f.label === 'по всем публикациям на elibrary.ru') || all.find(f => !f.label) || all[0];
    if (main) { o.val = main.v; o.label = main.label; o.alts = all.filter(f => f !== main).map(f => ({ v: f.v, label: f.label || 'индекс Хирша' })); }
    if ((m = t.match(/author\s*id\s*:?\s*(\d{3,9})/i))) o.id = m[1]; else if ((m = t.match(/authorid=(\d{3,9})/i))) o.id = m[1];
    if ((m = t.match(/spin[-\s]?код\s*:?\s*(\d{4}-?\d{4})/i))) o.spin = m[1];
  } else if (o.base) {
    const lab = o.base === 'gs' ? /(?:h-index|индекс\s+хирша)/i : /h-?\s?index/i;
    const L = t.split('\n').map(s => s.trim());
    const cands = [];
    L.forEach((l, i) => {
      const mm = l.match(lab); if (!mm) return;
      const rest = l.slice(mm.index + mm[0].length), head = l.slice(0, mm.index);
      if (o.base === 'gs') { const g = rest.match(/^\s*(\d{1,3})(?:\s+(\d{1,3}))?/) || (!rest.trim() && (L[i + 1] || '').match(/^(\d{1,3})(?:\s+(\d{1,3}))?/)); if (g) { cands.push(num(g[1])); if (g[2] != null) o.alts.push({ v: num(g[2]), label: 'за последние 5 лет' }); } return; }
      // «h-index: 12» — число после подписи; иначе (Scopus, WoS: «12 h-index» или число строкой выше) — число перед подписью, а если его нет — после
      const colon = rest.match(/^\s*[:=]\s*(\d{1,3})\b/);
      const before = head.match(/(\d{1,3})\s*$/) || (!head.trim() && (L[i - 1] || '').match(/^(\d{1,3})$/));
      const after = rest.match(/^\s*(\d{1,3})\b/) || (!rest.trim() && (L[i + 1] || '').match(/^(\d{1,3})$/));
      const v = colon || before || after; if (v) cands.push(num(v[1]));
    });
    o.cands = [...new Set(cands.filter(v => v != null))];
    if (o.cands.length === 1) o.val = o.cands[0];
    if (o.base === 'scopus' && ((m = t.match(/author\s*id\s*:?\s*(\d{8,})/i)) || (m = t.match(/authorId=(\d{8,})/)))) o.id = m[1];
    if (o.base === 'wos' && (m = t.match(/\b([A-Z]{1,3}-\d{4}-\d{4})\b/))) o.id = m[1];
  }
  if (!o.base) o.err = 'не удалось понять, с какой базы страница — выберите базу';
  else if (o.val == null && o.cands.length > 1) o.err = 'на странице несколько чисел рядом с «h-index»: ' + o.cands.join(', ') + ' — проверьте и выберите';
  else if (o.val == null) o.err = 'индекс Хирша на странице не найден';
  if (fios && fios.length) { const low = norm(t), lowL = translit(low); o.nameOk = fios.some(f => translitVariants(f.sur).some(s => low.includes(norm(s)) || lowL.includes(norm(s))) || low.includes(norm(f.sur))); }
  return o;
}
/* Все полученные значения → наибольшее с подписью базы, остальные рядом; несколько разных значений одной базы — «проверьте» */
function hirschSummary(oaVals, pasted) {
  const vals = []; (oaVals || []).forEach(v => { if (v.h != null) vals.push({ base: 'openalex', v: v.h, src: 'OpenAlex, свой расчёт', id: v.id }); });
  (pasted || []).forEach(p => { if (p.val != null) vals.push({ base: p.base, v: p.val, src: 'со страницы профиля' + (p.label ? ', ' + p.label : ''), id: p.id || '', nameOk: p.nameOk }); });
  const warns = [];
  ['openalex', 'scopus', 'wos', 'rinc', 'gs'].forEach(b => { const vs = vals.filter(x => x.base === b); const u = [...new Set(vs.map(x => x.v))]; if (u.length > 1) warns.push(`${H_BASE_NAME[b]}: несколько значений (${vs.map(x => x.v + (x.id ? ' — профиль ' + x.id : '')).join(', ')}) — ${b === 'scopus' ? 'в Scopus несколько профилей автора' : 'несколько профилей'}, взято наибольшее; проверьте`); });
  vals.filter(x => x.nameOk === false).forEach(x => warns.push(`на странице ${H_BASE_NAME[x.base]} не найдена фамилия автора — проверьте, тот ли это профиль`));
  const best = vals.slice().sort((a, b) => b.v - a.v)[0] || null;
  const perBase = {}; vals.forEach(x => { if (!perBase[x.base] || perBase[x.base].v < x.v) perBase[x.base] = x; });
  return { vals, best, perBase, warns };
}

/* ---------- 5. Публикации в документе (правка 6) ----------
   pages: [[строка]], строка — текст или {cells: [{t, x}]} (ячейки таблицы; x — положение по горизонтали или номер столбца).
   Возвращает {records: [{text, page}], heading, pages, total, note} */
const DOC_HEAD = /^(?:\d+(?:\.\d+)*\.?\s*)?(?:(?:список|перечень)\s+(?:основных\s+|наиболее\s+значимых\s+|научных\s+|опубликованных\s+)*(?:научных\s+)?(?:публикаций|трудов|статей|работ)|(?:наиболее\s+значимые\s+|основные\s+|научные\s+|избранные\s+)*(?:научные\s+)?публикации|научные\s+труды|список\s+(?:использованной\s+)?литературы|литература|библиография|references|bibliography|(?:selected\s+|list\s+of\s+)?publications)(?![a-zа-яё])/i;
const DOC_HDR_COL = { auth: /автор/i, title: /названи|title|наименование\s+публикации|наименование\s+статьи/i, year: /^год|год\s+(?:публикации|издания)|year/i, jour: /издани|журнал|journal|source|источник/i, q: /квартил|quartile/i, ifc: /импакт|impact|\bif\b/i, doi: /doi/i, num: /^(?:№|n|no\.?|#)\s*(?:п\/п)?$/i };
const REC_START = /^\s*(?:\[(\d{1,3})\]|(\d{1,3})\s*[.)](?!\d))\s*(?=\S)/;
const AUTH_START = /^[A-ZА-ЯЁ][a-zа-яё'’-]+,?\s+[A-ZА-ЯЁ]\.\s?(?:[A-ZА-ЯЁ]\.)?(?:,|\s)/;
const lineText = l => typeof l === 'string' ? l : (l.cells || []).map(c => c.t).join('\t');
function recSignals(s) {
  let n = 0; if (DOI_RE.test(s)) n += 2;
  if (/\b(?:19[5-9]\d|20[0-4]\d)\b/.test(s)) n++;
  if (/(?:^|[\s.,;(])(?:Т\.|т\.|Vol\.?|V\.|№|No\.|N\s?\d|С\.|с\.|P\.|pp?\.|стр\.|Iss\.|Issue)\s*\d/.test(s)) n++;
  if (/\bISSN\b/i.test(s)) n++;
  if (/journal|журнал|вестник|известия|proceedings|letters|review|transactions|materials|science|доклады|труды|сборник|conference|конференц/i.test(s)) n++;
  return n;
}
/* Таблица из PDF: blk — строки с координатами {cells: [{t, x, w}], y, h}, первая — заголовок таблицы.
   Границы столбцов — просветы по горизонтали, где нет текста ни в одной строке; строка таблицы — от номера в первом столбце.
   Текст ячейки выровнен по верху (у номера на той же высоте есть текст других столбцов) — относится к строке, начатой выше;
   выровнен по середине — к ближайшему по высоте номеру. */
function geomTable(blk) {
  const it = []; blk.forEach((b, li) => { if (typeof b.l === 'string') return; b.l.cells.forEach(c => it.push({ t: c.t, x: c.x, w: c.w || c.t.length * (b.l.h || 10) * 0.5, y: b.l.y, h: b.l.h || 10, page: b.page, li })); });
  if (!it.length) return [];
  const x0 = Math.min(...it.map(i => i.x)), x1 = Math.max(...it.map(i => i.x + i.w)), W = Math.ceil(x1 - x0) + 2, cov = new Uint8Array(W);
  it.forEach(i => { for (let k = Math.floor(i.x - x0); k < Math.ceil(i.x + i.w - x0) && k < W; k++) if (k >= 0) cov[k] = 1; });
  const cols = []; let st = 0, gap = 0; const minGap = Math.max(3, (it[0].h || 10) * 0.35);
  for (let k = 0; k < W; k++) { if (cov[k]) { if (gap >= minGap && k - gap > st) { cols.push([x0 + st, x0 + k - gap]); st = k; } gap = 0; } else gap++; }
  cols.push([x0 + st, x1]);
  const colOf = i => { const c = i.x + Math.min(i.w, 20) / 2; let k = cols.findIndex(([a, b]) => c >= a - 1 && c <= b + 1); if (k < 0) k = cols.reduce((m, [a], q) => Math.abs(a - i.x) < Math.abs(cols[m][0] - i.x) ? q : m, 0); return k; };
  // ключи столбцов по заголовку (первая строка блока и её перенос — строки до первой строки с номером)
  it.forEach(i => { i.col = colOf(i); });
  const isNum = i => /^\d{1,3}\s*[.)]?$/.test(i.t.trim());
  const anchors = it.filter(i => i.col === 0 && isNum(i) && i.li > 0); if (!anchors.length) return [];
  const a0 = anchors[0], hy = blk[0].l.y;
  // строки между заголовком и первым номером: ближе к заголовку — перенос заголовка, ближе к номеру — начало первой строки таблицы
  const isHead = i => i.li === 0 || (i.li < a0.li && i.page === a0.page && Math.abs(i.y - hy) < Math.abs(i.y - a0.y));
  const head = cols.map((c, k) => it.filter(i => i.col === k && isHead(i)).sort((x, y) => y.y - x.y || x.x - y.x).map(i => i.t).join(' '));
  const keys = head.map((h, k) => { for (const key of Object.keys(DOC_HDR_COL)) if (DOC_HDR_COL[key].test(h.trim())) return key; return 'c' + k; });
  const body = it.filter(i => !isHead(i) && anchors.indexOf(i) < 0);
  // два способа отнести текст к строке: «по верху» и «по середине»; берётся тот, при котором ячейки лучше ложатся на номер строки
  const assign = mode => { const rows = anchors.map(a => ({ a, items: [] }));
    body.forEach(i => { const same = rows.filter(r => r.a.page === i.page); let r;
      if (mode === 'top') { r = same.filter(q => q.a.y >= i.y - i.h * 0.5).pop() || rows.filter(q => q.a.page < i.page).pop() || same[0]; }
      else r = same.slice().sort((p, q) => Math.abs(p.a.y - i.y) - Math.abs(q.a.y - i.y))[0] || rows[rows.length - 1];
      if (r) r.items.push(i); });
    let cost = 0; rows.forEach(r => { const by = {}; r.items.forEach(i => { if (i.page === r.a.page) (by[i.col] = by[i.col] || []).push(i.y); }); Object.values(by).forEach(ys => { const t = Math.max(...ys), m = (t + Math.min(...ys)) / 2; cost += Math.abs((mode === 'top' ? t : m) - r.a.y); }); });
    return { rows, cost }; };
  const T = assign('top'), M = assign('mid'), best = M.cost < T.cost ? M : T;
  return best.rows.map(r => { const o = { num: parseInt(r.a.t, 10), c: {}, page: r.a.page }; r.items.sort((a, b) => a.page - b.page || b.y - a.y || a.x - b.x).forEach(i => { const k = keys[i.col]; (o.c[k] = o.c[k] || []).push(i.t); }); return o; });
}
function findDocRecords(pages) {
  const P = (pages || []).map(pg => (pg || []).map(l => typeof l === 'string' ? l.replace(/\s+$/, '') : l));
  // колонтитулы: одна и та же строка (без цифр) в начале или конце многих страниц; голые номера страниц
  const rep = new Map(); if (P.length >= 3) P.forEach(pg => { const ends = pg.filter(l => lineText(l).trim()).slice(0, 2).concat(pg.filter(l => lineText(l).trim()).slice(-2)); new Set(ends.map(l => lineText(l).replace(/\d+/g, '#').trim())).forEach(k => rep.set(k, (rep.get(k) || 0) + 1)); });
  const isJunk = l => { const s = lineText(l).trim(); if (!s) return false; if (/^(?:подпись|м\.\s?п\.|руководитель\s+проекта\s*_|исполнитель\s*_|дата\s*_)/i.test(s) || /_{4,}/.test(s)) return true; if (/^(?:[-–—]?\s*\d{1,4}\s*[-–—]?|стр\.?\s*\d+(?:\s*из\s*\d+)?|page\s*\d+(?:\s*of\s*\d+)?|\d+\s*\/\s*\d+)$/i.test(s)) return true; const k = s.replace(/\d+/g, '#'); return P.length >= 3 && (rep.get(k) || 0) >= Math.max(3, Math.ceil(P.length * 0.5)); };
  const L = []; P.forEach((pg, pi) => pg.forEach(l => { if (!isJunk(l)) L.push({ l, page: pi + 1 }); }));
  // разделы со списком публикаций
  const isHead = s => s.length <= 140 && DOC_HEAD.test(s.trim()) && !(recSignals(s) >= 2 && /\b(19|20)\d{2}\b/.test(s));
  const isEnd = s => { const t = s.trim(); return t.length <= 120 && /^\d+\.\d+(?:\.\d+)*\.?\s+\S/.test(t) && !/\b(19[5-9]\d|20[0-4]\d)\b/.test(t) && !DOC_HEAD.test(t.replace(/^\d+(?:\.\d+)*\.?\s*/, '')); };
  const spans = []; let cur = null, heading = '';
  L.forEach((x, i) => { const s = lineText(x.l); if (isHead(s)) { if (cur) spans.push(cur); cur = [i + 1, L.length]; heading = heading || s.trim(); } else if (cur && isEnd(s)) { cur[1] = i; spans.push(cur); cur = null; } });
  if (cur) spans.push(cur);
  let use = spans.filter(([a, b]) => b > a).flatMap(([a, b]) => L.slice(a, b));
  const fromSections = use.length > 0; if (!fromSections) use = L;
  // таблица: строка-заголовок с названиями столбцов
  const recs = []; let cols = null, row = null, blank = false;
  const flushRow = () => { if (!row) return; const g = k => (row.c[k] || []).join(' ').replace(/\s+/g, ' ').trim(); const order = ['auth', 'title', 'year', 'jour', 'doi'];
    const parts = order.map(g).filter(Boolean); const other = Object.keys(row.c).filter(k => order.concat(['num', 'q', 'ifc']).indexOf(k) < 0).map(g).filter(Boolean);
    let text = parts.concat(other).join('. ').replace(/\.\s*\./g, '.'); const q = g('q'), ifc = g('ifc');
    if (q && /Q?\s*[1-4]/i.test(q)) text += '. Квартиль: ' + (q.match(/Q\s*[1-4]/i) ? q.match(/Q\s*[1-4]/i)[0].replace(/\s/g, '').toUpperCase() : 'Q' + q.match(/[1-4]/)[0]);
    if (ifc && /\d/.test(ifc)) text += '. ' + ifc.match(/\d{1,3}(?:[.,]\d{1,3})?/)[0];
    recs.push({ text: (row.num != null ? row.num + '. ' : '') + text, page: row.page, tbl: true, num: row.num != null }); row = null; };
  const hdrHits = l => { const hits = {}; l.cells.forEach((c, k) => { for (const key of Object.keys(DOC_HDR_COL)) if (DOC_HDR_COL[key].test(c.t.trim()) && !(key in hits)) { hits[key] = k; break; } }); return Object.keys(hits).filter(k => k !== 'num').length >= 2 && l.cells.every(c => c.t.length < 60) ? hits : null; };
  for (let ui = 0; ui < use.length; ui++) {
    const x = use[ui], l = x.l;
    // таблица из PDF (у строк есть координаты): столбцы — по просветам между текстом, строки таблицы — по номерам в первом столбце
    if (typeof l !== 'string' && l.y != null && l.cells && l.cells.length >= 2 && hdrHits(l)) {
      flushRow(); let j = ui + 1; const blk = [x];
      for (; j < use.length; j++) { const y = use[j]; if (typeof y.l === 'string') { if (!y.l.trim()) { blk.push(y); continue; } if (isEnd(y.l) || isHead(y.l)) break; } else if (isEnd(lineText(y.l)) || isHead(lineText(y.l))) break; blk.push(y); }
      geomTable(blk).forEach(r => { row = r; flushRow(); }); ui = j - 1; continue;
    }
    if (typeof l !== 'string' && l.y == null && l.cells && l.cells.length >= 2) {
      const hits = hdrHits(l);
      if (hits) { flushRow(); cols = l.cells.map((c, k) => ({ x: c.x, key: Object.keys(hits).find(h => hits[h] === k) || 'c' + k })); continue; }
      if (cols) {
        const cellsOf = l.cells.map(c => { let best = 0, bd = Infinity; cols.forEach((cc, k) => { const d = Math.abs(cc.x - c.x); if (d < bd) { bd = d; best = k; } }); return { key: cols[best].key, t: c.t.trim(), k: best }; });
        const first = cellsOf.find(c => c.k === 0); const nm = first && first.t.match(/^(\d{1,3})\s*[.)]?$/);
        if (nm || l.row || (!row && cellsOf.some(c => c.t))) { flushRow(); row = { num: nm ? +nm[1] : null, c: {}, page: x.page }; }
        cellsOf.forEach(c => { if (!c.t || (nm && c === first)) return; (row.c[c.key] = row.c[c.key] || []).push(c.t); });
        continue;
      }
    }
    if (cols && row) flushRow();
    const s = lineText(l).replace(/\t+/g, ' ').trim();
    if (!s) { blank = true; continue; }
    // новый номер — только следующий по порядку (или 1 — список начался заново); «11. P. 101» в середине записи — продолжение
    const rn = s.match(REC_START), rv = rn ? +(rn[1] || rn[2]) : null, lastN = (recs.filter(r => r.num && r.n != null).pop() || {}).n;
    const seqOk = rn && (lastN == null || rv === 1 || (rv > lastN && rv <= lastN + 3));
    if (seqOk || (!recs.length && !cols)) { recs.push({ text: s, page: x.page, num: !!seqOk, n: seqOk ? rv : null }); }
    else if (recs.length && !recs.some(r => r.num) && (blank || (AUTH_START.test(s) && /(?:\.|\d)$/.test(recs[recs.length - 1].text) && /\b(19[5-9]\d|20[0-4]\d)\b/.test(recs[recs.length - 1].text)))) recs.push({ text: s, page: x.page, num: false });
    else if (recs.length) recs[recs.length - 1].text += (/-$/.test(recs[recs.length - 1].text) && /^[a-zа-яё]/.test(s) ? '' : ' ') + s;
    blank = false;
  }
  flushRow();
  const hasNum = recs.some(r => r.num !== false && REC_START.test(r.text));
  let out = recs.map(r => ({ text: r.text.replace(/([a-zа-яё])-\s(?=[a-zа-яё])/g, '$1').replace(/\s+/g, ' ').trim(), page: r.page, tbl: r.tbl }))
    // в разделе со списком нумерованная запись с годом — публикация; строка таблицы (в том числе распознанной со скана: ячейки через « | ») — тоже
    .filter(r => r.text.length >= 30 && /\b(19[5-9]\d|20[0-4]\d)\b/.test(r.text) && (r.tbl || (fromSections && REC_START.test(r.text)) || (REC_START.test(r.text) && / \| [^|]+ \| /.test(r.text)) || (recSignals(r.text) >= 2 && (!hasNum || REC_START.test(r.text) || !fromSections))));
  // нумерация в документе сохраняется: «1.» … — запись начинается с номера
  out = out.map((r, i) => ({ text: REC_START.test(r.text) ? r.text : (i + 1) + '. ' + r.text, page: r.page }));
  const pgs = [...new Set(out.map(r => r.page))];
  return { records: out, heading: fromSections ? heading : '', pages: pgs, total: P.length, fromSections };
}
/* Квартиль, указанный в самом документе или списке («Q1», «Квартиль: Q2») */
function declQuartile(t) { const m = String(t || '').match(/(?:^|[\s(.,;|])(?:квартиль\s*:?\s*)?Q\s?([1-4])(?!\w|\.\d)/i); return m ? +m[1] : null; }

if (typeof module !== 'undefined') module.exports = { loadCs, findCs, csRec, csShort, loadSc, parseCoverage, scAt, findSc, findJournalQuery, journalFacts, titleSim, idFromOrcidItem, collectAuthorIds, parseHirschPage, hirschSummary, findDocRecords, declQuartile };

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
  const list = r.map(x => ({ type: x['external-id-type'] || '', value: String(x['external-id-value'] || '').trim(), url: x['external-id-url'] && x['external-id-url'].value || '' })).filter(x => x.value);
  // ссылки профиля (researcher-urls): там бывают профили eLibrary, Scopus, Publons — 0.8, правка 2; ошибка здесь не мешает основному ответу
  try { const u2 = `${NET.orcid}/v3.0/${orcid}/researcher-urls`, r2 = await tfetch(u2, { headers: h }); NET.log.push({ url: u2, status: r2.status });
    if (r2.ok) { const j2 = await r2.json(); ((j2 && j2['researcher-url']) || []).forEach(x => { const v = x.url && x.url.value; if (v) list.push({ type: 'url:' + (x['url-name'] || ''), value: String(v).trim(), url: String(v).trim() }); }); } } catch (e) { }
  return { list };
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
  return { v: 1, t: Date.now(), list: $('list').value, author: $('author').value,
    W: W.entries ? { entries: W.entries, works: W.works.map(w => w === undefined ? '__u' : w), netDown: W.netDown, auto: W.auto, numbered: W.numbered, stopped: !!W.stopped } : null,
    AU: au.prof || au.cands || au.orcCands || au.parsed ? au : null, FLT, SORT,
    J: JR.rows.length ? { q: $('jq').value, year: JR.year, picks: JR.rows.map(r => r.pick) } : null };
}
let _saveT = null;
function saveState(soon) {
  if (soon) { clearTimeout(_saveT); _saveT = setTimeout(() => saveState(), 800); return; }
  if (RESTORE_PENDING) return;  // пока человек не решил, продолжать ли прошлую — не затирать её
  if (!LS.set('pc_state', stateNow(true))) LS.set('pc_state', Object.assign(stateNow(false), { profDropped: true }));
}
let RESTORE_PENDING = false;
function offerRestore() {
  const st = LS.get('pc_state'); if (!st || (!st.W && !st.AU && !st.J)) return;
  const d = new Date(st.t), when = d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const what = [st.W ? 'публикаций в списке: ' + st.W.entries.length : '', st.J ? 'журналов: ' + st.J.picks.length : '', st.AU && st.AU.prof && st.AU.prof.info ? 'автор ' + ((st.AU.prof.info[0] || {}).name || '') : (st.author ? 'автор «' + st.author + '»' : '')].filter(Boolean).join(', ');
  RESTORE_PENDING = true;
  const b = $('resume'); b.style.display = 'flex';
  b.innerHTML = `<b>Прошлая проверка от ${esc(when)}</b><span class="dim">${esc(what)}</span><button id="resYes">Продолжить прошлую проверку</button><button id="resNo" class="sec">Начать заново</button>`;
  $('resYes').onclick = () => { RESTORE_PENDING = false; b.style.display = 'none'; restoreState(st); };
  $('resNo').onclick = () => { RESTORE_PENDING = false; b.style.display = 'none'; LS.del('pc_state'); };
}
function restoreState(st) {
  $('list').value = st.list || ''; $('author').value = st.author || ''; $('org').value = ''; countEntries(); showParsed();  // организация не возвращается (правка 1, 0.8)
  if (st.FLT) { FLT.list = Object.assign(FLT0(), st.FLT.list); FLT.au = Object.assign(FLT0(), st.FLT.au); }
  if (st.SORT) Object.assign(SORT, st.SORT);
  AU = newS();
  if (st.AU) { AU = Object.assign(newS(), st.AU); if (AU.prof && !AU.prof.err && AU.prof.aw) AU.prof.js = AU.prof.aw.works.map(w => judgeProfileWork(w, AU.prof.ids)); }
  if (st.profDropped && $('author').value.trim()) AU.msgs = (AU.msgs || []).concat(['публикации автора не поместились в память браузера — нажмите «Найти автора» (ответы баз возьмутся из кеша)']);
  if (st.W) { W.entries = st.W.entries; W.works = st.W.works.map(w => w === '__u' ? undefined : w); W.netDown = st.W.netDown; W.auto = st.W.auto; W.numbered = st.W.numbered; W.stopped = st.W.stopped; rejudge(); }
  if (st.J) { $('jq').value = st.J.q || ''; $('jy').value = st.J.year || ''; JR.year = st.J.year || null; JR.rows = $('jq').value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 300).map((q, i) => { const res = findJournalQuery(q); const pk = st.J.picks[i]; return { q, res, pick: pk != null && res.hits[pk] ? pk : (res.sure ? res.hits.indexOf(res.sure) : null) }; }); }
  renderAll(); retryVis(); if (typeof updDots === 'function') updDots(); goTo(W.entries ? 'outList' : (st.AU ? 'outAuthor' : 'outJournal'));
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
  // 0.8: документ PDF или Word (правка 6), режим «Журнал» (правка 5)
  $('dfile').addEventListener('change', e => { readDocument([...e.target.files]); e.target.value = ''; });
  $('jgo').addEventListener('click', runJournals); $('jcopy').addEventListener('click', copyJournals); $('jxlsx').addEventListener('click', () => exportJournals('xlsx')); $('jcsv').addEventListener('click', () => exportJournals('csv'));
  $('jq').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runJournals(); } });
  document.addEventListener('paste', e => { const im = [...(e.clipboardData ? e.clipboardData.items : [])].filter(i => i.type.startsWith('image/')).map(i => i.getAsFile()); if (!im.length) return; e.preventDefault(); if (document.activeElement === $('author')) authorImage(im); else if (document.activeElement && document.activeElement.id === 'hxText') hxImage(im); else { if (document.body.dataset.view !== 'home') setView('home'); openPane('secL'); addImages(im); } });
  // снимок можно перетащить в любое место страницы (удобство 7); на поле автора — снимок с идентификаторами
  const hasFiles = e => e.dataTransfer && [...(e.dataTransfer.types || [])].indexOf('Files') >= 0; let dragN = 0;
  document.addEventListener('dragenter', e => { if (!hasFiles(e)) return; e.preventDefault(); dragN++; document.body.classList.add('dragging'); });
  document.addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
  document.addEventListener('dragleave', e => { if (!hasFiles(e)) return; if (--dragN <= 0) { dragN = 0; document.body.classList.remove('dragging'); } });
  document.addEventListener('drop', e => { if (!hasFiles(e)) return; e.preventDefault(); dragN = 0; document.body.classList.remove('dragging'); const docs = [...e.dataTransfer.files].filter(f => /\.(pdf|docx?)$/i.test(f.name) || f.type === 'application/pdf'); if (docs.length) { if (document.body.dataset.view !== 'home') setView('home'); openPane('secL'); readDocument(docs); return; } const im = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/')); if (!im.length) return; if (e.target && e.target.closest && e.target.closest('#author')) authorImage(im); else { if (document.body.dataset.view !== 'home') setView('home'); openPane('secL'); addImages(im); } });
  $('go').addEventListener('click', runList); $('ago').addEventListener('click', runAuthor); $('anew').addEventListener('click', resetAuthor); $('ping').addEventListener('click', ping); $('self').addEventListener('click', selfCheck); $('copy').addEventListener('click', copyList); $('acopy').addEventListener('click', copyAuthor);
  $('list').addEventListener('input', () => { countEntries(); saveState(true); }); $('author').addEventListener('input', () => { showParsed(); saveState(true); });
  $('author').addEventListener('keydown', e => { if (e.key === 'Enter') runAuthor(); });
  // организация помогает выбрать автора: если кандидаты уже показаны — пересортировать их
  $('org').addEventListener('change', () => { if (AU.cands && !(AU.prof && !AU.prof.err)) { rankCands(AU); renderAuthor(); } saveState(true); });
  // 0.9, правка 3: подстраницы результата (#author, #journals, #list) — кнопки «Назад» и «Вперёд» браузера работают
  window.addEventListener('hashchange', () => { applyView(viewFromHash()); window.scrollTo(0, 0); });
  // строка состояния поиска видна и на подстранице результата
  [['status', 'statusR'], ['astatus', 'astatusR'], ['jstatus', 'jstatusR']].forEach(([a, b]) => { const m = () => { $(b).innerHTML = $(a).innerHTML; }; new MutationObserver(m).observe($(a), { childList: true, characterData: true, subtree: true }); });
  initJsug(); initPanes();
  try { $('oaKey').value = localStorage.getItem('pc_oaKey') || ''; $('orcidToken').value = localStorage.getItem('pc_orcidToken') || ''; } catch (e) { }
  if (OA_BUILTIN) { $('oaKey').placeholder = 'встроенный ключ уже подключён — поле можно не заполнять'; }
  if (ORCID_BUILTIN) { $('orcidToken').placeholder = 'встроенный токен уже подключён — поле можно не заполнять'; $('orcidNote').textContent = 'В эту сборку встроен токен ORCID. Своё значение в поле заменит его только в этом браузере.'; }
  // правка 1 (0.8): организация не хранится между сеансами — прежнее сохранённое значение удаляется
  try { localStorage.removeItem('pc_org'); } catch (e) { }
  if (!ocrAvailable()) { $('drop').innerHTML = 'Распознавание снимков в эту сборку не включено — вставьте список текстом.'; $('afile').style.display = 'none'; }
  try { const uc = LS.get('pc_useCache'); if (uc === false) $('useCache').checked = false; } catch (e) { }
  updateNav();
  await loadData();
  if (REF) { offerRestore(); setTimeout(() => { try { jIndex(); } catch (e) { } }, 300); }  // указатель названий для подсказок — заранее
  applyView(viewFromHash());
  cacheInfo();
}
async function cacheInfo() { CACHE.on = $('useCache').checked && typeof indexedDB !== 'undefined'; const n = CACHE.on ? await cacheCount() : 0; $('cacheInfo').textContent = CACHE.on ? (n ? `в кеше ответов: ${n}` : 'кеш пуст') : 'кеш не используется'; }
/* Справочники: в одной странице — внутри, на сайте — файл data/ref.json (около 8 МБ) с показом хода загрузки и ограничением по времени */
async function loadData() {
  const btns = ['go', 'ago', 'jgo'];
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
  $('refinfo').textContent = `Справочники: SCImago за ${REF.sjYears[0]}–${REF.sjYear} годы (${REF.sj.length} изданий), Белый список на ${REF.wlDate} (${REF.wl.length} изданий)${scHas() ? `, список источников Scopus ${REF.scDate} (${REF.sc.length} изданий)` : ''}${csHas() ? `, CiteScore Scopus ${REF.csYear} (${REF.cs.length} изданий)` : ''}.`;
  if (scHas()) $('jsc').textContent = ', список источников Scopus' + (csHas() ? ', CiteScore' : '');
  renderSources();
}
const W = { entries: null, works: [], pubs: [], netDown: '', auto: null, dups: [] };
const newS = () => ({ prof: null, cands: null, orcCands: null, similar: null, msgs: [], parsed: null, orcIds: null, hx: [] });
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
function renderAll() { renderList(); renderAuthor(); renderJournals(); updateNav(); if (W.entries) retryVis(); }

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

/* ----- 0.9, правки 1 и 3: подстраницы результата и вкладки ----- */
/* Результат открывается на своей подстранице (#author, #journals, #list); «← Новый поиск» — к вводу, введённое сохраняется */
const VIEWS = ['author', 'journals', 'list'];
const VIEW_OF = { outList: 'list', vList: 'list', outAuthor: 'author', vAuthor: 'author', auWorks: 'author', hxPanel: 'author', outJournal: 'journals', vJournal: 'journals' };
const viewFromHash = () => { const h = String(location.hash || '').replace(/^#/, ''); return VIEWS.indexOf(h) >= 0 ? h : 'home'; };
const viewHas = v => v === 'list' ? !!W.entries : (v === 'author' ? !!(AU.prof || AU.cands || AU.orcCands || (AU.msgs && AU.msgs.length) || AU.parsed) : (v === 'journals' ? JR.rows.length > 0 : true));
function applyView(v) { if (v !== 'home' && !viewHas(v)) v = 'home'; document.body.dataset.view = v; updateNav(); }
function setView(v) { if (v !== 'home' && !viewHas(v)) v = 'home'; if (viewFromHash() !== v) location.hash = v === 'home' ? '' : v; applyView(v); }
/* После действия страница сама показывает свой результат; id элемента → подстраница, на ней — прокрутка к элементу */
function goTo(id) {
  const v = VIEW_OF[id] || 'home', was = document.body.dataset.view; setView(v);
  const el = $(id); if (!el) return;
  if (v === 'home') { const sec = el.closest && el.closest('#inp .col'); if (sec) openPane(sec.id); }
  if (id === 'outList' || id === 'outAuthor' || id === 'outJournal' || (v === 'home' && was !== 'home')) { window.scrollTo(0, 0); return; }
  try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { el.scrollIntoView(); }
}
/* Вкладки подстраницы — в порядке разделов: Автор · Журналы · Публикации; появляются, когда есть что показать */
function navItems() {
  const out = [];
  if (viewHas('author')) out.push({ v: 'author', t: 'Автор', n: AU.prof && !AU.prof.err ? AU.prof.js.length : null });
  if (JR.rows.length) out.push({ v: 'journals', t: 'Журналы', n: JR.rows.length });
  if (W.entries) out.push({ v: 'list', t: 'Публикации', n: W.pubs.length });
  return out;
}
function updateNav() {
  const b = $('tabs'); if (!b) return; const cur = document.body.dataset.view;
  b.innerHTML = navItems().map(x => `<a href="#${x.v}"${x.v === cur ? ' class="on"' : ''}>${esc(x.t)}${x.n != null ? '<b>' + x.n + '</b>' : ''}</a>`).join('');
}
function navScroll() { }

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
function idxText(wl, sc, year) {
  const f = (n, v) => `${n} ${v ? '✓' : '—'}`;
  let h = !wl ? '<span class="dim">индексация: нет данных (издания нет в Белом списке)</span>' : `<span class="dim" title="по данным Белого списка">индексация: ${f('WoS CC', wl.wos)} · ${f('Scopus', wl.scopus)} · ${f('RSCI', wl.rsci)}</span>`;
  return h + scText(sc, year);
}
/* Строка о Scopus по списку источников Scopus (0.8, правка 3): индексируется ли, годы, исключён, принят */
function scText(sc, year) {
  if (!scHas()) return '';
  if (!sc) return `<div class="dim" title="Scopus Source List, ${esc(REF.scDate)}">в списке источников Scopus нет</div>`;
  const a = scAt(sc, year), bad = a.inCov === false || a.afterDisc || sc.status === 2 || sc.disc || sc.flag;
  return `<div class="dim" title="Scopus Source List, ${esc(REF.scDate)}">${bad ? chip('check', 'Scopus') : 'Scopus:'} ${esc(scStatusText(sc))}${a.inCov === false ? ' — <b>в ' + year + ' году не индексировался</b>' : ''}${a.afterDisc ? ' — <b>статья позже последнего номера</b>' : ''}${sc.id ? ' · ' + lnk(scLink(sc), 'страница в Scopus') : ''}</div>`;
}
/* Где посмотреть квартиль самому: открытого источника квартиля WoS (JCR) и CiteScore нет */
const firstIssn = issns => { const x = (issns || []).map(normIssn).filter(Boolean)[0]; return x ? fmtIssn(x) : ''; };
const scopusSource = sid => 'https://www.scopus.com/sourceid/' + sid;
function extLinks(issns) {
  const is = firstIssn(issns);
  return [is ? lnk('https://mjl.clarivate.com/search-results?issn=' + is, 'есть ли в WoS') : '', lnk('https://jcr.clarivate.com/', 'JCR'), lnk('https://www.scopus.com/sources.uri', 'Scopus Sources')].filter(Boolean).join(' · ') + (is ? ` (ISSN ${is})` : '');
}
function quartText(jv, sj, short, wl, issns) {
  if (!sj) return chip('unk', 'нет в SCImago') + (jv && jv.sc ? `<div class="dim">в Scopus есть, квартиля SCImago нет${jv.sc.id ? ' · ' + lnk(scLink(jv.sc), 'Scopus') : ''}</div>` : '') + (short ? '' : `<div class="dim">квартиль WoS${jv && jv.cs ? '' : ' и CiteScore'} утилита не получает — посмотрите сами: ${extLinks(issns)}</div>`);
  // 0.9: у каждого значения — год: «Q1 в 2021» (год публикации) и «Q1 сейчас (2025)»
  const qq = q => q ? `<span class="q">Q${q}</span>` : chip('unk', 'без квартиля');
  let h = `<div class="qc">${qq(jv.qY)} <span class="dim">в ${jv.sjYear}${jv.sjExact ? '' : ' — за год публикации данных нет'}</span>`;
  if (jv.yL !== jv.sjYear) h += `<br>${jv.qL !== jv.qY ? chip('check', jv.qL ? 'Q' + jv.qL : 'без квартиля') : qq(jv.qL)} <span class="dim">сейчас (${jv.yL})</span>`;
  else h += ` <span class="dim">(сейчас)</span>`;
  h += '</div>';
  if (!short) h += `<details class="mini"><summary>по годам</summary>${yearChips(sj, jv.sjYear, 0)}</details>`;
  return h + `<div class="dim">${lnk(`https://www.scimagojr.com/journalsearch.php?q=${sj.sid}&tip=sid`, 'SCImago')} · ${lnk(scopusSource(sj.sid), 'Scopus')}${short ? '' : ' · ' + extLinks(issns).split(' · ')[0]}</div>`;
}
/* Квартиль SCImago по годам — плашками «2021 Q1»; год публикации обведён. last — сколько последних лет (0 — все) */
function yearChips(sj, mark, last) {
  if (!sj || !sj.hist) return '';
  let ys = Object.keys(sj.hist).map(Number).sort((a, b) => a - b); if (last) ys = ys.slice(-last);
  return '<div class="yrs">' + ys.map(y => `<span class="yq${y === mark ? ' pub' : ''}" title="${esc('SCImago ' + y + (sj.hist[y].cpd != null ? ', импакт-фактор ' + fmtNum(sj.hist[y].cpd) : ''))}"><span class="y">${y}</span><b>${sj.hist[y].q ? 'Q' + sj.hist[y].q : '—'}</b></span>`).join('') + '</div>';
}
/* CiteScore Scopus (0.9, правка 6): число — ссылка на страницу издания в Scopus, подпись Elsevier — в подсказке.
   Отдельный показатель за последний год («сейчас»); квартиль SCImago не заменяет. */
const csTip = cs => csSrc(cs) + '. Квартиль — наилучший по тематикам Scopus' + (cs.best ? ` (${cs.best.name}, ${cs.best.pct}-й процентиль)` : '') + '. Нажмите — страница издания в Scopus.';
function csCell(cs) {
  if (!csHas()) return '';
  if (!cs) return `<span class="dim" title="${esc('нет в справочнике ' + csSrc(null))}">—</span>`;
  return `<a class="csv" target="_blank" rel="noopener" href="${esc(csLink(cs))}" title="${esc(csTip(cs))}">${esc(csShort(cs))}</a>` + (cs.best ? `<div class="dim">${esc(cs.best.name)} · ${cs.best.pct}-й процентиль</div>` : '');
}
const csSubsHtml = cs => `<table>${cs.subs.map(x => `<tr><td>${esc(x.name)}</td><td class="n">Q${x.q}</td><td class="n" title="процентиль">${x.pct}</td><td class="n" title="место в тематике">${x.rank} из ${x.of}</td></tr>`).join('')}</table>`;
/* Строка CiteScore под основными числами журнала */
function csLine(cs, sjQ) {
  if (!csHas()) return '';
  if (!cs) return `<div class="cs"><span class="cap">Scopus · CiteScore ${REF.csYear}</span> &nbsp;<span class="dim">нет в справочнике CiteScore</span></div>`;
  const b = cs.best, more = cs.subs.length - 1;
  return `<div class="cs"><span class="cap">Scopus · CiteScore ${cs.year}</span> &nbsp;<a class="csv" target="_blank" rel="noopener" href="${esc(csLink(cs))}" title="${esc(csTip(cs))}">${esc(csShort(cs))}</a>`
    + (b ? ` &nbsp;${esc(b.name)} · ${b.pct}-й процентиль · ${b.rank} из ${b.of}` : '')
    + (more > 0 ? `<details class="mini"><summary>ещё ${more} ${more === 1 ? 'тематика' : (more < 5 ? 'тематики' : 'тематик')}</summary>${csSubsHtml(cs)}</details>` : '')
    + (cs.snip != null ? ` &nbsp;· SNIP <span class="mono">${fmtNum(Math.round(cs.snip * 1000) / 1000)}</span>` : '')
    + (sjQ && cs.q && sjQ !== cs.q ? ` &nbsp;· <span title="квартиль SCImago и квартиль по CiteScore считаются по-разному — это не ошибка">у SCImago Q${sjQ} — другой показатель</span>` : '') + '</div>';
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
  const pre = (k, t) => `<button class="preset${presetOn(f, k) ? ' on' : ''}" onclick="setPreset('${id}','${k}')" title="квартиль SCImago и уровень Белого списка — на год публикации; CiteScore не учитывается. Ещё нажатие — снять">${t}</button>`;
  return `<div class="fbar noprint"><div class="fr"><span class="grp"><span class="gl">Наборы</span>${pre('q12', 'Q1–Q2 или БС 1')}${pre('q1', 'Q1 или БС 1')}</span></div><div class="fr"><span class="grp"><span class="gl">Квартиль</span>${['1', '2', '3', '4'].map(v => pill('q', v, 'Q' + v)).join('')}${pill('q', 'none', 'нет')}</span><span class="or">или</span><span class="grp"><span class="gl">Белый список</span>${['1', '2', '3', '4'].map(v => pill('wl', v, v)).join('')}${pill('wl', 'none', 'нет')}${pill('wl', 'excl', 'исключён')}</span>`
    + `<span class="fright"><span class="cnt">Показано <b>${shown}</b> из ${total}${f.ifFrom && noCpd ? ` · без импакт-фактора (нет в SCImago) скрыто ${noCpd}` : ''}</span>${active ? `<button class="linkbtn" onclick="resetFlt('${id}')">Сбросить</button>` : ''}<details class="fhelp"><summary title="Как работает фильтр">?</summary><div>Квартиль, уровень и импакт-фактор — на год публикации. Отмеченные квартили и уровни объединяются через «или» («Q1» + «1» — статьи, у которых Q1 или 1 уровень Белого списка); годы, импакт-фактор и corresponding — дополнительные условия «и». Импакт-фактор здесь — «цитирований на документ за 2 года» SCImago, это не импакт-фактор WoS.${corrOff ? ' Фильтр corresponding в этой таблице заработает, когда найден автор (раздел 2).' : ''}</div></details></span></div>`
    + `<div class="fr"><span class="grp"><span class="gl">Годы</span>${num('yFrom', 'с')} – ${num('yTo', 'по')}</span><span class="grp"><span class="gl">Импакт-фактор от</span>${num('ifFrom', 'любой', '0.1')}</span><span class="grp"><span class="gl">Corresponding</span>${pill('corr', 'yes', 'да', corrOff)}${pill('corr', 'no', 'нет', corrOff)}${pill('corr', 'unk', 'не указан', corrOff)}</span>`
    + `</div></div>`;
}
/* 0.9, правка 4: кнопки-наборы фильтра. Выставляют только квартиль и уровень Белого списка (они объединяются через «или»);
   годы, импакт-фактор и corresponding не трогают. Кнопка подсвечена, когда фильтр совпадает с набором — в том числе выставленный вручную. */
const PRESETS = { q12: { q: ['1', '2'], wl: ['1'] }, q1: { q: ['1'], wl: ['1'] } };
const sameSet = (a, b) => a.length === b.length && a.every(x => b.indexOf(x) >= 0);
const presetOn = (f, k) => sameSet(f.q, PRESETS[k].q) && sameSet(f.wl, PRESETS[k].wl);
function setPreset(id, k) { const f = FLT[id]; if (presetOn(f, k)) { f.q = []; f.wl = []; } else { f.q = PRESETS[k].q.slice(); f.wl = PRESETS[k].wl.slice(); } reFlt(id); saveState(true); }
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
const TH_CS = () => `CiteScore<div class="sub">Scopus ${REF.csYear}, сейчас</div>`;
const TH_Q = 'Квартиль SCImago<div class="sub">на год публикации и сейчас</div>', TH_WL = 'Белый список<div class="sub">на год публикации</div>', TH_IF = 'Импакт-фактор<div class="sub">SCImago, цит. на документ за 2 года</div>';
const patentLink = e => e.patentNo ? lnk('https://patents.google.com/patent/' + e.patentNo, 'патент ' + e.patentNo.replace(/^RU(\d+)/, 'RU $1 ')) : '';
const doneCnt = (keys) => keys.filter(k => MARKS[k]).length;
function renderList() {
  if (!W.entries) { $('outList').innerHTML = ''; $('listOut').style.display = 'none'; return; }
  const pubs = W.pubs, rows = listRows(), dn = doneCnt(pubs.map(markKeyL)); let h = `<h2>Публикации из списка (${pubs.length})${dn ? ` <span class="sub">· проверено ${dn}</span>` : ''}</h2>`;
  if (W.dups.length) h += `<p>${chip('check', 'проверьте')} Возможных дублей в списке: <b>${W.dups.length}</b> — ${W.dups.map(d => `№ ${numOf(pubs[d.a].entry, d.a)} и № ${numOf(pubs[d.b].entry, d.b)} (${esc(d.why)})`).join('; ')}. Утилита ничего не исключает — решите сами.</p>`;
  h += filterBar('list', rows.length, pubs.length, noCpdHidden(pubs.map(listKey), listFlt()));
  const cs = csHas(), nc = cs ? 9 : 8;
  h += `<table class="t pubs"><tr><th style="width:7%">№</th>${sortTh('list', 'year', 'Публикация<div class="sub">сортировка по году</div>', 'width:20%')}<th style="width:12%">Издание</th>${sortTh('list', 'q', TH_Q, 'width:11%')}${sortTh('list', 'wl', TH_WL, 'width:10%')}${sortTh('list', 'if', TH_IF, 'width:9%')}${cs ? `<th style="width:9%">${TH_CS()}</th>` : ''}<th style="width:13%">Авторы</th><th>Примечания</th></tr>`;
  rows.forEach(({ p, i }) => {
    const w = p.work, e = p.entry, notes = p.notes.concat(dupNotes(i)), mk = markKeyL(p), tr = MARKS[mk] ? '<tr class="done">' : '<tr>';
    const nh = notesHtml(notes), num = `<td>${numOf(e, i)}${markBox(mk)}</td>`;
    if (p.found === 'patent') { h += `${tr}${num}<td><span class="dim">${esc(e.raw.length > 220 ? e.raw.slice(0, 220) + '…' : e.raw)}</span><br>${nchip('патент')}${recordHtml(e)}</td><td colspan="${nc - 3}" class="dim">Патент — в Crossref и OpenAlex не ищется, квартиля и импакт-фактора у него нет.${e.patentNo ? ' Посмотреть: ' + patentLink(e) + '.' : ''}</td><td class="notes">${nh}</td></tr>`; return; }
    if (!w) { h += `${tr}${num}<td><span class="dim">${esc(e.raw.length > 220 ? e.raw.slice(0, 220) + '…' : e.raw)}</span><br>${chip('unk', p.found === 'no' ? 'не найдена' : 'не проверена')}${altsHtml(i)}${p.found === 'no' ? searchLinks(e) : ''}</td><td colspan="${nc - 3}" class="dim">${p.found === 'no' ? 'Статья не найдена в открытых базах — квартиль и остальное по ней не определены. Это не значит, что её нет.' : 'Поиск по этой записи не выполнялся.'}</td><td class="notes">${nh}</td></tr>`; return; }
    const url = w.doi ? 'https://doi.org/' + w.doi : (w.oaId ? 'https://openalex.org/' + w.oaId : '');
    let c1 = (url ? lnk(url, w.title) : esc(w.title)).replace('<a ', '<a class="ttl" ') + `<div class="dim">${[w.year || 'год ?', p.typeName, w.doi ? 'DOI ' + lnk(url, w.doi) : 'DOI нет', w.source === 'OpenAlex' ? 'найдена в OpenAlex' : ''].filter(Boolean).join(' · ')}</div>`;
    // удобство 11: причина «проверьте» прямо в пометке
    if (p.found === 'check') c1 += chip('check', `похожая (совпадение ${Math.round((w.score || 0) * 100)} %) — проверьте`);
    c1 += altsHtml(i) + recordHtml(e);
    const jc = `<b>${esc(w.journal || 'издание не указано')}</b>` + (w.issns.length ? '<div class="dim">ISSN ' + w.issns.map(x => esc(fmtIssn(normIssn(x)))).join(', ') + '</div>' : '') + '<div>' + idxText(p.j.wl, p.j.sc, w.year) + '</div>';
    h += `${tr}${num}<td>${c1}</td><td>${jc}</td><td>${quartText(p.jv, p.j.sj, false, p.j.wl, w.issns)}${p.declQ ? `<div class="dim" title="квартиль, указанный в списке или документе — для сравнения">в списке: Q${p.declQ}</div>` : ''}</td><td>${wlCell(p)}</td><td>${ifCell(p)}</td>${cs ? `<td>${csCell(p.j.cs)}</td>` : ''}<td>${authorsCell(p)}</td><td class="notes">${nh}</td></tr>`;
  });
  if (!rows.length) h += `<tr><td colspan="${nc}" class="dim">Под фильтр не подходит ни одна статья.</td></tr>`;
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
/* Правка 4 (0.7.10): перейти к следующему автору — поля ФИО и организации и результаты очищаются (организация — с 0.8), список публикаций не трогается */
function resetAuthor() {
  if (BUSY) return;
  AU = newS(); W.auto = null; FLT.au = FLT0();
  $('author').value = ''; $('org').value = ''; $('aparsed').textContent = ''; $('astatus').textContent = '';
  $('outAuthor').innerHTML = ''; $('auOut').style.display = 'none';
  if (W.entries) { rejudge(); renderList(); }
  updateNav(); goTo('secA'); $('author').focus(); updDots(); saveState();
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
  const p = S.parsed || {}, prof = S.prof && !S.prof.err ? S.prof : null;
  // идентификаторы: введённые, из OpenAlex и из записи ORCID (тип идентификатора и ссылки профиля) — правка 2 (0.8)
  const { ids, warns } = collectAuthorIds(p, prof ? prof.info : [], S.orcIds ? S.orcIds.list : []);
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
function hirschLink(L, idb) { const xs = L.ids.filter(i => i.b === idb); if (xs.length) return { u: BASES[idb].url(xs[0].v), t: 'профиль ' + xs[0].v + ' (' + xs[0].src.join(', ') + ')', all: xs.map(x => ({ u: BASES[idb].url(x.v), t: 'профиль ' + x.v, src: x.src.join(', ') })) }; const s = L.sr.find(i => i.b === ({ scopus: 'Scopus', rid: 'Web of Science', rinc: 'eLibrary' })[idb]); return s ? { u: s.u, t: 'поиск автора', q: s.manual ? s.q : '' } : null; }
/* Индекс Хирша (правка 4, 0.8): крупно — наибольшее из полученных значений с подписью базы, остальные рядом.
   OpenAlex — автоматически; РИНЦ, Scopus, WoS, Google Scholar — со вставленной страницы профиля. Где не получено — ссылка посмотреть. */
function hirschPlate(S, L) {
  const prof = S.prof, sum = hirschSummary(prof.info.filter(a => a.h != null).map(a => ({ h: a.h, id: a.id })), S.hx || []), b = sum.best;
  const bname = x => H_BASE_NAME[x.base] + (x.base === 'openalex' ? ', свой расчёт' : '');
  const others = sum.vals.filter(x => x !== b).map(x => `<span title="${esc(x.src + (x.id ? ' — ' + x.id : ''))}">${esc(H_BASE_NAME[x.base])} <b>${x.v}</b></span>`);
  const miss = H_BASES.filter(([key]) => !sum.perBase[key]).map(([key, name, idb]) => { const l = hirschLink(L, idb), nm = { scopus: 'Scopus', wos: 'WoS', rinc: 'РИНЦ' }[key];
    if (!l) return `<span class="dim" title="профиля нет">${nm}</span>`;
    if (l.all && l.all.length > 1) return nm + ': ' + l.all.map((x, i) => `<a target="_blank" rel="noopener" href="${esc(x.u)}" title="${esc(x.t + ' (' + x.src + ')' + (H_NOTE[key] ? ' — ' + H_NOTE[key] : ''))}">профиль ${i + 1}</a>`).join(', ');
    return `<a target="_blank" rel="noopener" href="${esc(l.u)}" title="${esc((l.q ? 'форма поиска автора: ' + l.q : l.t) + (H_NOTE[key] ? ' — ' + H_NOTE[key] : ''))}">${nm}</a>`; });
  const fio = hxFio(S), e = encodeURIComponent((fio || '') + ' индекс Хирша');
  return `<div class="hplate" title="Базы считают индекс Хирша по разным наборам статей, поэтому значения расходятся; крупно — наибольшее из полученных, с подписью базы. OpenAlex считает по своей базе и с самоцитированием."><div class="hl">Индекс<br>Хирша</div>`
    + `<div><div class="hv">${b ? b.v : '—'}</div><div class="dim" style="font-size:11px">${b ? esc(bname(b)) : 'нет данных'}</div></div>`
    + `<div class="hs">${others.length ? '<div>' + others.join(' · ') + '</div>' : ''}`
    + (miss.length ? `<div>${miss.join(' · ')} — Хирш не получен, посмотреть</div>` : '')
    + `<div class="dim" style="font-size:11px">${fio ? `поиск в интернете: ${lnk('https://yandex.ru/search/?text=' + e, 'Яндекс')} · ${lnk('https://www.google.com/search?q=' + e, 'Google')} · ` : ''}<button class="linkbtn" style="font-size:11px" onclick="hxToggle()">вставить страницу профиля</button></div></div></div>`
    + (sum.warns.length ? `<div style="flex-basis:100%">${chip('check', 'проверьте')} ${sum.warns.map(esc).join('; ')}.</div>` : '');
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
  (S.hx || []).filter(x => x.val != null).forEach(x => out.push(tsvRow(['Индекс Хирша ' + H_BASE_NAME[x.base] + ' (со страницы профиля' + (x.label ? ', ' + x.label : '') + ')', x.val, x.id || '', ''])));
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
  if (prof && !prof.err) h += hxPanelHtml(S);
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
    else h += `<table class="t pubs"><tr>${sortTh(fid, 'year', 'Год', 'width:7%')}<th>Статья и ссылка</th><th style="width:15%">Издание</th>${sortTh(fid, 'q', 'Квартиль<div class="sub">SCImago</div>', 'width:12%')}${sortTh(fid, 'wl', 'Белый список', 'width:11%')}${sortTh(fid, 'if', 'Импакт-фактор<div class="sub">SCImago</div>', 'width:8%')}${csHas() ? `<th style="width:9%">${TH_CS()}</th>` : ''}<th style="width:8%">Место автора</th><th style="width:11%">Corresponding</th></tr>` + rows.map(x => {
      const url = wLink(x.w), mk = markKeyA(x);
      return `<tr${MARKS[mk] ? ' class="done"' : ''}><td>${x.w.year || ''}${markBox(mk)}</td><td>${esc(x.w.title)}${k < 0 && listed.has(x.w.doi) && x.w.doi ? ' ' + nchip('в списке') : ''}${x.w.type === 'review' ? ' <span class="dim">обзор</span>' : ''}<br>${url ? lnk(url) : chip('unk', 'ссылки нет')}</td><td>${esc(x.w.journal)}</td><td>${quartText(x.jv, x.j.sj, true, x.j.wl)}</td><td>${wlText(x.j.wl, x.w.year, true)}</td><td class="mono">${x.jv.cpd != null ? fmtNum(x.jv.cpd) : ''}</td>${csHas() ? `<td>${csCell(x.j.cs)}</td>` : ''}<td class="dim">${esc(x.pos || '')}</td><td>${corrChip(x.corrSt, x.corrNames)}</td></tr>`;
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
  $('outAuthor').innerHTML = '<h2>Автор <button class="linkbtn noprint" style="margin-left:14px;text-transform:none;letter-spacing:0" onclick="resetAuthor()">Найти другого автора</button></h2>' + authorBody(S, -1, 'au', true).replace('<p>Источник —', '<h2 id="auWorks">Все публикации автора</h2><p>Источник —');
  $('auOut').style.display = S.prof && !S.prof.err ? '' : 'none';
}

/* ----- Копирование ----- */
const tsvRow = a => a.map(x => String(x == null ? '' : x).replace(/[\t\n]/g, ' ')).join('\t');
const wlS = (wl, year) => { if (!wl) return 'нет'; const a = wlAt(wl, year); return (a.excluded ? 'исключён ' + wl.disc : (a.lv ? a.lv + ' (' + a.y + ')' : 'без уровня')) + (!a.excluded && (a.curExcl || a.cur !== a.lv) ? '; сейчас ' + (a.curExcl ? 'исключён' : a.cur || 'без уровня') : ''); };
const idxS = wl => !wl ? 'нет данных' : ['WoS CC', 'Scopus', 'RSCI'].filter((n, i) => [wl.wos, wl.scopus, wl.rsci][i]).join(', ') || 'ни в одной';
const scS = (sc, year) => !scHas() ? '' : (!sc ? 'нет в списке источников Scopus' : scStatusText(sc) + (scAt(sc, year).inCov === false ? '; в ' + year + ' г. не индексировался' : '') + (scAt(sc, year).afterDisc ? '; статья позже последнего номера' : ''));
const corrS = w => !w.oa ? 'нет данных' : (!w.corr || !w.corr.known ? 'в базе не указан' : w.corr.names.join(', '));
const orgS = me => orgNames(me).join('; ');
const markS = k => MARKS[k] ? 'да' : '';
/* CiteScore в выгрузке (0.9): значение, квартиль, тематика и столбец «Источник» — условие Elsevier (указание источника и ссылка) */
const csHead = () => csHas() ? ['CiteScore (Scopus ' + REF.csYear + ', сейчас)', 'Квартиль по CiteScore (наилучший)', 'Тематика Scopus (процентиль)', 'Источник CiteScore'] : [];
const csCols = cs => !csHas() ? [] : (!cs ? ['', '', '', ''] : [cs.v != null ? cs.v : '', cs.q ? 'Q' + cs.q : '', cs.best ? cs.best.name + ' (' + cs.best.pct + ')' : '', csSrc(cs) + ' — ' + csLink(cs)]);
/* Таблица для копирования и выгрузки файлом: числа — числами (Excel сам покажет их по-русски) */
function listTable() {
  const ids = auIds().length; const L = [['№', 'Проверено', 'Найденная статья', 'Ссылка', 'Год', 'Тип', 'Издание', 'ISSN', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Индексация (Белый список)', 'Белый список (год публикации)', 'Импакт-фактор (SCImago, цит. на документ за 2 года)', 'Импакт-фактор в списке', 'Квартиль в списке', 'Scopus (список источников)'].concat(csHead()).concat(['Corresponding (OpenAlex)']).concat(ids ? ['Найденный автор — corresponding', 'Организация автора'] : []).concat(['Первый автор', 'Последний автор', 'Примечания', 'Запись из списка'])];
  listRows().forEach(({ p, i }) => { const w = p.work, jv = p.jv || {}, a = w ? w.authors : [], m = w ? listMe(w) : null, num = numOf(p.entry, i);
    L.push([typeof num === 'number' ? num : String(num), markS(markKeyL(p)), w ? w.title : (p.found === 'patent' ? 'патент — не ищется' : (p.found === 'no' ? 'не найдена' : 'не проверена')), w ? wLink(w) : (p.entry.patentNo ? 'https://patents.google.com/patent/' + p.entry.patentNo : ''), w ? w.year : '', w ? p.typeName : (p.found === 'patent' ? 'патент' : ''), w ? w.journal : '', w ? w.issns.join(', ') : '', w && p.j.sj ? (jv.qY ? 'Q' + jv.qY : 'нет') + ' (' + jv.sjYear + ')' : '', w && p.j.sj && jv.qL ? 'Q' + jv.qL : '', w ? idxS(p.j.wl) : '', w ? wlS(p.j.wl, w.year) : '', w && jv.cpd != null ? Math.round(jv.cpd * 100) / 100 : '', p.declIF != null ? p.declIF : '', p.declQ ? 'Q' + p.declQ : '', w ? scS(p.j.sc, w.year) : ''].concat(csCols(w ? p.j.cs : null)).concat([w ? corrS(w) : '']).concat(ids ? [m && m.me ? CORR_T[m.corr] : 'нет данных', m && m.me ? orgS(m.me) : ''] : []).concat([aName(a[0]), a.length > 1 ? aName(a[a.length - 1]) : '', p.notes.concat(dupNotes(i)).join('; '), p.entry.raw])); });
  return L;
}
function copyList() { if (!W.entries) return; toClip(listTable().map(r => tsvRow(r.map(cellTxt))).join('\n'), 'status'); }
function exportList(kind) { if (!W.entries) return; const t = listTable(), nm = 'Публикации_из_списка_' + today(); download(nm + '.' + kind, kind === 'xlsx' ? xlsxBlob('Публикации из списка', t) : csvBlob(t)); $('status').textContent = 'Файл ' + nm + '.' + kind + ' сохранён в папку загрузок.'; }
const profHead = () => ['Год', 'Проверено', 'Статья', 'Ссылка', 'Издание', 'Квартиль (год публикации)', 'Квартиль сейчас (' + REF.sjYear + ')', 'Белый список (год публикации)', 'Импакт-фактор (SCImago)'].concat(csHead()).concat(['Место автора', 'Corresponding', 'Организация автора в статье']);
const profLine = x => [x.w.year, markS(markKeyA(x)), x.w.title, wLink(x.w), x.w.journal, x.j.sj ? (x.jv.qY ? 'Q' + x.jv.qY : 'нет') + ' (' + x.jv.sjYear + ')' : '', x.j.sj && x.jv.qL ? 'Q' + x.jv.qL : '', wlS(x.j.wl, x.w.year), x.jv.cpd != null ? Math.round(x.jv.cpd * 100) / 100 : ''].concat(csCols(x.j.cs)).concat([x.pos || '', x.corrSt ? CORR_T[x.corrSt] + (x.corrSt === 'no' && x.corrNames.length ? ' (' + x.corrNames.join(', ') + ')' : '') : 'нет данных', orgS(x.me)]);
function authorTable() { const sum = hirschSummary(AU.prof.info.filter(a => a.h != null).map(a => ({ h: a.h, id: a.id })), AU.hx || []); const hs = sum.vals.map(x => H_BASE_NAME[x.base] + (x.base === 'openalex' ? ' (свой расчёт)' : '') + ': ' + x.v).join('; '); return [['Автор', AU.prof.info.map(a => a.name).join('; '), AU.prof.info.map(a => 'https://openalex.org/' + a.id).join(' '), hs ? 'Индекс Хирша — ' + hs + (sum.best ? '; наибольший — ' + sum.best.v + ' (' + H_BASE_NAME[sum.best.base] + ')' : '') : ''], profHead()].concat(aRows().map(profLine)); }
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

/* ===== 0.8: экран — индекс Хирша со страницы профиля, режим «Журнал», загрузка документа ===== */

/* ----- Индекс Хирша со страницы профиля (правка 4) ----- */
let HXOPEN = false, HXMSG = '', HXLAST = null;
const hxFio = S => { const p = S.parsed || {}; if (p.name) return p.name; const i = S.prof && !S.prof.err && S.prof.info[0]; return i && i.name && !/^A\d+$/.test(i.name) ? i.name : ''; };
function hxToggle() { HXOPEN = !HXOPEN; renderAuthor(); if (HXOPEN) { const t = $('hxText'); if (t) { t.focus(); goTo('hxPanel'); } } }
function hxPanelHtml(S) {
  if (!HXOPEN && !(S.hx && S.hx.length)) return '';
  let h = `<div class="plinks" id="hxPanel"><b>Индекс Хирша со страницы профиля</b>`;
  if (S.hx && S.hx.length) h += '<table class="t" style="margin-top:6px"><tr><th style="width:18%">База</th><th style="width:10%">Хирш</th><th>Что ещё на странице</th><th style="width:14%"></th></tr>' + S.hx.map((x, i) => `<tr><td>${esc(H_BASE_NAME[x.base] || x.base)}${x.id ? '<div class="dim">профиль ' + esc(x.id) + '</div>' : ''}</td><td><b>${x.val}</b>${x.label ? '<div class="dim">' + esc(x.label) + '</div>' : ''}</td><td class="dim">${x.alts && x.alts.length ? x.alts.map(a => esc(a.label) + ': ' + a.v).join('; ') : ''}${x.nameOk === false ? ' ' + chip('check', 'фамилия автора на странице не найдена — тот ли профиль?') : ''}</td><td><button class="sec small" onclick="hxRemove(${i})">Убрать</button></td></tr>`).join('') + '</table>';
  if (HXOPEN) {
    h += `<p class="dim" style="margin:6px 0">Откройте профиль автора по ссылке (eLibrary, Scopus, Web of Science, Google Scholar), выделите страницу (Ctrl+A), скопируйте (Ctrl+C) и вставьте сюда — или вставьте снимок страницы (Ctrl+V в это поле) либо выберите его: <input type="file" id="hxFile" accept="image/*" onchange="hxImage([...this.files])">. Текст страницы никуда не отправляется — индекс Хирша находится на этом компьютере.</p>`
      + `<div class="row" style="align-items:flex-end"><div style="flex:4 1 360px"><textarea id="hxText" style="min-height:90px" placeholder="Текст страницы профиля автора"></textarea></div><div style="flex:1 1 180px"><label for="hxBase">База</label><select id="hxBase" style="width:100%;padding:6px;font:inherit"><option value="">узнать по странице</option><option value="rinc">РИНЦ (eLibrary)</option><option value="scopus">Scopus</option><option value="wos">Web of Science</option><option value="gs">Google Scholar</option></select><p style="margin:6px 0 0"><button onclick="hxAdd()">Найти индекс Хирша</button></p></div></div>`;
    if (HXMSG) h += `<p>${chip('check', 'проверьте')} ${esc(HXMSG)}${HXLAST && HXLAST.cands.length > 1 ? ' ' + HXLAST.cands.map(v => `<button class="sec small" onclick="hxPick(${v})">${v}</button>`).join(' ') : ''}</p>`;
  }
  return h + '</div>';
}
function hxAdd(text) {
  const S = AU; text = text != null ? text : ($('hxText') ? $('hxText').value : ''); if (!String(text).trim()) { HXMSG = 'вставьте текст страницы профиля'; renderAuthor(); return; }
  const r = parseHirschPage(text, ($('hxBase') && $('hxBase').value) || null, parseFIO(hxFio(S)));
  HXLAST = r.val == null && r.cands.length > 1 ? r : null;
  if (r.val == null) { HXMSG = r.err; renderAuthor(); if ($('hxText')) $('hxText').value = text; return; }
  hxPush(r); if ($('hxText')) $('hxText').value = '';
}
function hxPush(r) {
  const S = AU; S.hx = (S.hx || []).filter(x => !(x.base === r.base && (x.id || '') === (r.id || '')));
  S.hx.push({ base: r.base, val: r.val, label: r.label, alts: r.alts, id: r.id, nameOk: r.nameOk }); HXMSG = ''; HXLAST = null;
  renderAuthor(); updateNav(); saveState();
}
function hxPick(v) { if (!HXLAST) return; const r = Object.assign({}, HXLAST, { val: v, label: 'выбрано из нескольких чисел на странице' }); hxPush(r); }
function hxRemove(i) { AU.hx.splice(i, 1); renderAuthor(); saveState(); }
async function hxImage(files) {
  if (!files.length || BUSY) return; BUSY = true; HXMSG = 'Распознаю снимок страницы…'; renderAuthor();
  try { const r = await ocrImage(files[0]); BUSY = false; hxAdd(r.text); if (HXMSG) HXMSG += ` (снимок распознан с уверенностью ${r.conf} %)`; renderAuthor(); }
  catch (e) { BUSY = false; HXMSG = 'снимок не распознан: ' + (e.message || e); renderAuthor(); }
}

/* ----- Режим «Журнал» (правка 5): название или ISSN → квартиль, импакт-фактор, Белый список, Scopus ----- */
const JR = { rows: [], year: null };
function runJournals() {
  if (!REF) return; const lines = $('jq').value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 300);
  JR.year = +$('jy').value || null; if (JR.year && (JR.year < 1990 || JR.year > 2100)) JR.year = null;
  $('jstatus').textContent = lines.length ? 'Ищу в справочниках…' : 'Впишите название журнала или ISSN — по одному в строке.';
  setTimeout(() => { JR.rows = lines.map(q => { const res = findJournalQuery(q); return { q, res, pick: res.sure ? res.hits.indexOf(res.sure) : null }; });
    const n = JR.rows.filter(r => r.pick != null).length; $('jstatus').textContent = lines.length ? `Готово: определено ${n} из ${lines.length}` + (n < lines.length ? '; для остальных выберите вариант или уточните запрос (лучше — ISSN).' : '.') : '';
    renderJournals(); updateNav(); goTo('outJournal'); saveState(true); }, 20);
}
function pickJournal(r, k) { JR.rows[r].pick = k; renderJournals(); saveState(true); }
const qS = q => q ? 'Q' + q : 'без квартиля';
function catsHtml(cats) { if (!cats) return ''; return `<details class="mini"><summary>квартили по разделам (${REF.sjYear})</summary><span class="dim">${cats.split(';').map(s => esc(s.trim())).join('<br>')}</span></details>`; }
/* 0.9, правка 5: журнал — строка-ведомость. Крупно: квартиль SCImago, импакт-фактор, уровень Белого списка; рядом «сейчас»;
   квартиль по годам — плашками «год Q»; индексация; строка CiteScore Scopus (правка 6); ссылки и примечания. */
const big = (v, sub, cls) => `<div class="jbig${cls ? ' ' + cls : ''}">${v}</div>${sub ? `<div class="dim">${sub}</div>` : ''}`;
function idxDots(wl, sc, year) {
  const d = (n, on, t) => `<span class="${on ? 'on' : 'off'}" title="${esc(t || '')}">${on ? '●' : '○'} ${n}</span>`;
  const sct = sc ? scStatusText(sc) : '';
  return `<span class="idx dim">${wl ? d('WoS CC', wl.wos, 'по данным Белого списка') + ' &nbsp;' : ''}${d('Scopus' + (sc && sc.covText ? ' ' + esc(sc.covText) : ''), !!(sc ? sc.status === 1 : wl && wl.scopus), sc ? 'Scopus Source List ' + REF.scDate + ': ' + sct : 'по данным Белого списка')}${wl ? ' &nbsp;' + d('RSCI', wl.rsci, 'по данным Белого списка') : ''}</span>`;
}
function journalSheet(e, year, head, notes) {
  const f = journalFacts(e, year), sj = e.sj, wl = e.wl, is = f.issns.join(' · ');
  let h = `<div class="jsheet">${head || ''}<div class="jtop"><div><div class="jname">${esc(f.title)}</div>`
    + (wl && sj && norm(wl.title.split(' | ')[0]) !== norm(sj.title) ? `<div class="dim">в Белом списке: ${esc(wl.title.split(' | ')[0])}</div>` : '')
    + `<div class="jmeta">${is ? 'ISSN ' + esc(is) : 'ISSN нет'}${sj && sj.type ? ' · ' + SJ_TYPE[sj.type] : (!sj && e.cs && CS_TYPE[e.cs.type] && e.cs.type !== 'j' ? ' · ' + CS_TYPE[e.cs.type] : '')}</div></div><div>${idxDots(wl, e.sc, year || null)}</div></div>`;
  h += '<div class="jgrid">';
  if (sj) {
    const nowDiff = f.qNowYear !== f.qYear;
    h += `<div><div class="cap">Квартиль SCImago ${f.qYear}</div>${big(f.q ? 'Q' + f.q : '—', (year && !f.qExact ? `за ${year} данных нет — взят ${f.qYear}` : '') + (nowDiff ? `${year && !f.qExact ? '<br>' : ''}сейчас (${f.qNowYear}): ${f.qNow !== f.q ? chip('check', qS(f.qNow)) : qS(f.qNow)}` : (year ? '' : 'сейчас')))}</div>`;
    h += `<div><div class="cap">Импакт-фактор</div>${f.cpd != null ? big(fmtNum(f.cpd), `цит. на документ SCImago, ${f.qYear}` + (nowDiff && f.cpdNow != null ? `<br>сейчас (${f.qNowYear}): ${fmtNum(f.cpdNow)}` : '')) : big('—', 'нет данных', 't')}</div>`;
  } else h += `<div><div class="cap">Квартиль SCImago</div>${big(chip('unk', 'нет в SCImago'), e.sc || e.cs ? 'в Scopus есть, квартиля SCImago нет' : '', 't')}</div><div><div class="cap">Импакт-фактор</div>${big('—', 'нет в SCImago', 't')}</div>`;
  if (wl) { const a = wlAt(wl, year || null); h += `<div><div class="cap">Белый список${year ? ' ' + year : ''}</div>${a.excluded ? big(chip('check', 'исключён ' + wl.disc), '', 't') : big(a.lv || '—', (a.lv ? 'уровень' : 'без уровня') + (a.y ? ` (${a.y})` : '') + (!a.excluded && (a.curExcl || a.cur !== a.lv) ? '<br>' + chip('check', a.curExcl ? 'сейчас исключён ' + wl.disc : 'сейчас ' + (a.cur ? 'уровень ' + a.cur : 'без уровня')) : ''))}</div>`; }
  else h += `<div><div class="cap">Белый список</div>${big('нет', 'нет в списке', 't')}</div>`;
  h += `<div><div class="cap">Квартиль SCImago по годам</div>${sj ? yearChips(sj, year || null, 6) + (Object.keys(sj.hist).length > 6 ? `<details class="mini"><summary>все годы</summary>${yearChips(sj, year || null, 0)}</details>` : '') + catsHtml(f.cats) : '<span class="dim">нет данных</span>'}</div>`;
  h += '</div>' + csLine(e.cs, sj ? f.qNow : null);
  const links = [sj ? lnk(`https://www.scimagojr.com/journalsearch.php?q=${sj.sid}&tip=sid`, 'SCImago') : lnk('https://www.scimagojr.com/journalsearch.php?q=' + encodeURIComponent(f.title), 'SCImago: поиск'), e.sc && e.sc.id ? lnk(scLink(e.sc), 'Scopus') : (sj ? lnk(scopusSource(sj.sid), 'Scopus') : lnk('https://www.scopus.com/sources.uri', 'Scopus Sources')), wl ? `<span title="справочник от ${REF.wlDate}">${wlLink(wl)} Белого списка</span>` : '', f.issns[0] ? lnk('https://mjl.clarivate.com/search-results?issn=' + f.issns[0], 'есть ли в WoS') : '', lnk('https://jcr.clarivate.com/', 'JCR')].filter(Boolean).join(' · ');
  const nh = notesHtml(notes || []);
  h += `<div class="jfoot"><span class="dim">${links}</span>${e.sc ? `<span class="dim">Scopus: ${esc(scStatusText(e.sc))}</span>` : ''}${nh ? `<span>${chip('check', 'примечания')} ${nh}</span>` : ''}</div>`;
  return { f, html: h + '</div>' };
}
function renderJournals() {
  const el = $('outJournal'); if (!el) return;
  if (!JR.rows.length) { el.innerHTML = ''; $('jOut').style.display = 'none'; return; }
  let h = `<h2>Журналы (${JR.rows.length})${JR.year ? ` <span class="sub">· на ${JR.year} год</span>` : ''}</h2>`;
  JR.rows.forEach((r, ri) => {
    const res = r.res, qh = `<div class="cap" style="margin-bottom:6px">Запрос: <span style="text-transform:none;letter-spacing:0;color:var(--ink)">${esc(r.q)}</span>${r.pick != null && res.hits.length > 1 ? ` &nbsp;<button class="linkbtn" style="font-size:12px" onclick="pickJournal(${ri},null)">другие варианты (${res.hits.length - 1})</button>` : ''}</div>`;
    if (r.pick != null) { const hit = res.hits[r.pick], c0 = journalFacts(hit.e, JR.year); const notes = res.notes.concat(c0.notes).concat(hit.how === 'similar' ? [`название совпало не полностью (${Math.round(hit.score * 100)} %) — убедитесь, что это тот журнал`] : []).concat(hit.how === 'title' && !res.issns.length ? ['найден по названию — надёжнее сверить по ISSN'] : []);
      h += journalSheet(hit.e, JR.year, qh, notes).html; return; }
    if (!res.hits.length) { h += `<div class="jsheet">${qh}${chip('unk', 'не найдено в справочниках')} <span class="dim">В SCImago${scHas() ? ', списке источников Scopus' : ''}${csHas() ? ', CiteScore' : ''} и Белом списке (от ${REF.wlDate}) такого издания нет. Это не значит, что журнал нигде не индексируется: проверьте написание или впишите ISSN. Поиск: ${lnk('https://www.scimagojr.com/journalsearch.php?q=' + encodeURIComponent(r.q), 'SCImago')} · ${lnk('https://journalrank.rcsi.science/ru/record-sources/?s=' + encodeURIComponent(r.q), 'Белый список')} · ${lnk('https://mjl.clarivate.com/search-results?search=' + encodeURIComponent(r.q), 'WoS')}</span></div>`; return; }
    h += `<div class="jsheet">${qh}${chip('check', 'выберите')} <span class="dim">Однозначно определить журнал нельзя — похожие издания:</span>` + res.hits.map((x, k) => `<div style="margin-top:6px"><button class="sec small" onclick="pickJournal(${ri},${k})">Это он</button> <b>${esc(x.e.title)}</b> <span class="dim">${[x.e.issns.map(fmtIssn).join(', '), x.e.sj ? 'SCImago ' + qS(x.e.sj.q) : 'нет в SCImago', x.e.wl ? 'Белый список' : '', x.e.sc || x.e.cs ? 'Scopus' : '', x.how === 'issn' ? 'по ISSN' : 'совпадение ' + Math.round(x.score * 100) + ' %'].filter(Boolean).map(esc).join(' · ')}</span></div>`).join('') + (res.notes.length ? `<div class="dim">${res.notes.map(esc).join('; ')}</div>` : '') + '</div>';
  });
  el.innerHTML = h; $('jOut').style.display = '';
}
function journalTable() {
  const y = JR.year, L = [['Запрос', 'Издание', 'ISSN', 'Квартиль SCImago' + (y ? ' (' + y + ')' : ''), 'Год квартиля', 'Квартиль сейчас (' + REF.sjYear + ')', 'Импакт-фактор (SCImago, цит. на документ за 2 года)', 'Белый список' + (y ? ' (' + y + ')' : ''), 'Индексация (Белый список)', 'Scopus (список источников)'].concat(csHead()).concat(['Ссылка SCImago', 'Примечания'])];
  JR.rows.forEach(r => {
    if (r.pick == null) { L.push([r.q, r.res.hits.length ? 'не выбран: ' + r.res.hits.map(x => x.e.title).join('; ') : 'не найдено в справочниках']); return; }
    const hit = r.res.hits[r.pick], e = hit.e, f = journalFacts(e, y);
    L.push([r.q, f.title, f.issns.join(', '), e.sj ? qS(f.q) : 'нет в SCImago', e.sj ? f.qYear : '', e.sj ? qS(f.qNow) : '', e.sj && f.cpd != null ? Math.round(f.cpd * 100) / 100 : '', wlS(e.wl, y || null), idxS(e.wl), scS(e.sc, y || null)].concat(csCols(e.cs)).concat([e.sj ? `https://www.scimagojr.com/journalsearch.php?q=${e.sj.sid}&tip=sid` : '', r.res.notes.concat(f.notes).join('; ')]));
  });
  return L;
}
function copyJournals() { if (JR.rows.length) toClip(journalTable().map(r => tsvRow(r.map(cellTxt))).join('\n'), 'jstatus'); }
function exportJournals(kind) { if (!JR.rows.length) return; const t = journalTable(), nm = 'Журналы_' + today(); download(nm + '.' + kind, kind === 'xlsx' ? xlsxBlob('Журналы', t) : csvBlob(t)); $('jstatus').textContent = 'Файл ' + nm + '.' + kind + ' сохранён в папку загрузок.'; }

/* ----- Загрузка документа (правка 6): PDF или Word → найденные записи → обычная проверка списка. Документ никуда не отправляется. ----- */
let DOC = null;
const SITE_PDF = () => typeof window !== 'undefined' && window.PC_SITE === true;
async function getPdf() {
  if (typeof pdfjsLib === 'undefined') { if (SITE_PDF()) await loadScript(new URL('pdf/pdf.min.js?v=' + VERSION, location.href).href); else throw new Error('чтение PDF в эту сборку не включено'); }
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    if (SITE_PDF()) pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdf/pdf.worker.min.js?v=' + VERSION, location.href).href;
    else pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([new TextDecoder().decode(embedded('pdf-worker'))], { type: 'application/javascript' }));
  }
  return pdfjsLib;
}
/* Строки страницы PDF по координатам текста; большой промежуток по горизонтали — граница ячейки таблицы */
function pdfLines(items) {
  const it = items.filter(i => i.str && i.str.trim()).map(i => ({ s: i.str, x: i.transform[4], y: i.transform[5], w: i.width || 0, h: Math.abs(i.transform[3]) || i.height || 10 })).sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = []; it.forEach(i => { const l = lines[lines.length - 1]; if (l && Math.abs(l.y - i.y) <= Math.max(2, l.h * 0.5)) l.items.push(i); else lines.push({ y: i.y, h: i.h, items: [i] }); });
  const out = []; let prevY = null, prevH = 10;
  lines.forEach(l => {
    // отдельные куски текста с промежутком больше 0,6 высоты шрифта — разные ячейки (просвет между словами меньше)
    l.items.sort((a, b) => a.x - b.x); const cells = []; let cur = null, end = 0;
    l.items.forEach(i => { const gap = i.x - end; if (!cur || gap > l.h * 0.6) { cur = { t: i.s, x: i.x, w: i.w }; cells.push(cur); } else { cur.t += (gap > l.h * 0.12 && !/\s$/.test(cur.t) && !/^\s/.test(i.s) ? ' ' : '') + i.s; cur.w = i.x + i.w - cur.x; } end = i.x + i.w; });
    if (prevY != null && prevY - l.y > Math.max(l.h, prevH) * 2.1) out.push('');
    cells.forEach(c => { c.t = c.t.replace(/\s+/g, ' ').trim(); });
    out.push({ cells, y: l.y, h: l.h }); prevY = l.y; prevH = l.h;
  });
  return out;
}
async function readPdf(buf, msg) {
  const lib = await getPdf(); const doc = await lib.getDocument({ data: buf, isEvalSupported: false, disableFontFace: true, useSystemFonts: false }).promise;
  const pages = [], scanned = [];
  for (let n = 1; n <= doc.numPages; n++) {
    msg(`Читаю страницу ${n} из ${doc.numPages}…`);
    const pg = await doc.getPage(n), tc = await pg.getTextContent(), chars = tc.items.reduce((s, i) => s + (i.str || '').trim().length, 0);
    if (chars >= 30) { pages.push(pdfLines(tc.items)); continue; }
    // страница без текста — скан: распознать как снимок
    if (!ocrAvailable()) { pages.push([]); scanned.push(n); continue; }
    msg(`Страница ${n} из ${doc.numPages} — скан, распознаю (первый раз — до минуты)…`);
    const vp = pg.getViewport({ scale: 2 }), cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
    await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
    const blob = await new Promise(ok => cv.toBlob(ok, 'image/png')); const r = await ocrImage(blob);
    pages.push(r.text.split('\n')); scanned.push(n);
  }
  return { pages, scanned };
}
/* .docx — архив zip: word/document.xml распаковывается встроенным в браузер распаковщиком */
async function unzipEntry(buf, name) {
  const u = new Uint8Array(buf), dv = new DataView(buf); let e = -1;
  for (let i = u.length - 22; i >= Math.max(0, u.length - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('файл не похож на .docx');
  let p = dv.getUint32(e + 16, true); const n = dv.getUint16(e + 10, true), dec = new TextDecoder();
  for (let k = 0; k < n; k++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), fl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    const fn = dec.decode(u.subarray(p + 46, p + 46 + fl));
    if (fn === name) { const lfl = dv.getUint16(off + 26, true), lxl = dv.getUint16(off + 28, true), data = u.subarray(off + 30 + lfl + lxl, off + 30 + lfl + lxl + csize);
      if (method === 0) return dec.decode(data);
      if (typeof DecompressionStream === 'undefined') throw new Error('браузер не умеет распаковывать .docx — сохраните документ как PDF');
      const st = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return await new Response(st).text(); }
    p += 46 + fl + xl + cl;
  }
  throw new Error('в файле нет word/document.xml — это не документ Word');
}
function docxPages(xml) {
  const d = new DOMParser().parseFromString(xml, 'application/xml'), W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const body = d.getElementsByTagNameNS(W, 'body')[0]; if (!body) throw new Error('документ Word не прочитан');
  const pages = [[]], cnt = {}, add = l => pages[pages.length - 1].push(l);
  const ptext = p => { let t = ''; const walk = n => { for (const c of n.childNodes) { if (c.namespaceURI === W) { if (c.localName === 't') t += c.textContent; else if (c.localName === 'tab') t += '\t'; else if (c.localName === 'br' && c.getAttributeNS(W, 'type') !== 'page') t += ' '; else walk(c); } } }; walk(p); return t; };
  const brk = p => p.getElementsByTagNameNS(W, 'lastRenderedPageBreak').length || [...p.getElementsByTagNameNS(W, 'br')].some(b => b.getAttributeNS(W, 'type') === 'page');
  for (const el of body.children) {
    if (el.localName === 'p') {
      if (brk(el) && pages[pages.length - 1].length) pages.push([]);
      let t = ptext(el).replace(/\s+$/, ''); const np = el.getElementsByTagNameNS(W, 'numPr')[0], ps = el.getElementsByTagNameNS(W, 'pStyle')[0], psv = ps ? ps.getAttributeNS(W, 'val') : '';
      // нумерация стилем абзаца («Нумерованный список», List Number) — номера в тексте тоже нет
      if (!np && /list\s*number|listnumber|нумерован/i.test(psv) && t.trim()) { cnt.st = (cnt.st || 0) + 1; if (!/^\s*\d{1,3}\s*[.)]/.test(t)) t = cnt.st + '. ' + t.trim(); }
      // автонумерация Word: номера в тексте нет — ставим сами
      if (np && t.trim()) { const v = tag => { const x = np.getElementsByTagNameNS(W, tag)[0]; return x ? x.getAttributeNS(W, 'val') : '0'; }, k = v('numId') + ':' + v('ilvl'); cnt[k] = (cnt[k] || 0) + 1; if (!/^\s*\d{1,3}\s*[.)]/.test(t)) t = cnt[k] + '. ' + t.trim(); }
      add(t);
    } else if (el.localName === 'tbl') {
      for (const tr of el.getElementsByTagNameNS(W, 'tr')) { if (tr.parentNode !== el) continue; const cells = [...tr.childNodes].filter(c => c.localName === 'tc').map((tc, i) => ({ t: [...tc.getElementsByTagNameNS(W, 'p')].map(ptext).join(' ').replace(/\s+/g, ' ').trim(), x: i })); add({ cells, row: true }); }
      add('');
    }
  }
  return pages;
}
async function readDocument(files) {
  const f = files[0]; if (!f || BUSY) return; BUSY = true; const box = $('docOut'), msg = t => { box.innerHTML = `<p class="dim">${esc(t)}</p>`; }; box.style.display = '';
  try {
    const nm = f.name.toLowerCase(), buf = await f.arrayBuffer(); let pages, scanned = [];
    if (/\.pdf$/.test(nm) || f.type === 'application/pdf') ({ pages, scanned } = await readPdf(buf, msg));
    else if (/\.docx$/.test(nm)) { msg('Читаю документ Word…'); pages = docxPages(await unzipEntry(buf, 'word/document.xml')); }
    else if (/\.doc$/.test(nm)) throw new Error('старый формат .doc не читается — сохраните документ как .docx или PDF');
    else throw new Error('нужен файл PDF или Word (.docx)');
    const r = findDocRecords(pages); DOC = { name: f.name, recs: r.records.map(x => ({ text: x.text, page: x.page, on: true })), heading: r.heading, total: r.total, scanned, word: /\.docx$/.test(nm) };
    renderDoc();
  } catch (e) { box.innerHTML = `<p>${chip('unk', 'не прочитан')} ${esc(e.message || String(e))}. Можно скопировать список из документа и вставить его в поле ниже текстом.</p>`; }
  BUSY = false;
}
function renderDoc() {
  const box = $('docOut'); if (!DOC) { box.style.display = 'none'; box.innerHTML = ''; return; }
  const n = DOC.recs.length, on = DOC.recs.filter(r => r.on).length, pg = [...new Set(DOC.recs.map(r => r.page))];
  let h = `<div class="docbox"><b>Документ «${esc(DOC.name)}»</b> `;
  if (!n) h += `<p>${chip('unk', 'публикации не найдены')} В документе не нашлось записей, похожих на публикации${DOC.scanned.length ? ' (страницы-сканы распознаны с изображения: ' + DOC.scanned.join(', ') + ')' : ''}. Скопируйте нужный кусок текста и вставьте его в поле списка ниже.</p>`;
  else {
    h += `<span class="dim">найдено записей: <b>${n}</b>${DOC.word ? '' : ', на страницах ' + esc(pg.join(', '))}${DOC.total && !DOC.word ? ' из ' + DOC.total : ''}; ${DOC.heading ? 'раздел «' + esc(DOC.heading.slice(0, 80)) + '»' : 'раздел со списком публикаций не найден — записи искались по всему документу'}.</span>`;
    h += `<p>${chip('check', 'проверьте')} Сложная вёрстка (две колонки, таблицы-картинки) и плохие сканы читаются не полностью — проверьте, все ли записи найдены и нет ли лишних. Уберите флажок у лишних, поправьте текст при необходимости.${DOC.scanned.length ? ' Страницы ' + DOC.scanned.join(', ') + ' — сканы, распознаны с изображения: сверьте текст.' : ''}</p>`;
    h += '<table class="t"><tr><th style="width:6%"></th><th style="width:8%">Стр.</th><th>Запись</th></tr>' + DOC.recs.map((r, i) => `<tr${r.on ? '' : ' style="opacity:.5"'}><td><input type="checkbox" ${r.on ? 'checked' : ''} onchange="docOn(${i},this.checked)"></td><td class="dim">${DOC.word ? '' : r.page}</td><td><textarea style="min-height:44px;font-size:12.5px" oninput="docEdit(${i},this.value)">${esc(r.text)}</textarea></td></tr>`).join('') + '</table>';
    h += `<p><button onclick="docRun()">Проверить отмеченные (${on})</button> <button class="sec" onclick="docAdd()">Только перенести в поле списка</button> <button class="sec" onclick="docClose()">Закрыть</button></p>`;
  }
  if (!n) h += `<p><button class="sec" onclick="docClose()">Закрыть</button></p>`;
  box.innerHTML = h + '</div>'; box.style.display = '';
}
function docOn(i, v) { DOC.recs[i].on = v; renderDoc(); }
function docEdit(i, v) { DOC.recs[i].text = v; }
/* в поле списка — сплошная нумерация 1, 2, 3…: в документе номера могут начинаться заново в каждом разделе */
function docText() { return DOC.recs.filter(r => r.on && r.text.trim()).map((r, k) => (k + 1) + '. ' + r.text.replace(/\s+/g, ' ').trim().replace(/^(?:\[\d{1,3}\]|\d{1,3}\s*[.)])\s*/, '')).join('\n'); }
function docAdd() { if (!DOC) return; $('list').value = docText() + '\n'; countEntries(); DOC = null; renderDoc(); saveState(true); goTo('secL'); }
function docRun() { if (!DOC) return; $('list').value = docText() + '\n'; countEntries(); DOC = null; renderDoc(); runList(); }
function docClose() { DOC = null; renderDoc(); }

/* ===== 0.9: подсказки при вводе журнала (правка 2), источники данных ===== */

/* ----- Подсказки при вводе журнала. Только встроенные справочники (SCImago, Белый список, Scopus, CiteScore), без интернета.
   Совпадение — по началу названия или по началу любого слова («alloys» → Journal of Alloys and Compounds), кириллица тоже.
   Сначала названия, которые начинаются с введённого, потом остальные; внутри — по алфавиту. Подсказка только помогает ввести:
   если вариант не выбран, поиск работает как обычно. Функция suggestJournals — чистая, проверяется в evals/run.js. */
function suggestJournals(q, max) {
  max = max || 12; const nq = norm(q); if (nq.length < 2 || !REF) return [];
  if (/^\d{4}\s*-?\s*\d{0,3}[\dxх]?$/i.test(String(q).trim())) return [];  // ISSN подсказкой не нужен
  const J = jIndex(), hits = [];
  for (let id = 0; id < J.list.length; id++) { const x = J.list[id]; const r = x.nn.startsWith(nq) ? 0 : ((' ' + x.nn).indexOf(' ' + nq) >= 0 ? 1 : -1); if (r >= 0) hits.push([r, x]); }
  const rec = { sj: sjRec, wl: wlRec, sc: scRec, cs: csRec }, seen = new Set(), out = [];
  const title = x => x.k === 'sj' ? REF.sj[x.i][0] : (x.k === 'wl' ? REF.wl[x.i][0].split(' | ')[0] : (x.k === 'sc' ? REF.sc[x.i][0] : REF.cs[x.i][2]));
  hits.sort((a, b) => a[0] - b[0] || (a[1].nn < b[1].nn ? -1 : a[1].nn > b[1].nn ? 1 : 0));
  for (const [r, x] of hits) {
    if (out.length >= max) break;
    const rc = rec[x.k](x.i), e = journalEntity(rc.issns, { k: x.k, rec: rc }); if (seen.has(e.key)) continue; seen.add(e.key);
    const wa = e.wl ? wlAt(e.wl, null) : null;
    out.push({ title: title(x), e, issn: e.issns[0] ? fmtIssn(e.issns[0]) : '', marks: [e.sj ? 'SCImago ' + (e.sj.q ? 'Q' + e.sj.q : 'без квартиля') : '', e.wl ? (wa.excluded || wa.curExcl ? 'БС исключён' : (wa.cur ? 'БС ' + wa.cur : 'БС без уровня')) : '', e.sc ? (e.sc.disc || e.sc.flag ? 'Scopus исключён' : 'Scopus') : (e.cs ? 'Scopus' : '')].filter(Boolean) });
  }
  return out;
}
const JSUG = { items: [], on: -1, line: null };
function jsugLine() { const t = $('jq'), v = t.value, p = t.selectionStart, a = v.lastIndexOf('\n', p - 1) + 1, b = v.indexOf('\n', p); return { a, b: b < 0 ? v.length : b, text: v.slice(a, b < 0 ? v.length : b) }; }
function jsugHide() { const b = $('jsug'); b.style.display = 'none'; b.innerHTML = ''; JSUG.items = []; JSUG.on = -1; }
function jsugShow() {
  if (!REF) return; const L = jsugLine(); JSUG.line = L; const q = L.text.trim();
  if (q.length < 2) { jsugHide(); return; }
  JSUG.items = suggestJournals(q, 12); JSUG.on = -1; const b = $('jsug');
  if (!JSUG.items.length) { if (/^\d/.test(q)) { jsugHide(); return; } b.innerHTML = '<div class="none">В справочниках нет названий, начинающихся так. Можно искать и так — с опечатками и сокращениями — или по ISSN.</div>'; b.style.display = 'block'; return; }
  b.innerHTML = JSUG.items.map((x, i) => `<div class="it" role="option" data-i="${i}" onmousedown="event.preventDefault();jsugPick(${i})"><div>${esc(x.title)}</div><div class="m">${esc([x.issn ? 'ISSN ' + x.issn : 'ISSN нет'].concat(x.marks).join(' · '))}</div></div>`).join('');
  b.style.display = 'block';
}
function jsugMark() { [...$('jsug').querySelectorAll('.it')].forEach((d, i) => { d.classList.toggle('on', i === JSUG.on); if (i === JSUG.on) d.scrollIntoView({ block: 'nearest' }); }); }
/* Выбор подставляет в текущую строку название и ISSN — поиск по ISSN надёжнее */
function jsugPick(i) {
  const x = JSUG.items[i], L = JSUG.line || jsugLine(); if (!x) return; const t = $('jq'), v = t.value, ins = x.title + (x.issn ? ' ' + x.issn : '');
  t.value = v.slice(0, L.a) + ins + v.slice(L.b); const p = L.a + ins.length; t.focus(); t.setSelectionRange(p, p); jsugHide(); saveState(true);
}
function initJsug() {
  const t = $('jq'); if (!t) return; let tm = null;
  t.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(jsugShow, 120); });
  t.addEventListener('keydown', e => {
    if ($('jsug').style.display !== 'block' || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowDown' && JSUG.items.length) { e.preventDefault(); JSUG.on = (JSUG.on + 1) % JSUG.items.length; jsugMark(); }
    else if (e.key === 'ArrowUp' && JSUG.items.length) { e.preventDefault(); JSUG.on = JSUG.on <= 0 ? JSUG.items.length - 1 : JSUG.on - 1; jsugMark(); }
    else if (e.key === 'Enter' && JSUG.on >= 0) { e.preventDefault(); jsugPick(JSUG.on); }
    else if (e.key === 'Escape') { e.preventDefault(); jsugHide(); }
  });
  t.addEventListener('blur', () => setTimeout(jsugHide, 150));
}

/* ----- Источники данных: в «Источники данных» на главной и строкой внизу подстраницы ----- */
function sourcesList() {
  if (!REF) return [];
  return [`Квартиль и импакт-фактор («цитирований на документ за 2 года») — SCImago Journal & Country Rank, ${REF.sjYears[0]}–${REF.sjYear}.`,
    `Белый список — справочник на ${REF.wlDate}; свежий уровень — с сайта Белого списка (journalrank.rcsi.science).`,
    scHas() ? `Индексация в Scopus — Scopus Source List, ${REF.scDate}.` : '',
    csHas() ? `CiteScore, процентиль и квартиль Scopus — ${csSrc(null)}; ссылка у каждого значения ведёт на страницу издания в Scopus.` : '',
    'Статьи — Crossref и OpenAlex; авторы — OpenAlex и реестр ORCID; corresponding author и организации — OpenAlex.'].filter(Boolean);
}
function renderSources() {
  const L = sourcesList(); if ($('srcList')) $('srcList').innerHTML = L.map(x => '<li>' + esc(x) + '</li>').join('');
  if ($('srcFoot')) $('srcFoot').innerHTML = L.length ? '<div class="cap" style="margin-bottom:4px">Источники данных</div><ul style="margin:0">' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
}

/* ----- Начальный экран «Что проверяем» (0.9): три кнопки, под ними только выбранный раздел.
   При каждом открытии страницы ни один раздел не выбран (Герман, 26.10.2026). В пределах захода «← Новый поиск»
   возвращает к тому разделу, из которого искали. Введённое при переключении не теряется; точка — в разделе уже что-то введено. */
let PANE = '';
function openPane(id, focus) {
  if (!$(id)) return; PANE = id;
  $('home').classList.add('picked');  // большие карточки меню сворачиваются в полосу
  document.querySelectorAll('#inp .col').forEach(c => c.classList.toggle('on', c.id === id));
  document.querySelectorAll('#seg button').forEach(b => { const on = b.dataset.p === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
  updDots();
  if (focus) { const f = { secA: 'author', secJ: 'jq', secL: 'list' }[id]; if ($(f)) $(f).focus(); }
}
function updDots() {
  const has = { secA: !!($('author').value.trim() || $('org').value.trim()), secJ: !!$('jq').value.trim(), secL: !!($('list').value.trim() || (typeof DOC !== 'undefined' && DOC)) };
  document.querySelectorAll('#seg button').forEach(b => { const d = b.querySelector('.dot'); if (d) d.classList.toggle('on', !!has[b.dataset.p] && b.dataset.p !== PANE); });
}
function initPanes() {
  $('seg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) openPane(b.dataset.p, true); });
  $('menu').addEventListener('click', e => { const b = e.target.closest('button.mcard'); if (b) openPane(b.dataset.p, true); });
  document.addEventListener('keydown', e => { if (e.altKey && !e.ctrlKey && !e.metaKey && ['1', '2', '3'].indexOf(e.key) >= 0) { e.preventDefault(); if (document.body.dataset.view !== 'home') setView('home'); openPane(['secA', 'secJ', 'secL'][+e.key - 1], true); } });
  ['author', 'org', 'jq', 'list'].forEach(id => $(id).addEventListener('input', updDots));
}

