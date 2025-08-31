export type Question = {
    _id: string;
    question: string;
    options: string[];
    tags: string;
    owner: string;
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
    _id: string;
    name: string;
    permissions: Permissions;
    score: number;
    email: string;
}