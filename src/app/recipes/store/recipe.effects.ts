import { HttpClient, HttpRequest } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import * as RecipeActions from '../store/recipe.actions';
import * as fromRecipe from '../store/recipe.reducers';


@Injectable()
export class RecipeEffects {

  url = 'https://ng-maximilian-udemy-app.firebaseio.com/ng-maximilian-udemy-app.json';

  @Effect()
  recipeFetch = this.actions$
    .ofType(RecipeActions.FETCH_RECIPES)
    .switchMap((action: RecipeActions.FetchRecipes) => {
      return this.httpClient.get<Recipe[]>(this.url, {
        observe: 'body',
        responseType: 'json'
      })
        .map((recipes: Recipe[]) => {
          return recipes.map((recipe) => {
            recipe.ingredients = recipe.ingredients || [];
            return recipe;
          });
        })
        .mergeMap((recipes: Recipe[]) => {
          return [
            {
              type: RecipeActions.SET_RECIPES,
              payload: recipes
            }
          ];
        });
    });

  @Effect({ dispatch: false })
  recipeStore = this.actions$
    .ofType(RecipeActions.STORE_RECIPES)
    .withLatestFrom(this.store.select('recipes'))
    .switchMap(([action, state]) => {
      const req = new HttpRequest('PUT', this.url, state.recipes, {
        reportProgress: true
      });
      return this.httpClient.request(req);
    });

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<fromRecipe.FeatureState>) {}
}
