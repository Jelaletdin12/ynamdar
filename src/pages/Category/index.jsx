import React, { useEffect, useState, useMemo } from "react";
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
} from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetAllCategoryProductsQuery,
} from "../../app/api/categories";
import {
  useGetCollectionByIdQuery,
  useGetCollectionProductsQuery,
} from "../../app/api/collectionsApi";
import { useGetBrandProductsQuery } from "../../app/api/brandsApi";

const CategoryPage = () => {
  const { t } = useTranslation();
  const { categoryId, collectionId, brandId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Search related data
  const searchResults = location.state?.searchData?.data || [];
  const searchQuery = location.state?.searchQuery || null;
  
  // Get categories data
  const { data: categoriesData } = useGetCategoriesQuery("tree");
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // API queries with conditional skipping
  const {
    data: categoryProducts = [],
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoryProductsQuery(selectedCategory, {
    skip: !selectedCategory || !categoryId,
  });

  const {
    data: brandProducts = [],
    isLoading: brandProductsLoading,
    error: brandProductsError,
  } = useGetBrandProductsQuery(brandId, {
    skip: !brandId,
  });

  const {
    data: collectionData,
    error: collectionError,
    isLoading: collectionLoading,
  } = useGetCollectionByIdQuery(collectionId, {
    skip: !collectionId,
  });

  const {
    data: collectionProducts = { data: [] },
    error: collectionProductsError,
    isLoading: collectionProductsLoading,
  } = useGetCollectionProductsQuery(collectionId, {
    skip: !collectionId,
  });

  // Helper function to find category by ID
  const findCategoryById = (categories, id) => {
    if (!categories) return null;
    
    for (const category of categories) {
      if (category.id === id) return category;
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Determine if category is a subcategory
  const isSubCategory = useMemo(() => {
    if (!categoriesData?.data || !categoryId) return false;
    
    const checkIsSubCategory = (categories, targetId) => {
      for (const category of categories) {
        if (category.children) {
          for (const subCategory of category.children) {
            if (subCategory.id === targetId) {
              return true;
            }
          }
          const foundInNested = checkIsSubCategory(category.children, targetId);
          if (foundInNested) return true;
        }
      }
      return false;
    };
    
    return checkIsSubCategory(categoriesData.data, parseInt(categoryId));
  }, [categoriesData, categoryId]);

  // Update selected category when category data changes
  useEffect(() => {
    if (categoriesData?.data && categoryId) {
      const category = findCategoryById(
        categoriesData.data,
        parseInt(categoryId)
      );
      setSelectedCategory(category);
    }
  }, [categoriesData, categoryId]);

  // Loading and error states
  const isLoading = categoryLoading || collectionLoading || 
                    collectionProductsLoading || brandProductsLoading;
  
  const hasError = categoryError || collectionError || 
                   collectionProductsError || brandProductsError;

  // Determine which products to display
  const products = useMemo(() => {
    if (searchQuery) return searchResults;
    if (brandId) return brandProducts || [];
    if (categoryId) return categoryProducts || [];
    return collectionProducts?.data || [];
  }, [
    searchQuery, 
    searchResults, 
    brandId, 
    brandProducts, 
    categoryId, 
    categoryProducts, 
    collectionProducts
  ]);

  const totalItems = products.length || 0;

  // Event handlers
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    console.log("Toggling favorite:", product);
  };

  const handleSubCategorySelect = (subCategoryId) => {
    navigate(`/category/${subCategoryId}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  // Generate breadcrumbs for subcategories
  const renderBreadcrumbs = () => {
    if (!isSubCategory || !categoriesData?.data || !selectedCategory) return null;

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

  // Page title based on context
  const pageTitle = useMemo(() => {
    if (searchQuery) return `${t("search.resultsFor")}: "${searchQuery}"`;
    if (brandId) return "Brand Products"; // Could be improved by fetching brand name
    if (categoryId && selectedCategory) return selectedCategory.name;
    if (categoryId) return "Category";
    if (collectionData?.data?.name) return collectionData.data.name;
    return "Collection";
  }, [searchQuery, brandId, categoryId, selectedCategory, collectionData, t]);

  // Display subcategories section
  const renderSubCategories = () => {
    if (!selectedCategory?.children || searchQuery || isSubCategory) return null;
    
    return (
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
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error loading content</div>;

  return (
    <div className={styles.categoryPage} style={{ flexDirection: "column" }}>
      {renderBreadcrumbs()}
      <h2>{pageTitle}</h2>
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
      
      {renderSubCategories()}
      
      <div className={styles.Container}>
        <aside className={styles.sidebar}>
          {!searchQuery && selectedCategory?.children && !isSubCategory && (
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