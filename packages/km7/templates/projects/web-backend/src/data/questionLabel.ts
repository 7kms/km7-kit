export interface IQuestionLevel {
  name: string;
  value: number;
}

export const LevelArr: IQuestionLevel[] = [
  {
    name: '初级',
    value: 0,
  },
  {
    name: '中级',
    value: 1,
  },
  {
    name: '高级',
    value: 2,
  },
  {
    name: '资深',
    value: 4,
  },
  {
    name: '专家',
    value: 5,
  },
];
