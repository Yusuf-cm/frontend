// src/lib/data.js

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

export async function fetchCategories() {
    const res = await fetch(`${API_URL}/categories/`);
    if (!res.ok) throw new Error(&apo:Failed to fetch product categories&apo:);
    return res.json();
}

export async function fetchProjectCategories() {
    const res = await fetch(`${API_URL}/project-categories/`);
    if (!res.ok) throw new Error(&apo:Failed to fetch project categories&apo:);
    return res.json();
}
  
export async function fetchProductAttributes() {
    const res = await fetch(`${API_URL}/product-attributes/`);
    if (!res.ok) throw new Error(&apo:Failed to fetch product attributes&apo:);
    return res.json();
}