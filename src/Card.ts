import { has } from 'lodash';

export interface CardObjectBase {}

export interface SimpleCardObject extends CardObjectBase {
  type: 'Simple';
  title: string;
  content: string;
}

export interface StandardCardObject extends CardObjectBase {
  type: 'Standard';
  title: string;
  text: string;
  image: {
    smallImageUrl: string;
    largeImageUrl: string;
  };
}

export interface LinkAccountCardObject extends CardObjectBase {
  type: 'LinkAccount';
}

export type CardObject = SimpleCardObject | StandardCardObject | LinkAccountCardObject;

export interface SimpleCardOptions {
  title: string;
  content: string;
}

export interface StandardCardOptions {
  title: string;
  text: string;
  smallImageURL: string;
  largeImageURL: string;
}

export class Card {
  static simple(options: SimpleCardOptions): Card {
    const card = new Card('Simple');
    card.title = options.title;
    card.content = options.content;
    return card;
  }

  static standard(options: StandardCardOptions): Card {
    const card = new Card('Standard');
    card.title = options.title;
    card.text = options.text;
    card.smallImageURL = options.smallImageURL;
    card.largeImageURL = options.largeImageURL;
    return card;
  }

  static linkAccount(): Card {
    return new Card('LinkAccount');
  }

  title: string;
  content: string;
  text: string;
  smallImageURL: string;
  largeImageURL: string;

  constructor(public type: string) {}

  get object(): CardObject {
    const result: any = {};
    if (has(this, 'type')) {
      result.type = this.type;
    }
    if (has(this, 'title')) {
      result.title = this.title;
    }
    if (has(this, 'content')) {
      result.content = this.content;
    }
    if (has(this, 'text')) {
      result.text = this.text;
    }
    if (has(this, 'smallImageURL') || has(this, 'largeImageURL')) {
      result.image = {};
    }
    if (has(this, 'smallImageURL')) {
      result.image.smallImageUrl = this.smallImageURL;
    }
    if (has(this, 'largeImageURL')) {
      result.image.largeImageUrl = this.largeImageURL;
    }
    return result;
  }
}
