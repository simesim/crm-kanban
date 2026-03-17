// Пример данных для страницы "Уроки". Можно заменить на API/таблицу.

export const week = [
  { key: "mon", label: "Пн" },
  { key: "tue", label: "Вт" },
  { key: "wed", label: "Ср" },
  { key: "thu", label: "Чт" },
  { key: "fri", label: "Пт" },
  { key: "sat", label: "Сб" },
  { key: "sun", label: "Вс" },
];

export const lessons = {
  tue: [
    { mode: "Online", title: "Питон Ур.2", student: "Мустафина Милана", time: "11:00 – 12:00" },
  ],
  wed: [
    { mode: "Оф/онл", title: "Компьютерная безопасность", student: "Кинев (КБ)", time: "07:15 – 08:15" },
    { mode: "Вайнера", title: "Математика", student: "Гридин", time: "09:00 – 10:00" },
    { mode: "Online", title: "Питон Ур.2", student: "Мустафина Милана", time: "12:30 – 13:30" },
  ],
  thu: [
    { mode: "Шварца", title: "Scratch", student: "Компанец", time: "08:00 – 09:00" },
    { mode: "Вайнера", title: "Математика", student: "Сычев", time: "12:00 – 13:00" },
    { mode: "Online", title: "Питон Ур.3", student: "Джангулaев Артур", time: "15:00 – 16:00" },
  ],
  fri: [
    { mode: "Вайнера", title: "Комп грамотность", student: "Данилова (КГ)", time: "13:00 – 14:00" },
    { mode: "Оф/онл", title: "Minecraft", student: "Королев Д", time: "15:00 – 16:00" },
    { mode: "Шварца", title: "Химия", student: "Устиченко", time: "16:00 – 17:00" },
  ],
  sat: [
    { mode: "Шварца", title: "Информатика", student: "Зырина", time: "08:00 – 09:00" },
    { mode: "Шварца", title: "Математика", student: "ОГЭ СБ", time: "10:00 – 11:00" },
    { mode: "Вайнера", title: "Unity", student: "Копалкин", time: "10:30 – 11:30" },
  ],
  sun: [
    { mode: "Шварца", title: "Construct", student: "Изотов", time: "07:00 – 07:45" },
    { mode: "Шварца", title: "Математика", student: "Бурцев", time: "08:00 – 09:00" },
    { mode: "Шварца", title: "Web 2", student: "Web", time: "09:00 – 11:00" },
    { mode: "Шварца", title: "Minecraft", student: "Лобач", time: "13:00 – 14:00" },
  ],
};
