module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Blog;
};


