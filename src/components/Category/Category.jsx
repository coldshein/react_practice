import classNames from 'classnames';

export const Category = ({ category, handleClick, isActive }) => {
  return (
    <a
      data-cy="Category"
      className={classNames('button mr-2 my-1', { 'is-info': isActive })}
      href="#/"
      onClick={handleClick}
    >
      {category.title}
    </a>
  );
};
