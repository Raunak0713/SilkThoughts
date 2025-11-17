export interface Test {
    data: Tag[];
    meta: Meta;
}

export interface Tag {
    id:          number;
    documentId:  string;
    name:        string;
    slug:        string;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
    blogs:       Blog[];
}

export interface Blog {
    id:          number;
    documentId:  string;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
    title:       string;
    slug:        string;
    description: string;
    content:     Content[];
    published:   Date;
    isPublished: boolean;
}

export interface Content {
    type:     string;
    children: Child[];
}

export interface Child {
    type: string;
    text: string;
}

export interface Meta {
    pagination: Pagination;
}

export interface Pagination {
    page:      number;
    pageSize:  number;
    pageCount: number;
    total:     number;
}
