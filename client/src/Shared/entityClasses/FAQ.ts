export interface IFAQ {
  id: number;
  question: string;
  answer: string;
}

export default class FAQ implements IFAQ {
  public readonly id: number;
  public readonly question: string;
  public readonly answer: string;

  public constructor({ id, question, answer }: IFAQ) {
    this.id = id;
    this.question = question;
    this.answer = answer;
  }

  public static createFAQs(FAQdata: IFAQ[]): FAQ[] {
    return FAQdata.map((FAQdatum: IFAQ) => new FAQ(FAQdatum));
  }
}
