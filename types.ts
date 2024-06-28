// src/types.ts

import { Dispatch, SetStateAction } from "react";

export interface LibraryProps {
  imageList: ImageInstance[];
  setImageList: React.Dispatch<React.SetStateAction<ImageInstance[]>>;
}

export interface ImageInstance {
  url: string;
  original_path: string;
  bytes: number;
  public_id: string;
  secure_url?: string;
  cld_url?: string;
  cld_secure_url?: string;
  format?: string;
  filename?: string;
  alt?: string;
  tags?: string[];
  dimensions?: { width: number; height: number };
}

export type Severity = "error" | "warning" | "info" | "success";

export interface AuthContextType {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}
