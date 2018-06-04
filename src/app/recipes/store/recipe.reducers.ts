import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducers';
import { Recipe } from '../recipe.model';
import { Ingredient } from '../../shared/ingredient.model';

export interface FeatureState extends fromApp.AppState {
  recipes: State;
}

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [
    new Recipe('Tacos',
      'This is simply a description',
      'https://images-gmi-pmc.edge-generalmills.com/e59f255c-7498-4b84-9c9d-e578bf5d88fc.jpg',
      [
        new Ingredient('Meat', 3),
        new Ingredient('French fries', 5)
      ]),
    new Recipe('Shawarma',
      'This is simply a description',
      'https://sifu.unileversolutions.com/image/en-SA/recipe-topvisual/2/1260-709/chicken-shawarma-50239021.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Honey', 1)
      ])
  ]
};

export function recipeReducer(state = initialState, action: RecipeActions.RecipeActions) {
  switch (action.type) {
    case (RecipeActions.SET_RECIPES):
      return {
        ...state,
        recipes: [...action.payload]
      };
    case (RecipeActions.ADD_RECIPE):
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case (RecipeActions.UPDATE_RECIPE):
      const recipe = state.recipes[action.payload.index];
      const updatedRecipe = {
        ...recipe,
        ...action.payload.updatedRecipe
      };
      const recipes = [...state.recipes];
      recipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: recipes
      };
    case (RecipeActions.DELETE_RECIPE):
      const oldRecipes = [...state.recipes];
      oldRecipes.splice(action.payload, 1);
      return {
        ...state,
        recipes: oldRecipes
      }
    default:
      return state;
  }
}
