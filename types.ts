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

export type Event = Partial<{
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
}>;

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

export type PageContextType = {
  data: any[];
  createData: (data: any) => Promise<any>;
  updateData: (data: any) => Promise<any>;
  deleteData: (id: any) => Promise<void>;
  loading: Boolean;
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

export type Post = {
  _id: string;
  author: string;
  timestamp: Date;
  title: string;
  content: [Block];
  public: boolean;
  slug: string;
  tags: string[];
  modified?: Date;
};

export type Block = {
  id: string;
  content: string;
  index: number;
};
