/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
export const initialState = {
  todaySummary: [],
  treatmentPlan: [],
  isLoading: false,
  activities: [
    {
      id: 1,
      title: 'Hip/ Thight',
      include_feedback: true,
      get_pain_level: true,
      completed: true,
      pain_level: 5,
      sets: 6,
      reps: 7,
      additional_fields: [
        {
          field: 'Aim',
          value: 'To stretch or maintain range in your wrist and hand.',
        },
        {
          field: 'Instructions',
          value:
            'Position yourself sitting with your hand in the device and your wrist and fingers out straight.',
        },
      ],
    },
    {
      id: 2,
      title: 'This is a long long long title with 2 rows.',
      include_feedback: false,
      get_pain_level: false,
      completed: false,
      additional_fields: [
        {
          field: 'Aim',
          value: 'To stretch or maintain range in your wrist and hand.',
        },
        {
          field: 'Instructions',
          value:
            'Position yourself sitting with your hand in the device and your wrist and fingers out straight.',
        },
      ],
    },
    {
      id: 3,
      title: 'This is the activity title',
      include_feedback: true,
      get_pain_level: true,
      completed: false,
      additional_fields: [
        {
          field: 'Aim',
          value: 'To stretch or maintain range in your wrist and hand.',
        },
        {
          field: 'Instructions',
          value:
            'Position yourself sitting with your hand in the device and your wrist and fingers out straight.',
        },
      ],
    },
  ],
};
