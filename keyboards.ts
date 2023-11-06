export const hoursKeyboard = (messageId: string) => {
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
