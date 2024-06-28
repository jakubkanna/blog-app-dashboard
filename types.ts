// src/types.ts

import { Dispatch, SetStateAction } from "react";

export interface LibraryProps {
  imageList: ImageInstance[];
  setImageList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
}
export interface ImageInstance {
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
