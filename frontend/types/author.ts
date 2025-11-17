export interface Test {
    data: Author[];
    meta: Meta;
}

export interface Author {
    id:          number;
    documentId:  string;
    name:        string;
    email:       string;
    bio:         string;
    createdAt:   Date;
    updatedAt:   Date;
    publishedAt: Date;
    avatar:      Avatar;
    blog:        Blog | null;
}

export interface Avatar {
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
    thumbnail: Large;
    small:     Large;
    medium?:   Large;
    large?:    Large;
}

export interface Large {
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
