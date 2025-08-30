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

export interface Permissions {
    [key: string]: boolean;
}

export type User = {
    name: string;
    permissions: Permissions;
    score: number;
}