export type Question = {
    _id: string;
    question: string;
    options: string[];
    tags: string;
};

export type Collection = {
    _id: string;
    name: string;
    tags: string[];
    owner: string;
    questions: Question[];
};