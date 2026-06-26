const { Sequelize } = require("sequelize");
const defineRecipe = require("../../app/models/recipe.model.js");

let sequelize;
let Recipe;

describe("Recipe model", () => {
  beforeAll(async () => {
    sequelize = new Sequelize("sqlite::memory:", {
      logging: false,
    });
    Recipe = defineRecipe(sequelize, Sequelize);
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Recipe.destroy({ where: {} });
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  it("creates a recipe record successfully", async () => {
    const payload = {
      name: "Test Recipe",
      description: "A simple test recipe",
      servings: 2,
      time: 15,
      isPublished: true,
    };

    const recipe = await Recipe.create(payload);

    expect(recipe).toBeDefined();
    expect(recipe.name).toBe(payload.name);
    expect(recipe.description).toBe(payload.description);
    expect(recipe.servings).toBe(payload.servings);
    expect(recipe.time).toBe(payload.time);
    expect(recipe.isPublished).toBe(payload.isPublished);
  });

  it("rejects creation when a required field is missing", async () => {
    const payload = {
      description: "Missing name field",
      servings: 2,
      time: 15,
      isPublished: true,
    };

    await expect(Recipe.create(payload)).rejects.toThrow();
  });
});
