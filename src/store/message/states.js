/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 * @see https://github.com/FaridSafi/react-native-gifted-chat
 */
export const initialState = {
  messages: [
    {
      _id: '88153547-7b92-41a4-ae0a-9c18d13a2caf',
      text: 'I feel very good.',
      createdAt: new Date('Mon Feb 16 2021 15:02:00 GMT+0700 (Indochina Time)'),
      sent: true,
      user: {
        _id: 2,
      },
    },
    {
      _id: '04698a75-9355-46ae-88bc-da163e6b2982',
      text: 'What do you feel after doing the exercises yesterday?',
      createdAt: new Date('Mon Feb 16 2021 15:00:00 GMT+0700 (Indochina Time)'),
      sent: true,
      user: {
        _id: 1,
      },
    },
    {
      _id: 'f5937e3d-5a68-4095-aaac-5d0a60d9b20e',
      text: 'Hi Dr.',
      createdAt: new Date('Mon Feb 15 2021 16:14:00 GMT+0700 (Indochina Time)'),
      sent: true,
      user: {
        _id: 2,
      },
    },
    {
      _id: '977a7a84-b067-4e04-965a-06387c89d736',
      text: 'Hi Luke',
      createdAt: new Date('Mon Feb 15 2021 16:13:50 GMT+0700 (Indochina Time)'),
      sent: true,
      user: {
        _id: 1,
      },
    },
  ],
  isLoading: false,
};
