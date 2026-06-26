process.env.SECRET_KEY = process.env.SECRET_KEY || "test-secret";

const mockRecipe = {
  create: vi.fn(),
};

vi.mock("../../app/models", () => ({
  recipe: mockRecipe,
  recipeStep: {},
  recipeIngredient: {},
  ingredient: {},
  Sequelize: { Op: {} },
}));

let recipeController;

beforeEach(() => {
  vi.resetAllMocks();
  delete require.cache[require.resolve("../../app/controllers/recipe.controller.js")];
  recipeController = require("../../app/controllers/recipe.controller.js");
});

const createMockResponse = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
};

describe("Recipe controller create", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 400 when name is missing", async () => {
    const req = { body: { description: "desc", servings: 2, time: 10, isPublished: true, userId: 1 } };
    const res = createMockResponse();

    await expect(recipeController.create(req, res)).rejects.toMatchObject({
      message: "Name cannot be empty for recipe!",
      statusCode: 400,
    });
  });

  it("creates a recipe and sends the created object", async () => {
    const payload = {
      name: "New Recipe",
      description: "Test description",
      servings: 4,
      time: 30,
      isPublished: false,
      userId: 1,
    };

    const savedRecipe = { id: 7, ...payload };
    const req = { body: payload };
    const res = createMockResponse();

    mockRecipe.create.mockResolvedValue(savedRecipe);

    await recipeController.create(req, res, mockRecipe);

    expect(mockRecipe.create).toHaveBeenCalledWith({
      name: payload.name,
      description: payload.description,
      servings: payload.servings,
      time: payload.time,
      isPublished: payload.isPublished,
      userId: payload.userId,
    });
    expect(res.send).toHaveBeenCalledWith(savedRecipe);
  });
});
