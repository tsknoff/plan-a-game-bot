import { mappedList } from "./interfaces";

export const hoursKeyboard = (messageId) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "12:00-12:30",
            callback_data: JSON.stringify({
              action: "look",
              time: "12:00",
              messageId: messageId,
            }),
          },
        ],
        [
          {
            text: "12:30-13:00",
            callback_data: JSON.stringify({
              action: "look",
              time: "12:30",
              messageId: messageId,
            }),
          },
        ],
        [
          {
            text: "13:00-13:30",
            callback_data: JSON.stringify({
              action: "look",
              time: "13:00",
              messageId: messageId,
            }),
          },
        ],
        [
          {
            text: "13:30-14:00",
            callback_data: JSON.stringify({
              action: "look",
              time: "13:30",
              messageId: messageId,
            }),
          },
        ],
        [
          {
            text: "14:00-14:30",
            callback_data: JSON.stringify({
              action: "look",
              time: "14:00",
              messageId: messageId,
            }),
          },
        ],
        [
          {
            text: "14:30-15:00",
            callback_data: JSON.stringify({
              action: "look",
              time: "14:30",
              messageId: messageId,
            }),
          },
        ],
      ],
    },
  };
};

export const lobbyKeyboard = (
  hourToBook: string,
  users: {
    first_name: string;
    last_name: string;
  }[]
) => {
  const buttons = [];

  for (let i = 0; i < users.length; i++) {
    buttons.push([
      {
        text: users[i].first_name + " " + users[i].last_name,
        callback_data: "asd",
      },
    ]);
  }

  const freePlaces = 4 - users.length;
  if (freePlaces > 0) {
    for (let i = 0; i < freePlaces; i++) {
      buttons.push([
        {
          text: "join ➕",
          callback_data: JSON.stringify({ action: "join", time: hourToBook }),
        },
      ]);
    }
  }

  return {
    inline_keyboard: buttons,
  };
};

export const exampleMessageObj = {
  message_id: 177,
  from: {
    id: 152316348,
    is_bot: false,
    first_name: "Egor",
    last_name: "Tsukanov",
    username: "tsukanov",
    language_code: "ru",
  },
  chat: {
    id: 152316348,
    first_name: "Egor",
    last_name: "Tsukanov",
    username: "tsukanov",
    type: "private",
  },
  date: 1699084741,
  text: "/info",
  entities: [{ offset: 0, length: 5, type: "bot_command" }],
};

// const ReservationExample = {
//   dataValues: {
//     reservation_id: 1,
//       chat_id: '152316348',
//       user_id: '152316348',
//       start_time: '12:00',
//       createdAt: 2023-11-06T13:56:39.960Z,
//       updatedAt: 2023-11-06T13:56:39.960Z,
//       User: [User]
//   },
//   _previousDataValues: {
//     reservation_id: 1,
//       chat_id: '152316348',
//       user_id: '152316348',
//       start_time: '12:00',
//       createdAt: 2023-11-06T13:56:39.960Z,
//       updatedAt: 2023-11-06T13:56:39.960Z,
//       User: [User]
//   },
//   uniqno: 1,
//     _changed: Set(0) {},
//   _options: {
//     isNewRecord: false,
//       _schema: null,
//       _schemaDelimiter: '',
//       include: [Array],
//       includeNames: [Array],
//       includeMap: [Object],
//       includeValidated: true,
//       attributes: [Array],
//       raw: true
//   },
//   isNewRecord: false,
//     User: User {
//     dataValues: [Object],
//       _previousDataValues: [Object],
//       uniqno: 1,
//       _changed: Set(0) {},
//     _options: [Object],
//       isNewRecord: false
//   }
