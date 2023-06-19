import images from '../assets/images';
import strings from '../i18n/strings';
import {StackNav} from '../navigation/NavigationKeys';

/* Users DB */
const userAccounts = [
  {
    id: 1,
    email: 'user@brita.ai',
    password: 'Brita1234,',
    level: 'user',
  },
  {
    id: 2,
    email: 'admin@brita.ai',
    password: 'Brita1234,',
    level: 'admin',
  },
  {
    id: 3,
    email: 'master@brita.ai',
    password: 'Brita1234,',
    level: 'master',
  },
];

/* List of interests */
const interestsList = [
  'Tecnología',
  'Inteligencia artificial',
  'Literatura',
  'Lingüística',
  'Juegos',
  'Animales',
  'Astronomía',
  'Moda',
  'Economía',
  'Entretenimiento',
  'Cultura',
  'Hogar',
  'Vida cotidiana',
  'Ciencia y educación',
  'Comedia',
  'Comida y bebidas',
  'Vehículos',
  'Anime',
  'Música',
  'Animales',
  'Deportes',
  'Salud',
  'Belleza',
  'Familia',
  'Arte',
  'Motivación',
  'Viajes',
  'DIY'
];

/* posts in the feed */
const postData = [
  {
    id: '1',
    name: 'Ana García',
    subtitle: 'Hace 2 horas',
    profileImage:
      'https://cdn.pixabay.com/photo/2016/03/23/04/01/woman-1274056_1280.jpg',
    text: 'Hoy es un día muy soleado 🌞',
    image: '',
    role: 'CEO de empresa',
    postType: 'text',
  },
  {
    id: '2',
    name: 'Ana García',
    subtitle: 'Hace 2 horas',
    profileImage:
      'https://cdn.pixabay.com/photo/2016/03/23/04/01/woman-1274056_1280.jpg',
    text: 'Emocionada de poder participar en este evento, ¡Muchas gracias!',
    image: [
      'https://cdn.pixabay.com/photo/2017/02/16/12/12/business-woman-2071342_1280.jpg',
    ],
    role: 'CEO de empresa',
    postType: 'image',
  },
  {
    id: '3',
    name: 'Martín López',
    subtitle: 'Hace 3 horas',
    profileImage:
      'https://cdn.pixabay.com/photo/2020/12/13/02/47/retrato-5827082_1280.jpg',
    text: '',
    image: [
      'https://cdn.pixabay.com/photo/2018/03/17/10/51/post-it-notes-3233653_1280.jpg',
      'https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg',
    ],
    role: 'Deep Learning Manager'
  },
  {
    id: '4',
    name: 'Yair Vázquez',
    subtitle: 'Hace 2 horas',
    profileImage:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    text: '',
    image: [
      'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg',
    ],
  },
  {
    id: '5',
    name: 'Martín López',
    subtitle: 'Hace 3 horas',
    profileImage:
      'https://cdn.pixabay.com/photo/2020/12/13/02/47/retrato-5827082_1280.jpg',
    text: '',
    image: [
      'https://cdn.pixabay.com/photo/2018/03/17/10/51/post-it-notes-3233653_1280.jpg',
      'https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg',
    ],
  },
  {
    id: '6',
    name: 'Yair Vázquez',
    subtitle: 'Hace 2 horas',
    profileImage:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    text: '',
    image: [
      'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg',
    ],
  },
  {
    id: '7',
    name: 'Martín López',
    subtitle: 'Hace 3 horas',
    profileImage:
      'https://cdn.pixabay.com/photo/2020/12/13/02/47/retrato-5827082_1280.jpg',
    text: '',
    image: [
      'https://cdn.pixabay.com/photo/2018/03/17/10/51/post-it-notes-3233653_1280.jpg',
      'https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg',
    ],
  },
  {
    id: '8',
    name: 'Yair Vázquez',
    subtitle: 'Hace 2 horas',
    profileImage:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    text: '',
    image: [
      'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg',
    ],
  },
  {
    id: '9',
    name: 'Martín López',
    subtitle: 'Hace 3 horas',
    profileImage:
      'https://cdn.pixabay.com/photo/2020/12/13/02/47/retrato-5827082_1280.jpg',
    text: '',
    image: [
      'https://cdn.pixabay.com/photo/2018/03/17/10/51/post-it-notes-3233653_1280.jpg',
      'https://images.pexels.com/photos/247932/pexels-photo-247932.jpeg',
    ],
  },
];

/* stories in the feed */
const userDetail = [
  {
    id: 1,
    name: 'Martín López',
    description: 'arianacooper | 24.5M followers',
    imgUrl:
      'https://cdn.pixabay.com/photo/2020/12/13/02/47/retrato-5827082_1280.jpg',
    isFollow: false,
  },
  {
    id: 2,
    name: 'Jesús García',
    description: 'johndoe | 10M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fHVzZXIlMjBwcm9maWxlJTIwd2l0aCUyMGJhY2tncm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    id: 3,
    name: 'Trini Hernández',
    description: 'janesmith | 5M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    id: 4,
    name: 'Caty Bonilla',
    description: 'bobjohnson | 2M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    id: 5,
    name: 'Ana García',
    description: 'sarawilson | 1M followers',
    imgUrl:
      'https://cdn.pixabay.com/photo/2016/03/23/04/01/woman-1274056_1280.jpg',
    isFollow: false,
  },
  {
    id: 6,
    name: 'Bryan Melendez',
    description: 'tomwilson | 500K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    id: 7,
    name: 'Yair Vázquez',
    description: 'alicebrown | 250K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    id: 8,
    name: 'Linda Aurora',
    description: 'emilydavis | 100K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    id: 9,
    name: 'Lázaro',
    description: 'marklee | 50K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    id: 10,
    name: 'Laura Hernández',
    description: 'lauralee | 10K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1610737241336-371badac3b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
];

const renderChips = [
  'Acción',
  'Drama',
  'Comedia',
  'Anime',
  'Aventura',
  'Mecha',
  'Romance',
  'Fantasía',
  'Horror',
  'Misterio',
  'Psicología',
  'Sci-Fi',
  'Diversión',
  'Deportes',
  'Thriller',
  'Supernatural',
  'Histórico',
  'Música',
  'Juegos',
  'Harem',
];

const editProfileData = [
  {
    title: 'Sobre ti',
    data: [
      {
        id: 1,
        icon: 'person-outline',
        type: 'Name',
        value: 'Ricardo León',
      },
      {
        id: 2,
        icon: 'mail-outline',
        type: 'Username',
        value: 'ans@gmail.com',
      },
      {
        id: 3,
        icon: 'call-outline',
        type: 'Bio',
        value: 'Designer',
      },
    ],
  },
  {
    title: 'Social',
    data: [
      {
        id: 1,
        icon: 'logo-facebook',
        type: 'Facebook',
        value: 'facebook.com',
      },
      {
        id: 2,
        icon: 'logo-twitter',
        type: 'Twitter',
        value: 'w.twitter.com',
      },
      {
        id: 3,
        icon: 'logo-instagram',
        type: 'Instagram',
        value: 'htinstagram.com',
      },
    ],
  },
];

const manageAccData = [
  {
    title: 'Información de cuenta',
    data: [
      {
        id: 1,
        icon: 'call-outline',
        type: 'Número de teléfono',
        value: '+1 111 467 378',
      },
      {
        id: 2,
        icon: 'mail-outline',
        type: 'Email',
        value: 'ans@gmail.com',
      },
      {
        id: 3,
        icon: 'calendar-outline',
        type: 'Fecha de nacimiento',
        value: '12/27/1995',
        rightIcon: 'calendar-outline',
      },
    ],
  },
  {
    title: 'Control de cuenta',
    data: [
      {
        id: 1,
        icon: 'swap-vertical-outline',
        type: 'Switch to Business Account',
      },
      {
        id: 2,
        icon: 'trash-outline',
        type: 'Delete Account',
        trash: true,
      },
    ],
  },
];

const headerCategoryData = [
  {
    id: 1,
    type: 'Toda la actividad',
    icon: 'time-outline',
  },
  {
    id: 2,
    type: 'Me gusta',
    icon: 'heart-outline',
  },
  {
    id: 3,
    type: 'Comentarios',
    icon: 'chatbubble-ellipses-outline',
  },
  {
    id: 4,
    type: 'Q&A',
    icon: 'reader-outline',
  },
  {
    id: 5,
    type: 'Menciones y Tags',
    icon: 'person-outline',
  },
  {
    id: 6,
    type: 'Seguidores',
    icon: 'people-outline',
  },
  {
    id: 7,
    type: 'De Instagram',
    icon: 'alert-circle-outline',
  },
];

const inboxData = [
  {
    title: 'Hoy',
    data: [
      {
        id: 1,
        name: 'Charolette Hanlin',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        follow: 'Follow',
        profileImage: 'https://i.ibb.co/xjLGscf/user1.png',
      },
      {
        id: 2,
        name: 'Annabel Rohan',
        desc: 'Started following you',
        follow: 'Follow Back',
        profileImage: 'https://i.ibb.co/4JhzfZ6/user7.png',
      },
      {
        id: 3,
        name: 'Sanjuanita Ordonez',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        profileImage: 'https://i.ibb.co/CtJMsKk/user3.png',
      },
    ],
  },
  {
    title: 'Ayer',
    data: [
      {
        id: 1,
        name: 'Rayford Chenail Hanlin',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        follow: 'Follow',
        profileImage: 'https://i.ibb.co/9psxy8J/user4.png',
      },
      {
        id: 2,
        name: 'Sanjuanita Rohan',
        desc: 'Started following you',
        profileImage: 'https://i.ibb.co/Z2BtDcm/user5.png',
      },
      {
        id: 3,
        name: 'Annabel Ordonez',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        follow: 'Follow Back',
        profileImage: 'https://i.ibb.co/J3q5m54/user6.png',
      },
    ],
  },
  {
    title: 'La semana pasada',
    data: [
      {
        id: 1,
        name: 'Charolette Hanlin',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        profileImage: 'https://i.ibb.co/N2hx6tN/user2.png',
      },
      {
        id: 2,
        name: 'Annabel Rohan',
        desc: 'Comenzó a seguirte',
        profileImage: 'https://i.ibb.co/CtJMsKk/user3.png',
      },
      {
        id: 3,
        name: 'Sanjuanita Ordonez',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        follow: 'Follow Back',
        profileImage: 'https://i.ibb.co/J3q5m54/user6.png',
      },
    ],
  },
];

const ProfileSetting = [
  {
    id: 1,
    title: strings.editProfile,
    icon: 'person-outline',
    route: StackNav.ManageAccount,
  },
  {
    id: 2,
    title: strings.privacy,
    icon: 'lock-closed-outline',
    route: StackNav.Privacy,
  },
  {
    id: 4,
    title: strings.security,
    icon: 'shield-checkmark-outline',
    route: StackNav.Security,
  },
  {
    id: 4,
    title: strings.qrCode,
    icon: 'scan-outline',
    route: StackNav.QrCode,
  },
  {
    id: 5,
    title: strings.language,
    icon: 'options-outline',
    value: 'English(US)',
    route: StackNav.Language,
  },
  {
    id: 6,
    title: strings.darkMode,
    icon: 'contrast-outline',
    rightIcon: 'rightIcon',
  },
  {
    id: 2,
    title: strings.contentPreferences,
    icon: 'videocam-outline',
  },
  {
    id: 2,
    title: strings.ads,
    icon: 'radio-outline',
  },
  {
    id: 3,
    title: strings.reportProblem,
    icon: 'cloud-download-outline',
  },
  {
    id: 7,
    title: strings.helpCenter,
    icon: 'information-circle-outline',
    route: StackNav.HelpCenter,
  },
  {
    id: 7,
    title: strings.safetyCenter,
    icon: 'checkmark-circle-outline',
  },
  {
    id: 7,
    title: strings.communityGuidelines,
    icon: 'people-outline',
  },
  {
    id: 7,
    title: strings.termsServices,
    icon: 'newspaper-outline',
  },
  {
    id: 8,
    title: strings.privacyPolicy,
    icon: 'alert-circle-outline',
    route: StackNav.PrivacyPolicy,
  },
];

const helperCategoryData = [
  'General',
  'Account',
  'Payment',
  'Subscription',
  'Others',
];

const helperData = [
  {
    title: '¿Qué es Influex?',
    description:
      'Influex is a streaming service that offers a wide variety of anime titles.',
  },
  {
    title: '¿Cómo me registro en Influex?',
    description:
      'You can sign up for Influex by downloading the app from the App Store or Google Play Store.',
  },
  {
    title: '¿Cómo quitar elementos de mi lista de favoritos?',
    description:
      'You can remove anime on your wishlist by clicking the heart icon on the anime details page.',
  },
  {
    title: '¿Cómo me suscribo?',
    description:
      'You can subscribe to premium by clicking the premium button on the home page.',
  },
  {
    title: '¿Cómo puedo descargar imágenes?',
    description:
      'You can download anime by clicking the download icon on the anime details page.',
  },
  {
    title: '¿Cómo dejo de seguir?',
    description:
      'You can unsubscribe from premium by clicking the premium button on the home page.',
  },
];

const contactUsData = [
  {
    id: 1,
    title: 'Contáctanos',
    icon: 'headset',
  },
  {
    id: 2,
    title: 'WhatsApp',
    icon: 'whatsapp',
  },
  {
    id: 3,
    title: 'Website',
    icon: 'google-earth',
  },
  {
    id: 4,
    title: 'Facebook',
    icon: 'facebook',
  },
  {
    id: 5,
    title: 'Instagram',
    icon: 'instagram',
  },
  {
    id: 6,
    title: 'Twitter',
    icon: 'twitter',
  },
];

const languageData = [
  {
    title: 'Suggested',
    data: [{lnName: 'English(US)'}, {lnName: 'English(UK)'}],
  },
  {
    title: 'Language',
    data: [
      {
        lnName: 'English',
      },
      {
        lnName: 'Spanish',
      },
      {
        lnName: 'French',
      },
      {
        lnName: 'German',
      },
      {
        lnName: 'Italian',
      },
      {
        lnName: 'Portuguese',
      },
      {
        lnName: 'Russian',
      },
      {
        lnName: 'Turkish',
      },
      {
        lnName: 'Chinese',
      },
      {
        lnName: 'Japanese',
      },
      {
        lnName: 'Korean',
      },
      {
        lnName: 'Arabic',
      },
      {
        lnName: 'Hindi',
      },
      {
        lnName: 'Indonesian',
      },
      {
        lnName: 'Malay',
      },
      {
        lnName: 'Thai',
      },
    ],
  },
];

const reportData = [
  {
    lnName: 'Organización/individuo peligroso',
  },
  {
    lnName: 'Draude',
  },
  {
    lnName: 'Información falsa',
  },
  {
    lnName: 'Actividades irregulares',
  },
  {
    lnName: 'Contenido gráfico o violento',
  },
  {
    lnName: 'Crueldad animal',
  },
  {
    lnName: 'Pornografía o desnudos',
  },
  {
    lnName: 'Discurso de odio',
  },
  {
    lnName: 'Acoso',
  },
  {
    lnName: 'Propiedad intelectual',
  },
  {
    lnName: 'Spam',
  },
  {
    lnName: 'Seguridad para menores',
  },
  {
    lnName: 'Otros',
  },
];

const privacyPolicyData = [
  {
    title: strings.privacyPolicy1,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy2,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy3,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy2,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy3,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy2,
    description: strings.privacyPolicyDesc,
  },
  {
    title: strings.privacyPolicy3,
    description: strings.privacyPolicyDesc,
  },
];

const messageDataList = [
  {
    id: 1,
    name: 'John Doe',
    message: 'Hola, ¿Cómo estás?',
    time: '12:00',
    imageUrl: 'https://i.ibb.co/xjLGscf/user1.png',
    pending: 2,
  },
  {
    id: 2,
    name: 'Ashley Graham martin',
    message: 'Hola, ¡buenos días!',
    time: '1:20',
    imageUrl: 'https://i.ibb.co/N2hx6tN/user2.png',
    pending: 0,
  },
  {
    id: 3,
    name: 'Leatrice Handler',
    message: 'Jajajaja 🤣🤣🤣',
    time: '2:00',
    imageUrl: 'https://i.ibb.co/CtJMsKk/user3.png',
    pending: 0,
  },
  {
    id: 4,
    name: 'John Doe',
    message: 'Hola, ¿cómo estás?',
    time: '12:00',
    imageUrl: 'https://i.ibb.co/9psxy8J/user4.png',
    pending: 3,
  },
  {
    id: 5,
    name: 'Pedro Huard Jr ',
    message: "Jajajaja no puede ser 😂😂😂",
    time: 'Yesterday',
    imageUrl: 'https://i.ibb.co/Z2BtDcm/user5.png',
    pending: 0,
  },
  {
    id: 5,
    name: 'Kristin Watson',
    message: 'buenas ideas para la próxima 😆',
    time: 'Dec 18, 2024',
    imageUrl: 'https://i.ibb.co/J3q5m54/user6.png',
    pending: 0,
  },
];

const recenltyDataList = [
  {
    id: 1,
    name: 'John Doe',
    imageUrl: 'https://randomuser.me/api/portraits/women/10.jpg',
  },
  {
    id: 2,
    name: 'Ashley Graham martin',
    imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
  {
    id: 3,
    name: 'Leatrice Handler',
    imageUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: 4,
    name: 'John Doe',
    imageUrl: 'https://randomuser.me/api/portraits/women/60.jpg',
  },
  {
    id: 5,
    name: 'Pedro Huard Jr ',
    imageUrl: 'https://randomuser.me/api/portraits/women/55.jpg',
  },
  {
    id: 5,
    name: 'Kristin Watson',
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

const videoData = [
  {
    id: 1,
    channelName: 'Rashmika_Mandanna',
    uri: 'https://user-images.githubusercontent.com/129170600/231968235-a6a60f18-6b50-459d-8c7c-9716d9df0730.mp4',
    caption:
      'Rashmika Mandanna es una actriz y modelo india que trabaja en películas telugu y kannada. Debutó como actriz en la película kannada Cheluvi (2011).',
    musicName: 'Song #1',
    likes: '10.2M',
    comments: '284K',

    bookmark: '120K',
    share: '1.2M',
    categoty: 'Entertainment',
    avatarUri: 'https://wallpaperaccess.com/full/1669289.jpg',
    poster:
      'https://cdn.pixabay.com/photo/2014/11/27/18/14/oil-painting-547989_1280.jpg',
    views: '21.2M',
  },
  {
    id: 2,
    channelName: 'zuzu_fan',
    uri: 'https://user-images.githubusercontent.com/129170600/231968281-f8450cd9-9adf-4002-8e77-947140fc19ec.mp4',
    caption: '#cute #girls #tikto #tiktoapp #tiktofan #tiktofans',
    musicName: 'Song #2',
    likes: '24K',
    comments: '122',
    bookmark: '1K',
    share: '1.2K',
    categoty: 'Sports & Gaming',
    avatarUri: 'https://wallpaperaccess.com/thumb/266770.jpg',
    poster:
      'https://cdn.pixabay.com/photo/2017/10/29/12/19/fantasy-2899611_1280.jpg',
    views: '2.2M',
  },
  {
    id: 3,
    channelName: 'katrinakaif',
    uri: 'https://user-images.githubusercontent.com/129170600/231986154-36c34011-8503-43e5-85e8-d959901e5dbb.mp4',
    caption: 'kat hot dance #katrinakaif #dance #hot #sexy #bollywood #india',
    musicName: 'Song #3',
    likes: '31k',
    comments: '801',
    bookmark: '1.2K',
    share: '110',
    categoty: 'News & Politics',
    avatarUri: 'https://wallpaperaccess.com/thumb/384178.jpg',
    poster:
      'https://cdn.pixabay.com/photo/2017/11/03/10/38/fantasy-2913953_1280.jpg',
    views: '220K',
  },
  {
    id: 4,
    channelName: 'zesu__123',
    uri: 'https://user-images.githubusercontent.com/129170600/231968407-58fecc6f-d637-4bdf-84b2-d3ed3315e860.mp4',
    poster:
      'https://user-images.githubusercontent.com/129170600/231969921-72e1dcb1-4af6-41b9-a824-3e6b9213e872.jpeg',
    caption:
      'Zesu...... #hot #hollywood #sexy #girls #tikto #tiktoapp #tiktofan #tiktofans',
    musicName: 'Song #4',
    likes: '432K',
    comments: '284',
    bookmark: '12K',
    share: '13K',
    categoty: 'Style & Fashion',
    avatarUri: 'https://wallpaperaccess.com/full/1669289.jpg',
    views: '510K',
  },
  {
    id: 5,
    channelName: 'tikto_fan',
    uri: 'https://user-images.githubusercontent.com/129170600/231968526-134bb620-a821-43aa-b801-5bfa5769fad2.mp4',
    poster:
      'https://user-images.githubusercontent.com/129170600/231969994-09ab3ca2-90c7-484e-bf91-1208f3d47ff0.jpeg',
    caption: 'Hotty and cute #tikto #tiktoapp #tiktofan #tiktofans',
    musicName: 'Song #5',
    likes: '241K',
    comments: '12K',

    bookmark: '2.3K',
    share: '145',
    categoty: 'Nature & Travel',
    avatarUri: 'https://wallpaperaccess.com/thumb/266770.jpg',
    views: '7.8M',
  },
  {
    id: 6,
    channelName: 'anushkasharma',
    uri: 'https://user-images.githubusercontent.com/129170600/231968695-d21acbeb-ff69-4666-b41e-1e0d6e06b1c2.mp4',
    poster:
      'https://user-images.githubusercontent.com/129170600/231970010-773f30db-3977-4276-a8dc-7882b54a111d.jpeg',
    caption: 'Feel the love in the air #anushkasharma #india #bollywood #hot',
    musicName: 'Song #6',
    likes: '310K',
    comments: '81K',

    bookmark: '10K',
    share: '88K',
    categoty: 'Nature & Travel',
    avatarUri: 'https://wallpaperaccess.com/thumb/384178.jpg',
    views: '345K',
  },
  {
    id: 7,
    channelName: 'ayodhya_wale',
    uri: 'https://user-images.githubusercontent.com/129170600/231969136-8e00c8c9-543e-4b73-a70a-5bd882d53678.mp4',
    poster:
      'https://user-images.githubusercontent.com/129170600/231970027-0ee9b05e-52a6-4e77-81ae-5f38af8bf1f4.jpeg',
    caption: 'ram navmi #ramnavmi #ayodhya #ram #ramayana #ramayan #ramji',
    musicName: 'Song #7',
    likes: '321K',
    comments: '28K',

    bookmark: '120K',
    share: '111.2K',
    categoty: 'God & Religion',
    avatarUri: 'https://wallpaperaccess.com/full/1669289.jpg',
    views: '670K',
  },
  {
    id: 8,
    channelName: 'shiddat_ka_safar',
    uri: 'https://user-images.githubusercontent.com/129170600/231969248-f42e5dfd-b156-48f6-a3dc-cdfd12e3623e.mp4',
    poster:
      'https://user-images.githubusercontent.com/129170600/231970045-6a572624-0653-4cfa-a3e4-516daf00f23c.jpeg',
    caption:
      'Love some one #love #Shiddat #tikto #tiktoapp #tiktofan #tiktofans',
    musicName: 'Song #8',
    likes: '241k',
    comments: '15k',

    bookmark: '1.5K',
    share: '1.2K',
    categoty: 'Film & Animation',
    avatarUri: 'https://wallpaperaccess.com/thumb/266770.jpg',
    views: '622K',
  },
  {
    id: 9,
    channelName: 'mahakal_bhakt',
    uri: 'https://user-images.githubusercontent.com/129170600/231969410-f1ecd170-6f48-43b7-9c40-ef9eacd10ef4.mp4',
    poster:
      'https://user-images.githubusercontent.com/129170600/231970060-9ed373d9-bc3f-4f35-a7cb-29c01b69b792.jpeg',
    caption: 'Har har mahadev #mahakal #mahadev #shiv #shivji #shivji #shivji',
    musicName: 'Song #9',
    likes: '782K',
    comments: '80K',

    bookmark: '1.2K',
    share: '2.5K',
    categoty: 'God & Religion',
    avatarUri: 'https://wallpaperaccess.com/thumb/384178.jpg',
    views: '1.4M',
  },
  {
    id: 10,
    channelName: 'gujju_smile',
    uri: 'https://user-images.githubusercontent.com/129170600/231969496-da2cd765-f5f5-46ae-bec6-20b254cc5400.mp4',
    poster:
      'https://user-images.githubusercontent.com/129170600/231970075-8cdf2e42-c345-4a58-83be-5bc4fb9f2376.jpeg',
    caption:
      'Gujju smile #gujju #gujarat #gujarati #gujaratis #gujaratis #gujaratis',
    musicName: 'Song #10',
    likes: '4321',
    comments: '2841',

    bookmark: '12K',
    share: '13K',
    categoty: 'music & Dance',
    avatarUri: 'https://wallpaperaccess.com/full/1669289.jpg',
    views: '110K',
  },
  {
    id: 11,
    channelName: 'nughty_meme',
    uri: 'https://user-images.githubusercontent.com/129170600/231969567-3728e43c-7ac9-421f-a7cd-c511ec71e94e.mp4',
    poster:
      'https://user-images.githubusercontent.com/129170600/231972475-a35385a3-7584-443d-843b-75104af589f6.jpeg',
    caption: 'Nora Fatehi #meme #nughty #nughty_meme #nughty_meme',
    musicName: 'Song #11',
    likes: '321K',
    comments: '28K',

    bookmark: '120K',
    share: '111.2K',
    categoty: 'Film & Animation',
    avatarUri: 'https://wallpaperaccess.com/thumb/266770.jpg',
    views: '1.7M',
  },
];

const userStoryData = [
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231968235-a6a60f18-6b50-459d-8c7c-9716d9df0730.mp4',
    type: 'video',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231968281-f8450cd9-9adf-4002-8e77-947140fc19ec.mp4',
    type: 'video',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231969921-72e1dcb1-4af6-41b9-a824-3e6b9213e872.jpeg',
    type: 'image',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231969994-09ab3ca2-90c7-484e-bf91-1208f3d47ff0.jpeg',
    type: 'image',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231970010-773f30db-3977-4276-a8dc-7882b54a111d.jpeg',
    type: 'image',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231970027-0ee9b05e-52a6-4e77-81ae-5f38af8bf1f4.jpeg',
    type: 'image',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231969248-f42e5dfd-b156-48f6-a3dc-cdfd12e3623e.mp4',
    type: 'video',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231986154-36c34011-8503-43e5-85e8-d959901e5dbb.mp4',
    type: 'video',
    finish: 0,
  },
  {
    content:
      'https://user-images.githubusercontent.com/129170600/231970060-9ed373d9-bc3f-4f35-a7cb-29c01b69b792.jpeg',
    type: 'image',
    finish: 0,
  },
];

const soundTrendingData = [
  {
    id: 1,
    title: 'Favorite Girl',
    artist: 'Justin Bieber',
    imgUrl: 'https://picsum.photos/200/300',
    time: '3:20',
    totalViews: '240M',
    artistUrl: 'https://picsum.photos/200/300',
    artistDesc: 'Justin Drew Bieber es un cantante y escritor canadiense.',
  },
  {
    id: 2,
    title: 'Despacito',
    artist: 'Luis Fonsi',
    imgUrl: 'https://picsum.photos/200/300',
    time: '2:45',
    totalViews: '1.3B',
    artistUrl: 'https://picsum.photos/200/300',
    artistDesc:
      'Luis Fonsi es un cantante, escritor, actor y productor puertorriqueño.',
  },
];

const hashtagTreandingData = [
  {
    id: 1,
    title: 'amazingfood',
    imgUrl: 'https://picsum.photos/200/300',
    totalHashTag: '827.5M',
  },
  {
    id: 2,
    title: 'wonderful',
    imgUrl: 'https://picsum.photos/200/300',
    totalHashTag: '234M',
  },
];

const searchVideoData = [
  {
    id: 1,
    reelImgUrl: 'https://picsum.photos/200/300',
    views: '1.2M',
    userName: 'Sophie Brown',
  },
  {
    id: 2,
    reelImgUrl: 'https://picsum.photos/200/300',
    views: '600K',
    userName: 'Miles Davis',
  },
  {
    id: 3,
    reelImgUrl: 'https://picsum.photos/200/300',
    views: '1M',
    userName: 'Olivia White',
  },
  {
    id: 4,
    reelImgUrl: 'https://picsum.photos/200/300',
    views: '1.2M',
    userName: 'Nathan Parker',
  },
  {
    id: 5,
    reelImgUrl: 'https://picsum.photos/200/300',
    views: '100K',
    userName: 'Avery Martinez',
  },
  {
    id: 6,
    reelImgUrl: 'https://picsum.photos/200/300',
    views: '635K',
    userName: 'Gabriella Foster',
  },
  {
    id: 7,
    reelImgUrl: 'https://picsum.photos/200/300',
    views: '11M',
    userName: 'Benjamin James',
  },
  {
    id: 8,
    reelImgUrl: 'https://picsum.photos/200/300',
    views: '2M',
    userName: 'Aria Lopez',
  },
];

const searchMusicData = [
  {
    id: 1,
    title: 'Favorite Girl',
    artist: 'Justin Bieber',
    imgUrl: 'https://picsum.photos/200/300',
    time: '3:20',
    totalViews: '240M',
    artistUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 2,
    title: 'Beautiful Day',
    artist: 'U2',
    imgUrl: 'https://picsum.photos/200/300',
    time: '4:10',
    totalViews: '150M',
    artistUrl: 'https://picsum.photos/200/300',
  },

  {
    id: 3,
    title: 'I Will Always Love You',
    artist: 'Whitney Houston',
    imgUrl: 'https://picsum.photos/200/300',
    time: '4:50',
    totalViews: '300M',
    artistUrl: 'https://picsum.photos/200/300',
  },
  {
    id: 4,
    title: 'Cant Stop the Feeling!',
    artist: 'Justin Timberlake',
    imgUrl: 'https://picsum.photos/200/300',
    time: '3:56',
    totalViews: '500M',
    artistUrl: 'https://picsum.photos/200/300',
  },

  {
    id: 5,
    title: 'Chasing Pavements',
    artist: 'Adele',
    imgUrl: 'https://picsum.photos/200/300',
    time: '3:31',
    totalViews: '120M',
    artistUrl: 'https://picsum.photos/200/300',
  },

  {
    id: 6,
    title: 'Clocks',
    artist: 'Coldplay',
    imgUrl: 'https://picsum.photos/200/300',
    time: '5:07',
    totalViews: '400M',
    artistUrl: 'https://picsum.photos/200/300',
  },

  {
    id: 7,
    title: 'Sorry',
    artist: 'Halsey',
    imgUrl: 'https://picsum.photos/200/300',
    time: '3:39',
    totalViews: '250M',
    artistUrl: 'https://picsum.photos/200/300',
  },

  {
    id: 8,
    title: 'Back to You',
    artist: 'Louis Tomlinson',
    imgUrl: 'https://picsum.photos/200/300',
    time: '3:11',
    totalViews: '80M',
    artistUrl: 'https://picsum.photos/200/300',
  },

  {
    id: 9,
    title: 'Roar',
    artist: 'Katy Perry',
    imgUrl: 'https://picsum.photos/200/300',
    time: '4:30',
    totalViews: '600M',
    artistUrl: 'https://picsum.photos/200/300',
  },

  {
    id: 10,
    title: 'Dancing Queen',
    artist: 'ABBA',
    imgUrl: 'https://picsum.photos/200/300',
    time: '3:51',
    totalViews: '900M',
    artistUrl: 'https://picsum.photos/200/300',
  },

  {
    id: 11,
    title: 'Stay',
    artist: 'Rihanna',
    imgUrl: 'https://picsum.photos/200/300',
    time: '4:00',
    totalViews: '200M',
    artistUrl: 'https://picsum.photos/200/300',
  },
];

const savedStorys = [
  {
    id: 1,
    name: 'Hangout',
    description: 'arianacooper | 24.5M seguidores',
    imgUrl:
      'https://images.unsplash.com/photo-1501238295340-c810d3c156d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    isFollow: false,
  },
  {
    id: 2,
    name: 'New Year',
    description: 'johndoe | 10M seguidores',
    imgUrl:
      'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnVuJTIwcGFydHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    id: 3,
    name: 'Friends',
    description: 'janesmith | 5M seguidores',
    imgUrl:
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZ1biUyMHBhcnR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    id: 4,
    name: 'Beach',
    description: 'bobjohnson | 2M seguidores',
    imgUrl:
      'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZ1biUyMHBhcnR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    id: 5,
    name: 'Party',
    description: 'sarawilson | 1M seguidores',
    imgUrl:
      'https://images.unsplash.com/photo-1598495496118-f8763b94bde5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZ1biUyMHBhcnR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    id: 6,
    name: 'Celebration',
    description: 'tomwilson | 500K seguidores',
    imgUrl:
      'https://images.unsplash.com/photo-1616428317393-acd93938b4fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGZ1biUyMHBhcnR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    id: 7,
    name: 'Fun Time',
    description: 'alicebrown | 250K seguidores',
    imgUrl:
      'https://images.unsplash.com/photo-1532635248-cdd3d399f56c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGZ1biUyMHBhcnR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
];

const liveChat = [
  {
    name: 'Dracel Steward',
    message: 'Hola Teresa, buenos días 😄',
    imgUrl:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    isFollow: false,
  },
  {
    name: 'John Doe',
    message: 'Hola, buenos días! Cómo estás?',
    imgUrl:
      'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    name: 'Jane Smith',
    message: 'Estoy bien, gracias por preguntar 😊',
    imgUrl:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fHVzZXIlMjBwcm9maWxlJTIwd2l0aCUyMGJhY2tncm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    name: 'Bob Johnson',
    message: "Eso es bueno! Cuáles son tus planes para hoy?",
    imgUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    name: 'Sara Wilson',
    message:
      'Tengo algunas reuniones programadas, pero, fuera de eso, trabajo en casa. y tú?',
    imgUrl:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    name: 'Tom Wilson',
    message: "Eso es bueno! Cuáles son tus planes para hoy?",
    imgUrl:
      'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    name: 'Alice Brown',
    message:
      'Tengo algunas reuniones programadas, pero, fuera de eso, trabajo en casa. y tú?',
    imgUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
  {
    name: 'Emily Davis',
    message: "Eso es bueno! Cuáles son tus planes para hoy?",
    imgUrl:
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    name: 'Mark Lee',
    message: 'de nada! Estoy bien, gracias por preguntar 😊',
    imgUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: false,
  },
  {
    name: 'Laura Lee',
    message: 'Eso es bueno! Cuáles son tus planes para hoy?',
    imgUrl:
      'https://images.unsplash.com/photo-1610737241336-371badac3b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    isFollow: true,
  },
];

const hashtagDetail = [
  {
    id: 1,
    views: '1.2M',
    title: 'amazingfood',
  },
  {
    id: 2,
    views: '800K',
    title: 'delicious desserts',
  },
  {
    id: 3,
    views: '2.5M',
    title: 'tasty seafood',
  },
  {
    id: 4,
    views: '600K',
    title: 'vegan delights',
  },
  {
    id: 5,
    views: '1.8M',
    title: 'juicy burgers',
  },
  {
    id: 6,
    views: '1.1M',
    title: 'ethnic cuisine',
  },
  {
    id: 7,
    views: '4.2M',
    title: 'chef specials',
  },
  {
    id: 8,
    views: '900K',
    title: 'farm-to-table',
  },
  {
    id: 9,
    views: '3.6M',
    title: 'gourmet pizza',
  },
  {
    id: 10,
    views: '1.5M',
    title: 'hearty soups',
  },
  {
    id: 11,
    views: '2.2M',
    title: 'spicy wings',
  },
  {
    id: 12,
    views: '500K',
    title: 'breakfast classics',
  },
  {
    id: 13,
    views: '1.9M',
    title: 'dessert first',
  },
];

const searchCategoryData = [
  {
    id: 0,
    title: strings.top,
  },
  {
    id: 1,
    title: strings.user,
  },
  {
    id: 2,
    title: strings.video,
  },
  {
    id: 3,
    title: strings.sounds,
  },
  {
    id: 4,
    title: strings.live,
  },
  {
    id: 5,
    title: strings.hashtag,
  },
];

const findFriendsData = [
  {
    id: 1,
    title: 'Invitar amigos',
    icon: 'arrow-redo',
    description: 'Invite friends to join',
    btn: 'Invite',
  },
  {
    id: 2,
    title: 'Contactos',
    icon: 'people',
    description: 'Find your contacts',
    btn: 'Find',
  },
  {
    id: 3,
    title: 'Facebook Friends',
    icon: 'logo-facebook',
    description: 'Encuentra amigos de Facebook',
    btn: 'Find',
  },
  {
    id: 4,
    title: 'Instagram Friends',
    icon: 'logo-instagram',
    description: 'Encuentra amigos de Instagram',
    btn: 'Find',
  },
];

const UserDetailCategory = [
  {
    title: strings.post,
    value: '247',
  },
  {
    title: strings.followers,
    value: '368K',
  },
  {
    title: strings.following,
    value: '374',
  },
];

const commentData = [
  {
    name: 'Dracel Steward',
    description: '¿Cuál es tu ruta favorita?',
    imgUrl:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    commentLike: '1.1K',
  },
  {
    name: 'John Doe',
    description: '¿Tienes algunas mascotas?',
    imgUrl:
      'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    commentLike: '974',
  },
  {
    name: 'Jane Smith',
    description: '¿Cuál es tu color favorito?',
    imgUrl:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fHVzZXIlMjBwcm9maWxlJTIwd2l0aCUyMGJhY2tncm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    commentLike: '664',
  },
  {
    name: 'Bob Johnson',
    description: '¿Cuál es tu película favorita?',
    imgUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
    commentLike: '76',
  },
  {
    name: 'Sara Wilson',
    description: '¿Cuál es tu comida favorita?',
    imgUrl:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    commentLike: '24',
  },
  {
    name: 'Tom Wilson',
    description: '¿Cómo te gusta tu café?',
    imgUrl:
      'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    commentLike: '147',
  },
  {
    name: 'Alice Brown',
    description: '¿Hace frío?',
    imgUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    commentLike: '54',
  },
  {
    name: 'Emily Davis',
    description: '¿Cómo está el clima?',
    imgUrl:
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    commentLike: '46',
  },
  {
    name: 'Mark Lee',
    description: 'El clima es bueno hoy',
    imgUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    commentLike: '456',
  },
  {
    name: 'Laura Lee',
    description: '¿Cuál es tu temporada favorita?',
    imgUrl:
      'https://images.unsplash.com/photo-1610737241336-371badac3b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
    commentLike: '54',
  },
];

export {
  interestsList,
  userAccounts,
  renderChips,
  ProfileSetting,
  helperCategoryData,
  helperData,
  contactUsData,
  languageData,
  privacyPolicyData,
  editProfileData,
  headerCategoryData,
  inboxData,
  videoData,
  reportData,
  manageAccData,
  messageDataList,
  recenltyDataList,
  soundTrendingData,
  hashtagTreandingData,
  userDetail,
  savedStorys,
  searchVideoData,
  searchMusicData,
  hashtagDetail,
  searchCategoryData,
  findFriendsData,
  liveChat,
  UserDetailCategory,
  commentData,
  userStoryData,
  postData,
};
