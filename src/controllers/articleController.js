const prisma = require('../prismaClient'); // Ensure you have the correct path to your Prisma client

const getAllArticleController = async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    const filteredArticles = filterArticles(articles, req.query.filters); // Assuming filters are passed in query

    res.json(filteredArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', code: 10000 });
  }
};

const createNewArticleController = async (req, res) => {
  try {
    const { title, content, created_by, is_published } = req.body;

    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        created_by,
        is_published,
      },
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating article' });
  }
};

const getArticleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching article' });
  }
};

const updateArticleByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, created_by, is_published } = req.body;

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        content,
        created_by,
        is_published,
      },
    });

    res.json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating article' });
  }
};

const deleteArticleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting article' });
  }
};

const getArticleByPageController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const articles = await prisma.article.findMany({
      skip: (page - 1) * limit,
      take: parseInt(limit, 10),
    });

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching articles' });
  }
};

const getArticleByFilterSearch = async (req, res) => {
  try {
    const { filters } = req.query;

    const articles = await prisma.article.findMany();
    const filteredArticles = filterArticles(articles, filters);

    res.json(filteredArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching articles' });
  }
};

const filterArticles = (articles, filters) => {
  const { created_by, is_published, title, content } = filters;

  return articles.filter((article) => {
    let matches = true;
    if (created_by) {
      matches = matches && article.created_by === created_by;
    }
    if (is_published !== undefined) {
      matches = matches && article.is_published === (is_published === 'true');
    }
    if (title) {
      matches = matches && article.title.includes(title);
    }
    if (content) {
      matches = matches && article.content.includes(content);
    }
    return matches;
  });
};

module.exports = {
  getAllArticleController,
  createNewArticleController,
  getArticleByIdController,
  updateArticleByIdController,
  deleteArticleByIdController,
  getArticleByPageController,
  getArticleByFilterSearch,
};