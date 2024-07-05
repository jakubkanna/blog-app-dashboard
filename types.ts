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
  open: boolean;
  handleClose: () => void;
  params: {
    id: string;
    row: {
      title: string;
    };
    field: string;
  };
  initialValue: ImageInstance[];
  onSubmit: (selectedImages: string[]) => void;
}

export type Event = {
  id: string;
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  venue?: string;
  tags?: string[];
  images?: string[];
  post?: string | null;
  external_urls?: string[];
  public?: boolean;
};

export type PageContextType = {
  data: any[];
  createData: (data: any) => Promise<any>;
  updateData: (data: any) => Promise<any>;
  deleteData: (id: any) => Promise<void>;
  loading: Boolean;
};
