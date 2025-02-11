import React, { useEffect, useState } from "react";
import styles from "./CategoryPage.module.scss";
import ProductCard from "../../components/ProductCard/index";
import { TiTick } from "react-icons/ti";
import BrandSidebar from "../../components/BrandsSidebar/index";
import FilterSidebar from "../../components/FilterSidebar/index";
import { useTranslation } from "react-i18next";
import {
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
  data,
} from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetAllCategoryProductsQuery,
} from "../../app/api/categories";
import {
  useGetCollectionByIdQuery,
  useGetCollectionProductsQuery,
} from "../../app/api/collectionsApi";

const CategoryPage = () => {
  const { t } = useTranslation();
  const { categoryId, collectionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchResults = location.state?.searchData?.data || [];
  const searchQuery = location.state?.searchQuery || null;
  const [searchParams] = useSearchParams();
  const { data: categoriesData } = useGetCategoriesQuery("tree");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubCategory, setIsSubCategory] = useState(false);

  useEffect(() => {
    if (categoriesData && categoryId) {
      const category = findCategoryById(
        categoriesData.data,
        parseInt(categoryId)
      );
      setSelectedCategory(category);

      const isSubCat = isSelectedCategoryASubCategory(
        categoriesData.data,
        parseInt(categoryId)
      );
      setIsSubCategory(isSubCat);
    }
  }, [categoriesData, categoryId]);

  const isSelectedCategoryASubCategory = (categories, targetId) => {
    for (const category of categories) {
      if (category.children) {
        for (const subCategory of category.children) {
          if (subCategory.id === targetId) {
            return true;
          }
        }
        const foundInNested = isSelectedCategoryASubCategory(
          category.children,
          targetId
        );
        if (foundInNested) return true;
      }
    }
    return false;
  };

  const findCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.id === id) return category;
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const {
    data: categoryProducts,
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoryProductsQuery(selectedCategory, {
    skip: !selectedCategory,
  });

  const {
    data: collectionData,
    error: collectionError,
    isLoading: collectionLoading,
  } = useGetCollectionByIdQuery(collectionId, {
    skip: !collectionId,
  });

  const {
    data: collectionProducts,
    error: collectionProductsError,
    isLoading: collectionProductsLoading,
  } = useGetCollectionProductsQuery(collectionId, {
    skip: !collectionId,
  });

  const isLoading =
    categoryLoading || collectionLoading || collectionProductsLoading;
  const error = categoryError || collectionError || collectionProductsError;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const products = searchQuery
    ? searchResults
    : categoryId
    ? categoryProducts || []
    : collectionProducts?.data || [];
  const totalItems = products.length || 0;

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    console.log("Toggling favorite:", product);
  };

  const handleSubCategorySelect = (subCategoryId) => {
    const subCategory = findCategoryById(categoriesData.data, subCategoryId);
    setSelectedCategory(subCategory);
    setIsSubCategory(true);
    navigate(`/category/${subCategoryId}`, {
      state: { category: subCategory },
    });
  };
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };
  const renderBreadcrumbs = () => {
    if (!isSubCategory) return null;

    const breadcrumbs = [];
    let currentCategory = selectedCategory;

    while (currentCategory) {
      breadcrumbs.unshift(currentCategory);
      currentCategory = findCategoryById(
        categoriesData.data,
        currentCategory.parent_id
      );
    }

    return (
      <div className={styles.breadcrumb}>
        {breadcrumbs.map((category, index) => (
          <React.Fragment key={category.id}>
            <span
              className={styles.breadcrumbItem}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </span>
            {index < breadcrumbs.length - 1 && (
              <span className={styles.separator}>/</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.categoryPage} style={{ flexDirection: "column" }}>
      {/* Breadcrumb */}
      {renderBreadcrumbs()}
      <h2>
        {searchQuery
          ? `${t("search.resultsFor")}: "${searchQuery}"`
          : categoryId
          ? selectedCategory
            ? selectedCategory.name
            : "Category"
          : collectionData
          ? collectionData?.data?.name
          : "Collection"}
      </h2>
      <p className={styles.sum}>
        {t("category.total")}: {totalItems} {t("category.items")}
      </p>
      <div className={styles.bars}>
        <button className={styles.sum}>
          <strong>{t("category.total")}:</strong> <br />
          {totalItems} {t("category.items")}
        </button>
        <BrandSidebar />
        <FilterSidebar />
      </div>
      {selectedCategory &&
        selectedCategory.children &&
        !searchQuery &&
        !isSubCategory && (
          <div className={styles.subCategories}>
            {selectedCategory.children.map((subCategory) => (
              <button
                key={subCategory.id}
                onClick={() => handleSubCategorySelect(subCategory.id)}
              >
                {subCategory.name}
              </button>
            ))}
          </div>
        )}
      <div className={styles.Container}>
        <aside className={styles.sidebar}>
          {!searchQuery &&
            selectedCategory &&
            selectedCategory.children &&
            !isSubCategory && (
              <div className={styles.filterSection}>
                <h3>{t("category.subCategories")}</h3>
                <ul>
                  {selectedCategory.children.map((subCategory) => (
                    <li
                      key={subCategory.id}
                      onClick={() => handleSubCategorySelect(subCategory.id)}
                    >
                      {subCategory.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <div className={styles.filterSection}>
            <h3>{t("category.composition")}</h3>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              {t("category.neverMind")}
            </label>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              {t("category.From_cheap_to_expensive")}
            </label>
            <label>
              <input type="radio" name="sort" />
              <span className={styles.customRadio}></span>
              {t("category.From_expensive_to_cheap")}
            </label>
          </div>
          <div className={styles.filterSection}>
            <h3>{t("navbar.brands")}</h3>
            <input type="text" placeholder="Gözleg" />
            <ul>
              <li>
                <label>
                  <input type="checkbox" />
                  <span className={styles.customCheckbox}>
                    <TiTick className={styles.checkIcon} />
                  </span>
                  Mahmood Rice
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span className={styles.customCheckbox}>
                    <TiTick className={styles.checkIcon} />
                  </span>
                  Mahmood Tea
                </label>
              </li>
            </ul>
          </div>
        </aside>

        <main className={styles.productsContainer}>
          <div className={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  showFavoriteButton={true}
                  showAddToCart={true}
                />
              ))
            ) : (
              <div>{t("search.noResults")}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
