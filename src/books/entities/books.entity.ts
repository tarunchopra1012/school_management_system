export enum Language {
  ENGLISH = 'en',
  FRENCH = 'fr',
}

export class Book {
  id: number;
  title: string;
  author: string;
  publicationDate: string;
  numberOfPages: number;
  language: Language;
}
