export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  cover: string;
  order: number;
  published: boolean;
  tags?: string[];
}

export interface NavItem {
  label: string;
  href: string;
}
