// src/types.ts

import { Dispatch, ReactNode, SetStateAction } from "react";

export interface ImageLibraryProps {
  imageList: ImageInstance[];
  setImageList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
}
export interface ImageInstance {
  _id: string;
  public_id: string;
  original_filename: string;
  filename?: string;
  path: string;
  format?: string;
  dimensions?: { width: number; height: number };
  tags?: string[];
  alt?: string;
  bytes: number;
  url: string;
  secure_url?: string;
  cld_url?: string;
  cld_secure_url?: string;
}

export type Severity = "error" | "warning" | "info" | "success";

export interface AuthContextType {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

export type ProviderProps = {
  children: ReactNode;
};

export interface ImagesModalProps {
  open?: boolean;
  onSubmit?: (selectedImages: string[]) => void;
  params: {
    id: string;
    row: {
      title: string;
    };
    field: string;
  };
  onClose: () => void;
  fetchPath: "events" | "works";
}

export type Event = {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  start_date: Date;
  end_date: Date;
  venue: string;
  images?: ImageInstance[];
  tags?: string[];
  post?: { title: string; _id: string };
  external_url: URL;
  public: boolean;
};
export type Work = {
  _id: string;
  title: string;
  medium?: string[];
  year?: number;
  events?: any[];
  images?: any[];
  tags?: any[];
  public?: boolean;
};
export type Post = {
  _id: string;
  author: string;
  timestamp: Date;
  title: string;
  content: Block[];
  public: boolean;
  slug: string;
  tags: string[];
  modified?: Date;
};

export type PageContextType<T> = {
  data: T[];
  createData: (item: T) => Promise<T | null>;
  updateData: (item: T) => Promise<T | null>;
  deleteData: (item: string) => Promise<boolean>;
  loading: boolean;
};

export interface Option {
  value?: any;
  label?: string;
}

export interface SelectProps {
  label: string;
  options: Option[];
  onBlur: () => void;
  onChange: () => void;
  initVal: Option[];
}

export type Block = {
  id: string;
  html: string;
  type: string;
  index: number;
};
