import botHelper from "./botHelper";

export interface IMappedReservationList {
  start_time: string;
  count: number;
}
// join ➕
// yellow 🟡
// gray ⚪

export const countProgress = (count: number) => {
  let text = "";
  for (let i = 0; i < Number(process.env.MAX_PLAYERS); i++) {
    if (i < count) {
      text += "🟡";
    } else {
      text += "⚪";
    }
  }

  return text;
};
export const hoursKeyboard = (
  messageId: string,
  mappedReservationList: IMappedReservationList[]
) => {
  const times = botHelper.times;
  const buttons = [];
  for (let i = 0; i < times.length; i++) {
    const count = mappedReservationList.find(
      (item) => item.start_time === times[i]
    );
    if (count) {
      buttons.push([
        {
          text: `${times[i]} ${countProgress(count.count)}`,
          callback_data: JSON.stringify({
            action: "join",
            time: times[i],
            messageId: messageId,
          }),
        },
      ]);
    } else {
      buttons.push([
        {
          text: `${times[i]} ${countProgress(0)}`,
          callback_data: JSON.stringify({
            action: "join",
            time: times[i],
            messageId: messageId,
          }),
        },
      ]);
    }
  }

  return {
    inline_keyboard: buttons,
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

  const freePlaces = Number(process.env.MAX_PLAYERS) - users.length;
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
