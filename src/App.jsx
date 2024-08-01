/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { Product } from './components/Product/Product';
import { Category } from './components/Category/Category';
import { User } from './components/User/User';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    item => item.id === product.categoryId,
  );
  const user = usersFromServer.find(item => item.id === category.ownerId);

  return {
    ...product,
    categoryTitle: category.title,
    categoryIcon: category.icon,
    userName: user.name,
    userSex: user.sex,
  };
});

export const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterByUser, setFilterByUser] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSearch = event => {
    setSearchValue(event.target.value);
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  const toggleCategory = categoryId => {
    setSelectedCategories(prevCategories => {
      return prevCategories.includes(categoryId)
        ? prevCategories.filter(id => id !== categoryId)
        : [...prevCategories, categoryId];
    });
  };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  const handleFilterByUser = user => {
    setFilterByUser(user);
  };

  const clearUserFilter = () => {
    setFilterByUser(null);
  };

  const handleSort = column => {
    if (sortColumn === column) {
      setSortDirection(prevDirection => {
        if (prevDirection === 'asc') return 'desc';
        if (prevDirection === 'desc') return null;
        return 'asc';
      });
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortColumn) {
      const sortBy = sortColumn;

      if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;

      return 0;
    }

    return 0;
  });

  const filteredProducts = sortedProducts.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.categoryId);
    const matchesUser = !filterByUser || product.userName === filterByUser.name;

    return matchesSearch && matchesCategory && matchesUser;
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({
                  'is-active': !filterByUser,
                })}
                onClick={clearUserFilter}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <User
                  key={user.id}
                  user={user}
                  isActive={filterByUser && filterByUser.id === user.id}
                  selectUser={() => handleFilterByUser(user)}
                />
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearch}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchValue.length > 0 && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={clearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button mr-6', {
                  'is-success': selectedCategories.length === 0,
                  'is-outlined': selectedCategories.length > 0,
                })}
                onClick={clearCategories}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <Category
                  key={category.id}
                  category={category}
                  isActive={selectedCategories.includes(category.id)}
                  handleClick={() => toggleCategory(category.id)}
                />
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  clearCategories();
                  clearUserFilter();
                  clearSearch();
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/" onClick={() => handleSort('id')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames('fas', {
                              'fa-sort': sortColumn !== 'id' || !sortDirection,
                              'fa-sort-up':
                                sortColumn === 'id' && sortDirection === 'asc',
                              'fa-sort-down':
                                sortColumn === 'id' && sortDirection === 'desc',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/" onClick={() => handleSort('name')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames('fas', {
                              'fa-sort':
                                sortColumn !== 'name' || !sortDirection,
                              'fa-sort-up':
                                sortColumn === 'name' &&
                                sortDirection === 'asc',
                              'fa-sort-down':
                                sortColumn === 'name' &&
                                sortDirection === 'desc',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/" onClick={() => handleSort('categoryTitle')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames('fas', {
                              'fa-sort':
                                sortColumn !== 'categoryTitle' ||
                                !sortDirection,
                              'fa-sort-up':
                                sortColumn === 'categoryTitle' &&
                                sortDirection === 'asc',
                              'fa-sort-down':
                                sortColumn === 'categoryTitle' &&
                                sortDirection === 'desc',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/" onClick={() => handleSort('userName')}>
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={classNames('fas', {
                              'fa-sort':
                                sortColumn !== 'userName' || !sortDirection,
                              'fa-sort-up':
                                sortColumn === 'userName' &&
                                sortDirection === 'asc',
                              'fa-sort-down':
                                sortColumn === 'userName' &&
                                sortDirection === 'desc',
                            })}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <Product key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
