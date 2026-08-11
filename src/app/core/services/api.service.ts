import { Injectable } from '@angular/core';
// import { Firestore, collection, collectionData, doc, getDoc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import * as EmailJS from 'emailjs-com';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private supabase_client: SupabaseClient
  constructor() { 
    this.supabase_client = createClient(environment.supabase.url, environment.supabase.key);
  }
  // async addData(collectionId: string, data: any): Promise<string> {
  //   try {
  //     const collectionRef = collection(this.fs, collectionId);

  //     // Create a new document reference
  //     const docRef = doc(collectionRef);
  //     const docId = docRef.id;

  //     // Add a new document with the data and docId fields
  //     await setDoc(docRef, { ...data, docId });
  //     return docId;
  //   } catch (error) {
  //     console.log('Error storing heading:', error);
  //     throw error;
  //   }
  // }
  // getAllData(collectionId: string): Observable<any[]> {
  //   const collectionRef = collection(this.fs, collectionId);
  //   return collectionData(collectionRef, { idField: 'id' });
  // }
  // async getCrackers(productDocId: string) {
  //   const productDocRef = doc(this.fs, 'products', productDocId);

  //   // Reference to the 'crackers' subcollection within productDocRef
  //   const crackersCollectionRef = collection(productDocRef, 'crackers');

  //   // Fetch all documents from the 'crackers' subcollection
  //   try {
  //     const querySnapshot = await getDocs(crackersCollectionRef);
  //     const crackers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     return crackers;
  //   } catch (error) {
  //     console.error('Error fetching crackers:', error);
  //     throw error;
  //   }
  // }
  // getDataWithCache(type: string): Observable<any> {
  //   const cachedData = localStorage.getItem(type);
  //   if (cachedData) {
  //     return of(JSON.parse(cachedData));
  //   } else {
  //     return this.getData(type).pipe(
  //       map((res) => {
  //         const data = res[0];
  //         localStorage.setItem(type, JSON.stringify(data));
  //         return data;
  //       }),
  //       catchError((err) => {
  //         console.error('Error occurred:', err);
  //         throw err;
  //       })
  //     );
  //   }
  // }
  // async getAllCategoryIds(): Promise<string[]> {
  //   const categoryIds: any[] = [];

  //   try {
  //     const productsCollectionRef = collection(this.fs, 'products');
  //     const querySnapshot = await getDocs(productsCollectionRef);

  //     querySnapshot.forEach((doc) => {
  //       categoryIds.push(doc.id);
  //     });
  //   } catch (error) {
  //     console.error('Error fetching category IDs:', error);
  //   }

  //   return categoryIds;
  // }

  // async getCrackersData(categoryIds: string[]): Promise<any[]> {
  //   const allCrackers:any[]=[];
  
  //   // Create an array of promises
  //   const promises = categoryIds.map(async (categoryId) => {
  //     try {
  //       const productDocRef = doc(this.fs, 'products', categoryId);
  //       const productDoc = await getDoc(productDocRef);
  
  //       if (!productDoc.exists()) {
  //         console.warn(`Product with ID ${categoryId} not found`);
  //         return null;
  //       }
  
  //       const productData = productDoc.data();
  //       const heading = productData['heading'];
  
  //       const subCollectionRef = collection(productDocRef, 'crackers');
  //       const subCollectionSnap = await getDocs(subCollectionRef);
  
  //       const crackers = subCollectionSnap.docs
  //         .map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }))
  //         .sort((a: any, b: any) => {
  //           if (a.name < b.name) {
  //             return -1;
  //           }
  //           if (a.name > b.name) {
  //             return 1;
  //           }
  //           return 0;
  //         });
  
  //       return { heading, crackers };
  //     } catch (error) {
  //       console.error(`Error getting crackers data for category ID ${categoryId}:`, error);
  //       return null;
  //     }
  //   });
  
  //   // Await all promises and filter out any null results
  //   const results = await Promise.all(promises);
  //   results.forEach((result) => {
  //     if (result !== null) {
  //       allCrackers.push(result);
  //     }
  //   });
  
  //   return allCrackers;
  // }
  // async updateData(collectionId: string, docId: string, data: any): Promise<void> {
  //   try {
  //     const productDocRef = doc(this.fs, collectionId, docId);

  //     await updateDoc(productDocRef, data);

  //     console.log('Product data updated successfully!');
  //   } catch (error) {
  //     console.log('Error updating product heading:', error);
  //     throw error;
  //   }
  // }
  sendEmail(formvalue:any) {
    const { email, name, phone, address } = formvalue;

    const newObject = { email, name, phone, address };
    return EmailJS.send('service_j334658', 'template_7yz0ps7', newObject, 'OWRIp6_8gR4_SCjqw')
  }
  // supabase
  async getData(table: string) {
    let { data, error } = await this.supabase_client
      .from<any,any>(table)
      .select('*')
      .eq('store_id',environment.supabase.store_id);
    return { data, error };
  }
  async getDataByField(table: string, field?: string, value?: any) {
    const query = this.supabase_client.from(table).select('*')
    .eq('store_id',environment.supabase.store_id);
  
    // Add a filter condition only if both field and value are provided
    const finalQuery = field && value !== undefined ? query.eq(field, value) : query;
  
    const { data, error } = await finalQuery.select('*');
  
    if (error) {
      console.log('Failed to fetch data');
    }
  
    return { data, error };
  }
  async addSupaData(table: string, data: any) {
    // Add an id field with a UUID
    const dataWithId = { ...data, id: uuidv4() };
  
    let { data: result, error } = await this.supabase_client
      .from<any, any>(table)
      .insert([dataWithId])
      .eq('store_id',environment.supabase.store_id);
  
    return { data: result, error };
  }
  async updateSupaData(table: string, condition: { column: string, value: any }, newData: any) {
    let { data, error } = await this.supabase_client
      .from<any, any>(table)
      .update(newData)
      .eq(condition.column, condition.value)
      .eq('store_id',environment.supabase.store_id);
  
    return { data, error };
  }
  async fetchCategoriesWithProducts() {
    try {
      // Fetch all categories, sort them by 'sort_id', and fetch related products, sorted by their 'sort_id'
      const { data: categoriesWithProducts, error } = await this.supabase_client
        .from('category')
        .select('*, products(*)') // Fetch related products
        .eq('store_id',environment.supabase.store_id)
        .order('sort_id', { ascending: true }) // Sort categories by 'sort_id'
        .order('sort_id', { foreignTable: 'products', ascending: true }); // Sort products by 'sort_id'
  
      if (error) {
        console.error('Error fetching categories with products:', error.message);
        throw new Error('Failed to fetch categories with products');
      }
  
      // Return categories with sorted products in the required format
      return categoriesWithProducts.map(category => ({
        heading: category.heading, // Assuming "heading" is the category title
        crackers: category.products || [] // Ensure it's an array even if no products
      }));
    } catch (error:any) {
      console.error('An error occurred during fetchCategoriesWithProducts:', error.message);
      return [];
    }
  }
  async checkCoupon(value:string) {
    try {
      const { data, error } = await this.supabase_client
        .from('coupon')
        .select('*')
        .eq('code', value)
        .eq('store_id',environment.supabase.store_id);
  
      if (error) {
        console.error('Error fetching data:', error);
        return null;
      }
  
      // Return the first matching row (or null if no match found)
      return data.length > 0 ? data[0] : null;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  }
}
