import type { AppLocale } from '@/constants/appLocale';

/**
 * All user-facing app chrome (not reel lesson content).
 * Every locale must define every key so the UI stays coherent.
 */
export type UiStringKey =
  | 'tab.reels'
  | 'tab.profile'
  | 'tab.progress'
  | 'profile.title'
  | 'profile.subtitle'
  | 'profile.appLanguage'
  | 'profile.appInterface'
  | 'profile.learningLanguage'
  | 'profile.languageMenuHint'
  | 'profile.interfaceHint'
  | 'profile.studyLanguageHint'
  | 'profile.change'
  | 'profile.done'
  | 'profile.linkSettings'
  | 'about.navTitle'
  | 'about.title'
  | 'about.body'
  | 'feed.aboutA11y'
  | 'feed.loadError'
  | 'reel.follow'
  | 'reel.share'
  | 'reel.save'
  | 'reel.practice'
  | 'reel.practiceA11y'
  | 'reel.muteA11y'
  | 'reel.unmuteA11y'
  | 'translate.title'
  | 'translate.save'
  | 'translate.saved'
  | 'translate.close'
  | 'translate.glossUnknown'
  | 'translate.wordStateHint'
  | 'wordState.know'
  | 'wordState.practiceMore'
  | 'wordState.showLess'
  | 'drill.title'
  | 'drill.clozeHint'
  | 'drill.pickHint'
  | 'drill.shadowHint'
  | 'drill.check'
  | 'drill.correct'
  | 'drill.incorrect'
  | 'drill.skip'
  | 'drill.done'
  | 'drill.clozePlaceholder'
  | 'progress.title'
  | 'progress.subtitle'
  | 'progress.last90'
  | 'progress.fluency'
  | 'progress.savedPhrases'
  | 'progress.drills'
  | 'progress.streak'
  | 'progress.demoDisclaimer'
  | 'settings.navTitle'
  | 'settings.knotTitle'
  | 'settings.knotSubtitle'
  | 'settings.knotCta'
  | 'settings.knotClientMissing'
  | 'settings.knotSessionMissing'
  | 'settings.knotOpen'
  | 'settings.knotDocs'
  | 'settings.languageSpend'
  | 'settings.cardExpiry'
  | 'settings.oneTap'
  | 'settings.mockDisclaimer'
  | 'settings.back'
  | 'settings.knotStubHint'
  | 'tutor.title'
  | 'tutor.body'
  | 'tutor.close'
  | 'level.beginner'
  | 'level.intermediate'
  | 'level.advanced'
  | 'share.lead'
  | 'notFound.title'
  | 'notFound.message'
  | 'notFound.link'
  | 'reel.streakStart'
  | 'reel.quizSoon'
  | 'drill.next'
  | 'drill.notQuite'
  | 'drill.correctAnswerIs'
  | 'drill.pointsPlus'
  | 'drill.tryOnceMore'
  | 'milestone.streak7'
  | 'milestone.points50'
  | 'milestone.keepGoing'
  | 'milestone.tapDismiss'
  | 'dictionary.title'
  | 'dictionary.subtitle'
  | 'dictionary.sectionReels'
  | 'dictionary.sectionSaved'
  | 'dictionary.emptyAll'
  | 'dictionary.metaReels';

const EN: Record<UiStringKey, string> = {
  'tab.reels': 'Reels',
  'tab.profile': 'Profile',
  'tab.progress': 'Progress',
  'profile.title': 'You',
  'profile.subtitle':
    'Learning streak, saved reels, and language goals will live here.',
  'profile.appLanguage': 'App language',
  'profile.appInterface': 'Interface language',
  'profile.learningLanguage': "I'm learning",
  'profile.languageMenuHint':
    'Shorts search uses your study language — pull to refresh on the feed after changing.',
  'profile.interfaceHint': 'Choose how menus, tabs, and buttons are labeled.',
  'profile.studyLanguageHint': 'Shorts and lesson metadata use this target language.',
  'profile.change': 'Choose',
  'profile.done': 'Done',
  'profile.linkSettings': 'Subscription & payments',
  'about.navTitle': 'About',
  'about.title': 'Lingua',
  'about.body':
    'Short-form language reels: swipe through clips with captions and translations. Set EXPO_PUBLIC_REELS_URL to a JSON catalog (see lib/reelsSource.ts), or edit constants/mockReels.ts. Optional: scripts/pexels-draft.mjs drafts video URLs from Pexels — add transcripts by hand. Like and share use local storage and the system share sheet (web copies to clipboard).',
  'feed.aboutA11y': 'About this app',
  'feed.loadError': 'Could not load reels',
  'reel.follow': 'Follow',
  'reel.share': 'Share',
  'reel.save': 'Save',
  'reel.practice': 'Practice',
  'reel.practiceA11y': 'Open practice drill for this reel',
  'reel.muteA11y': 'Mute',
  'reel.unmuteA11y': 'Unmute',
  'translate.title': 'Tap to translate',
  'translate.save': 'Save phrase',
  'translate.saved': 'Saved',
  'translate.close': 'Close',
  'translate.glossUnknown': '(tap to save & review)',
  'translate.wordStateHint': 'How well do you know this?',
  'wordState.know': 'Know it',
  'wordState.practiceMore': 'Practice more',
  'wordState.showLess': 'Show less like this',
  'drill.title': 'Quick drill',
  'drill.clozeHint': 'Fill in the missing word.',
  'drill.pickHint': 'Pick the best English match.',
  'drill.shadowHint': 'Read the line aloud, then tap Done.',
  'drill.check': 'Check',
  'drill.correct': 'Nice!',
  'drill.incorrect': 'Try another option.',
  'drill.skip': 'Skip',
  'drill.done': 'Done',
  'drill.clozePlaceholder': 'Type the word',
  'progress.title': 'Your progress',
  'progress.subtitle': 'Local demo metrics — not a clinical assessment.',
  'progress.last90': 'Last 90 days',
  'progress.fluency': 'Fluency index (demo)',
  'progress.savedPhrases': 'Saved phrases',
  'progress.drills': 'Drills completed',
  'progress.streak': 'Day streak',
  'progress.demoDisclaimer':
    'Chart is illustrative; values come from taps and drills on this device only.',
  'settings.navTitle': 'Payments',
  'settings.knotTitle': 'Keep your subscription healthy',
  'settings.knotSubtitle':
    'Link a card to update billing without leaving Lingua (demo via Knot).',
  'settings.knotCta': 'Link payment methods',
  'settings.knotClientMissing': 'Set EXPO_PUBLIC_KNOT_CLIENT_ID in env.',
  'settings.knotSessionMissing':
    'Paste a Knot session id from your backend (see ARCHITECTURE.md).',
  'settings.knotOpen': 'Open Knot',
  'settings.knotDocs': 'Knot Web SDK docs',
  'settings.languageSpend': 'Language spend this year (demo)',
  'settings.cardExpiry': 'Card expiry guard (requires link)',
  'settings.oneTap': 'One-tap update (Knot)',
  'settings.mockDisclaimer': 'Numbers are static until a card is linked.',
  'settings.back': 'Back',
  'settings.knotStubHint':
    'Dev: create a session server-side, paste the session id below, then open.',
  'tutor.title': 'Practice with tutor',
  'tutor.body':
    'Live video tutors and streaming STT/LLM routing are planned — see ARCHITECTURE.md.',
  'tutor.close': 'Close',
  'level.beginner': 'Beginner',
  'level.intermediate': 'Intermediate',
  'level.advanced': 'Advanced',
  'share.lead': 'Lingua —',
  'notFound.title': 'Oops!',
  'notFound.message': 'This screen does not exist.',
  'notFound.link': 'Go to home',
  'reel.streakStart': 'Start your streak!',
  'reel.quizSoon': 'Quiz soon…',
  'drill.next': 'Next',
  'drill.notQuite': 'Not quite.',
  'drill.correctAnswerIs': 'The correct answer is:',
  'drill.pointsPlus': '+10 pts',
  'drill.tryOnceMore': 'Try once more!',
  'milestone.streak7': '7-day streak!',
  'milestone.points50': '50 points!',
  'milestone.keepGoing': 'Keep it going!',
  'milestone.tapDismiss': 'Tap to continue',
  'dictionary.title': 'Dictionary',
  'dictionary.subtitle':
    'Words from captions on reels you watch, plus phrases you save when translating.',
  'dictionary.sectionReels': 'From reels',
  'dictionary.sectionSaved': 'Saved phrases',
  'dictionary.emptyAll':
    'Watch reels on the Feed tab — words from captions collect here automatically. Tap a word on a reel to save a phrase.',
  'dictionary.metaReels': 'Seen in {{count}} reels',
};

const ES: Record<UiStringKey, string> = {
  'tab.reels': 'Reels',
  'tab.profile': 'Perfil',
  'tab.progress': 'Progreso',
  'profile.title': 'Tú',
  'profile.subtitle':
    'Aquí aparecerán racha de estudio, reels guardados y metas de idioma.',
  'profile.appLanguage': 'Idioma de la app',
  'profile.appInterface': 'Idioma de la interfaz',
  'profile.learningLanguage': 'Estoy aprendiendo',
  'profile.languageMenuHint':
    'La búsqueda de Shorts usa tu idioma de estudio; desliza hacia abajo en el feed para actualizar.',
  'profile.interfaceHint': 'Elige cómo se muestran menús y botones.',
  'profile.studyLanguageHint': 'Los Shorts y textos de lección usan este idioma.',
  'profile.change': 'Elegir',
  'profile.done': 'Listo',
  'profile.linkSettings': 'Suscripción y pagos',
  'about.navTitle': 'Acerca de',
  'about.title': 'Lingua',
  'about.body':
    'Reels cortos de idiomas: desliza clips con subtítulos y traducciones. Configura EXPO_PUBLIC_REELS_URL con un catálogo JSON (ver lib/reelsSource.ts) o edita constants/mockReels.ts. Opcional: scripts/pexels-draft.mjs genera URLs de vídeo desde Pexels; añade transcripciones a mano. Me gusta y compartir usan almacenamiento local y la hoja de compartir del sistema (en web se copia al portapapeles).',
  'feed.aboutA11y': 'Acerca de esta app',
  'feed.loadError': 'No se pudieron cargar los reels',
  'reel.follow': 'Seguir',
  'reel.share': 'Compartir',
  'reel.save': 'Guardar',
  'reel.practice': 'Practicar',
  'reel.practiceA11y': 'Abrir ejercicio rápido para este reel',
  'reel.muteA11y': 'Silenciar',
  'reel.unmuteA11y': 'Activar sonido',
  'translate.title': 'Toca para traducir',
  'translate.save': 'Guardar frase',
  'translate.saved': 'Guardado',
  'translate.close': 'Cerrar',
  'translate.glossUnknown': '(toca para guardar y repasar)',
  'translate.wordStateHint': '¿Qué tan bien la conoces?',
  'wordState.know': 'La domino',
  'wordState.practiceMore': 'Practicar más',
  'wordState.showLess': 'Menos como esto',
  'drill.title': 'Ejercicio rápido',
  'drill.clozeHint': 'Completa la palabra que falta.',
  'drill.pickHint': 'Elige la mejor opción en inglés.',
  'drill.shadowHint': 'Lee la frase en voz alta y pulsa Listo.',
  'drill.check': 'Comprobar',
  'drill.correct': '¡Genial!',
  'drill.incorrect': 'Prueba otra opción.',
  'drill.skip': 'Omitir',
  'drill.done': 'Listo',
  'drill.clozePlaceholder': 'Escribe la palabra',
  'progress.title': 'Tu progreso',
  'progress.subtitle': 'Métricas demo locales — no es una evaluación clínica.',
  'progress.last90': 'Últimos 90 días',
  'progress.fluency': 'Índice de fluidez (demo)',
  'progress.savedPhrases': 'Frases guardadas',
  'progress.drills': 'Ejercicios hechos',
  'progress.streak': 'Racha de días',
  'progress.demoDisclaimer':
    'La gráfica es ilustrativa; los valores vienen solo de este dispositivo.',
  'settings.navTitle': 'Pagos',
  'settings.knotTitle': 'Mantén tu suscripción en orden',
  'settings.knotSubtitle':
    'Vincula una tarjeta para actualizar el cobro sin salir de Lingua (demo con Knot).',
  'settings.knotCta': 'Vincular métodos de pago',
  'settings.knotClientMissing': 'Configura EXPO_PUBLIC_KNOT_CLIENT_ID en el entorno.',
  'settings.knotSessionMissing':
    'Pega un session id de Knot desde tu backend (ver ARCHITECTURE.md).',
  'settings.knotOpen': 'Abrir Knot',
  'settings.knotDocs': 'Documentación del SDK web de Knot',
  'settings.languageSpend': 'Gasto en idiomas este año (demo)',
  'settings.cardExpiry': 'Alerta de caducidad (requiere enlace)',
  'settings.oneTap': 'Actualización en un toque (Knot)',
  'settings.mockDisclaimer': 'Los números son estáticos hasta vincular una tarjeta.',
  'settings.back': 'Atrás',
  'settings.knotStubHint':
    'Dev: crea la sesión en el servidor, pega el session id abajo y abre.',
  'tutor.title': 'Practicar con tutor',
  'tutor.body':
    'Tutores en vídeo y enrutado STT/LLM en streaming están planeados — ver ARCHITECTURE.md.',
  'tutor.close': 'Cerrar',
  'level.beginner': 'Principiante',
  'level.intermediate': 'Intermedio',
  'level.advanced': 'Avanzado',
  'share.lead': 'Lingua —',
  'notFound.title': '¡Ups!',
  'notFound.message': 'Esta pantalla no existe.',
  'notFound.link': 'Ir al inicio',
  'reel.streakStart': '¡Empieza tu racha!',
  'reel.quizSoon': 'Quiz pronto…',
  'drill.next': 'Siguiente',
  'drill.notQuite': 'Casi.',
  'drill.correctAnswerIs': 'La respuesta correcta es:',
  'drill.pointsPlus': '+10 pts',
  'drill.tryOnceMore': '¡Inténtalo una vez más!',
  'milestone.streak7': '¡Racha de 7 días!',
  'milestone.points50': '¡50 puntos!',
  'milestone.keepGoing': '¡Sigue así!',
  'milestone.tapDismiss': 'Toca para continuar',
  'dictionary.title': 'Diccionario',
  'dictionary.subtitle':
    'Palabras de los subtítulos de los reels que ves, más frases que guardas al traducir.',
  'dictionary.sectionReels': 'De los reels',
  'dictionary.sectionSaved': 'Frases guardadas',
  'dictionary.emptyAll':
    'Mira reels en la pestaña Feed: las palabras de los subtítulos se guardan solas. Toca una palabra en un reel para guardar una frase.',
  'dictionary.metaReels': 'Visto en {{count}} reels',
};

const FR: Record<UiStringKey, string> = {
  'tab.reels': 'Reels',
  'tab.profile': 'Profil',
  'tab.progress': 'Progrès',
  'profile.title': 'Vous',
  'profile.subtitle':
    'Série d’étude, reels enregistrés et objectifs linguistiques seront ici.',
  'profile.appLanguage': 'Langue de l’app',
  'profile.appInterface': 'Langue de l’interface',
  'profile.learningLanguage': "J'apprends",
  'profile.languageMenuHint':
    'La recherche Shorts suit ta langue d’étude — tire pour rafraîchir le fil après un changement.',
  'profile.interfaceHint': 'Choisis la langue des menus et boutons.',
  'profile.studyLanguageHint': 'Les Shorts et textes suivent cette langue cible.',
  'profile.change': 'Choisir',
  'profile.done': 'OK',
  'profile.linkSettings': 'Abonnement et paiements',
  'about.navTitle': 'À propos',
  'about.title': 'Lingua',
  'about.body':
    'Reels de langue courts : faites défiler des clips avec sous-titres et traductions. Définissez EXPO_PUBLIC_REELS_URL vers un catalogue JSON (voir lib/reelsSource.ts), ou modifiez constants/mockReels.ts. Optionnel : scripts/pexels-draft.mjs prépare des URLs vidéo depuis Pexels — ajoutez les transcriptions à la main. J’aime et partager utilisent le stockage local et la feuille de partage système (sur le web, copie dans le presse-papiers).',
  'feed.aboutA11y': 'À propos de cette app',
  'feed.loadError': 'Impossible de charger les reels',
  'reel.follow': 'Suivre',
  'reel.share': 'Partager',
  'reel.save': 'Enregistrer',
  'reel.practice': 'S’entraîner',
  'reel.practiceA11y': 'Ouvrir un mini-exercice pour ce reel',
  'reel.muteA11y': 'Couper le son',
  'reel.unmuteA11y': 'Activer le son',
  'translate.title': 'Appuyer pour traduire',
  'translate.save': 'Enregistrer la phrase',
  'translate.saved': 'Enregistré',
  'translate.close': 'Fermer',
  'translate.glossUnknown': '(appuyer pour enregistrer et réviser)',
  'translate.wordStateHint': 'À quel point la maîtrisez-vous ?',
  'wordState.know': 'Je la sais',
  'wordState.practiceMore': 'À pratiquer',
  'wordState.showLess': 'Moins de contenus comme ça',
  'drill.title': 'Mini-exercice',
  'drill.clozeHint': 'Complétez le mot manquant.',
  'drill.pickHint': 'Choisissez la meilleure traduction en anglais.',
  'drill.shadowHint': 'Lisez la phrase à voix haute, puis Terminé.',
  'drill.check': 'Vérifier',
  'drill.correct': 'Bravo !',
  'drill.incorrect': 'Essayez une autre option.',
  'drill.skip': 'Passer',
  'drill.done': 'Terminé',
  'drill.clozePlaceholder': 'Tapez le mot',
  'progress.title': 'Votre progression',
  'progress.subtitle': 'Indicateurs locaux de démo — pas un bilan clinique.',
  'progress.last90': '90 derniers jours',
  'progress.fluency': 'Indice de fluidité (démo)',
  'progress.savedPhrases': 'Phrases enregistrées',
  'progress.drills': 'Exercices terminés',
  'progress.streak': 'Série de jours',
  'progress.demoDisclaimer':
    'Le graphique est illustratif ; les valeurs viennent uniquement de cet appareil.',
  'settings.navTitle': 'Paiements',
  'settings.knotTitle': 'Gardez votre abonnement en bonne santé',
  'settings.knotSubtitle':
    'Liez une carte pour mettre à jour la facturation sans quitter Lingua (démo Knot).',
  'settings.knotCta': 'Lier des moyens de paiement',
  'settings.knotClientMissing': 'Définissez EXPO_PUBLIC_KNOT_CLIENT_ID dans l’environnement.',
  'settings.knotSessionMissing':
    'Collez un session id Knot depuis votre backend (voir ARCHITECTURE.md).',
  'settings.knotOpen': 'Ouvrir Knot',
  'settings.knotDocs': 'Documentation SDK Web Knot',
  'settings.languageSpend': 'Dépenses langues cette année (démo)',
  'settings.cardExpiry': 'Alerte d’expiration (nécessite liaison)',
  'settings.oneTap': 'Mise à jour en un geste (Knot)',
  'settings.mockDisclaimer': 'Les chiffres sont statiques tant qu’aucune carte n’est liée.',
  'settings.back': 'Retour',
  'settings.knotStubHint':
    'Dev : créez la session côté serveur, collez le session id ci-dessous, puis ouvrez.',
  'tutor.title': 'S’entraîner avec un tuteur',
  'tutor.body':
    'Tuteurs vidéo et routage STT/LLM en flux sont prévus — voir ARCHITECTURE.md.',
  'tutor.close': 'Fermer',
  'level.beginner': 'Débutant',
  'level.intermediate': 'Intermédiaire',
  'level.advanced': 'Avancé',
  'share.lead': 'Lingua —',
  'notFound.title': 'Oups !',
  'notFound.message': 'Cet écran n’existe pas.',
  'notFound.link': "Retour à l’accueil",
  'reel.streakStart': 'Commence ta série !',
  'reel.quizSoon': 'Quiz bientôt…',
  'drill.next': 'Suivant',
  'drill.notQuite': 'Pas tout à fait.',
  'drill.correctAnswerIs': 'La bonne réponse est :',
  'drill.pointsPlus': '+10 pts',
  'drill.tryOnceMore': 'Réessaie une fois !',
  'milestone.streak7': 'Série de 7 jours !',
  'milestone.points50': '50 points !',
  'milestone.keepGoing': 'Continue comme ça !',
  'milestone.tapDismiss': 'Touchez pour continuer',
  'dictionary.title': 'Dictionnaire',
  'dictionary.subtitle':
    'Mots des sous-titres des reels que vous regardez, plus les phrases enregistrées lors de la traduction.',
  'dictionary.sectionReels': 'Issus des reels',
  'dictionary.sectionSaved': 'Phrases enregistrées',
  'dictionary.emptyAll':
    'Regardez des reels dans l’onglet Fil — les mots des sous-titres s’accumulent automatiquement. Touchez un mot sur un reel pour enregistrer une phrase.',
  'dictionary.metaReels': 'Vu dans {{count}} reels',
};

const DE: Record<UiStringKey, string> = {
  'tab.reels': 'Reels',
  'tab.profile': 'Profil',
  'tab.progress': 'Fortschritt',
  'profile.title': 'Du',
  'profile.subtitle':
    'Lernserie, gespeicherte Reels und Sprachziele erscheinen hier.',
  'profile.appLanguage': 'App-Sprache',
  'profile.appInterface': 'Oberflächensprache',
  'profile.learningLanguage': 'Ich lerne',
  'profile.languageMenuHint':
    'Shorts-Suche nutzt deine Lernsprache — Feed nach Änderung nach unten ziehen zum Aktualisieren.',
  'profile.interfaceHint': 'Sprache für Menüs und Schaltflächen wählen.',
  'profile.studyLanguageHint': 'Shorts und Lektionen nutzen diese Zielsprache.',
  'profile.change': 'Wählen',
  'profile.done': 'Fertig',
  'profile.linkSettings': 'Abo & Zahlungen',
  'about.navTitle': 'Info',
  'about.title': 'Lingua',
  'about.body':
    'Kurze Sprach-Reels: Wische durch Clips mit Untertiteln und Übersetzungen. Setze EXPO_PUBLIC_REELS_URL auf einen JSON-Katalog (siehe lib/reelsSource.ts) oder bearbeite constants/mockReels.ts. Optional: scripts/pexels-draft.mjs erzeugt Video-URLs von Pexels — Transkripte ergänzt du manuell. Like und Teilen nutzen lokalen Speicher und das System-Teilen (Web: in die Zwischenablage).',
  'feed.aboutA11y': 'Über diese App',
  'feed.loadError': 'Reels konnten nicht geladen werden',
  'reel.follow': 'Folgen',
  'reel.share': 'Teilen',
  'reel.save': 'Speichern',
  'reel.practice': 'Üben',
  'reel.practiceA11y': 'Kurzübung für dieses Reel öffnen',
  'reel.muteA11y': 'Stummschalten',
  'reel.unmuteA11y': 'Ton an',
  'translate.title': 'Tippen zum Übersetzen',
  'translate.save': 'Phrase speichern',
  'translate.saved': 'Gespeichert',
  'translate.close': 'Schließen',
  'translate.glossUnknown': '(tippen zum Speichern & Wiederholen)',
  'translate.wordStateHint': 'Wie gut kennst du das?',
  'wordState.know': 'Kenne ich',
  'wordState.practiceMore': 'Mehr üben',
  'wordState.showLess': 'Weniger davon',
  'drill.title': 'Kurzübung',
  'drill.clozeHint': 'Ergänze das fehlende Wort.',
  'drill.pickHint': 'Wähle die beste englische Entsprechung.',
  'drill.shadowHint': 'Lies die Zeile laut vor, dann Fertig.',
  'drill.check': 'Prüfen',
  'drill.correct': 'Super!',
  'drill.incorrect': 'Versuch eine andere Option.',
  'drill.skip': 'Überspringen',
  'drill.done': 'Fertig',
  'drill.clozePlaceholder': 'Wort eingeben',
  'progress.title': 'Dein Fortschritt',
  'progress.subtitle': 'Lokale Demo-Kennzahlen — keine klinische Bewertung.',
  'progress.last90': 'Letzte 90 Tage',
  'progress.fluency': 'Flüssigkeitsindex (Demo)',
  'progress.savedPhrases': 'Gespeicherte Phrasen',
  'progress.drills': 'Übungen abgeschlossen',
  'progress.streak': 'Tages-Serie',
  'progress.demoDisclaimer':
    'Diagramm ist illustrativ; Werte stammen nur von diesem Gerät.',
  'settings.navTitle': 'Zahlungen',
  'settings.knotTitle': 'Halte dein Abo gesund',
  'settings.knotSubtitle':
    'Karte verknüpfen, um Abrechnung ohne Lingua zu verlassen (Demo via Knot).',
  'settings.knotCta': 'Zahlungsmethoden verknüpfen',
  'settings.knotClientMissing': 'Setze EXPO_PUBLIC_KNOT_CLIENT_ID in der Umgebung.',
  'settings.knotSessionMissing':
    'Füge eine Knot-Session-ID vom Backend ein (siehe ARCHITECTURE.md).',
  'settings.knotOpen': 'Knot öffnen',
  'settings.knotDocs': 'Knot Web SDK Dokumentation',
  'settings.languageSpend': 'Sprachausgaben dieses Jahr (Demo)',
  'settings.cardExpiry': 'Ablaufwarnung (benötigt Verknüpfung)',
  'settings.oneTap': 'Ein-Tap-Update (Knot)',
  'settings.mockDisclaimer': 'Zahlen sind statisch, bis eine Karte verknüpft ist.',
  'settings.back': 'Zurück',
  'settings.knotStubHint':
    'Dev: Session serverseitig erstellen, Session-ID unten einfügen, dann öffnen.',
  'tutor.title': 'Mit Tutor üben',
  'tutor.body':
    'Live-Video-Tutoren und Streaming-STT/LLM-Routing sind geplant — siehe ARCHITECTURE.md.',
  'tutor.close': 'Schließen',
  'level.beginner': 'Anfänger',
  'level.intermediate': 'Mittelstufe',
  'level.advanced': 'Fortgeschritten',
  'share.lead': 'Lingua —',
  'notFound.title': 'Hoppla!',
  'notFound.message': 'Dieser Bildschirm existiert nicht.',
  'notFound.link': 'Zur Startseite',
  'reel.streakStart': 'Starte deine Serie!',
  'reel.quizSoon': 'Quiz bald…',
  'drill.next': 'Weiter',
  'drill.notQuite': 'Nicht ganz.',
  'drill.correctAnswerIs': 'Die richtige Antwort ist:',
  'drill.pointsPlus': '+10 Pkt.',
  'drill.tryOnceMore': 'Noch ein Versuch!',
  'milestone.streak7': '7-Tage-Serie!',
  'milestone.points50': '50 Punkte!',
  'milestone.keepGoing': 'Weiter so!',
  'milestone.tapDismiss': 'Tippen zum Fortfahren',
  'dictionary.title': 'Wörterbuch',
  'dictionary.subtitle':
    'Wörter aus Untertiteln der Reels, die du siehst, plus gespeicherte Sätze beim Übersetzen.',
  'dictionary.sectionReels': 'Aus Reels',
  'dictionary.sectionSaved': 'Gespeicherte Sätze',
  'dictionary.emptyAll':
    'Schau Reels im Feed — Wörter aus den Untertiteln sammeln sich automatisch. Tippe auf ein Wort im Reel, um eine Phrase zu speichern.',
  'dictionary.metaReels': 'In {{count}} Reels gesehen',
};

const JA: Record<UiStringKey, string> = {
  'tab.reels': 'リール',
  'tab.profile': 'プロフィール',
  'tab.progress': '進捗',
  'profile.title': 'あなた',
  'profile.subtitle':
    '学習ストリーク、保存したリール、言語目標はここに表示されます。',
  'profile.appLanguage': 'アプリの言語',
  'profile.appInterface': '表示言語',
  'profile.learningLanguage': '学習中の言語',
  'profile.languageMenuHint':
    'ショートの検索に学習言語を使います。変更後はフィードで下に引いて更新してください。',
  'profile.interfaceHint': 'メニューやボタンの表示言語を選びます。',
  'profile.studyLanguageHint': 'ショートと教材の言語に使います。',
  'profile.change': '選ぶ',
  'profile.done': '完了',
  'profile.linkSettings': 'サブスクと支払い',
  'about.navTitle': '情報',
  'about.title': 'Lingua',
  'about.body':
    '短い言語リール：キャプションと訳付きのクリップを縦にスワイプ。EXPO_PUBLIC_REELS_URL に JSON カタログを指定（lib/reelsSource.ts）するか、constants/mockReels.ts を編集。任意：scripts/pexels-draft.mjs で Pexels の動画 URL を下書きし、トランスクリプトは手で追加。いいねと共有はローカル保存と OS の共有シートを使用（Web はクリップボードへコピー）。',
  'feed.aboutA11y': 'このアプリについて',
  'feed.loadError': 'リールを読み込めませんでした',
  'reel.follow': 'フォロー',
  'reel.share': '共有',
  'reel.save': '保存',
  'reel.practice': '練習',
  'reel.practiceA11y': 'このリールのミニドリルを開く',
  'reel.muteA11y': 'ミュート',
  'reel.unmuteA11y': 'ミュート解除',
  'translate.title': 'タップして翻訳',
  'translate.save': 'フレーズを保存',
  'translate.saved': '保存済み',
  'translate.close': '閉じる',
  'translate.glossUnknown': '（タップして保存・復習）',
  'translate.wordStateHint': 'どのくらい知っていますか？',
  'wordState.know': '知っている',
  'wordState.practiceMore': 'もっと練習',
  'wordState.showLess': 'こういうのを減らす',
  'drill.title': 'ミニドリル',
  'drill.clozeHint': '欠けた単語を入れてください。',
  'drill.pickHint': '一番近い英語を選んでください。',
  'drill.shadowHint': '声に出して読み、完了をタップ。',
  'drill.check': '確認',
  'drill.correct': 'いいね！',
  'drill.incorrect': '別の選択肢を試してください。',
  'drill.skip': 'スキップ',
  'drill.done': '完了',
  'drill.clozePlaceholder': '単語を入力',
  'progress.title': 'あなたの進捗',
  'progress.subtitle': '端末内のデモ指標です（診断ではありません）。',
  'progress.last90': '過去90日',
  'progress.fluency': '流暢さインデックス（デモ）',
  'progress.savedPhrases': '保存したフレーズ',
  'progress.drills': '完了したドリル',
  'progress.streak': '連続日数',
  'progress.demoDisclaimer':
    'グラフはイメージです。値はこの端末の操作のみから算出されます。',
  'settings.navTitle': '支払い',
  'settings.knotTitle': 'サブスクを健全に保つ',
  'settings.knotSubtitle':
    'カードを連携して請求を更新（Knot のデモ。アプリを離れずに）。',
  'settings.knotCta': '支払い方法を連携',
  'settings.knotClientMissing': '環境変数に EXPO_PUBLIC_KNOT_CLIENT_ID を設定してください。',
  'settings.knotSessionMissing':
    'バックエンドで発行した Knot のセッション ID を貼り付け（ARCHITECTURE.md 参照）。',
  'settings.knotOpen': 'Knot を開く',
  'settings.knotDocs': 'Knot Web SDK ドキュメント',
  'settings.languageSpend': '今年の語学学習支出（デモ）',
  'settings.cardExpiry': 'カード期限アラート（連携が必要）',
  'settings.oneTap': 'ワンタップ更新（Knot）',
  'settings.mockDisclaimer': 'カード連携までは数値は固定のデモです。',
  'settings.back': '戻る',
  'settings.knotStubHint':
    '開発用：サーバーでセッションを作成し、下にセッション ID を貼ってから開く。',
  'tutor.title': 'チューターと練習',
  'tutor.body':
    'ライブ動画チューターや STT/LLM のストリーミングは計画中です（ARCHITECTURE.md）。',
  'tutor.close': '閉じる',
  'level.beginner': '初級',
  'level.intermediate': '中級',
  'level.advanced': '上級',
  'share.lead': 'Lingua —',
  'notFound.title': 'おっと',
  'notFound.message': 'この画面は存在しません。',
  'notFound.link': 'ホームへ',
  'reel.streakStart': 'ストリークを始めよう！',
  'reel.quizSoon': 'まもなくクイズ…',
  'drill.next': '次へ',
  'drill.notQuite': '惜しい！',
  'drill.correctAnswerIs': '正解は:',
  'drill.pointsPlus': '+10 pt',
  'drill.tryOnceMore': 'もう一度！',
  'milestone.streak7': '7日連続！',
  'milestone.points50': '50ポイント！',
  'milestone.keepGoing': 'その調子！',
  'milestone.tapDismiss': 'タップで続ける',
  'dictionary.title': '辞書',
  'dictionary.subtitle':
    '視聴したリールの字幕から拾った単語と、翻訳で保存したフレーズ。',
  'dictionary.sectionReels': 'リールから',
  'dictionary.sectionSaved': '保存したフレーズ',
  'dictionary.emptyAll':
    'フィードでリールを見ると、字幕の単語が自動でここにたまります。リール上の単語をタップしてフレーズを保存できます。',
  'dictionary.metaReels': '{{count}} 本のリールで登場',
};

const PT: Record<UiStringKey, string> = { ...EN };
const KO: Record<UiStringKey, string> = { ...EN };
const ZH: Record<UiStringKey, string> = { ...EN };
const IT: Record<UiStringKey, string> = { ...EN };
const RU: Record<UiStringKey, string> = { ...EN };
const HI: Record<UiStringKey, string> = { ...EN };

const BY_LOCALE: Record<AppLocale, Record<UiStringKey, string>> = {
  en: EN,
  es: ES,
  fr: FR,
  de: DE,
  ja: JA,
  pt: PT,
  ko: KO,
  zh: ZH,
  it: IT,
  ru: RU,
  hi: HI,
};

export function getUiString(locale: AppLocale, key: UiStringKey): string {
  return BY_LOCALE[locale]?.[key] ?? EN[key];
}

export function levelLabel(locale: AppLocale, level: 1 | 2 | 3): string {
  const k =
    level === 1
      ? 'level.beginner'
      : level === 2
        ? 'level.intermediate'
        : 'level.advanced';
  return getUiString(locale, k);
}
