import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SpoonacularIngredient } from '../models/recepie.model';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private http = inject(HttpClient);
  
  private readonly API_KEY = environment.spoonacularApiKey;
  private readonly BASE_URL = environment.spoonacularApiUrl;

  searchIngredients(query: string): Observable<string[]> {
    if (query.length < 2) return of([]);

    const params = new HttpParams()
      .set('apiKey', this.API_KEY)
      .set('query', query)
      .set('number', '3'); 

    return this.http.get<SpoonacularIngredient[]>(this.BASE_URL, { params }).pipe(
      map(results => results.map(item => item.name))
    );
  }
}