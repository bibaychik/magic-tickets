import { defineArrayMember, defineField, defineType } from 'sanity'

export const EVENT_TYPES = ['Концерт', 'Спектакль', 'Стендап', 'Фестиваль'] as const
export const EVENT_STATUSES = ['В продаже', 'Sold out', 'Архив', 'Перенос', 'Отмена'] as const
export const EVENT_CITIES = ['Алматы', 'Астана', 'Караганда', 'Шымкент'] as const

export type EventType = (typeof EVENT_TYPES)[number]
export type EventStatus = (typeof EVENT_STATUSES)[number]
export type EventCity = (typeof EVENT_CITIES)[number]

export interface EventScheduleItem {
  _key: string
  city: EventCity
  date: string
}

export interface SanityEventDocument {
  _id: string
  _type: 'event'
  title: string
  slug: { current: string }
  eventType: EventType
  status: EventStatus
  poster: { _type: 'image'; asset: { _ref: string } }
  videoFile?: { asset: { _ref: string } }
  description?: string
  isMain?: boolean
  mainPoster?: { _type: 'image'; asset: { _ref: string } }
  schedule: EventScheduleItem[]
  showTickets: boolean
}

export const eventType = defineType({
  name: 'event',
  title: 'Событие',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Название события', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'URL-идентификатор',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Тип события',
      type: 'string',
      options: { list: [...EVENT_TYPES], layout: 'dropdown' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Статус мероприятия',
      type: 'string',
      options: { list: [...EVENT_STATUSES], layout: 'dropdown' },
      initialValue: 'В продаже',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'poster', title: 'Постер', type: 'image', options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'isMain', title: 'Сделать главным событием', type: 'boolean', initialValue: false }),
    defineField({
      name: 'mainPoster',
      title: 'Постер для Hero-блока',
      type: 'image',
      description: 'Широкоформатный постер высокого разрешения',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoFile',
      title: 'Фоновое видео',
      type: 'file',
      description: 'Загрузите MP4-файл для hover-эффекта',
      options: { accept: 'video/mp4' },
    }),
    defineField({ name: 'description', title: 'Описание', type: 'text', rows: 4 }),
    defineField({
      name: 'schedule',
      title: 'Расписание',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'scheduleEntry',
          title: 'Дата выступления',
          fields: [
            defineField({ name: 'city', title: 'Город', type: 'string', options: { list: [...EVENT_CITIES], layout: 'dropdown' }, validation: (Rule) => Rule.required() }),
            defineField({ name: 'date', title: 'Дата и время', type: 'datetime', validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({ name: 'showTickets', title: 'Показывать кнопку «₸»', type: 'boolean', initialValue: true }),
  ],
})