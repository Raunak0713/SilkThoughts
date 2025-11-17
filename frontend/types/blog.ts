export interface Test {
    data: Blog[];
    meta: Meta;
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
    author:      Author;
    category:    Author;
    tags:        Author[];
    cover:       Cover;
}

export interface Author {
    id:          number;
    documentId:  string;
    name:        string;
    email?:      string;
    bio?:        string;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
    slug?:       string;
}

export interface Content {
    type:     string;
    children: Child[];
}

export interface Child {
    type: string;
    text: string;
}

export interface Cover {
    id:                number;
    documentId:        string;
    name:              string;
    alternativeText:   string;
    caption:           string;
    width:             number;
    height:            number;
    formats:           Formats;
    hash:              string;
    ext:               string;
    mime:              string;
    size:              number;
    url:               string;
    previewUrl:        null;
    provider:          string;
    provider_metadata: null;
    createdAt:         Date;
    updatedAt:         Date;
    publishedAt:       Date;
}

export interface Formats {
    thumbnail: Small;
    small:     Small;
}

export interface Small {
    name:        string;
    hash:        string;
    ext:         string;
    mime:        string;
    path:        null;
    width:       number;
    height:      number;
    size:        number;
    sizeInBytes: number;
    url:         string;
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
